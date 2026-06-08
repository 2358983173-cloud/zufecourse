import { CareerProfileId, careerProfiles } from "./career-profiles";

export type CareerScores = Record<CareerProfileId, number>;

export interface CareerQuizOption {
  label: string;
  scores: Partial<CareerScores>;
}

export interface CareerQuizQuestion {
  id: string;
  text: string;
  options: CareerQuizOption[];
}

export const createEmptyScores = (): CareerScores =>
  careerProfiles.reduce(
    (scores, profile) => ({ ...scores, [profile.id]: 0 }),
    {} as CareerScores
  );

export const careerQuizQuestions: CareerQuizQuestion[] = [
  {
    id: "question_focus",
    text: "你更愿意研究哪类问题？",
    options: [
      { label: "一家公司值不值得投资，股票或基金有没有机会", scores: { investment_research: 2 } },
      { label: "一笔贷款或业务有没有风险，是否应该放款", scores: { bank_risk: 2 } },
      { label: "一家企业的利润、成本和财务报表是否健康", scores: { finance_audit: 2 } },
      { label: "如何用数据、模型或工具提升金融决策效率", scores: { fintech: 2 } },
      { label: "如何根据客户需求设计资产配置方案", scores: { wealth_management: 2 } },
      { label: "一个金融理论问题背后的数学和经济学逻辑", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "learning_material",
    text: "你更喜欢哪种学习材料？",
    options: [
      { label: "行业报告、公司公告、证券研究报告", scores: { investment_research: 2 } },
      { label: "银行业务案例、信贷案例、监管政策", scores: { bank_risk: 2 } },
      { label: "财务报表、审计案例、企业经营数据", scores: { finance_audit: 2 } },
      { label: "Python、数据表、模型结果、可视化图表", scores: { fintech: 2 } },
      { label: "客户案例、理财方案、沟通场景", scores: { wealth_management: 2 } },
      { label: "教材、论文、考研真题、理论推导", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "assignment",
    text: "如果做课程作业，你更愿意做哪种？",
    options: [
      { label: "分析某个行业或上市公司的投资价值", scores: { investment_research: 2 } },
      { label: "分析银行信贷风险或金融监管案例", scores: { bank_risk: 2 } },
      { label: "做企业财务分析或预算管理报告", scores: { finance_audit: 2 } },
      { label: "用数据分析工具完成金融数据处理项目", scores: { fintech: 2 } },
      { label: "设计一份个人或家庭理财规划方案", scores: { wealth_management: 2 } },
      { label: "整理理论框架并完成高质量书面研究报告", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "course_result",
    text: "你更看重课程带来的哪种结果？",
    options: [
      { label: "能看懂投资市场和资产价格变化", scores: { investment_research: 2 } },
      { label: "能理解银行、信贷和风险控制逻辑", scores: { bank_risk: 2 } },
      { label: "能提升财务分析、会计和审计能力", scores: { finance_audit: 2 } },
      { label: "能掌握数据分析、编程或金融科技工具", scores: { fintech: 2 } },
      { label: "能提升表达、客户沟通和方案设计能力", scores: { wealth_management: 2 } },
      { label: "能帮助考研复习和理论能力提升", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "math_acceptance",
    text: "你对数学、统计、计量类内容的接受度是？",
    options: [
      { label: "可以接受，尤其愿意用于投资分析", scores: { investment_research: 1, postgraduate: 1 } },
      { label: "可以接受，尤其愿意用于风险评估", scores: { bank_risk: 1, fintech: 1 } },
      { label: "一般，更希望结合财务和案例理解", scores: { finance_audit: 1 } },
      { label: "比较喜欢，愿意学习数据建模和编程", scores: { fintech: 2 } },
      { label: "不想太重，更希望偏应用和沟通", scores: { wealth_management: 1 } },
      { label: "可以接受较高强度，愿意系统刷题和推导", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "data_tools",
    text: "你对编程和数据工具的态度是？",
    options: [
      { label: "只要能辅助投资分析，可以学一点", scores: { investment_research: 1, fintech: 1 } },
      { label: "如果能帮助风控和数据判断，可以接受", scores: { bank_risk: 1, fintech: 1 } },
      { label: "不想作为重点，更关注财务和报表", scores: { finance_audit: 2 } },
      { label: "愿意重点学习 Python、数据分析和模型方法", scores: { fintech: 2 } },
      { label: "能简单使用工具即可，不想太技术化", scores: { wealth_management: 1 } },
      { label: "如果考研或科研需要，可以系统学习", scores: { postgraduate: 1 } },
    ],
  },
  {
    id: "work_style",
    text: "你更适合哪种工作状态？",
    options: [
      { label: "独立研究信息，形成判断和结论", scores: { investment_research: 2 } },
      { label: "按规则审查材料，识别风险点", scores: { bank_risk: 2 } },
      { label: "处理细节、核对数据、保证准确性", scores: { finance_audit: 2 } },
      { label: "用工具解决问题，优化流程和效率", scores: { fintech: 2 } },
      { label: "与人沟通，理解需求并提供方案", scores: { wealth_management: 2 } },
      { label: "长时间学习、复盘和准备考试", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "course_challenge",
    text: "你最不排斥哪类课程挑战？",
    options: [
      { label: "阅读大量市场和公司资料", scores: { investment_research: 2 } },
      { label: "学习复杂业务规则和监管框架", scores: { bank_risk: 2 } },
      { label: "处理会计、报表和细节核算", scores: { finance_audit: 2 } },
      { label: "学习编程、统计和数据模型", scores: { fintech: 2 } },
      { label: "小组展示、案例汇报和表达沟通", scores: { wealth_management: 2 } },
      { label: "闭卷考试、公式推导和系统复习", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "resume_skill",
    text: "你未来更希望简历上体现哪类能力？",
    options: [
      { label: "行业研究、证券投资、资产定价能力", scores: { investment_research: 2 } },
      { label: "银行业务、信贷分析、风险管理能力", scores: { bank_risk: 2 } },
      { label: "财务分析、审计基础、报表分析能力", scores: { finance_audit: 2 } },
      { label: "Python、数据分析、金融科技项目能力", scores: { fintech: 2 } },
      { label: "客户经营、理财规划、方案表达能力", scores: { wealth_management: 2 } },
      { label: "数学基础、金融理论、考研成绩和研究能力", scores: { postgraduate: 2 } },
    ],
  },
  {
    id: "need_improve",
    text: "目前你最需要补强哪一块？",
    options: [
      { label: "证券投资、公司金融、行业分析", scores: { investment_research: 2 } },
      { label: "商业银行、金融风险管理、监管知识", scores: { bank_risk: 2 } },
      { label: "会计学、财务报告分析、企业价值评估", scores: { finance_audit: 2 } },
      { label: "Python、金融数据分析、量化方法", scores: { fintech: 2 } },
      { label: "个人理财、基金管理、客户沟通", scores: { wealth_management: 2 } },
      { label: "微积分、线性代数、概率统计、计量经济学", scores: { postgraduate: 2 } },
    ],
  },
];

export const calculateCareerScores = (answers: Record<string, string>) => {
  const scores = createEmptyScores();

  careerQuizQuestions.forEach((question) => {
    const selectedLabel = answers[question.id];
    const selected = question.options.find((option) => option.label === selectedLabel);
    if (!selected) return;

    Object.entries(selected.scores).forEach(([profileId, value]) => {
      scores[profileId as CareerProfileId] += value || 0;
    });
  });

  const ranked = careerProfiles
    .map((profile) => ({ profile, score: scores[profile.id] }))
    .sort((a, b) => b.score - a.score);

  const primaryCareerId = ranked[0].profile.id;
  const secondaryCareerId = ranked[1] && ranked[0].score - ranked[1].score <= 2 ? ranked[1].profile.id : null;

  return { scores, ranked, primaryCareerId, secondaryCareerId };
};
