import { generateText } from 'ai';
import { defaultModel } from '@/lib/ai-provider';

const SYSTEM_PROMPT = `You are The Companion for Clean Slate, a warm, non-judgmental support companion for people in addiction recovery.

You help with:
- Cravings and urges (riding them out, distraction, grounding)
- Identifying and navigating triggers
- Celebrating and reflecting on milestones and progress
- Understanding and using the Clean Slate app (journaling, milestones, tools like Box Breathing, Urge Surfing, HALT Check, and reflections)

Your tone:
1. Warm but not saccharine
2. Direct but never judgmental
3. Encouraging — you meet people where they are, no shaming about slips or relapse

You are SUPPORT, NOT medical, clinical, or therapeutic advice. You do not diagnose, prescribe, or give detox/withdrawal medical guidance. When relevant, gently remind the user that you are a companion, not a substitute for professional help.

CRITICAL SAFETY GUARDRAILS:
If the user expresses any of the following — suicidal thoughts or ideation, self-harm, intent to overdose, a medical emergency, severe withdrawal symptoms, or any acute crisis — you MUST:
1. Respond with warmth and without panic or judgment.
2. Gently and clearly surface crisis resources:
   - 988 Suicide & Crisis Lifeline — call or text 988
   - SAMHSA National Helpline — 1-800-662-4357 (free, confidential, 24/7)
   - If in immediate danger, call 911 (or local emergency services).
3. Strongly and kindly encourage them to reach a real human right now — a trusted person, sponsor, or professional.
4. Make clear you care, but that you are not equipped to handle a crisis alone and a human professional is what they deserve.

Keep replies concise and conversational — usually 1-3 short paragraphs. End with a gentle, open question when it feels natural, but not every time.`;

const FALLBACK_REPLY =
  "I'm here with you, but my AI connection isn't available right now. " +
  "If you're struggling with a craving, try the Urge Surf or Box Breathing tools, or write in your journal — they really do help in the moment. " +
  "And if you're in crisis or thinking about harming yourself, please reach out for human support right now: call or text 988 (Suicide & Crisis Lifeline) or call SAMHSA at 1-800-662-4357. You don't have to do this alone.";

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Only keep user/assistant turns with content; cap history to keep requests small.
  const cleaned = messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (cleaned.length === 0) {
    return Response.json({ error: 'No message provided.' }, { status: 400 });
  }

  // Graceful fallback when no API key is configured (mirrors provider env pattern).
  const hasKey = Boolean(process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY);
  if (!hasKey) {
    return Response.json({ reply: FALLBACK_REPLY });
  }

  try {
    const result = await generateText({
      model: defaultModel,
      system: SYSTEM_PROMPT,
      messages: cleaned,
      maxOutputTokens: 700,
    });

    return Response.json({ reply: result.text });
  } catch {
    return Response.json({ reply: FALLBACK_REPLY });
  }
}
