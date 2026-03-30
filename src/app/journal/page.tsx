"use client";

import { useState, useEffect } from "react";
import {
  getDaysSober,
  getJournalEntries,
  addJournalEntry,
  type JournalEntry,
} from "@/lib/storage";
import prompts from "@/data/prompts.json";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState("");
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const days = getDaysSober();
    setTodayPrompt(prompts[days % prompts.length]);
    const date = new Date().toISOString().split("T")[0];
    setTodayDate(date);
    const all = getJournalEntries();
    setEntries(all.sort((a, b) => b.timestamp - a.timestamp));
    const todayEntry = all.find((e) => e.date === date);
    if (todayEntry) {
      setEntry(todayEntry.entry);
      setSaved(true);
    }
  }, []);

  function handleSave() {
    if (!entry.trim()) return;
    addJournalEntry({ date: todayDate, prompt: todayPrompt, entry });
    setSaved(true);
    setEntries(
      getJournalEntries().sort((a, b) => b.timestamp - a.timestamp)
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-6">Journal</h1>

      {/* Today's Prompt */}
      <div className="border border-paper/40 rounded-lg p-6 mb-6 bg-warm-white">
        <p className="text-xs text-diluted mb-2">Today&apos;s prompt</p>
        <p className="text-sumi text-lg italic">&ldquo;{todayPrompt}&rdquo;</p>
      </div>

      {/* Write */}
      <div className="mb-8">
        <textarea
          value={entry}
          onChange={(e) => {
            setEntry(e.target.value);
            setSaved(false);
          }}
          placeholder="Write as much or as little as you need..."
          rows={8}
          className="w-full border border-paper/50 rounded-lg px-4 py-3 bg-warm-white text-sumi resize-y text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleSave}
            disabled={!entry.trim() || saved}
            className="bg-sumi text-warm-white px-6 py-2 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {saved ? "Saved ✓" : "Save Entry"}
          </button>
          <p className="text-xs text-diluted">
            This journal is yours. It never leaves your device.
          </p>
        </div>
      </div>

      {/* Past Entries */}
      {entries.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">
            Past Entries
          </h2>
          <div className="space-y-4">
            {entries.map((e, i) => (
              <div
                key={i}
                className="border border-paper/30 rounded-lg p-4 bg-warm-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-diluted">
                    {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-xs text-diluted italic mb-2">
                  &ldquo;{e.prompt}&rdquo;
                </p>
                <p className="text-sm text-sumi whitespace-pre-wrap">
                  {e.entry}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-diluted mt-8 text-center italic">
        Not a substitute for professional treatment.
      </p>
    </div>
  );
}
