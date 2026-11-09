#!/usr/bin/env python3
"""Create a company folder (an OKF bundle) under grc/ from the skeletons in ../templates.

Usage:
  new_company.py --name "Acme Bank" [--slug acme-bank] [--root grc] [--activate]
  new_company.py --list [--root grc]
  new_company.py --use acme-bank [--root grc]

Standard library only. Prints one JSON object with a "status":
  created | exists | listed | active | not_found | error
Never overwrites: an existing folder is reported, not touched.
Exit code: 0 ok, 1 error, 2 bad arguments, 3 folder already exists.
"""
import argparse
import datetime
import json
import re
import sys
import unicodedata
from pathlib import Path

TEMPLATES = Path(__file__).resolve().parent.parent / "templates"
ACTOR = "grc-init/1.0.0"
ACTIVE = ".active"
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def out(payload, code=0):
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    sys.exit(code)


def slugify(name):
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s


def companies(root):
    if not root.is_dir():
        return []
    return sorted(p.name for p in root.iterdir()
                  if p.is_dir() and (p / "COMPANY.md").is_file())


def active(root):
    f = root / ACTIVE
    return f.read_text().strip() if f.is_file() else None


def render(text, values):
    for key, val in values.items():
        text = text.replace("{{" + key + "}}", val)
    return text


def create(root, name, slug, activate):
    if not SLUG_RE.match(slug):
        out({"status": "error", "message": f"invalid slug '{slug}': use lowercase letters, digits and hyphens"}, 1)
    target = root / slug
    if target.exists():
        out({"status": "exists", "slug": slug, "path": str(target),
             "message": "folder already exists, nothing was changed"}, 3)
    now = datetime.datetime.now(datetime.timezone.utc)
    values = {"name": name.replace('"', "'"), "slug": slug, "actor": ACTOR,
              "now": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "day": now.strftime("%Y-%m-%d")}
    files = sorted(TEMPLATES.glob("*.md"))
    if not files:
        out({"status": "error", "message": f"no templates found in {TEMPLATES}"}, 1)
    target.mkdir(parents=True)
    for tpl in files:
        (target / tpl.name).write_text(render(tpl.read_text(), values))
    # The first company becomes active on its own; later ones only on request.
    set_active = activate or active(root) is None
    if set_active:
        (root / ACTIVE).write_text(slug + "\n")
    out({"status": "created", "slug": slug, "path": str(target),
         "files": [t.name for t in files], "active": active(root)})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name")
    ap.add_argument("--slug")
    ap.add_argument("--root", default="grc")
    ap.add_argument("--activate", action="store_true")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--use")
    a = ap.parse_args()
    root = Path(a.root)

    if a.list:
        out({"status": "listed", "companies": companies(root), "active": active(root)})
    if a.use:
        if a.use not in companies(root):
            out({"status": "not_found", "slug": a.use, "companies": companies(root)}, 1)
        root.mkdir(parents=True, exist_ok=True)
        (root / ACTIVE).write_text(a.use + "\n")
        out({"status": "active", "slug": a.use})
    if not a.name:
        ap.error("give --name, --list or --use")
    slug = a.slug or slugify(a.name)
    if not slug:
        out({"status": "error", "message": "could not derive a slug from the name, pass --slug"}, 2)
    create(root, a.name, slug, a.activate)


if __name__ == "__main__":
    main()
