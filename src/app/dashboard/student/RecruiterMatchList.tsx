"use client";

import type { SessionUserWithProfile } from "@/lib/preferences";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export interface Recruiter {
  id: string;
  name: string | null;
  email: string;
  companyName?: string | null;
  jdUrl?: string | null;
  targetRole?: string | null;
}

const draftWebhookUrl =
  process.env.NEXT_PUBLIC_N8N_CREATE_DRAFT_URL || "http://localhost:5678/webhook-test/create-draft";

export default function RecruiterMatchList({
  recruiters,
  studentId,
  myRole,
}: {
  recruiters: Recruiter[];
  studentId: string;
  myRole: string;
}) {
  const { data: session } = useSession();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);

  const triggerAgentDraft = async (recruiter: Recruiter) => {
    const user = session?.user as SessionUserWithProfile | undefined;
    const resumeUrl = user?.resumeUrl;

    if (!resumeUrl) {
      alert("Please upload your resume in Profile settings before creating a draft!");
      return;
    }

    setLoadingId(recruiter.id);

    try {
      const response = await fetch(draftWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          resumeUrl,
          recruiterId: recruiter.id,
          jdUrl: recruiter.jdUrl,
          companyName: recruiter.companyName,
          targetRole: recruiter.targetRole || myRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Draft agent request failed");
      }

      setDoneId(recruiter.id);
    } catch (error) {
      console.error("Agent failed", error);
      alert("Maya could not create the draft. Please check that n8n is running.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid gap-4">
      {recruiters.map((recruiter) => (
        <div key={recruiter.id} className="group bg-white border-2 border-slate-100 p-5 md:p-6 rounded-[32px] flex flex-col gap-5 md:flex-row md:items-center md:justify-between hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg group-hover:bg-blue-600 transition-colors">
              {recruiter.companyName?.charAt(0) || recruiter.name?.charAt(0) || "R"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg">{recruiter.companyName || "Unknown Company"}</h3>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase tracking-tight">Verified</span>
              </div>
              <p className="text-sm font-bold text-slate-500">{recruiter.targetRole || myRole || "Open role"}</p>
              <p className="text-[11px] text-slate-400 font-medium italic">{recruiter.name || "Recruiter"} • {recruiter.email}</p>
            </div>
          </div>

          <button
            onClick={() => triggerAgentDraft(recruiter)}
            disabled={loadingId === recruiter.id || doneId === recruiter.id}
            className={`relative flex items-center justify-center gap-2 px-8 py-4 rounded-[20px] font-black text-sm transition-all ${
              doneId === recruiter.id ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-blue-600 active:scale-95"
            } disabled:cursor-not-allowed`}
          >
            {loadingId === recruiter.id ? <Loader2 className="animate-spin" size={16} /> : doneId === recruiter.id ? <CheckCircle size={16} /> : <Sparkles size={16} />}
            {doneId === recruiter.id ? "Draft Created" : "Create AI Draft"}
          </button>
        </div>
      ))}

      {recruiters.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
          <p className="font-bold text-slate-400">No matching recruiters found for {myRole || "your selected role"} yet.</p>
        </div>
      ) : null}
    </div>
  );
}
