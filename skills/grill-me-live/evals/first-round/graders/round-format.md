---
type: llm
weight: 2
focus: last_message
---
The reply posts round 1 of a grilling interview about a personal habit tracker. PASS only if all of these hold:
- It asks at least two questions, numbered Q1, Q2, … in order.
- Every question is followed by a recommended answer (marked with ➡️ or clearly labelled as the recommendation).
- Each question is worded so that answering "yes" accepts the recommendation.
- No question in this round depends on the answer to another question in the same round.
- It tells the user they can answer in chat or on the page (and press Send), and gives a localhost link.
- It does not ask the user to supply facts about the outside world or the codebase that the agent could look up itself. Preferences, goals and decisions (platform, scope, why build it, tech stack preference) are the user's to make and are fine to ask.
