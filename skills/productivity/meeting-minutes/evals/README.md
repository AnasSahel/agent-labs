# meeting-minutes: test cases

Run each case on a fresh session. Every check must pass. Fixtures are in `fixtures/`.

| # | Input | Checks |
|---|---|---|
| 1 | `steerco-en.md` | Proposes `steering-committee` with the reason. Status amber and cutover 6 Dec in `Status`. Decision: go with 6 Dec, decided by Maria. Risk has owner `TBC`, not invented. Action: Priya, load test plan, Friday date resolved from the meeting date or asked. Asks the output format last, recommends `docx`. |
| 2 | `sync-fr.md` | Minutes in French. Proposes `team-sync`. Leo under absent. "Mise en prod jeudi" is **not** a decision (opinion, "à confirmer"): it goes to open questions or is asked. Action: Karim, SMTP, date asked. |
| 3 | `thin.md` | Asks up to 3 questions before proposing a type. Writes no decision or action it was not told. |
| 4 | `audit-en.md` | Proposes `audit-compliance`. Findings keep the auditor's severity (minor NC, observation). No control id cited unless named: `clause to confirm`. Evidence requests become actions (Nadia, 7 Nov). Mentions `audit-evidence` only if `grc/` exists. |
| 5 | any, user says "it's a 1:1" | Switches type without arguing, uses `one-to-one`, adds the private-file line. |
| 6 | any, then `md` chosen | Saves `minutes/<date>-<type>-<slug>.md`. Email text is at most 150 words with a `Subject:` line. Clipboard command tried; if none exists, the email is printed in a code block and says so. |
| 8 | `sync-fr.md` | Asks one header question (time, place, chair, absent); if the user skips, those fields are **removed**, never `TBC`. Asks `Anything else decided?` before writing. |
| 7 | second run with case 1 minutes in `minutes/` | `Follow-up from last meeting` lists Priya's action with its status asked. |

Pass bar: 8/8. A single invented owner, date or decision fails the run.
