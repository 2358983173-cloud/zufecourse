import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { CareerReport } from "../components/career-report";
import { getCareerReport, loadCareerResult } from "../career-storage";

export const RecommendationResult = () => {
  const navigate = useNavigate();
  const result = loadCareerResult();
  const report = getCareerReport(result);
  const retake = () => {
    if (!window.confirm("重新测评会替换当前职业报告和问卷推荐课程，是否继续？")) return;
    navigate("/recommendation?retake=1");
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] p-6 flex flex-col justify-center">
        <div className="rounded-[32px] bg-white border border-gray-100 p-6 text-center shadow-sm">
          <h1 className="text-2xl font-black text-gray-900">还没有职业方向报告</h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">完成 12 题测评后，会在这里生成职业类型、职业树和课程路径。</p>
          <button onClick={() => navigate("/recommendation")} className="mt-6 w-full h-14 rounded-2xl bg-blue-800 text-white font-black">
            开始职业方向测评
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-5 pt-5 pb-28 overflow-x-hidden lg:mx-auto lg:max-w-[1440px] lg:px-8 lg:py-8">
      <section className="hidden lg:block">
        <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Career Report</p><h1 className="mt-2 text-3xl font-black text-gray-950">金融职业方向报告</h1><p className="mt-2 text-sm text-gray-500">根据本次问卷生成的方向匹配与课程建议。</p></div><button onClick={retake} className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600"><RotateCcw size={14} />重新测评</button></div>
        <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6">
          <main className="min-w-0 space-y-6">
            <section className="rounded-xl border border-gray-200 bg-white p-7"><div className="flex items-start justify-between gap-8"><div><p className="text-xs font-bold text-blue-700">主要方向</p><h2 className="mt-2 text-4xl font-black text-gray-950">{report.title}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">{report.summary}</p></div>{report.primary && <img src={report.primary.image} alt={report.title} className="h-44 w-44 flex-shrink-0 object-contain" />}</div><div className="mt-7 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">{report.ranked.slice(0, 3).map(({ profile, percent }) => <div key={profile.id} className="rounded-lg bg-gray-50 p-4"><div className="flex justify-between text-xs font-bold text-gray-700"><span>{profile.title}</span><span>{percent}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-blue-700" style={{ width: `${percent}%` }} /></div></div>)}</div></section>

            {report.primary && <><section className="grid grid-cols-2 gap-6"><div className="rounded-xl border border-gray-200 bg-white p-6"><h2 className="text-lg font-black text-gray-950">核心能力画像</h2><div className="mt-5 grid grid-cols-2 gap-3">{report.primary.accentSkills.map((skill, index) => <div key={skill} className={`rounded-lg p-4 text-sm font-bold ${index < 2 ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-700"}`}>{skill}</div>)}</div></div><div className="rounded-xl border border-gray-200 bg-white p-6"><h2 className="text-lg font-black text-gray-950">优先职业方向</h2><div className="mt-5 flex flex-wrap gap-2">{report.primary.careers.map((career) => <span key={career} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700">{career}</span>)}</div></div></section>
            <section className="rounded-xl border border-gray-200 bg-white p-6"><h2 className="text-lg font-black text-gray-950">金融职业成长路径</h2><div className="mt-6 grid grid-cols-5 gap-3">{["金融基础能力", "经济学与公司金融", "统计计量与数据理解", `${report.primary.title}方向能力`, report.primary.careers.slice(0, 2).join(" / ")].map((node, index) => <div key={node} className="relative rounded-lg border border-gray-200 p-4"><span className="text-xs font-black text-blue-700">0{index + 1}</span><p className="mt-3 text-xs font-bold leading-5 text-gray-700">{node}</p></div>)}</div></section></>}

            {report.matchedCourses.length > 0 && <section className="rounded-xl border border-gray-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black text-gray-950">课程库匹配课程</h2><button onClick={() => navigate("/courses")} className="text-xs font-bold text-blue-700">进入课程中心</button></div><div className="mt-5 grid grid-cols-2 gap-3">{report.matchedCourses.map((course) => <button key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-left hover:border-blue-300"><BookOpen size={17} className="mt-0.5 flex-shrink-0 text-blue-700" /><div><p className="text-sm font-bold text-gray-900">{course.name}</p><p className="mt-1 text-xs text-gray-400">{course.credits} 学分 · {course.assessment}</p></div></button>)}</div></section>}
          </main>
          <aside className="sticky top-[96px] space-y-4">{report.primary && <><section className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-xs font-bold text-gray-500">推荐行动建议</p><div className="mt-4 flex gap-3 rounded-lg bg-blue-50 p-4"><CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-blue-700" /><p className="text-xs font-bold leading-6 text-blue-900">{report.primary.action}</p></div></section><section className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-xs font-bold text-gray-500">推荐课程路径</p><div className="mt-4 space-y-3">{report.primary.coursePath.map((item, index) => <div key={item} className="flex gap-3"><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-black text-blue-700">{index + 1}</span><p className="text-xs font-bold leading-5 text-gray-600">{item}</p></div>)}</div></section></>}</aside>
        </div>
      </section>
      <div className="lg:hidden">
      <button
        onClick={() => navigate("/profile")}
        className="mb-5 w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-700"
      >
        <ArrowLeft size={20} />
      </button>
      <CareerReport
        result={result}
        onRetake={retake}
      />
      </div>
    </div>
  );
};
