import { CareerProfileId, careerProfiles } from "./career-profiles";

export type CareerScores = Record<CareerProfileId, number>;
export interface CareerQuizOption { label: string; scores: Partial<CareerScores>; }
export interface CareerQuizQuestion { id: string; text: string; options: CareerQuizOption[]; }

export const createEmptyScores = (): CareerScores =>
  careerProfiles.reduce((scores, profile) => ({ ...scores, [profile.id]: 0 }), {} as CareerScores);

export const careerQuizQuestions: CareerQuizQuestion[] = [
  {
    id: "interest",
    text: "哪类内容更吸引你？",
    options: [
      { label: "市场、股票与投资", scores: { investment_research: 2, wealth_management: 1 } },
      { label: "银行业务与风险", scores: { bank_risk: 2, finance_audit: 1 } },
      { label: "财务报表与企业经营", scores: { finance_audit: 2, investment_research: 1 } },
      { label: "数据、编程与研究", scores: { fintech: 2, postgraduate: 1 } },
    ],
  },
  {
    id: "task",
    text: "你更愿意完成哪种作业？",
    options: [
      { label: "分析公司或行业", scores: { investment_research: 2 } },
      { label: "检查风险或财务数据", scores: { bank_risk: 1, finance_audit: 2 } },
      { label: "做数据分析项目", scores: { fintech: 2, postgraduate: 1 } },
      { label: "设计理财或客户方案", scores: { wealth_management: 2 } },
    ],
  },
  {
    id: "strength",
    text: "你觉得自己的优势更接近？",
    options: [
      { label: "善于分析和判断", scores: { investment_research: 2, postgraduate: 1 } },
      { label: "细心，重视规则", scores: { bank_risk: 2, finance_audit: 2 } },
      { label: "喜欢工具和数字", scores: { fintech: 2 } },
      { label: "善于沟通和表达", scores: { wealth_management: 2 } },
    ],
  },
  {
    id: "math",
    text: "你对数学和统计的感受是？",
    options: [
      { label: "比较喜欢", scores: { fintech: 2, postgraduate: 2 } },
      { label: "结合投资可以接受", scores: { investment_research: 2 } },
      { label: "结合风控或财务可以接受", scores: { bank_risk: 1, finance_audit: 1 } },
      { label: "更偏好沟通与应用", scores: { wealth_management: 2 } },
    ],
  },
  {
    id: "work",
    text: "你更喜欢哪种工作方式？",
    options: [
      { label: "独立研究并形成结论", scores: { investment_research: 2, postgraduate: 1 } },
      { label: "按规则检查和判断", scores: { bank_risk: 2, finance_audit: 1 } },
      { label: "使用工具解决问题", scores: { fintech: 2 } },
      { label: "和人沟通并提供方案", scores: { wealth_management: 2 } },
    ],
  },
  {
    id: "goal",
    text: "你目前更接近哪个目标？",
    options: [
      { label: "投资研究相关工作", scores: { investment_research: 2 } },
      { label: "银行、风控或财务工作", scores: { bank_risk: 2, finance_audit: 1 } },
      { label: "数据金融相关工作", scores: { fintech: 2 } },
      { label: "财富管理或继续深造", scores: { wealth_management: 1, postgraduate: 2 } },
    ],
  },
];

export const calculateCareerScores = (answers: Record<string, string>) => {
  const scores = createEmptyScores();
  careerQuizQuestions.forEach((question) => {
    const selected = question.options.find((option) => option.label === answers[question.id]);
    Object.entries(selected?.scores || {}).forEach(([id, value]) => {
      scores[id as CareerProfileId] += value || 0;
    });
  });
  const ranked = careerProfiles.map((profile) => ({ profile, score: scores[profile.id] })).sort((a, b) => b.score - a.score);
  return {
    scores,
    ranked,
    primaryCareerId: ranked[0].profile.id,
    secondaryCareerId: ranked[0].score - ranked[1].score <= 2 ? ranked[1].profile.id : null,
  };
};
