import { getOriginalQuestions } from "@/lib/questionService";
import {
  getItem,
  mockStorage,
  removeItem,
  setItem,
} from "./utils/localStorageMock";
import questionList from "../src/lib/questions.json";

beforeAll(() => {
  global.Storage.prototype.setItem = setItem;
  global.Storage.prototype.removeItem = removeItem;
  global.Storage.prototype.getItem = getItem;
});

beforeEach(() => {
  mockStorage.clear();
});

it("should get all questions from questions.json", () => {
  expect(getOriginalQuestions()).toEqual(questionList.questions);
});

afterAll(() => {
  // return mocks to their original values
  setItem.mockReset();
  getItem.mockReset();
  removeItem.mockReset();
  mockStorage.clear();
});
