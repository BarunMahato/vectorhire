import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-agent-key");
    if (authHeader !== process.env.AGENT_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId, jobs } = await req.json();

    if (!studentId || !Array.isArray(jobs)) {
      return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }

    // High-Efficiency Bulk Insert
    // This sends ONE single command to the DB instead of 10.
    const result = await prisma.externalJob.createMany({
      data: jobs.map((job: any) => ({
        studentId,
        title: job.title,
        company: job.company,
        url: job.url,
        location: job.location || "India",
        platform: job.platform || "LinkedIn",
        status: "FOUND",
      })),
      skipDuplicates: true, // This is the "Upsert" behavior—it won't crash on existing URLs
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      message: `Maya synced ${result.count} new jobs.` 
    });

  } catch (error: any) {
    console.error("MAYA_SYNC_CRITICAL_ERROR:", error);
    return NextResponse.json({ error: "Sync Failed", details: error.message }, { status: 500 });
  }
}