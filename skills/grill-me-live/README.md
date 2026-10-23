# grill-me-live

Get grilled on an idea while the decision tree grows live in your browser.

The interview is [Matt Pocock's grilling](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling): rounds of questions, each with a recommended answer, until a loose idea becomes a set of decisions. This skill draws it as a tree that updates as you go. Answer a question and it turns green; drop it and everything that depended on it fades out. Answer in chat or on the page.

![The tree after round 2: settled decisions in green, a dropped branch struck through, answers sent and waiting for the next round](docs/screenshot.png)

## How it works

```
you ── chat ──▶ agent ── writes ──▶ .grill/state.json
                  ▲                        │
                  │                 grill.mjs serve  (localhost:4747)
          grill.mjs wait                   │ pushes every change
                  │                        ▼
         .grill/answers.json ◀── Send ── browser page
```

- The agent keeps the tree in `.grill/state.json` and rewrites it every round.
- `scripts/grill.mjs serve` (Node 18+, no dependencies) shows the page and pushes each change to it.
- On the page: **Accept** the recommendation, **Answer** in your own words, or **Drop** the question, then **Send answers**.
- The agent waits on `grill.mjs wait`, which returns your answers as soon as you press Send. You don't type "next".
- `.grill/` stays in your project as the record of every decision, with each round's answers in `.grill/history/`.

## Install

Copy this folder into your agent's skills folder. For Claude Code, that's `~/.claude/skills/grill-me-live/` for all projects or `.claude/skills/grill-me-live/` for one. Other agents (Codex, Cursor, Copilot, Gemini) work too: the skill only needs the agent to run `node` and write files.

## Use

```
/grill-me-live I want to start an AI newsletter
```

The agent starts the server and gives you a link, usually `http://localhost:4747`. Keep the page open next to the chat. At the end it can write a **snapshot**: one self-contained HTML file of the whole tree to share.

```
node scripts/grill.mjs serve --open   # start the page
node scripts/grill.mjs wait           # wait for Send, print the answers
node scripts/grill.mjs answers        # print answers saved so far
node scripts/grill.mjs snapshot       # write a shareable HTML file
node scripts/grill.mjs stop
```

## Limits

- **Same machine only.** The page is on `localhost`, so the agent has to run where your browser is. In cloud sessions the agent grills you in chat and can hand you a snapshot at the end.
- **Local requests only.** The server listens on `127.0.0.1`, accepts requests addressed to `localhost` only, and refuses writes from other websites.
- **One session per folder.** The tree lives in `./.grill`.
- **Waiting depends on the agent.** Claude Code waits in the background, so you can still type in chat. Other agents may block on `wait` for up to 9 minutes at a time, then wait again.

## Test

```
node skills/grill-me-live/test/smoke.mjs
```

Covers the page, live updates, the request guards, answering, Send and `wait`, and snapshots.
