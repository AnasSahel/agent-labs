---
issue: 001
title: The list shows the oldest notes first
source: user
kind: improvement
priority: normal
size: S
status: designed
---

# The list shows the oldest notes first

## Problem

People who keep many notes run `notes list` to find what they just wrote. The list prints the oldest note first, so the newest one is at the bottom and scrolls out of view.

## Why now

The list is the only way to read notes back, and it gets worse with every note added.

## Success looks like

Someone who just added a note sees it at the top of the list, and can limit the list to the few most recent ones.

## Out of scope

Searching or filtering notes by text.

## Constraints

`notes.json` keeps its format: existing files must still load.

## Open questions

None

## Evidence

"I have 200 notes and the one I wrote a minute ago is at the very bottom."
