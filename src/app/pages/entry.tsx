import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Compass, Sparkles } from "lucide-react";

export const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">CourseFlow</h1>
        <p className="text-sm text-gray-500 font-medium mt-2">智能选课助手</p>
        <p className="text-xs text-gray-400 mt-1">让课程选择更适合你的兴趣与目标</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-6 z-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/login")}
          className="w-full p-6 bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-xl shadow-gray-200/50 flex flex-col items-center gap-4 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Compass size={28} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-900">进入系统</h3>
            <p className="text-xs text-gray-500 mt-1 px-4 leading-relaxed">
              登录你的学生账号，开始浏览课程
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/recommendation")}
          className="w-full p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[32px] shadow-xl shadow-blue-200 flex flex-col items-center gap-4 group border border-white/20"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <Sparkles size={28} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-white">智能推荐选课</h3>
            <p className="text-xs text-white/80 mt-1 px-4 leading-relaxed">
              完成 6 个简单问题，整理你的职业方向和推荐课程
            </p>
          </div>
        </motion.button>
      </div>

      <p className="mt-12 text-[10px] text-gray-400 font-medium">© 2026 CourseFlow Design Team</p>
    </div>
  );
};
