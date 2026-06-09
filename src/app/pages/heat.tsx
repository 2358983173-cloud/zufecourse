import React, { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Loader2, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { PageWrapper, SchoolMark } from "../components/layout";
import { getSelectedCourses, getCourseStats, toggleSelectedCourse } from "../course-state";

const DAYS = ["周一", "周二", "周三", "周四", "周五"];
const TIMES = ["8:00", "9:55", "13:30", "15:25", "18:30"];
const ROOMS = ["金融楼 204", "实验楼 302", "综合楼 501", "金融楼 108", "图书馆研讨室"];

export const HeatPage = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const selectedCourses = useMemo(() => {
    const selected = getSelectedCourses();
    return selected;
  }, [refresh]);
  const stats = getCourseStats();

  const schedule = useMemo(
    () => selectedCourses.map((course, index) => ({
      course,
      day: DAYS[index % DAYS.length],
      time: TIMES[Math.floor(index / DAYS.length) % TIMES.length],
      room: ROOMS[index % ROOMS.length],
    })),
    [selectedCourses]
  );

  const generateSchedule = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 900);
  };

  return (
    <PageWrapper>
      <header className="px-5 pt-5 pb-4 bg-gray-50">
        <SchoolMark compact />
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mt-4">Course Plan</p>
        <h1 className="text-2xl font-black text-gray-900 mt-1">已选课程与课表</h1>
      </header>

      <section className="px-5">
        <div className="rounded-[24px] bg-[#173b83] text-white p-5 shadow-xl shadow-blue-900/15">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-2xl font-black">{stats.selectedCount}</p><p className="text-[10px] text-white/55 font-black">已选课程</p></div>
            <div><p className="text-2xl font-black">{stats.selectedCredits}</p><p className="text-[10px] text-white/55 font-black">已选学分</p></div>
            <div><p className="text-2xl font-black">{stats.remainingCredits}</p><p className="text-[10px] text-white/55 font-black">剩余学分</p></div>
          </div>
          <button onClick={generateSchedule} disabled={generating} className="mt-5 w-full h-12 rounded-2xl bg-white text-gray-900 font-black flex items-center justify-center gap-2">
            {generating ? <Loader2 size={18} className="animate-spin" /> : <CalendarDays size={18} />}
            {generating ? "正在生成课表" : "生成模拟课表"}
          </button>
        </div>
      </section>

      <section className="px-5 mt-6">
        <h2 className="font-black text-gray-900 text-lg mb-3">已选课程</h2>
        <div className="space-y-3">
          {selectedCourses.length === 0 ? (
            <div className="rounded-[20px] bg-white border border-gray-100 p-6 text-center shadow-sm">
              <CalendarDays className="mx-auto text-gray-200" size={34} />
              <p className="mt-3 text-sm font-black text-gray-900">还没有已选课程</p>
              <button onClick={() => navigate("/courses")} className="mt-4 h-10 px-5 rounded-xl bg-blue-800 text-xs font-black text-white">去选择课程</button>
            </div>
          ) : selectedCourses.map((course) => (
            <div key={course.id} className="rounded-[20px] bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-blue-700">{course.category}</p>
                  <h3 className="font-black text-gray-900 mt-1">{course.name}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-2">{course.credits} 学分 · {course.teacher} · {course.college}</p>
                  <p className="text-xs text-gray-400 font-bold mt-1">考核：{course.assessment}</p>
                </div>
                <button
                  onClick={() => {
                    toggleSelectedCourse(course);
                    setRefresh((value) => value + 1);
                  }}
                  className="p-2 rounded-full bg-red-50 text-red-500 flex-shrink-0"
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {course.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">{tag}</span>
                ))}
              </div>
              <button onClick={() => navigate(`/course/${course.id}`)} className="mt-4 h-10 w-full rounded-2xl bg-gray-50 text-xs font-black text-gray-700">查看详情</button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900 text-lg">模拟课表</h2>
          {generated && <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><CheckCircle2 size={13} />已生成</span>}
        </div>
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[28px] border border-gray-100 p-8 text-center shadow-sm">
              <Loader2 className="animate-spin mx-auto text-blue-700 mb-4" size={32} />
              <p className="text-sm font-black text-gray-900">正在整理纵向课表...</p>
            </motion.div>
          ) : !generated ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-[28px] border border-gray-100 p-8 text-center shadow-sm">
              <CalendarDays className="mx-auto text-gray-200 mb-4" size={40} />
              <p className="text-sm font-black text-gray-900">课表尚未生成</p>
              <p className="text-xs text-gray-400 font-bold mt-2">生成后按星期纵向展示，不需要左右滑动。</p>
            </motion.div>
          ) : (
            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {DAYS.map((day) => {
                const dayCourses = schedule.filter((item) => item.day === day);
                if (dayCourses.length === 0) return null;
                return (
                  <div key={day}>
                    <h3 className="font-black text-gray-900 mb-3">{day}</h3>
                    <div className="space-y-3">
                      {dayCourses.map((item) => (
                        <button key={`${item.course.id}-${item.time}`} onClick={() => navigate(`/course/${item.course.id}`)} className="w-full rounded-[24px] bg-white border border-gray-100 p-4 text-left shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="w-14 flex-shrink-0">
                              <p className="text-sm font-black text-blue-700 flex items-center gap-1"><Clock size={13} />{item.time}</p>
                            </div>
                            <div className="min-w-0 flex-grow">
                              <h4 className="font-black text-gray-900">{item.course.name}</h4>
                              <p className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1"><MapPin size={12} />{item.room}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageWrapper>
  );
};
