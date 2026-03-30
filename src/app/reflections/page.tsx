"use client";

import { useState, useEffect } from "react";
import {
  getSelectedPath,
  setSelectedPath,
  getDaysSober,
  type SpiritualPath,
} from "@/lib/storage";

const paths: {
  id: SpiritualPath;
  icon: string;
  name: string;
  desc: string;
}[] = [
  {
    id: "traditional",
    icon: "🙏",
    name: "Traditional Faith",
    desc: "God, Christ, Allah, Higher Power",
  },
  {
    id: "nature",
    icon: "🌿",
    name: "Nature-Based",
    desc: "Earth, seasons, interconnection",
  },
  {
    id: "mindfulness",
    icon: "🧘",
    name: "Mindfulness",
    desc: "Awareness, presence, non-attachment",
  },
  {
    id: "humanist",
    icon: "🌍",
    name: "Humanist",
    desc: "Humanity, service, collective good",
  },
  {
    id: "philosophical",
    icon: "📖",
    name: "Philosophical",
    desc: "Stoicism, meaning-making, wisdom",
  },
  {
    id: "exploring",
    icon: "❓",
    name: "Exploring",
    desc: "Mix and match, no commitment",
  },
];

const practices: Record<SpiritualPath, { title: string; steps: string[] }[]> = {
  traditional: [
    {
      title: "Morning Prayer",
      steps: [
        "Find a quiet space. Close your eyes.",
        "Speak or think: 'Grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference.'",
        "Sit with that for one minute. Let the words settle.",
        "Ask for strength for this day — just this one day.",
      ],
    },
    {
      title: "Evening Gratitude",
      steps: [
        "Before sleep, name three moments from today where you felt grace.",
        "Say 'thank you' — to God, to your Higher Power, to the force that kept you here.",
        "Release tomorrow. It is not yours yet.",
      ],
    },
  ],
  nature: [
    {
      title: "Grounding Practice",
      steps: [
        "Step outside. Feel the air on your skin.",
        "Touch the ground, a tree, or a stone.",
        "Name three things you can hear right now.",
        "You are part of this world. You belong here.",
      ],
    },
    {
      title: "Seasonal Reflection",
      steps: [
        "What season is it? What is nature doing right now?",
        "If it's winter: rest is not death. Spring always comes.",
        "If it's spring: you too are growing, even when it's hard to see.",
        "If it's summer: let yourself feel warmth. You deserve it.",
        "If it's fall: what are you ready to let go of?",
      ],
    },
  ],
  mindfulness: [
    {
      title: "Three-Minute Breathing",
      steps: [
        "Sit comfortably. Close your eyes if you wish.",
        "For one minute: notice what you're thinking and feeling. Don't change it. Just notice.",
        "For one minute: focus only on your breath. In through the nose, out through the mouth.",
        "For one minute: expand your awareness to your whole body. Feel your feet on the ground. Feel yourself here.",
        "Open your eyes. You are present.",
      ],
    },
    {
      title: "Non-Attachment Practice",
      steps: [
        "Notice a craving, thought, or emotion you're holding tightly.",
        "Name it silently: 'This is craving.' 'This is anxiety.' 'This is sadness.'",
        "Imagine placing it on a leaf floating down a stream.",
        "Watch it move away. It is not you. It is passing through you.",
      ],
    },
  ],
  humanist: [
    {
      title: "Service Practice",
      steps: [
        "Do one thing for someone else today. It doesn't have to be big.",
        "Hold a door. Send a kind text. Listen without advice.",
        "Notice how it feels to be useful. That feeling? That's your higher power at work.",
      ],
    },
    {
      title: "Connection Reflection",
      steps: [
        "Think of one person who is also struggling today — anywhere in the world.",
        "You don't know their name. But they're real. They're fighting too.",
        "Send them strength in your mind. You are connected by the simple act of trying.",
        "You are not alone in this.",
      ],
    },
  ],
  philosophical: [
    {
      title: "Stoic Morning Reflection",
      steps: [
        "Before your day begins, consider: what is within your control today?",
        "Your actions. Your responses. Your effort. That's it.",
        "Everything else — let it be. As Marcus Aurelius wrote: 'Accept the things to which fate binds you.'",
        "Choose one intention for today. Hold it lightly.",
      ],
    },
    {
      title: "Evening Review (Seneca's Practice)",
      steps: [
        "At the end of the day, ask yourself three questions:",
        "What did I do well today?",
        "What could I have done better?",
        "What did I learn?",
        "No judgment. Just observation. The examined life is the recovered life.",
      ],
    },
  ],
  exploring: [],
};

export default function ReflectionsPage() {
  const [selected, setSelected] = useState<SpiritualPath | null>(null);
  const [daysSober, setDaysSober] = useState(0);

  useEffect(() => {
    setSelected(getSelectedPath());
    setDaysSober(getDaysSober());
  }, []);

  function choosePath(path: SpiritualPath) {
    setSelectedPath(path);
    setSelected(path);
  }

  // For "exploring" path, rotate through others
  const exploringPaths: SpiritualPath[] = [
    "traditional",
    "nature",
    "mindfulness",
    "humanist",
    "philosophical",
  ];
  const todayPath =
    selected === "exploring"
      ? exploringPaths[daysSober % exploringPaths.length]
      : selected;

  const todayPractices = todayPath ? practices[todayPath] : [];
  const todayPractice = todayPractices.length
    ? todayPractices[daysSober % todayPractices.length]
    : null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2">Reflections</h1>
      <p className="text-diluted text-sm mb-8">
        Your path can change. There&apos;s no wrong answer here.
      </p>

      {/* Path Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {paths.map((path) => (
          <button
            key={path.id}
            onClick={() => choosePath(path.id)}
            className={`border rounded-xl p-4 text-left transition-all duration-300 ${
              selected === path.id
                ? "border-sumi bg-sumi/5"
                : "border-paper/40 bg-warm-white hover:border-paper"
            }`}
          >
            <span className="text-2xl block mb-1">{path.icon}</span>
            <span className="font-display font-semibold text-sm block">
              {path.name}
            </span>
            <span className="text-xs text-diluted">{path.desc}</span>
          </button>
        ))}
      </div>

      {/* Today's Practice */}
      {selected && todayPractice && (
        <div className="border border-paper/40 rounded-lg p-6 bg-warm-white animate-fade-in">
          <p className="text-xs text-diluted mb-1">
            Today&apos;s practice
            {selected === "exploring" && todayPath && (
              <span>
                {" "}
                — {paths.find((p) => p.id === todayPath)?.name}
              </span>
            )}
          </p>
          <h3 className="font-display text-xl font-semibold mb-4">
            {todayPractice.title}
          </h3>
          <ol className="space-y-3">
            {todayPractice.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-sumi leading-relaxed">
                <span className="text-diluted font-display shrink-0 w-5 text-right">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {selected && !todayPractice && selected === "exploring" && (
        <div className="border border-paper/40 rounded-lg p-6 bg-warm-white text-center">
          <p className="text-diluted">
            Choose a path above to begin your practice.
          </p>
        </div>
      )}

      <p className="text-xs text-diluted mt-8 text-center italic">
        Not a substitute for professional treatment.
      </p>
    </div>
  );
}
