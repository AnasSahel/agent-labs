#!/usr/bin/env python3
# Generates cases/*/case.yaml (graders as JSON flow, which YAML reads). Edit here, then run it from evals/.
import os, json
GRILL = ("It asks exactly one interview question, numbered `Q1/{b}` (the question budget is {b}), followed by a `Recommended:` answer whose reason cites a specific clause "
         "(for example `ISO 27001 A.5.24`, `NIS2 Art. 21(2)(b)`, `DORA Art. 17`, `GDPR Art. 33`), not only a framework name. "
         "It does not ask for the sector, the frameworks in scope or the risk appetite: grc/context.md already states them (payments fintech in France; ISO 27001, NIS2, DORA, GDPR; residual at most medium unless the CISO Sarah M. accepts in writing).")
def skill_used(name, n=None):
    g = {"name": f"calls-{name}", "type": "tool_used", "tool": "Skill", "input_match": f'"skill"\\s*:\\s*"(grc:)?{name}"', "arm": "both"}
    return g
def not_skill(name):
    return {"name": f"no-{name}", "type": "tool_used", "tool": "Skill", "input_match": f'"skill"\\s*:\\s*"(grc:)?{name}"', "min": 0, "max": 0, "arm": "both"}
def llm(name, criteria, weight=2, focus="last_message"):
    return {"name": name, "type": "llm", "weight": weight, "focus": focus, "criteria": criteria}
def rx(name, pattern, path=None, flags=None, source="file"):
    g = {"name": name, "type": "regex", "pattern": pattern}
    g["target"] = {"source": "file", "path": path} if path else source
    if flags: g["flags"] = flags
    return g
def fe(name, path): return {"name": name, "type": "file_exists", "path": path}

C = {}
# --- grc-router
C["router-vendor"] = ("grc-router", "Routes a single-supplier request to vendor-risk.", "We want to sign with PayFit for payroll next month. Is that safe for us?",
  [skill_used("vendor-risk"), not_skill("risk-register"), not_skill("risk-assessment")], 20)
C["router-register"] = ("grc-router", "Routes a view/filter request on the list of risks to risk-register.", "Which of our risks are overdue or above appetite?",
  [skill_used("risk-register"), not_skill("risk-assessment")], 20)
C["router-mapper"] = ("grc-router", "Routes a clause lookup to framework-mapper.", "Which ISO 27001 controls meet DORA Art. 19?",
  [skill_used("framework-mapper"), not_skill("gap-analysis")], 20)
C["router-attack-chain"] = ("grc-router", "Routes 'how does an attacker get from X to Y' to attack-chain.", "Could an attacker who phishes one of our admins end up changing our payment code?",
  [skill_used("attack-chain"), not_skill("risk-assessment")], 20)
C["router-raci"] = ("grc-router", "Routes 'who signs off on what' to raci-builder.", "Who should be accountable for incident response here, and who just gets informed?",
  [skill_used("raci-builder"), not_skill("policy-writer")], 20)
C["router-where-start"] = ("grc-router", "With no task, answers where the user stands from grc/ in a few lines and offers one next step, calling nothing.", "Where do we stand and what should I do next?",
  [not_skill("risk-register"), not_skill("gap-analysis"), not_skill("risk-assessment"), not_skill("committee-report"),
   llm("stands-and-next", "The org (Acme Pay) has a risk register with R-001 to R-004; R-002, R-003, R-004 are high with fixes not yet in place, so above the 'medium' appetite; R-001 was last updated 2026-01-10 and is past its due date 2026-06-30. PASS only if the reply: answers where they stand in a few lines grounded in these files (mentions risks above appetite or the register flags), offers exactly one next step that is the risk-register review or committee-report, and waits for the user instead of starting the work. It must not suggest starting with gap-analysis as if nothing existed.")], 20)
C["router-chain-audit"] = ("grc-router", "A multi-skill request gets a chain in flow order, announced before the first call.", "Our ISO 27001 certification audit is in March. Find what we're missing, assess the big gaps as risks, and get me a board summary.",
  [skill_used("gap-analysis"),
   
   llm("plan-in-flow-order", "PASS only if, before or at the first skill call, the agent states a plan that runs gap-analysis first, then risk-assessment on the big gaps, then committee-report last (risk-register may sit between). Order matters: committee-report must not come before gap-analysis. The plan is one or two lines, not a long essay. Judge from the whole transcript.", focus="trace")], 25)
# --- grc-grill
C["grill-standalone"] = ("grc-grill", "Standalone grill: one cited question within budget, trace written before the first question.", "Grill me on whether we should accept the residual risk on R-002 instead of buying security keys for the admins.",
  [llm("one-cited-question", "The user wants to be grilled on accepting a risk. " + GRILL.format(b="<budget>").replace("(the question budget is <budget>)", "(budget 10 for hard or 5 for light)") + " It also says in one line what intensity it inferred."),
   rx("trace-in-progress", r"status:\s*in progress", source="trace")], 25)
C["grill-resume"] = ("grc-grill", "Resumes an in-progress trace: keeps Q1-Q2, never re-asks them, continues at Q3.", "Let's continue grilling me on the backup policy scope.",
  [llm("resumes-at-q3", "An in-progress trace (grc/traces/2026-10-31-backup-scope.md) already settled Q1 (scope: AWS production and Microsoft 365) and Q2 (owner: Karim B.). PASS only if the reply says in one line what was already settled, does not ask again about scope or owner, and asks the next question numbered `Q3/5` with a `Recommended:` answer citing a specific clause.")], 25)
# --- risk-assessment
C["risk-new"] = ("risk-assessment", "A new risk goes to grc-grill (hard) and the first question is cited, never a fact the docs hold.", "Our support team shares one Zendesk admin login. Assess that risk.",
  [skill_used("grc-grill"), llm("first-question", "The agent frames a risk about a shared Zendesk admin account and starts grilling. " + GRILL.format(b="10"))], 30)
C["risk-duplicate"] = ("risk-assessment", "A reworded existing risk is matched by meaning to R-004 (reassessment, same id), not created again.", "A developer who left in the summer can still push to our payments repo. Assess it.",
  [llm("matches-r004", "The register already has R-004: a former developer with active GitHub write access to the payment service repo. PASS only if the agent recognises this request as the same risk as R-004 (reassessment of R-004, or asks once whether to reassess R-004 or start a new risk) and does not create a new id R-005 for it.", focus="trace"),
   {"name": "no-r005-row", "type": "regex", "pattern": r"\| R-005 \|", "target": {"source": "file", "path": "grc/risk-register.md"}, "match": "count:0"}], 30)
# --- risk-register
C["register-review"] = ("risk-register", "Review flags R-001 overdue and stale, R-002..R-004 above appetite, with a heat map, no grilling.", "Review our risk register.",
  [not_skill("grc-grill"), llm("flags", "Today is 2026-10-31. R-001 is due 2026-06-30, status treated (not closed), updated 2026-01-10. R-002, R-003, R-004 are high today (G4·V3, G3·V3, G4·V3) with residual medium once fixes land, none accepted; appetite is medium. PASS only if the reply: flags R-001 as overdue and stale (over 90 days), flags R-002, R-003 and R-004 as above appetite (and asks for or suggests interim acceptance by the CISO), shows a portfolio heat map (4x4 grid of severity by likelihood, as a table or a drawing) with the risk ids in cells, and writes dates with the year.", focus="trace")], 25)
C["register-update"] = ("risk-register", "Updates only the owner of R-003, sets Updated, and logs the change with the user's words.", "Make Julie P. the owner of R-003 — she takes over from the HR Director as of today.",
  [rx("owner-changed", r"\| R-003 \|[^\n]*\| Julie P\. \|", path="grc/risk-register.md"),
   rx("updated-today", r"\| R-003 \|[^\n]*\| 2026-10-31 \|", path="grc/risk-register.md"),
   rx("scores-untouched", r"\| R-003 \|[^\n]*G3·V3 high[^\n]*G3·V1 medium", path="grc/risk-register.md"),
   rx("change-logged", r"Julie P\.", path="grc/traces/2026-10-31-register.md")], 20)
# --- framework-mapper
C["mapper-clause"] = ("framework-mapper", "Looks up DORA Art. 19 with crosswalk.py and gives the rows as they come, partial fits with their extras.", "Which ISO 27001 controls meet DORA Art. 19, and what else does DORA ask there that ISO doesn't?",
  [{"name": "runs-crosswalk", "type": "tool_used", "tool": "Bash", "input_match": r"crosswalk\.py"}, not_skill("grc-grill"),
   llm("answer-from-files", "PASS only if the reply opens with a one-line answer, lists the ISO 27001 refs DORA Art. 19 maps to in a table, shows any partial fit together with its extras (the DORA-only duties such as reporting deadlines), and does not ask the user any question.")], 15)
C["mapper-not-mapped"] = ("framework-mapper", "A clause the files don't hold is said 'not mapped', never filled from memory.", "What ISO 27001 controls cover HIPAA §164.312(b)?",
  [llm("not-mapped", "HIPAA has no mapping file in frameworks/. PASS only if the reply says plainly that HIPAA (or that clause) is not mapped, and does not list ISO 27001 controls for it from memory as if they were a mapping. Pointing to how to add a mapping file is fine.")], 15)
# --- gap-analysis
C["gap-nis2"] = ("gap-analysis", "Builds the checklist from the files and reaches its light grill with a cited question.", "Run a gap analysis against NIS2 for us.",
  [   llm("progress-or-question", "PASS only if the agent works from the framework files (frameworks/nis2.md and iso27001.md) and either reaches a light grill question numbered `Q1/5` with a `Recommended:` answer citing a specific clause, or delivers coverage results. It must not ask for the frameworks in scope or the sector, which grc/context.md states.", focus="trace")], 45)
# --- vendor-risk
C["vendor-new"] = ("vendor-risk", "Tiers a payroll SaaS from the facts given, then a light cited grill.", "Assess PayFit before we sign: they'd run our payroll with all staff personal and bank data. They sent an ISO 27001 certificate.",
  [skill_used("grc-grill"), llm("tier-and-question", "PASS only if the agent works from the tier facts given (staff personal and bank data, payroll as a key process): it either states a provisional tier with that reason, or its first question settles a tier fact that is still open (how PayFit connects, how hard it is to replace, or the evidence itself); it treats the ISO 27001 certificate as counting only if its scope covers the service, and asks a grill question numbered `Q1/5` with a `Recommended:` answer citing a specific clause (e.g. DORA Art. 28, ISO 27001 A.5.19/A.5.20, GDPR Art. 28). It does not ask for the sector or frameworks in scope.", focus="trace")], 30)
# --- attack-chain
C["chain-find"] = ("attack-chain", "Finds a chain through register risks (needs/gives) and grills light with a cited question.", "Look for attack chains across our risks.",
  [llm("chain-found", "The register holds R-002 (admin phishing into AWS production), R-003 (payroll provider link into HR, fake hire provisioned) and R-004 (former dev GitHub write to payment code). PASS only if the agent proposes at least one chain of 2 to 4 of these risks where what the attacker gains in one is the way into the next, says what it ends at, and then either asks a grill question numbered `Q1/5` with a `Recommended:` answer citing a clause, or presents the scored chain. It must not invent risk ids that are not in the register.", focus="trace")], 30)
# --- committee-report
C["committee"] = ("committee-report", "Reads the register and grills light on audience/decisions, flagging risks above appetite.", "Prepare the risk committee report for our 15 November 2026 meeting.",
  [skill_used("grc-grill"), llm("question-on-decisions", "PASS only if the transcript shows the agent read the register (R-001..R-004), names or counts the risks above appetite (R-002, R-003, R-004), and asks a light grill question numbered `Q1/5` with a `Recommended:` answer citing a clause, about the audience, period or decisions to ask for. It does not ask for the meeting date (given: 15 November 2026).", focus="trace")], 30)
# --- policy-writer
C["policy-new"] = ("policy-writer", "A new policy goes to a hard grill with a cited first question.", "Write our incident response policy.",
  [skill_used("grc-grill"), llm("first-question", "The agent starts an incident response policy. " + GRILL.format(b="10") + " A good first question is about scope, owner or approver, or a rule that is the user's to decide (e.g. the NIS2 Art. 23 24-hour early warning)."), ], 30)
C["policy-review-by-meaning"] = ("policy-writer", "'IAM policy' is matched by meaning to the existing access-control policy (review, not a new one).", "Review our IAM policy.",
  [llm("finds-access-control", "grc/policies/access-control.md (v2.1) exists; there is no file named IAM. PASS only if the agent treats 'IAM policy' as that access control policy and reviews it (or asks to confirm that one), rather than writing a brand-new IAM policy.", focus="trace")], 30)
# --- raci-builder
C["raci-ir"] = ("raci-builder", "Drafts IR activities from duties.md and grills hard on accountability with a cited question.", "Build a RACI for incident response.",
  [skill_used("grc-grill"), llm("first-question", "The agent starts an incident response RACI. " + GRILL.format(b="10") + " The first question is a decision the user is accountable for (scope of the matrix, or who is accountable or responsible for an activity), not a minor detail.")], 30)
# --- audit-evidence
C["evidence-file"] = ("audit-evidence", "Files a piece of evidence against the controls it proves, with a hash and an expiry, no grilling.", "File inbox/mfa-conditional-access-export.txt as audit evidence.",
  [not_skill("grc-grill"), rx("index-has-a85", r"A\.8\.5", path="grc/evidence/index.md"),
   rx("index-has-hash", r"[0-9a-f]{64}", path="grc/evidence/index.md"),
   llm("filed", "PASS only if the reply says the MFA export was filed against ISO 27001 A.8.5 (secure authentication; A.5.17 also acceptable alongside), with an expiry or validity date, and shows the coverage headline or map.", focus="trace")], 20)
C["evidence-unproven"] = ("audit-evidence", "Catches controls the register calls in place with no evidence behind them.", "Which of our controls can we actually prove for the ISO 27001 audit?",
  [not_skill("grc-grill"), llm("unproven", "There is no grc/evidence/ folder in the sample. R-001 is 'treated' with control A.8.20, so the register implies it is in place. PASS only if the reply says no evidence is filed yet (nothing is proven), flags controls the register relies on with no proof (A.8.20 at least, or the controls of treated risks), and proposes requests to control owners or a next step. It must not claim any control is evidenced.", focus="trace")], 20)

for name, (skill, desc, prompt, graders, turns) in C.items():
    d = f"cases/{name}"
    lines = ['schema_version: "1.1"', f"name: {name}", f"description: {json.dumps(desc)}", f"tags: [{skill}]",
             "context:", "  scaffold_script: scaffold.sh", "execution:", f"  max_turns: {turns}", "  timeout_seconds: 600",
             "  allowed_tools: [Bash, Write, Edit, Read, Glob, Grep, Skill]", "  prompt: |", f"    /grc:{skill} {prompt}", "graders:"]
    y = "\n".join(lines) + "\n" + "".join("  - " + json.dumps(g, ensure_ascii=False) + "\n" for g in graders)
    open(f"{d}/case.yaml", "w").write(y)
print(len(C))
