"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";

export default function CandidateList({ candidates }: { candidates: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {candidates.map((candidate, index) => (
        <CandidateCard key={candidate.id} candidate={candidate} index={index} />
      ))}
    </div>
  );
}

function CandidateCard({ candidate, index }: { candidate: any; index: number }) {
  const [revealed, setRevealed] = useState(false);
  
  // Parse student preferences safely
  const prefs = typeof candidate.preferences === 'string' 
    ? JSON.parse(candidate.preferences) 
    : candidate.preferences;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-600 border border-emerald-100">
          {candidate.name?.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-xl text-slate-900">{candidate.name}</h3>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
              {prefs?.experience || "Entry"}
            </span>
          </div>
          <p className="text-slate-500 font-bold text-sm mb-3">{prefs?.targetRole || "Student"}</p>
          <div className="flex flex-wrap gap-2">
            {prefs?.skills?.split(',').map((skill: string) => (
              <span key={skill} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 min-w-[220px]">
        {revealed ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 font-bold text-sm break-all"
          >
            <Mail size={16} />
            {candidate.email}
          </motion.div>
        ) : (
          <button 
            onClick={() => setRevealed(true)}
            className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            Reveal Email
          </button>
        )}
        <button className="w-full bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
          View Full Resume
        </button>
      </div>
    </motion.div>
  );
}