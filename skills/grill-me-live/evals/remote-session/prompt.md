---
name: remote-session
description: In a cloud session the browser can't reach localhost, so the agent grills in chat without starting the server, still records the tree, and offers a snapshot.
tags: [fallback]
max_turns: 30
timeout_seconds: 360
allowed_tools: [Bash, Write, Edit, Read, Glob, Grep, Skill]
---

/grill-me-live:grill-me-live A weekly newsletter about hiking trails near Lyon. Heads up: you're running in a cloud container, so my browser can't open anything on your localhost.
