"use client";
import { getAllNotes } from "@/lib/noteServices";
import { getAllQuestionsAsMap } from "@/lib/questionService";
import React, { useEffect, useState } from "react";
import Note from "../questions/Note";

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
    setNotes(getAllNotes());
    setQuestionMap(getAllQuestionsAsMap());
  }, []);

  const onNoteDeleted = () => {
    setNotes(getAllNotes());
    setQuestionMap(getAllQuestionsAsMap());
  };

  const groups = groupBy(notes, (note) => note.questionID);
  console.log(Array.from(Object.entries(groups)));

  // TODO : Wasteful note rendering because we already have the note data, but Note component re-fetches it
  return (
    <div className="space-y-12 pt-16">
      {Array.from(Object.entries(groups)).map((group: any) => {
        return (
          <div key={"id" + group[0]}>
            <h3 className="opacity-80 pb-1">{questionMap.get(group[0])}</h3>
            <div className="space-y-4">
              {group[1].map((note: any) => {
                return (
                  <Note
                    id={note.id}
                    key={note.id}
                    onDeleteNote={onNoteDeleted}
                    questionID={note.questionID}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
