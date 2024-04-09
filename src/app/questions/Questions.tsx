"use client";
import { useEffect, useState } from "react";
import questionList from "../../lib/questions.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotesModal from "../NotesModal";
import { DownloadIcon } from "@radix-ui/react-icons";
import { getNotesForQuestion } from "@/lib/noteServices";
import {
  addToExclusionSet,
  getExclusionSet,
  removeFromExclusionSet,
} from "@/lib/questionService";
import { Toggle } from "@/components/ui/toggle";

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

  return (
    <div
      key={question.id}
      className="py-2 flex justify-between flex-col md:flex-row"
    >
      <span className={cn({ "opacity-50": stopSeeingSet.has(question.id) })}>
        {question.val}
      </span>

      <div className="min-w-fit">
        <Button variant={"ghost"} onClick={handleVisibilityChange}>
          {stopSeeingSet.has(question.id) ? "Start seeing" : "Stop seeing"}
        </Button>
        <NotesModal
          question={question}
          triggerText="View notes"
          triggerVariant="ghost"
        />
        <Button variant={"ghost"}>
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
};

export default function Questions() {
  const [arr, setArr] = useState(questionList.questions);
  const [stopSeeingSet, setStopSeeingSet] = useState(new Set<string>());
  const [filter, setFilter] = useState<"all" | "hidden" | "visible">("all");

  useEffect(() => {
    setStopSeeingSet(getExclusionSet());
  }, []);

  const onVisibilityChange = () => {
    setStopSeeingSet(getExclusionSet());
  };

  return (
    <div className="space-y-12 ">
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

      {arr.map((question) => {
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
