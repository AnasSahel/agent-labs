---
name: write-meeting-notes
description: Turn rough meeting notes into clean, structured meeting notes. Use when the user pastes or points to draft notes, a transcript or bullet scraps from a meeting and wants them cleaned up, summarized or shared.
argument-hint: "Paste the draft notes, or give a path to them"
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Rewrite draft meeting notes into notes someone who missed the meeting can act on. The notes are **faithful**: every decision, owner, date and number comes from the draft. What the draft doesn't say is a **gap**, marked as one, never filled with a guess.

## Steps

1. **Read.** Take the draft from the message, or read the file it points to. Done when you know the meeting's topic and its language.

2. **Sort.** Put every line of the draft in one bucket: decision, action item, open question, discussion, or noise (chit-chat, repeats). Expand shorthand only when its meaning is certain ("JD" stays "JD" unless the draft spells it out). Done when every line has a bucket and nothing that matters landed in noise.

3. **Mark gaps.** An action item without an owner gets **Owner: ?**; without a due date, **Due: ?**. A missing meeting date or attendee list is `?` too. Turn a relative date ("tomorrow", "by wed") into a calendar date only from the meeting's date, never today's; without one, keep the draft's words. A decision that the draft leaves undecided ("maybe", "to check") is an open question, not a decision. Done when no owner, date or decision is invented.

4. **Write** the notes with the template, in the draft's language: translate every heading and label of the template. Drop a section that would be empty, except Action items: write "None" there. Keep the summary to 3 lines. Done when every action item from step 2 is in the table.

5. **Deliver.** Reply with the notes. When the draft came from a file, save them beside it as `<name>-notes.md` and say where. End with one line listing the gaps, so the user can fill them in one reply.

<notes-template>
# <Meeting title> (<YYYY-MM-DD>)

**Attendees:** <names from the draft, or "?">

## Summary
<up to 3 lines: why the meeting happened and what came out of it>

## Decisions
- <decision, with its reason when the draft gives one>

## Action items
| Owner | Action | Due |
|---|---|---|
| <name or ?> | <verb first> | <date or ?> |

## Discussion
### <topic>
- <point>

## Open questions
- <question> (<who raised it, when known>)
</notes-template>
