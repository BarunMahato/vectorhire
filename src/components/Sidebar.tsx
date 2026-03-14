"use client";

import { useState } from "react";
import { Sparkles, Globe, Loader2, Power } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

interface SidebarAgentProps {
  studentId: string;
  resumeUrl: string; // This will be passed from the Layout
}

export function SidebarAgentControl({ 
  studentId, 
  resumeUrl 
}: SidebarAgentProps) {
  const [isHunting, setIsHunting] = useState(false);

  const toggleAutopilot = async () => {
    // 1. Guard Clause: Don't start if we don't have the resume URL
    if (!isHunting && (!studentId || !resumeUrl)) {
      toast.error("Please upload your resume in Profile settings first!", {
        style: { borderRadius: '15px', background: '#1e293b', color: '#fff' }
      });
      return;
    }

    const nextState = !isHunting;
    setIsHunting(nextState);

    if (nextState) {
      // 2. Trigger n8n Webhook
      toast.promise(
        fetch("https://coelanaglyphic-jazmine-sinuous.ngrok-free.dev/webhook-test/dad127ba-627b-469b-b264-83a70536b574", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "ngrok-skip-browser-warning": "true" 
          },
          body: JSON.stringify({ 
            studentId, 
            resumeUrl, 
            active: true,
            source: "SIDEBAR_WIDGET" 
          }),
        }),
        {
          loading: 'Maya initializing sensors...',
          success: <b>Maya is now hunting on LinkedIn!</b>,
          error: <b>Failed to launch Maya.</b>,
        },
        { 
            style: { borderRadius: '20px', background: '#0f172a', color: '#fff', fontSize: '12px' },
            success: { duration: 4000 }
        }
      );
    } else {
      toast("Maya Autopilot Deactivated", { 
        icon: '🛑',
        style: { borderRadius: '20px', background: '#1e293b', color: '#fff', fontSize: '12px' }
      });
    }
  };

  return (
    <div className="mt-auto p-4">
      <motion.div 
        initial={false}
        animate={{ 
            borderColor: isHunting ? "#3b82f6" : "#1e293b",
            scale: isHunting ? 1.02 : 1
        }}
        className="bg-slate-900 rounded-[32px] p-5 shadow-2xl border-2 transition-all relative overflow-hidden"
      >
        {/* Glow effect when active */}
        {isHunting && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-500/10 pointer-events-none" 
          />
        )}
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className={isHunting ? "text-blue-400" : "text-slate-500"} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Maya Intelligence</span>
          </div>
          <div className={`h-2 w-2 rounded-full ${isHunting ? "bg-blue-400 animate-pulse" : "bg-slate-700"}`} />
        </div>

        <p className="text-[10px] text-slate-400 font-medium mb-4 leading-tight">
            {isHunting ? "Currently crawling external job clusters..." : "Deploy Maya to find jobs across the web."}
        </p>

        <button 
          onClick={toggleAutopilot}
          className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-3 relative z-10 ${
            isHunting 
              ? "bg-white text-slate-900 shadow-xl" 
              : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500 hover:bg-slate-700/50"
          }`}
        >
          {isHunting ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
          {isHunting ? "Stop Maya Hunt" : "Initialize Maya"}
        </button>
      </motion.div>
    </div>
  );
}