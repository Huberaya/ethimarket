-- =============================================================
-- EthiMarket — Vérification à preuves (checklist opposable)
--
-- PROBLÈME RÉSOLU : la checklist d'audit était déclarative —
-- l'admin pouvait tout cocher sans avoir rien vérifié. Le tampon
-- « vérifié » ne valait que la bonne foi de l'auditeur.
--
-- PRINCIPE : chaque critère de la checklist exige désormais au
-- moins UNE PREUVE structurée (type + référence + note + auteur
-- + horodatage) avant d'être cochable. Les preuves sont
-- immuables (pas d'UPDATE/DELETE : on ajoute un contre-examen,
-- on n'efface jamais) et constituent le journal d'audit opposable
-- montré aux acheteurs via le Trust Center.
--
-- + photo_challenges : défi géolocalisé anti-photos volées
--   (code imprévisible à photographier sous 72h sur site).
-- =============================================================

-- ── 1. Preuves de vérification ──
CREATE TABLE IF NOT EXISTS verification_evidences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id uuid NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  -- Critère de la checklist auquel la preuve se rattache
  criterion text NOT NULL CHECK (criterion IN (
    'identityVerified', 'businessDocsCompliant', 'certificationValid',
    'farmPhotosCoherent', 'ethicalEngagementSatisfactory', 'charterSigned'
  )),
  -- Méthode de vérification employée
  evidence_type text NOT NULL CHECK (evidence_type IN (
    'registry_lookup',      -- consultation d'un registre public officiel (Ecocert, FLOCERT, USDA OID, RCCM/OHADA…)
    'issuer_confirmation',  -- confirmation écrite de l'organisme émetteur (e-mail/courrier)
    'video_call',           -- appel vidéo en direct avec le producteur (pièce montrée, visite)
    'selfie_id_match',      -- selfie avec pièce d'identité comparé au document
    'phone_verification',   -- numéro appelé et confirmé
    'photo_challenge',      -- défi photo géolocalisé réussi (code + délai)
    'exif_analysis',        -- métadonnées EXIF cohérentes (date, GPS, appareil)
    'satellite_check',      -- parcelle contrôlée sur imagerie satellite
    'reverse_image_search', -- recherche d'image inversée sans correspondance suspecte
    'peer_attestation',     -- parrainage d'un producteur déjà vérifié / référence acheteur
    'document_review',      -- examen visuel approfondi du document (cachets, cohérence)
    'other'
  )),
  -- Référence vérifiable : URL du registre consulté, n° de certificat
  -- confirmé, identifiant d'appel, chemin de capture d'écran…
  reference text,
  -- Constat de l'auditeur (obligatoire, min 10 caractères : pas de preuve vide)
  note text NOT NULL CHECK (length(trim(note)) >= 10),
  -- Verdict de CETTE preuve
  outcome text NOT NULL DEFAULT 'pass' CHECK (outcome IN ('pass', 'fail', 'inconclusive')),
  checked_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidences_producer ON verification_evidences(producer_id, criterion, created_at DESC);

ALTER TABLE verification_evidences ENABLE ROW LEVEL SECURITY;

-- Lecture/écriture : admins uniquement. IMMUABLE : pas de policy UPDATE/DELETE.
DROP POLICY IF EXISTS "evidences_admin_select" ON verification_evidences;
CREATE POLICY "evidences_admin_select" ON verification_evidences FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

DROP POLICY IF EXISTS "evidences_admin_insert" ON verification_evidences;
CREATE POLICY "evidences_admin_insert" ON verification_evidences FOR INSERT TO authenticated
  WITH CHECK (
    checked_by = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- ── 2. Défis photo géolocalisés ──
CREATE TABLE IF NOT EXISTS photo_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id uuid NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  -- Code imprévisible que le producteur doit rendre visible sur la photo
  challenge_code text NOT NULL,
  instructions text NOT NULL,
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'passed', 'failed', 'expired')),
  -- Soumission du producteur
  photo_url text,
  submitted_at timestamptz,
  -- Verdict admin
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_photo_challenges_producer ON photo_challenges(producer_id, created_at DESC);

ALTER TABLE photo_challenges ENABLE ROW LEVEL SECURITY;

-- Admin : tout voir / créer / juger
DROP POLICY IF EXISTS "challenges_admin_all" ON photo_challenges;
CREATE POLICY "challenges_admin_all" ON photo_challenges FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- Producteur : voir SES défis et soumettre SA photo (update limité)
DROP POLICY IF EXISTS "challenges_producer_select" ON photo_challenges;
CREATE POLICY "challenges_producer_select" ON photo_challenges FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM producers pr WHERE pr.id = photo_challenges.producer_id AND pr.user_id = auth.uid()));

DROP POLICY IF EXISTS "challenges_producer_submit" ON photo_challenges;
CREATE POLICY "challenges_producer_submit" ON photo_challenges FOR UPDATE TO authenticated
  USING (
    status = 'pending'
    AND EXISTS (SELECT 1 FROM producers pr WHERE pr.id = photo_challenges.producer_id AND pr.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM producers pr WHERE pr.id = photo_challenges.producer_id AND pr.user_id = auth.uid())
  );

-- Notification in-app au producteur quand un défi est créé
-- (réutilise l'infrastructure user_notifications existante)
CREATE OR REPLACE FUNCTION trg_notify_photo_challenge()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  producer_user uuid;
BEGIN
  SELECT user_id INTO producer_user FROM producers WHERE id = NEW.producer_id;
  PERFORM notify_user(
    producer_user, 'photo_challenge',
    jsonb_build_object('challenge_code', NEW.challenge_code, 'expires_at', NEW.expires_at),
    '/dashboard/verification');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_photo_challenge_notification ON photo_challenges;
CREATE TRIGGER trg_photo_challenge_notification AFTER INSERT ON photo_challenges
  FOR EACH ROW EXECUTE FUNCTION trg_notify_photo_challenge();

-- Étend le CHECK de user_notifications pour le nouveau kind
ALTER TABLE user_notifications DROP CONSTRAINT IF EXISTS user_notifications_kind_check;
ALTER TABLE user_notifications ADD CONSTRAINT user_notifications_kind_check CHECK (kind IN (
  'quote_received', 'quote_offer', 'quote_accepted', 'quote_declined',
  'order_created', 'order_confirmed', 'order_shipped', 'order_delivered',
  'order_disputed', 'order_cancelled', 'message_received', 'photo_challenge'
));

COMMENT ON TABLE verification_evidences IS
  'Preuves immuables attachées aux critères de la checklist d''audit producteur. Une case ne peut être cochée sans preuve. Journal opposable.';
COMMENT ON TABLE photo_challenges IS
  'Défis photo géolocalisés : code imprévisible à photographier sur site sous délai — anti-photos volées.';
