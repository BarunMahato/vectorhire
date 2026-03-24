"use client";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing"; 
import { 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  Loader2, 
  Building2, 
  Briefcase 
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitOnboarding } from "@/actions/onboarding";

// --- SUB-COMPONENT: SHARED UPLOADER ---
function FileUploadZone({ 
  label, 
  type, 
  onUploadComplete 
}: { 
  label: string; 
  type: "resume" | "jd"; 
  onUploadComplete: (url: string, name: string) => void 
}) {
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const { startUpload, isUploading } = useUploadThing("resumeUploader", {
    onClientUploadComplete: (res) => {
      onUploadComplete(res[0].url, fileName);
      setProgress(100);
    },
    onUploadProgress: (p) => setProgress(p),
    onUploadError: (e) => { alert("Upload failed: " + e.message); setProgress(0); },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    await startUpload([file]);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700 block">{label}</label>
      {!isUploading && progress !== 100 ? (
        <div className="relative border-2 border-dashed border-slate-200 rounded-[24px] p-8 flex flex-col items-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
          <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          <Upload className="text-slate-400 mb-2 group-hover:text-blue-600 transition-colors" size={24} />
          <p className="text-sm font-bold text-slate-600 text-center">Click to upload {type === "jd" ? "Job Description" : "Resume"}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">PDF Max 4MB</p>
        </div>
      ) : (
        <div className="p-4 bg-white border border-slate-200 rounded-[24px] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{fileName}</p>
                <p className="text-[10px] font-medium text-slate-400">{progress === 100 ? "Ready" : `Uploading ${progress}%`}</p>
              </div>
            </div>
            {progress === 100 ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Loader2 className="text-blue-600 animate-spin" size={18} />}
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function OnboardingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "RECRUITER" | null>(null);

  if (isPending) return <div className="p-20 text-center font-bold">VectorHire is loading...</div>;
  if (!session) { router.push("/auth"); return null; }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {!role ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h1 className="text-3xl font-black mb-2 text-slate-900">Welcome, {session.user.name?.split(" ")[0]}</h1>
            <p className="text-slate-500 mb-8 font-medium">Select your account type to begin.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RoleButton onClick={() => setRole("STUDENT")} emoji="🎓" title="Student" desc="Find jobs & automate apps." hoverColor="hover:border-blue-600" />
              <RoleButton onClick={() => setRole("RECRUITER")} emoji="💼" title="Recruiter" desc="Find & manage talent." hoverColor="hover:border-emerald-600" />
            </div>
          </motion.div>
        ) : (
          <OnboardingForm role={role} />
        )}
      </div>
    </main>
  );
}

// --- FORM LOGIC ---
function OnboardingForm({ role }: { role: "STUDENT" | "RECRUITER" }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  
  const [formData, setFormData] = useState({
    companyName: "", 
    targetRole: "",  
    experience: "Entry", 
    skills: "",
    workMode: "Remote",
    location: "Bengaluru",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) {
      alert(`Please upload your ${role === "STUDENT" ? "resume" : "job description"}!`);
      return;
    }
    
    setLoading(true);
    try {
      // fileUrl is mapped to either resumeUrl or jdUrl in the server action
      const result = await submitOnboarding(role, { ...formData, fileUrl });
      if (result.success) {
        window.location.href = role === "STUDENT" ? "/dashboard/student" : "/dashboard/recruiter";
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const accentColor = role === "RECRUITER" ? "emerald" : "blue";

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden">
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-black text-xl text-slate-900">
          {role === "STUDENT" ? (step === 1 ? "Career Goals" : "Work Preferences") : (step === 1 ? "Company Details" : "Hiring Needs")}
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {step}/2</span>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              
              {role === "RECRUITER" && (
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input
                      required
                      placeholder="e.g. VectorHire Inc."
                      className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-600 focus:bg-white outline-none transition-all"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">
                  {role === "STUDENT" ? "Target Role" : "Job Title"}
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input
                    required
                    placeholder={role === "STUDENT" ? "e.g. Software Engineer" : "e.g. Senior Frontend Dev"}
                    className={`w-full p-4 pl-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-${accentColor}-600 focus:bg-white outline-none transition-all`}
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  />
                </div>
              </div>

              <FileUploadZone 
                label={role === "STUDENT" ? "Resume (PDF)" : "Job Description (PDF)"}
                type={role === "STUDENT" ? "resume" : "jd"}
                onUploadComplete={(url) => setFileUrl(url)} 
              />

              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className={`w-full ${role === 'RECRUITER' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-blue-600'} text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-colors`}
              >
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700 block mb-2">Required Skills</label>
                <input
                  placeholder="React, TypeScript, Vector DBs..."
                  className={`w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-${accentColor}-600 outline-none transition-all`}
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
                      className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${formData.workMode === m ? `border-${accentColor}-600 bg-${accentColor}-50 text-${accentColor}-600` : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="font-bold text-slate-400 px-4 hover:text-slate-900 transition-colors">Back</button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`flex-1 ${role === 'RECRUITER' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'} text-white p-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-300 transition-all`}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Complete Setup <Sparkles size={18} /></>}
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
    <button onClick={onClick} className={`p-6 border-2 border-slate-100 rounded-[32px] ${hoverColor} transition-all text-left group`}>
      <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform">{emoji}</span>
      <p className="font-black text-slate-900">{title}</p>
      <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </button>
  );
}