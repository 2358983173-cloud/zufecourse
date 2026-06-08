import { CareerProfileId, careerProfiles, getCareerProfile } from "./career-profiles";
import { CareerScores, calculateCareerScores, createEmptyScores } from "./career-quiz-questions";
import { MOCK_COURSES } from "./data";

const CAREER_RESULT_KEY = "careerDirectionResult";

export interface CareerResult {
  questionnaireAnswers: Record<string, string>;
  careerScores: CareerScores;
  primaryCareerId: CareerProfileId;
  secondaryCareerId: CareerProfileId | null;
  completedAt: string;
}

export const saveCareerResult = (answers: Record<string, string>) => {
  const result = calculateCareerScores(answers);
  const careerResult: CareerResult = {
    questionnaireAnswers: answers,
    careerScores: result.scores,
    primaryCareerId: result.primaryCareerId,
    secondaryCareerId: result.secondaryCareerId,
    completedAt: new Date().toISOString(),
  };

  localStorage.setItem(CAREER_RESULT_KEY, JSON.stringify(careerResult));
  return careerResult;
};

export const loadCareerResult = (): CareerResult | null => {
  try {
    const raw = localStorage.getItem(CAREER_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CareerResult;
  } catch {
    return null;
  }
};

export const clearCareerResult = () => {
  localStorage.removeItem(CAREER_RESULT_KEY);
};

export const getCareerReport = (result?: CareerResult | null) => {
  if (!result) {
    return {
      primary: null,
      secondary: null,
      scores: createEmptyScores(),
      ranked: careerProfiles.map((profile) => ({ profile, score: 0, percent: 0 })),
      matchedCourses: [],
      title: "自主探索型",
      summary: "你可以先浏览课程，也可以完成职业方向测评，生成更准确的课程路径。",
    };
  }

  const primary = getCareerProfile(result.primaryCareerId);
  const secondary = result.secondaryCareerId ? getCareerProfile(result.secondaryCareerId) : null;
  const maxScore = Math.max(...Object.values(result.careerScores), 1);
  const ranked = careerProfiles
    .map((profile) => ({
      profile,
      score: result.careerScores[profile.id] || 0,
      percent: Math.round(((result.careerScores[profile.id] || 0) / maxScore) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  const targetNames = new Set([...primary.courses, ...(secondary?.courses || [])]);
  const matchedCourses = MOCK_COURSES.filter((course) =>
    [...targetNames].some((name) => course.name.includes(name) || name.includes(course.name))
  ).slice(0, 8);

  return {
    primary,
    secondary,
    scores: result.careerScores,
    ranked,
    matchedCourses,
    title: secondary ? `${primary.title} + ${secondary.title}` : primary.title,
    summary: secondary
      ? `你同时表现出 ${primary.shortTitle} 与 ${secondary.shortTitle} 倾向，适合把两个方向的课程组合起来看。`
      : primary.description,
  };
};
