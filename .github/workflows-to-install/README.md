# Installation de la CI (1 minute)

Le fichier `ci.yml` de ce dossier est le pipeline GitHub Actions
(tests + build + smoke test sur chaque push/PR vers main).

Il n'a pas pu être poussé directement car le token utilisé n'a pas
le scope `workflow`. Deux façons de l'activer :

**Option A — Interface GitHub (recommandé) :**
1. Sur github.com/Huberaya/ethimarket → onglet **Actions** → « set up a workflow yourself »
2. Collez le contenu de `ci.yml` → Commit.

**Option B — En local :**
```bash
git mv .github/workflows-to-install/ci.yml .github/workflows/ci.yml
git commit -m "ci: enable pipeline" && git push
```
