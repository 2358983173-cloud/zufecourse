import React from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MOCK_COURSES, SIMULATED_SCHEDULE } from "../data";
import { PageWrapper } from "../components/layout";

export const SchedulePage = () => {
  const navigate = useNavigate();

  const schedule = SIMULATED_SCHEDULE.map((item) => ({
    ...item,
    course: MOCK_COURSES.find((course) => course.id === item.courseId) || MOCK_COURSES[0],
  }));

  return (
    <PageWrapper>
      <header className="px-5 pt-5 pb-4 bg-gray-50">
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">模拟排课</p>
        <h1 className="text-2xl font-black text-gray-900 mt-1">我的课表</h1>
        <p className="text-sm text-gray-400 font-medium mt-2">根据当前课程路径生成的示例周课表。</p>
      </header>

      <section className="px-5">
        <div className="rounded-[24px] bg-gray-900 text-white p-5 shadow-xl shadow-gray-200">
          <CalendarDays size={28} className="text-blue-300 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">This Week</p>
          <h2 className="text-2xl font-black mt-2">{schedule.length} 门课已排入模拟课表</h2>
          <p className="text-sm text-white/50 mt-3 leading-relaxed">后续可继续根据已选课程生成多套方案。</p>
        </div>
      </section>

      <section className="px-5 mt-6 pb-24">
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <motion.button
              key={`${item.day}-${item.time}`}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/course/${item.course.id}`)}
              className="w-full bg-white rounded-[20px] border border-gray-100 p-4 shadow-sm text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 flex-shrink-0 text-center">
                  <div className="text-sm font-black text-gray-900">{item.day}</div>
                  <div className="text-[10px] font-black text-gray-300 mt-1">#{index + 1}</div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-black text-gray-900 truncate">{item.course.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600">
                      <Clock size={12} />
                      {item.time}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-[10px] font-black text-gray-500">
                      <MapPin size={12} />
                      {item.room}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};
