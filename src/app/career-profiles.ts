import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Landmark,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";

export type CareerProfileId =
  | "investment_research"
  | "bank_risk"
  | "finance_audit"
  | "fintech"
  | "wealth_management"
  | "postgraduate";

export interface CareerProfile {
  id: CareerProfileId;
  title: string;
  shortTitle: string;
  description: string;
  careers: string[];
  courses: string[];
  skills: string[];
  coursePath: string[];
  action: string;
  characterVisual: string;
  color: string;
  icon: typeof LineChart;
  accentSkills: string[];
  image: string;
}

import investmentImage from "../assets/career-investment.webp";
import riskImage from "../assets/career-risk.webp";
import auditImage from "../assets/career-audit.webp";
import fintechImage from "../assets/career-fintech.webp";
import wealthImage from "../assets/career-wealth.webp";
import postgraduateImage from "../assets/career-postgraduate.webp";

export const careerProfiles: CareerProfile[] = [
  {
    id: "investment_research",
    title: "投研分析型",
    shortTitle: "投研",
    description:
      "适合对市场、行业、公司价值和资产价格变化感兴趣的学生。更适合选择投资分析、公司金融、证券投资和财务分析相关课程。",
    careers: ["证券分析师助理", "行业研究员", "基金研究助理", "投资顾问", "资产管理助理", "量化投研助理"],
    courses: ["公司金融", "证券投资学", "金融市场学（双语）", "固定收益证券", "风险投资与私募股权", "量化投资方法与应用", "投资银行学", "财务分析", "证券分析与操作实务"],
    skills: ["行业研究能力", "财务报表分析能力", "投资判断能力", "信息整理与表达能力", "估值建模能力"],
    coursePath: ["金融学", "公司金融", "证券投资学", "财务分析", "固定收益证券", "证券分析与操作实务 / 投资银行学"],
    action: "优先选择投资分析、公司金融和资产定价相关课程，积累行业研究和投资分析作品。",
    characterVisual: "report",
    color: "from-blue-900 to-cyan-700",
    icon: LineChart,
    accentSkills: ["分析力", "数字敏感度", "表达能力", "市场判断"],
    image: investmentImage,
  },
  {
    id: "bank_risk",
    title: "银行风控型",
    shortTitle: "风控",
    description:
      "适合关注金融机构运作、信贷业务、风险识别和监管规则的学生。更适合选择商业银行、金融风险管理、信贷管理和金融监管相关课程。",
    careers: ["银行客户经理", "信贷分析员", "风控专员", "合规专员", "银行业务运营岗", "金融监管相关岗位"],
    courses: ["商业银行业务与经营", "金融风险管理", "银行实务", "信用评级", "金融监管", "中央银行学", "供应链金融", "金融会计", "固定收益证券"],
    skills: ["风险识别能力", "信贷分析能力", "合规意识", "金融业务理解能力", "材料审核与判断能力"],
    coursePath: ["金融学", "商业银行业务与经营", "银行实务", "信用评级", "金融风险管理", "金融监管"],
    action: "优先选择银行业务、信贷管理、风险控制和监管类课程，适合银行、信贷、风控方向。",
    characterVisual: "shield",
    color: "from-slate-900 to-blue-700",
    icon: ShieldCheck,
    accentSkills: ["风险意识", "分析力", "规则理解", "材料判断"],
    image: riskImage,
  },
  {
    id: "finance_audit",
    title: "财务审计型",
    shortTitle: "财审",
    description:
      "适合对企业经营、财务报表、成本利润和公司价值判断感兴趣的学生。更适合选择会计、财务报告分析、公司金融和企业价值评估相关课程。",
    careers: ["财务分析助理", "审计助理", "会计专员", "预算管理助理", "企业投融资助理", "企业估值分析助理"],
    courses: ["基础会计", "金融会计", "财务分析", "公司金融", "公司金融方法及应用", "兼并、收购与重组", "ERP模拟演练", "生活中的会计学", "漫谈审计"],
    skills: ["财务报表分析能力", "会计基础能力", "成本与预算意识", "企业经营理解能力", "数据准确性和细节处理能力"],
    coursePath: ["基础会计", "公司金融", "金融会计", "财务分析", "公司金融方法及应用", "兼并、收购与重组"],
    action: "优先选择财务分析、会计、企业估值和公司治理类课程，适合企业财务、审计和财务分析方向。",
    characterVisual: "calculator",
    color: "from-indigo-900 to-sky-700",
    icon: Calculator,
    accentSkills: ["数字敏感度", "细节能力", "财务分析", "规则意识"],
    image: auditImage,
  },
  {
    id: "fintech",
    title: "金融科技型",
    shortTitle: "金科",
    description:
      "适合对数据分析、编程工具、金融科技和模型应用感兴趣的学生。更适合选择 Python、金融数据分析、金融科技、量化投资和人工智能金融应用相关课程。",
    careers: ["金融数据分析师", "金融科技产品助理", "风控建模助理", "量化分析助理", "数据运营分析师", "智能投顾运营岗"],
    courses: ["Python程序设计", "统计学", "计量经济学", "金融计量分析与应用", "数字金融", "数据库原理及应用", "金融数据挖掘", "量化投资方法与应用", "金融时间序列分析", "Python与计算思维", "区块链与经济社会", "智能时代"],
    skills: ["Python 与数据处理能力", "统计与计量基础", "金融业务理解能力", "模型应用能力", "产品与工具思维"],
    coursePath: ["Python程序设计", "统计学", "计量经济学", "金融计量分析与应用", "金融数据挖掘", "量化投资方法与应用 / 金融时间序列分析"],
    action: "优先选择数据、编程、计量和金融科技类课程，适合金融数据分析、量化、风控建模和金融产品方向。",
    characterVisual: "laptop",
    color: "from-blue-950 to-teal-700",
    icon: BarChart3,
    accentSkills: ["数据能力", "工具能力", "模型意识", "业务理解"],
    image: fintechImage,
  },
  {
    id: "wealth_management",
    title: "财富管理型",
    shortTitle: "财富",
    description:
      "适合对客户需求、资产配置、理财规划和沟通表达感兴趣的学生。更适合选择个人理财、基金管理、保险、信托和金融市场相关课程。",
    careers: ["理财顾问", "财富管理顾问", "私人银行助理", "基金销售顾问", "保险规划顾问", "客户经理"],
    courses: ["金融营销", "信托与租赁", "保险学原理", "金融市场学（双语）", "公司金融", "证券投资学", "商业银行业务与经营", "国际结算（双语）", "规划属于你的财务报表"],
    skills: ["客户沟通能力", "资产配置理解能力", "理财方案设计能力", "产品理解能力", "表达与信任建立能力"],
    coursePath: ["金融学", "金融市场学（双语）", "证券投资学", "保险学原理", "金融营销", "信托与租赁 / 商业银行业务与经营"],
    action: "优先选择理财、基金、保险、信托和客户方案类课程，适合理财顾问、财富管理和客户经理方向。",
    characterVisual: "client",
    color: "from-sky-900 to-emerald-700",
    icon: Users,
    accentSkills: ["沟通力", "方案能力", "产品理解", "客户意识"],
    image: wealthImage,
  },
  {
    id: "postgraduate",
    title: "考研深造型",
    shortTitle: "深造",
    description:
      "适合希望继续提升学历、强化理论基础、准备考研或进入研究型岗位的学生。更适合选择数学、计量经济学、金融理论、经济学和研究方法相关课程。",
    careers: ["金融学硕士研究生", "金融专硕研究生", "高校科研助理", "政策研究助理", "金融机构研究岗", "继续攻读博士方向"],
    courses: ["高等数学（1）", "高等数学（2）", "线性代数", "概率论与数理统计", "微观经济学", "宏观经济学", "计量经济学", "统计学", "金融学", "公司金融", "中级计量经济学"],
    skills: ["数学基础", "经济学理论理解能力", "计量与统计能力", "英语阅读能力", "长期复习与自律能力"],
    coursePath: ["高等数学（1）/ 高等数学（2）", "线性代数", "概率论与数理统计", "微观经济学 / 宏观经济学", "计量经济学", "金融学 / 公司金融 / 中级计量经济学"],
    action: "优先选择数学、计量、经济学和金融理论课程，形成适合考研复习的课程组合。",
    characterVisual: "book",
    color: "from-slate-900 to-indigo-700",
    icon: BookOpen,
    accentSkills: ["理论能力", "自律能力", "数学基础", "研究意识"],
    image: postgraduateImage,
  },
];

export const selfExploreProfile: CareerProfile = {
  id: "investment_research",
  title: "自主探索型",
  shortTitle: "探索",
  description: "你可以先浏览课程，也可以完成职业方向测评，生成更准确的课程路径。",
  careers: ["先浏览课程", "加入已选", "完成测评"],
  courses: ["金融学基础", "公司金融", "统计学"],
  skills: ["自主筛选", "课程比较", "方向探索"],
  coursePath: ["浏览课程库", "加入已选课程", "生成模拟课表", "完成职业方向测评"],
  action: "建议先完成职业方向测评，再结合已选课程和学分目标调整选课组合。",
  characterVisual: "client",
  color: "from-slate-900 to-blue-700",
  icon: BriefcaseBusiness,
  accentSkills: ["自主规划", "课程比较", "目标确认", "逐步调整"],
  image: investmentImage,
};

export const getCareerProfile = (id?: CareerProfileId | string | null) =>
  careerProfiles.find((profile) => profile.id === id) || careerProfiles[0];
