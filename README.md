# agent-labs

Skills and agents for Claude Code.

## Skills

- [write-skill](skills/write-skill/SKILL.md): draft a new skill, or rewrite an existing one, short and built on leading words. Method adapted from [Matt Pocock's skills](https://github.com/mattpocock/skills).
- [factory-brainstorm](skills/factory-brainstorm/SKILL.md): brainstorm an idea until it's concrete, inside the current project's limits or outside them: rounds of up to 3 questions with recommended answers, then one builder check that ends it, with a trace of every question and answer. Adapted from [obra's superpowers brainstorming](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) and [Matt Pocock's grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md).
- [factory-plan](skills/factory-plan/SKILL.md): Plan phase. Brainstorm a bug, idea or request into an intent in your words, committed as `intent/<id>-<slug>.md` and tracked in any tracker (GitHub, Linear, Plane, files), after your go. Follows the Plan phase of [Anthropic's AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).
- [spec](skills/spec/SKILL.md): turn an issue into a spec with Given/When/Then criteria, a security risk level, a sketch and an optional split, in any tracker, after your approval.

## Versioning

Each skill has its own version, changelog and tags (`<skill>-v<version>`), managed by [release-please](https://github.com/googleapis/release-please). Never edit a `version` by hand.

- Commit with [Conventional Commits](https://www.conventionalcommits.org), scoped by the skill: `fix(spec): …` bumps the patch, `feat(spec): …` the minor, `feat(spec)!: …` the major. `docs`, `chore`, `ci` bump nothing.
- The bump goes to every skill whose folder the commit touches: keep one skill per commit.
- Pushing to `main` releases nothing. When you want a release, run `gh workflow run release-please.yml --repo AnasSahel/agent-labs`: it opens one PR, "chore: release skills", with every skill changed since its last release (version in `SKILL.md` and `version.txt`, `CHANGELOG.md`). Merging it tags each skill and publishes its GitHub release.
- A new skill: add its folder to `release-please-config.json` only, with `version: 1.0.0` and the marker in its `SKILL.md`. Its first release PR is `1.0.0` and adds it to `.release-please-manifest.json`. A renamed skill is a new skill.
