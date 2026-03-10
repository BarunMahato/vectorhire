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

  // 1. Get Recruiter requirements safely
  const recruiterPrefs = (session.user.preferences as any) || {};
  const hiringFor = recruiterPrefs.targetRole || "";
  const recruiterSkills = recruiterPrefs.skills?.toLowerCase().split(",").map((s: string) => s.trim()).filter(Boolean) || [];

  // 2. Fetch Students
  // Note: We fetch students with role "STUDENT" and a non-empty resumeUrl
  const matchingStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      NOT: { resumeUrl: "" },
      // Optional: If you want strict DB filtering, keep this. 
      // If you want a broader search, remove the preferences filter here and do it in JS.
      preferences: {
        path: ["targetRole"],
        string_contains: hiringFor,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      resumeUrl: true, // This MUST be selected to pass to the button
      preferences: true,
    },
    take: 20,
    orderBy: { id: 'desc' }
  });

  // 3. SCORING & DATA PREP
  const students = matchingStudents.map((student: any) => {
    const sPrefs = typeof student.preferences === 'string' 
      ? JSON.parse(student.preferences) 
      : student.preferences;
    
    const sSkills = sPrefs?.skills?.toLowerCase().split(",").map((s: string) => s.trim()).filter(Boolean) || [];
    const sRole = sPrefs?.targetRole?.toLowerCase() || "";
    
    // Skill matching calculation
    let matchScore = 30; // Base score for reaching this stage
    
    if (hiringFor && sRole.includes(hiringFor.toLowerCase())) {
        matchScore += 20;
    }

    if (recruiterSkills.length > 0) {
      const matches = sSkills.filter((s: string) => recruiterSkills.includes(s));
      matchScore += Math.round((matches.length / recruiterSkills.length) * 50);
    }

    return {
      ...student,
      resumeUrl: student.resumeUrl, // Explicitly ensuring this is passed
      matchScore: Math.min(matchScore, 100), // Cap at 100%
      parsedPrefs: sPrefs
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">AI Talent Discovery</h2>
          <p className="text-slate-500 font-medium mt-1">
            Matching for: <span className="text-blue-600 font-bold underline decoration-blue-200">{hiringFor || "All Roles"}</span>
          </p>
        </div>
      </div>

      {students.length > 0 ? (
        <CandidateList candidates={students} />
      ) : (
        <div className="p-20 border-2 border-dashed border-slate-200 rounded-[40px] bg-white text-center">
          <p className="text-slate-400 font-black italic text-lg uppercase tracking-tighter">No high-match candidates found</p>
          <p className="text-slate-300 text-sm mt-2 font-medium">Try broadening your role or skill requirements.</p>
        </div>
      )}
    </div>
  );
}