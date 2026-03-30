"use client";

import { useState, useEffect } from "react";
import { getCheckIns } from "@/lib/storage";

const slipColors = [
  "bg-paper/60",
  "bg-paper/40",
  "bg-diluted/20",
  "bg-paper/50",
  "bg-diluted/10",
  "bg-paper/30",
];

export default function GratitudeJar() {
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [random, setRandom] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const checkins = getCheckIns();
    const items = checkins
      .filter((c) => c.gratitude && c.gratitude.trim())
      .map((c) => c.gratitude);
    setGratitudes(items);
  }, []);

  function shakeJar() {
    if (gratitudes.length === 0) return;
    setShaking(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * gratitudes.length);
      setRandom(gratitudes[idx]);
      setShaking(false);
    }, 500);
  }

  const fillPercent = Math.min((gratitudes.length / 30) * 100, 100);

  return (
    <div className="text-center animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">Gratitude Jar</h2>
      <p className="text-diluted text-sm mb-8">
        Every gratitude from your check-ins collects here.
      </p>

      {/* Jar */}
      <div
        className={`relative w-40 h-52 mx-auto mb-6 border-2 border-paper rounded-b-3xl rounded-t-lg overflow-hidden ${
          shaking ? "animate-shake" : ""
        }`}
      >
        {/* Jar lid */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-4 bg-paper/60 rounded-t-md border border-paper" />

        {/* Fill level */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-paper/30 transition-all duration-700"
          style={{ height: `${fillPercent}%` }}
        >
          {/* Paper slips */}
          <div className="absolute inset-0 flex flex-wrap gap-1 p-2 items-end justify-center overflow-hidden">
            {gratitudes.slice(0, 20).map((_, i) => (
              <div
                key={i}
                className={`${slipColors[i % slipColors.length]} rounded-sm h-3 rotate-${
                  (i % 3) * 6 - 6
                }`}
                style={{
                  width: `${20 + (i % 4) * 8}px`,
                  transform: `rotate(${(i % 5) * 12 - 24}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Entry count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-diluted font-display text-sm font-semibold bg-warm-white/80 px-2 py-1 rounded">
            {gratitudes.length}
          </span>
        </div>
      </div>

      {gratitudes.length > 0 ? (
        <>
          <button
            onClick={shakeJar}
            className="bg-sumi text-warm-white px-6 py-2.5 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors text-sm"
          >
            Shake the Jar
          </button>

          {random && (
            <div className="mt-6 border border-paper/40 rounded-lg p-4 bg-warm-white animate-fade-in max-w-sm mx-auto">
              <p className="text-xs text-diluted mb-1">You were grateful for:</p>
              <p className="text-sumi italic">&ldquo;{random}&rdquo;</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-diluted text-sm">
          Complete daily check-ins to fill your jar with gratitude.
        </p>
      )}
    </div>
  );
}
