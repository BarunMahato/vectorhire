"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Sparkles, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecruiterMatchList({ recruiters, studentId }: { recruiters: any[], studentId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreateDraft = async (recruiter: any) => {
    setLoadingId(recruiter.id);
    try {
      // THIS CALLS YOUR n8n WEBHOOK
      const response = await fetch("http://localhost:5678/webhook-test/create-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          recruiterEmail: recruiter.email,
          recruiterName: recruiter.name,
          role: (recruiter.preferences as any)?.targetRole
        }),
      });

      if (response.ok) {
        setDoneId(recruiter.id);
      }
    } catch (error) {
      console.error("Agent failed to create draft", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid gap-6">
      {recruiters.map((r, idx) => {
        const prefs = (r.preferences as any) || {};
        const isRevealed = revealedIds.includes(r.id);

        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-slate-200 p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all"
          >
            <div className="flex gap-5 items-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl italic border border-blue-100">
                {r.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">{r.name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">
                  Hiring for {prefs.targetRole || "Technical Role"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[240px]">
              {/* REVEAL EMAIL BUTTON */}
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-xs flex items-center gap-2 overflow-hidden truncate"
                  >
                    <Mail size={14} /> {r.email}
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => toggleReveal(r.id)}
                    className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                  >
                    <ShieldCheck size={14} /> Reveal Email
                  </button>
                )}
              </AnimatePresence>

              {/* DRAFT EMAIL BUTTON */}
              <button 
                onClick={() => handleCreateDraft(r)}
                disabled={loadingId === r.id || doneId === r.id}
                className={`w-full px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2 ${
                  doneId === r.id 
                    ? "bg-emerald-100 border-emerald-200 text-emerald-600" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {loadingId === r.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : doneId === r.id ? (
                  <CheckCircle size={14} />
                ) : (
                  <Sparkles size={14} className="text-blue-500" />
                )}
                {doneId === r.id ? "Draft Created" : "Create AI Draft"}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}