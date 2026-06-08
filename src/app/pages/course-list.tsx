import React, { useMemo, useState } from "react";
import { ArrowLeft, ListFilter, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import { CATEGORIES, MOCK_COURSES, state } from "../data";
import { CourseListItem } from "../components/course-items";
import { PageWrapper, SchoolMark } from "../components/layout";
import { getFavoriteCourseIds, getSelectedCourseIds } from "../course-state";

type SortMode = "default" | "popular" | "rating";
type ViewMode = "all" | "selected" | "favorite" | "backup" | "recommended";

const recommendationIndex = (course: { rating: number; students: number }) =>
  Math.round(course.rating * 12 + Math.min(course.students / 80, 35));

export const CourseList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSort: SortMode =
    searchParams.get("sort") === "popular"
      ? "popular"
      : searchParams.get("sort") === "rating"
        ? "rating"
        : "default";
  const [sortMode, setSortMode] = useState<SortMode>(initialSort);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [refresh, setRefresh] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const targetCredits = 22;
  const selectedCredits = useMemo(
    () =>
      MOCK_COURSES.filter((course) => state.alternateCourseIds.has(course.id)).reduce(
        (total, course) => total + course.credits,
        0
      ),
    [refresh]
  );
  const remainingCredits = Math.max(targetCredits - selectedCredits, 0);

  const filteredCourses = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    const list = MOCK_COURSES.filter((course) => {
      const selectedIds = getSelectedCourseIds();
      const favoriteIds = getFavoriteCourseIds();
      if (viewMode === "selected" && !selectedIds.has(course.id)) return false;
      if (viewMode === "favorite" && !favoriteIds.has(course.id)) return false;
      if (viewMode === "backup" && !state.alternateCourseIds.has(course.id)) return false;
      if (viewMode === "recommended" && state.recommendationProfile) {
        const names = state.recommendationProfile.careerTree.flatMap((node) => node.courses);
        if (!names.includes(course.name)) return false;
      }
      const matchesCategory = selectedCategory === "全部" || course.category === selectedCategory;
      const matchesSearch =
        !keyword ||
        course.name.toLowerCase().includes(keyword) ||
        course.teacher.toLowerCase().includes(keyword) ||
        course.college.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });

    return list.sort((a, b) => {
      if (sortMode === "popular") return b.students - a.students;
      if (sortMode === "rating") return recommendationIndex(b) - recommendationIndex(a);

      const aIsAlt = state.alternateCourseIds.has(a.id);
      const bIsAlt = state.alternateCourseIds.has(b.id);
      if (aIsAlt && !bIsAlt) return -1;
      if (!aIsAlt && bIsAlt) return 1;
      return Number(a.id) - Number(b.id);
    });
  }, [selectedCategory, searchQuery, refresh, sortMode, viewMode]);

  const sortOptions: Array<{ id: SortMode; label: string }> = [
    { id: "default", label: "默认" },
    { id: "popular", label: "热度" },
    { id: "rating", label: "指数" },
  ];
  const viewOptions: Array<{ id: ViewMode; label: string }> = [
    { id: "all", label: "全部" },
    { id: "selected", label: "已选" },
    { id: "favorite", label: "收藏" },
    { id: "backup", label: "备选" },
    { id: "recommended", label: "推荐" },
  ];

  return (
    <PageWrapper>
      <header className="px-6 pt-10 pb-6 sticky top-0 z-20 border-b border-gray-100/50 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4 mb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-900"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div className="flex-grow min-w-0">
            <SchoolMark compact />
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="p-2.5 bg-gray-50 rounded-2xl text-gray-900">
            <SlidersHorizontal size={20} />
          </motion.button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索感兴趣的课程或教师..."
            className="w-full h-12 pl-12 pr-10 bg-gray-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 rounded-2xl p-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSortMode(option.id)}
              className={`h-10 rounded-xl text-xs font-black transition-all ${
                sortMode === option.id ? "bg-[#173b83] text-white shadow-sm" : "text-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {viewOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setViewMode(option.id)}
              className={`h-9 rounded-xl text-[11px] font-black transition-all ${
                viewMode === option.id ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-white text-gray-400 border border-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-4 rounded-2xl bg-blue-50 border border-blue-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">本轮备选学分</p>
            <p className="text-xs text-blue-700/70 font-bold mt-1">
              已选 {selectedCredits} 学分，建议目标 {targetCredits} 学分
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-[#173b83]">{remainingCredits}</div>
            <div className="text-[10px] font-black text-blue-700/70">剩余学分</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-10 rounded-2xl px-3 py-2 text-[11px] font-black leading-tight transition-all border ${
                selectedCategory === cat
                  ? "bg-[#173b83] text-white border-[#173b83] shadow-lg shadow-blue-900/10"
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <ListFilter size={18} className="text-blue-700" />
            课程结果 <span className="text-gray-300 font-bold ml-1">{filteredCourses.length}</span>
          </h2>
          <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {sortMode === "default" ? "备选优先" : sortMode === "popular" ? "选课人数" : "推荐指数"}
          </div>
        </div>

        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          {filteredCourses.length > 0 ? (
            <AnimatePresence initial={false}>
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CourseListItem
                    course={course}
                    onToggleAlternate={() => setRefresh((prev) => prev + 1)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200 mb-4">
                <Search size={32} />
              </div>
              <p className="text-gray-400 text-sm font-bold">没有找到匹配的课程</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("全部");
                  setSortMode("default");
                }}
                className="mt-4 text-xs font-black text-blue-700 uppercase tracking-widest"
              >
                清除所有筛选
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 px-6 pb-20">
        <p className="text-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
          已显示全部搜索结果
        </p>
      </div>
    </PageWrapper>
  );
};
