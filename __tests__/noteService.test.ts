import {
  deleteNote,
  exportForTesting,
  getAllNotes,
  getNote,
  getNoteIDsForQuestion,
  saveNoteForQuestion,
  updateNote,
} from "@/lib/noteServices";
import {
  getItem,
  mockStorage,
  removeItem,
  setItem,
} from "./utils/localStorageMock";

beforeAll(() => {
  global.Storage.prototype.setItem = setItem;
  global.Storage.prototype.removeItem = removeItem;
  global.Storage.prototype.getItem = getItem;
});

beforeEach(() => {
  mockStorage.clear();
});

it("should save note, and add it to NoteList and to NotesForQuestionList", () => {
  const questionID = "test_question_id";
  const note = "note";
  const otherNote = "other note";

  const id = saveNoteForQuestion(questionID, note);
  // Check if it doesn't mess up the other values in array
  const otherID = saveNoteForQuestion(questionID, otherNote);

  // Check if note is saved
  expect(JSON.parse(mockStorage.get(id) ?? "[]")).toEqual({
    id: id,
    val: note,
    questionID: questionID,
  });

  // Check if is in notes for question list
  const notesForQuestionList = JSON.parse(
    mockStorage.get(exportForTesting.QUESTION_NOTES_PREFIX + questionID) ?? "[]"
  );
  expect(notesForQuestionList).toEqual([id, otherID]);

  // Check if is in all-notes list
  const allNotesList = JSON.parse(
    mockStorage.get(exportForTesting.ALL_NOTES_PREFIX) ?? "[]"
  );
  expect(allNotesList).toEqual([id, otherID]);
});

it("should delete note, and remove entry in NoteList and NotesForQuestion", () => {
  const questionID = "test_question_id";
  const note = "note";
  const otherNote = "other note";

  const id = saveNoteForQuestion(questionID, note);
  // Check if it doesn't mess up the other values in array
  const otherID = saveNoteForQuestion(questionID, otherNote);

  deleteNote(questionID, id);

  // Check if note removed from local storage
  expect(mockStorage.get(id)).toEqual(undefined);

  // Check if removed from all-notes list
  const allNotesList = JSON.parse(
    mockStorage.get(exportForTesting.ALL_NOTES_PREFIX) ?? "[]"
  );
  expect(allNotesList).toEqual([otherID]);

  // Check if removed from notes for question list
  const notesForQuestionList = JSON.parse(
    mockStorage.get(exportForTesting.QUESTION_NOTES_PREFIX + questionID) ?? "[]"
  );
  expect(notesForQuestionList).toEqual([otherID]);
});

it("should retrieve the note", () => {
  const questionID = "test_question_id";
  const note = "note";
  const id = saveNoteForQuestion(questionID, note);

  expect(getNote(id)).toEqual({
    id: id,
    val: note,
    questionID: questionID,
  });
});

it("should retrieve all noteIDs associated for a question", () => {
  const notes = ["one", "two", "three"];
  const questionID = "test_question_id";
  const ids = [];
  for (const note of notes) {
    ids.push(saveNoteForQuestion(questionID, note));
  }

  const notesForQuestionList = getNoteIDsForQuestion(questionID);
  expect(notesForQuestionList).toEqual(ids);
});

it("should retrieve all notes", () => {
  const notes = [
    { questionID: "question_one", note: "some note" },
    { questionID: "question_two", note: "some other note" },
    { questionID: "question_three", note: "some other other note" },
  ];
  const ids = [];
  for (const note of notes) {
    ids.push(saveNoteForQuestion(note.questionID, note.note));
  }

  const allNotes = getAllNotes();
  for (const id of ids) {
    expect(allNotes.find((x) => x.id == id)).toBeDefined();
  }
});

it("should update the note", () => {
  const questionID = "test_question_id";
  const note = "note";
  const id = saveNoteForQuestion(questionID, note);

  const newValue = "new value";
  updateNote(id, newValue);
  expect(JSON.parse(mockStorage.get(id) ?? "{val:'none'}").val).toEqual(
    newValue
  );
});

afterAll(() => {
  // return mocks to their original values
  setItem.mockReset();
  getItem.mockReset();
  removeItem.mockReset();
  mockStorage.clear();
});
