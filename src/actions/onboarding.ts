"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type OnboardingRole = "STUDENT" | "RECRUITER";

export type OnboardingData = {
  companyName?: string;
  targetRole?: string;
  experience?: string;
  skills?: string;
  workMode?: string;
  location?: string;
  fileUrl?: string;
};

export async function submitOnboarding(role: OnboardingRole, data: OnboardingData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const updateData = {
    role,
    targetRole: data.targetRole?.trim() || "",
    ...(role === "STUDENT"
      ? { resumeUrl: data.fileUrl || "" }
      : {
          jdUrl: data.fileUrl || "",
          companyName: data.companyName?.trim() || "",
        }),
    preferences: {
      skills: data.skills?.trim() || "",
      workMode: data.workMode || "Remote",
      location: data.location?.trim() || "Bengaluru",
      experience: data.experience || "Entry",
    },
  };

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  return { success: true, role };
}
