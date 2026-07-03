"use server";

import { auth } from "@/lib/auth";
import { parsePreferences } from "@/lib/preferences";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type ProfileUpdateData = {
  name: string;
  targetRole: string;
  skills: string;
  location: string;
  workMode: string;
};

export async function updateStudentProfile(data: ProfileUpdateData) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "STUDENT") {
    throw new Error("Unauthorized");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferences: true },
  });

  const existingPreferences = parsePreferences(currentUser?.preferences);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name.trim(),
      targetRole: data.targetRole.trim(),
      preferences: {
        ...existingPreferences,
        skills: data.skills.trim(),
        location: data.location.trim(),
        workMode: data.workMode,
      },
    },
  });

  return { success: true };
}
