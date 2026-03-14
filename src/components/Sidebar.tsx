"use client";

import { useState } from "react";
import {Loader2, Zap, Radio } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client"; // Using your project's auth client

export function SidebarAgentControl() {
  const [isHunting, setIsHunting] = useState(false);
  const { data: session, isPending } = useSession();

  const handleToggle = async () => {
    // 1. Session Check
    if (isPending) return; // Wait if session is still loading
    
    if (!session?.user) {
      toast.error("Please login to deploy Maya.");
      return;
    }

    // 2. Local State Toggle
    if (isHunting) {
      setIsHunting(false);
      toast("Maya Deactivated", { icon: '🛰️' });
      return;
    }

    // 3. Extract fresh data directly from session
    const studentId = session.user.id;
    const resumeUrl = (session.user as any).preferences?.resumeUrl;

    if (!resumeUrl) {
      toast.error("Resume not found. Upload it in Profile first.");
      return;
    }

    // 4. Update UI instantly
    setIsHunting(true);
    const loadingToast = toast.loading("Maya: Establishing Link...");

    try {
      // 5. Execute Fetch with the freshly pulled session data
      const response = await fetch("http://localhost:5678/webhook-test/external-hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentId, 
          resumeUrl, 
          source: "SIDEBAR_WIDGET",
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success("Maya: Global Hunt Active", { id: loadingToast });
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("MAYA_SIDEBAR_FATAL:", error);
      setIsHunting(false);
      toast.error("Maya: Connection Failed", { id: loadingToast });
    }
  };

  return (
    <div className="mt-auto px-4 pb-6">
      <div 
        className={`relative rounded-[28px] p-5 border transition-all duration-500 ${
            isHunting ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20" : "bg-slate-900 border-slate-800"
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio size={14} className={isHunting ? "text-white animate-pulse" : "text-slate-500"} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isHunting ? "text-white" : "text-slate-400"}`}>
                Maya Agent
              </span>
            </div>
            {isHunting && <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />}
          </div>

          <p className={`text-[10px] mb-4 font-bold leading-tight ${isHunting ? "text-blue-50" : "text-slate-500"}`}>
            {isHunting ? "Syncing search clusters..." : "Deploy Discovery Engine"}
          </p>

          <button 
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
              isHunting ? "bg-white text-blue-600" : "bg-blue-600 text-white"
            }`}
          >
            {isHunting ? (
              <><Loader2 size={14} className="animate-spin" /> Stop Agent</>
            ) : (
              <><Zap size={14} className="fill-current" /> Initialize</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}