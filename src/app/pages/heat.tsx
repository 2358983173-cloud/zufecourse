import React, { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Loader2, MapPin, Wand2 } from "lucide-react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { MOCK_COURSES, state } from "../data";
import { PageWrapper, SchoolMark } from "../components/layout";

const DAYS = ["周一", "周二", "周三", "周四", "周五"];
const TIMES = ["8:00", "9:55", "13:30", "15:25", "18:30"];
const ROOMS = ["金融楼 204", "实验楼 302", "综合楼 501", "金融楼 108", "图书馆研讨室"];

export const HeatPage = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const alternateCourses = useMemo(() => {
    const selected = MOCK_COURSES.filter((course) => state.alternateCourseIds.has(course.id));
    return selected.length > 0 ? selected : MOCK_COURSES.slice(0, 8);
  }, [generated]);

  const schedule = useMemo(() => {
    return alternateCourses.map((course, index) => ({
      course,
      day: DAYS[index % DAYS.length],
      time: TIMES[Math.floor(index / DAYS.length) % TIMES.length],
      room: ROOMS[index % ROOMS.length],
    }));
  }, [alternateCourses]);

  const todayCourses = schedule.filter((item) => item.day === "周一");

  const generateSchedule = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1200);
  };

  return (
    <PageWrapper>
      <header className="px-6 pt-10 pb-6 bg-gray-50">
        <SchoolMark compact />
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mt-7">Plan Builder</p>
        <h1 className="text-3xl font-black text-gray-900 mt-1">备选与课表</h1>
        <p className="text-sm text-gray-400 font-medium mt-2">
          所有备选课程都会参与模拟排课，生成后可横向查看周一到周五课表。
        </p>
      </header>

      <section className="px-6">
        <div className="rounded-[36px] bg-[#173b83] text-white p-7 relative overflow-hidden shadow-xl shadow-blue-900/15">
          <div className="absolute right-[-40px] top-[-40px] w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <Wand2 size={34} className="text-blue-100 mb-6" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/50">当前备选</p>
          <h2 className="text-2xl font-black mt-2">{alternateCourses.length} 门课程待排入课表</h2>
          <button
            onClick={generateSchedule}
            disabled={generating}
            className="mt-6 w-full h-13 rounded-2xl bg-white text-gray-900 font-black flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <CalendarDays size={18} />}
            {generating ? "正在生成课表" : "生成模拟课表"}
          </button>
        </div>
      </section>

      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-900 text-lg">备选课程</h2>
          <span className="text-[10px] font-black text-gray-400">横向滑动查看全部</span>
        </div>
        <div className="-mx-6 overflow-x-scroll no-scrollbar px-6 pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex w-max gap-4 pr-6">
            {alternateCourses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="w-64 bg-white rounded-[30px] border border-gray-100 p-5 shadow-sm text-left"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-700">{course.category}</p>
                <h3 className="font-black text-gray-900 mt-2 line-clamp-2">{course.name}</h3>
                <p className="text-xs text-gray-400 font-bold mt-3">
                  {course.credits} 学分 · {course.teacher}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-gray-50 text-[9px] font-black text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 mt-8 pb-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-900 text-lg">模拟课表</h2>
          {generated && (
            <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} />
              已生成
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[32px] border border-gray-100 p-8 text-center shadow-sm"
            >
              <Loader2 className="animate-spin mx-auto text-blue-700 mb-4" size={32} />
              <p className="text-sm font-black text-gray-900">正在把所有备选课程排入课表...</p>
              <p className="text-xs text-gray-400 font-bold mt-2">时间段：8:00 / 9:55 / 13:30 / 15:25 / 18:30</p>
            </motion.div>
          ) : !generated ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-[32px] border border-gray-100 p-8 text-center shadow-sm"
            >
              <CalendarDays className="mx-auto text-gray-200 mb-4" size={40} />
              <p className="text-sm font-black text-gray-900">课表尚未生成</p>
              <p className="text-xs text-gray-400 font-bold mt-2">
                点击上方按钮后显示周一到周五课表和今日课程。
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="-mx-6 overflow-x-scroll no-scrollbar px-6 pb-3" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="flex w-max gap-4 pr-6">
                  {DAYS.map((day) => {
                    const dayCourses = schedule.filter((item) => item.day === day);
                    return (
                      <div key={day} className="w-72 bg-white rounded-[32px] border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-black text-gray-900">{day}</h3>
                          <span className="text-[10px] font-black text-gray-400">{dayCourses.length} 门</span>
                        </div>
                        <div className="space-y-3">
                          {dayCourses.map((item) => (
                            <button
                              key={`${item.course.id}-${item.time}`}
                              onClick={() => navigate(`/course/${item.course.id}`)}
                              className="w-full rounded-2xl bg-gray-50 p-4 text-left"
                            >
                              <div className="text-[10px] font-black text-blue-700 flex items-center gap-1">
                                <Clock size={12} />
                                {item.time}
                              </div>
                              <div className="font-black text-gray-900 mt-1 line-clamp-1">{item.course.name}</div>
                              <div className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin size={12} />
                                {item.room}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-black text-gray-900 text-lg mb-4">今日课程</h3>
                <div className="space-y-3">
                  {todayCourses.map((item, index) => (
                    <button
                      key={`${item.course.id}-today`}
                      onClick={() => navigate(`/course/${item.course.id}`)}
                      className="w-full bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 flex-shrink-0 text-center">
                          <div className="text-sm font-black text-gray-900">{item.time}</div>
                          <div className="text-[10px] font-black text-gray-300 mt-1">#{index + 1}</div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-black text-gray-900 truncate">{item.course.name}</h3>
                          <p className="text-xs text-gray-400 font-bold mt-2">{item.room}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageWrapper>
  );
};
