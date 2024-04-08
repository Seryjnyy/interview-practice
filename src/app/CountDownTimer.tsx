"use client";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { differenceInMilliseconds, set } from "date-fns";
import { cn } from "@/lib/utils";

export default function CountdownTimer({
  className,
  amount,
}: {
  amount: number;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<number | undefined>(amount);

  useEffect(() => {
    setTimeLeft(amount);
  }, [amount]);

  return (
    <Countdown precision={0} date={timeLeft} className={cn(className)}>
      <div>Time is up</div>
    </Countdown>
  );
}
