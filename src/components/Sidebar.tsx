"use client";

import { useState } from "react";
import { Sparkles, Globe, Loader2 } from "lucide-react";

export function SidebarAgentControl({ studentId }: { studentId: string }) {
  const [isHunting, setIsHunting] = useState(false);

  const toggleAutopilot = async () => {
    setIsHunting(!isHunting);
    
    // Call n8n to start/stop the external job crawl
    await fetch("https://YOUR_N8N_URL/webhook/external-hunt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, active: !isHunting }),
    });
  };

  return (
    <div className="mt-auto p-4">
      <div className="bg-slate-900 rounded-[24px] p-6 shadow-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Sparkles size={18} className="text-blue-400" />
            {isHunting && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            )}
          </div>
          <span className="text-xs font-black text-white uppercase tracking-widest">Maya Autopilot</span>
        </div>

        <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
          {isHunting 
            ? "Maya is currently crawling LinkedIn & Indeed for your role..." 
            : "Activate Maya to hunt for jobs across the web automatically."}
        </p>

        <button 
          onClick={toggleAutopilot}
          className={`w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isHunting 
              ? "bg-slate-800 text-slate-400 border border-slate-700" 
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
          }`}
        >
          {isHunting ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
          {isHunting ? "Stop Hunting" : "Start External Hunt"}
        </button>
      </div>
    </div>
  );
}