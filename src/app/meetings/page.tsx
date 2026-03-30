"use client";

import meetingsData from "@/data/meetings.json";

interface Program {
  name: string;
  founded: string;
  stats: string;
  description: string;
  url: string;
}

function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="border border-paper/40 rounded-lg overflow-hidden bg-warm-white">
      <div className="bg-paper/20 px-5 py-3 border-b border-paper/30">
        <h3 className="font-display font-bold text-sumi text-base">
          {program.name}
        </h3>
        <p className="text-xs text-diluted mt-0.5">
          Founded {program.founded} · {program.stats}
        </p>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-sumi leading-relaxed mb-4">
          {program.description}
        </p>
        <a
          href={program.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-sumi text-warm-white px-4 py-2 rounded-md text-sm font-display font-semibold hover:bg-sumi/90 transition-colors"
        >
          Find a Meeting →
        </a>
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-sumi mb-3">
          Find Your People
        </h1>
        <p className="text-diluted text-lg max-w-lg mx-auto">
          Recovery works in community. Every path is valid.
        </p>
      </div>

      {/* Twelve-Step Programs */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#4A7C9B] rounded-full" />
          <h2 className="font-display text-2xl font-bold text-sumi">
            Twelve-Step Programs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetingsData.twelveStep.map((program) => (
            <ProgramCard key={program.name} program={program} />
          ))}
        </div>
      </section>

      {/* Alternative & Secular Programs */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#5B8C5A] rounded-full" />
          <h2 className="font-display text-2xl font-bold text-sumi">
            Alternative &amp; Secular Programs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetingsData.nonTwelveStep.map((program) => (
            <ProgramCard key={program.name} program={program} />
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-diluted text-center italic mt-8 mb-4">
        Clean Slate is not affiliated with any recovery organization. This is a
        companion tool, not a substitute for professional treatment.
      </p>
    </div>
  );
}
