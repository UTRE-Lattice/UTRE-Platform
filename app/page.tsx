"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  // ✅ Make sure the state is typed as Msg[]
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;

    // ✅ Ensure the literal type is preserved
    const userMsg: Msg = { role: "user", content: input };
    const next: Msg[] = [...messages, userMsg];

    setMessages(next);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });
    const data = await res.json();

    const botMsg: Msg = { role: "assistant", content: data.reply ?? "" };
    setMessages([...next, botMsg]);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-3">
      <h1 className="text-2xl font-bold">Seer Stone — Chat</h1>
      <div className="border rounded p-3 h-[60vh] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.role === "user" ? "You" : "Seer Stone"}:</b> {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="px-4 py-2 rounded bg-black text-white">
          Send
        </button>
      </div>
    </div>
  );
}
