"use client";

import { useState, useEffect } from "react";
import { getDaysSober, getStartDate, resetStartDate } from "@/lib/storage";
import milestonesData from "@/data/milestones.json";

export default function MilestonesPage() {
  const [daysSober, setDaysSober] = useState(0);
  const [startDate, setStartDateState] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    setDaysSober(getDaysSober());
    setStartDateState(getStartDate());
  }, []);

  function handleReset() {
    const today = new Date().toISOString().split("T")[0];
    resetStartDate(today);
    setDaysSober(0);
    setStartDateState(today);
    setShowReset(false);
  }

  function handleShare(name: string) {
    const text = `I reached ${name} in recovery. #CleanSlate`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      setShareText(name);
      setTimeout(() => setShareText(""), 2000);
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2">Milestones</h1>
      <p className="text-diluted text-sm mb-8">
        Your recovery is yours. These milestones can&apos;t be taken away.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {milestonesData.map((milestone) => {
          const earned = daysSober >= milestone.days;
          const isCurrent =
            earned &&
            (milestonesData.find(
              (m) => m.days > milestone.days && daysSober >= m.days
            ) === undefined ||
              milestone ===
                [...milestonesData]
                  .reverse()
                  .find((m) => daysSober >= m.days));
          const daysToGo = milestone.days - daysSober;

          return (
            <div
              key={milestone.days}
              className={`relative rounded-xl p-4 text-center transition-all duration-500 ${
                earned
                  ? "border-2 border-vermillion/60 bg-warm-white"
                  : "border border-paper/40 bg-warm-white/50"
              } ${isCurrent ? "animate-gentle-pulse" : ""}`}
            >
              {/* Chip circle */}
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-display font-bold text-lg ${
                  earned
                    ? "bg-vermillion/10 text-vermillion border-2 border-vermillion/40"
                    : "bg-paper/20 text-diluted border border-paper/50"
                }`}
              >
                {earned ? "✓" : milestone.days}
              </div>
              <h3
                className={`font-display font-semibold text-sm ${
                  earned ? "text-sumi" : "text-diluted"
                }`}
              >
                {milestone.name}
              </h3>
              <p className="text-xs text-diluted mt-1">
                {earned ? milestone.message : `${daysToGo} days to go`}
              </p>
              {earned && startDate && (
                <p className="text-[10px] text-diluted mt-1">
                  {new Date(
                    new Date(startDate).getTime() +
                      milestone.days * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              {earned && (
                <button
                  onClick={() => handleShare(milestone.name)}
                  className="text-[10px] text-diluted underline mt-1 hover:text-sumi transition-colors"
                >
                  {shareText === milestone.name ? "Copied!" : "Share"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset date */}
      <div className="border-t border-paper/30 pt-6">
        {showReset ? (
          <div className="text-center animate-fade-in">
            <p className="text-sumi mb-3 font-display">
              Welcome back. Every beginning takes courage.
            </p>
            <button
              onClick={handleReset}
              className="bg-sumi text-warm-white px-6 py-2 rounded-md font-display text-sm hover:bg-sumi/90 transition-colors"
            >
              Reset to Today
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="ml-3 text-diluted text-sm underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowReset(true)}
            className="text-diluted text-sm underline hover:text-sumi transition-colors block mx-auto"
          >
            Reset my date
          </button>
        )}
      </div>

      <p className="text-xs text-diluted mt-8 text-center italic">
        Not a substitute for professional treatment.
      </p>
    </div>
  );
}
