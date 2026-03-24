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

  const updateData: any = {
    role: role,
    targetRole: data.targetRole || "",
   
    ...(role === "STUDENT" 
      ? { resumeUrl: data.fileUrl || "" } 
      : { jdUrl: data.fileUrl || "", companyName: data.companyName || "" }
    ),
  
    preferences: {
      skills: data.skills || "",
      workMode: data.workMode || "Remote",
      location: data.location || "Bengaluru",
      experience: data.experience || "Entry",
    },
  };

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  return { success: true, role };
}