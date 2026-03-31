"use client";

import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Mic, MicOff, Square, Play, Loader2, Activity, MessageSquare } from "lucide-react";

// For demonstration. Replace with your actual auth hook if needed.
const MOCK_USER = { name: "Candidate", role: "Software Engineer" }; 

type CallStatus = "idle" | "connecting" | "active" | "error";
type TranscriptMessage = { role: "AI" | "User"; text: string };

export default function VectorHireInterview() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  
  // Ref strictly holds the active instance. No global variables.
  const vapiRef = useRef<Vapi | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Aggressive cleanup on unmount (e.g., when Next.js Fast Refreshes)
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current.removeAllListeners();
        vapiRef.current = null;
      }
    };
  }, []);

  const startInterview = async () => {
    try {
      setStatus("connecting");
      setTranscript([]); // Clear previous logs

      // 1. Destroy any existing instance completely
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current.removeAllListeners();
      }

      // 2. Create a BRAND NEW instance specifically for this click
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");
      vapiRef.current = vapi;

      // 3. Attach listeners to the new instance
      vapi.on("call-start", () => setStatus("active"));
      vapi.on("call-end", () => {
        setStatus("idle");
        setVolume(0);
        vapiRef.current = null;
      });
      vapi.on("volume-level", setVolume);
      vapi.on("error", (e) => {
        console.error("Vapi Connection Error:", e);
        setStatus("error");
        vapiRef.current = null;
      });
      vapi.on("message", (msg) => {
        if (msg.type === "transcript" && msg.transcriptType === "final") {
          setTranscript((prev) => [
            ...prev,
            { role: msg.role === "assistant" ? "AI" : "User", text: msg.transcript }
          ]);
        }
      });

      // 4. Start the call
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";
      await vapi.start(assistantId, {
        variableValues: {
          name: MOCK_USER.name,
          company: "VectorHire",
          role: MOCK_USER.role,
        }
      });

    } catch (err) {
      console.error("Failed to start Vapi:", err);
      setStatus("error");
    }
  };

  const endInterview = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current.removeAllListeners();
      vapiRef.current = null;
    }
    setStatus("idle");
    setVolume(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[700px]">
        
        {/* Left Column: Controls & Visualizer */}
        <div className="w-full md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between border-r border-slate-800">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Activity size={14} className={status === "active" ? "animate-pulse" : ""} />
              {status === "active" ? "Live Session" : status === "connecting" ? "Handshaking" : "Standby"}
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">VectorHire</h1>
            <p className="text-slate-400 text-sm">Autonomous Technical Screening</p>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div 
              className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-150 ${
                status === "active" ? "bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.5)]" : "bg-slate-800"
              }`}
              style={{ transform: status === "active" ? `scale(${1 + volume * 0.4})` : "scale(1)" }}
            >
              {status === "active" ? <Mic size={40} className="text-white" /> : <MicOff size={40} className="text-slate-500" />}
            </div>
            <p className="mt-6 text-xs text-slate-500 font-medium uppercase tracking-widest">
              {status === "active" ? "Audio Link Active" : "Microphone Off"}
            </p>
          </div>

          <div>
            {status === "idle" || status === "error" ? (
              <button
                onClick={startInterview}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Play size={18} fill="currentColor" /> Begin Interview
              </button>
            ) : (
              <button
                onClick={endInterview}
                disabled={status === "connecting"}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {status === "connecting" ? <Loader2 size={18} className="animate-spin" /> : <Square size={18} fill="currentColor" />}
                {status === "connecting" ? "Connecting..." : "End Session"}
              </button>
            )}
            {status === "error" && (
              <p className="text-red-400 text-xs text-center mt-3">Connection failed. Please try again.</p>
            )}
          </div>
        </div>

        {/* Right Column: Transcript */}
        <div className="w-full md:w-2/3 bg-white flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <MessageSquare size={18} className="text-slate-400" />
            <h2 className="font-semibold text-slate-700">Interview Transcript</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <MessageSquare size={32} className="opacity-20" />
                <p className="text-sm font-medium">Session logs will appear here</p>
              </div>
            ) : (
              transcript.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "User" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === "User" 
                      ? "bg-blue-600 text-white rounded-tr-sm shadow-sm" 
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                  }`}>
                    <span className="block text-[10px] font-bold uppercase mb-1 opacity-60 tracking-wider">
                      {msg.role === "User" ? "Candidate" : "VectorHire AI"}
                    </span>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}