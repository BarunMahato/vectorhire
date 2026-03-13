import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation"; // Added missing import
import ProfileForm from "./ProfileForm"; // Added correct path

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Check session and role
  if (!session || session.user.role !== "STUDENT") {
    redirect("/auth");
  }

  // 2. Fetch fresh data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      resumeUrl: true,
      preferences: true,
    },
  });

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">
          My Professional Identity
        </h2>
        <p className="text-slate-500 font-medium">
          This data powers Maya's search and your recruiter matches.
        </p>
      </header>

      {/* Pass user data. Note: ProfileForm needs to handle 
        the JSON parsing of initialData.preferences 
      */}
      <ProfileForm initialData={user} />
    </div>
  );
}