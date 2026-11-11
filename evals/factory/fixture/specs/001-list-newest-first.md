---
issue: 001
intent: intent/001-list-newest-first.md
title: The list shows the oldest notes first
size: S
status: designed
---

# The list shows the oldest notes first

## Problem and users

People with many notes run `notes list` to find what they just wrote, and the newest note is printed last. They need the newest first, and a way to see only the last few.

## Acceptance criteria

**AC1 · Newest first**
- Given notes added in the order "a", "b", "c"
- When `notes list` runs
- Then it prints "c", then "b", then "a"

**AC2 · Limit**
- Given 5 notes
- When `notes list --limit 2` runs
- Then it prints exactly the 2 newest notes, newest first; `--limit 0` or a value that isn't a positive whole number prints `limit must be a positive whole number` and exits with code 1

## Approach

**Chosen**: sort when listing. `list()` returns the notes sorted by `at`, newest first, and takes an optional limit; the file keeps its order.

| Option | How | Cost | Risk |
|---|---|---|---|
| Sort when listing | sort in `list()` | a sort per call | none: the file is untouched |
| Store newest first | prepend in `add()` | rewrites how the file is ordered | breaks ids based on length |

## Structure

| Path | Holds | Criteria |
|---|---|---|
| `src/notes.js` | `list(file, limit)`: sort by `at` descending, then slice | AC1, AC2 |
| `src/cli.js` | parse `--limit <n>`, print the error and exit 1 | AC2 |
| `test/notes.test.js` | tests for the order and the limit | AC1, AC2 |

## Data

None.

## Build order

1. **AC1 · Newest first**: the limit slices the sorted list, so the order comes first.
2. **AC2 · Limit**: built on the sorted list.

## Constraints

| ID | For | Constraint | Where | Test |
|---|---|---|---|---|

None.

## Findings

No finding.

## Questions

None.

## Assumptions

- Two notes with the same `at` keep the order they were added in, latest added first.

## Open questions
