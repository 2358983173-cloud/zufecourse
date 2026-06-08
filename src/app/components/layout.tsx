import React from "react";
import { NavLink, useNavigate } from "react-router";
import { BookOpen, CalendarDays, ChevronUp, Home, User } from "lucide-react";
import { motion } from "motion/react";
import zufeLogo from "../../assets/zufe-logo.webp";
import { COURSE_STATE_EVENT, getCourseStats } from "../course-state";

export const SchoolMark = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`${
          compact ? "w-10 h-10 rounded-2xl" : "w-12 h-12 rounded-[18px]"
        } bg-white border border-blue-100 p-1 shadow-sm flex-shrink-0`}
      >
        <img src={zufeLogo} alt="浙江财经大学" className="w-full h-full object-contain rounded-xl" />
      </div>
      <div className="min-w-0">
        <p className={`${compact ? "text-sm" : "text-base"} font-black text-gray-900 truncate`}>
          浙江财经大学
        </p>
        <p className="text-[10px] font-black text-blue-700/70 uppercase tracking-widest truncate">
          金融学专业选课助手
        </p>
      </div>
    </div>
  );
};

export const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "首页", path: "/home" },
    { icon: BookOpen, label: "课程", path: "/courses" },
    { icon: CalendarDays, label: "备选", path: "/heat" },
    { icon: User, label: "我的", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-2 pb-6 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-gray-900" : "text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <motion.div whileTap={{ scale: 0.9 }} animate={isActive ? { y: -2 } : { y: 0 }}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className="text-[10px] font-black">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export const FloatingCreditBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [stats, setStats] = React.useState(getCourseStats());

  React.useEffect(() => {
    const update = () => setStats(getCourseStats());
    window.addEventListener(COURSE_STATE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(COURSE_STATE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const statusText = stats.exceededCredits
    ? `已超出 ${stats.exceededCredits} 学分`
    : stats.remainingCredits === 0
      ? "学分已满足"
      : `还差 ${stats.remainingCredits} 学分`;
  const statusColor = stats.exceededCredits ? "text-amber-600" : "text-blue-700";

  return (
    <div className="fixed left-1/2 bottom-[86px] z-40 w-full max-w-md -translate-x-1/2 px-4">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 rounded-[24px] border border-blue-100 bg-white/95 p-4 shadow-xl shadow-blue-900/10 backdrop-blur-md"
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-lg font-black text-gray-900">{stats.targetCredits}</p><p className="text-[10px] font-bold text-gray-400">目标</p></div>
            <div><p className="text-lg font-black text-gray-900">{stats.selectedCredits}</p><p className="text-[10px] font-bold text-gray-400">已选</p></div>
            <div><p className={`text-lg font-black ${statusColor}`}>{stats.exceededCredits || stats.remainingCredits}</p><p className="text-[10px] font-bold text-gray-400">{stats.exceededCredits ? "超出" : "剩余"}</p></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => navigate("/heat")} className="h-10 rounded-2xl bg-blue-50 text-xs font-black text-blue-700">查看备选</button>
            <button onClick={() => navigate("/courses")} className="h-10 rounded-2xl bg-gray-900 text-xs font-black text-white">去调整</button>
          </div>
        </motion.div>
      )}
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-[22px] border border-white/70 bg-white/88 px-4 py-3 shadow-xl shadow-blue-900/10 backdrop-blur-md"
      >
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">Credit Plan</p>
          <p className="text-sm font-black text-gray-900">已选 {stats.selectedCredits} / 目标 {stats.targetCredits} 学分</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black ${statusColor}`}>{statusText}</span>
          <ChevronUp size={16} className={`text-blue-700 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
    </div>
  );
};

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
      className="pb-24 min-h-screen bg-gray-50"
    >
      {children}
      <FloatingCreditBar />
    </motion.div>
  );
};
