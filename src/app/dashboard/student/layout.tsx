"use client";

import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client"; // Added useSession
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Bot, Briefcase, Settings, LogOut, Zap } from "lucide-react";
import { SidebarAgentControl } from "@/components/Sidebar"; // Adjust path as needed

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. Get the current session to pass studentId to the Agent Control
  const { data: session } = useSession();

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
          <NavItem 
            href="/dashboard/student/ai-agent" 
            icon={<Bot size={20} />} 
            label="AI Agent" 
            active={pathname === "/dashboard/student/ai-agent"} 
          />
          <NavItem 
            href="/dashboard/student/matches" 
            icon={<Briefcase size={20} />} 
            label="Matches" 
            active={pathname === "/dashboard/student/matches"} 
          />
          <NavItem 
            href="/dashboard/student/profile" 
            icon={<UserCircle size={20} />} 
            label="My Profile" 
            active={pathname === "/dashboard/student/profile"} 
          />
          <NavItem 
            href="/dashboard/student/settings" 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={pathname === "/dashboard/student/settings"} 
          />
        </nav>

        {/* --- DYNAMIC MAYA AUTOPILOT CONTROL --- */}
        <div className="px-4 mb-4">
          {session?.user?.id ? (
            <SidebarAgentControl 
  studentId={session?.user?.id || ""} 
  resumeUrl={(session?.user as any)?.resumeUrl || ""} 
/>
          ) : (
            <div className="h-32 w-full bg-slate-50 animate-pulse rounded-3xl" />
          )}
        </div>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-600 transition-colors w-full font-semibold text-sm">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h1 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">
            {pathname.split('/').pop()?.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-blue-600">
                {session?.user?.name?.charAt(0) || "U"}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-white/50">
          <div className="p-10 max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

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
     
      <AnimatePresence>
        {active && (
          <motion.div 
            layoutId="sidebar-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-50/80 -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </AnimatePresence>

    
      <span className={`transition-transform duration-200 ${active ? "text-blue-600 scale-110" : "text-slate-400"}`}>
        {icon}
      </span>
      <span className="tracking-tight">{label}</span>

     
      {active && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"
        />
      )}
    </Link>
  );
}