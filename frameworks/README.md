# Frameworks

The fixed mappings the GRC skills cite, so a clause is looked up, never recalled. ISO 27001 is the **pivot**: risks, the register and every report store ISO 27001 refs, and each other framework is a file that translates them.

- `iso27001.md`: the pivot, every clause and Annex A control. A ref missing from it does not exist.
- `<id>.md`: one file per framework, with the same frontmatter (`id`, `name`, `source`, `checked`, `status`) and two tables:
  - **Mapping**: `| Clause | Requirement | ISO 27001 | Fit |`, one row per clause, `Fit` is `full` or `partial`.
  - **Extras**: `| Clause | Duty | Why ISO 27001 misses it |`: deadlines, registers, legal duties the pivot can't carry. Each `partial` row has at least one extra on the same article.

A skill lists the files it needs in its front matter (`metadata.frameworks`) and carries a copy, like agents: edit here only, then run `scripts/sync-agents` and commit the copies with it. `scripts/check-frameworks` (run in CI) fails on an unknown ISO ref, a bad `Fit`, a `partial` row without an extra, or a skill citing an Annex A control that doesn't exist.

To add a framework: write `<id>.md` from its official text, one row per clause, `status: draft` until a practitioner has reviewed it. Then add the id to the `frameworks` list of the skills that cite it.
