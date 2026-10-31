#!/usr/bin/env python3
# Check every clause the agent cited in an eval run against the fixed files in frameworks/.
# Reads result.json from run.sh (needs --keep-temp so each run's trace.jsonl survives), scans the
# agent's replies and the files it wrote, and flags an ISO 27001 ref not in iso27001.md, or a
# NIS2 / DORA / GDPR article that its file doesn't hold.
# Usage: evals/check-citations.py <results dir> [--json out.json]
import json, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")
FW = os.path.join(ROOT, "frameworks")
iso = open(os.path.join(FW, "iso27001.md")).read()
iso_refs = set(re.findall(r"^\| (A\.\d+\.\d+|\d+\.\d+(?:\.\d+)?) \|", iso, re.M))
def articles(text):
    out = set(re.findall(r"Art\. (\d+)", text))
    for a, b in re.findall(r"Art\. (\d+) to (\d+)", text):  # "Art. 37 to 39"
        out |= {str(n) for n in range(int(a), int(b) + 1)}
    return out
arts = {fw: articles(open(os.path.join(FW, f"{fw}.md")).read()) for fw in ("nis2", "dora", "gdpr")}
NAMES = {"nis2": "NIS2", "dora": "DORA", "gdpr": "GDPR"}

def texts(trace):
    for line in open(trace):
        o = json.loads(line)
        if o.get("type") != "assistant":
            continue
        for c in o["message"].get("content", []):
            if c.get("type") == "text":
                yield c["text"]
            elif c.get("type") == "tool_use" and c["name"] in ("Write", "Edit"):
                yield c["input"].get("content") or c["input"].get("new_string") or ""

def check(trace):
    cited, bad = set(), set()
    for t in texts(trace):
        for ref in re.findall(r"\bA\.\d+\.\d+\b", t):
            cited.add(ref)
            if ref not in iso_refs:
                bad.add(ref)
        for fw, name in NAMES.items():
            for a in re.findall(rf"{name}\s+(?:Art(?:icle|\.)?\s*)(\d+)", t):
                cited.add(f"{name} Art. {a}")
                if a not in arts[fw]:
                    bad.add(f"{name} Art. {a}")
    return sorted(cited), sorted(bad)

res_dir = sys.argv[1]
d = json.load(open(os.path.join(res_dir, "result.json")))
out = {}
for case in d["cases"]:
    for i, run in enumerate(case["arms"]["with"]):
        tp = run.get("tracePath")
        if not tp or not os.path.exists(tp):
            out[f"{case['name']}#{i}"] = {"error": "no trace (run with --keep-temp)"}
            continue
        cited, bad = check(tp)
        out[f"{case['name']}#{i}"] = {"cited": len(cited), "unknown": bad}
for k, v in out.items():
    print(f"{'FAIL' if v.get('unknown') or v.get('error') else 'ok  '} {k}: {v}")
json.dump(out, open(os.path.join(res_dir, "citations.json"), "w"), indent=1)
sys.exit(1 if any(v.get("unknown") for v in out.values()) else 0)
