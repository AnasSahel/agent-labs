#!/usr/bin/env python3
"""Fetch a French company from recherche-entreprises.api.gouv.fr and print clean JSON.

Usage:
  fetch_company.py --siren 123456789
  fetch_company.py --name "Acme" [--include-closed]

Standard library only. Always prints one JSON object with a "status":
  ok | multiple_matches | no_match | error
Exit code: 0 for the first three, 1 for error, 2 for bad arguments.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE_URL = os.environ.get("COMPANY_API_URL", "https://recherche-entreprises.api.gouv.fr")
USER_AGENT = "agent-labs-company-profiling/1.0 (+https://github.com/AnasSahel/agent-labs)"
SOURCE = "recherche-entreprises.api.gouv.fr"
MAX_CANDIDATES = 10

# INSEE headcount bands (tranche_effectif_salarie). "NN" = unit with no employees.
HEADCOUNT_BANDS = {
    "NN": "no employees", "00": "0", "01": "1-2", "02": "3-5", "03": "6-9",
    "11": "10-19", "12": "20-49", "21": "50-99", "22": "100-199", "31": "200-249",
    "32": "250-499", "41": "500-999", "42": "1000-1999", "51": "2000-4999",
    "52": "5000-9999", "53": "10000+",
}
# Only the legal-form codes we are sure of; any other stays a bare code to confirm.
LEGAL_FORMS = {
    "1000": "Entrepreneur individuel", "5498": "EURL", "5499": "SARL",
    "5710": "SAS", "5720": "SASU", "9220": "Association declaree",
}


class ApiError(Exception):
    pass


def out(payload, code=0):
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    sys.exit(code)


def valid_siren(s):
    """9 digits and Luhn checksum (La Poste's 356000000 family is exempt)."""
    if not (s.isdigit() and len(s) == 9):
        return False
    if s.startswith("356000000"):
        return True
    total = 0
    for i, ch in enumerate(reversed(s)):
        d = int(ch)
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        total += d
    return total % 10 == 0


def get(path, params):
    url = f"{BASE_URL}{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    last = None
    for attempt in (1, 2):  # one retry
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt == 1:
                try:
                    wait = min(float(e.headers.get("Retry-After", "2")), 15)
                except ValueError:
                    wait = 2
                time.sleep(wait)
                last = "rate limited (HTTP 429), retried once"
                continue
            if e.code >= 500 and attempt == 1:
                time.sleep(2)
                last = f"server error (HTTP {e.code}), retried once"
                continue
            if e.code == 429:
                raise ApiError("Rate limited by the API (HTTP 429) even after one retry. Wait a minute and run again.")
            raise ApiError(f"API answered HTTP {e.code}.")
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if attempt == 1:
                time.sleep(2)
                last = f"network error ({e}), retried once"
                continue
            raise ApiError(f"Cannot reach {SOURCE}: {e}. Check the network allowlist.")
        except json.JSONDecodeError:
            raise ApiError("The API returned something that is not JSON.")
    raise ApiError(last or "Unknown API failure.")


def address(e):
    if not e:
        return None
    return {
        "siret": e.get("siret"),
        "address": e.get("adresse") or e.get("geo_adresse"),
        "postal_code": e.get("code_postal"),
        "city": e.get("libelle_commune"),
    }


def candidate(r):
    s = r.get("siege") or {}
    return {
        "name": r.get("nom_complet"),
        "siren": r.get("siren"),
        "city": s.get("libelle_commune"),
        "postal_code": s.get("code_postal"),
        "activity_naf": r.get("activite_principale"),
        "administrative_status": r.get("etat_administratif"),
    }


def finances(r):
    """Per-year turnover and net result. Never zero when missing: null + flag."""
    fin = r.get("finances")
    if not isinstance(fin, dict) or not fin:
        return {
            "published": False,
            "flag": "not_available: no figures in this source (accounts confidential, not yet filed, or not covered)",
            "years": [],
        }
    years = []
    for year in sorted(fin, reverse=True):
        v = fin[year] or {}
        years.append({
            "year": year,
            "turnover_eur": v.get("ca"),
            "net_result_eur": v.get("resultat_net"),
            "source": SOURCE,
        })
    return {"published": True, "flag": None, "years": years}


def group_hints(r):
    hints = []
    for d in r.get("dirigeants") or []:
        if d.get("siren"):  # a legal entity is a director: typical parent / holding signal
            hints.append({
                "type": "legal_entity_director",
                "name": d.get("denomination"),
                "siren": d.get("siren"),
                "role": d.get("qualite"),
                "status": "to confirm",
            })
    cat = r.get("categorie_entreprise")
    if cat in ("ETI", "GE"):
        hints.append({"type": "insee_category", "detail": cat, "status": "to confirm"})
    return hints


def clean(r):
    s = r.get("siege") or {}
    band = r.get("tranche_effectif_salarie")
    code = str(r.get("nature_juridique")) if r.get("nature_juridique") is not None else None
    directors = []
    for d in r.get("dirigeants") or []:
        if d.get("siren"):
            directors.append({"type": "legal_entity", "name": d.get("denomination"), "siren": d.get("siren"), "role": d.get("qualite")})
        else:
            directors.append({"type": "person", "name": " ".join(x for x in (d.get("prenoms"), d.get("nom")) if x), "role": d.get("qualite")})
    return {
        "identity": {
            "legal_name": r.get("nom_raison_sociale") or r.get("nom_complet"),
            "display_name": r.get("nom_complet"),
            "siren": r.get("siren"),
            "legal_form_code": code,
            "legal_form": LEGAL_FORMS.get(code) if code else None,
            "creation_date": r.get("date_creation"),
            "administrative_status": r.get("etat_administratif"),  # A active, C ceased
            "head_office": address(s),
        },
        "activity": {
            "naf_code": r.get("activite_principale"),
            "naf_nomenclature": r.get("nomenclature_activite_principale"),  # e.g. NAFRev2 or NAF2025, when the API gives it
            "section": r.get("section_activite_principale"),
        },
        "size": {
            "headcount_band_code": band,
            "headcount_band": HEADCOUNT_BANDS.get(band) if band else None,
            "headcount_year": r.get("annee_tranche_effectif_salarie"),
            "headcount_flag": None if band else "not_available",
            "insee_category": r.get("categorie_entreprise"),  # PME / ETI / GE, a hint only
            "insee_category_year": r.get("annee_categorie_entreprise"),
            "establishments_total": r.get("nombre_etablissements"),
            "establishments_open": r.get("nombre_etablissements_ouverts"),
            "financials": finances(r),
            "balance_sheet_total": {
                "value": None,
                "flag": "not_in_this_source (needs INPI annual accounts)",
            },
        },
        "directors": directors,
        "group_hints": group_hints(r),
        "source": {"name": SOURCE, "fetched": time.strftime("%Y-%m-%d")},
    }


def by_siren(siren):
    if not valid_siren(siren):
        out({"status": "error", "message": f"'{siren}' is not a valid SIREN (9 digits, Luhn checksum)."}, 1)
    data = get("/search", {"q": siren, "per_page": 1})
    results = data.get("results") or []
    hit = next((r for r in results if r.get("siren") == siren), None)
    if not hit:
        out({"status": "no_match", "query": siren, "message": "No company with this SIREN."})
    out({"status": "ok", "matched_by": "siren", "company": clean(hit)})


def by_name(name, include_closed):
    params = {"q": name, "per_page": MAX_CANDIDATES}
    if not include_closed:
        params["etat_administratif"] = "A"
    data = get("/search", params)
    results = data.get("results") or []
    if not results:
        out({"status": "no_match", "query": name,
             "message": "No active company found. Try the legal name, a SIREN, or --include-closed."})
    if len(results) == 1:
        out({"status": "ok", "matched_by": "name", "company": clean(results[0])})
    norm = name.strip().casefold()
    cands = []
    for r in results:
        c = candidate(r)
        names = {str(x).casefold() for x in (r.get("nom_complet"), r.get("nom_raison_sociale"), r.get("sigle")) if x}
        c["exact_name_match"] = norm in names
        cands.append(c)
    out({"status": "multiple_matches", "query": name, "total_results": data.get("total_results"),
         "candidates": cands,
         "message": "Several entities match. Ask the user to pick one, then run again with --siren."})


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--siren", help="9-digit SIREN")
    g.add_argument("--name", help="company name")
    p.add_argument("--include-closed", action="store_true", help="name search: also return ceased companies")
    try:
        args = p.parse_args()
    except SystemExit as e:
        sys.exit(2 if e.code else 0)
    try:
        if args.siren:
            by_siren(args.siren.replace(" ", ""))
        else:
            by_name(args.name, args.include_closed)
    except ApiError as e:
        out({"status": "error", "message": str(e)}, 1)


if __name__ == "__main__":
    main()
