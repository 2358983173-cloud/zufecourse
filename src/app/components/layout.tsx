import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { BarChart3, BookOpen, CalendarDays, ChevronUp, ClipboardList, Home, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import zufeLogo from "../../assets/zufe-logo.webp";
import { COURSE_STATE_EVENT, getCourseStats } from "../course-state";
import { loadCareerResult } from "../career-storage";

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
    { icon: CalendarDays, label: "课表", path: "/heat" },
    { icon: User, label: "我的", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-2 pb-6 flex justify-between items-center z-50 lg:hidden">
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

export const DesktopTopNav = () => {
  const location = useLocation();
  const hasCareerResult = Boolean(loadCareerResult());
  const items = [
    { icon: Home, label: "首页", path: "/home" },
    { icon: BookOpen, label: "课程", path: "/courses" },
    { icon: CalendarDays, label: "课表", path: "/heat" },
    ...(hasCareerResult
      ? [{ icon: BarChart3, label: "职业报告", path: "/recommendation-result" }]
      : [{ icon: ClipboardList, label: "方向测评", path: "/recommendation" }]),
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden h-[72px] border-b border-gray-200/80 bg-white/95 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-8 px-8">
        <NavLink to="/home" className="flex-shrink-0">
          <SchoolMark compact />
        </NavLink>
        <nav className="flex h-full flex-1 items-center gap-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex h-full items-center gap-2 px-4 text-sm font-bold transition-colors ${
                isActive ? "text-[#173b83]" : "text-gray-500 hover:text-gray-900"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
            {location.pathname === item.path && <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#173b83]" />}
          </NavLink>
        ))}
        </nav>
        <NavLink to="/profile" className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
          <User size={17} />
          我的
        </NavLink>
        <NavLink to="/login" title="退出登录" className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700">
          <LogOut size={18} />
        </NavLink>
      </div>
    </header>
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
    <div className="fixed left-1/2 bottom-[86px] z-40 w-full max-w-md -translate-x-1/2 px-4 lg:left-auto lg:right-8 lg:bottom-8 lg:w-[360px] lg:translate-x-0">
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
            <button onClick={() => navigate("/heat")} className="h-10 rounded-2xl bg-blue-50 text-xs font-black text-blue-700">查看课表</button>
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

export const PageWrapper = ({ children, showCreditPlan = false }: { children: React.ReactNode; showCreditPlan?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen overflow-x-hidden bg-gray-50 pb-24 lg:mx-auto lg:max-w-[1440px] lg:px-8 lg:py-8 lg:pb-10"
    >
      {children}
      {showCreditPlan && <FloatingCreditBar />}
    </motion.div>
  );
};
