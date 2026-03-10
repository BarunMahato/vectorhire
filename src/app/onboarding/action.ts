"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export async function submitOnboarding(role: "STUDENT" | "RECRUITER", data: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Update both the role AND the resumeUrl explicitly
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: role,
      resumeUrl: data.resumeUrl || "", // Extract this from the payload
      preferences: data, 
    },
  });

  // DO NOT use redirect() inside the server action if you are calling it 
  // from a try/catch in the client. Return success instead.
  return { success: true, role };
}