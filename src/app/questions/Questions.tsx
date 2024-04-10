"use client";
import { useEffect, useRef, useState } from "react";
import questionList from "../../lib/questions.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotesModal from "../NotesModal";
import { DownloadIcon } from "@radix-ui/react-icons";
import { getNote, getNoteIDsForQuestion } from "@/lib/noteServices";
import {
  addToExclusionSet,
  getExclusionSet,
  removeFromExclusionSet,
} from "@/lib/questionService";
import { Toggle } from "@/components/ui/toggle";
import { saveAs } from "file-saver";

const Question = ({
  question,
  stopSeeingSet,
  onVisibilityChange,
}: {
  question: { id: string; val: string };
  onVisibilityChange: () => void;
  stopSeeingSet: Set<string>;
}) => {
  const handleVisibilityChange = () => {
    if (stopSeeingSet.has(question.id)) {
      removeFromExclusionSet(question.id);
    } else {
      addToExclusionSet(question.id);
    }

    onVisibilityChange();
  };

  const handleDownload = () => {
    const noteIDs = getNoteIDsForQuestion(question.id);
    // TODO : make a type for this, because used so many times
    const notes: { id: string; val: string; questionID: string }[] = [];

    for (const noteID of noteIDs) {
      const res = getNote(noteID);
      if (res) notes.push(res);
    }

    var FileSaver = require("file-saver");
    var blob = new Blob(
      [question.val + "\n", ...notes.map((note) => note.val + "\n")],
      {
        type: "text/plain;charset=utf-8",
      }
    );
    FileSaver.saveAs(blob, question.val);
  };

  return (
    <div
      key={question.id}
      className="py-2 flex justify-between flex-col md:flex-row"
    >
      <span className={cn({ "opacity-60": stopSeeingSet.has(question.id) })}>
        {question.val}
      </span>

      <div className="min-w-fit opacity-50 ">
        <Button variant={"ghost"} onClick={handleVisibilityChange}>
          {stopSeeingSet.has(question.id) ? "Start seeing" : "Stop seeing"}
        </Button>
        <NotesModal
          question={question}
          triggerText="View notes"
          triggerVariant="ghost"
        />
        <Button variant={"ghost"}>
          <DownloadIcon onClick={handleDownload} />
        </Button>
      </div>
    </div>
  );
};

export default function Questions() {
  const [questions, setQuestions] = useState(questionList.questions);
  const [stopSeeingSet, setStopSeeingSet] = useState(new Set<string>());
  const [filter, setFilter] = useState<"all" | "hidden" | "visible">("all");

  useEffect(() => {
    setStopSeeingSet(getExclusionSet());
  }, []);

  const onVisibilityChange = () => {
    setStopSeeingSet(getExclusionSet());
  };

  const onDownloadAll = () => {
    const questionWithNotes = [];
    for (const question of questions) {
      const noteIDs = getNoteIDsForQuestion(question.id);
      const notes = [];
      for (const noteID of noteIDs) {
        const res = getNote(noteID);
        if (res) {
          notes.push(res.val);
        }
      }

      if (notes.length > 0) {
        questionWithNotes.push({ question: question.val, notes: notes });
      }
    }

    var FileSaver = require("file-saver");

    const listOfLists = questionWithNotes.map((x) => [
      x.question + "\n",
      ...x.notes.map((note) => "" + note + "\n"),
      "\n",
    ]);
    const flattened = listOfLists.flat();
    var blob = new Blob([...flattened], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "All notes");
  };

  return (
    <div className="space-y-12 ">
      <div className="flex justify-between items-center">
        <div>
          <Button
            className={filter == "all" ? "underline" : ""}
            variant={"ghost"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            className={filter == "hidden" ? "underline" : ""}
            variant={"ghost"}
            onClick={() => setFilter("hidden")}
          >
            Hidden
          </Button>
          <Button
            className={filter == "visible" ? "underline" : ""}
            variant={"ghost"}
            onClick={() => setFilter("visible")}
          >
            Visible
          </Button>
        </div>
        <Button className="space-x-2" variant={"ghost"} onClick={onDownloadAll}>
          <DownloadIcon /> <span>All</span>
        </Button>
      </div>

      {questions.map((question) => {
        let render = true;

        if (filter == "visible") {
          render = !stopSeeingSet.has(question.id);
        } else if (filter == "hidden") {
          render = stopSeeingSet.has(question.id);
        }

        if (!render) return;

        return (
          <Question
            question={question}
            stopSeeingSet={stopSeeingSet}
            onVisibilityChange={onVisibilityChange}
          />
        );
      })}
    </div>
  );
}
