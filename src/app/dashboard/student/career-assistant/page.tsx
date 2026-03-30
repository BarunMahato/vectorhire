"use client";
import { useState, useRef, useEffect } from "react";

export default function CareerAssistantPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim() || isTyping) return;

  const userQuery = input;
  setInput("");
  setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
  setIsTyping(true);

  // Initialize the AI message as empty
  setMessages((prev) => [...prev, { role: "ai", content: "" }]);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userQuery }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = ""; // Buffer to hold the raw string

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // 1. Decode the chunk and add to buffer
      accumulatedResponse += decoder.decode(value, { stream: true });

      try {
        /* 2. Try to parse the accumulated string. 
          If n8n sends the whole JSON at once, this works perfectly.
        */
        const parsed = JSON.parse(accumulatedResponse);
        const actualText = parsed.output || parsed.text || accumulatedResponse;

        setMessages((prev) => {
          const rest = prev.slice(0, -1);
          return [...rest, { role: "ai", content: actualText }];
        });
      } catch (e) {
        setMessages((prev) => {
          const rest = prev.slice(0, -1);
          // Only show the buffer if it doesn't start with '{' (meaning it's raw text)
          const displayContent = accumulatedResponse.startsWith("{") 
            ? "Typing..." 
            : accumulatedResponse;
            
          return [...rest, { role: "ai", content: displayContent }];
        });
      }
    }
  } catch (err) {
    console.error("Streaming error:", err);
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "ai", content: "Sorry, I encountered an error connecting to the agent." }
    ]);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-4xl w-full flex flex-col h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <header className="bg-slate-900 p-6 text-white">
          <h1 className="text-2xl font-bold">VectorHire Assistant</h1>
          <p className="text-slate-400 text-sm">Query your career data & Supabase vector store in real-time.</p>
        </header>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-5 py-3 rounded-2xl leading-relaxed ${
                msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none shadow-md" 
                : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
              }`}>
                {msg.content || (isTyping && i === messages.length - 1 ? "..." : "")}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t flex items-center gap-4">
          <input
            type="text"
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
            placeholder="Ask anything about your stored jobs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isTyping}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:bg-gray-300"
          >
            {isTyping ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </main>
  );
}