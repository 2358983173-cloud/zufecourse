import React from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { state } from "../data";

export const RecommendationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile || state.recommendationProfile;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <button onClick={() => navigate("/recommendation")} className="h-14 px-6 rounded-2xl bg-gray-900 text-white font-black">
          重新开始问卷
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[40px] bg-gray-900 text-white p-8 shadow-xl shadow-gray-200 relative overflow-hidden"
      >
        <div className="absolute right-[-40px] top-[-40px] w-44 h-44 rounded-full bg-blue-500/20 blur-2xl" />
        <Sparkles className="text-blue-300 mb-6" size={34} />
        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">你的方向建议</p>
        <h1 className="text-4xl font-black leading-tight mt-2">{profile.archetype}</h1>
        <p className="text-blue-100 font-bold mt-3">{profile.tagline}</p>
        <p className="text-sm leading-relaxed text-white/60 mt-6">{profile.summary}</p>
      </motion.div>

      <section className="mt-6 bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
        <h2 className="font-black text-gray-900 text-lg mb-4">选课参考标签</h2>
        <div className="space-y-3">
          {profile.strengths.map((item: string) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm font-black text-gray-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={() => navigate("/profile")}
        className="mt-8 w-full h-14 rounded-2xl bg-gray-900 text-white font-black flex items-center justify-center gap-2"
      >
        查看阶段规划
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
