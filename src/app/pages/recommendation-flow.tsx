import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, BrainCircuit, ChevronRight, Compass, Sparkles } from "lucide-react";
import { careerQuizQuestions } from "../career-quiz-questions";
import { saveCareerResult } from "../career-storage";
import { getCareerReport } from "../career-storage";
import { addSelectedCourses } from "../course-state";

export const RecommendationFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const currentQuestion = careerQuizQuestions[currentStep];
  const progress = ((currentStep + 1) / careerQuizQuestions.length) * 100;

  const nextStep = () => {
    if (currentStep < careerQuizQuestions.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    setAnalyzing(true);
    setAnalysisStage(0);
    window.setTimeout(() => setAnalysisStage(1), 650);
    window.setTimeout(() => setAnalysisStage(2), 1300);
    window.setTimeout(() => {
      const result = saveCareerResult(answers);
      addSelectedCourses(getCareerReport(result).matchedCourses);
      navigate("/recommendation-result");
    }, 2050);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-5 py-6 overflow-x-hidden lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-3xl">
      <header className="flex items-center gap-4">
        <button
          onClick={() => (currentStep > 0 ? setCurrentStep((step) => step - 1) : navigate("/home"))}
          className="w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-black text-gray-400 mb-2">
            <span>金融职业方向测评</span>
            <span>{currentStep + 1} / {careerQuizQuestions.length}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-blue-700" />
          </div>
        </div>
      </header>

      <section className="mt-6 rounded-[30px] bg-gradient-to-br from-blue-950 to-blue-700 p-5 text-white shadow-xl shadow-blue-900/15 lg:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">浙江财经大学 · 金融学</p>
            <h1 className="mt-2 text-xl font-black">用 12 个问题梳理职业方向</h1>
            <p className="mt-2 text-xs font-medium leading-relaxed text-white/65">
              测评会生成职业类型、成长树和课程路径，结果仅作为选课参考。
            </p>
          </div>
          <Sparkles size={25} className="text-cyan-200 flex-shrink-0" />
        </div>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[11px] font-black"
        >
          <Compass size={14} />
          先跳过，直接浏览课程
        </button>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          className="mt-7"
        >
          <h2 className="text-2xl font-black leading-tight text-gray-900">{currentQuestion.text}</h2>
          <p className="mt-2 text-xs font-bold text-gray-400">请选择最贴近你当前想法的一项。</p>
          <div className="mt-5 space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {currentQuestion.options.map((option, index) => {
              const active = answers[currentQuestion.id] === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.label }))}
                  className={`w-full min-h-16 rounded-[22px] border p-4 text-left flex items-center gap-3 transition-all ${
                    active
                      ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100"
                      : "border-gray-100 bg-white shadow-sm"
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black ${
                    active ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={`flex-1 text-sm font-black leading-relaxed ${active ? "text-blue-900" : "text-gray-700"}`}>
                    {option.label}
                  </span>
                  <ChevronRight size={17} className={active ? "text-blue-700" : "text-gray-300"} />
                </button>
              );
            })}
          </div>
        </motion.section>
      </AnimatePresence>

      <button
        disabled={!answers[currentQuestion.id] || analyzing}
        onClick={nextStep}
        className={`mt-7 mb-4 w-full h-14 rounded-2xl font-black ${
          answers[currentQuestion.id] ? "bg-gray-900 text-white shadow-lg" : "bg-gray-200 text-gray-400"
        }`}
      >
        {currentStep === careerQuizQuestions.length - 1 ? "生成职业方向报告" : "下一题"}
      </button>
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-blue-950/45 px-5 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-md rounded-[28px] bg-white p-6 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"
              >
                <BrainCircuit size={32} />
              </motion.div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-widest text-blue-700">Career Diagnosis</p>
              <h3 className="mt-2 text-xl font-black text-gray-900">
                {["正在汇总你的课程偏好", "正在匹配金融培养方向", "正在生成课程与成长建议"][analysisStage]}
              </h3>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  animate={{ width: `${((analysisStage + 1) / 3) * 100}%` }}
                  className="h-full rounded-full bg-blue-700"
                />
              </div>
              <p className="mt-3 text-xs font-bold text-gray-400">结果用于辅助理解方向，不替代老师的专业建议。</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
