import React, { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { CareerProfile, careerProfiles, selfExploreProfile } from "../career-profiles";
import { CareerResult, getCareerReport } from "../career-storage";

interface CareerReportProps {
  result: CareerResult | null;
  compact?: boolean;
  onRetake?: () => void;
}

const PillList = ({ items, tone = "blue" }: { items: string[]; tone?: "blue" | "slate" | "emerald" }) => {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  }[tone];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full border px-3 py-2 text-[11px] font-black ${toneClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
};

export const CareerCharacter = ({ profile }: { profile: CareerProfile }) => {
  const Accessory = () => {
    if (profile.characterVisual === "shield") {
      return <path d="M42 40 L64 31 L86 40 C84 66 74 82 64 88 C54 82 44 66 42 40Z" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="4" />;
    }
    if (profile.characterVisual === "calculator") {
      return <rect x="42" y="36" width="44" height="54" rx="8" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="4" />;
    }
    if (profile.characterVisual === "laptop") {
      return <path d="M36 56 H92 V86 H30 L36 56Z" fill="#e0f2fe" stroke="#1d4ed8" strokeWidth="4" />;
    }
    if (profile.characterVisual === "book") {
      return <path d="M35 42 C48 35 58 39 64 46 C70 39 80 35 93 42 V86 C80 80 70 80 64 88 C58 80 48 80 35 86Z" fill="#eef2ff" stroke="#1d4ed8" strokeWidth="4" />;
    }
    if (profile.characterVisual === "client") {
      return <rect x="36" y="42" width="56" height="38" rx="10" fill="#ecfdf5" stroke="#047857" strokeWidth="4" />;
    }
    return (
      <>
        <rect x="36" y="40" width="56" height="42" rx="10" fill="#eff6ff" stroke="#1d4ed8" strokeWidth="4" />
        <path d="M48 70 L58 60 L68 65 L80 51" fill="none" stroke="#0891b2" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  };

  return (
    <div className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Character</p>
          <h3 className="text-lg font-black text-gray-900">职业人格构造</h3>
        </div>
        <profile.icon size={24} className="text-blue-700" />
      </div>
      <div className="grid grid-cols-[130px_1fr] gap-4 items-center">
        <div className="relative h-44 rounded-[28px] bg-gradient-to-b from-blue-50 to-slate-50 flex items-center justify-center">
          <svg viewBox="0 0 128 150" className="w-32 h-40" role="img" aria-label={profile.title}>
            <circle cx="64" cy="25" r="17" fill="#dbeafe" stroke="#1e3a8a" strokeWidth="4" />
            <path d="M44 54 C50 42 78 42 84 54 V112 C74 121 54 121 44 112Z" fill="#1e3a8a" />
            <path d="M48 63 H80" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" />
            <path d="M44 69 C29 76 28 95 38 104" fill="none" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
            <path d="M84 69 C99 76 100 95 90 104" fill="none" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
            <Accessory />
            <path d="M54 119 V140 M74 119 V140" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="space-y-2">
          {profile.accentSkills.map((skill, index) => (
            <div key={skill} className={`rounded-2xl px-4 py-3 ${index < 2 ? "bg-blue-50 text-blue-800" : "bg-slate-50 text-slate-700"}`}>
              <p className="text-xs font-black">{skill}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CareerTree = ({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (profile: CareerProfile) => void;
}) => (
  <div className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
    <h3 className="text-lg font-black text-gray-900 mb-4">金融职业成长树</h3>
    <div className="relative">
      <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-blue-100" />
      {["金融基础能力", "经济学与公司金融", "统计计量与数据理解", "职业方向分流"].map((node) => (
        <div key={node} className="relative z-10 mx-auto mb-3 w-[72%] rounded-2xl bg-slate-900 px-4 py-3 text-center text-xs font-black text-white shadow-sm">
          {node}
        </div>
      ))}
      <div className="relative z-10 grid grid-cols-2 gap-3 pt-3">
        {careerProfiles.map((profile) => {
          const active = profile.id === selectedId;
          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile)}
              className={`min-h-20 rounded-[22px] border p-3 text-left transition-all ${
                active
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <profile.icon size={17} className={active ? "text-blue-700" : "text-gray-400"} />
                <span className={`text-sm font-black ${active ? "text-blue-900" : "text-gray-700"}`}>{profile.shortTitle}</span>
              </div>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-gray-400">{profile.title}</p>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export const CareerDetailCard = ({ profile }: { profile: CareerProfile }) => (
  <div className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
    <h3 className="text-lg font-black text-gray-900">{profile.title}</h3>
    <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">{profile.description}</p>

    <div className="mt-5 space-y-5">
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">推荐职业方向</p>
        <PillList items={profile.careers} />
      </div>
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">推荐课程</p>
        <PillList items={profile.courses.slice(0, 10)} tone="emerald" />
      </div>
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">核心能力</p>
        <PillList items={profile.skills} tone="slate" />
      </div>
      <div className="rounded-2xl bg-blue-50 p-4 text-xs font-bold leading-relaxed text-blue-900">
        {profile.action}
      </div>
    </div>
  </div>
);

export const CareerPathTimeline = ({ profile }: { profile: CareerProfile }) => (
  <div className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
    <h3 className="text-lg font-black text-gray-900 mb-5">课程成长路径</h3>
    <div className="space-y-3">
      {profile.coursePath.map((item, index) => (
        <div key={item} className="relative flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center">
              {index + 1}
            </div>
            {index < profile.coursePath.length - 1 && <div className="h-8 w-px bg-blue-100" />}
          </div>
          <div className="min-h-12 flex-1 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-black text-gray-800">
            {item}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CareerReport = ({ result, compact = false, onRetake }: CareerReportProps) => {
  const report = useMemo(() => getCareerReport(result), [result]);
  const defaultProfile = report.primary || selfExploreProfile;
  const [selectedProfile, setSelectedProfile] = useState<CareerProfile>(defaultProfile);

  React.useEffect(() => {
    setSelectedProfile(defaultProfile);
  }, [defaultProfile]);

  if (compact) {
    return (
      <div className="space-y-5">
        <div className="rounded-[34px] bg-white border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Course Direction</p>
              <h2 className="mt-2 text-2xl font-black text-gray-900">{report.title}</h2>
              <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{report.summary}</p>
            </div>
            <defaultProfile.icon size={30} className="text-blue-700" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-blue-50 p-3">
              <p className="text-lg font-black text-blue-700">{defaultProfile.careers.length}</p>
              <p className="text-[9px] font-black text-blue-700/60">职业</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <p className="text-lg font-black text-emerald-700">{defaultProfile.courses.length}</p>
              <p className="text-[9px] font-black text-emerald-700/60">课程</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-lg font-black text-slate-700">{defaultProfile.skills.length}</p>
              <p className="text-[9px] font-black text-slate-500">能力</p>
            </div>
          </div>
        </div>
        <CareerCharacter profile={defaultProfile} />
        <CareerTree selectedId={selectedProfile.id} onSelect={setSelectedProfile} />
        <CareerPathTimeline profile={selectedProfile} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[36px] bg-gradient-to-br ${defaultProfile.color} p-6 text-white shadow-xl shadow-blue-900/15`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/55">浙江财经大学</p>
            <p className="mt-1 text-xs font-black text-blue-100">金融学专业选课助手</p>
            <h1 className="mt-6 text-3xl font-black leading-tight">金融职业方向报告</h1>
            <p className="mt-3 text-xl font-black">{report.title}</p>
          </div>
          <div className="rounded-2xl bg-white/12 p-3">
            <defaultProfile.icon size={30} />
          </div>
        </div>
        <p className="mt-5 text-sm font-medium leading-relaxed text-white/72">{report.summary}</p>
        <div className="mt-6 space-y-3">
          {report.ranked.slice(0, 3).map(({ profile, percent }) => (
            <div key={profile.id}>
              <div className="mb-1 flex justify-between text-[11px] font-black text-white/75">
                <span>{profile.title}</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full bg-white" style={{ width: `${percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <CareerCharacter profile={selectedProfile} />

      <section className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900">推荐职业方向</h3>
          <span className="text-[10px] font-black text-blue-700">优先 3 项</span>
        </div>
        <PillList items={selectedProfile.careers.slice(0, 3)} />
      </section>

      <CareerTree selectedId={selectedProfile.id} onSelect={setSelectedProfile} />
      <CareerDetailCard profile={selectedProfile} />
      <CareerPathTimeline profile={selectedProfile} />

      {report.matchedCourses.length > 0 && (
        <section className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4">课程库匹配课程</h3>
          <div className="space-y-3">
            {report.matchedCourses.slice(0, 5).map((course) => (
              <div key={course.id} className="rounded-2xl bg-gray-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-blue-700" />
                  <p className="text-sm font-black text-gray-900">{course.name}</p>
                </div>
                <p className="mt-1 text-[11px] font-bold text-gray-400">
                  {course.credits} 学分 · {course.assessment}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[30px] bg-white border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-3">推荐行动建议</h3>
        <div className="flex gap-3 rounded-2xl bg-blue-50 p-4 text-sm font-bold leading-relaxed text-blue-900">
          <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
          {selectedProfile.action}
        </div>
      </section>

      {onRetake && (
        <button
          onClick={onRetake}
          className="w-full h-14 rounded-2xl bg-gray-900 text-white font-black flex items-center justify-center gap-2"
        >
          <RotateCcw size={17} />
          重新测评
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
};
