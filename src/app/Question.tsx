"use client";
import { useEffect, useState } from "react";
import questionList from "../lib/questions.json";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./CountDownTimer";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import NotesModal from "./NotesModal";

// This can show how to find code to do things
// This also shows how we can modify things
function shuffleArray(array: any[]) {
  const cpy = [...array];
  for (var i = cpy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cpy[i];
    cpy[i] = cpy[j];
    cpy[j] = temp;
  }
  return cpy;
}

export default function Question() {
  const [arr, setArr] = useState(questionList.questions);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // this can show how state changes work, they are delayed, arr should not change here, also tests if our modification worked
    // can then explain why useEffect calls it twice, cause in react dev mode it gets called twice
    // console.log(arr[0], arr[1]);
    setArr(shuffleArray(arr));
    // console.log(arr[0], arr[1]);
  }, []);

  const handleNext = () => {
    if (index >= arr.length) return;

    setIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (index <= 0) return;

    setIndex((prev) => prev - 1);
  };

  // can show how to deal with problem of things not refreshing
  // shuffle array didn't change state, and setIndex(0) doesn't work, so need to store in state
  const handleReshuffle = () => {
    setArr(shuffleArray(arr));

    setIndex(0);
  };

  return (
    <div className="flex flex-col justify-around md:justify-center items-center w-full h-screen gap-24 px-2 md:px-8 relative">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-fit  p-2 md:p-4 rounded-lg font-bold">
        {arr[index].val}
      </h1>

      <div className="flex flex-col justify-center items-center absolute bottom-8">
        <div className="py-2">
          <CountdownTimer amount={Date.now() + 120000} />
        </div>
        <div className="space-x-2 border p-1">
          <Button onClick={handlePrev} disabled={index <= 0}>
            <ArrowLeftIcon />
          </Button>
          <Button onClick={handleNext} disabled={index >= arr.length}>
            <ArrowRightIcon />
          </Button>
          <Button onClick={handleReshuffle}>Reshuffle</Button>

          <NotesModal
            question={arr[index]}
            triggerText="Notes"
            triggerVariant="outline"
          />
        </div>
        <span className="opacity-80 mt-2">{`${index + 1}/${arr.length}`}</span>
      </div>
    </div>
  );
}
