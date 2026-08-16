-- Messages du formulaire de contact public
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT, email TEXT, subject TEXT, message TEXT,
  handled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_public_insert" ON contact_messages;
CREATE POLICY "contact_public_insert" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "contact_admin_read" ON contact_messages;
CREATE POLICY "contact_admin_read" ON contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin));
