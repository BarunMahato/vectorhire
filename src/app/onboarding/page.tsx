"use client";
import { useUploadThing } from "@/lib/uploadthing"; 
import {Upload, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sparkles, ChevronRight, FileText, CheckCircle, Loader2 } from "lucide-react";
import { submitOnboarding } from "./action";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function ResumeUploadSection({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const { startUpload, isUploading } = useUploadThing("resumeUploader", {
    onClientUploadComplete: (res) => {
      onUploadComplete(res[0].url);
      setProgress(100);
    },
    onUploadProgress: (p) => {
      setProgress(p);
      if (startTime) setElapsed(Math.round((Date.now() - startTime) / 1000));
    },
    onUploadError: (e) => {
      alert("Upload failed: " + e.message);
      setProgress(0);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStartTime(Date.now()); // Start timer
    await startUpload([file]);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700 block">Resume (PDF)</label>
      
      {!isUploading && progress !== 100 ? (
        <div className="relative border-2 border-dashed border-slate-200 rounded-[24px] p-10 flex flex-col items-center hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer group">
          <input 
            type="file" 
            accept=".pdf" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange}
          />
          <Upload className="text-slate-400 mb-2 group-hover:text-blue-600 transition-colors" size={24} />
          <p className="text-sm font-bold text-slate-600">Click to upload your resume</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">PDF Max 4MB</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
          Time Elapsed: {elapsed}s
        </p>
        </div>
      ) : (
        <div className="p-6 bg-white border border-slate-200 rounded-[24px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{fileName}</p>
                <p className="text-[10px] font-medium text-slate-400">
                  {progress === 100 ? "Upload Complete" : `Uploading... ${progress}%`}
                </p>
              </div>
            </div>
            {progress === 100 ? (
              <CheckCircle2 className="text-emerald-500" size={20} />
            ) : (
              <Loader2 className="text-blue-600 animate-spin" size={20} />
            )}
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "RECRUITER" | null>(null);

  if (isPending) return <div className="p-20 text-center font-bold">VectorHire is loading...</div>;

  if (!session) {
    router.push("/auth");
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {!role ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50"
          >
            <h1 className="text-3xl font-black mb-2 text-slate-900">Welcome, {session.user.name?.split(" ")[0]}</h1>
            <p className="text-slate-500 mb-8 font-medium">Select your account type to begin.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RoleButton 
                onClick={() => setRole("STUDENT")}
                emoji="🎓"
                title="Student"
                desc="Find jobs & automate apps."
                hoverColor="hover:border-blue-600"
              />
              <RoleButton 
                onClick={() => setRole("RECRUITER")}
                emoji="💼"
                title="Recruiter"
                desc="Find & manage talent."
                hoverColor="hover:border-emerald-600"
              />
            </div>
          </motion.div>
        ) : (
          <OnboardingForm role={role} />
        )}
      </div>
    </main>
  );
}

function OnboardingForm({ role }: { role: "STUDENT" | "RECRUITER" }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  
  const [formData, setFormData] = useState({
    targetRole: "",      
    experience: "Entry", 
    skills: "",
    workMode: "Remote",
    location: "Bengaluru",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "STUDENT" && !resumeUrl) {
      alert("Please upload your resume first!");
      return;
    }
    
    setLoading(true);
    try {
      const result = await submitOnboarding(role, { ...formData, resumeUrl });
      
      if (result.success) {
        // Use window.location.href for a hard refresh to update the session
        window.location.href = role === "STUDENT" ? "/dashboard/student" : "/dashboard/recruiter";
      }
    } catch (error) {
      console.error("Submission failed", error);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden"
    >
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-black text-xl text-slate-900">
          {step === 1 ? "Career Goals" : "Work Preferences"}
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step}/2</span>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Target Role</label>
                <input
                  required
                  placeholder="e.g. Software Engineer"
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Experience Level</label>
                <select 
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none transition-all"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="Internship">Internship</option>
                  <option value="Entry">Entry Level (0-2 years)</option>
                  <option value="Junior">Junior (2-4 years)</option>
                  <option value="Mid">Mid Level</option>
                </select>
              </div>

              {/* MODERN UPLOADTHING INTEGRATION (SDK v7+) */}
              {role === "STUDENT" && (
                <ResumeUploadSection onUploadComplete={(url) => setResumeUrl(url)} />
              )}
              

              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
              >
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Key Skills</label>
                <input
                  placeholder="React, Node.js, SQL..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 outline-none"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Work Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Remote", "Hybrid", "Onsite"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, workMode: m })}
                      className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${formData.workMode === m ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="font-bold text-slate-400 px-4 hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-slate-300 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Complete Setup
                      <Sparkles size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}

function RoleButton({ onClick, emoji, title, desc, hoverColor }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 border-2 border-slate-100 rounded-[32px] ${hoverColor} transition-all text-left group`}
    >
      <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform">{emoji}</span>
      <p className="font-black text-slate-900">{title}</p>
      <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </button>
  );
}