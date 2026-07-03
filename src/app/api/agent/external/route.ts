import { getErrorMessage } from "@/lib/preferences";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ExternalJobPayload = {
  title?: string;
  company?: string;
  url?: string;
  location?: string;
  platform?: string;
};

type SyncPayload = {
  studentId?: string;
  jobs?: ExternalJobPayload[];
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-agent-key");
    if (authHeader !== process.env.AGENT_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, jobs } = (await req.json()) as SyncPayload;

    if (!studentId || !Array.isArray(jobs)) {
      return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }

    const validJobs = jobs.filter((job) => job.title && job.company && job.url);

    if (validJobs.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No valid jobs to sync." });
    }

    const result = await prisma.externalJob.createMany({
      data: validJobs.map((job) => ({
        studentId,
        title: job.title || "Untitled role",
        company: job.company || "Unknown company",
        url: job.url || "#",
        location: job.location || "India",
        platform: job.platform || "LinkedIn",
        status: "FOUND",
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Maya synced ${result.count} new jobs.`,
    });
  } catch (error) {
    console.error("MAYA_SYNC_CRITICAL_ERROR:", error);
    return NextResponse.json(
      { error: "Sync Failed", details: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
