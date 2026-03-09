import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");

  const user = session.user as any;

  if (user.role === "STUDENT") redirect("/dashboard/student");
  if (user.role === "RECRUITER") redirect("/dashboard/recruiter");

  return <div className="min-h-screen bg-white">{children}</div>;
}