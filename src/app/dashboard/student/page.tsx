import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecruiterMatchList from "./RecruiterMatchList";

export default async function StudentDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "STUDENT") redirect("/auth");

  const studentPrefs = (session.user.preferences as any) || {};
  const myRole = studentPrefs.targetRole || "";

  // 1. Fetch recruiters hiring for MY role
  const matches = await prisma.user.findMany({
    where: {
      role: "RECRUITER",
      preferences: {
        path: ["targetRole"],
        string_contains: myRole,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      preferences: true,
    },
    take: 10,
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Your AI Matchmaker</h1>
        <p className="text-slate-500 font-medium">Vector found these recruiters hiring for <span className="text-blue-600 font-bold">{myRole}</span></p>
      </div>

      <RecruiterMatchList recruiters={matches} studentId={session.user.id} />
    </div>
  );
}