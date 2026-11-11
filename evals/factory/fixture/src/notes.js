import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FILE = "notes.json";

export function load(file = FILE) {
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
}

export function add(text, file = FILE, now = new Date()) {
  const notes = load(file);
  const note = { id: notes.length + 1, text, at: now.toISOString() };
  notes.push(note);
  writeFileSync(file, JSON.stringify(notes, null, 2));
  return note;
}

// Oldest first: the order they were added.
export function list(file = FILE) {
  return load(file);
}
