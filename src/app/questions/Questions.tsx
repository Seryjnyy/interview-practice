"use client";
import { useEffect, useState } from "react";
import questionList from "../../lib/questions.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotesModal from "../NotesModal";
import { DownloadIcon } from "@radix-ui/react-icons";

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
      stopSeeingSet.delete(question.id);
    } else {
      stopSeeingSet.add(question.id);
    }
    const arr = Array.from(stopSeeingSet);
    localStorage.setItem("stop-seeing-list", JSON.stringify(arr));
    onVisibilityChange();
  };

  return (
    <div key={question.id} className="py-2 flex justify-between">
      <span className={cn({ "opacity-50": stopSeeingSet.has(question.id) })}>
        {question.val}
      </span>
      <div>
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

  useEffect(() => {
    const res = localStorage.getItem("stop-seeing-list");
    if (!res) return;

    const resArr = JSON.parse(res);
    const arrSet = new Set<string>(resArr);
    setStopSeeingSet(arrSet);
  }, []);

  const onVisibilityChange = () => {
    const res = localStorage.getItem("stop-seeing-list");
    if (!res) return;

    const resArr = JSON.parse(res);
    const arrSet = new Set<string>(resArr);
    setStopSeeingSet(arrSet);
  };

  return (
    <div>
      {arr.map((question) => {
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
