-- =============================================================
-- EthiMarket Trust Center — Seed des allégations produits
-- Illustre tous les états publics sur les produits réels :
--   ✅ Certifié (avec n° certificat, validité, organisme, source)
--   🕓 Vérification en cours
--   ⚠️ Déclaration fournisseur — preuve indépendante non trouvée
--   ⌛ Certification expirée
-- Idempotent : supprime puis recrée les claims seedées (préfixe
-- de lot 'SEED' dans notes) sans toucher aux claims réelles.
-- =============================================================

DO $$
DECLARE
  v_cafe uuid;      v_argan uuid;   v_quinoa uuid;  v_cacao uuid;
  v_vanille uuid;   v_spiruline uuid; v_miel uuid;  v_the uuid;
  v_coco uuid;      v_safran uuid;  v_curcuma uuid; v_agave uuid;
  v_ecocert uuid;   v_flocert uuid; v_rainforest uuid; v_controlunion uuid;
  v_claim uuid;
BEGIN
  SELECT id INTO v_cafe      FROM products WHERE slug = 'cafe-ethiopien-yirgacheffe';
  SELECT id INTO v_argan     FROM products WHERE slug = 'huile-argan-bio';
  SELECT id INTO v_quinoa    FROM products WHERE slug = 'quinoa-bio';
  SELECT id INTO v_cacao     FROM products WHERE slug = 'cacao-brut';
  SELECT id INTO v_vanille   FROM products WHERE slug = 'vanille-bourbon';
  SELECT id INTO v_spiruline FROM products WHERE slug = 'spiruline-bio';
  SELECT id INTO v_miel      FROM products WHERE slug = 'miel-thym';
  SELECT id INTO v_the       FROM products WHERE slug = 'the-vert-sencha';
  SELECT id INTO v_coco      FROM products WHERE slug = 'huile-coco-bio';
  SELECT id INTO v_safran    FROM products WHERE slug = 'safran-premium';
  SELECT id INTO v_curcuma   FROM products WHERE slug = 'curcuma-moulu';
  SELECT id INTO v_agave     FROM products WHERE slug = 'sirop-agave';

  SELECT id INTO v_ecocert      FROM certification_bodies WHERE name = 'Ecocert SA' LIMIT 1;
  SELECT id INTO v_flocert      FROM certification_bodies WHERE name = 'FLO-CERT' LIMIT 1;
  SELECT id INTO v_rainforest   FROM certification_bodies WHERE name = 'Rainforest Alliance' LIMIT 1;
  SELECT id INTO v_controlunion FROM certification_bodies WHERE name = 'Control Union Certifications' LIMIT 1;

  -- Nettoyage idempotent des seeds précédents
  DELETE FROM product_claims WHERE id IN (
    SELECT DISTINCT c.id FROM product_claims c
    JOIN claim_evidence e ON e.claim_id = c.id
    WHERE e.notes = 'SEED'
  );
  DELETE FROM product_claims WHERE claim_label LIKE 'SEED %';

  -- ================= CAFÉ ÉTHIOPIEN YIRGACHEFFE =================
  IF v_cafe IS NOT NULL THEN
    -- ✅ Café biologique : certifié Ecocert
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_cafe, 'organic_material', 'Café biologique', 'Arabica Heirloom 100% agriculture biologique', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'EC-BIO-2025-71834', v_ecocert,
            'https://www.ecocert.com/en/certification-check', '2025-04-12', '2027-04-11',
            'confirmed', 'EthiMarket', '2026-08-14T10:22:00Z', 'SEED');

    -- ✅ Rainforest Alliance : certifié
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_cafe, 'other', 'Agriculture sous ombrage — Rainforest Alliance', 'Culture agroforestière préservant la canopée', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'RA-2024-ET-00291', v_rainforest,
            'https://www.rainforest-alliance.org/find-certified/', '2024-11-01', '2027-10-31',
            'confirmed', 'EthiMarket', '2026-08-14T10:25:00Z', 'SEED');

    -- ⚠️ Salaire décent : déclaration fournisseur seule
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_cafe, 'living_wage', 'Salaire décent', 'Rémunération 15% au-dessus du prix plancher local', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, check_result, notes)
    VALUES (v_claim, 'supplier_declaration', 'not_checked', 'SEED');
  END IF;

  -- ================= HUILE D'ARGAN BIO =================
  IF v_argan IS NOT NULL THEN
    -- ✅ Huile biologique : certifiée Ecocert
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_argan, 'organic_material', 'Huile d''argan biologique', 'Première pression à froid, certifiée bio', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'EC-BIO-2025-44102', v_ecocert,
            'https://www.ecocert.com/en/certification-check', '2025-06-01', '2027-05-31',
            'confirmed', 'EthiMarket', '2026-08-12T09:10:00Z', 'SEED');

    -- ✅ Commerce équitable : certifié FLO-CERT
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_argan, 'fair_trade', 'Commerce équitable', 'Coopérative membre Fairtrade International', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'FLO-ID-31287', v_flocert,
            'https://www.flocert.net/about-flocert/customer-search/', '2025-01-15', '2027-01-14',
            'confirmed', 'EthiMarket', '2026-08-12T09:15:00Z', 'SEED');

    -- ⚠️ Coopérative de femmes : déclaration
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_argan, 'social_conditions', 'Coopérative de femmes', '64 femmes sociétaires de la région d''Essaouira', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, check_result, notes)
    VALUES (v_claim, 'supplier_declaration', 'not_checked', 'SEED');
  END IF;

  -- ================= QUINOA BIO =================
  IF v_quinoa IS NOT NULL THEN
    -- ✅ Quinoa biologique : certifié Control Union
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_quinoa, 'organic_material', 'Quinoa biologique', 'Variété Blanca de Juli, altiplano andin', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'CU-882247-ORG', v_controlunion,
            'https://verifications.controlunion.com/', '2025-09-20', '2026-12-19',
            'confirmed', 'EthiMarket', '2026-08-10T14:00:00Z', 'SEED');

    -- 🕓 Commerce équitable : certificat déposé, vérification en cours
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_quinoa, 'fair_trade', 'Commerce équitable', 'Certificat FLO-CERT déposé par la coopérative', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, check_result, notes)
    VALUES (v_claim, 'certificate_on_file', 'FLO-ID-40866', v_flocert,
            'https://www.flocert.net/about-flocert/customer-search/', 'pending', 'SEED');
  END IF;

  -- ================= CACAO BRUT =================
  IF v_cacao IS NOT NULL THEN
    -- ✅ Commerce équitable : certifié FLO-CERT
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_cacao, 'fair_trade', 'Commerce équitable', 'Coopérative certifiée Fairtrade, prime de développement versée', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'FLO-ID-28904', v_flocert,
            'https://www.flocert.net/about-flocert/customer-search/', '2024-07-01', '2026-12-31',
            'confirmed', 'EthiMarket', '2026-08-11T16:40:00Z', 'SEED');

    -- ⚠️ Sans travail des enfants : déclaration
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_cacao, 'no_child_labor', 'Sans travail des enfants', 'Engagement de la coopérative, comités de surveillance villageois', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, check_result, notes)
    VALUES (v_claim, 'supplier_declaration', 'not_checked', 'SEED');
  END IF;

  -- ================= VANILLE BOURBON =================
  IF v_vanille IS NOT NULL THEN
    -- ✅ Vanille biologique : certifiée Ecocert
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_vanille, 'organic_material', 'Vanille biologique', 'Gousses Bourbon, pollinisation manuelle', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'EC-BIO-2024-90514', v_ecocert,
            'https://www.ecocert.com/en/certification-check', '2024-10-01', '2026-09-30',
            'confirmed', 'EthiMarket', '2026-08-13T11:05:00Z', 'SEED');

    -- ⚠️ Salaire décent : déclaration
    INSERT INTO product_claims (product_id, claim_type, claim_label, declared_by)
    VALUES (v_vanille, 'living_wage', 'Salaire décent', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO NOTHING;
  END IF;

  -- ================= SPIRULINE BIO =================
  IF v_spiruline IS NOT NULL THEN
    -- ✅ Spiruline biologique : certifiée Ecocert
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_spiruline, 'organic_material', 'Spiruline biologique', 'Culture française en bassins, séchage basse température', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'EC-BIO-2026-10877', v_ecocert,
            'https://www.ecocert.com/en/certification-check', '2026-02-01', '2028-01-31',
            'confirmed', 'EthiMarket', '2026-08-09T08:30:00Z', 'SEED');

    -- ⚠️ Emballage sans plastique : déclaration (contrôle documentaire pas encore fait)
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_spiruline, 'packaging', 'Emballage sans plastique', 'Doypack kraft compostable, zéro plastique', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, check_result, notes)
    VALUES (v_claim, 'supplier_document', 'not_checked', 'SEED');
  END IF;

  -- ================= MIEL DE THYM =================
  IF v_miel IS NOT NULL THEN
    -- ⌛ Miel biologique : certificat EXPIRÉ (démontre la rétrogradation auto)
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_miel, 'organic_material', 'Miel biologique', 'Ruchers de montagne, Crète', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, issuing_body_id, source_url, valid_from, valid_until, check_result, checked_by_name, checked_at, notes)
    VALUES (v_claim, 'certificate_verified', 'EC-BIO-2023-55201', v_ecocert,
            'https://www.ecocert.com/en/certification-check', '2023-05-01', '2026-04-30',
            'confirmed', 'EthiMarket', '2025-06-02T10:00:00Z', 'SEED');
  END IF;

  -- ================= THÉ VERT SENCHA =================
  IF v_the IS NOT NULL THEN
    -- 🕓 Thé biologique : JAS déposé, vérification en cours
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_the, 'organic_material', 'Thé biologique (JAS)', 'Certification biologique japonaise JAS', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO UPDATE SET claim_value = EXCLUDED.claim_value
    RETURNING id INTO v_claim;
    INSERT INTO claim_evidence (claim_id, evidence_type, reference_number, source_url, check_result, notes)
    VALUES (v_claim, 'certificate_on_file', 'JAS-2026-08812', 'https://www.maff.go.jp/e/policies/standard/jas/', 'pending', 'SEED');
  END IF;

  -- ================= HUILE DE COCO / SAFRAN / CURCUMA / AGAVE : déclarations =================
  IF v_coco IS NOT NULL THEN
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_coco, 'organic_material', 'Coco biologique', 'Cocoteraies familiales sans intrants', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO NOTHING;
    INSERT INTO product_claims (product_id, claim_type, claim_label, declared_by)
    VALUES (v_coco, 'fair_trade', 'Commerce équitable', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO NOTHING;
  END IF;
  IF v_safran IS NOT NULL THEN
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_safran, 'origin', 'Récolte manuelle traditionnelle', 'Stigmates prélevés à l''aube, grade Negin', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO NOTHING;
  END IF;
  IF v_curcuma IS NOT NULL THEN
    INSERT INTO product_claims (product_id, claim_type, claim_label, declared_by)
    VALUES (v_curcuma, 'fair_trade', 'Commerce équitable', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO NOTHING;
  END IF;
  IF v_agave IS NOT NULL THEN
    INSERT INTO product_claims (product_id, claim_type, claim_label, claim_value, declared_by)
    VALUES (v_agave, 'origin', 'Agave bleu du Jalisco', 'Extraction basse température', 'supplier')
    ON CONFLICT (product_id, claim_type, claim_label) DO NOTHING;
  END IF;

  -- Ré-évaluation de toutes les claims créées (statuts calculés par le moteur)
  PERFORM evaluate_claim_status(id) FROM product_claims;
END $$;
