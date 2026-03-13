import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-agent-key");
    if (authHeader !== process.env.AGENT_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, title, company, platform, url, aiDraft } = body;

    const job = await prisma.externalJob.create({
      data: {
        studentId,
        title,
        company,
        platform,
        url,
        aiDraft: aiDraft || "",
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error) {
    return NextResponse.json({ error: "Storage Failed" }, { status: 500 });
  }
}