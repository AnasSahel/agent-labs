"""Tests for new_company.py. Run: python3 -m unittest scripts/test_new_company.py -v"""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "new_company.py"
FILES = {"COMPANY.md", "REGULATIONS.md", "AUTHORITIES.md", "ORGANIZATION.md", "CERTIFICATIONS.md",
         "CONTRACTS.md", "SUPPLIERS.md", "ASSETS.md", "index.md", "log.md"}


def run(root, *args):
    p = subprocess.run([sys.executable, str(SCRIPT), "--root", str(root), *args],
                       capture_output=True, text=True)
    return p.returncode, json.loads(p.stdout)


class NewCompany(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name) / "grc"

    def tearDown(self):
        self.tmp.cleanup()

    def test_creates_all_files_and_slug(self):
        code, res = run(self.root, "--name", "Société Générale Été")
        self.assertEqual((code, res["status"], res["slug"]), (0, "created", "societe-generale-ete"))
        self.assertEqual({p.name for p in (self.root / res["slug"]).iterdir()}, FILES)

    def test_every_concept_has_okf_type_and_no_leftover_placeholder(self):
        _, res = run(self.root, "--name", "Acme")
        for f in (self.root / "acme").glob("*.md"):
            text = f.read_text()
            self.assertNotIn("{{", text, f.name)
            if f.name not in ("index.md", "log.md"):
                self.assertTrue(text.startswith("---\ntype: "), f.name)
                self.assertIn("generated: { by: \"grc-init/1.0.0\"", text, f.name)
        self.assertIn('okf_version: "0.2"', (self.root / "acme" / "index.md").read_text())

    def test_never_overwrites(self):
        run(self.root, "--name", "Acme")
        mine = self.root / "acme" / "COMPANY.md"
        mine.write_text("client edit")
        code, res = run(self.root, "--name", "Acme")
        self.assertEqual((code, res["status"]), (3, "exists"))
        self.assertEqual(mine.read_text(), "client edit")

    def test_first_company_active_second_only_on_request(self):
        run(self.root, "--name", "Acme")
        _, res = run(self.root, "--name", "Globex")
        self.assertEqual(res["active"], "acme")
        _, res = run(self.root, "--name", "Initech", "--activate")
        self.assertEqual(res["active"], "initech")

    def test_list_and_use(self):
        run(self.root, "--name", "Acme")
        run(self.root, "--name", "Globex")
        _, res = run(self.root, "--list")
        self.assertEqual(res["companies"], ["acme", "globex"])
        code, res = run(self.root, "--use", "globex")
        self.assertEqual((code, res["status"]), (0, "active"))
        code, res = run(self.root, "--use", "nope")
        self.assertEqual((code, res["status"]), (1, "not_found"))

    def test_bad_slug_rejected(self):
        code, res = run(self.root, "--name", "Acme", "--slug", "../evil")
        self.assertEqual((code, res["status"]), (1, "error"))
        self.assertFalse((self.root.parent / "evil").exists())


if __name__ == "__main__":
    unittest.main()
