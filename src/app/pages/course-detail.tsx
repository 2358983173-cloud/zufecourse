import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Clock,
  Heart,
  Bookmark,
  Sparkles
} from "lucide-react";
import { MOCK_COURSES, state } from "../data";
import { PageWrapper } from "../components/layout";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import {
  isFavoriteCourse,
  isSelectedCourse,
  toggleFavoriteCourse,
  toggleSelectedCourse,
} from "../course-state";
import { CommentSection } from "../components/comment-section";

const CATEGORY_STYLES: Record<string, string> = {
  "通识": "from-emerald-400 via-emerald-200 to-emerald-50",
  "通识分层必修": "from-cyan-400 via-cyan-200 to-cyan-50",
  "学科必修": "from-blue-400 via-blue-200 to-blue-50",
  "专业必修": "from-amber-400 via-amber-200 to-amber-50",
  "专业选修": "from-indigo-400 via-indigo-200 to-indigo-50",
  "个性化选修": "from-violet-400 via-violet-200 to-violet-50",
};

const TEACHER_NOTES: Record<string, string> = {
  "19": "中央银行学需要结合宏观经济学和金融学基础理解，建议关注现实货币政策案例。",
  "20": "商业银行业务与经营适合想了解银行业务流程、客户经营和风险控制的同学。",
  "21": "公司金融重在理解企业投融资决策，建议课前补足基础会计和金融学知识。",
  "23": "证券投资学不只看概念，更重要的是建立风险收益的判断框架。",
  "24": "金融计量分析与应用会使用统计和计量工具，适合愿意动手处理数据的同学。",
  "25": "金融风险管理建议结合真实风险事件学习，注意理解模型背后的业务含义。",
  "29": "数字金融强调金融场景与技术变化的结合，课堂讨论和案例分析比较重要。",
  "31": "量化投资方法与应用需要一定编程和统计基础，建议保持每周练习。",
  "57": "金融数据挖掘以实操为主，完成项目比只记住方法更重要。",
  "58": "财务分析需要耐心阅读企业数据和报表，建议形成自己的分析模板。",
};

const tagStyle = (tag: string) => {
  if (tag === "通识选修") return "bg-cyan-100 text-cyan-700 border-cyan-200";
  if (tag === "人文素养") return "bg-rose-100 text-rose-700 border-rose-200";
  if (tag === "科学精神") return "bg-indigo-100 text-indigo-700 border-indigo-200";
  if (tag === "社会认知") return "bg-teal-100 text-teal-700 border-teal-200";
  if (tag === "管理智慧") return "bg-orange-100 text-orange-700 border-orange-200";
  if (tag.includes("热") || tag.includes("满")) return "bg-red-100 text-red-700 border-red-200";
  if (tag.includes("实操") || tag.includes("编程")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (tag.includes("闭卷") || tag.includes("难")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (tag.includes("高绩点")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (tag.includes("小组") || tag.includes("互动")) return "bg-violet-100 text-violet-700 border-violet-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = MOCK_COURSES.find((c) => c.id === id);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (course) {
      setIsCompleted(isSelectedCourse(course.id));
      setIsFavorite(isFavoriteCourse(course.id));
    }
  }, [course]);

  if (!course) return <div className="p-24 text-center">Course not found</div>;

  const toggleCompleted = () => {
    toggleSelectedCourse(course);
    setIsCompleted(isSelectedCourse(course.id));
  };

  const toggleFavorite = () => {
    toggleFavoriteCourse(course);
    setIsFavorite(isFavoriteCourse(course.id));
  };

  const gradientClass = CATEGORY_STYLES[course.category] || "from-gray-400 via-gray-200 to-gray-50";
  const recommendationIndex = Math.round(course.rating * 12 + Math.min(course.students / 80, 35));

  return (
    <PageWrapper>
      <section className="hidden lg:block">
        <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-700"><ArrowLeft size={16} />返回课程中心</button>
        <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6">
          <main className="min-w-0 space-y-6">
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="flex gap-6 p-6">
                <div className="h-40 w-56 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100"><ImageWithFallback src={course.cover} alt={course.name} className="h-full w-full object-cover" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-blue-700">{course.category}</p>
                  <h1 className="mt-2 text-3xl font-black text-gray-950">{course.name}</h1>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-gray-400">{course.englishName}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{course.tags.map((tag) => <span key={tag} className={`rounded-md border px-2.5 py-1 text-[10px] font-bold ${tagStyle(tag)}`}>{tag}</span>)}</div>
                </div>
              </div>
              <div className="grid grid-cols-5 border-t border-gray-200 bg-gray-50">
                {[["教师", course.teacher], ["开课学院", course.college], ["学分", course.credits], ["选课人数", course.students.toLocaleString()], ["推荐指数", recommendationIndex]].map(([label, value], index) => <div key={label} className={`p-4 ${index ? "border-l border-gray-200" : ""}`}><p className="text-[10px] font-bold text-gray-400">{label}</p><p className="mt-1 truncate text-sm font-black text-gray-900">{value}</p></div>)}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6"><h2 className="text-lg font-black text-gray-950">课程简介</h2><p className="mt-4 text-sm leading-7 text-gray-600">{course.intro}</p></div>
              <div className="rounded-xl border border-gray-200 bg-white p-6"><h2 className="text-lg font-black text-gray-950">考核标准</h2><div className="mt-4 flex items-start gap-3 rounded-lg bg-blue-50 p-4"><Award size={20} className="mt-0.5 flex-shrink-0 text-blue-700" /><p className="text-sm font-bold leading-6 text-blue-900">{course.assessment}</p></div></div>
            </section>

            {TEACHER_NOTES[course.id] && <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><p className="text-xs font-bold text-emerald-700">老师留言</p><p className="mt-3 text-sm font-bold leading-7 text-emerald-900">{TEACHER_NOTES[course.id]}</p></section>}

            <section className="rounded-xl border border-gray-200 bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black text-gray-950">教学大纲</h2><span className="text-xs text-gray-400">{course.outline.length} 个模块</span></div><div className="grid grid-cols-2 gap-3">{course.outline.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-lg border border-gray-200 p-4"><span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-black text-blue-700">{index + 1}</span><p className="text-sm font-bold text-gray-700">{item}</p></div>)}</div></section>
          </main>

          <aside className="sticky top-[96px] space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-xs font-bold text-gray-500">选课操作</p><div className="mt-4 grid gap-2"><button onClick={toggleCompleted} className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold ${isCompleted ? "bg-red-50 text-red-600" : "bg-[#173b83] text-white"}`}><Heart size={17} fill={isCompleted ? "currentColor" : "none"} />{isCompleted ? "已加入课程" : "加入已选课程"}</button><button onClick={toggleFavorite} className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-bold ${isFavorite ? "border-amber-200 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-600"}`}><Bookmark size={17} fill={isFavorite ? "currentColor" : "none"} />{isFavorite ? "已收藏" : "收藏课程"}</button></div></div>
            <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-xs font-bold text-gray-500">选课提示</p><div className="mt-4 space-y-3 text-xs leading-5 text-gray-500"><p>先确认课程类别与学分要求。</p><p>结合考核方式和基础标签判断学习投入。</p><p>评论区内容来自同学经验，仅供参考。</p></div></div>
          </aside>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 -mt-2 lg:hidden">
        {/* Dynamic Gradient Header */}
        <div className={`relative h-72 bg-gradient-to-br ${gradientClass} transition-colors duration-500`}>
          <div className="absolute top-8 left-5 right-5 flex justify-between z-10">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)} 
              className="p-2.5 bg-black/10 backdrop-blur-md rounded-full text-white border border-white/20"
            >
              <ArrowLeft size={20} />
            </motion.button>
          </div>

          <div className="absolute bottom-8 left-5 right-5 flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-[22px] overflow-hidden shadow-xl border-4 border-white/40 flex-shrink-0"
            >
              <ImageWithFallback src={course.cover} alt={course.name} className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/30 backdrop-blur-md rounded-full border border-white/40 text-[10px] text-gray-800 font-black mb-2">
                 <Sparkles size={12} className="text-white" />
                 {course.category}
              </div>
              <h1 className="text-xl font-black text-gray-900 leading-tight mb-1">{course.name}</h1>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">{course.englishName}</p>
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="px-5 flex justify-around py-4 bg-white/70 backdrop-blur-sm -mt-3 rounded-t-[24px] border-t border-white/50 relative z-10">
           <div className="text-center">
             <div className="text-lg font-black text-gray-900">{recommendationIndex}</div>
             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">推荐指数</div>
           </div>
           <div className="w-px h-8 bg-gray-200/50 mt-1"></div>
           <div className="text-center">
             <div className="text-lg font-black text-gray-900">{course.students.toLocaleString()}</div>
             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">在学人数</div>
           </div>
           <div className="w-px h-8 bg-gray-200/50 mt-1"></div>
           <div className="text-center">
             <div className="text-lg font-black text-gray-900">{course.credits}</div>
             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">获得学分</div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-5 bg-white grid grid-cols-2 gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={toggleCompleted}
            className={`h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-xs transition-all border ${
              isCompleted
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-gray-50 text-gray-900 border-gray-100"
            }`}
          >
            <Heart size={18} fill={isCompleted ? "currentColor" : "none"} />
            {isCompleted ? "已选课程" : "加入已选"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={`h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-xs border ${
              isFavorite ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-gray-50 text-gray-900 border-gray-100"
            }`}
          >
            <Bookmark size={18} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "已收藏" : "收藏"}
          </motion.button>
        </div>

        {/* Info Panel */}
        <div className="bg-white px-5 pb-24">
          <div className="flex flex-wrap gap-2 mb-6">
            {course.tags.map(tag => (
              <span key={tag} className={`px-3 py-1.5 rounded-xl text-[11px] font-black border ${tagStyle(tag)}`}>
                #{tag}
              </span>
            ))}
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
               <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
               课程简介
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {course.intro}
            </p>
          </section>

          {TEACHER_NOTES[course.id] && (
            <section className="mb-8">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                老师留言
              </h2>
              <div className="rounded-[28px] bg-emerald-50/70 border border-emerald-100 p-5">
                <p className="text-sm leading-relaxed text-emerald-800 font-bold">
                  {TEACHER_NOTES[course.id]}
                </p>
              </div>
            </section>
          )}

          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                 教学大纲
              </h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{course.outline.length} Modules</span>
            </div>
            <div className="space-y-3">
              {course.outline.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 flex items-center gap-3 group active:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-gray-400">
                    {index + 1}
                  </div>
                  <span className="text-sm font-black text-gray-700 flex-grow">{item}</span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
             <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                考核标准
             </h2>
             <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-start gap-4">
               <div className="w-12 h-12 rounded-[20px] bg-white flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                  <Award size={24} />
               </div>
               <div>
                  <h4 className="text-sm font-black text-gray-900 mb-1">Final Assessment</h4>
                  <p className="text-xs text-blue-700/70 font-bold leading-relaxed">{course.assessment}</p>
               </div>
             </div>
          </section>

        </div>
      </div>
      <div className="mt-6 px-5 pb-20 lg:px-0 lg:pb-4">
        <CommentSection courseId={course.id} />
      </div>
    </PageWrapper>
  );
};
