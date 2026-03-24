import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecruiterMatchList from "./RecruiterMatchList";

export default async function StudentDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "STUDENT") redirect("/auth");

  // Cast user to any to access custom fields safely
  const user = session.user as any;
  const myRole = user.targetRole || "";

  // 1. Fetch recruiters matching the student's target role
  const matches = await prisma.user.findMany({
    where: {
      role: "RECRUITER",
      targetRole: {
        contains: myRole,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      jdUrl: true,
      targetRole: true,
    },
    take: 10,
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Your AI Matchmaker</h1>
        <p className="text-slate-500 font-medium">
          VectorHire found these recruiters hiring for <span className="text-blue-600 font-bold underline decoration-2 underline-offset-4">{myRole}</span>
        </p>
      </div>

      {/* Pass myRole here to fix the prop error */}
      <RecruiterMatchList 
        recruiters={matches as any[]} 
        studentId={session.user.id} 
        myRole={myRole} 
      />
    </div>
  );
}