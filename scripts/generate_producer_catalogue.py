#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère public/data/prospects-producteurs-phase{1,2,3}.json : le vivier PRODUCTEURS de l'onglet
Prospection (pipeline « 🌾 Producteurs », vue Vivier), au format exact de
l'interface Prospect de src/pages/admin/Prospection.tsx.

Source : data/base_producteurs_ethimarket.csv (7 200+ producteurs réels issus
d'annuaires publics : Fairtrade/FLOCERT, WFTO, PromPerú, NSTIAM, Spices Board
India, TNAU, Conseil Café-Cacao, Conseil oléicole international, IFOAM,
CARTV / registre des produits biologiques du Québec (SIPAB), Organic Council of
Ontario, sites officiels de coopératives).

Usage :
    python3 scripts/generate_producer_catalogue.py [chemin/du/csv]

Règle d'honnêteté : aucun champ inventé. Une donnée absente vaut null ;
un label non confirmé par la source est écrit « À vérifier » dans notes et
n'est jamais présenté comme une certification.
"""
import csv
import json
import os
import re
import sys
import uuid
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
# Fichiers par phase (le vivier producteurs dépasse 10 Mo au total : l'onglet
# Prospection ne télécharge que la phase affichée).
OUT_PHASE = {ph: os.path.join(ROOT, "public", "data", f"prospects-producteurs-phase{ph}.json")
             for ph in (1, 2, 3)}

DEFAULT_CSV = os.path.join(ROOT, "data", "base_producteurs_ethimarket.csv")
ALT_CSV = os.path.expanduser("~/ethimarket/base_producteurs_ethimarket.csv")

VIDE = {"", "non trouvé", "non précisé", "non trouve", "n/a", "na", "-"}

# Fiches déjà présentes dans le pipeline CRM : retirées du catalogue publié
# (commit ea0c809 — « pipeline targets no longer reappear in viviers »).
# Le dédoublonnage réel reste fait au chargement par src/lib/prospectDedup.ts ;
# cette liste évite seulement de les republier dans les fichiers de vivier.
DEJA_DANS_LE_PIPELINE = {
    "cooperative marjana",
    "oromia coffee farmers cooperative union",
    "sidama coffee farmers cooperative union",
    "yirgacheffe coffee farmers cooperative union",
    "anapqui",
    "cenfrocafe",
    "cooperativa agraria cafetalera cenfrocafe peru",
}


def clef_dedup(nom: str) -> str:
    """Même normalisation que normName() de src/lib/prospectDedup.ts."""
    import unicodedata
    n = unicodedata.normalize("NFD", (nom or "")).lower()
    n = "".join(c for c in n if not unicodedata.combining(c))
    n = re.sub(r"\([^)]*\)", " ", n)
    return re.sub(r"[^a-z0-9]+", " ", n).strip()

# --- Filtrage géographique par phase (miroir du playbook de prospection) ------
PHASE1 = {"France"}
# Filières d'ancrage de la phase 1 : café Éthiopie, vanille Madagascar, argane Maroc
ANCHOR_COUNTRIES = {"Éthiopie", "Madagascar", "Maroc"}
PHASE2 = {
    "Allemagne", "Autriche", "Belgique", "Bulgarie", "Chypre", "Croatie", "Danemark",
    "Espagne", "Estonie", "Finlande", "Grèce", "Hongrie", "Irlande", "Italie", "Lettonie",
    "Lituanie", "Luxembourg", "Malte", "Norvège", "Pays-Bas", "Pologne", "Portugal",
    "Tchéquie", "Roumanie", "Royaume-Uni", "Slovaquie", "Slovénie", "Suède", "Suisse",
    "États-Unis", "Canada", "Algérie", "Tunisie", "Libye",
}

# --- Catégories de la base -> segments producteurs du CRM ---------------------
SEGMENTS = {
    "Café": "cafe",
    "Cacao": "cacao",
    "Thé": "the",
    "Miel & produits de la ruche": "miel",
    "Huiles": "huiles",
    "Plantes, herbes & huiles essentielles": "plantes",
    "Épices": "epices",
    "Fruits à coque & oléagineux": "oleagineux",
    "Fruits": "fruits",
    "Légumes & maraîchage": "legumes",
    "Textile, artisanat & décoration": "artisanat",
    "Cosmétiques naturels": "cosmetique",
    "Sucre / panela": "sucre",
    "Sirop d’érable & produits de l’érable": "sucre",
    "Fleurs & plantes": "plantes",
    "Vin": "vin",
    "Céréales & graines": "cereales",
    "Élevage & produits animaliers": "elevage",
    "Produits transformés": "transformes",
}

NEW_SEGMENT_LABELS = {
    "the": "Thé", "huiles": "Huiles (olive, argan)", "plantes": "Plantes & huiles essentielles",
    "oleagineux": "Fruits à coque & oléagineux", "fruits": "Fruits", "legumes": "Légumes & maraîchage",
    "cereales": "Céréales & graines", "vin": "Vin", "elevage": "Élevage & produits animaliers",
    "transformes": "Produits transformés", "sucre": "Sucre / panela", "artisanat": "Artisanat & décoration",
}


def nettoie(v):
    v = (v or "").strip()
    return None if v.lower() in VIDE else v


def cat_of(products: str) -> str:
    """Catégorisation identique à celle de la base (scripts du pipeline de données)."""
    p = (products or "").lower()

    def has(*kw):
        return any(k in p for k in kw)

    if has("café", "coffee"):
        return "Café"
    if has("cacao", "cocoa", "chocolat"):
        return "Cacao"
    if has("thé", "tea") and not has("herbal"):
        return "Thé"
    if has("miel", "honey", "bee", "apicole", "cire"):
        return "Miel & produits de la ruche"
    if has("argan", "olive", "huile", "oil") and not has("essential"):
        return "Huiles"
    if has("huile essentielle", "essential oil", "plante médicinale", "medicinal",
           "aromatique", "infusion", "herbal", "herbes", "plantes"):
        return "Plantes, herbes & huiles essentielles"
    if has("épice", "spice", "poivre", "pepper", "cardamome", "gingembre", "ginger",
           "curcuma", "turmeric", "cannelle", "vanille", "vanilla", "clou de girofle", "cumin"):
        return "Épices"
    if has("karité", "shea", "cajou", "cashew", "noix", "nut", "amande", "almond",
           "sésame", "sesame", "oléagineux", "oilseed"):
        return "Fruits à coque & oléagineux"
    if has("banane", "banana", "mangue", "mango", "ananas", "pineapple", "fruit", "agrume",
           "citrus", "citron", "orange", "raisin", "grape", "avocat", "avocado", "papaye",
           "pomme", "poire", "fraise", "melon"):
        return "Fruits"
    if has("légume", "vegetable", "maraîch", "horticult", "tomate", "oignon", "chou",
           "carotte", "pomme de terre", "potato", "onion", "okra", "aubergine", "brinjal"):
        return "Légumes & maraîchage"
    if has("coton", "cotton", "textile", "fashion", "vêtement", "garment", "tissu",
           "artisanat", "craft", "décor", "home", "stationery", "papier", "jouet", "bijou",
           "jewell", "ceramic", "poterie", "vannerie", "basket"):
        return "Textile, artisanat & décoration"
    if has("cosmétique", "beauty", "bien-être", "savon", "soap", "baume", "crème"):
        return "Cosmétiques naturels"
    if has("érable", "erable", "maple", "acéricole", "acericole"):
        return "Sirop d’érable & produits de l’érable"
    if has("sucre", "sugar", "panela", "sirop"):
        return "Sucre / panela"
    if has("fleur", "flower", "rose", "plante ornementale"):
        return "Fleurs & plantes"
    if has("vin", "wine", "raisin de cuve"):
        return "Vin"
    if has("quinoa", "céréale", "cereal", "riz", "rice", "paddy", "maïs", "maize", "blé",
           "wheat", "orge", "barley", "mil", "millet", "sorgho", "avoine", "kiwicha",
           "chia", "lin", "linseed"):
        return "Céréales & graines"
    if has("lait", "dairy", "fromage", "cheese", "œuf", "egg", "viande", "meat", "volaille",
           "poultry", "poisson", "fish", "crevette"):
        return "Élevage & produits animaliers"
    if has("transformation", "processed", "jus", "juice", "confiture", "jam", "chips",
           "farine", "flour", "séché", "dried", "torréfié", "roasted", "bière", "beer",
           "cacao en poudre"):
        return "Produits transformés"
    if not p:
        return "Non précisé"
    return "Autres produits agricoles"


def phase_of(country: str) -> int:
    if country in PHASE1 or country in ANCHOR_COUNTRIES:
        return 1
    if country in PHASE2:
        return 2
    return 3


def main() -> int:
    src = sys.argv[1] if len(sys.argv) > 1 else (
        DEFAULT_CSV if os.path.exists(DEFAULT_CSV) else ALT_CSV if os.path.exists(ALT_CSV) else None)
    if not src:
        print("ERREUR: CSV introuvable. Passer le chemin en argument.")
        return 1

    with open(src, newline="", encoding="utf-8-sig") as fh:
        rows = list(csv.DictReader(fh))

    today = date.today().isoformat()
    out = []
    exclus = 0
    for i, r in enumerate(rows, 1):
        if clef_dedup(r.get("Nom du producteur") or "") in DEJA_DANS_LE_PIPELINE:
            exclus += 1
            continue
        country = nettoie(r.get("Pays")) or "Non précisé"
        products = nettoie(r.get("Produits principaux"))
        category = cat_of(products or "")
        segment = SEGMENTS.get(category, "autres_produits")
        bio = (nettoie(r.get("Bio")) or "À vérifier")
        equitable = (nettoie(r.get("Équitable")) or "À vérifier")
        certif = nettoie(r.get("Certification"))
        source = nettoie(r.get("Source")) or "Annuaire public"
        website = nettoie(r.get("Site internet"))
        notes_parts = [
            f"Type : {nettoie(r.get('Type de producteur')) or 'non précisé'}.",
            f"Catégorie : {category}.",
            f"Bio : {bio}. Équitable : {equitable}." + (f" Certification : {certif}." if certif else " Certification : non trouvée."),
        ]
        if website:
            notes_parts.append(f"Site : {website}.")
        if nettoie(r.get("Adresse")):
            notes_parts.append(f"Adresse : {nettoie(r.get('Adresse'))}.")
        if nettoie(r.get("WhatsApp")):
            notes_parts.append(f"WhatsApp : {nettoie(r.get('WhatsApp'))}.")
        for key, label in (("Instagram", "Instagram"), ("Facebook", "Facebook")):
            if nettoie(r.get(key)):
                notes_parts.append(f"{label} : {nettoie(r.get(key))}.")
        if nettoie(r.get("Notes")):
            notes_parts.append(nettoie(r.get("Notes")))
        notes_parts.append(f"Source : {source}. Données publiques ; aucun champ inventé.")

        likely = [x.strip() for x in re.split(r"[,;/]", products or "") if x.strip()][:6]

        out.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_URL, f"ethimarket-producteur-{i}-{r.get('Nom du producteur','')}")),
            "external_id": f"PROD-{i:05d}",
            "catalog_only": True,
            "kind": "producer",
            "phase": phase_of(country),
            "segment": segment,
            "name": (nettoie(r.get("Nom du producteur")) or "Producteur non identifié"),
            "legal_name": None,
            "siren": None,
            "siret": None,
            "city": None,
            "region": nettoie(r.get("Région / Ville")),
            "country": country,
            "address": nettoie(r.get("Adresse")),
            "contact_name": nettoie(r.get("Contact / Responsable")),
            "contact_role": None,
            "email": nettoie(r.get("Email")),
            "phone": nettoie(r.get("Téléphone")),
            "website": website,
            "linkedin_url": nettoie(r.get("LinkedIn")),
            "likely_products": likely or None,
            "source": source,
            "legal_source_url": None,
            "contact_source_url": website,
            "verified_on": today,
            "legal_status": None,
            "data_origin": f"Annuaire public ({source})",
            "status": "a_contacter",
            "next_action": None,
            "next_action_date": None,
            "notes": " ".join(notes_parts),
            "contacted_at": None,
            "replied_at": None,
        })

    out.sort(key=lambda x: (x["phase"], x["country"], x["segment"], x["name"]))

    os.makedirs(os.path.dirname(OUT_PHASE[1]), exist_ok=True)
    for ph, path in OUT_PHASE.items():
        part = [x for x in out if x["phase"] == ph]
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(part, fh, ensure_ascii=False, separators=(",", ":"))
        print(f"OK  {path}  ({len(part)} producteurs, {os.path.getsize(path) / 1024:.0f} Ko)")

    stats = {}
    for rec in out:
        stats.setdefault(rec["phase"], []).append(rec)
    total_ko = sum(os.path.getsize(x) for x in OUT_PHASE.values()) / 1024
    print(f"OK  {len(out)} producteurs | {total_ko:.0f} Ko (3 fichiers par phase)"
          f" | {exclus} fiches déjà dans le pipeline CRM, non republiées")
    for ph in sorted(stats):
        lst = stats[ph]
        print(f"    phase {ph}: {len(lst):5d} | emails {sum(1 for x in lst if x['email']):5d} "
              f"| tél {sum(1 for x in lst if x['phone']):5d} | sites {sum(1 for x in lst if x['website']):4d} "
              f"| pays {len({x['country'] for x in lst})}")
    print("    PRODUCTION_TOTALS =", {ph: len(v) for ph, v in sorted(stats.items())})
    print("    NOUVEAUX_SEGMENTS =", json.dumps(NEW_SEGMENT_LABELS, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
