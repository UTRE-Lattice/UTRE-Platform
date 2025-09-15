Do you think this will fix it 

"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.reply || "I'm sorry, I couldn't generate a response." 
      };
      
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error processing your request."
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Seer Stone — Chat</h1>

      <div className="border rounded-lg p-4 h-[60vh] overflow-y-auto bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-8">
            Start a conversation with Seer Stone...
          </p>
        )}
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className={`font-semibold ${
              message.role === "user" ? "text-blue-600" : "text-green-600"
            }`}>
              {message.role === "user" ? "You" : "Seer Stone"}:
            </div>
            <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 italic">Seer Stone is thinking...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          onKeyDown={(e) => e.key === "Enter" && !isLoading && send()}
          disabled={isLoading}
        />
        <button 
          onClick={send} 
          disabled={!input.trim() || isLoading}
          className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
