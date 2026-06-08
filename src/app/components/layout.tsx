import React from "react";
import { NavLink } from "react-router";
import { BookOpen, CalendarDays, Home, User } from "lucide-react";
import { motion } from "motion/react";
import zufeLogo from "../../assets/zufe-logo.webp";

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
    </motion.div>
  );
};
