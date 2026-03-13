import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const authHeader = req.headers.get("x-agent-key");

  // 1. Verify the "Secret Handshake"
  if (authHeader !== process.env.AGENT_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!studentId) {
    return NextResponse.json({ error: "No Student ID provided" }, { status: 400 });
  }

  // 2. Fetch the data Maya needs to write a good email
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      name: true,
      email: true,
      resumeUrl: true,
      preferences: true, // This contains their skills and goals
    }
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}