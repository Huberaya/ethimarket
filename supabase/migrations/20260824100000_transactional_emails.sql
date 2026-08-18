-- =============================================================
-- EthiMarket — E-mails transactionnels (Resend via pg_net)
--
-- Chaque notification in-app (user_notifications) déclenche aussi
-- un e-mail, envoyé PAR LA BASE via l'extension pg_net : aucun
-- serveur à déployer, la clé API reste dans Supabase Vault
-- (chiffrée), jamais exposée au navigateur.
--
-- i18n : les gabarits sont stockés par (kind, locale) dans
-- email_texts — mêmes libellés que la cloche 🔔. La langue du
-- destinataire vient de profiles.preferred_locale (renseignée par
-- le sélecteur de langue du site).
--
-- Observabilité : chaque envoi est journalisé dans email_log
-- (request_id pg_net, statut, erreur éventuelle).
-- =============================================================

-- ── 0. Extension HTTP asynchrone ──
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ── 1. Langue préférée de l'utilisateur ──
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS preferred_locale text NOT NULL DEFAULT 'fr'
  CHECK (preferred_locale IN ('fr', 'en', 'es', 'pt', 'ar'));

-- ── 2. Gabarits de libellés par langue (seed séparé) ──
CREATE TABLE IF NOT EXISTS email_texts (
  kind text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('fr', 'en', 'es', 'pt', 'ar')),
  body text NOT NULL,           -- template avec {product} {counterpart} {orderNumber} {quantity} {unit} {preview}
  PRIMARY KEY (kind, locale)
);
ALTER TABLE email_texts ENABLE ROW LEVEL SECURITY;
-- lecture publique inutile : consommée uniquement par les fonctions SECURITY DEFINER.

-- ── 3. Journal des envois ──
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES user_notifications(id) ON DELETE SET NULL,
  recipient text NOT NULL,
  locale text,
  kind text,
  subject text,
  status text NOT NULL DEFAULT 'queued',   -- queued | skipped_no_key | skipped_no_template | error
  net_request_id bigint,                   -- id pg_net pour retrouver la réponse HTTP
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_log_created ON email_log(created_at DESC);
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "email_log_admin_read" ON email_log;
CREATE POLICY "email_log_admin_read" ON email_log FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- ── 4. Interpolation {var} depuis le payload jsonb ──
CREATE OR REPLACE FUNCTION render_email_template(tpl text, payload jsonb)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT replace(replace(replace(replace(replace(replace(replace(tpl,
    '{product}',     coalesce(payload->>'product_name', '')),
    '{counterpart}', coalesce(payload->>'counterpart_name', '—')),
    '{orderNumber}', coalesce(payload->>'order_number', '')),
    '{quantity}',    coalesce(payload->>'quantity', '')),
    '{unit}',        coalesce(payload->>'unit', '')),
    '{preview}',     coalesce(payload->>'preview', '')),
    '{challenge_code}', coalesce(payload->>'challenge_code', ''));
$$;

-- ── 5. Corps HTML de l'e-mail (autonome, styles inline, RTL pour ar) ──
CREATE OR REPLACE FUNCTION build_email_html(p_locale text, p_text text, p_link text)
RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  greeting text; cta text; footer text; dir_attr text;
  site text := 'https://ethimarket.vercel.app';
BEGIN
  greeting := CASE p_locale WHEN 'en' THEN 'Hello' WHEN 'es' THEN 'Hola'
                            WHEN 'pt' THEN 'Olá' WHEN 'ar' THEN 'مرحبًا' ELSE 'Bonjour' END;
  cta := CASE p_locale WHEN 'ar' THEN 'فتح EthiMarket' ELSE
           CASE p_locale WHEN 'en' THEN 'Open EthiMarket' WHEN 'es' THEN 'Abrir EthiMarket'
                         WHEN 'pt' THEN 'Abrir EthiMarket' ELSE 'Ouvrir EthiMarket' END END;
  footer := CASE p_locale
    WHEN 'en' THEN 'You are receiving this email because of activity on your EthiMarket account.'
    WHEN 'es' THEN 'Recibe este correo porque hay actividad en su cuenta EthiMarket.'
    WHEN 'pt' THEN 'Recebe este e-mail porque há atividade na sua conta EthiMarket.'
    WHEN 'ar' THEN 'تتلقى هذا البريد بسبب نشاط في حسابك على EthiMarket.'
    ELSE 'Vous recevez cet e-mail car une activité concerne votre compte EthiMarket.' END;
  dir_attr := CASE WHEN p_locale = 'ar' THEN ' dir="rtl"' ELSE '' END;

  RETURN '<!DOCTYPE html><html' || dir_attr || '><body style="margin:0;padding:0;background:#f4f6f5;font-family:Segoe UI,Arial,sans-serif;">'
    || '<div style="max-width:520px;margin:24px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">'
    || '<div style="background:#16a34a;padding:18px 24px;"><span style="color:#ffffff;font-size:18px;font-weight:800;">🌿 EthiMarket</span></div>'
    || '<div style="padding:24px;"' || dir_attr || '>'
    || '<p style="font-size:14px;color:#111827;margin:0 0 6px;">' || greeting || ',</p>'
    || '<p style="font-size:15px;color:#111827;line-height:1.6;margin:0 0 20px;font-weight:600;">' || p_text || '</p>'
    || '<a href="' || site || coalesce(p_link, '') || '" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:12px 22px;border-radius:12px;">' || cta || '</a>'
    || '<p style="font-size:11px;color:#9ca3af;margin:26px 0 0;line-height:1.5;">' || footer || '</p>'
    || '</div></div></body></html>';
END;
$$;

-- ── 6. Envoi : trigger sur user_notifications ──
CREATE OR REPLACE FUNCTION trg_send_notification_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text; v_locale text; v_tpl text; v_text text; v_subject text;
  v_key text; v_from text; v_req bigint;
BEGIN
  -- Destinataire + langue
  SELECT p.email, coalesce(p.preferred_locale, 'fr') INTO v_email, v_locale
  FROM profiles p WHERE p.id = NEW.user_id;
  IF v_email IS NULL THEN
    SELECT u.email, 'fr' INTO v_email, v_locale FROM auth.users u WHERE u.id = NEW.user_id;
  END IF;
  IF v_email IS NULL THEN RETURN NEW; END IF;

  -- Gabarit localisé (fallback fr)
  SELECT body INTO v_tpl FROM email_texts WHERE kind = NEW.kind AND locale = v_locale;
  IF v_tpl IS NULL THEN
    SELECT body INTO v_tpl FROM email_texts WHERE kind = NEW.kind AND locale = 'fr';
  END IF;
  IF v_tpl IS NULL THEN
    INSERT INTO email_log (notification_id, recipient, locale, kind, status, error)
    VALUES (NEW.id, v_email, v_locale, NEW.kind, 'skipped_no_template', NULL);
    RETURN NEW;
  END IF;

  v_text := render_email_template(v_tpl, NEW.payload);
  v_subject := v_text;

  -- Clé API + expéditeur depuis Vault
  SELECT decrypted_secret INTO v_key FROM vault.decrypted_secrets WHERE name = 'resend_api_key';
  SELECT decrypted_secret INTO v_from FROM vault.decrypted_secrets WHERE name = 'resend_from';
  IF v_from IS NULL THEN v_from := 'EthiMarket <onboarding@resend.dev>'; END IF;
  IF v_key IS NULL THEN
    INSERT INTO email_log (notification_id, recipient, locale, kind, subject, status)
    VALUES (NEW.id, v_email, v_locale, NEW.kind, v_subject, 'skipped_no_key');
    RETURN NEW;
  END IF;

  -- Envoi asynchrone via pg_net (n'échoue jamais la transaction métier)
  BEGIN
    SELECT net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || v_key,
        'Content-Type', 'application/json'),
      body := jsonb_build_object(
        'from', v_from,
        'to', jsonb_build_array(v_email),
        'subject', v_subject,
        'html', build_email_html(v_locale, v_text, NEW.link))
    ) INTO v_req;
    INSERT INTO email_log (notification_id, recipient, locale, kind, subject, status, net_request_id)
    VALUES (NEW.id, v_email, v_locale, NEW.kind, v_subject, 'queued', v_req);
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO email_log (notification_id, recipient, locale, kind, subject, status, error)
    VALUES (NEW.id, v_email, v_locale, NEW.kind, v_subject, 'error', SQLERRM);
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notification_email ON user_notifications;
CREATE TRIGGER trg_notification_email AFTER INSERT ON user_notifications
  FOR EACH ROW EXECUTE FUNCTION trg_send_notification_email();

COMMENT ON TABLE email_log IS
  'Journal des e-mails transactionnels envoyés par la base via pg_net → Resend. La clé API vit dans Supabase Vault (resend_api_key), l''expéditeur dans resend_from.';
