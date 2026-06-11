import React from "react";
import { useNavigate } from "react-router";
import { ArrowRight, BarChart3, BookOpen, CalendarDays, LogOut, RefreshCcw, User } from "lucide-react";
import { state } from "../data";
import { PageWrapper, SchoolMark } from "../components/layout";
import { getCourseStats } from "../course-state";
import { getCareerReport, loadCareerResult } from "../career-storage";
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
    if (!window.confirm("重新测评会替换当前职业报告和问卷推荐课程，是否继续？")) return;
    navigate("/recommendation?retake=1");
  };

  return (
    <PageWrapper>
      <section className="hidden lg:block">
        <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Personal Center</p><h1 className="mt-2 text-3xl font-black text-gray-950">我的选课中心</h1><p className="mt-2 text-sm text-gray-500">查看个人方向、选课进度和下一步安排。</p></div>
        <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6">
          <main className="min-w-0 space-y-6">
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-5"><div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><User size={30} /></div><div><h2 className="text-2xl font-black text-gray-950">{state.user.name}</h2><p className="mt-1 text-sm text-gray-500">浙江财经大学 · {state.user.grade} · {state.user.major}</p></div></div>
              <div className="mt-6 grid grid-cols-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {[["已选课程", stats.selectedCount], ["收藏课程", stats.favoriteCount], ["已选学分", stats.selectedCredits], ["剩余学分", stats.remainingCredits]].map(([label, value], index) => <div key={label} className={`p-4 ${index ? "border-l border-gray-200" : ""}`}><p className="text-xs font-bold text-gray-500">{label}</p><p className="mt-2 text-2xl font-black text-gray-950">{value}</p></div>)}
              </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold text-blue-700">当前职业方向</p><h2 className="mt-2 text-2xl font-black text-gray-950">{report.title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">{report.summary}</p></div>{report.primary && <img src={report.primary.image} alt={report.title} className="h-28 w-28 flex-shrink-0 object-contain" />}</div>
              <div className="mt-5 flex gap-3 border-t border-gray-100 pt-5"><button onClick={() => navigate(result ? "/recommendation-result" : "/recommendation")} className="flex h-10 items-center gap-2 rounded-lg bg-[#173b83] px-4 text-xs font-bold text-white">{result ? "查看完整职业报告" : "开始职业方向测评"}<ArrowRight size={14} /></button><button onClick={retake} className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-4 text-xs font-bold text-gray-600"><RefreshCcw size={14} />重新测评</button></div>
            </section>

            {result && report.primary && <section className="rounded-xl border border-gray-200 bg-white p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-black text-gray-950">职业关键词</h2><p className="mt-1 text-xs text-gray-400">根据当前测评方向整理</p></div></div><div className="mt-6 flex flex-wrap gap-2">{[...report.primary.skills, ...report.primary.careers.slice(0, 5), ...report.primary.courses.slice(0, 6)].map((word, index) => <span key={`${word}-${index}`} className={`rounded-md border px-3 py-2 text-xs font-bold ${index % 3 === 0 ? "border-blue-100 bg-blue-50 text-blue-800" : "border-gray-200 bg-gray-50 text-gray-600"}`}>{word}</span>)}</div></section>}
          </main>

          <aside className="space-y-4">
            <section className="rounded-xl border border-gray-200 bg-white p-5"><h2 className="text-sm font-black text-gray-900">快捷入口</h2><div className="mt-4 space-y-2">{[[BookOpen, "课程中心", "/courses"], [CalendarDays, "查看课表", "/heat"], [BarChart3, "职业报告", result ? "/recommendation-result" : "/recommendation"]].map(([Icon, label, path]) => { const ItemIcon = Icon as typeof BookOpen; return <button key={label as string} onClick={() => navigate(path as string)} className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 px-3 text-xs font-bold text-gray-700 hover:bg-gray-50"><span className="flex items-center gap-2"><ItemIcon size={16} className="text-blue-700" />{label as string}</span><ArrowRight size={14} className="text-gray-300" /></button>; })}</div></section>
            <section className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-xs font-bold text-gray-500">学分完成度</p><p className="mt-2 text-3xl font-black text-gray-950">{stats.selectedCredits} <span className="text-sm text-gray-400">/ {stats.targetCredits}</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-700" style={{ width: `${Math.min(100, (stats.selectedCredits / stats.targetCredits) * 100)}%` }} /></div><p className="mt-3 text-xs text-gray-400">{stats.remainingCredits ? `还需安排 ${stats.remainingCredits} 学分` : "当前学分目标已满足"}</p></section>
            <button onClick={handleLogout} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-xs font-bold text-red-600"><LogOut size={15} />退出当前账号</button>
          </aside>
        </div>
      </section>

      <div className="min-h-screen bg-[#F7F8FA] pb-28 overflow-x-hidden lg:hidden">
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
