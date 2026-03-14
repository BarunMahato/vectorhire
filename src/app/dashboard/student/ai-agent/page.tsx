"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Globe, Zap, Loader2, Linkedin, Database, ArrowUpRight, Wand2, MapPin, Building2, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function AIAgentCenter() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const studentId = session?.user?.id;
  // Fallback to a placeholder if resumeUrl isn't in session yet
  const resumeUrl = (session?.user as any)?.preferences?.resumeUrl || "https://vectorhire.com/default-resume.pdf";

  // MEMOIZED FETCH: Prevents unnecessary re-renders
  const fetchDiscoveries = useCallback(async () => {
    if (!studentId) return;
    try {
      const response = await fetch(`/api/jobs/external?studentId=${studentId}`);
      const data = await response.json();
      if (data.success) {
        setDiscoveries(data.jobs);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchDiscoveries();
  }, [fetchDiscoveries]);

  const startMayaSync = async () => {
    if (!studentId) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setIsSyncing(true);
    const loadingToast = toast.loading("Maya is deploying search clusters...");

    try {
      // Trigger n8n Webhook
      const response = await fetch("http://localhost:5678/webhook-test/external-hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          resumeUrl,
          source: "AGENT_DASHBOARD"
        }),
      });

      if (response.ok) {
        toast.success("Global Hunt Initiated!", { id: loadingToast });
        // POLL FOR UPDATES: Maya takes a few seconds to crawl. 
        // We refresh after 5s and 10s to show new data live.
        setTimeout(fetchDiscoveries, 5000);
        setTimeout(fetchDiscoveries, 12000);
      } else {
        throw new Error("n8n-unreachable");
      }
    } catch (error) {
      toast.error("Connection failed. Ensure n8n is running.", { id: loadingToast });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 bg-white">
      {/* Header Area */}
      <header className="flex items-end justify-between mb-16">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Intelligence Unit</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight italic">Maya<span className="text-blue-600">.</span></h1>
        </div>
        <button 
          onClick={fetchDiscoveries}
          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
        >
          <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </header>

      {/* Hero Control Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-7 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20"
        >
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 tracking-tight">Search Matrix</h3>
            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-md">
              Maya cross-references your resume against live market nodes to isolate high-probability opportunities.
            </p>
            <button 
              onClick={startMayaSync}
              disabled={isSyncing}
              className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:gap-6 disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="fill-blue-600 text-blue-600" />}
              {isSyncing ? "Syncing..." : "Execute Global Hunt"}
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Globe size={320} className="text-blue-400" />
          </div>
        </motion.div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-[32px] p-8 flex flex-col justify-between border border-slate-100">
             <Database className="text-blue-600" size={20} />
             <div>
               <p className="text-4xl font-black text-slate-900">{discoveries.length}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indexed Leads</p>
             </div>
          </div>
          <div className="bg-blue-600 rounded-[32px] p-8 flex flex-col justify-between text-white">
             <Linkedin size={20} />
             <div>
               <p className="text-4xl font-black">LIVE</p>
               <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Crawl Status</p>
             </div>
          </div>
        </div>
      </div>

      {/* Discovery Feed */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-slate-900 italic tracking-tight">Discovery Feed</h2>
          <div className="h-[1px] flex-1 bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {discoveries.length > 0 ? (
              discoveries.map((job, i) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-white border border-slate-200 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                      <Building2 className="text-slate-400 group-hover:text-blue-600" size={24} />
                    </div>
                    <a href={job.url} target="_blank" rel="noreferrer" className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                      <ArrowUpRight size={24} />
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-slate-500 font-semibold text-sm">
                      {job.company}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <MapPin size={12} className="text-blue-500" /> {job.location?.split(',')[0] || "Remote"}
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all hover:gap-3">
                      <Wand2 size={14} /> Draft Magic
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 border-4 border-dashed border-slate-100 rounded-[56px] text-center bg-slate-50/50">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active clusters found.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}