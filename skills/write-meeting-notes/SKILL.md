---
name: write-meeting-notes
description: Turn rough meeting notes into clean, structured meeting notes. Use when the user pastes or points to draft notes, a transcript or bullet scraps from a meeting and wants them cleaned up, summarized or shared.
argument-hint: "Paste the draft notes, or give a path to them"
metadata:
  author: Anas Sahel
  version: 1.0.0 # x-release-please-version
---

Rewrite draft meeting notes into notes someone who missed the meeting can act on. The notes are **faithful**: every decision, owner, date and number comes from the draft. What the draft doesn't say is a **gap**: ask the user about it, and never fill it with a guess.

## Steps

1. **Read.** Take the draft from the message, or read the file it points to. Done when you know the meeting's topic and its language.

2. **Sort.** Put every line of the draft in one bucket: decision, action item, open question, discussion, or noise (chit-chat, repeats). Expand shorthand only when its meaning is certain ("JD" stays "JD" unless the draft spells it out). Done when every line has a bucket and nothing that matters landed in noise.

3. **Find gaps.** List what the draft doesn't say but the notes need: the meeting date, attendees or purpose; an action item's owner or due date; a fragment you can't read with certainty ("il faut qu'il demande": who?); a "maybe" that may have been settled. Turn a relative date ("tomorrow", "by wed") into a calendar date only from the meeting's date, never today's. Done when every gap is listed.

4. **Ask.** When there are gaps, ask before writing, in one round of up to 6 numbered questions, most important first, in the draft's language. Quote the line each one comes from, and give your reading only when you have a real guess, so "yes" confirms it (no reading line that just repeats the gap):

   <question-template>
   **Q1.** <question> ("<line from the draft>")
   My reading: <your guess>
   </question-template>

   End the round with: "Answer what you know, or say go and I'll write with `?` for the rest." Skip this step when there are no gaps, or when the user already said not to ask (go, just write, no questions). Done when the user answered or said go.

5. **Write** the notes with the template, in the draft's language: translate every heading and label of the template. Fill each gap with the user's answer; what is still unknown is `?`, and a "maybe" the user didn't settle stays an open question. Drop a section that would be empty, except Action items: write "None" there. Keep the summary to 3 lines. Done when every action item from step 2 is in the table.

6. **Deliver.** Reply with the notes. When the draft came from a file, save them beside it as `<name>-notes.md` and say where. When some `?` remain, end with one line listing them.

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
