import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowDown, BookOpen, GitBranch, LogOut, RefreshCcw, Sparkles, User } from "lucide-react";
import { MOCK_COURSES, state } from "../data";
import { PageWrapper, SchoolMark } from "../components/layout";

const fallbackProfile = {
  archetype: "等待生成",
  tagline: "完成问卷后生成你的方向建议",
  summary: "你还没有完成选课问卷。完成后，这里会整理你的方向建议、备选课程和阶段计划。",
  strengths: ["方向参考", "课程组合", "阶段计划"],
  careerTree: [
    { title: "完成问卷", description: "先回答几个问题，系统会整理一份选课建议。", courses: [] },
  ],
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const profile = state.recommendationProfile || fallbackProfile;
  const expandedStrengths = [
    ...profile.strengths,
    "方向更清楚",
    "课程组合可调整",
    "适合逐步推进",
  ].slice(0, 6);

  const handleLogout = () => {
    state.isLoggedIn = false;
    state.recommendationProfile = null;
    navigate("/");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-24">
        <section className="px-6 pt-10">
          <div className="mb-5">
            <SchoolMark compact />
          </div>
          <div className="rounded-[40px] bg-gray-900 text-white p-8 relative overflow-hidden shadow-xl shadow-gray-200">
            <div className="absolute right-[-48px] top-[-56px] w-48 h-48 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="flex items-center gap-4 relative">
              <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black">{state.user.name}</h1>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">
                  {state.user.grade} · {state.user.major}
                </p>
              </div>
            </div>

            <div className="relative mt-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Course Direction</p>
              <h2 className="text-4xl font-black mt-2 leading-tight">{profile.archetype}</h2>
              <p className="text-blue-100 font-bold mt-3">{profile.tagline}</p>
              <p className="text-sm leading-relaxed text-white/60 mt-5">{profile.summary}</p>
            </div>
          </div>
        </section>

        <section className="px-6 mt-6">
          <div className="grid grid-cols-3 gap-3">
            {expandedStrengths.map((item) => (
              <div key={item} className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm min-h-24">
                <Sparkles size={18} className="text-blue-600 mb-3" />
                <p className="text-xs font-black text-gray-800 leading-tight">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
              <GitBranch size={20} className="text-emerald-600" />
              阶段规划
            </h2>
            <button
              onClick={() => navigate("/recommendation")}
              className="text-[11px] font-black text-blue-600 flex items-center gap-1"
            >
              重新测评
              <RefreshCcw size={13} />
            </button>
          </div>

          <div className="space-y-4">
            {profile.careerTree.map((node, index) => (
              <React.Fragment key={node.title}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative bg-white rounded-[32px] border border-gray-100 p-5 shadow-sm"
                >
                  <div className="absolute left-6 top-5 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black">
                    {index + 1}
                  </div>
                  <div className="pl-12">
                    <h3 className="font-black text-gray-900">{node.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-400 font-medium mt-2">{node.description}</p>
                    {node.courses.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {node.courses.map((courseName) => (
                          <div key={courseName} className="rounded-2xl bg-gray-50 px-4 py-3 text-xs font-black text-gray-700 flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-600" />
                            {courseName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                {index < profile.careerTree.length - 1 && (
                  <div className="flex justify-center -my-1">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300">
                      <ArrowDown size={18} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="px-6 mt-8">
          <button
            onClick={handleLogout}
            className="w-full h-14 bg-red-50 text-red-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-red-100"
          >
            <LogOut size={18} />
            退出当前账号
          </button>
        </section>
      </div>
    </PageWrapper>
  );
};
