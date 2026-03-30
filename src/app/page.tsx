"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStartDate,
  setStartDate,
  getDaysSober,
  addCheckIn,
  getTodayCheckIn,
  getLast7DaysCheckIns,
  isExploring,
  setExploring,
  type CheckIn,
} from "@/lib/storage";
import readings from "@/data/readings.json";

const moods = ["😔", "😕", "😐", "🙂", "😊"];
const cravingLabels = ["Intense", "High", "Moderate", "Low", "None"];
const cravingColors = [
  "bg-vermillion",
  "bg-vermillion/70",
  "bg-paper",
  "bg-diluted/40",
  "bg-diluted/20",
];

function MoodSpark({ checkins }: { checkins: CheckIn[] }) {
  if (checkins.length < 2) return null;
  const maxMood = 5;
  const height = 60;
  const width = 200;
  const points = checkins.map((c, i) => ({
    x: (i / (checkins.length - 1)) * width,
    y: height - (c.mood / maxMood) * height + 5,
  }));
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className="mt-6">
      <p className="text-xs text-diluted mb-2">How I&apos;m doing — last 7 days</p>
      <svg
        viewBox={`-5 0 ${width + 10} ${height + 10}`}
        className="w-full max-w-[220px] h-auto"
      >
        <path
          d={pathD}
          fill="none"
          stroke="#7C6F64"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1A1A1A" />
        ))}
      </svg>
    </div>
  );
}

function CrisisBanner() {
  return (
    <div className="bg-vermillion/10 border border-vermillion/30 rounded-lg p-4 mt-6 animate-fade-in">
      <p className="font-display font-semibold text-sumi mb-2">
        You&apos;re not alone. Reach out:
      </p>
      <div className="space-y-2 text-sm">
        <a
          href="tel:1-800-662-4357"
          className="block text-sumi underline"
        >
          SAMHSA: 1-800-662-4357
        </a>
        <p className="text-diluted">Crisis Text: text HOME to 741741</p>
        <a href="tel:988" className="block text-sumi underline">
          Suicide & Crisis: 988
        </a>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSetDate }: { onSetDate: (date: string) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div className="max-w-lg mx-auto text-center py-12 animate-fade-in">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-sumi mb-6">
        Clean Slate
      </h1>
      <p className="text-diluted text-lg mb-8 leading-relaxed">
        A private recovery companion.
        <br />
        Nothing leaves your device. Ever.
      </p>
      <div className="bg-warm-white border border-paper/50 rounded-lg p-6 mb-6 text-left">
        <label className="block text-sm text-diluted mb-2">
          When did your current recovery begin?
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-paper rounded-md px-3 py-2 bg-warm-white text-sumi"
        />
      </div>
      <button
        onClick={() => onSetDate(date)}
        className="w-full bg-sumi text-warm-white py-3 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors"
      >
        Set My Date
      </button>
      <button
        onClick={() => {
          setExploring(true);
          onSetDate("");
        }}
        className="mt-3 text-diluted text-sm underline hover:text-sumi transition-colors"
      >
        Just exploring
      </button>
    </div>
  );
}

export default function TodayPage() {
  const [hasDate, setHasDate] = useState<boolean | null>(null);
  const [daysSober, setDaysSober] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [cravings, setCravings] = useState<number | null>(null);
  const [gratitude, setGratitude] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [recentCheckins, setRecentCheckins] = useState<CheckIn[]>([]);
  const [exploring, setExploringState] = useState(false);

  const loadState = useCallback(() => {
    const start = getStartDate();
    const expl = isExploring();
    setHasDate(!!start || expl);
    setExploringState(expl);
    if (start) {
      setDaysSober(getDaysSober());
    }
    const today = getTodayCheckIn();
    if (today) {
      setMood(today.mood);
      setCravings(today.cravings);
      setGratitude(today.gratitude);
      setSubmitted(true);
    }
    setRecentCheckins(getLast7DaysCheckIns());
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  function handleSetDate(date: string) {
    if (date) {
      setStartDate(date);
    }
    setHasDate(true);
    loadState();
  }

  function handleSubmit() {
    if (mood === null || cravings === null) return;
    const today = new Date().toISOString().split("T")[0];
    addCheckIn({ date: today, mood: mood + 1, cravings: cravings + 1, gratitude });
    setSubmitted(true);
    setRecentCheckins(getLast7DaysCheckIns());
  }

  if (hasDate === null) return null;
  if (!hasDate) return <WelcomeScreen onSetDate={handleSetDate} />;

  const reading = readings[(daysSober || 0) % readings.length];
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const showCrisis = cravings !== null && cravings >= 3;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        {exploring ? (
          <h1 className="font-display text-4xl md:text-5xl font-bold text-sumi">
            Welcome
          </h1>
        ) : daysSober === 0 ? (
          <>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-sumi">
              Welcome.
            </h1>
            <p className="font-display text-2xl text-diluted mt-1">
              Day 1 is brave.
            </p>
          </>
        ) : (
          <h1 className="font-display text-4xl md:text-5xl font-bold text-sumi">
            Day {daysSober}
          </h1>
        )}
        <p className="text-diluted mt-2">{dateStr}</p>
      </div>

      {/* Daily Reading */}
      <div className="border border-paper/40 rounded-lg p-6 mb-8 bg-warm-white">
        <p className="text-sumi leading-relaxed text-lg italic">
          &ldquo;{reading.text}&rdquo;
        </p>
        <p className="text-diluted text-sm mt-3">
          — {reading.attribution}
        </p>
      </div>

      {/* Daily Check-In */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">
          Daily Check-In
        </h2>

        {submitted ? (
          <div className="border border-paper/40 rounded-lg p-6 bg-warm-white">
            <p className="text-diluted text-sm mb-3">Today&apos;s check-in</p>
            <div className="flex gap-4 items-center mb-2">
              <span className="text-2xl">{moods[(mood ?? 1) ]}</span>
              <span className="text-sm text-diluted">
                Cravings: {cravingLabels[(cravings ?? 0)]}
              </span>
            </div>
            {gratitude && (
              <p className="text-sm text-sumi mt-2">
                Grateful for: {gratitude}
              </p>
            )}
            <p className="text-xs text-diluted mt-3">
              ✓ Checked in for today
            </p>
          </div>
        ) : (
          <div className="border border-paper/40 rounded-lg p-6 bg-warm-white space-y-5">
            {/* Mood */}
            <div>
              <label className="text-sm text-diluted block mb-2">Mood</label>
              <div className="flex gap-3">
                {moods.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setMood(i)}
                    className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                      mood === i
                        ? "bg-paper/60 scale-110"
                        : "hover:bg-paper/30"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Cravings */}
            <div>
              <label className="text-sm text-diluted block mb-2">
                Cravings
              </label>
              <div className="flex gap-2">
                {cravingLabels.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setCravings(i)}
                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                      cravings === i
                        ? `${cravingColors[i]} text-sumi scale-105`
                        : "bg-paper/20 text-diluted hover:bg-paper/40"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gratitude */}
            <div>
              <label className="text-sm text-diluted block mb-2">
                Gratitude
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="One thing you're grateful for today..."
                className="w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={mood === null || cravings === null}
              className="w-full bg-sumi text-warm-white py-2.5 rounded-md font-display font-semibold hover:bg-sumi/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check In
            </button>
          </div>
        )}
      </div>

      {/* Crisis Banner */}
      {showCrisis && <CrisisBanner />}

      {/* Mood Spark */}
      <MoodSpark checkins={recentCheckins} />

      {/* Privacy note */}
      <p className="text-xs text-diluted mt-8 text-center">
        This never leaves your device. •{" "}
        <span className="italic">
          Not a substitute for professional treatment.
        </span>
      </p>
    </div>
  );
}
