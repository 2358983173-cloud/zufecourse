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
  Scale,
  Database
} from "lucide-react";
import { motion } from "motion/react";

const CATEGORY_ICONS: Record<string, any> = {
  "金融投资": PieChart,
  "财务会计": Target,
  "数据分析": Database,
  "法律税务": Scale,
  "经济理论": Globe,
  "管理实践": Briefcase,
  "编程技术": Cpu,
  "通识拓展": BookOpen,
  "全部": Flame
};

export const CategoryPage = () => {
  return (
    <PageWrapper>
      <header className="px-6 pt-10 pb-6 bg-white sticky top-0 z-20 border-b border-gray-50/50">
        <h1 className="text-2xl font-black text-gray-900">课程分类</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Browse by Category</p>
      </header>

      <div className="p-6 grid grid-cols-1 gap-4">
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
                className="group bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-5 active:scale-[0.98] transition-all"
              >
                <div className="w-14 h-14 rounded-[22px] bg-gray-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon size={28} />
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
         <div className="bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h2 className="text-xl font-black mb-2 leading-tight">不知道选什么？</h2>
            <p className="text-xs text-blue-100/80 mb-6 leading-relaxed">
               试试我们的 AI 智能选课，<br/>只需 1 分钟即可匹配最适合你的课程。
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
