import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { add, list } from "../src/notes.js";

test("add then list returns the note", () => {
  const file = join(mkdtempSync(join(tmpdir(), "notes-")), "notes.json");
  add("buy milk", file);
  assert.deepEqual(list(file).map((n) => n.text), ["buy milk"]);
});
