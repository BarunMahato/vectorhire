"use client";

import { useState } from "react";
import { Sparkles, Globe, Zap, Loader2, Linkedin, Database } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function AIAgentCenter() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { data: session } = useSession();

  // Extract session data
  const studentId = session?.user?.id;
  const resumeUrl = (session?.user as any)?.preferences?.resumeUrl;

  const startMayaSync = async () => {
    // Basic guard to prevent empty requests
    if (!studentId || !resumeUrl) {
      toast.error("Profile incomplete. Please upload your resume first.");
      return;
    }

    setIsSyncing(true);
    try {
      // SIMPLE FETCH: No custom ngrok headers to avoid CORS Preflight issues
      const response = await fetch("http://localhost:5678/webhook-test/external-hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          resumeUrl,
          source: "AGENT_DASHBOARD"
        }),
      });

      if (response.ok) {
        toast.success("Maya is now hunting!");
      } else {
        toast.error("Maya encountered an error. Check n8n.");
      }
    } catch (error) {
      console.error("Maya failed to start hunt", error);
      toast.error("Connection failed. Is n8n running?");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h2 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-black text-slate-900 tracking-tighter italic"
          >
            Agent Maya
          </motion.h2>
          <p className="text-slate-500 font-medium mt-1">Autonomous recruitment Intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 flex items-center gap-2">
            <Database size={12} /> Neural Sync: Active
          </div>
        </div>
      </header>

      {/* Control Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-3xl shadow-blue-500/20"
      >
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-blue-600 rounded-2xl"><Globe size={24} /></div>
             <h3 className="text-3xl font-black tracking-tight">External Sync Engine</h3>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Maya extracts keywords from your resume to perform real-time "Deep Crawls" across professional networks.
          </p>
          
          <button 
            onClick={startMayaSync}
            disabled={isSyncing}
            className="group relative bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-4"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="text-blue-600 fill-blue-600" />}
            {isSyncing ? "Syncing Clusters..." : "Execute Global Hunt"}
          </button>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
           <Sparkles size={300} />
        </div>
      </motion.div>

      {/* Findings Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
             <Linkedin size={28} className="text-blue-600" /> Web Discoveries
          </h3>
          <span className="text-xs font-bold text-slate-400">Total Found: 0</span>
        </div>
        
        <div className="py-32 border-4 border-dashed border-slate-100 rounded-[56px] text-center bg-slate-50/50">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto flex items-center justify-center animate-bounce">
              <Globe size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold text-lg tracking-tight">The hunt is idle.</p>
            <p className="text-slate-400 text-sm">Maya is waiting for your command to crawl the web.</p>
          </div>
        </div>
      </div>
    </div>
  );
}