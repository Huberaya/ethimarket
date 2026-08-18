-- =============================================================
-- EthiMarket — Boucle de dégradation des incidents qualité
-- (clôture de la couche 3 du Product Trust Pipeline)
--
-- Un incident qualité (litige ou réception non conforme) peut être :
--   • résolu SANS conséquence (faux positif, malentendu, geste
--     commercial…) → simple UPDATE via la policy admin existante ;
--   • CONFIRMÉ par l'admin → la fonction ci-dessous marque
--     l'incident résolu ET dépose une preuve 'fail' immuable sur
--     le critère « ethicalEngagementSatisfactory » du producteur.
--     La mécanique existante (checklistFromEvidences / trustLevel)
--     fait alors redescendre le niveau de confiance jusqu'à
--     contre-preuve 'pass' — exactement le pattern de
--     degrade_expired_certifications().
--
-- Idempotence : reference = 'incident:<uuid>' — une même
-- confirmation ne peut pas dégrader deux fois.
-- Zéro coût : moteur SQL local, aucune API externe.
-- =============================================================

CREATE OR REPLACE FUNCTION confirm_product_incident(p_incident uuid, p_note text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_admin uuid := auth.uid();
  v_is_admin boolean := false;
  r RECORD;
  v_evidence_id uuid;
BEGIN
  -- Garde : réservé aux administrateurs authentifiés
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'NOT_AUTHENTICATED';
  END IF;
  SELECT p.is_admin INTO v_is_admin FROM profiles p WHERE p.id = v_admin;
  IF NOT coalesce(v_is_admin, false) THEN
    RAISE EXCEPTION 'ADMIN_ONLY';
  END IF;

  -- La note de l'admin est obligatoire (même exigence que toute preuve : ≥ 10 caractères)
  IF p_note IS NULL OR length(trim(p_note)) < 10 THEN
    RAISE EXCEPTION 'NOTE_TOO_SHORT';
  END IF;

  SELECT * INTO r FROM product_incidents WHERE id = p_incident;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'INCIDENT_NOT_FOUND';
  END IF;
  IF r.status = 'resolved' THEN
    RAISE EXCEPTION 'INCIDENT_ALREADY_RESOLVED';
  END IF;

  -- Preuve 'fail' immuable — une seule dégradation par incident
  IF r.producer_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM verification_evidences e
    WHERE e.producer_id = r.producer_id
      AND e.reference = 'incident:' || r.id::text
  ) THEN
    INSERT INTO verification_evidences
      (producer_id, criterion, evidence_type, reference, note, outcome, checked_by)
    VALUES (
      r.producer_id, 'ethicalEngagementSatisfactory', 'other',
      'incident:' || r.id::text,
      'Incident qualité confirmé par l''équipe (' ||
        CASE r.source WHEN 'dispute' THEN 'litige acheteur'
                      WHEN 'reception' THEN 'réception non conforme'
                      ELSE 'signalement interne' END
        || ') — ' || trim(p_note)
        || ' | Constat d''origine : ' || coalesce(r.note, '—')
        || '. Réhabilitation possible par contre-preuve après action corrective.',
      'fail', v_admin
    )
    RETURNING id INTO v_evidence_id;
  END IF;

  UPDATE product_incidents
  SET status = 'resolved', resolved_at = now(), resolved_by = v_admin,
      note = coalesce(note, '') || E'\n[Confirmé] ' || trim(p_note)
  WHERE id = p_incident;

  RETURN jsonb_build_object(
    'incident_id', p_incident,
    'evidence_id', v_evidence_id,
    'degraded', v_evidence_id IS NOT NULL
  );
END;
$$;

REVOKE ALL ON FUNCTION confirm_product_incident(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION confirm_product_incident(uuid, text) TO authenticated;
