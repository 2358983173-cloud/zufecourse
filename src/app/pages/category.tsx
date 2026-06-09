import React from "react";
import { PageWrapper } from "../components/layout";
import { CATEGORIES } from "../data";
import { Link } from "react-router";
import { 
  Flame, 
  ChevronRight, 
  ArrowLeft,
  PieChart,
  Target,
  Cpu,
  Globe,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";

const CATEGORY_ICONS: Record<string, any> = {
  "通识分层必修": BookOpen,
  "学科必修": Globe,
  "专业必修": Target,
  "专业选修": PieChart,
  "个性化选修": Cpu,
  "通识": Briefcase,
  "全部": Flame
};

export const CategoryPage = () => {
  return (
    <PageWrapper>
      <header className="px-5 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-gray-50/50">
        <h1 className="text-xl font-black text-gray-900">课程分类</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Browse by Category</p>
      </header>

      <div className="p-5 grid grid-cols-1 gap-3">
        {CATEGORIES.filter(c => c !== "全部").map((cat, idx) => {
          const Icon = CATEGORY_ICONS[cat] || Flame;
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/courses?category=${cat}`}
                className="group bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all"
              >
                <div className="w-11 h-11 rounded-[15px] bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon size={22} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black text-gray-900 text-lg">{cat}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Explore {cat}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <section className="px-6 mt-6 pb-12">
         <div className="bg-blue-600 rounded-[24px] p-5 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h2 className="text-xl font-black mb-2 leading-tight">不知道选什么？</h2>
            <p className="text-xs text-blue-100/80 mb-6 leading-relaxed">
               完成职业方向测评，快速整理适合你的课程路径。
            </p>
            <Link 
              to="/recommendation"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-2xl text-xs font-black shadow-lg"
            >
               立即开始 <ChevronRight size={14} />
            </Link>
         </div>
      </section>
    </PageWrapper>
  );
};
