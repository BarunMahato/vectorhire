"use client";
import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useSession } from "@/lib/auth-client";
import { Mic, MicOff, PhoneOff, Play, Loader2, MessageSquare } from "lucide-react";

// Initialize outside to prevent re-instantiation
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");

export default function MockInterviewPage() {
  const { data: session, isPending } = useSession();
  const [isCalling, setIsCalling] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [volume, setVolume] = useState(0);
  
  const lastTranscriptRef = useRef("");

  useEffect(() => {
    vapi.on("call-start", () => {
      setIsCalling(true);
      setConnecting(false);
    });

    vapi.on("call-end", () => {
      setIsCalling(false);
      setConnecting(false);
      setTranscript("");
      setVolume(0);
      lastTranscriptRef.current = "";
    });

    vapi.on("volume-level", (level) => {
      setVolume(level);
    });

    // Final fix for double-texting: Ensure we only append unique final transcripts
    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newEntry = `${message.role === "assistant" ? "AI: " : "You: "}${message.transcript}`;
        
        if (lastTranscriptRef.current !== newEntry) {
          setTranscript((prev) => prev + (prev ? "\n" : "") + newEntry);
          lastTranscriptRef.current = newEntry;
        }
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi Error:", error);
      setConnecting(false);
      setIsCalling(false);
    });

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, []);

  const startInterview = async () => {
    if (!session?.user) return;
    setConnecting(true);
    
    // Type casting to access your custom Better-Auth fields
    const user = session.user as any;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "3f12e177-93b8-436d-abc1-c72b17fc78c5";

    try {
      await vapi.start(assistantId, {
        variableValues: {
          name: user.name || "Candidate",
          role: user.targetRole || user.role || "Software Engineer",
          company: user.companyName || "VectorHire Partner",
          skills: user.preferences || "Full Stack Development",
          jd: user.jdUrl || "Standard Software Engineering requirements", // The key JD field
        }
      });
    } catch (err) {
      console.error("Vapi Start Error:", err);
      setConnecting(false);
      setIsCalling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full mb-6 tracking-[0.2em] uppercase">
            Gemini 1.5 Pro Live
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-3">VectorHire</h1>
          <p className="text-slate-400 font-medium">AI-Driven Mock Technical Interview</p>
        </div>

        {/* Dynamic Visualizer */}
        <div 
          className={`w-52 h-52 mx-auto rounded-full flex items-center justify-center mb-12 transition-all duration-100 ${
            isCalling ? "bg-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.4)]" : "bg-slate-50 border border-slate-100"
          }`}
          style={{ transform: isCalling ? `scale(${1 + volume * 0.4})` : 'scale(1)' }}
        >
          {isCalling ? (
            <div className="relative flex items-center justify-center">
               <div className="absolute w-full h-full animate-ping bg-white/20 rounded-full" />
               <Mic size={72} className="text-white relative z-10" />
            </div>
          ) : (
            <MicOff size={72} className="text-slate-200" />
          )}
        </div>

        {/* Real-time Analysis Box */}
        {isCalling && (
          <div className="mb-10 p-6 bg-slate-900 rounded-[2rem] border border-blue-500/20 shadow-2xl max-h-52 overflow-y-auto scroll-smooth">
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Live Transcript
            </div>
            <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap italic">
              {transcript || "Establishing neural link..."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {!isCalling ? (
            <button
              onClick={startInterview}
              disabled={connecting || isPending}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-2xl hover:-translate-y-1 disabled:bg-slate-100 disabled:text-slate-400"
            >
              {connecting ? <Loader2 className="animate-spin" /> : <Play size={24} className="fill-white" />}
              {connecting ? "Initializing AI..." : "Start Voice Interview"}
            </button>
          ) : (
            <button
              onClick={() => vapi.stop()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
            >
              <PhoneOff size={24} /> End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}