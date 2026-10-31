#!/usr/bin/env python3
# Read the fixed mapping files in frameworks/ (next to this script) and print what they say, nothing more.
# Usage: crosswalk.py [--frameworks nis2,dora] [--format md|csv|json] <query>
#   matrix                 every ISO 27001 ref, one column per framework: the clauses that cite it
#   ref A.8.5 [A.5.24...]  the clauses of each framework that cite these ISO refs
#   clause nis2 "Art. 23"  that clause's ISO refs and fit, its extras, and the other frameworks sharing those refs
#   register <file>        each framework's clauses touched by the register's controls, and those untouched
#   find <words>           ISO refs whose title holds every word (to turn "MFA" into A.8.5, read the titles)
import argparse, csv, glob, json, os, re, sys

HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frameworks")

def table(text, section):
    m = re.search(rf"^## {section}.*?\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    out = []
    for line in (m.group(1) if m else "").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if line.startswith("|") and not set(cells[0]) <= set("-:") and cells[0] not in ("Clause", "Ref"):
            out.append(cells)
    return out

def front(text):
    return dict(re.findall(r"^(\w+): (.*)$", text.split("\n---", 1)[0], re.M))

def load(ids):
    iso = open(os.path.join(HERE, "iso27001.md")).read()
    titles = {r[0]: r[1] for s in ("Clauses", "Annex A") for r in table(iso, s)}
    fws = {}
    for path in sorted(glob.glob(os.path.join(HERE, "*.md"))):
        fid = os.path.basename(path)[:-3]
        if fid == "iso27001" or (ids and fid not in ids):
            continue
        text = open(path).read()
        mapping = [dict(clause=r[0], requirement=r[1], iso=r[2].split(", "), fit=r[3]) for r in table(text, "Mapping")]
        extras = [dict(clause=r[0], duty=r[1], why=r[2]) for r in table(text, "Extras")]
        fws[fid] = dict(meta=front(text), mapping=mapping, extras=extras)
    missing = sorted(set(ids or []) - set(fws))
    return titles, fws, missing

art = lambda c: (re.match(r"Art\. \d+", c) or re.match(r".*", c)).group(0)

def extras_for(fw, clause):
    # same rule as scripts/check-frameworks: an extra on the same clause, article or a sub-clause
    hit = lambda c: c == clause or art(c) == art(clause) or c.startswith(clause + ".")
    return [e for e in fw["extras"] if any(hit(c) for c in e["clause"].split(", "))]

def emit(rows, cols, fmt, out=sys.stdout):
    if fmt == "json":
        json.dump(rows, out, indent=2, ensure_ascii=False); out.write("\n")
    elif fmt == "csv":
        w = csv.DictWriter(out, cols); w.writeheader(); w.writerows(rows)
    else:
        out.write("| " + " | ".join(cols) + " |\n|" + "---|" * len(cols) + "\n")
        for r in rows:
            out.write("| " + " | ".join(str(r.get(c, "")) for c in cols) + " |\n")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--frameworks", default="")
    p.add_argument("--format", default="md", choices=["md", "csv", "json"])
    p.add_argument("query", nargs="+")
    a = p.parse_args()
    ids = [f for f in a.frameworks.split(",") if f and f != "iso27001"]
    titles, fws, missing = load(ids)
    for m in missing:
        print(f"no mapping file for {m}: not mapped", file=sys.stderr)
    for fid, fw in fws.items():
        print(f"{fid}: checked {fw['meta'].get('checked', '?')}, status {fw['meta'].get('status', 'final')}", file=sys.stderr)
    cmd, args = a.query[0], a.query[1:]

    if cmd in ("matrix", "ref"):
        refs = list(titles) if cmd == "matrix" else args
        for r in refs:
            if r not in titles:
                sys.exit(f"{r} is not in iso27001.md")
        rows = []
        for r in refs:
            row = {"ISO 27001": r, "Title": titles[r]}
            for fid, fw in fws.items():
                row[fid] = ", ".join(f"{m['clause']} ({m['fit']})" for m in fw["mapping"] if r in m["iso"])
            rows.append(row)
        emit(rows, ["ISO 27001", "Title"] + list(fws), a.format)
        if cmd == "matrix" and a.format == "md":
            print("\n## Extras (no ISO 27001 control carries them)\n")
            emit([dict(Framework=fid, **{k.capitalize(): v for k, v in e.items()}) for fid, fw in fws.items() for e in fw["extras"]],
                 ["Framework", "Clause", "Duty", "Why"], a.format)

    elif cmd == "clause":
        fid, wanted = args[0], " ".join(args[1:])
        if fid not in fws:
            sys.exit(f"no mapping file for {fid}")
        hits = [m for m in fws[fid]["mapping"] if m["clause"] == wanted or art(m["clause"]) == wanted]
        extras = extras_for(fws[fid], wanted)
        if not hits and not extras:
            sys.exit(f"{fid} {wanted}: not in {fid}.md")
        rows = []
        for m in hits:
            for r in m["iso"]:
                others = "; ".join(f"{o} {x['clause']}" for o, ofw in fws.items() if o != fid for x in ofw["mapping"] if r in x["iso"])
                rows.append({"Clause": m["clause"], "Fit": m["fit"], "ISO 27001": r, "Title": titles[r], "Also in": others})
        emit(rows, ["Clause", "Fit", "ISO 27001", "Title", "Also in"], a.format)
        if extras and a.format == "md":
            print("\n## Extras\n")
            emit([{k.capitalize(): v for k, v in e.items()} for e in extras], ["Clause", "Duty", "Why"], a.format)

    elif cmd == "register":
        text = open(args[0]).read()
        hdr = next((l for l in text.splitlines() if l.startswith("| ID")), None)
        if not hdr:
            sys.exit(f"{args[0]}: no register table")
        col = [c.strip() for c in hdr.strip("|").split("|")].index("Controls (ISO 27001)")
        held = {}
        for line in text.splitlines():
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if re.match(r"R-\d+", cells[0]) and len(cells) > col:
                for r in re.findall(r"\b(?:A\.\d+\.\d+|\d+\.\d+(?:\.\d+)?)\b", cells[col]):
                    held.setdefault(r, set()).add(cells[0])
        unknown = sorted(r for r in held if r not in titles)
        for r in unknown:
            print(f"register cites {r}, not in iso27001.md", file=sys.stderr)
        rows = []
        for fid, fw in fws.items():
            for m in fw["mapping"]:
                hit = [r for r in m["iso"] if r in held]
                risks = sorted({x for r in hit for x in held[r]})
                state = "untouched" if not hit else ("touched, extras open" if m["fit"] == "partial" else "touched")
                rows.append({"Framework": fid, "Clause": m["clause"], "Fit": m["fit"], "State": state,
                             "Controls": ", ".join(hit), "Risks": ", ".join(risks)})
        emit(rows, ["Framework", "Clause", "Fit", "State", "Controls", "Risks"], a.format)

    elif cmd == "find":
        words = [w.lower() for w in args]
        rows = [{"ISO 27001": r, "Title": t} for r, t in titles.items() if all(w in t.lower() for w in words)]
        emit(rows, ["ISO 27001", "Title"], a.format)

    else:
        sys.exit(f"unknown query {cmd}: matrix, ref, clause, register or find")

main()
