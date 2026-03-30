"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const BODY_PARTS = [
  { name: "Feet", instruction: "Notice any tension in your feet. Breathe into it. Let it soften." },
  { name: "Calves", instruction: "Notice any tension in your calves. Breathe into it. Let it soften." },
  { name: "Thighs", instruction: "Notice any tension in your thighs. Breathe into it. Let it soften." },
  { name: "Hips", instruction: "Notice any tension in your hips. Breathe into it. Let it soften." },
  { name: "Stomach", instruction: "Notice any tension in your stomach. Breathe into it. Let it soften." },
  { name: "Chest", instruction: "Notice any tension in your chest. Breathe into it. Let it soften." },
  { name: "Shoulders", instruction: "Notice any tension in your shoulders. Breathe into it. Let it soften." },
  { name: "Arms", instruction: "Notice any tension in your arms. Breathe into it. Let it soften." },
  { name: "Hands", instruction: "Notice any tension in your hands. Breathe into it. Let it soften." },
  { name: "Neck", instruction: "Notice any tension in your neck. Breathe into it. Let it soften." },
  { name: "Face", instruction: "Notice any tension in your face. Breathe into it. Let it soften." },
  { name: "Crown", instruction: "Notice the top of your head. Let warmth and ease radiate downward through your whole body." },
];

const STEP_DURATION = 15; // seconds per body part
const TOTAL_DURATION = BODY_PARTS.length * STEP_DURATION; // ~3 minutes

export default function BodyScan() {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepSeconds, setStepSeconds] = useState(STEP_DURATION);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  function start() {
    setRunning(true);
    setFinished(false);
    setStepIndex(0);
    setStepSeconds(STEP_DURATION);
    setTotalElapsed(0);

    let currentStep = 0;
    let secondsInStep = STEP_DURATION;
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed++;
      secondsInStep--;
      setTotalElapsed(elapsed);
      setStepSeconds(secondsInStep);

      if (secondsInStep <= 0) {
        currentStep++;
        if (currentStep >= BODY_PARTS.length) {
          cleanup();
          setRunning(false);
          setFinished(true);
          return;
        }
        setStepIndex(currentStep);
        secondsInStep = STEP_DURATION;
        setStepSeconds(STEP_DURATION);
      }
    }, 1000);
  }

  function stop() {
    cleanup();
    setRunning(false);
  }

  const part = BODY_PARTS[stepIndex];
  const progressPercent = (totalElapsed / TOTAL_DURATION) * 100;

  return (
    <div className="text-center animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">Body Scan</h2>
      <p className="text-diluted text-sm mb-8 max-w-md mx-auto">
        Guided progressive relaxation. ~3 minutes. No audio needed.
      </p>

      {finished ? (
        <div className="animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-paper/30 mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">✧</span>
          </div>
          <p className="font-display text-xl font-semibold text-sumi mb-2">
            Scan complete.
          </p>
          <p className="text-diluted">Your body is listening. Thank it.</p>
          <button
            onClick={() => setFinished(false)}
            className="mt-6 text-diluted text-sm underline hover:text-sumi"
          >
            Done
          </button>
        </div>
      ) : running ? (
        <div className="animate-fade-in">
          {/* Step indicator */}
          <p className="text-xs text-diluted mb-2">
            {stepIndex + 1} of {BODY_PARTS.length}
          </p>

          {/* Body part name */}
          <p className="font-display text-3xl font-bold text-sumi mb-4">
            {part.name}
          </p>

          {/* Instruction */}
          <p className="text-sumi text-base leading-relaxed max-w-sm mx-auto mb-6">
            {part.instruction}
          </p>

          {/* Countdown */}
          <p className="text-diluted text-sm mb-4 tabular-nums">
            {stepSeconds}s
          </p>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mb-4">
            <div className="h-1.5 bg-paper/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-sumi rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Body part dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {BODY_PARTS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i < stepIndex
                    ? "bg-sumi"
                    : i === stepIndex
                    ? "bg-vermillion"
                    : "bg-paper/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={stop}
            className="text-diluted text-sm underline hover:text-sumi"
          >
            Stop
          </button>
        </div>
      ) : (
        <button
          onClick={start}
          className="bg-sumi text-warm-white px-8 py-3 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors"
        >
          Start — ~3 minutes
        </button>
      )}
    </div>
  );
}
