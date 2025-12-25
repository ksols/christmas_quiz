"use client";

import { QuizCard } from "@/components/QuizCard";
import { useState } from "react";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleAnswer = (answer: string) => {
    console.log("Selected answer:", answer);
    alert(`You selected: ${answer}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900 via-green-950 to-slate-950">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex lg:flex-col lg:gap-8">

        {!hasStarted ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500 pb-2">
              Christmas Quiz
            </h1>
            <p className="text-xl text-slate-300 max-w-lg mx-auto">
              Are you ready to test your knowledge about the most wonderful time of the year?
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <QuizCard
              question="What is the name of the snowman in Frozen?"
              options={["Olaf", "Sven", "Kristoff", "Hans"]}
              onAnswer={handleAnswer}
            />
          </div>
        )}

      </div>

      {/* Decorative snow/particles could go here */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </main>
  );
}
