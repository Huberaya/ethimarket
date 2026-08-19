-- =============================================================
-- EthiMarket — Phase 3 du Product Trust Pipeline
--
--  A. Veille RASFF automatisée : la base interroge chaque nuit
--     l'API PUBLIQUE du portail RASFF (pg_net), filtre les
--     notifications sur NOS couples produit × origine et alerte
--     les admins via la cloche existante (admin_notifications).
--  B. Traçabilité publique par lot : get_lot_trace(order_id)
--     expose une vue ANONYMISÉE du parcours du lot (producteur,
--     origine, documents fournis, analyses vérifiées, réception)
--     pour la page publique /trace/:orderId (QR code).
--  C. Score qualité dynamique : get_producer_quality_history()
--     agrège l'historique RÉEL (réceptions, incidents, analyses) ;
--     le calcul du score est fait côté client (rasffWatch.ts,
--     fonction pure testée) à partir de ces compteurs.
--
-- Zéro coût : API RASFF publique, pg_net + pg_cron déjà actifs.
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- A.1 Journal des alertes RASFF retenues (dédoublonnage + audit)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rasff_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,          -- ex. 2026.7289 (clé de dédoublonnage)
  subject text NOT NULL,
  origin_country_fr text NOT NULL,         -- pays FR matché avec nos filières
  matched_keyword text NOT NULL,           -- mot-clé produit qui a matché
  classification text,                     -- alert / border rejection / information...
  risk text,                               -- serious / potentially serious...
  validation_date text,
  raw jsonb NOT NULL DEFAULT '{}'::jsonb,  -- notification complète (audit)
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rasff_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rasff_admin_read" ON rasff_alerts;
CREATE POLICY "rasff_admin_read" ON rasff_alerts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Suivi des requêtes pg_net en attente de réponse (traitées au run suivant)
CREATE TABLE IF NOT EXISTS rasff_poll_log (
  id bigserial PRIMARY KEY,
  net_request_id bigint NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE rasff_poll_log ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- A.2 Mots-clés produit (miroir SQL de PRODUCT_KEYWORDS_EN)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION rasff_product_keywords(p_type text)
RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN p_type ILIKE '%café%' OR p_type ILIKE '%cafe%' THEN ARRAY['coffee']
    WHEN p_type ILIKE '%cacao%' THEN ARRAY['cocoa','chocolate']
    WHEN p_type ILIKE '%thé%' OR p_type ILIKE '%the%' THEN ARRAY['tea']
    WHEN p_type ILIKE '%miel%' THEN ARRAY['honey']
    WHEN p_type ILIKE '%sésame%' OR p_type ILIKE '%sesame%' THEN ARRAY['sesame']
    WHEN p_type ILIKE '%vanille%' THEN ARRAY['vanilla']
    WHEN p_type ILIKE '%cumin%' THEN ARRAY['cumin']
    WHEN p_type ILIKE '%curcuma%' THEN ARRAY['turmeric','curcuma']
    WHEN p_type ILIKE '%safran%' THEN ARRAY['saffron']
    WHEN p_type ILIKE '%gingembre%' THEN ARRAY['ginger']
    WHEN p_type ILIKE '%épice%' OR p_type ILIKE '%epice%' THEN
      ARRAY['spice','pepper','chilli','chili','capsicum','turmeric','cumin','cinnamon','nutmeg','saffron','paprika','curry','ginger','cardamom','coriander','fenugreek','oregano']
    WHEN p_type ILIKE '%huile%' THEN ARRAY['oil','argan']
    WHEN p_type ILIKE '%arachide%' THEN ARRAY['peanut','groundnut']
    WHEN p_type ILIKE '%riz%' THEN ARRAY['rice']
    WHEN p_type ILIKE '%quinoa%' THEN ARRAY['quinoa']
    WHEN p_type ILIKE '%spiruline%' THEN ARRAY['spirulina']
    WHEN p_type ILIKE '%sirop%' THEN ARRAY['syrup','agave']
    WHEN p_type ILIKE '%graine%' THEN ARRAY['seed','sesame']
    WHEN p_type ILIKE '%noix%' THEN ARRAY['nut','cashew','walnut']
    WHEN p_type ILIKE '%karité%' OR p_type ILIKE '%karite%' THEN ARRAY['shea']
    WHEN p_type ILIKE '%coton%' THEN ARRAY['cotton']
    ELSE ARRAY[]::text[]
  END;
$$;

-- Pays EN (RASFF) → FR (nos données)
CREATE OR REPLACE FUNCTION rasff_country_fr(p_en text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE p_en
    WHEN 'Ethiopia' THEN 'Éthiopie' WHEN 'France' THEN 'France'
    WHEN 'Ghana' THEN 'Ghana' WHEN 'Greece' THEN 'Grèce'
    WHEN 'India' THEN 'Inde' WHEN 'Iran' THEN 'Iran'
    WHEN 'Japan' THEN 'Japon' WHEN 'Madagascar' THEN 'Madagascar'
    WHEN 'Morocco' THEN 'Maroc' WHEN 'Mexico' THEN 'Mexique'
    WHEN 'Peru' THEN 'Pérou' WHEN 'Sri Lanka' THEN 'Sri Lanka'
    WHEN 'Turkey' THEN 'Turquie' WHEN 'Türkiye' THEN 'Turquie'
    WHEN 'Egypt' THEN 'Égypte' WHEN 'Kenya' THEN 'Kenya'
    WHEN 'Pakistan' THEN 'Pakistan' WHEN 'Brazil' THEN 'Brésil'
    WHEN 'Colombia' THEN 'Colombie' WHEN 'Indonesia' THEN 'Indonésie'
    WHEN 'Vietnam' THEN 'Vietnam' WHEN 'Thailand' THEN 'Thaïlande'
    WHEN 'China' THEN 'Chine' WHEN 'Tunisia' THEN 'Tunisie'
    WHEN 'Ivory Coast' THEN 'Côte d''Ivoire'
    WHEN 'Burkina Faso' THEN 'Burkina Faso' WHEN 'Rwanda' THEN 'Rwanda'
    WHEN 'Georgia' THEN 'Géorgie' WHEN 'Argentina' THEN 'Argentine'
    WHEN 'Chile' THEN 'Chili' WHEN 'Ecuador' THEN 'Équateur'
    ELSE NULL
  END;
$$;

-- ─────────────────────────────────────────────────────────────
-- A.3 Étape 1 du cron : lancer la requête RASFF (asynchrone)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION rasff_poll_request()
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  req_id bigint;
BEGIN
  -- Cron (auth.uid() NULL) ou admin uniquement
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ) THEN
    RAISE EXCEPTION 'ADMIN_ONLY';
  END IF;
  SELECT net.http_post(
    url := 'https://webgate.ec.europa.eu/rasff-window/backend/public/notification/search/consolidated/?',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"parameters":{"pageNumber":1,"itemsPerPage":100},"criteria":{}}'::jsonb,
    timeout_milliseconds := 30000
  ) INTO req_id;
  INSERT INTO rasff_poll_log (net_request_id) VALUES (req_id);
  RETURN req_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- A.4 Étape 2 du cron : dépouiller les réponses reçues
--     (pg_net est asynchrone : on traite au passage suivant)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION rasff_process_responses()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r RECORD;
  notif jsonb;
  v_body jsonb;
  v_matched integer := 0;
  v_subject text;
  v_country_fr text;
  v_keyword text;
  v_reference text;
  our RECORD;
  kw text;
BEGIN
  -- Cron (auth.uid() NULL) ou admin uniquement
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true
  ) THEN
    RAISE EXCEPTION 'ADMIN_ONLY';
  END IF;
  FOR r IN
    SELECT l.id AS log_id, resp.content
    FROM rasff_poll_log l
    JOIN net._http_response resp ON resp.id = l.net_request_id
    WHERE l.processed = false AND resp.status_code = 200
  LOOP
    v_body := r.content::jsonb;
    FOR notif IN SELECT * FROM jsonb_array_elements(coalesce(v_body->'notifications', '[]'::jsonb))
    LOOP
      v_reference := notif->>'reference';
      v_subject := lower(coalesce(notif->>'subject', ''));
      CONTINUE WHEN v_reference IS NULL
        OR EXISTS (SELECT 1 FROM rasff_alerts a WHERE a.reference = v_reference);

      -- nos filières actives : couples produit × pays distincts
      v_country_fr := NULL; v_keyword := NULL;
      FOR our IN
        SELECT DISTINCT p.product_type, p.country
        FROM products p
        WHERE p.status = 'active' AND p.product_type IS NOT NULL AND p.country IS NOT NULL
      LOOP
        -- le pays de la notification correspond-il ?
        IF EXISTS (
          SELECT 1 FROM jsonb_array_elements(coalesce(notif->'originCountries', '[]'::jsonb)) oc
          WHERE rasff_country_fr(oc->>'organizationName') = our.country
        ) THEN
          FOREACH kw IN ARRAY rasff_product_keywords(our.product_type)
          LOOP
            IF position(kw IN v_subject) > 0 THEN
              v_country_fr := our.country; v_keyword := kw;
              EXIT;
            END IF;
          END LOOP;
        END IF;
        EXIT WHEN v_country_fr IS NOT NULL;
      END LOOP;

      IF v_country_fr IS NOT NULL THEN
        INSERT INTO rasff_alerts (reference, subject, origin_country_fr, matched_keyword, classification, risk, validation_date, raw)
        VALUES (
          v_reference, coalesce(notif->>'subject', ''), v_country_fr, v_keyword,
          notif#>>'{notificationClassification,description}',
          notif#>>'{riskDecision,description}',
          notif->>'ecValidationDate', notif
        ) ON CONFLICT (reference) DO NOTHING;

        INSERT INTO admin_notifications (type, title, message, data)
        VALUES (
          'fraud',
          '🚨 Alerte RASFF — ' || v_country_fr,
          'Notification européenne ' || v_reference || ' : ' || coalesce(notif->>'subject', '')
            || '. Filière concernée sur EthiMarket (' || v_keyword || ' × ' || v_country_fr
            || '). Vérifier les producteurs de cette filière.',
          jsonb_build_object('rasff_reference', v_reference, 'country', v_country_fr, 'keyword', v_keyword)
        );
        v_matched := v_matched + 1;
      END IF;
    END LOOP;
    UPDATE rasff_poll_log SET processed = true WHERE id = r.log_id;
  END LOOP;
  RETURN v_matched;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- A.5 Orchestration quotidienne (dans le cron trust existant)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trust_daily_review()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  claims_count integer;
  degraded_count integer;
  rasff_matched integer;
BEGIN
  claims_count := evaluate_due_claims();
  degraded_count := degrade_expired_certifications();
  -- RASFF : dépouiller les réponses d'hier PUIS lancer la requête du jour
  rasff_matched := rasff_process_responses();
  PERFORM rasff_poll_request();
  RETURN jsonb_build_object(
    'claims_evaluated', claims_count,
    'certs_degraded', degraded_count,
    'rasff_matched', rasff_matched
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- B. Traçabilité publique par lot (QR code → /trace/:orderId)
--    Anonymisée : jamais d'acheteur, de prix ni de références
--    internes — uniquement le parcours vérifiable du lot.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_lot_trace(p_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  o RECORD;
  result jsonb;
BEGIN
  SELECT ord.id, ord.order_number, ord.status, ord.product_name,
         ord.quantity, ord.unit, ord.confirmed_at, ord.shipped_at, ord.delivered_at,
         pr.name AS producer_name, pr.slug AS producer_slug,
         pr.country AS producer_country, pr.country_flag,
         p.product_type
  INTO o
  FROM orders ord
  LEFT JOIN producers pr ON pr.id = ord.producer_id
  LEFT JOIN products p ON p.id = ord.product_id
  WHERE ord.id = p_order_id
    AND ord.status IN ('shipped', 'delivered');  -- lot réellement parti uniquement
  IF NOT FOUND THEN RETURN NULL; END IF;

  result := jsonb_build_object(
    'order_number', o.order_number,
    'status', o.status,
    'product_name', o.product_name,
    'product_type', o.product_type,
    'quantity', o.quantity,
    'unit', o.unit,
    'producer', jsonb_build_object(
      'name', o.producer_name, 'slug', o.producer_slug,
      'country', o.producer_country, 'country_flag', o.country_flag
    ),
    'milestones', jsonb_build_object(
      'confirmed_at', o.confirmed_at, 'shipped_at', o.shipped_at, 'delivered_at', o.delivered_at
    ),
    -- documents du lot : clé + fourni/pas fourni (jamais les numéros/fichiers)
    'documents', coalesce((
      SELECT jsonb_agg(jsonb_build_object('key', d.requirement_key, 'provided', d.status = 'provided') ORDER BY d.requirement_key)
      FROM order_lot_documents d WHERE d.order_id = o.id AND d.required = true
    ), '[]'::jsonb),
    -- analyses : libellé + statut (jamais le rapport ni le labo en détail)
    'analyses', coalesce((
      SELECT jsonb_agg(jsonb_build_object('label', a.analysis_label, 'status', a.status) ORDER BY a.created_at)
      FROM lot_analyses a WHERE a.order_id = o.id
    ), '[]'::jsonb),
    -- réception : conforme ou non (jamais le commentaire)
    'reception', (
      SELECT jsonb_build_object(
        'recorded', true,
        'clean', (r.quantity_ok AND r.packaging_ok AND r.aspect_ok AND r.labeling_ok)
      ) FROM order_receptions r WHERE r.order_id = o.id
    ),
    'generated_at', now()
  );
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_lot_trace(uuid) TO anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- C. Historique qualité agrégé (compteurs réels, score côté client)
--    Public : nourrit le badge boutique — données déjà anonymes.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_producer_quality_history(p_producer_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'receptions_total', (
      SELECT count(*) FROM order_receptions r
      JOIN orders o ON o.id = r.order_id WHERE o.producer_id = p_producer_id
    ),
    'receptions_clean', (
      SELECT count(*) FROM order_receptions r
      JOIN orders o ON o.id = r.order_id
      WHERE o.producer_id = p_producer_id
        AND r.quantity_ok AND r.packaging_ok AND r.aspect_ok AND r.labeling_ok
    ),
    'incidents_confirmed', (
      SELECT count(*) FROM product_incidents i
      WHERE i.producer_id = p_producer_id AND i.status = 'resolved'
        AND EXISTS (
          SELECT 1 FROM verification_evidences e
          WHERE e.reference = 'incident:' || i.id::text
        )
    ),
    'incidents_dismissed', (
      SELECT count(*) FROM product_incidents i
      WHERE i.producer_id = p_producer_id AND i.status = 'resolved'
        AND NOT EXISTS (
          SELECT 1 FROM verification_evidences e
          WHERE e.reference = 'incident:' || i.id::text
        )
    ),
    'analyses_verified', (
      SELECT count(*) FROM lot_analyses a
      WHERE a.producer_id = p_producer_id AND a.status = 'verified'
    ),
    'analyses_rejected', (
      SELECT count(*) FROM lot_analyses a
      WHERE a.producer_id = p_producer_id AND a.status = 'rejected'
    )
  );
$$;

GRANT EXECUTE ON FUNCTION get_producer_quality_history(uuid) TO anon, authenticated;

-- Fonctions RASFF : appelables par les authentifiés (garde admin interne) et le cron
REVOKE ALL ON FUNCTION rasff_poll_request() FROM public, anon;
GRANT EXECUTE ON FUNCTION rasff_poll_request() TO authenticated;
REVOKE ALL ON FUNCTION rasff_process_responses() FROM public, anon;
GRANT EXECUTE ON FUNCTION rasff_process_responses() TO authenticated;
