import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Lock, User } from "lucide-react";
import { SchoolMark } from "../components/layout";
import { state } from "../data";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      state.isLoggedIn = true;
      setLoading(false);
      navigate("/recommendation");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-12%] right-[-18%] w-72 h-72 bg-blue-200/25 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-12%] w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm mx-auto relative"
      >
        <div className="mb-7">
          <SchoolMark />
          <div className="mt-5">
            <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest">
              ZUFE Finance
            </p>
            <h1 className="text-2xl font-black text-gray-900 tracking-normal mt-2 leading-tight">
              一人一规划，精准生成课程路径
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-3 leading-relaxed">
              登录后完成方向测评，再生成已选课程、职业树与模拟课表。
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              学号
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                defaultValue="20230001"
                className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500/10 text-sm font-medium"
                placeholder="请输入学号"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="password"
                defaultValue="password123"
                className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500/10 text-sm font-medium"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all shadow-xl ${
              loading ? "bg-gray-200 text-gray-400" : "bg-[#173b83] text-white shadow-blue-900/15"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                开始选课测评
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
