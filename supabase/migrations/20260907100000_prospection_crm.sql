-- =============================================================
-- EthiMarket — CRM de prospection (zone admin /admin/prospection)
--
-- Pilote l'exécution de docs/STRATEGIE_GO_TO_MARKET.md :
--  • prospects : acheteurs ET producteurs cibles, rattachés à une
--    phase (1/2/3) et un segment, avec pipeline de statuts,
--    prochaine action datée et journal de contacts.
--  • get_prospection_stats() : agrégats pour l'entête de la page.
--
-- RLS : admin uniquement (données de conquête = données internes).
-- Les cibles semées (P4) proviennent de sources publiques
-- (annuaires professionnels) — à qualifier avant contact.
-- =============================================================

CREATE TABLE IF NOT EXISTS prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('buyer', 'producer')),
  phase integer NOT NULL DEFAULT 1 CHECK (phase IN (1, 2, 3)),
  -- Segment (voir stratégie) : epicerie_bio, torrefacteur, restaurant,
  -- epicerie_en_ligne, biocoop, grossiste, chocolatier, cosmetique,
  -- centrale, food_service, industriel / cafe, vanille, argane, cacao,
  -- epices, miel, quinoa, karite...
  segment text NOT NULL,
  name text NOT NULL,
  city text,
  country text NOT NULL DEFAULT 'France',
  contact_name text,
  email text,
  phone text,
  website text,
  -- D'où vient la cible (annuaire Agence Bio, site, salon, reco…)
  source text,
  status text NOT NULL DEFAULT 'a_contacter' CHECK (status IN (
    'a_contacter',      -- dans la liste, jamais contacté
    'contacte',         -- e-mail J0 / appel passé
    'relance',          -- J+4 ou J+10 envoyé
    'en_discussion',    -- a répondu, échange en cours
    'inscrit',          -- compte créé sur la plateforme
    'actif',            -- 1re commande (acheteur) / vérifié+produits (producteur)
    'refus',            -- non ferme (motif en notes)
    'stop'              -- a demandé de ne plus être contacté (RGPD, définitif)
  )),
  next_action text,
  next_action_date date,
  notes text,
  contacted_at timestamptz,
  replied_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prospects_pipeline ON prospects(kind, phase, status);
CREATE INDEX IF NOT EXISTS idx_prospects_next ON prospects(next_action_date) WHERE status NOT IN ('refus', 'stop', 'actif');

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "prospects_admin_all" ON prospects;
CREATE POLICY "prospects_admin_all" ON prospects FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

CREATE OR REPLACE FUNCTION touch_prospects()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  -- Horodatages automatiques aux transitions clés
  IF NEW.status = 'contacte' AND OLD.status = 'a_contacter' THEN NEW.contacted_at := coalesce(NEW.contacted_at, now()); END IF;
  IF NEW.status = 'en_discussion' AND OLD.status IN ('contacte', 'relance') THEN NEW.replied_at := coalesce(NEW.replied_at, now()); END IF;
  IF NEW.status IN ('inscrit', 'actif') AND OLD.status NOT IN ('inscrit', 'actif') THEN NEW.converted_at := coalesce(NEW.converted_at, now()); END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_touch_prospects ON prospects;
CREATE TRIGGER trg_touch_prospects BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION touch_prospects();

-- Journal des interactions (immuable : on n'efface pas l'historique de conquête)
CREATE TABLE IF NOT EXISTS prospect_touches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  channel text NOT NULL CHECK (channel IN ('email', 'appel', 'visite', 'salon', 'linkedin', 'autre')),
  note text NOT NULL CHECK (length(trim(note)) >= 3),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_touches_prospect ON prospect_touches(prospect_id, created_at DESC);
ALTER TABLE prospect_touches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "touches_admin_select" ON prospect_touches;
CREATE POLICY "touches_admin_select" ON prospect_touches FOR SELECT TO authenticated USING (is_admin_user());
DROP POLICY IF EXISTS "touches_admin_insert" ON prospect_touches;
CREATE POLICY "touches_admin_insert" ON prospect_touches FOR INSERT TO authenticated WITH CHECK (is_admin_user());
-- pas d'UPDATE/DELETE : journal immuable

-- Agrégats pour l'entête de la page
CREATE OR REPLACE FUNCTION get_prospection_stats()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT is_admin_user() THEN RAISE EXCEPTION 'ADMIN_ONLY'; END IF;
  RETURN jsonb_build_object(
    'by_phase', (
      SELECT coalesce(jsonb_object_agg(p.phase, p.counts), '{}'::jsonb) FROM (
        SELECT phase, jsonb_build_object(
          'total', count(*),
          'a_contacter', count(*) FILTER (WHERE status = 'a_contacter'),
          'en_cours', count(*) FILTER (WHERE status IN ('contacte', 'relance', 'en_discussion')),
          'convertis', count(*) FILTER (WHERE status IN ('inscrit', 'actif'))
        ) AS counts
        FROM prospects GROUP BY phase
      ) p
    ),
    'due_today', (
      SELECT count(*) FROM prospects
      WHERE next_action_date <= current_date AND status NOT IN ('refus', 'stop', 'actif')
    ),
    'reply_rate_pct', (
      SELECT CASE WHEN count(*) FILTER (WHERE contacted_at IS NOT NULL) = 0 THEN 0
        ELSE round(100.0 * count(*) FILTER (WHERE replied_at IS NOT NULL)
             / count(*) FILTER (WHERE contacted_at IS NOT NULL), 1) END
      FROM prospects
    ),
    'generated_at', now()
  );
END; $$;
REVOKE ALL ON FUNCTION get_prospection_stats() FROM public, anon;
GRANT EXECUTE ON FUNCTION get_prospection_stats() TO authenticated;
