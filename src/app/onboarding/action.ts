"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function submitOnboarding(role: "STUDENT" | "RECRUITER", data: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: role,
      preferences: data, 
    },
  });


  redirect(role === "STUDENT" ? "/dashboard/student" : "/dashboard/recruiter");
}