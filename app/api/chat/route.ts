import { NextResponse } from "next/server";

const SYSTEM = `You are Seer Stone, voice of Emotional Physics™.
Blend real science, history, and clear metaphors. Be concise and helpful.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // --- Plug in Ilm later by uncommenting this block ---
  // const url = process.env.ILM_API_URL;
  // const key = process.env.ILM_API_KEY;
  // if (url && key) {
  //   const resp = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${key}`
  //     },
  //     body: JSON.stringify({ system: SYSTEM, messages })
  //   });
  //   const data = await resp.json();
  //   return NextResponse.json({ reply: data.reply ?? data.choices?.[0]?.message?.content ?? "…" });
  // }

  // Canned reply for now
  const last = messages?.[messages.length - 1]?.content ?? "";
  const reply =
    `Here’s a Seer Stone answer without Ilm:\n\n` +
    `• Physics: Information moves like ripples.\n` +
    `• History: We stand on experiments—ask and we’ll cite as we grow.\n` +
    `• Metaphor: You push the swing; we keep the rhythm. You said: “${last}”.`;

  return NextResponse.json({ reply });
}
