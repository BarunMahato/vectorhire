"use client";

import { useState } from "react";
import { Sparkles, Mail, Loader2, CheckCircle } from "lucide-react";

export default function RecruiterMatchList({ recruiters, studentId }: { recruiters: any[], studentId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const triggerAgentDraft = async (recruiter: any) => {
    setLoadingId(recruiter.id);
    
    try {
      // THIS CALLS YOUR n8n WEBHOOK
      const response = await fetch("https://YOUR_N8N_URL/webhook/create-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId,
          recruiterEmail: recruiter.email,
          recruiterName: recruiter.name,
          role: recruiter.preferences?.targetRole
        }),
      });

      if (response.ok) {
        setDoneId(recruiter.id);
      }
    } catch (error) {
      console.error("Agent failed", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid gap-4">
      {recruiters.map((r) => (
        <div key={r.id} className="bg-white border-2 border-slate-100 p-6 rounded-[32px] flex items-center justify-between hover:border-blue-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold">
              {r.name?.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-slate-900">{r.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hiring for {r.preferences?.targetRole}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
               onClick={() => triggerAgentDraft(r)}
               disabled={loadingId === r.id || doneId === r.id}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                 doneId === r.id ? "bg-emerald-100 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"
               }`}
            >
              {loadingId === r.id ? <Loader2 className="animate-spin" size={16} /> : doneId === r.id ? <CheckCircle size={16} /> : <Sparkles size={16} />}
              {doneId === r.id ? "Draft Created" : "Create AI Draft"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}