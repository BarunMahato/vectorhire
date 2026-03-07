import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role === "STUDENT") redirect("/dashboard/student");
  if (session?.user.role === "RECRUITER") redirect("/dashboard/recruiter");

  return <>{children}</>;
}