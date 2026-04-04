# Clean Slate

A recovery and sobriety tracking app with daily check-ins, journaling, and AI-powered reflection.

**Live:** [cleanslate.spirittree.dev](https://cleanslate.spirittree.dev)
**Stack:** Next.js, TailwindCSS, Supabase, OpenRouter
**Status:** Active

## What This Is

Clean Slate is a private, compassionate recovery tool. It tracks sobriety milestones, captures daily check-ins (mood, cravings, journal entries), and offers an AI companion for reflective conversations about your recovery journey.

Everything is stored locally by default — your data doesn't leave your browser unless you choose to sync. The design is intentionally calm: no gamification, no streaks-as-punishment, no guilt. Just a clean surface for honest self-tracking and gentle AI-supported reflection.

## Features

- 📅 **Sobriety Counter** — days since your chosen start date
- 📝 **Daily Check-ins** — mood (emoji scale), craving intensity, and freeform journal
- 📊 **Mood Sparkline** — 7-day visual trend of your emotional state
- 🤖 **The Companion** — AI reflection on your journal entries and patterns
- 📖 **Daily Readings** — curated reflections for each day
- 🔒 **Privacy-first** — localStorage by default, no account required
- 🕵️ **Explore Mode** — try the app without committing data

## AI Integration

**The Companion** — an AI reflection partner powered by OpenRouter. Given your check-in data, it notices emotional patterns, growth indicators, recurring themes, and unspoken tensions. Warm but not saccharine, direct but never judgmental. Ends with one gentle question that invites deeper reflection.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Database:** Supabase (optional sync) + localStorage
- **AI:** OpenRouter (via Vercel AI SDK)
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` / `OPENROUTER_API_KEY` | OpenRouter API key for The Companion |
| `AI_BASE_URL` | AI provider base URL (defaults to OpenRouter) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (optional, for sync) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (optional) |

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
