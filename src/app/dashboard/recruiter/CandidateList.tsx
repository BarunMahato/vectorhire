"use client";

import { parsePreferences, type Preferences } from "@/lib/preferences";
import { motion } from "framer-motion";
import { ExternalLink, FileText, Mail, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

type Candidate = {
  id: string;
  name: string | null;
  email: string;
  resumeUrl?: string | null;
  targetRole?: string | null;
  preferences?: unknown;
  parsedPrefs?: Preferences;
  matchScore?: number;
};

export default function CandidateList({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {candidates.map((candidate, index) => (
        <CandidateCard key={candidate.id} candidate={candidate} index={index} />
      ))}
    </div>
  );
}

function CandidateCard({ candidate, index }: { candidate: Candidate; index: number }) {
  const [revealed, setRevealed] = useState(false);
  const prefs = useMemo(
    () => candidate.parsedPrefs || parsePreferences(candidate.preferences),
    [candidate.parsedPrefs, candidate.preferences],
  );
  const skills = prefs.skills?.split(",").map((skill) => skill.trim()).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-white border border-slate-200 p-6 md:p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
    >
      <div className="flex gap-5 items-start sm:items-center">
        <div className="relative shrink-0">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl font-black text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
            {candidate.name?.charAt(0) || "C"}
          </div>
          {candidate.matchScore ? (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
              {candidate.matchScore}%
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-black text-xl text-slate-900 truncate">{candidate.name || "Unnamed candidate"}</h3>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
              {prefs.experience || "Entry"}
            </span>
          </div>
          <p className="text-slate-500 font-bold text-sm mb-3">{candidate.targetRole || "Student"}</p>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.slice(0, 6).map((skill) => (
                <span key={skill} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100">
                Skills not listed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-full md:min-w-[240px]">
        {revealed ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 font-bold text-sm break-all"
          >
            <Mail size={16} />
            {candidate.email}
          </motion.div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <ShieldCheck size={16} />
            Reveal Contact
          </button>
        )}

        {candidate.resumeUrl ? (
          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-slate-100 p-4 rounded-2xl font-black text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-sm"
          >
            <FileText size={18} className="text-blue-500" />
            View Full Resume
            <ExternalLink size={14} className="opacity-30" />
          </a>
        ) : (
          <div className="text-center p-4 text-xs font-bold text-slate-300 uppercase italic">
            No resume uploaded
          </div>
        )}
      </div>
    </motion.div>
  );
}
