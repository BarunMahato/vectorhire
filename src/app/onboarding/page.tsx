"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { submitOnboarding } from "./action";

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
    <main className="min-h-screen bg-white flex flex-col items-center p-6 pt-24">
      <div className="max-w-xl w-full">
        {!role ? (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}</h1>
            <p className="text-slate-500 mb-8">Tell us how you'll be using the platform.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setRole("STUDENT")}
                className="p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-600 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">🎓</span>
                <p className="font-bold">I'm a Student</p>
                <p className="text-xs text-slate-400">Find jobs & automate negotiation.</p>
              </button>
              
              <button 
                onClick={() => setRole("RECRUITER")}
                className="p-6 border-2 border-slate-100 rounded-2xl hover:border-green-600 transition-all text-left"
              >
                <span className="text-2xl mb-2 block">💼</span>
                <p className="font-bold">I'm a Recruiter</p>
                <p className="text-xs text-slate-400">Find talent & manage candidates.</p>
              </button>
            </div>
          </div>
        ) : (
          <OnboardingForm role={role} />
        )}
      </div>
    </main>
  );
}

function OnboardingForm({ role }: { role: "STUDENT" | "RECRUITER" }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    targetRole: "",      
    experience: "Entry", 
    skills: "",
    salary: "",
    location: "Remote",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitOnboarding(role, formData);
    } catch (error) {
      console.error("Submission failed", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">
            Desired Role
          </label>
          <input
            placeholder="e.g. Software Engineer, Data Analyst"
            required
            className="w-full p-3 rounded-xl border border-slate-200"
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
          />
        </div>

      
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">Experience Level</label>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200"
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          >
            <option value="Internship">Internship</option>
            <option value="Entry">Entry Level (0-2 years)</option>
            <option value="Junior">Junior (2-4 years)</option>
            <option value="Mid">Mid Level</option>
          </select>
        </div>

      
      </div>

      <button type="submit" disabled={loading} className="...">
        {loading ? "Saving..." : "Complete Setup"}
      </button>
    </form>
  );
}