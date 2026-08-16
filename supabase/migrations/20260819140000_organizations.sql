-- =============================================================
-- EthiMarket — Multi-utilisateurs entreprise (audit n°9)
--  * organizations : l'entreprise acheteuse
--  * organization_members : membres avec rôles (owner/admin/member)
--  * Invitations par CODE (pas d'e-mail requis : le service e-mail
--    n'est pas encore branché — audit n°2)
--  * Pondérations de décision au niveau ENTREPRISE : imposées ou
--    par défaut pour tous les membres
-- RLS : un membre ne voit que son organisation.
-- =============================================================

DO $$ BEGIN
  CREATE TYPE org_role_enum AS ENUM ('owner', 'admin', 'member');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Organisations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(trim(name)) >= 2),
  -- Code d'invitation à partager avec les collègues (rotatif)
  invite_code TEXT NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 8)),
  -- Pondérations de décision de l'entreprise
  weight_price INTEGER NOT NULL DEFAULT 30 CHECK (weight_price BETWEEN 0 AND 100),
  weight_environment INTEGER NOT NULL DEFAULT 25 CHECK (weight_environment BETWEEN 0 AND 100),
  weight_social INTEGER NOT NULL DEFAULT 20 CHECK (weight_social BETWEEN 0 AND 100),
  weight_traceability INTEGER NOT NULL DEFAULT 15 CHECK (weight_traceability BETWEEN 0 AND 100),
  weight_certifications INTEGER NOT NULL DEFAULT 10 CHECK (weight_certifications BETWEEN 0 AND 100),
  -- true = les pondérations entreprise PRIMENT sur les règles individuelles
  weights_enforced BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT org_weights_sum_100 CHECK (
    weight_price + weight_environment + weight_social + weight_traceability + weight_certifications = 100
  )
);

-- 2. Membres
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role_enum NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)              -- un utilisateur = une organisation (V1)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);

DROP TRIGGER IF EXISTS trg_touch_orgs ON organizations;
CREATE TRIGGER trg_touch_orgs BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- 3. Fonctions SECURITY DEFINER (évitent la récursion RLS)

-- Créer une organisation : le créateur devient owner
CREATE OR REPLACE FUNCTION create_organization(p_name TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_org UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentification requise'; END IF;
  IF EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Vous appartenez déjà à une organisation';
  END IF;
  INSERT INTO organizations (name, created_by) VALUES (trim(p_name), auth.uid())
  RETURNING id INTO v_org;
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (v_org, auth.uid(), 'owner');
  RETURN v_org;
END;
$$;

-- Rejoindre via code d'invitation
CREATE OR REPLACE FUNCTION join_organization(p_invite_code TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_org UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentification requise'; END IF;
  IF EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Vous appartenez déjà à une organisation';
  END IF;
  SELECT id INTO v_org FROM organizations WHERE invite_code = upper(trim(p_invite_code));
  IF v_org IS NULL THEN RAISE EXCEPTION 'Code d''invitation invalide'; END IF;
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (v_org, auth.uid(), 'member');
  RETURN v_org;
END;
$$;

-- Régénérer le code d'invitation (owner/admin uniquement)
CREATE OR REPLACE FUNCTION rotate_invite_code(p_org UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_code TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = p_org AND user_id = auth.uid() AND role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Réservé aux administrateurs de l''organisation';
  END IF;
  v_code := upper(substr(md5(random()::text), 1, 8));
  UPDATE organizations SET invite_code = v_code WHERE id = p_org;
  RETURN v_code;
END;
$$;

-- Quitter / retirer un membre
CREATE OR REPLACE FUNCTION remove_org_member(p_member_user UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_org UUID; v_target_role org_role_enum; v_my_role org_role_enum;
BEGIN
  SELECT organization_id, role INTO v_org, v_target_role
  FROM organization_members WHERE user_id = p_member_user;
  IF v_org IS NULL THEN RAISE EXCEPTION 'Membre introuvable'; END IF;

  SELECT role INTO v_my_role FROM organization_members
  WHERE organization_id = v_org AND user_id = auth.uid();

  -- Se retirer soi-même : toujours permis (sauf dernier owner)
  IF p_member_user = auth.uid() THEN
    IF v_target_role = 'owner' AND
       (SELECT count(*) FROM organization_members WHERE organization_id = v_org AND role = 'owner') = 1 THEN
      RAISE EXCEPTION 'Le dernier propriétaire ne peut pas quitter : transférez la propriété ou supprimez l''organisation';
    END IF;
  ELSE
    -- Retirer un autre : owner/admin requis, et un admin ne retire pas un owner
    IF v_my_role IS NULL OR v_my_role = 'member' THEN
      RAISE EXCEPTION 'Réservé aux administrateurs de l''organisation';
    END IF;
    IF v_target_role = 'owner' AND v_my_role <> 'owner' THEN
      RAISE EXCEPTION 'Seul un propriétaire peut retirer un propriétaire';
    END IF;
  END IF;

  DELETE FROM organization_members WHERE user_id = p_member_user;
END;
$$;

-- Changer le rôle d'un membre (owner uniquement)
CREATE OR REPLACE FUNCTION set_org_member_role(p_member_user UUID, p_role org_role_enum)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_org UUID;
BEGIN
  SELECT organization_id INTO v_org FROM organization_members WHERE user_id = p_member_user;
  IF v_org IS NULL THEN RAISE EXCEPTION 'Membre introuvable'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = v_org AND user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Seul un propriétaire peut modifier les rôles';
  END IF;
  IF p_member_user = auth.uid() AND p_role <> 'owner' AND
     (SELECT count(*) FROM organization_members WHERE organization_id = v_org AND role = 'owner') = 1 THEN
    RAISE EXCEPTION 'Le dernier propriétaire ne peut pas se rétrograder';
  END IF;
  UPDATE organization_members SET role = p_role WHERE user_id = p_member_user;
END;
$$;

-- Helper RLS sans récursion
CREATE OR REPLACE FUNCTION my_org_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 4. RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orgs_members_read" ON organizations;
CREATE POLICY "orgs_members_read" ON organizations
  FOR SELECT USING (id = my_org_id());

DROP POLICY IF EXISTS "orgs_admin_update" ON organizations;
CREATE POLICY "orgs_admin_update" ON organizations
  FOR UPDATE USING (
    id = my_org_id() AND EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "org_members_read" ON organization_members;
CREATE POLICY "org_members_read" ON organization_members
  FOR SELECT USING (organization_id = my_org_id());

GRANT EXECUTE ON FUNCTION create_organization(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION join_organization(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION rotate_invite_code(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_org_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION set_org_member_role(UUID, org_role_enum) TO authenticated;
GRANT EXECUTE ON FUNCTION my_org_id() TO authenticated;
