"use client";

import { useState, useEffect, useRef } from "react";

const DURATION = 600; // 10 minutes in seconds

const breathPhases = [
  { label: "Breathe in...", duration: 4 },
  { label: "Hold...", duration: 4 },
  { label: "Breathe out...", duration: 6 },
];

export default function UrgeSurf() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(DURATION);
  const [finished, setFinished] = useState(false);
  const [breathIndex, setBreaIndex] = useState(0);
  const [breathScale, setBreathScale] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, []);

  function start() {
    setRunning(true);
    setFinished(false);
    setSeconds(DURATION);

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          if (breathRef.current) clearInterval(breathRef.current);
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // Breathing cycle
    let phase = 0;
    function nextPhase() {
      setBreaIndex(phase % 3);
      const p = breathPhases[phase % 3];
      setBreathScale(phase % 3 === 0 ? 1.4 : phase % 3 === 1 ? 1.4 : 1);
      phase++;
      breathRef.current = setTimeout(nextPhase, p.duration * 1000) as unknown as ReturnType<typeof setInterval>;
    }
    nextPhase();
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
    setRunning(false);
    setSeconds(DURATION);
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="text-center animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">Urge Surfing</h2>
      <p className="text-diluted text-sm mb-8 max-w-md mx-auto">
        Cravings are waves. They rise, peak, and pass. Ride this one.
      </p>

      {finished ? (
        <div className="animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-paper/30 mx-auto flex items-center justify-center mb-6">
            <span className="text-4xl">🌊</span>
          </div>
          <p className="font-display text-xl font-semibold text-sumi mb-2">
            The wave passed.
          </p>
          <p className="text-diluted">You stayed.</p>
          <button
            onClick={() => setFinished(false)}
            className="mt-6 text-diluted text-sm underline hover:text-sumi"
          >
            Done
          </button>
        </div>
      ) : running ? (
        <div className="animate-fade-in">
          {/* Timer */}
          <p className="font-display text-5xl font-bold text-sumi mb-6 tabular-nums">
            {mins}:{secs.toString().padStart(2, "0")}
          </p>

          {/* Breathing circle */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-28 h-28 rounded-full border-2 border-paper bg-paper/20 flex items-center justify-center"
              style={{
                transform: `scale(${breathScale})`,
                transition: `transform ${breathPhases[breathIndex].duration}s ease-in-out`,
              }}
            >
              <span className="text-sm text-diluted font-medium">
                {breathPhases[breathIndex].label}
              </span>
            </div>
          </div>

          {/* Wave animation */}
          <div className="h-8 overflow-hidden relative rounded-lg bg-paper/10 mb-6">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(200,184,164,0.3) 40px, rgba(200,184,164,0.3) 80px)",
                animation: "wave 3s linear infinite",
              }}
            />
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
          Start — 10 minutes
        </button>
      )}
    </div>
  );
}
