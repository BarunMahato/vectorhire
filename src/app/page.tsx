"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Database,
  FileText,
  Mail,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

const sampleJD = `We are looking for a Senior Next.js Developer experienced with App Router, Server Actions, TypeScript, and high-performance backend pipelines. Experience with AI orchestration, n8n, Vector DBs, Prisma, and PostgreSQL is a strong plus.`;

const stats = [
  { label: "Autonomous agents", value: "3+" },
  { label: "Workflow engine", value: "n8n" },
  { label: "AI layer", value: "Gemini" },
  { label: "Backend", value: "Prisma" },
];

const features = [
  {
    icon: Search,
    title: "Autonomous Job Discovery",
    description:
      "Maya scans job sources, extracts role context, and indexes high-fit opportunities without manual searching.",
  },
  {
    icon: FileText,
    title: "Resume Intelligence",
    description:
      "Candidate resumes are converted into structured context that agents can use for matching and personalization.",
  },
  {
    icon: Mail,
    title: "Personalized Drafting",
    description:
      "VectorHire generates tailored outreach and application drafts based on the user profile and job description.",
  },
  {
    icon: Database,
    title: "Persistent Job Memory",
    description:
      "Discovered jobs sync into the database so users can view, query, and act on opportunities from the dashboard.",
  },
];

const pipelineSteps = [
  {
    title: "Upload Resume",
    description: "User profile and resume context are captured securely.",
    icon: Upload,
  },
  {
    title: "Trigger n8n Agent",
    description: "Next.js sends the task to the autonomous workflow engine.",
    icon: Network,
  },
  {
    title: "Discover Matches",
    description: "The agent searches, filters, and ranks external jobs.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Draft Applications",
    description: "AI creates personalized drafts for best-fit roles.",
    icon: Sparkles,
  },
];

export default function Home() {
  const [jd, setJd] = useState("");
  const [fileName, setFileName] = useState("");
  const [screeningState, setScreeningState] = useState<
    "idle" | "processing" | "scored"
  >("idle");

  const handleRunScreener = () => {
    if (!jd || !fileName) {
      alert("Please drop a candidate resume and Job Description first!");
      return;
    }

    setScreeningState("processing");
    setTimeout(() => setScreeningState("scored"), 3200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute right-0 top-96 h-[380px] w-[380px] rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute left-0 top-[720px] h-[340px] w-[340px] rounded-full bg-slate-100 blur-3xl" />
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-28 md:pt-36">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                VectorHire v2.0 • Autonomous n8n Job Search Engine
              </div>

              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
                Stop searching for jobs.
                <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                  Let AI hunt them.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                VectorHire is an autonomous AI job search platform powered by
                n8n agents. It understands your resume, discovers best-fit
                opportunities, syncs them into your dashboard, and drafts
                personalized applications.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Start global hunt
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Open dashboard
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-2xl font-black text-slate-950">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right product card */}
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur">
              <div className="rounded-[1.5rem] border border-slate-100 bg-slate-950 p-5 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-blue-300">
                      AGENT MAYA
                    </p>
                    <h2 className="mt-1 text-xl font-bold">
                      Global Hunt Console
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-slate-400">Workflow</span>
                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300">
                        Active
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-300">
                        [01] Resume context extracted
                      </p>
                      <p className="text-blue-300">
                        [02] n8n webhook triggered
                      </p>
                      <p className="text-emerald-300">
                        [03] External jobs indexed
                      </p>
                      <p className="text-amber-300">
                        [04] Drafting personalized outreach
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-slate-400">Match score</p>
                      <p className="mt-2 text-3xl font-black text-emerald-300">
                        94%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-slate-400">Jobs found</p>
                      <p className="mt-2 text-3xl font-black text-blue-300">
                        128
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                    <p className="mb-1 text-blue-200">Recommended action</p>
                    <p className="text-slate-300">
                      Apply to 12 high-signal roles with personalized drafts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive screener */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
              Live product simulation
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Test the AI screening pipeline
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Paste a job description and drop a resume payload to visualize how
              VectorHire scores candidate-role alignment.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-5 shadow-xl shadow-slate-200/60 md:p-8">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between font-mono">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Target Job Schema
                  </label>
                  <button
                    onClick={() => setJd(sampleJD)}
                    className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    [Paste Sample JD]
                  </button>
                </div>

                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the raw job description here..."
                  className="h-52 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 font-mono text-xs leading-relaxed text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Candidate Resume Payload
                </label>

                <button
                  type="button"
                  onClick={() => setFileName("Barun_Mahato_Nextjs_Resume.pdf")}
                  className={`h-52 w-full rounded-2xl border-2 border-dashed bg-white p-6 text-center shadow-sm transition ${
                    fileName
                      ? "border-blue-500 bg-blue-50/40"
                      : "border-slate-200 hover:border-blue-400"
                  }`}
                >
                  {fileName ? (
                    <div>
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-mono text-sm font-black text-white shadow-lg shadow-blue-600/20">
                        PDF
                      </div>
                      <p className="font-mono text-sm font-bold text-slate-900">
                        {fileName}
                      </p>
                      <p className="mt-1 font-mono text-xs font-medium text-blue-600">
                        Payload ready for vector store
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="mb-1 text-sm font-bold text-slate-800">
                        Click to drop candidate PDF
                      </p>
                      <p className="font-mono text-xs text-slate-400">
                        Accepts standard unstructured resume export
                      </p>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {screeningState === "idle" && (
                <button
                  onClick={handleRunScreener}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] md:w-auto"
                >
                  <Zap className="h-4 w-4" />
                  Execute Autonomous Screener Pipeline
                </button>
              )}

              {screeningState === "processing" && (
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-2xl">
                  <div className="mb-3 flex items-center gap-2 border-b border-slate-800 pb-3 text-blue-300">
                    <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
                    <span className="font-bold">
                      n8n LOCAL ORCHESTRATOR ACTIVE
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-400">
                      [0.2s] Webhook caught payload. Spawning worker thread...
                    </p>
                    <p className="text-blue-300">
                      [0.8s] Resume parsed into semantic chunks...
                    </p>
                    <p className="text-amber-300">
                      [1.7s] Gemini generated candidate-job embeddings...
                    </p>
                    <p className="text-emerald-300">
                      [2.9s] Similarity score resolved. Rendering scorecard...
                    </p>
                  </div>
                </div>
              )}

              {screeningState === "scored" && (
                <div className="w-full rounded-2xl border border-emerald-200 bg-white p-6 text-left shadow-md shadow-emerald-500/5">
                  <div className="mb-4 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center">
                    <div>
                      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold uppercase text-emerald-700">
                        High Match Vector
                      </span>
                      <h3 className="mt-2 font-mono text-lg font-bold text-slate-950">
                        Candidate Payload: Barun Mahato
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-sm">
                      <span className="font-mono text-3xl font-black">
                        94.2%
                      </span>
                      <span className="font-mono text-xs font-medium opacity-90">
                        FIT
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="mb-2 block font-mono font-bold text-emerald-700">
                        POSITIVE EMBEDDING HITS
                      </span>
                      <ul className="list-inside list-disc space-y-1 text-slate-600">
                        <li>
                          Strong overlap with{" "}
                          <strong className="font-mono text-slate-900">
                            Next.js App Router
                          </strong>
                        </li>
                        <li>
                          Backend pipeline experience matches target schema
                        </li>
                        <li>
                          AI orchestration context aligns with JD requirements
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                      <span className="mb-2 block font-mono font-bold text-amber-800">
                        RECOMMENDED DELTA PROBE
                      </span>
                      <p className="leading-relaxed text-slate-600">
                        Validate cloud deployment, queue reliability, and
                        production monitoring experience during the interview.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => setScreeningState("idle")}
                      className="font-mono text-xs font-medium text-slate-400 transition hover:text-slate-700"
                    >
                      [ Reset Workspace ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
              Core engines
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Built for job search automation, not just tracking.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pipeline */}
        <section className="border-y border-slate-200 bg-slate-50/80">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
                  Architecture
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                  Next.js frontend. n8n agents. PostgreSQL memory.
                </h2>
                <p className="mt-5 leading-8 text-slate-600">
                  VectorHire keeps the UI fast while n8n handles heavy
                  automation: crawling jobs, extracting resume context,
                  generating AI matches, and syncing results back to the app.
                </p>

                <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Designed for structured, consistent candidate evaluation
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {pipelineSteps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-950">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                  Ready for launch
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                  Turn your resume into an autonomous job search agent.
                </h2>
                <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                  VectorHire helps candidates discover relevant opportunities,
                  understand fit, and move faster with AI-generated application
                  drafts.
                </p>
              </div>

              <a
                href="/auth"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-blue-50"
              >
                Try VectorHire
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}