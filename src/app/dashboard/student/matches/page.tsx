import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RecruiterMatchList from "../RecruiterMatchList"; 
import { Zap } from "lucide-react";

export default async function MatchesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth");
  }

  // 1. Fetch FRESH data from DB to ensure we have the new targetRole column
  const fullUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { targetRole: true }
  });

  const myRole = fullUser?.targetRole || "";

  // 2. Updated Query: Using the new top-level columns instead of JSON path
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
      companyName: true, // Required for your new RecruiterMatchList UI
      jdUrl: true,       // Required for n8n RAG draft generation
      targetRole: true,
    },
    take: 15,
  });

  return (
    <main className="space-y-10">
      <section className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 block">
            Internal Network
          </span>
          <h1 className="text-4xl font-black tracking-tighter italic mb-2">Direct Matches</h1>
          <p className="text-slate-400 font-medium max-w-md">
            Maya found <span className="text-white font-bold">{matches.length} recruiters</span> currently hiring for <span className="text-blue-400 italic">"{myRole || "Roles"}"</span>.
          </p>
        </div>
        <Zap className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64" />
      </section>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Top Recommendations</h2>
        </div>

        {matches.length > 0 ? (
          <RecruiterMatchList 
            recruiters={matches as any[]} 
            studentId={session.user.id} 
            myRole={myRole} // Added missing prop to fix red line
          />
        ) : (
          <div className="p-20 border-2 border-dashed border-slate-200 rounded-[40px] text-center bg-white">
            <p className="text-slate-400 font-bold italic">No direct matches found. Try adjusting your role in Profile.</p>
          </div>
        )}
      </div>
    </main>
  );
}