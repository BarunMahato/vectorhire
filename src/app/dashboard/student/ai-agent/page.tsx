"use client";

import { useState, useEffect } from "react";
import { Sparkles, Globe, Zap, MailPlus, Loader2, ExternalLink, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAgentCenter() {
  const [isHunting, setIsHunting] = useState(false);
  const [externalJobs, setExternalJobs] = useState([]);

  // Trigger Maya's External Search via n8n
  const startMayaHunt = async () => {
    setIsHunting(true);
    try {
      // Replace with your real n8n Webhook URL
      const response = await fetch("https://YOUR_N8N_URL/webhook/external-hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: "CURRENT_USER_ID" }), // You'll get this from session
      });
      
      if (response.ok) {
        alert("Maya has started hunting! Check back in a few minutes.");
      }
    } catch (error) {
      console.error("Maya failed to start", error);
    } finally {
      setIsHunting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Agent Maya</h2>
          <p className="text-slate-500 font-medium">Your autonomous recruiter for the open web.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
          <Zap size={12} fill="currentColor" /> System: Optimized
        </div>
      </header>

      {/* Hero Control Card */}
      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-black mb-4">Unleash Maya on the Web</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Maya will crawl LinkedIn, Indeed, and Twitter to find roles matching your resume. 
            She'll even pre-write your cold emails to save you time.
          </p>
          <button 
            onClick={startMayaHunt}
            disabled={isHunting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 disabled:bg-slate-700"
          >
            {isHunting ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
            {isHunting ? "Maya is Hunting..." : "Start External Sync"}
          </button>
        </div>
        <Sparkles className="absolute right-[-20px] top-[-20px] text-white/10 w-64 h-64" />
      </div>

      {/* External Findings Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
           <Linkedin size={20} className="text-blue-600" /> Recent External Findings
        </h3>
        
        {/* We will map over externalJobs here once we fetch them from the DB */}
        <div className="p-20 border-2 border-dashed border-slate-200 rounded-[40px] text-center bg-white">
          <p className="text-slate-400 font-bold italic">No external jobs found yet. Start a sync to see Maya in action.</p>
        </div>
      </div>
    </div>
  );
}