"use client"; // MUST be a client component for framer-motion

import { motion } from "framer-motion";
import { Bot, Search, Target, CheckCircle2, Clock, Briefcase } from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function StudentDashboard() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-10"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agent Maya is Active</h2>
          <p className="text-slate-500 font-medium mt-1 text-lg">Currently monitoring LinkedIn, Naukri, and Wellfound.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Feed */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm"
        >
          <h3 className="font-bold text-xl text-slate-900 mb-8 flex items-center gap-2">
            <Search size={20} className="text-blue-600" />
            Live Activity
          </h3>

          <div className="space-y-8 relative">
            <ActivityItem 
              icon={<Search size={14} />} 
              status="Crawling" 
              title="New batch of 24 Java Internships detected" 
              time="Just now" 
            />
            <ActivityItem 
              icon={<Target size={14} />} 
              status="Scoring" 
              title="ServiceNow match found: 94% alignment" 
              time="12m ago" 
              highlight 
            />
          </div>
        </motion.div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <StatCard icon={<Briefcase size={20} className="text-blue-600" />} label="Matches" value="128" />
          <StatCard icon={<CheckCircle2 size={20} className="text-green-600" />} label="Applied" value="14" />
        </div>
      </div>
    </motion.div>
  );
}

// Fixed ActivityItem Props to stop TS errors
function ActivityItem({ icon, status, title, time, highlight = false }: any) {
  return (
    <div className="flex gap-6 relative group">
      <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${highlight ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-black uppercase tracking-widest ${highlight ? "text-blue-600" : "text-slate-400"}`}>{status}</p>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <span className="text-[10px] text-slate-300 font-bold">{time}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-4xl font-black text-slate-900">{value}</span>
    </div>
  );
}