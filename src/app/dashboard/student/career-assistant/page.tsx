"use client";

import { Bot, Loader2, SendHorizontal, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "ai"; content: string };

export default function CareerAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    setInput("");
    setMessages((previous) => [...previous, { role: "user", content: userQuery }, { role: "ai", content: "" }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery }),
      });

      if (!response.ok) {
        throw new Error("Agent response failed");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        accumulatedResponse += decoder.decode(value, { stream: true });

        try {
          const parsed = JSON.parse(accumulatedResponse) as { output?: string; text?: string };
          const actualText = parsed.output || parsed.text || accumulatedResponse;

          setMessages((previous) => [...previous.slice(0, -1), { role: "ai", content: actualText }]);
        } catch {
          setMessages((previous) => {
            const displayContent = accumulatedResponse.startsWith("{") ? "Typing..." : accumulatedResponse;
            return [...previous.slice(0, -1), { role: "ai", content: displayContent }];
          });
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((previous) => [
        ...previous.slice(0, -1),
        { role: "ai", content: "Sorry, I encountered an error connecting to the agent." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] flex flex-col items-center px-2 md:px-4">
      <div className="max-w-4xl w-full flex flex-col h-[80vh] bg-white rounded-[32px] shadow-2xl shadow-slate-200/80 overflow-hidden border border-slate-200">
        <header className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                <Sparkles size={12} /> RAG Assistant
              </div>
              <h1 className="text-2xl font-black tracking-tight">VectorHire Assistant</h1>
              <p className="text-slate-400 text-sm">Query your career data and Supabase vector store in real time.</p>
            </div>
            <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
              <Bot size={24} />
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/60">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-sm rounded-[28px] border border-dashed border-slate-200 bg-white p-8">
                <Bot className="mx-auto mb-3 text-blue-600" />
                <p className="font-black text-slate-900">Ask Maya about your jobs, skills, or next application.</p>
                <p className="mt-2 text-sm text-slate-400">Example: Which roles match my resume best?</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl leading-relaxed text-sm shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                }`}
                >
                  {message.content || (isTyping && index === messages.length - 1 ? <Loader2 className="animate-spin" size={16} /> : "")}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 md:p-6 bg-white border-t border-slate-100 flex items-center gap-3 md:gap-4">
          <input
            type="text"
            className="flex-1 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all font-medium"
            placeholder="Ask anything about your stored jobs..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 md:px-6 py-3 rounded-2xl transition-colors disabled:bg-slate-300 flex items-center gap-2"
          >
            {isTyping ? <Loader2 className="animate-spin" size={18} /> : <SendHorizontal size={18} />}
            <span className="hidden sm:inline">{isTyping ? "Thinking" : "Send"}</span>
          </button>
        </form>
      </div>
    </main>
  );
}
