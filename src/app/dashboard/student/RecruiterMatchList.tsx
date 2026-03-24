"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";

interface Recruiter {
  id: string;
  name: string;
  email: string;
  companyName?: string;
  jdUrl?: string;
  targetRole?: string;
}

export default function RecruiterMatchList({ 
  recruiters, 
  studentId, 
  myRole 
}: { 
  recruiters: Recruiter[], 
  studentId: string,
  myRole: string 
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const triggerAgentDraft = async (recruiter: Recruiter) => {
    setLoadingId(recruiter.id);
    
    try {
      const response = await fetch("http://localhost:5678/webhook-test/create-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          recruiterId: recruiter.id,
          jdUrl: recruiter.jdUrl,
          companyName: recruiter.companyName,
          targetRole: recruiter.targetRole,
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
        <div key={r.id} className="group bg-white border-2 border-slate-100 p-6 rounded-[32px] flex items-center justify-between hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
              {r.companyName?.charAt(0) || r.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg">{r.companyName || "Unknown Company"}</h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-tight">Verified</span>
              </div>
              <p className="text-sm font-bold text-slate-500">{r.targetRole}</p>
              <p className="text-[11px] text-slate-400 font-medium italic">{r.name} • {r.email}</p>
            </div>
          </div>

          <button 
             onClick={() => triggerAgentDraft(r)}
             disabled={loadingId === r.id || doneId === r.id}
             className={`relative flex items-center gap-2 px-8 py-4 rounded-[20px] font-black text-sm transition-all ${
               doneId === r.id ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-blue-600"
             }`}
          >
            {loadingId === r.id ? <Loader2 className="animate-spin" size={16} /> : doneId === r.id ? <CheckCircle size={16} /> : <Sparkles size={16} />}
            {doneId === r.id ? "Draft Created" : "Create AI Draft"}
          </button>
        </div>
      ))}
      
      {recruiters.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="font-bold text-slate-400">No matching recruiters found for "{myRole}" yet.</p>
        </div>
      )}
    </div>
  );
}