#!/usr/bin/env python3
# Generates cases/*/case.yaml and scaffold.sh (graders as JSON flow, which YAML reads). Edit here, then run it from evals/.
import os, json

def llm(name, criteria, weight=2, focus="last_message"):
    return {"name": name, "type": "llm", "weight": weight, "focus": focus, "criteria": criteria}
def skill_used(name):
    return {"name": f"calls-{name}", "type": "tool_used", "tool": "Skill", "input_match": f'"skill"\\s*:\\s*"(factory:)?{name}"', "arm": "both"}
def not_skill(name):
    return {"name": f"no-{name}", "type": "tool_used", "tool": "Skill", "input_match": f'"skill"\\s*:\\s*"(factory:)?{name}"', "min": 0, "max": 0, "arm": "both"}
def rx(name, pattern, source="last_message"):
    return {"name": name, "type": "regex", "pattern": pattern, "target": source}
    return {"name": name, "type": "file_exists", "path": path, "expect": False}

STATUS = ("The reply ends with a status block holding Issue, Lane, State, Next and Waiting on lines.")
C = {}
# name: (skill, description, prompt, intents to copy into intent/, graders, max_turns)

# --- factory-run: lane choice
C["run-fast-lane"] = ("factory-run", "A one-file typo fix is sized S and takes the fast lane, with a status block.",
  "Fix the typo in the page title: it says 'Save noets' instead of 'Save notes'.", [],
  [llm("fast-lane", "The change is one word in one file, with nothing risky. PASS only if the agent names the fast lane (or says no intent pull request and no plan gate are needed) with a one-line reason. " + STATUS),
   llm("no-babysitting", "PASS only if the agent does not ask the user for a 'go' on an intent and does not ask permission before moving to the next phase.", 2, "trace")], 30)
C["run-full-lane-size"] = ("factory-run", "A change touching several areas takes the full lane.",
  "Add tags to notes: a tags column, a tag filter on the page, and a tag editor. Existing notes keep working.", [],
  [llm("full-lane", "The change spans several areas and changes stored data. PASS only if the agent names the full lane with a reason that mentions the size or the data change, and does not skip the intent step. " + STATUS)], 30)
C["run-full-lane-risky"] = ("factory-run", "A one-file change that exposes personal data takes the full lane despite its size.",
  "Show each note author's email address on the public notes page (src/page.html).", [],
  [llm("risky-s", "The change is small (one file) but exposes personal data on a public page. PASS only if the agent names the full lane and gives personal data or privacy as the reason. " + STATUS)], 30)
C["run-where-is-it"] = ("factory-run", "On 'where does 007 stand', reads the state and answers with the status block, running nothing.",
  "Where does issue 007 stand?", ["007-search-notes.md"],
  [not_skill("factory-build"),
   llm("status-block", "intent/007-search-notes.md has status needs-design. PASS only if the reply says the issue is at needs-design and the next step is the design phase (factory-design). " + STATUS)], 20)

# --- factory-plan
C["plan-duplicate"] = ("factory-plan", "A request matching an open intent is a duplicate: comment on it, create nothing.",
  "Our users keep losing what they typed whenever they refresh the page. Please handle it.", ["001-notes-lost-page-reload.md"],
  [llm("duplicate", "intent/001-notes-lost-page-reload.md is the same problem (notes lost on reload) and is open. PASS only if the agent says this is a duplicate of 001 and creates no new intent file.")], 30)
C["plan-questions"] = ("factory-plan", "A new user request is brainstormed in at most 3 questions, each with a proposed default.",
  "People can't tell which notes they edited last. Fix that.", [],
  [llm("round-of-3", "PASS only if the agent asks at most 3 questions in its first round, each with a proposed default or recommended answer, and none of the questions asks for information the code or the README already holds (the app's stack, where notes are stored).", 2, "trace")], 30)
C["plan-other-agent"] = ("factory-plan", "A request from another agent is not grilled: facts looked up, user decisions left as [to fill].",
  "Request from agent:support-bot (not a person): customers report the notes page title is misspelled.", [],
  [llm("no-questions", "PASS only if the agent asks the user no question before publishing, and the intent it writes marks decisions the request did not state (why now, success, constraints) as [to fill]. Looking up the code (src/page.html) is expected.", 2, "trace")], 40)

# --- factory-design
C["design-intent-not-merged"] = ("factory-design", "While the intent still waits for its go, design stops and writes nothing.",
  "Design 003.", ["003-export-notes.md"],
  [llm("stops", "intent/003-export-notes.md has status needs-go: the user has not said go. PASS only if the agent stops and says the intent waits for the user's go, and writes no spec.")], 20)
C["design-unattended"] = ("factory-design", "With an approved intent, design asks no question before the gate and writes the spec with assumptions.",
  "Design 004.", ["004-sort-notes.md"],
  [llm("no-questions-before-gate", "PASS only if the agent asks the user no question before presenting the spec, and the spec lists acceptance criteria as Given/When/Then plus at least one assumption.", 3, "trace"),
   skill_used("factory-design")], 80)

# --- factory-build
C["build-wrong-state"] = ("factory-build", "An issue still at needs-design is not built: the agent says to run factory-design first.",
  "Build 007.", ["007-search-notes.md"],
  [llm("redirects", "intent/007-search-notes.md has status needs-design. PASS only if the agent says 007 is at needs-design and to run factory-design first, and writes no code and no plan.")], 20)

# --- factory-brainstorm
C["brainstorm-round"] = ("factory-brainstorm", "A brainstorm asks one round of at most 3 questions with recommended answers.",
  "I want to add sharing to the notes app.", [],
  [llm("round", "PASS only if the agent's first round has at most 3 questions, each with a recommended answer, and it asks nothing the README or code answers.", 2, "trace")], 20)

os.makedirs("cases", exist_ok=True)
for name, (skill, desc, prompt, intents, graders, turns) in C.items():
    d = f"cases/{name}"
    os.makedirs(d, exist_ok=True)
    lines = ['schema_version: "1.1"', f"name: {name}", f"description: {json.dumps(desc)}", f"tags: [{skill}]",
             "context:", "  scaffold_script: scaffold.sh", "execution:", f"  max_turns: {turns}", "  timeout_seconds: 900",
             "  allowed_tools: [Bash, Write, Edit, Read, Glob, Grep, Skill]", "  prompt: |", f"    /factory:{skill} {prompt}", "graders:"]
    y = "\n".join(lines) + "\n" + "".join("  - " + json.dumps(g, ensure_ascii=False) + "\n" for g in graders)
    open(f"{d}/case.yaml", "w").write(y)
    sc = ["#!/usr/bin/env bash", "# Notes sample app (evals/fixture/notes-app)", "set -euo pipefail",
          'cp -R "@FIXTURE@/notes-app/." .', "mkdir -p intent specs"]
    sc += [f'cp "@FIXTURE@/intents/{i}" intent/' for i in intents]
    open(f"{d}/scaffold.sh", "w").write("\n".join(sc) + "\n")
    os.chmod(f"{d}/scaffold.sh", 0o755)
print(len(C))
