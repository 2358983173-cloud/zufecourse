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
      <section className="hidden lg:block">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Weekly Planner</p>
            <h1 className="mt-2 text-3xl font-black text-gray-950">已选课程与模拟课表</h1>
            <p className="mt-2 text-sm text-gray-500">检查课程组合，并生成一份便于比较时间安排的周计划。</p>
          </div>
          <button onClick={generateSchedule} disabled={generating} className="flex h-11 items-center gap-2 rounded-lg bg-[#173b83] px-5 text-sm font-bold text-white disabled:opacity-50">
            {generating ? <Loader2 size={17} className="animate-spin" /> : <CalendarDays size={17} />}
            {generating ? "正在生成" : generated ? "重新生成课表" : "生成模拟课表"}
          </button>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6">
          <div className="min-w-0">
            <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
              {[["已选课程", stats.selectedCount], ["已选学分", stats.selectedCredits], ["剩余学分", stats.remainingCredits]].map(([label, value], index) => (
                <div key={label} className={`p-5 ${index ? "border-l border-gray-200" : ""}`}><p className="text-xs font-bold text-gray-500">{label}</p><p className="mt-2 text-3xl font-black text-gray-950">{value}</p></div>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black text-gray-950">周课程安排</h2><p className="mt-1 text-xs text-gray-400">按星期纵向查看，无需左右拖动</p></div>{generated && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14} />已生成</span>}</div>
              {generating ? (
                <div className="rounded-xl border border-gray-200 bg-white py-24 text-center"><Loader2 className="mx-auto animate-spin text-blue-700" size={30} /><p className="mt-4 text-sm font-bold text-gray-500">正在整理课程时间</p></div>
              ) : !generated ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white py-24 text-center"><CalendarDays className="mx-auto text-gray-300" size={36} /><p className="mt-4 text-sm font-bold text-gray-700">尚未生成模拟课表</p><p className="mt-2 text-xs text-gray-400">点击右上角按钮，根据当前已选课程生成。</p></div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {DAYS.map((day) => {
                    const dayCourses = schedule.filter((item) => item.day === day);
                    return <div key={day} className="min-h-72 rounded-xl border border-gray-200 bg-white p-3"><div className="border-b border-gray-100 pb-3"><h3 className="text-sm font-black text-gray-900">{day}</h3><p className="mt-1 text-[10px] text-gray-400">{dayCourses.length} 门课程</p></div><div className="mt-3 space-y-2">{dayCourses.length ? dayCourses.map((item) => <button key={`${item.course.id}-${item.time}`} onClick={() => navigate(`/course/${item.course.id}`)} className="w-full rounded-lg border border-blue-100 bg-blue-50 p-3 text-left hover:border-blue-300"><p className="text-[10px] font-bold text-blue-700">{item.time}</p><p className="mt-1 text-xs font-black leading-5 text-gray-900">{item.course.name}</p><p className="mt-2 flex items-center gap-1 text-[10px] text-gray-500"><MapPin size={11} />{item.room}</p></button>) : <p className="py-8 text-center text-[10px] text-gray-300">暂无课程</p>}</div></div>;
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="sticky top-[96px] rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-5"><h2 className="text-sm font-black text-gray-900">当前已选课程</h2><p className="mt-1 text-xs text-gray-400">可直接移除或查看详情</p></div>
            <div className="max-h-[680px] divide-y divide-gray-100 overflow-y-auto">
              {selectedCourses.length ? selectedCourses.map((course) => <div key={course.id} className="p-4"><div className="flex items-start justify-between gap-3"><button onClick={() => navigate(`/course/${course.id}`)} className="min-w-0 text-left"><p className="truncate text-sm font-bold text-gray-900">{course.name}</p><p className="mt-1 text-xs text-gray-400">{course.teacher} · {course.credits} 学分</p></button><button onClick={() => { toggleSelectedCourse(course); setRefresh((value) => value + 1); }} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button></div></div>) : <div className="p-8 text-center text-xs text-gray-400">还没有已选课程</div>}
            </div>
          </aside>
        </div>
      </section>

      <div className="lg:hidden">
      <header className="px-5 pt-5 pb-4 bg-gray-50 lg:px-0 lg:pt-0">
        <SchoolMark compact />
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mt-4">Course Plan</p>
        <h1 className="text-2xl font-black text-gray-900 mt-1">已选课程与课表</h1>
      </header>

      <section className="px-5 lg:px-0 lg:max-w-2xl">
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

      <section className="px-5 mt-6 lg:px-0">
        <h2 className="font-black text-gray-900 text-lg mb-3">已选课程</h2>
        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {selectedCourses.length === 0 ? (
            <div className="rounded-[20px] bg-white border border-gray-100 p-6 text-center shadow-sm lg:col-span-2">
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

      <section className="px-5 mt-6 pb-28 lg:px-0 lg:pb-4">
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
            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
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
      </div>
    </PageWrapper>
  );
};
