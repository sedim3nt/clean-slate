"use client";

import { useState } from "react";

const haltItems = [
  {
    letter: "H",
    label: "Hungry",
    suggestion:
      "Eat something. Blood sugar affects everything. Even a small snack changes your brain chemistry.",
  },
  {
    letter: "A",
    label: "Angry",
    suggestion:
      "Name it. Write it down. Call someone. Anger unexpressed turns inward.",
  },
  {
    letter: "L",
    label: "Lonely",
    suggestion:
      "Text one person. Go to a meeting. You don't have to do this alone.",
  },
  {
    letter: "T",
    label: "Tired",
    suggestion:
      "Rest is not laziness. Sleep is recovery. Your body is healing — let it.",
  },
];

export default function HALTCheck() {
  const [active, setActive] = useState<Set<string>>(new Set());

  function toggle(letter: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">HALT Check</h2>
      <p className="text-diluted text-sm mb-6">
        Quick check: are you Hungry, Angry, Lonely, or Tired? These are the
        four states that trigger relapse.
      </p>

      <div className="space-y-3">
        {haltItems.map((item) => {
          const isActive = active.has(item.letter);
          return (
            <div key={item.letter}>
              <button
                onClick={() => toggle(item.letter)}
                className={`w-full text-left border rounded-lg p-4 transition-all duration-300 ${
                  isActive
                    ? "border-paper bg-paper/20"
                    : "border-paper/30 bg-warm-white hover:border-paper/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg transition-colors ${
                      isActive
                        ? "bg-sumi text-warm-white"
                        : "bg-paper/30 text-diluted"
                    }`}
                  >
                    {item.letter}
                  </span>
                  <span className="font-display font-semibold text-sumi">
                    {item.label}
                  </span>
                </div>
              </button>
              {isActive && (
                <div className="mt-2 ml-13 pl-4 border-l-2 border-paper/40 animate-fade-in">
                  <p className="text-sm text-sumi leading-relaxed py-2">
                    {item.suggestion}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {active.size > 0 && (
        <div className="mt-6 p-4 border border-paper/40 rounded-lg bg-warm-white text-center animate-fade-in">
          <p className="text-sm text-sumi">
            You identified{" "}
            <span className="font-display font-semibold">
              {active.size} trigger{active.size > 1 ? "s" : ""}
            </span>
            . Naming it is the first step. Now take one small action.
          </p>
        </div>
      )}
    </div>
  );
}
