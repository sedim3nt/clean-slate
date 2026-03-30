"use client";

import { useState, useEffect } from "react";

interface ThoughtEntry {
  situation: string;
  thought: string;
  challenge: string;
  timestamp: number;
  date: string;
}

const STORAGE_KEY = "cs_thought_records";

function getRecords(): ThoughtEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecord(entry: ThoughtEntry) {
  const records = getRecords();
  records.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function ThoughtRecord() {
  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [challenge, setChallenge] = useState("");
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ThoughtEntry[]>([]);

  useEffect(() => {
    setHistory(getRecords());
  }, []);

  function handleSave() {
    if (!situation.trim() && !thought.trim() && !challenge.trim()) return;
    const entry: ThoughtEntry = {
      situation: situation.trim(),
      thought: thought.trim(),
      challenge: challenge.trim(),
      timestamp: Date.now(),
      date: new Date().toISOString().split("T")[0],
    };
    saveRecord(entry);
    setHistory(getRecords());
    setSituation("");
    setThought("");
    setChallenge("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-2">Thought Record</h2>
      <p className="text-diluted text-sm mb-6">
        CBT-based thought challenging. Separate what happened from what your mind
        tells you about it.
      </p>

      {!showHistory ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-diluted block mb-1.5">
              The Situation — What happened?
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Describe the event or trigger..."
              rows={3}
              className="w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-diluted block mb-1.5">
              The Thought — What went through your mind?
            </label>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="What did you tell yourself?"
              rows={3}
              className="w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-diluted block mb-1.5">
              The Challenge — Is this thought 100% true? What would you tell a
              friend?
            </label>
            <textarea
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="Challenge the thought with evidence and compassion..."
              rows={3}
              className="w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!situation.trim() && !thought.trim() && !challenge.trim()}
            className="w-full bg-sumi text-warm-white py-2.5 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? "✓ Saved" : "Save Record"}
          </button>

          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className="w-full text-diluted text-sm underline hover:text-sumi transition-colors text-center"
            >
              View history ({history.length} record
              {history.length !== 1 ? "s" : ""})
            </button>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowHistory(false)}
            className="text-diluted text-sm mb-6 hover:text-sumi transition-colors flex items-center gap-1"
          >
            ← Back to new record
          </button>

          <div className="space-y-4">
            {history.map((entry, i) => (
              <div
                key={entry.timestamp}
                className="border border-paper/40 rounded-lg p-4 bg-warm-white"
              >
                <p className="text-xs text-diluted mb-3">{entry.date}</p>
                {entry.situation && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-diluted">
                      Situation
                    </p>
                    <p className="text-sm text-sumi">{entry.situation}</p>
                  </div>
                )}
                {entry.thought && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-diluted">
                      Thought
                    </p>
                    <p className="text-sm text-sumi">{entry.thought}</p>
                  </div>
                )}
                {entry.challenge && (
                  <div>
                    <p className="text-xs font-semibold text-diluted">
                      Challenge
                    </p>
                    <p className="text-sm text-sumi">{entry.challenge}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
