"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi, I'm The Companion. I'm here to talk through cravings, triggers, milestones, or anything on your mind in recovery. How are you doing right now?",
};

export default function RecoveryChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Try again in a moment.");
      }

      const data = await res.json();
      if (typeof data?.reply !== "string") {
        throw new Error("Something went wrong. Try again in a moment.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat with The Companion"}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] h-14 w-14 rounded-full bg-sumi text-warm-white shadow-lg flex items-center justify-center text-xl hover:bg-sumi/90 transition-colors"
      >
        {open ? "✕" : "✦"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-[60] w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[560px] bg-warm-white border border-paper/50 rounded-xl shadow-xl flex flex-col animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-paper/40 shrink-0">
            <p className="font-display font-semibold text-sm flex items-center gap-2">
              <span>✦</span> The Companion
            </p>
            <p className="text-[11px] text-diluted leading-snug mt-0.5">
              A supportive companion, not a substitute for professional help.
            </p>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "bg-sumi text-warm-white rounded-2xl rounded-br-sm px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap"
                      : "bg-paper/30 text-sumi rounded-2xl rounded-bl-sm px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap leading-relaxed"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-paper/30 text-diluted rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-pulse">•</span>
                    <span className="animate-pulse [animation-delay:150ms]">•</span>
                    <span className="animate-pulse [animation-delay:300ms]">•</span>
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-800">{error}</p>
              </div>
            )}
          </div>

          {/* Crisis note */}
          <div className="px-3 py-2 border-t border-paper/30 shrink-0">
            <p className="text-[10px] text-diluted leading-snug">
              In crisis? Call or text{" "}
              <a href="tel:988" className="underline font-semibold">
                988
              </a>{" "}
              or call{" "}
              <a href="tel:1-800-662-4357" className="underline">
                SAMHSA 1-800-662-4357
              </a>
              .
            </p>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-paper/40 shrink-0 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 border border-paper/50 rounded-md px-3 py-2 text-sm bg-warm-white focus:outline-none focus:border-sumi/40 disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-sumi text-warm-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sumi/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
