#!/usr/bin/env node
import { add, list } from "./notes.js";

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "add") {
  const note = add(rest.join(" "));
  console.log(`added ${note.id}`);
} else if (cmd === "list") {
  for (const n of list()) console.log(`${n.id}  ${n.text}`);
} else {
  console.error("usage: notes add <text> | notes list");
  process.exit(1);
}
