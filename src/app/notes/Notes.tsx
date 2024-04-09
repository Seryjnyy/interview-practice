"use client";
import { getAllNotesWithQuestionID } from "@/lib/noteServices";
import { getAllQuestionsAsMap } from "@/lib/questionService";
import React, { useEffect, useState } from "react";

// https://stackoverflow.com/a/38327540/23556726
const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

export default function Notes() {
  const [notes, setNotes] = useState<
    { id: string; val: string; questionID: string }[]
  >([]);
  const [questionMap, setQuestionMap] = useState(new Map<string, string>());

  useEffect(() => {
    setNotes(getAllNotesWithQuestionID());
    setQuestionMap(getAllQuestionsAsMap());
  }, []);

  const groups = groupBy(notes, (note) => note.questionID);
  console.log(Array.from(Object.entries(groups)));
  return (
    <div>
      {Array.from(Object.entries(groups)).map((group: any) => {
        return (
          <div>
            {questionMap.get(group[0])}
            {group[1].map((note: any) => {
              return <div key={note.id}>{note.val}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
