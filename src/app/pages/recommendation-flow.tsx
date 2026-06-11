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
  const answeredCount = Object.keys(answers).length;

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
    <div className="min-h-screen overflow-x-hidden bg-[#f4f6f9] px-5 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-6xl">
      <header className="flex items-center gap-4 border-b border-gray-200 pb-5">
        <button
          onClick={() => (currentStep > 0 ? setCurrentStep((step) => step - 1) : navigate("/home"))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="mb-2 flex justify-between text-xs font-bold text-gray-500">
            <span>金融职业方向测评 · 约 3 分钟</span>
            <span>{currentStep + 1} / {careerQuizQuestions.length}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-blue-700" />
          </div>
        </div>
      </header>

      <div className="mt-7 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <aside className="mb-6 border-b border-gray-200 pb-6 lg:sticky lg:top-8 lg:mb-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="flex items-start justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Career Direction</p>
              <h1 className="mt-3 text-2xl font-black leading-tight text-gray-950">梳理你的金融职业方向</h1>
              <p className="mt-3 text-sm leading-6 text-gray-500">根据学习偏好和职业场景，生成方向画像与课程建议。</p>
            </div>
            <Sparkles size={24} className="flex-shrink-0 text-blue-700 lg:mt-6" />
          </div>
          <div className="mt-6 hidden space-y-4 lg:block">
            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500">已完成</span>
                <span className="text-gray-900">{answeredCount} / {careerQuizQuestions.length}</span>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-1.5">
                {careerQuizQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => answers[question.id] && setCurrentStep(index)}
                    disabled={!answers[question.id] && index !== currentStep}
                    className={`h-2 rounded-full ${index === currentStep ? "bg-blue-700" : answers[question.id] ? "bg-emerald-500" : "bg-gray-200"}`}
                    title={`第 ${index + 1} 题`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs leading-5 text-gray-400">测评结果用于辅助理解专业方向，不替代培养方案和老师建议。</p>
            <button onClick={() => navigate("/home")} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-blue-700">
              <Compass size={14} />
              暂时跳过，浏览课程
            </button>
          </div>
        </aside>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          className="min-w-0 lg:pt-2"
        >
          <p className="text-xs font-bold text-blue-700">第 {currentStep + 1} 题</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-gray-950 lg:text-3xl">{currentQuestion.text}</h2>
          <p className="mt-2 text-sm text-gray-500">没有标准答案，选择最贴近你当前想法的一项。</p>
          <div className="mt-7 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {currentQuestion.options.map((option, index) => {
              const active = answers[currentQuestion.id] === option.label;
              return (
                <button
                  key={option.label}
                  onClick={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.label }))}
                  className={`flex min-h-20 w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                    active
                      ? "border-blue-700 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                    active ? "bg-blue-700 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={`flex-1 text-sm font-bold leading-relaxed ${active ? "text-blue-950" : "text-gray-700"}`}>
                    {option.label}
                  </span>
                  <ChevronRight size={17} className={active ? "text-blue-700" : "text-gray-300"} />
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
            <button onClick={() => navigate("/home")} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 lg:hidden">
              <Compass size={14} />跳过测评
            </button>
            <button
              disabled={!answers[currentQuestion.id] || analyzing}
              onClick={nextStep}
              className={`ml-auto flex h-11 min-w-32 items-center justify-center rounded-lg px-5 text-sm font-bold ${
                answers[currentQuestion.id] ? "bg-[#173b83] text-white hover:bg-[#102d60]" : "bg-gray-200 text-gray-400"
              }`}
            >
              {currentStep === careerQuizQuestions.length - 1 ? "生成方向报告" : "下一题"}
            </button>
          </div>
        </motion.section>
      </AnimatePresence>
      </div>
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
