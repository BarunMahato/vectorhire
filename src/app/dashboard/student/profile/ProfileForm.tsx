"use client";

import { updateStudentProfile } from "@/actions/profile";
import { parsePreferences } from "@/lib/preferences";
import { CheckCircle2, FileText, Globe, Laptop, Loader2, MapPin, Save } from "lucide-react";
import { useState } from "react";

type ProfileInitialData = {
  name: string | null;
  email: string;
  resumeUrl: string | null;
  targetRole: string | null;
  preferences: unknown;
};

export default function ProfileForm({ initialData }: { initialData: ProfileInitialData }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const prefs = parsePreferences(initialData.preferences);

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    targetRole: initialData.targetRole || prefs.targetRole || "",
    skills: prefs.skills || "",
    location: prefs.location || "Bengaluru",
    workMode: prefs.workMode || "Remote",
  });

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await updateStudentProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("PROFILE_UPDATE_ERROR:", error);
      alert("Could not update your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Globe size={18} className="text-blue-600" /> Basic Information
          </h3>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <input
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Career Role</label>
            <input
              value={formData.targetRole}
              onChange={(event) => setFormData({ ...formData, targetRole: event.target.value })}
              placeholder="e.g. Frontend Developer"
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-slate-200">
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <FileText size={18} className="text-blue-400" /> Current Resume
            </h3>
            <p className="text-xs text-slate-400">Maya uses this file to extract your project experience.</p>
          </div>

          {initialData.resumeUrl ? (
            <a
              href={initialData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl font-bold text-sm transition-all"
            >
              <FileText size={16} /> View Uploaded PDF
            </a>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-center text-xs font-bold text-slate-400">
              No resume uploaded yet
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Laptop size={18} className="text-blue-600" /> Career Preferences
        </h3>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Skills (Comma separated)</label>
          <textarea
            value={formData.skills}
            onChange={(event) => setFormData({ ...formData, skills: event.target.value })}
            rows={3}
            placeholder="React, TypeScript, Prisma, PostgreSQL"
            className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={12} /> Location
            </label>
            <input
              value={formData.location}
              onChange={(event) => setFormData({ ...formData, location: event.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-600 outline-none font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Mode</label>
            <select
              value={formData.workMode}
              onChange={(event) => setFormData({ ...formData, workMode: event.target.value })}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-600 outline-none font-bold"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading ? <><Loader2 size={18} className="animate-spin" /> Syncing...</> : saved ? <><CheckCircle2 size={18} /> Profile Updated</> : <><Save size={18} /> Save Changes</>}
      </button>
    </form>
  );
}
