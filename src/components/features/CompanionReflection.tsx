"use client";

import { useState, useRef, useEffect } from "react";
import { getJournalEntries, getDaysSober } from "@/lib/storage";

export default function CompanionReflection() {
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [consented, setConsented] = useState(false);
  const reflectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reflectionRef.current) {
      reflectionRef.current.scrollTop = reflectionRef.current.scrollHeight;
    }
  }, [reflection]);

  async function handleReflect() {
    if (!consented) {
      setShowDisclaimer(true);
      return;
    }
    await fetchReflection();
  }

  async function handleConsent() {
    setConsented(true);
    setShowDisclaimer(false);
    await fetchReflection();
  }

  async function fetchReflection() {
    const entries = getJournalEntries();
    if (entries.length === 0) {
      setError("Write a journal entry first — The Companion needs something to reflect on.");
      return;
    }

    const recent = entries
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7)
      .map((e) => ({ date: e.date, content: e.entry }));

    const daysSober = getDaysSober();
    const milestones = daysSober > 0 ? `${daysSober} days in recovery` : undefined;

    setLoading(true);
    setReflection("");
    setError("");

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: recent, milestones }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Try again in a moment.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          setReflection((prev) => prev + decoder.decode(value));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-sumi/50 z-50 flex items-center justify-center p-4">
          <div className="bg-warm-white rounded-xl border border-paper/50 p-6 max-w-md w-full animate-fade-in">
            <h3 className="font-display text-lg font-semibold mb-3">
              Before we begin
            </h3>
            <div className="text-sm text-sumi space-y-3 mb-5">
              <p>
                Your journal entries will be sent to an AI service for reflection.
                No data is stored beyond this session.
              </p>
              <p className="text-diluted text-xs">
                The Companion is not a therapist, counselor, or medical professional.
                It offers reflection, not advice.
              </p>
              <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-800">
                  If you&apos;re in crisis, please contact:
                </p>
                <p className="text-xs text-red-700 mt-1">
                  <a href="tel:988" className="underline font-semibold">988</a> Suicide &amp; Crisis Lifeline
                  <br />
                  <a href="tel:1-800-662-4357" className="underline">SAMHSA 1-800-662-4357</a>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="flex-1 border border-paper/50 rounded-md py-2 text-sm text-diluted hover:text-sumi transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConsent}
                className="flex-1 bg-sumi text-warm-white rounded-md py-2 text-sm font-semibold hover:bg-sumi/90 transition-colors"
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reflect Button */}
      <button
        onClick={handleReflect}
        disabled={loading}
        className="w-full border border-paper/40 rounded-lg p-4 bg-warm-white hover:border-sumi/30 transition-all duration-300 text-left group disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{loading ? "⏳" : "✦"}</span>
          <div>
            <p className="font-display font-semibold text-sm group-hover:text-sumi transition-colors">
              {loading ? "Reflecting..." : "Reflect with The Companion"}
            </p>
            <p className="text-xs text-diluted">
              AI-powered reflection on your recent journal entries
            </p>
          </div>
        </div>
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Reflection */}
      {reflection && (
        <div
          ref={reflectionRef}
          className="mt-4 border border-paper/40 rounded-lg p-6 bg-warm-white animate-fade-in"
        >
          <p className="text-xs text-diluted mb-3 flex items-center gap-2">
            <span>✦</span> The Companion
          </p>
          <div className="text-sm text-sumi leading-relaxed whitespace-pre-wrap">
            {reflection}
          </div>
          <p className="text-xs text-diluted mt-4 pt-3 border-t border-paper/30 italic">
            This reflection is not professional advice. Trust your own experience.
          </p>
        </div>
      )}
    </div>
  );
}
