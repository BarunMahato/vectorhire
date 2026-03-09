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

  // 1. Get recruiter's target role from their onboarding preferences
  // Better Auth stores this in the user object as a JSON string or object
  const recruiterPrefs = typeof session.user.preferences === 'string' 
    ? JSON.parse(session.user.preferences) 
    : session.user.preferences;

  const hiringFor = recruiterPrefs?.targetRole || "";

  // 2. Fetch real students from the database
  const matchingStudents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      // Basic match: Look for students wanting the role the recruiter is hiring for
      preferences: {
        path: ["targetRole"],
        string_contains: hiringFor,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      preferences: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Talent Discovery</h2>
        <p className="text-slate-500 font-medium mt-1">
          Showing students matching your need for: <span className="text-emerald-600 font-bold">{hiringFor || "Any Role"}</span>
        </p>
      </div>

      {matchingStudents.length > 0 ? (
        <CandidateList candidates={matchingStudents} />
      ) : (
        <div className="p-20 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
          <p className="text-slate-400 font-medium">No candidates found matching "{hiringFor}" yet.</p>
        </div>
      )}
    </div>
  );
}