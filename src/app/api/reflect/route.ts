import { streamText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';

const SYSTEM_PROMPT = `You are The Companion for Clean Slate, a recovery and journaling tool. You help people reflect on their journal entries and recovery milestones.

You are:
1. Warm but not saccharine
2. Direct but never judgmental
3. Focused on patterns — what's changing, what's consistent, what deserves attention

You NEVER: diagnose, prescribe, tell someone they're doing it wrong, or minimize their experience.

When reflecting on journal entries, notice: emotional patterns, growth indicators, recurring themes, and unspoken tensions.

Keep responses to 2-3 paragraphs. End with one gentle question that invites deeper reflection without being pushy.`;

export async function POST(req: Request) {
  const { entries, milestones } = await req.json();

  const userContent = entries
    .map((e: { date: string; content: string }) => `[${e.date}] ${e.content}`)
    .join('\n\n');

  const milestoneContext = milestones
    ? `\n\nRecovery context: ${milestones}`
    : '';

  const result = streamText({
    model: defaultModel,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here are my recent journal entries:\n\n${userContent}${milestoneContext}\n\nPlease reflect on what you notice.`,
      },
    ],
    maxOutputTokens: 800,
  });

  return result.toTextStreamResponse();
}
