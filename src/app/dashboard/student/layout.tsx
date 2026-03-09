"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Bot, Briefcase, Settings, LogOut, Zap } from "lucide-react";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen"
      >
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">Vector<span className="text-blue-600">Hire</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard/student" icon={<Bot size={20} />} label="AI Agent" active={pathname === "/dashboard/student"} />
          <NavItem href="/dashboard/student/jobs" icon={<Briefcase size={20} />} label="Matches" active={pathname === "/dashboard/student/jobs"} />
          <NavItem href="/dashboard/student/profile" icon={<UserCircle size={20} />} label="My Profile" active={pathname === "/dashboard/student/profile"} />
          <NavItem href="/dashboard/student/settings" icon={<Settings size={20} />} label="Settings" active={pathname === "/dashboard/student/settings"} />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 transition-colors w-full font-semibold text-sm">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <h1 className="font-bold text-slate-800 text-lg">Student Command Center</h1>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
          </div>
        </header>

        {/* --- ANIMATE PRESENCE INTEGRATION --- */}
        <div className="p-10 flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname} // Unique key based on path triggers the animation
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


// Added Type definitions for NavItem to stop TypeScript errors
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all overflow-hidden ${
        active ? "text-blue-600" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      }`}
    >
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute inset-0 bg-blue-50/50 -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className={active ? "text-blue-600" : "text-slate-400"}>{icon}</span>
      {label}
    </Link>
  );
}