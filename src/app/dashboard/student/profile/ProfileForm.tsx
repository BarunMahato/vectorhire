"use client";

import { useState } from "react";
import { FileText, Save, CheckCircle2, Globe, Laptop, MapPin } from "lucide-react";

export default function ProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Initialize preferences
  const prefs = typeof initialData.preferences === 'string' 
    ? JSON.parse(initialData.preferences) 
    : initialData.preferences || {};

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    targetRole: prefs.targetRole || "",
    skills: prefs.skills || "",
    location: prefs.location || "Bengaluru",
    workMode: prefs.workMode || "Remote",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Call a server action to update the profile (You can reuse submitOnboarding or make a new one)
    // For now, we'll simulate the save
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Globe size={18} className="text-blue-600" /> Basic Information
          </h3>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Career Role</label>
            <input 
              value={formData.targetRole}
              onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
              className="w-full mt-1 p-3 bg-slate-50 rounded-xl border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        {/* Resume Preview Card */}
        <div className="bg-slate-900 p-8 rounded-[32px] text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-2">
                <FileText size={18} className="text-blue-400" /> Current Resume
            </h3>
            <p className="text-xs text-slate-400">Maya uses this file to extract your project experience.</p>
          </div>
          
          <a 
            href={initialData.resumeUrl} 
            target="_blank" 
            className="mt-6 flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl font-bold text-sm transition-all"
          >
            <FileText size={16} /> View Uploaded PDF
          </a>
        </div>
      </div>

      {/* Skills & Preferences */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
         <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Laptop size={18} className="text-blue-600" /> Career Preferences
          </h3>
          
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Skills (Comma separated)</label>
            <textarea 
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              rows={3}
              className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-700 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                <input 
                   value={formData.location}
                   onChange={(e) => setFormData({...formData, location: e.target.value})}
                   className="w-full mt-1 p-3 bg-slate-50 rounded-xl outline-none font-bold"
                />
             </div>
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Work Mode</label>
                <select 
                   value={formData.workMode}
                   onChange={(e) => setFormData({...formData, workMode: e.target.value})}
                   className="w-full mt-1 p-3 bg-slate-50 rounded-xl outline-none font-bold"
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
        className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
      >
        {loading ? "Syncing..." : saved ? <><CheckCircle2 size={18} /> Profile Updated</> : <><Save size={18} /> Save Changes</>}
      </button>
    </form>
  );
}