# agent-labs

Skills and agents for Claude Code.

## Skills

- [write-skill](skills/write-skill/SKILL.md): draft a new skill, or rewrite an existing one, short and built on leading words. Method adapted from [Matt Pocock's skills](https://github.com/mattpocock/skills).
- [brainstorm](skills/brainstorm/SKILL.md): brainstorm an idea until it's concrete, inside the current project's limits or outside them: rounds of up to 3 questions with recommended answers, then one builder check that ends it. Adapted from [obra's superpowers brainstorming](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) and [Matt Pocock's grilling](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md).
- [factory-plan](skills/factory-plan/SKILL.md): Plan phase. Brainstorm a bug, idea or request into an intent in your words, committed as `intent/<id>-<slug>.md` and tracked in any tracker (GitHub, Linear, Plane, files), after your go. Follows the Plan phase of [Anthropic's AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook).
- [spec](skills/spec/SKILL.md): turn an issue into a spec with Given/When/Then criteria, a security risk level, a sketch and an optional split, in any tracker, after your approval.
