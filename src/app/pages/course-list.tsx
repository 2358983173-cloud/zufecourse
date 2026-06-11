import React, { useMemo, useState } from "react";
import { ArrowLeft, ListFilter, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate, useSearchParams } from "react-router";
import { CATEGORIES, MOCK_COURSES } from "../data";
import { CourseListItem } from "../components/course-items";
import { PageWrapper } from "../components/layout";
import { getFavoriteCourseIds, getSelectedCourseIds } from "../course-state";

type SortMode = "default" | "popular" | "rating";
type ViewMode = "all" | "selected" | "favorite";

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
  const initialCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && CATEGORIES.includes(initialCategory) ? initialCategory : "全部"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [refresh, setRefresh] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const filteredCourses = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    const list = MOCK_COURSES.filter((course) => {
      const selectedIds = getSelectedCourseIds();
      const favoriteIds = getFavoriteCourseIds();
      if (viewMode === "selected" && !selectedIds.has(course.id)) return false;
      if (viewMode === "favorite" && !favoriteIds.has(course.id)) return false;
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

      const selectedIds = getSelectedCourseIds();
      const aIsSelected = selectedIds.has(a.id);
      const bIsSelected = selectedIds.has(b.id);
      if (aIsSelected && !bIsSelected) return -1;
      if (!aIsSelected && bIsSelected) return 1;
      return Number(a.id) - Number(b.id);
    });
  }, [selectedCategory, searchQuery, refresh, sortMode, viewMode]);

  const sortOptions: Array<{ id: SortMode; label: string }> = [
    { id: "default", label: "默认" },
    { id: "popular", label: "热度" },
    { id: "rating", label: "推荐" },
  ];
  const viewOptions: Array<{ id: ViewMode; label: string }> = [
    { id: "all", label: "全部" },
    { id: "selected", label: "已选" },
    { id: "favorite", label: "收藏" },
  ];

  return (
    <PageWrapper showCreditPlan>
      <header className="px-5 pt-4 pb-4 sticky top-0 z-20 border-b border-gray-100/50 backdrop-blur-md bg-white/92 lg:rounded-[24px] lg:border lg:px-6">
        <div className="flex items-center gap-3 mb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索感兴趣的课程或教师..."
            className="w-full h-10 pl-11 pr-9 bg-gray-50 rounded-xl border-none text-sm font-medium focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-300"
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
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-3 bg-gray-50 rounded-xl p-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSortMode(option.id)}
              className={`h-9 rounded-lg text-xs font-black transition-all ${
                sortMode === option.id ? "bg-[#173b83] text-white shadow-sm" : "text-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-3">
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

        <div className="-mx-5 overflow-x-auto no-scrollbar px-5">
          <div className="flex w-max gap-2 pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 rounded-full px-4 text-[11px] font-black whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-[#173b83] text-white border-[#173b83]"
                    : "bg-white text-gray-500 border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="px-5 py-4 lg:px-0">
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <ListFilter size={18} className="text-blue-700" />
            课程结果 <span className="text-gray-300 font-bold ml-1">{filteredCourses.length}</span>
          </h2>
          <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {sortMode === "default" ? "已选优先" : sortMode === "popular" ? "选课人数" : "推荐指数"}
          </div>
        </div>

        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50 lg:grid lg:grid-cols-2 lg:divide-y-0">
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
                    onStateChange={() => setRefresh((prev) => prev + 1)}
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
