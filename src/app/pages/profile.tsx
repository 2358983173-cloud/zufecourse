import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight, LogOut, RefreshCcw, User } from "lucide-react";
import { state } from "../data";
import { PageWrapper, SchoolMark } from "../components/layout";
import { getCourseStats } from "../course-state";
import { clearCareerResult, getCareerReport, loadCareerResult } from "../career-storage";
import { clearAuth } from "../api";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const result = loadCareerResult();
  const report = getCareerReport(result);
  const stats = getCourseStats();

  const handleLogout = () => {
    clearAuth();
    state.isLoggedIn = false;
    navigate("/");
  };

  const retake = () => {
    clearCareerResult();
    navigate("/recommendation");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#F7F8FA] pb-28 overflow-x-hidden lg:mx-auto lg:max-w-5xl lg:pb-4">
        <section className="px-5 pt-5">
          <SchoolMark compact />
          <div className="mt-4 rounded-[26px] bg-gradient-to-br from-blue-950 to-blue-700 p-5 text-white shadow-xl shadow-blue-900/15">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[20px] bg-white/12 flex items-center justify-center">
                <User size={28} />
              </div>
              <div>
                <h1 className="text-xl font-black">{state.user.name}</h1>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-blue-200">
                  浙江财经大学 · {state.user.grade} · {state.user.major}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Course Direction</p>
              <h2 className="mt-2 text-2xl font-black">{report.title}</h2>
              <p className="mt-3 text-xs font-medium leading-relaxed text-white/65">{report.summary}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate(result ? "/recommendation-result" : "/recommendation")}
                className="rounded-2xl bg-white px-4 py-3 text-xs font-black text-blue-900 flex items-center justify-center gap-2"
              >
                {result ? "查看职业方向报告" : "开始职业方向测评"}
                <ArrowRight size={15} />
              </button>
              <button
                onClick={retake}
                className="rounded-2xl bg-white/12 px-4 py-3 text-xs font-black text-white flex items-center justify-center gap-2"
              >
                <RefreshCcw size={15} />
                重新测评
              </button>
            </div>
          </div>
        </section>

        <section className="px-5 mt-6">
          <div className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 text-lg">选课进度概览</h2>
              <span className="text-[10px] font-black text-blue-700">目标 {stats.targetCredits} 学分</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                ["已选", stats.selectedCount, "bg-blue-50 text-blue-700"],
                ["收藏", stats.favoriteCount, "bg-amber-50 text-amber-700"],
                ["学分", stats.selectedCredits, "bg-emerald-50 text-emerald-700"],
                ["剩余", stats.remainingCredits, "bg-slate-50 text-slate-700"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className={`rounded-2xl p-3 ${color}`}>
                  <p className="text-lg font-black">{value}</p>
                  <p className="text-[9px] font-black opacity-60">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold text-gray-400">
              已选 {stats.selectedCount} 门课程，可继续调整课程组合并生成模拟课表。
            </p>
          </div>
        </section>

        {result && report.primary && (
          <section className="px-5 mt-6">
            <div className="rounded-[24px] bg-white border border-gray-100 p-5 shadow-sm overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Career Keywords</p>
              <h2 className="mt-1 text-lg font-black text-gray-900">职业词云</h2>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 py-3">
                {[...report.primary.skills, ...report.primary.careers.slice(0, 4), ...report.primary.courses.slice(0, 4)].map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`font-black ${
                      index % 5 === 0 ? "text-xl text-blue-800" :
                      index % 3 === 0 ? "text-base text-emerald-700" :
                      index % 2 === 0 ? "text-sm text-slate-700" : "text-xs text-blue-500"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-5 mt-8">
          <button
            onClick={handleLogout}
            className="w-full h-14 bg-red-50 text-red-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-red-100"
          >
            <LogOut size={18} />
            退出当前账号
          </button>
        </section>
      </div>
    </PageWrapper>
  );
};
