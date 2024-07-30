import questionList from "../lib/questions.json";

const EXCLUSION_LIST_PREFIX = "stop-seeing-list";

export function getOriginalQuestions() {
  return questionList.questions;
}

export function getExclusionSet() {
  const res = localStorage.getItem(EXCLUSION_LIST_PREFIX);
  if (res) {
    const resArr = JSON.parse(res);
    return new Set<string>(resArr);
  }

  return new Set<string>();
}

function updateExclusionSet(newVal: Set<string>) {
  const setAsArr = Array.from(newVal);
  localStorage.setItem(EXCLUSION_LIST_PREFIX, JSON.stringify(setAsArr));
}

export function addToExclusionSet(questionID: string) {
  const set = getExclusionSet();
  set.add(questionID);

  updateExclusionSet(set);
}

export function removeFromExclusionSet(questionID: string) {
  const set = getExclusionSet();
  set.delete(questionID);

  updateExclusionSet(set);
}

// Don't pass in questions the user doesn't want to see
export function getAllWantedQuestions() {
  const questions = getAllQuestions();
  const exclusionSet = getExclusionSet();

  const filtered = questions.filter(
    (question) => !exclusionSet.has(question.id)
  );

  return filtered;
}

// In case there is user generated ones etc.
function getAllQuestions() {
  const originalQuestions = getOriginalQuestions();

  return originalQuestions;
}

export function getAllQuestionsAsMap() {
  const questions = getAllQuestions();
  return new Map(questions.map((question) => [question.id, question.val]));
}
