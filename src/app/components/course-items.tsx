import React, { useState } from "react";
import { Link } from "react-router";
import { Bookmark, Heart } from "lucide-react";
import { Course } from "../data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import {
  isFavoriteCourse,
  isSelectedCourse,
  toggleFavoriteCourse,
  toggleSelectedCourse,
} from "../course-state";

const tagStyle = (tag: string) => {
  if (tag.includes("热") || tag.includes("满")) return "bg-red-100 text-red-700 border-red-200";
  if (tag.includes("实操") || tag.includes("编程")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (tag.includes("闭卷") || tag.includes("难")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (tag.includes("高绩点")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (tag.includes("小组") || tag.includes("互动")) return "bg-violet-100 text-violet-700 border-violet-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export const CourseCard = ({ course }: { course: Course }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 block"
    >
      <Link to={`/course/${course.id}`}>
        <div className="relative aspect-[4/5]">
          <ImageWithFallback
            src={course.cover}
            alt={course.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[9px] font-bold">
            {course.credits} Credits
          </div>
          <div className="absolute bottom-3 left-3 right-3">
             <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">{course.name}</h3>
             <p className="text-white/70 text-[10px] mt-1">{course.teacher}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const CourseListItem = ({ course, onStateChange }: { course: Course, onStateChange?: (id: string) => void }) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteCourse(course.id));
  const [isSelected, setIsSelected] = useState(isSelectedCourse(course.id));

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteCourse(course);
    setIsFavorite(isFavoriteCourse(course.id));
    onStateChange?.(course.id);
  };

  const toggleSelected = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSelectedCourse(course);
    setIsSelected(isSelectedCourse(course.id));
    onStateChange?.(course.id);
  };

  return (
    <motion.div
      whileTap={{ backgroundColor: "#f9fafb" }}
      className="group relative"
    >
      <Link
        to={`/course/${course.id}`}
        className="flex items-center gap-3 p-3 transition-colors"
      >
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
          <ImageWithFallback
            src={course.cover}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow min-w-0 pr-16">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-gray-900 text-[15px] leading-tight line-clamp-1">{course.name}</h3>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium truncate">
            {course.credits} 学分 · {course.category} · {course.teacher}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 font-bold truncate">
            {course.college} · {course.assessment}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {course.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] px-2 py-1 rounded-full border font-black ${tagStyle(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
          <button title="已选课程" onClick={toggleSelected} className={`p-2 rounded-full ${isSelected ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-300"}`}>
            <Heart size={17} fill={isSelected ? "currentColor" : "none"} />
          </button>
          <button title="收藏课程" onClick={toggleFavorite} className={`p-2 rounded-full ${isFavorite ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-300"}`}>
            <Bookmark size={17} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};
