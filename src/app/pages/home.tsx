import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ClipboardList,
  Compass,
  Search,
  Trophy,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { MOCK_COURSES, state } from "../data";
import { CourseListItem } from "../components/course-items";
import { PageWrapper, SchoolMark } from "../components/layout";
import { getCareerReport, loadCareerResult } from "../career-storage";

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

  const alternateCredits = useMemo(
    () =>
      MOCK_COURSES.filter((course) => state.alternateCourseIds.has(course.id)).reduce(
        (total, course) => total + course.credits,
        0
      ),
    []
  );

  const profileName = getCareerReport(loadCareerResult()).title || "方向待确认";

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchValue.trim()) navigate(`/courses?q=${encodeURIComponent(searchValue)}`);
  };

  return (
    <PageWrapper>
      <header className="px-6 pt-10 pb-4 bg-gray-50/95 backdrop-blur-md sticky top-0 z-20">
        <SchoolMark compact />
        <form onSubmit={handleSearch} className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="搜索课程、方向或老师..."
            className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm text-sm font-medium focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300"
          />
          <button type="submit" className="hidden">搜索</button>
        </form>
      </header>

      <section className="px-6 mt-5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/courses")}
          className="w-full min-h-44 rounded-[30px] bg-[#173b83] text-white p-6 text-left shadow-xl shadow-blue-900/15 relative overflow-hidden"
        >
          <div className="absolute right-[-32px] bottom-[-54px] w-44 h-44 rounded-full border-[26px] border-white/10" />
          <div className="relative max-w-[76%]">
            <div className="w-11 h-11 rounded-2xl bg-white/12 flex items-center justify-center mb-5">
              <BookOpen size={23} />
            </div>
            <p className="text-[11px] font-black text-blue-100">课程库</p>
            <h1 className="text-2xl font-black mt-2 leading-tight">查看全部课程</h1>
            <p className="text-xs text-white/65 font-medium mt-2 leading-relaxed">
              共 {MOCK_COURSES.length} 门课程，可按方向、热度和标签筛选。
            </p>
          </div>
          <ArrowRight className="absolute right-6 top-6 text-white/75" size={22} />
        </motion.button>
      </section>

      <section className="px-6 mt-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/recommendation")}
          className="min-h-28 rounded-[24px] bg-white border border-gray-100 p-4 text-left shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ClipboardList size={19} />
          </div>
          <h2 className="font-black text-gray-900 mt-4">方向问卷</h2>
          <p className="text-[11px] text-gray-400 font-bold mt-1">重新梳理选课偏好</p>
        </button>
        <button
          onClick={() => navigate("/heat")}
          className="min-h-28 rounded-[24px] bg-white border border-gray-100 p-4 text-left shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <BookOpen size={19} />
          </div>
          <h2 className="font-black text-gray-900 mt-4">备选课程</h2>
          <p className="text-[11px] text-gray-400 font-bold mt-1">已选 {alternateCredits} 学分</p>
        </button>
      </section>

      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Career Profile</p>
            <h2 className="font-black text-gray-900 text-lg mt-1">你的职业方向画像</h2>
          </div>
          <Link to="/profile" className="text-[11px] font-black text-blue-700">查看规划</Link>
        </div>
        <div className="rounded-[28px] bg-white border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 rounded-[22px] bg-blue-50 text-[#173b83] flex items-center justify-center relative">
              <UserRound size={34} />
              <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-amber-400 border-4 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-gray-400">当前方向</p>
              <h3 className="font-black text-gray-900 text-xl mt-1">{profileName}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">根据问卷结果整理，可随时重新调整</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
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

      <section className="mt-9 px-6 pb-20">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            本周热课
          </h2>
          <Link to="/courses?sort=popular" className="text-[11px] font-black text-blue-700">查看全部</Link>
        </div>
        <div className="space-y-3">
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
