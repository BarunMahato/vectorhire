import { auth } from "@/lib/auth";
import { parsePreferences } from "@/lib/preferences";
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

  const recruiter = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      targetRole: true,
      preferences: true,
      companyName: true,
    },
  });

  const hiringFor = recruiter?.targetRole || "";
  const recruiterPrefs = parsePreferences(recruiter?.preferences);
  const recruiterSkills = recruiterPrefs.skills?.toLowerCase().split(",").map((skill) => skill.trim()).filter(Boolean) || [];

  const matchingStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      NOT: { resumeUrl: null },
      targetRole: {
        contains: hiringFor,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      resumeUrl: true,
      targetRole: true,
      preferences: true,
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  const students = matchingStudents
    .map((student) => {
      const studentPrefs = parsePreferences(student.preferences);
      const studentSkills = studentPrefs.skills?.toLowerCase().split(",").map((skill) => skill.trim()).filter(Boolean) || [];

      let matchScore = 40;

      if (recruiterSkills.length > 0) {
        const matches = studentSkills.filter((skill) => recruiterSkills.includes(skill));
        const skillBonus = Math.round((matches.length / recruiterSkills.length) * 60);
        matchScore += skillBonus;
      }

      return {
        ...student,
        matchScore: Math.min(matchScore, 100),
        parsedPrefs: studentPrefs,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-2 md:p-6">
      <section className="rounded-[40px] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/60 to-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight italic flex flex-wrap items-center gap-3">
              AI Talent Discovery
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] rounded-full not-italic border border-emerald-200 uppercase tracking-widest">
                Live Radar
              </span>
            </h2>
            <p className="text-slate-500 font-medium">
              Matching for <span className="text-emerald-600 font-bold underline decoration-emerald-200">{hiringFor || "General Roles"}</span> at {recruiter?.companyName || "your company"}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 border border-emerald-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidates</p>
            <p className="text-3xl font-black text-slate-900">{students.length}</p>
          </div>
        </div>
      </section>

      {students.length > 0 ? (
        <CandidateList candidates={students} />
      ) : (
        <div className="p-12 md:p-20 border-2 border-dashed border-slate-200 rounded-[40px] bg-white text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-slate-400 font-black italic text-lg uppercase tracking-tighter">No high-match candidates found</p>
          <p className="text-slate-300 text-sm mt-2 font-medium max-w-xs mx-auto">
            We could not find students matching <b>{hiringFor || "this role"}</b>. Try updating your requirements in settings.
          </p>
        </div>
      )}
    </div>
  );
}
