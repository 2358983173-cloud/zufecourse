import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  Compass,
  GraduationCap,
  Search,
  Trophy,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { MOCK_COURSES } from "../data";
import { CourseListItem } from "../components/course-items";
import { PageWrapper, SchoolMark } from "../components/layout";
import { getCareerReport, loadCareerResult } from "../career-storage";
import { getCourseStats } from "../course-state";

const directionProfiles = [
  { icon: ChartNoAxesCombined, title: "投资研究", detail: "市场判断与分析", color: "bg-blue-100 text-blue-700" },
  { icon: BriefcaseBusiness, title: "银行实务", detail: "业务流程与风控", color: "bg-emerald-100 text-emerald-700" },
  { icon: ClipboardList, title: "财会审计", detail: "规则、报表与管理", color: "bg-amber-100 text-amber-700" },
  { icon: Compass, title: "数据金融", detail: "工具、计量与策略", color: "bg-violet-100 text-violet-700" },
];

export const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const hotCourses = useMemo(
    () => [...MOCK_COURSES].sort((a, b) => b.students - a.students).slice(0, 4),
    []
  );

  const stats = getCourseStats();
  const selectedCredits = stats.selectedCredits;
  const careerResult = loadCareerResult();
  const report = getCareerReport(careerResult);
  const profileName = report.title || "方向待确认";

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) navigate(`/courses?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <PageWrapper>
      <header className="px-5 pt-4 pb-3 bg-gray-50/95 backdrop-blur-md sticky top-0 z-20 lg:static lg:flex lg:items-end lg:justify-between lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-6">
        <div className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Course Workspace</p>
          <h1 className="mt-2 text-3xl font-black text-gray-950">金融学选课工作台</h1>
          <p className="mt-2 text-sm text-gray-500">集中查看选课进度、方向建议与近期课程。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 lg:hidden">
            <SchoolMark compact />
          </div>
        <form onSubmit={handleSearch} className="relative flex-1 min-w-0 lg:w-[360px] lg:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="搜索课程"
            className="w-full h-10 pl-9 pr-3 bg-white rounded-xl border-none shadow-sm text-xs font-medium focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300"
          />
          <button type="submit" className="hidden">搜索</button>
        </form>
        </div>
      </header>

      <section className="hidden lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:gap-6">
        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {[
              ["已选课程", stats.selectedCount, `${selectedCredits} 学分`],
              ["收藏课程", stats.favoriteCount, "待进一步比较"],
              ["剩余学分", stats.remainingCredits, `目标 ${stats.targetCredits} 学分`],
            ].map(([label, value, detail], index) => (
              <div key={label} className={`p-5 ${index > 0 ? "border-l border-gray-200" : ""}`}>
                <p className="text-xs font-bold text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-black text-gray-950">{value}</p>
                <p className="mt-1 text-xs text-gray-400">{detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-blue-700">职业方向</p>
                <h2 className="mt-2 text-2xl font-black text-gray-950">{profileName}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{report.summary}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <UserRound size={25} />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-3 border-t border-gray-100 pt-5">
              {directionProfiles.map((item) => (
                <button key={item.title} onClick={() => navigate("/courses")} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-left hover:bg-blue-50">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${item.color}`}><item.icon size={17} /></div>
                  <div><p className="text-xs font-bold text-gray-800">{item.title}</p><p className="mt-1 text-[10px] text-gray-400">{item.detail}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-[#173b83] p-6 text-white">
            <p className="text-xs font-bold text-blue-200">下一步建议</p>
            <h2 className="mt-3 text-xl font-black">{careerResult ? "继续完善课程组合" : "先完成职业方向测评"}</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">{careerResult ? "结合方向报告与剩余学分，继续比较课程。" : "用 12 个简单问题生成方向画像与课程建议。"}</p>
            <button onClick={() => navigate(careerResult ? "/courses" : "/recommendation")} className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-bold text-blue-900">
              {careerResult ? "进入课程中心" : "开始方向测评"}<ArrowRight size={16} />
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-gray-900">快捷操作</h2><span className="text-xs text-gray-400">常用入口</span></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                [BookOpen, "全部课程", "/courses"],
                [CalendarDays, "模拟课表", "/heat"],
                [ClipboardList, "重新测评", "/recommendation"],
                [GraduationCap, "职业报告", "/recommendation-result"],
              ].map(([Icon, label, path]) => {
                const ActionIcon = Icon as typeof BookOpen;
                return <button key={label as string} onClick={() => navigate(path as string)} className="flex min-h-20 flex-col items-start justify-between rounded-lg border border-gray-200 p-3 text-left hover:border-blue-300 hover:bg-blue-50"><ActionIcon size={18} className="text-blue-700" /><span className="text-xs font-bold text-gray-800">{label as string}</span></button>;
              })}
            </div>
          </div>
        </aside>
      </section>

      <section className="hidden lg:block lg:mt-7">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black text-gray-950">本周热课</h2><p className="mt-1 text-xs text-gray-400">根据当前选课人数排序</p></div><Link to="/courses?sort=popular" className="text-xs font-bold text-blue-700">查看全部课程</Link></div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {hotCourses.map((course, index) => (
            <button key={course.id} onClick={() => navigate(`/course/${course.id}`)} className="grid w-full grid-cols-[44px_minmax(0,1fr)_160px_120px_100px] items-center gap-4 border-b border-gray-100 px-5 py-4 text-left last:border-b-0 hover:bg-gray-50">
              <span className="text-sm font-black text-amber-600">#{index + 1}</span>
              <div className="min-w-0"><p className="truncate text-sm font-bold text-gray-900">{course.name}</p><p className="mt-1 truncate text-xs text-gray-400">{course.teacher} · {course.college}</p></div>
              <span className="text-xs font-bold text-gray-500">{course.category}</span>
              <span className="text-xs text-gray-500">{course.students} 人选课</span>
              <span className="text-right text-xs font-bold text-blue-700">查看详情</span>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 mt-3 lg:hidden">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/courses")}
          className="w-full min-h-32 rounded-[24px] bg-[#173b83] text-white p-5 text-left shadow-lg shadow-blue-900/15 relative overflow-hidden"
        >
          <div className="absolute right-[-32px] bottom-[-54px] w-44 h-44 rounded-full border-[26px] border-white/10" />
          <div className="relative max-w-[76%]">
            <div className="w-9 h-9 rounded-xl bg-white/12 flex items-center justify-center mb-3">
              <BookOpen size={23} />
            </div>
            <p className="text-[11px] font-black text-blue-100">课程库</p>
            <h1 className="text-xl font-black mt-1 leading-tight">查看全部课程</h1>
            <p className="text-xs text-white/65 font-medium mt-2 leading-relaxed">
              共 {MOCK_COURSES.length} 门课程，可按方向、热度和标签筛选。
            </p>
          </div>
          <ArrowRight className="absolute right-6 top-6 text-white/75" size={22} />
        </motion.button>
      </section>

      <section className="px-5 mt-3 grid grid-cols-2 gap-3 lg:hidden">
        <button
          onClick={() => navigate("/recommendation")}
          className="min-h-24 rounded-[20px] bg-white border border-gray-100 p-4 text-left shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ClipboardList size={19} />
          </div>
          <h2 className="font-black text-gray-900 mt-3">方向问卷</h2>
          <p className="text-[11px] text-gray-400 font-bold mt-1">重新梳理选课偏好</p>
        </button>
        <button
          onClick={() => navigate("/heat")}
          className="min-h-24 rounded-[20px] bg-white border border-gray-100 p-4 text-left shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookOpen size={19} />
          </div>
          <h2 className="font-black text-gray-900 mt-3">课程安排</h2>
          <p className="text-[11px] text-gray-400 font-bold mt-1">已选 {selectedCredits} 学分</p>
        </button>
      </section>

      <section className="px-5 mt-6 lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Career Profile</p>
            <h2 className="font-black text-gray-900 text-lg mt-1">你的职业方向画像</h2>
          </div>
          <Link to="/profile" className="text-[11px] font-black text-blue-700">查看规划</Link>
        </div>
        <div className="rounded-[22px] bg-white border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 rounded-[18px] bg-blue-50 text-[#173b83] flex items-center justify-center relative">
              <UserRound size={30} />
              <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-amber-400 border-4 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-gray-400">当前方向</p>
              <h3 className="font-black text-gray-900 text-xl mt-1">{profileName}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">根据问卷结果整理，可随时重新调整</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 lg:grid-cols-4">
            {directionProfiles.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate("/courses")}
                className="rounded-2xl bg-gray-50 p-3 text-left flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-800">{item.title}</p>
                  <p className="text-[9px] font-bold text-gray-400 mt-1">{item.detail}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 px-5 pb-20 lg:hidden">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            本周热课
          </h2>
          <Link to="/courses?sort=popular" className="text-[11px] font-black text-blue-700">查看全部</Link>
        </div>
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {hotCourses.map((course, index) => (
            <div key={course.id} className="relative bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="absolute left-3 top-3 z-10 w-6 h-6 rounded-full bg-amber-400 text-gray-900 text-[10px] font-black flex items-center justify-center">
                {index + 1}
              </div>
              <div className="pl-7">
                <CourseListItem course={course} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};
