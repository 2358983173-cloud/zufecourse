import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ChevronRight, Compass, Sparkles } from "lucide-react";
import { MOCK_COURSES, state } from "../data";

const QUESTIONS = [
  {
    text: "你现在最想靠课程补强哪类能力？",
    key: "direction",
    options: ["金融投资判断", "财务与审计", "数据分析能力", "法律税务意识", "商业管理实践", "编程与工具"],
  },
  {
    text: "你更接近哪种未来目标？",
    key: "goal",
    options: ["金融行业就业", "数据分析就业", "财会审计就业", "考研深造", "考公考编", "创业或商业实践"],
  },
  {
    text: "你能接受的课程强度是？",
    key: "difficulty",
    options: ["轻松通过", "中等难度", "有挑战但收获大"],
  },
  {
    text: "你更偏好的考核方式是？",
    key: "assessment",
    options: ["闭卷考试", "论文报告", "小组展示", "项目实践", "平时成绩占比高"],
  },
  {
    text: "你希望课程带给你什么结果？",
    key: "outcome",
    options: ["提升专业成绩", "增强就业竞争力", "帮助考研复习", "拓展知识面", "学到实用技能"],
  },
  {
    text: "你目前最需要补哪类基础？",
    key: "foundation",
    options: ["编程基础", "线代基础", "会计基础", "金工基础", "英语基础", "计量统计基础"],
  },
  {
    text: "你更想避开什么课程风险？",
    key: "avoid",
    options: ["过难", "闭卷压力", "小组负担", "编程要求", "论文写作", "课堂互动太多"],
  },
];

const getProfile = (answers: Record<string, string>) => {
  const goal = answers.goal || "";
  const direction = answers.direction || "";

  if (goal.includes("数据") || direction.includes("数据") || direction.includes("编程")) {
    return {
      archetype: "数据策略型",
      tagline: "像分析师一样做选择",
      summary: "你适合把数据能力、商业理解和金融场景结合起来，形成可迁移的分析竞争力。",
      strengths: ["数据敏感", "工具导向", "适合项目制学习"],
      categoryHints: ["银行管理方向", "专业核心必修课", "学科基础必修课"],
    };
  }

  if (goal.includes("财会") || direction.includes("财务")) {
    return {
      archetype: "财会稳健型",
      tagline: "重视确定性与专业资质",
      summary: "你适合沿着会计、审计、税务和财务管理建立硬技能组合，路径稳定且目标清晰。",
      strengths: ["规则意识强", "适合证书路线", "基础越扎实越有优势"],
      categoryHints: ["学科基础必修课", "专业核心必修课", "银行管理方向"],
    };
  }

  if (goal.includes("考研") || goal.includes("考公")) {
    return {
      archetype: "深造规划型",
      tagline: "用课程服务长期目标",
      summary: "你适合选择理论框架清晰、考试友好、能补足基础学科能力的课程。",
      strengths: ["目标感强", "适合系统复盘", "偏好稳定节奏"],
      categoryHints: ["学科基础必修课", "通识教育必修课", "专业核心必修课"],
    };
  }

  return {
    archetype: "金融实践型",
    tagline: "把兴趣落到真实业务",
    summary: "你适合围绕金融市场、商业案例和管理实践建立课程组合，逐步明确职业方向。",
    strengths: ["商业意识强", "适合案例学习", "关注就业应用"],
    categoryHints: ["专业核心必修课", "银行管理方向", "学科基础必修课"],
  };
};

const buildCareerTree = (answers: Record<string, string>) => {
  const profile = getProfile(answers);
  const answerText = Object.values(answers).join(" ");
  const priorityTags = [
    answers.foundation,
    answerText.includes("编程") ? "编程基础" : "",
    answerText.includes("实用") || answerText.includes("就业") ? "实操" : "",
    answerText.includes("成绩") ? "高绩点" : "",
    answerText.includes("考研") ? "理论" : "",
  ].filter(Boolean);

  const avoidTags = [
    answers.avoid?.includes("过难") ? "难" : "",
    answers.avoid?.includes("闭卷") ? "闭卷" : "",
    answers.avoid?.includes("小组") ? "小组报告" : "",
    answers.avoid?.includes("编程") ? "编程基础" : "",
    answers.avoid?.includes("论文") ? "论文" : "",
  ].filter(Boolean);

  const scored = MOCK_COURSES.map((course) => {
    let score = 0;
    if (profile.categoryHints.includes(course.category)) score += 36;
    for (const tag of priorityTags) {
      if (course.tags.includes(tag)) score += 18;
    }
    for (const tag of avoidTags) {
      if (course.tags.includes(tag)) score -= 14;
    }
    if (answers.difficulty === "轻松通过" && course.difficulty === "轻松") score += 12;
    if (answers.difficulty === "有挑战但收获大" && course.difficulty === "挑战") score += 10;
    score += Math.min(course.students / 260, 12);
    return { course, score };
  });

  const selected = scored
    .sort((a, b) => b.score - a.score)
    .map((item) => item.course)
    .slice(0, 8);

  selected.forEach((course) => state.alternateCourseIds.add(course.id));

  return {
    ...profile,
    answers,
    careerTree: [
      {
        title: "先把基础补稳",
        description: "优先选择能补足短板的课程，后面学专业课会轻松一些。",
        courses: selected.slice(0, 2).map((course) => course.name),
      },
      {
        title: "再确定主攻方向",
        description: "围绕就业或深造目标，选几门能形成方向感的课程。",
        courses: selected.slice(2, 5).map((course) => course.name),
      },
      {
        title: "最后做职业试探",
        description: "通过实践或方向课看看自己是否真的适合这条路。",
        courses: selected.slice(5, 8).map((course) => course.name),
      },
    ],
  };
};

export const RecommendationFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const handleSelect = (option: string) => {
    setAnswers((current) => ({ ...current, [currentQuestion.key]: option }));
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }

    const finalAnswers = { ...answers };
    const profile = buildCareerTree(finalAnswers);
    state.recommendationProfile = profile;
    navigate("/recommendation-result", { state: { profile } });
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const skipQuestionnaire = () => {
    state.recommendationProfile = {
      archetype: "自主探索型",
      tagline: "先看课程，再慢慢确定方向",
      summary: "你选择先跳过问卷。可以直接浏览课程库，把感兴趣的课加入备选，之后再回来重新测评。",
      answers: {},
      strengths: ["自主筛选", "先看课程", "后续可重测"],
      careerTree: [
        {
          title: "先浏览课程",
          description: "从课程库里查看不同方向的课程，先建立整体印象。",
          courses: [],
        },
        {
          title: "再加入备选",
          description: "把感兴趣的课程加入备选，看看学分和课程组合是否合适。",
          courses: [],
        },
        {
          title: "需要时再测评",
          description: "如果方向不清楚，可以回到问卷重新生成课程建议。",
          courses: [],
        },
      ],
    };
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <header className="flex justify-between items-center mb-8">
        <button onClick={prevStep} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-grow mx-4">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-gray-900 rounded-full" />
          </div>
        </div>
        <span className="text-xs font-bold text-gray-400 w-8 text-right">{currentStep + 1}/{QUESTIONS.length}</span>
      </header>

      <div className="mb-8 rounded-[28px] bg-white border border-gray-100 p-5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">方向问卷</p>
        <h1 className="text-xl font-black text-gray-900 mt-1">用 7 个问题整理选课方向</h1>
        <button
          onClick={skipQuestionnaire}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700"
        >
          <Compass size={14} />
          先跳过，直接浏览课程
        </button>
      </div>

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{currentQuestion.text}</h2>
            <p className="text-sm text-gray-400 mb-8">选择最贴近你当前状态的一项。</p>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full p-4 rounded-2xl text-left font-bold transition-all flex justify-between items-center ${
                    answers[currentQuestion.key] === option
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm"
                  }`}
                >
                  <span>{option}</span>
                  <ChevronRight size={18} className={answers[currentQuestion.key] === option ? "opacity-100" : "opacity-30"} />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="pt-8">
        <button
          disabled={!answers[currentQuestion.key]}
          onClick={nextStep}
          className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${
            answers[currentQuestion.key]
              ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {currentStep === QUESTIONS.length - 1 ? (
            <>
              <Sparkles size={18} />
              生成课程路径
            </>
          ) : (
            "下一题"
          )}
        </button>
      </footer>
    </div>
  );
};
