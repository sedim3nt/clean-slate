"use client";

import { useState } from "react";
import UrgeSurf from "@/components/features/UrgeSurf";
import GratitudeJar from "@/components/features/GratitudeJar";
import EmergencyContacts from "@/components/features/EmergencyContacts";
import HALTCheck from "@/components/features/HALTCheck";

const tools = [
  { id: "urge", label: "Urge Surfing", icon: "🌊" },
  { id: "gratitude", label: "Gratitude Jar", icon: "🫙" },
  { id: "halt", label: "HALT Check", icon: "✋" },
  { id: "emergency", label: "Emergency", icon: "☎" },
] as const;

type ToolId = (typeof tools)[number]["id"];

export default function ToolsPage() {
  const [active, setActive] = useState<ToolId | null>(null);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2">Tools</h1>
      <p className="text-diluted text-sm mb-8">
        Practical tools for hard moments.
      </p>

      {!active ? (
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className="border border-paper/40 rounded-xl p-6 text-center hover:border-paper transition-all duration-300 bg-warm-white"
            >
              <span className="text-3xl block mb-2">{tool.icon}</span>
              <span className="font-display font-semibold text-sm text-sumi">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActive(null)}
            className="text-diluted text-sm mb-6 hover:text-sumi transition-colors flex items-center gap-1"
          >
            ← Back to Tools
          </button>
          {active === "urge" && <UrgeSurf />}
          {active === "gratitude" && <GratitudeJar />}
          {active === "halt" && <HALTCheck />}
          {active === "emergency" && <EmergencyContacts />}
        </div>
      )}

      <p className="text-xs text-diluted mt-8 text-center italic">
        Not a substitute for professional treatment.
      </p>
    </div>
  );
}
