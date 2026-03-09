"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, Star, Mail, ExternalLink, ShieldCheck } from "lucide-react";

export default function RecruiterDashboard() {
  // Sample data: In reality, you'd fetch this from Prisma where Role = 'STUDENT'
  const [candidates] = useState([
    { id: 1, name: "Aryan S.", role: "Full Stack Developer", match: 98, skills: ["Next.js", "Prisma", "TypeScript"], email: "aryan.s@example.com" },
    { id: 2, name: "Neha K.", role: "Backend Engineer", match: 92, skills: ["Java", "Spring Boot", "PostgreSQL"], email: "neha.k@example.com" },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Talent Discovery</h2>
          <p className="text-slate-500 font-medium mt-1">Showing top students matching your hiring preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </motion.div>
  );
}

function CandidateCard({ candidate }: any) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-400 border border-slate-200">
          {candidate.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-xl text-slate-900">{candidate.name}</h3>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Verified</span>
          </div>
          <p className="text-slate-500 font-bold text-sm mb-3">{candidate.role}</p>
          <div className="flex gap-2">
            {candidate.skills.map((s: string) => (
              <span key={s} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Match</p>
          <div className="text-2xl font-black text-emerald-600">{candidate.match}%</div>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          {revealed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 font-bold text-sm">
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
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}