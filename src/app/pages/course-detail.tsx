import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Users, 
  Award, 
  BookOpen, 
  MessageCircle, 
  ChevronRight, 
  Clock,
  Heart,
  Bookmark,
  MoreVertical,
  ThumbsUp,
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

const CATEGORY_STYLES: Record<string, string> = {
  "通识教育必修课": "from-emerald-400 via-emerald-200 to-emerald-50",
  "学科基础必修课": "from-blue-400 via-blue-200 to-blue-50",
  "专业核心必修课": "from-amber-400 via-amber-200 to-amber-50",
  "银行管理方向": "from-indigo-400 via-indigo-200 to-indigo-50",
};

const TEACHER_NOTES: Record<string, string> = {
  "31": "建议先掌握货币金融学基础，再进入本课程的案例讨论。",
  "53": "这门课会用到计量和统计工具，适合愿意动手分析数据的同学。",
  "60": "实操专题需要保持每周练习，代码能力会直接影响学习体验。",
  "49": "证券投资学不只看概念，更重要的是建立风险收益的判断框架。",
  "62": "信贷管理适合想了解银行业务流程和风控逻辑的同学。",
  "83": "区块链课程适合跨学科探索，建议带着金融应用问题来学习。",
};

const tagStyle = (tag: string) => {
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
      <div className="min-h-screen bg-gray-50 -mt-2">
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

          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                 学习反馈
              </h2>
            </div>
            <div className="space-y-8">
              {course.reviews.map((review) => (
                <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                         <Users size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">{review.author}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">修读体验</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{review.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium mb-5">
                    {review.content}
                  </p>
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={14} /> {review.likes} Helpful
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors">
                      <MessageCircle size={14} /> 4 Replies
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};
