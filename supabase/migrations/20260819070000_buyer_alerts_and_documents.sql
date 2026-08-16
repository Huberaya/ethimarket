-- =============================================================
-- EthiMarket — Alertes proactives + Coffre-fort documentaire
-- =============================================================

-- 1. Alertes
CREATE TABLE IF NOT EXISTS buyer_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dedupe_key TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('supplier','risk','opportunity','reevaluation','document')),
  severity TEXT NOT NULL CHECK (severity IN ('red','orange','green','blue')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  producer_id UUID REFERENCES producers(id) ON DELETE CASCADE,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, dedupe_key)
);

CREATE INDEX IF NOT EXISTS idx_buyer_alerts_user_unread ON buyer_alerts(user_id, is_read, created_at DESC);

-- 2. Coffre-fort documentaire
CREATE TABLE IF NOT EXISTS buyer_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'other' CHECK (doc_type IN (
    'certificate','audit','invoice','datasheet','esg_report',
    'questionnaire','analysis','regulatory','other')),
  storage_path TEXT,
  extracted_fields JSONB DEFAULT '[]'::jsonb,
  missing_fields JSONB DEFAULT '[]'::jsonb,
  completeness_pct INTEGER DEFAULT 0 CHECK (completeness_pct BETWEEN 0 AND 100),
  warnings JSONB DEFAULT '[]'::jsonb,
  linked_producer_id UUID REFERENCES producers(id) ON DELETE SET NULL,
  linked_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buyer_documents_user ON buyer_documents(user_id, created_at DESC);

-- 3. RLS : chaque acheteur chez lui
ALTER TABLE buyer_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "buyer_alerts_owner_all" ON buyer_alerts;
CREATE POLICY "buyer_alerts_owner_all" ON buyer_alerts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "buyer_documents_owner_all" ON buyer_documents;
CREATE POLICY "buyer_documents_owner_all" ON buyer_documents
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Bucket de stockage des documents (privé)
INSERT INTO storage.buckets (id, name, public)
VALUES ('buyer-documents', 'buyer-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "buyer_docs_owner_rw" ON storage.objects;
CREATE POLICY "buyer_docs_owner_rw" ON storage.objects
  FOR ALL USING (bucket_id = 'buyer-documents' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'buyer-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
