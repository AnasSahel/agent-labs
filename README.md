# agent-labs

Skills and agents for Claude Code.

## Skills

- [write-skill](skills/write-skill/SKILL.md): draft a new skill, or rewrite an existing one, short and built on leading words. Method adapted from [Matt Pocock's skills](https://github.com/mattpocock/skills).
- [factory-brainstorm](skills/factory-brainstorm/SKILL.md): brainstorm an idea until it's concrete, inside the current project's limits or outside them: rounds of up to 3 questions with recommended answers, then one builder check that ends it, with a trace of every question and answer. Adapted from [obra's superpowers brainstorming](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) and [Matt Pocock's grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md).
- [factory-plan](skills/factory-plan/SKILL.md): Plan phase. Brainstorm a bug, idea or request into an intent in your words, proposed as `intent/<id>-<slug>.md` in a pull request (merge = go, close = no) and tracked in any tracker (GitHub, Linear, Plane, files). Follows the Plan phase of [Anthropic's AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).
- [factory-design](skills/factory-design/SKILL.md): Design phase. Turn an intent into a spec, what to build and how, in one unattended session: criteria, approach, build order and frames, reviewed while it's written by specialized agents (security by OWASP, risk by EBIOS RM and ISO 27005, privacy by GDPR, and each of your `rules/`), then one pull request: owners answer their questions in its review, and merging it is your approval. Unattended, so a CI job can start it when an intent's pull request is merged: `claude -p "/factory-design <id>"`. Follows the Design phase of [Anthropic's AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).
- [factory-build](skills/factory-build/SKILL.md): Build phase. Turn an approved spec into code in two halves: a plan (`plan.md`: files, order, risks, the test that proves each criterion), drafted without touching the code and accepted by you (and your tech lead for a riskier change), then the code and its tests in one pass on a branch, done only when build, tests and lint pass and a verifier agent, in a fresh context, has run the app against the spec, with a draft pull request. Departures from the plan update it in the same commit. Follows the Build phase of [Anthropic's AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).
- [grill-me-live](skills/grill-me-live/README.md): get grilled on an idea while its decision tree grows live in your browser: answer on the page or in chat, and dropped branches fade with everything under them. At the end: a receipt of every decision and a slide deck for the people who were not in the room. Runs a small local server (Node). Interview method from [Matt Pocock's grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md).
- [write-meeting-notes](skills/write-meeting-notes/SKILL.md): turn rough meeting notes into clean ones: summary, decisions, an action items table (owner, action, due), discussion and open questions, in the draft's language. Never guesses: a missing owner or date shows as `?` and is listed at the end.

## Agents

[agents/](agents) holds the agents skills hand work to, such as the security and privacy reviewers. A skill lists the ones it needs in its front matter (`metadata.agents`) and carries a copy in its own `agents/` folder, so it stays standalone when installed alone.

- Edit an agent in `agents/` only, then run `scripts/sync-agents` and commit the copies with it, scoped by each skill that carries it (`fix(factory-design): …`): that's what bumps the skill's version.
- CI (`agents.yml`) fails when a copy is missing, stale or no longer listed.
- The files also work as Claude Code agents: copy them to `~/.claude/agents/`.

## Versioning

Each skill has its own version, changelog and tags (`<skill>-v<version>`), managed by [release-please](https://github.com/googleapis/release-please). Never edit a `version` by hand.

- Commit with [Conventional Commits](https://www.conventionalcommits.org), scoped by the skill: `fix(factory-plan): …` bumps the patch, `feat(factory-plan): …` the minor, `feat(factory-plan)!: …` the major. `docs`, `chore`, `ci` bump nothing.
- The bump goes to every skill whose folder the commit touches: keep one skill per commit.
- Pushing to `main` releases nothing. When you want a release, run `gh workflow run release-please.yml --repo AnasSahel/agent-labs`: it opens one PR, "chore: release main", with every skill changed since its last release (version in `SKILL.md` and `version.txt`, `CHANGELOG.md`). Merging it tags each skill and publishes its GitHub release.
- A new skill: add its folder to `release-please-config.json` only, with `version: 1.0.0` and the marker in its `SKILL.md`. Its first release PR is `1.0.0` and adds it to `.release-please-manifest.json`. A renamed skill is a new skill.
