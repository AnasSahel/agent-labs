#!/usr/bin/env python3
"""Offline tests for fetch_company.py against a local mock of the API. Run: python3 -I test_fetch_company.py"""
import json
import os
import subprocess
import sys
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "fetch_company.py")

FULL = {"siren": "552032534", "nom_complet": "DANONE", "nom_raison_sociale": "DANONE", "nature_juridique": "5599",
        "activite_principale": "70.10Z", "tranche_effectif_salarie": "41", "annee_tranche_effectif_salarie": "2022",
        "date_creation": "1899-01-01", "etat_administratif": "A", "nombre_etablissements": 3, "nombre_etablissements_ouverts": 2,
        "siege": {"siret": "55203253400646", "adresse": "17 BD HAUSSMANN", "code_postal": "75009", "libelle_commune": "PARIS 9"},
        "finances": {"2022": {"ca": 100, "resultat_net": 5}, "2023": {"ca": 120, "resultat_net": None}},
        "dirigeants": [{"siren": "123456782", "denomination": "HOLDING SA", "qualite": "President"}, {"nom": "DUPONT", "prenoms": "Jeanne", "qualite": "DG"}]}
NOFIN = dict(FULL, siren="732829320", nom_complet="PETITE SARL", finances=None, tranche_effectif_salarie=None, dirigeants=[])
STATE = {"hits429": 0}


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        q = parse_qs(urlparse(self.path).query).get("q", [""])[0]
        if q == "ratelimit" and STATE["hits429"] == 0:
            STATE["hits429"] = 1
            self.send_response(429); self.send_header("Retry-After", "1"); self.end_headers(); return
        if q == "alwaysdown":
            self.send_response(503); self.end_headers(); return
        res = {"552032534": [FULL], "732829320": [NOFIN], "ratelimit": [FULL], "dupe": [FULL, NOFIN], "single": [NOFIN]}.get(q, [])
        body = json.dumps({"results": res, "total_results": len(res)}).encode()
        self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(body)


def run(*args, url=None):
    env = dict(os.environ, COMPANY_API_URL=url)
    p = subprocess.run([sys.executable, "-I", SCRIPT, *args], capture_output=True, text=True, env=env)
    return p.returncode, json.loads(p.stdout)


class T(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.srv = HTTPServer(("127.0.0.1", 0), H)
        threading.Thread(target=cls.srv.serve_forever, daemon=True).start()
        cls.url = f"http://127.0.0.1:{cls.srv.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.srv.shutdown()

    def test_ok_with_figures(self):
        code, d = run("--siren", "552032534", url=self.url)
        self.assertEqual((code, d["status"]), (0, "ok"))
        fin = d["company"]["size"]["financials"]
        self.assertTrue(fin["published"])
        self.assertEqual(fin["years"][0]["year"], "2023")
        self.assertIsNone(fin["years"][0]["net_result_eur"])  # null stays null, never 0
        self.assertEqual(d["company"]["size"]["headcount_band"], "500-999")
        self.assertEqual(d["company"]["group_hints"][0]["siren"], "123456782")

    def test_missing_financials_flagged_not_zero(self):
        code, d = run("--siren", "732829320", url=self.url)
        fin = d["company"]["size"]["financials"]
        self.assertFalse(fin["published"]); self.assertEqual(fin["years"], []); self.assertIn("not_available", fin["flag"])
        self.assertIsNone(d["company"]["size"]["headcount_band"]); self.assertEqual(d["company"]["size"]["headcount_flag"], "not_available")

    def test_multiple_matches(self):
        code, d = run("--name", "dupe", url=self.url)
        self.assertEqual((code, d["status"], len(d["candidates"])), (0, "multiple_matches", 2))

    def test_single_name_match(self):
        self.assertEqual(run("--name", "single", url=self.url)[1]["status"], "ok")

    def test_no_match(self):
        self.assertEqual(run("--name", "zzz", url=self.url)[1]["status"], "no_match")
        self.assertEqual(run("--siren", "552032534x", url=self.url)[0], 1)

    def test_bad_siren(self):
        code, d = run("--siren", "123456789", url=self.url)
        self.assertEqual((code, d["status"]), (1, "error"))

    def test_rate_limit_retries_once(self):
        STATE["hits429"] = 0
        code, d = run("--name", "ratelimit", url=self.url)
        self.assertEqual((code, d["status"]), (0, "ok"))

    def test_server_down_is_clear_error(self):
        code, d = run("--name", "alwaysdown", url=self.url)
        self.assertEqual((code, d["status"]), (1, "error")); self.assertIn("503", d["message"])

    def test_unreachable(self):
        code, d = run("--name", "x", url="http://127.0.0.1:9")
        self.assertEqual((code, d["status"]), (1, "error"))

    def test_bad_args(self):
        p = subprocess.run([sys.executable, "-I", SCRIPT], capture_output=True, text=True)
        self.assertEqual(p.returncode, 2)


if __name__ == "__main__":
    unittest.main()
