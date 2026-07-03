"use client";

import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/auth"),
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Vector<span className="text-emerald-600">Hire</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard/recruiter" icon={<LayoutDashboard size={20} />} label="Overview" active={pathname === "/dashboard/recruiter"} />
        </nav>

        <div className="mx-4 mb-4 rounded-[28px] border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Talent Radar</p>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-emerald-900/70">
            Scores are refreshed from student profiles and recruiter skill requirements.
          </p>
        </div>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 transition-colors w-full font-bold text-sm">
            <LogOut size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-20">
          <h1 className="font-black text-slate-800 text-sm uppercase tracking-widest">Recruiter Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">Enterprise</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-white border border-emerald-100 shadow-sm" />
          </div>
        </header>

        <div className="p-6 md:p-10 flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link href={href} className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${active ? "text-emerald-600" : "text-slate-500 hover:bg-slate-50"}`}>
      {active ? (
        <motion.div
          layoutId="rec-active"
          className="absolute inset-0 bg-emerald-50/70 -z-10 rounded-2xl"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      ) : null}
      {icon} {label}
    </Link>
  );
}
