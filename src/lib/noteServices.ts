import { v4 as uuidv4 } from "uuid";

const QUESTION_NOTES_PREFIX = "notes-for-question:";
const ALL_NOTES_PREFIX = "all-notes";

export function getAllNotesWithQuestionID() {
  const noteList = getNoteList();

  const res = [];
  for (const id of noteList) {
    const note = getNote(id);
    if (note) res.push(note);
  }

  return res;
}

export function getNoteIDsForQuestion(questionID: string) {
  const res = localStorage.getItem(`${QUESTION_NOTES_PREFIX}${questionID}`);

  if (res) {
    const arr = JSON.parse(res) as string[];
    return arr;
  } else {
    return [];
  }
}

function updateNotesForQuestion(questionID: string, newVal: string[]) {
  localStorage.setItem(
    `${QUESTION_NOTES_PREFIX}${questionID}`,
    JSON.stringify(newVal)
  );
}

function getNoteList() {
  const res = localStorage.getItem(ALL_NOTES_PREFIX);
  if (!res) return [];

  return JSON.parse(res) as string[];
}

function updateNoteList(newVal: string[]) {
  localStorage.setItem(ALL_NOTES_PREFIX, JSON.stringify(newVal));
}

function addToNoteList(noteID: string) {
  const res = getNoteList();

  res.push(noteID);
  updateNoteList(res);
}

function removeFromNoteList(noteID: string) {
  const res = getNoteList();

  updateNoteList(res.filter((id) => id != noteID));
}

function saveNote(questionID: string, note: string) {
  const id = uuidv4();
  localStorage.setItem(
    id,
    JSON.stringify({ id: id, val: note.trim(), questionID: questionID })
  );

  addToNoteList(id);
  return id;
}

export function saveNoteForQuestion(questionID: string, note: string) {
  const noteID = saveNote(questionID, note);

  const arr = getNoteIDsForQuestion(questionID);
  arr.push(noteID);
  localStorage.setItem(
    `${QUESTION_NOTES_PREFIX}${questionID}`,
    JSON.stringify(arr)
  );
}

export function getNote(noteID: string) {
  const res = localStorage.getItem(noteID);
  if (!res) return null;

  return JSON.parse(res) as { id: string; val: string; questionID: string };
}

export function updateNote(noteID: string, newVal: string) {
  localStorage.setItem(noteID, newVal);
}

export function deleteNote(questionID: string, noteID: string) {
  localStorage.removeItem(noteID);

  const notes = getNoteIDsForQuestion(questionID);
  const removed = notes.filter((x: any) => x != noteID);

  removeFromNoteList(noteID);
  updateNotesForQuestion(questionID, removed);
}
