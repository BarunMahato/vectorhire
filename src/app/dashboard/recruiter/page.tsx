import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CandidateList from "./CandidateList";

export default async function RecruiterDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "RECRUITER") {
    redirect("/auth");
  }

  // 1. Fetch FRESH recruiter data from the new columns
  const recruiter = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      targetRole: true,
      preferences: true,
      companyName: true
    }
  });

  const hiringFor = recruiter?.targetRole || "";
  const recruiterPrefs = (recruiter?.preferences as any) || {};
  const recruiterSkills = recruiterPrefs.skills?.toLowerCase().split(",").map((s: string) => s.trim()).filter(Boolean) || [];

  // 2. Fetch Students using the new targetRole column
  const matchingStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      NOT: { resumeUrl: null }, // Changed to null check for Prisma safety
      targetRole: {
        contains: hiringFor,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      resumeUrl: true,
      targetRole: true, // New column
      preferences: true,
    },
    take: 20,
    orderBy: { createdAt: 'desc' }
  });

  // 3. SCORING & DATA PREP
  const students = matchingStudents.map((student: any) => {
    const sPrefs = (student.preferences as any) || {};
    const sSkills = sPrefs?.skills?.toLowerCase().split(",").map((s: string) => s.trim()).filter(Boolean) || [];
    const sRole = student.targetRole?.toLowerCase() || "";
    
    let matchScore = 40; // Base score for role match
    
    // Skill matching (weights 60% of total score)
    if (recruiterSkills.length > 0) {
      const matches = sSkills.filter((s: string) => recruiterSkills.includes(s));
      const skillBonus = Math.round((matches.length / recruiterSkills.length) * 60);
      matchScore += skillBonus;
    }

    return {
      ...student,
      matchScore: Math.min(matchScore, 100),
      parsedPrefs: sPrefs
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
            AI Talent Discovery
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded-full not-italic border border-emerald-100">
              Live Radar
            </span>
          </h2>
          <p className="text-slate-500 font-medium">
            Matching for <span className="text-emerald-600 font-bold underline decoration-emerald-200">{hiringFor || "General Roles"}</span> at {recruiter?.companyName || "your company"}
          </p>
        </div>
      </div>

      {students.length > 0 ? (
        <CandidateList candidates={students} />
      ) : (
        <div className="p-20 border-2 border-dashed border-slate-200 rounded-[40px] bg-white text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
             <span className="text-2xl">🔍</span>
          </div>
          <p className="text-slate-400 font-black italic text-lg uppercase tracking-tighter">No high-match candidates found</p>
          <p className="text-slate-300 text-sm mt-2 font-medium max-w-xs mx-auto">
            We couldn't find students matching <b>"{hiringFor}"</b>. Try updating your requirements in settings.
          </p>
        </div>
      )}
    </div>
  );
}