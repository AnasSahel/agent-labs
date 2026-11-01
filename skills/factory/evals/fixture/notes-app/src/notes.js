// In-memory notes. Each note: { id, title, body, owner }.
const notes = [];
export function addNote(n) { notes.push({ id: notes.length + 1, ...n }); }
export function listNotes() { return notes; }
