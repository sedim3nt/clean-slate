"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PHASES = [
  { label: "Inhale", edge: "top", duration: 4 },
  { label: "Hold", edge: "right", duration: 4 },
  { label: "Exhale", edge: "bottom", duration: 4 },
  { label: "Hold", edge: "left", duration: 4 },
];

const TOTAL_CYCLES = 5;
const CYCLE_DURATION = 16; // 4 phases × 4 seconds

export default function BoxBreathing() {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(4);
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
    setCycle(1);
    setPhaseIndex(0);
    setPhaseSeconds(4);

    let currentPhase = 0;
    let currentCycle = 1;
    let secondsLeft = 4;

    timerRef.current = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        currentPhase++;
        if (currentPhase >= 4) {
          currentPhase = 0;
          currentCycle++;
          if (currentCycle > TOTAL_CYCLES) {
            cleanup();
            setRunning(false);
            setFinished(true);
            return;
          }
          setCycle(currentCycle);
        }
        setPhaseIndex(currentPhase);
        secondsLeft = 4;
      }
      setPhaseSeconds(secondsLeft);
    }, 1000);
  }

  function stop() {
    cleanup();
    setRunning(false);
  }

  const phase = PHASES[phaseIndex];
  const boxSize = 180;

  return (
    <div className="text-center animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">Box Breathing</h2>
      <p className="text-diluted text-sm mb-8 max-w-md mx-auto">
        Navy SEAL technique. 4-4-4-4 pattern. Calm your nervous system in under
        2 minutes.
      </p>

      {finished ? (
        <div className="animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-paper/30 mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">☐</span>
          </div>
          <p className="font-display text-xl font-semibold text-sumi mb-2">
            5 cycles complete.
          </p>
          <p className="text-diluted">Your nervous system thanks you.</p>
          <button
            onClick={() => setFinished(false)}
            className="mt-6 text-diluted text-sm underline hover:text-sumi"
          >
            Done
          </button>
        </div>
      ) : running ? (
        <div className="animate-fade-in">
          {/* Cycle counter */}
          <p className="text-sm text-diluted mb-4">
            Cycle {cycle} of {TOTAL_CYCLES}
          </p>

          {/* Box visualization */}
          <div className="flex justify-center mb-6">
            <svg
              width={boxSize}
              height={boxSize}
              viewBox={`0 0 ${boxSize} ${boxSize}`}
              className="overflow-visible"
            >
              {/* Base square */}
              <rect
                x="10"
                y="10"
                width={boxSize - 20}
                height={boxSize - 20}
                fill="none"
                stroke="#C8B8A4"
                strokeWidth="3"
                rx="4"
              />
              {/* Active edge */}
              {phase.edge === "top" && (
                <line x1="10" y1="10" x2={boxSize - 10} y2="10" stroke="#D4453B" strokeWidth="4" strokeLinecap="round" />
              )}
              {phase.edge === "right" && (
                <line x1={boxSize - 10} y1="10" x2={boxSize - 10} y2={boxSize - 10} stroke="#D4453B" strokeWidth="4" strokeLinecap="round" />
              )}
              {phase.edge === "bottom" && (
                <line x1={boxSize - 10} y1={boxSize - 10} x2="10" y2={boxSize - 10} stroke="#D4453B" strokeWidth="4" strokeLinecap="round" />
              )}
              {phase.edge === "left" && (
                <line x1="10" y1={boxSize - 10} x2="10" y2="10" stroke="#D4453B" strokeWidth="4" strokeLinecap="round" />
              )}
              {/* Center text */}
              <text
                x={boxSize / 2}
                y={boxSize / 2 - 8}
                textAnchor="middle"
                className="font-display"
                fill="#1A1A1A"
                fontSize="20"
                fontWeight="bold"
              >
                {phase.label}
              </text>
              <text
                x={boxSize / 2}
                y={boxSize / 2 + 18}
                textAnchor="middle"
                fill="#7C6F64"
                fontSize="32"
                fontWeight="bold"
              >
                {phaseSeconds}
              </text>
            </svg>
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mb-6">
            <div className="h-1.5 bg-paper/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-sumi rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${(((cycle - 1) * CYCLE_DURATION + phaseIndex * 4 + (4 - phaseSeconds)) / (TOTAL_CYCLES * CYCLE_DURATION)) * 100}%`,
                }}
              />
            </div>
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
          Start — 5 cycles
        </button>
      )}
    </div>
  );
}
