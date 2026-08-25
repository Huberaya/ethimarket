# Plan de tests avant lancement public — EthiMarket

*Version 1.0 — août 2026. À dérouler intégralement avant l'ouverture au
grand public, puis à rejouer (version courte, section 12) à chaque mise à
jour majeure.*

**Comment l'utiliser :** chaque ligne est une action à faire à la main, avec
le résultat attendu. Cochez ☐ → ☑. Une ligne qui échoue = un ticket. Les
lignes marquées 🔴 sont **bloquantes pour le lancement** ; les 🟡 doivent
être corrigées vite mais ne bloquent pas ; les 🟢 sont du confort.

**Les 4 comptes de test à créer avant de commencer** (puis à purger) :
- `test-visiteur` : aucun compte (navigation privée)
- `test-producteur@…` : rôle producteur, dossier complété
- `test-acheteur@…` : rôle acheteur professionnel
- votre compte admin réel

---

## 1. Le visiteur anonyme (première impression = conversion)

### 1.1 Navigation et contenu
- ☐ 🔴 La page d'accueil charge en < 3 s (4G simulée, onglet Réseau des DevTools)
- ☐ 🔴 Toutes les entrées du menu et TOUS les liens du footer aboutissent (pas de 404) : Catalogue, Producteurs, Comment ça marche, Blog, Notre mission, **Notre logistique**, Notre équipe, Certifications, Presse, Partenaires, Centre d'aide, Contact, CGU, Confidentialité, Cookies, Tarifs, Devenir vendeur
- ☐ 🔴 Le catalogue s'affiche avec produits, images, prix ; les 3 vues (grille/tableau/carte) fonctionnent
- ☐ 🔴 Clic sur l'IMAGE d'un produit → fiche produit (pas seulement le nom)
- ☐ 🔴 Fiche produit complète : prix dégressifs, score, badge filière UE (sur curcuma/sésame), Trust Center, QR traçabilité, avis
- ☐ 🔴 Boutique producteur : onglet Produits + onglet À propos avec badge « EthiMarket Verified » et détail des contrôles (tester `yirgacheffe-union` qui a des preuves réelles)
- ☐ 🟡 Recherche : « café » → cafés uniquement ; « cafee » (faute) → suggestion ; « xyzabc » → 0 résultat propre
- ☐ 🟡 Blog : les 10 articles s'ouvrent, le contenu long s'affiche bien formaté (titres, gras, listes)
- ☐ 🟡 Page /trace/:id d'un lot inexistant → message propre « Lot introuvable », pas d'écran blanc

### 1.2 Multilingue (notre promesse : 5 langues)
- ☐ 🔴 Basculer FR → EN → ES → PT → AR depuis le sélecteur : chaque page principale (accueil, catalogue, fiche produit, devenir vendeur) est traduite, sans « trous » de français au milieu
- ☐ 🔴 AR : la mise en page passe bien en droite-à-gauche, rien ne se superpose
- ☐ 🟡 Les noms et descriptions de PRODUITS sont traduits (pas seulement l'interface)
- ☐ 🟡 La langue survit au rechargement de la page et à la navigation

### 1.3 Mobile (la moitié de vos visiteurs)
- ☐ 🔴 Parcours complet sur un vrai téléphone : accueil → catalogue → fiche produit → inscription. Menu hamburger, images, boutons assez grands
- ☐ 🔴 Le checkout/devis est utilisable au doigt (champs, sélecteurs)
- ☐ 🟡 Tester sur iPhone (Safari) ET Android (Chrome) — Safari a ses caprices

### 1.4 Ce qui NE doit PAS être visible
- ☐ 🔴 Aucune donnée d'un autre utilisateur accessible en étant déconnecté (essayer d'ouvrir /dashboard, /admin → redirection connexion)
- ☐ 🔴 Aucune promesse fausse résiduelle : chercher « escrow », « étiquettes auto », « sous 7 jours », « DHL », « 12 langues » sur les pages publiques → zéro occurrence
- ☐ 🔴 Aucun contenu de démo restant si la purge a été faite (voir section 11)

---

## 2. L'inscription et la connexion (la porte d'entrée)

- ☐ 🔴 Inscription producteur : cartes de rôle illustrées → formulaire → compte créé → atterrit sur **/dashboard/verification**
- ☐ 🔴 Inscription acheteur → atterrit sur **/catalogue**
- ☐ 🔴 Connexion producteur → espace vendeur ; connexion acheteur → espace achats ; connexion admin → /admin (la cohérence des redirections)
- ☐ 🔴 E-mail déjà utilisé → message clair, pas d'erreur brute
- ☐ 🔴 Mot de passe oublié : e-mail reçu, lien fonctionne, nouveau mot de passe accepté, connexion OK ⚠️ *nécessite le domaine vérifié Resend — sinon l'e-mail ne part que vers l'adresse du compte Resend : à tester APRÈS l'achat du domaine*
- ☐ 🔴 Déconnexion : retour à l'accueil, /dashboard inaccessible ensuite
- ☐ 🟡 Mots de passe : la jauge de force réagit ; confirmation non identique → erreur avant envoi
- ☐ 🟡 Case CGU obligatoire ; liens CGU/confidentialité s'ouvrent

---

## 3. Le producteur (le cœur de l'offre)

### 3.1 Vérification (notre différenciation)
- ☐ 🔴 Le nouveau producteur voit son parcours de vérification : documents à fournir, statut du dossier
- ☐ 🔴 Upload des documents (pièce d'identité, registre, certificat) : formats jpg/png/pdf acceptés, fichier trop lourd refusé proprement
- ☐ 🔴 Tant que non vérifié : boutique NON visible publiquement (vérifier en navigation privée)
- ☐ 🔴 Défi photo : le producteur reçoit le code EM-XXXX, peut soumettre ses photos, voit le délai 72 h
- ☐ 🟡 Notification (cloche + e-mail) quand l'admin approuve/rejette/demande modification

### 3.2 Produits
- ☐ 🔴 Ajouter un produit : formulaire complet, **dossier de conformité exigé** (code SH, lot/DLUO, fiche technique, COA, étiquetage — + certificat bio si bio, + GPS si café/cacao)
- ☐ 🔴 Tenter de publier avec dossier incomplet → blocage avec message pédagogique (le produit reste brouillon)
- ☐ 🔴 Dossier complet → publication → produit visible au catalogue public
- ☐ 🔴 Bannière filière UE : créer un produit « sésame » origine Éthiopie → bannière contrôles renforcés visible
- ☐ 🔴 L'empreinte CO2/eau est calculée automatiquement et s'affiche
- ☐ 🟡 Modifier un produit publié, changer le prix → répercuté au catalogue
- ☐ 🟡 Le produit est auto-traduit dans les 5 langues (vérifier la fiche en EN)
- ☐ 🟡 Prix dégressifs par volume : paliers corrects sur la fiche publique

### 3.3 Devis et commandes (côté vendeur)
- ☐ 🔴 Recevoir une demande de devis (notification + liste) ; répondre avec prix/délai ; l'acheteur le voit
- ☐ 🔴 Commande reçue → confirmer → le **paquet documentaire du lot** apparaît (les bons documents selon produit×origine)
- ☐ 🔴 Bouton « Expédier » grisé tant que le paquet est incomplet ; fournir les documents → expédition possible, n° de suivi saisi
- ☐ 🔴 QR de traçabilité téléchargeable après expédition ; le scanner mène à la page publique du lot
- ☐ 🟡 Panneau analyses labo : commander une analyse recommandée, choisir un labo dans l'annuaire, avancer le circuit (échantillon → rapport)
- ☐ 🟡 Marquer facturé / payé (virement) : les statuts de paiement suivent

### 3.4 Boutique et messagerie
- ☐ 🔴 Personnaliser sa boutique (description, photos) → visible publiquement
- ☐ 🔴 Messagerie : conversation acheteur-producteur dans les deux sens, temps réel
- ☐ 🟡 Badge qualité (s'il a un historique) et badge Verified sur l'onglet À propos

---

## 4. L'acheteur (celui qui paie)

### 4.1 Découverte et devis
- ☐ 🔴 Recherche + filtres (pays, certification, prix) → résultats cohérents
- ☐ 🔴 Demande de devis : quantité, pays de livraison, **case échantillon avant première commande**, message → le producteur la reçoit
- ☐ 🔴 Devis reçu → accepter → une commande PO-YYYY-NNNN est créée
- ☐ 🟡 Comparateur de produits (2-3 produits côte à côte)
- ☐ 🟡 Alternatives responsables proposées

### 4.2 Commande, paiement, réception
- ☐ 🔴 Suivi de commande : statuts nouvelle → confirmée → expédiée avec dates
- ☐ 🔴 Voir l'avancement du dossier documentaire du lot (lecture seule) — la transparence promise
- ☐ 🔴 Paiement virement : coordonnées et référence claires
- ☐ 🔴 Paiement Stripe (⚠️ encore en mode test au moment d'écrire) : carte 4242… → payé ; **à re-tester avec une VRAIE carte et un petit montant dès le passage en clés live**
- ☐ 🔴 **Réception structurée** : les 4 contrôles guidés ; tout conforme → commande livrée
- ☐ 🔴 Réception NON conforme (décocher quantité) → un incident s'ouvre côté admin automatiquement
- ☐ 🔴 Ouvrir un litige → dossier visible côté admin
- ☐ 🔴 Bon de commande PDF téléchargeable et correct (montants, mentions)
- ☐ 🟡 Suivi de ses achats dans l'espace acheteur (historique, fournisseurs)

---

## 5. L'admin (vous — la salle des machines)

### 5.1 Audit producteur (le geste métier n° 1)
- ☐ 🔴 Dossier en attente visible ; page d'audit complète (sections A-G) ; **guide d'audit dépliable** en tête
- ☐ 🔴 Attacher une preuve à un critère (méthode + référence + constat ≥ 10 caractères) → la checklist passe au vert
- ☐ 🔴 Impossible d'approuver sous 6/6 critères prouvés (bouton verrouillé)
- ☐ 🔴 Lancer un défi photo ; analyser les EXIF d'une photo soumise
- ☐ 🔴 Approuver → boutique publique + notification producteur ; Rejeter/Demander modifications → notification avec commentaire
- ☐ 🔴 Registres pré-remplis : liens registre du commerce et certificateur du bon pays s'ouvrent
- ☐ 🟡 Niveaux Bronze/Argent/Or affichés selon les preuves

### 5.2 Files d'attente quotidiennes
- ☐ 🔴 /admin/incidents : incident de la réception non conforme du § 4.2 présent → « classer sans suite » OU « confirmer » (→ vérifier que le niveau de confiance du producteur baisse sur sa boutique)
- ☐ 🔴 /admin/analyses : rapport COA à vérifier → étapes guidées → valider (le doc du lot se remplit seul) puis rejeter un autre (un incident s'ouvre)
- ☐ 🔴 /admin/laboratoires : contre-vérifier un labo au registre → passer « vérifié » (date horodatée)
- ☐ 🔴 /admin/rasff : le journal s'affiche ; « Vérifier maintenant » fonctionne
- ☐ 🔴 /admin/sante : cron 7/7 succeeded, e-mails, files d'attente
- ☐ 🟡 Litiges, commandes, produits, utilisateurs, finances : chaque page charge et les actions de base fonctionnent
- ☐ 🟡 Annuaire certificateurs : 83 organismes, filtres par région, ajout/édition

### 5.3 Sécurité des accès (à tester SÉRIEUSEMENT)
- ☐ 🔴 Un compte producteur qui tape /admin → redirigé, aucune donnée
- ☐ 🔴 Un producteur ne peut pas voir/modifier les produits ou commandes d'un autre producteur (tester en modifiant l'URL avec l'id d'un autre)
- ☐ 🔴 Un acheteur ne voit pas les commandes d'un autre acheteur
- ☐ 🔴 Un producteur ne peut pas s'auto-vérifier (API : passer un item de conformité à « verified » → refus)
- ☐ 🔴 La page /trace/:id ne révèle NI acheteur NI prix NI références de documents

---

## 6. Les partenaires externes (ONG, certificateurs, journalistes)

*Ils ne se connectent pas : ils vérifient. C'est un « rôle » à part entière
pour une plateforme dont l'argument est la preuve.*

- ☐ 🔴 Depuis une boutique producteur, le détail des contrôles publiés est compréhensible par un non-initié (méthode, date, critère — jamais les notes internes)
- ☐ 🔴 La page publique de traçabilité d'un lot raconte une histoire vérifiable de bout en bout
- ☐ 🔴 Le Trust Center et « Notre logistique » : chaque affirmation correspond à un mécanisme réel (relire en se demandant « un journaliste peut-il nous coincer ? »)
- ☐ 🟡 Page contact : le formulaire arrive bien quelque part (vérifier la réception)
- ☐ 🟡 Mentions légales : SIRET réel, adresse réelle, contact réel (⚠️ gabarits à compléter avant lancement)

---

## 7. E-mails et notifications (le système nerveux)

⚠️ **Préalable : domaine acheté + vérifié dans Resend.** Avant ça, seule
l'adresse du compte Resend reçoit les e-mails.

- ☐ 🔴 Chaque événement clé déclenche cloche ET e-mail : inscription, dossier approuvé/rejeté, devis reçu/répondu, commande créée/confirmée/expédiée/livrée, litige, défi photo
- ☐ 🔴 L'e-mail part dans la LANGUE du destinataire (créer un compte en ES et vérifier)
- ☐ 🔴 Les e-mails n'atterrissent pas en spam (tester Gmail, Outlook, Yahoo) — sinon configurer SPF/DKIM chez Resend
- ☐ 🟡 /admin/sante : zéro e-mail en statut « failed » après la campagne de tests
- ☐ 🟡 Liens des e-mails corrects (pointent vers le bon domaine, pas localhost/vercel preview)

---

## 8. RGPD et légal (obligatoire, pas optionnel)

- ☐ 🔴 Export de ses données : le fichier téléchargé contient bien les données du compte
- ☐ 🔴 Suppression de compte : compte supprimé, connexion impossible ensuite, données purgées
- ☐ 🔴 Bandeau cookies conforme (si cookies non essentiels)
- ☐ 🔴 CGU/CGV et politique de confidentialité relues par un juriste, avec VOS mentions réelles
- ☐ 🟡 Double opt-in ou au minimum désinscription fonctionnelle sur tout envoi non transactionnel

---

## 9. Robustesse technique

- ☐ 🔴 Rejouer la suite automatique complète : `npx vitest run` (590 tests) + `tsc` + build — zéro rouge
- ☐ 🔴 Coupures : soumettre un formulaire avec le wifi coupé → message d'erreur propre, pas de perte de saisie
- ☐ 🔴 Double-clic sur « Payer » / « Commander » → une seule commande créée
- ☐ 🟡 Navigateurs : Chrome, Firefox, Safari, Edge (une passe rapide chacun)
- ☐ 🟡 Lighthouse sur accueil + catalogue + fiche produit : Performance > 80, Accessibilité > 90
- ☐ 🟡 back/forward du navigateur ne casse pas les pages à étapes (inscription, devis)
- ☐ 🟢 Zoom navigateur 200 % : tout reste lisible

---

## 10. Les automatismes nocturnes (à vérifier sur 3 jours)

- ☐ 🔴 Pendant 3 nuits consécutives : /admin/sante affiche « succeeded » chaque matin
- ☐ 🔴 Veille RASFF : les requêtes partent et se dépouillent (compteur « en attente » ne s'accumule pas)
- ☐ 🟡 Certification expirée (mettre une date passée sur un cert de test) → dégradée automatiquement le lendemain

---

## 11. La bascule de lancement (checklist du jour J)

Dans l'ordre :
1. ☐ Backup complet de la base (Supabase → Backups)
2. ☐ **Purge des données démo** : `scripts/purge_demo_data.sql` (13 producteurs fictifs, avis, articles de blog conservés eux — ils sont réels maintenant : ADAPTER le script pour garder les articles !) ⚠️ relire le script avant : il purge aussi les articles
3. ☐ Domaine acheté + DNS + Resend vérifié (SPF/DKIM) + `SITE_URL` mise à jour
4. ☐ Stripe : clés live échangées (guide `docs/STRIPE_ACTIVATION.md`) + UN vrai paiement de 1 € testé puis remboursé
5. ☐ Mentions légales réelles (SIRET, adresse, hébergeur)
6. ☐ CI GitHub installée (`.github/workflows-to-install/ci.yml`)
7. ☐ Rotation complète des secrets (token GitHub, mot de passe DB, clés API) — et plus jamais de partage en clair
8. ☐ Re-dérouler les sections 1 et 2 de ce plan sur le domaine final
9. ☐ Premier producteur RÉEL audité de bout en bout avec la fiche d'audit
10. ☐ Surveiller /admin/sante quotidiennement la première semaine

---

## 12. La passe rapide de non-régression (après chaque mise à jour)

Les 10 minutes qui sauvent : parcours visiteur (accueil→catalogue→produit),
inscription acheteur → devis, connexion producteur → réponse au devis →
confirmation → documents → expédition, réception structurée conforme,
un coup d'œil à /admin/sante. Si ces 5 gestes passent, l'essentiel vit.

---

*Ce plan reflète l'état de la plateforme au commit `b722d9c`. Tenez-le à
jour : un test qui n'existe plus est pire qu'un test absent.*
