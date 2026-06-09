import { Course, MOCK_COURSES, state } from "./data";

export const CREDIT_TARGET = 22;
export const COURSE_STATE_EVENT = "course-state-change";
const keys = { selected: "selectedCourses", favorite: "favoriteCourses", target: "creditTarget" };
const storage = () => typeof window !== "undefined" ? window.localStorage : null;
const read = (key: string) => {
  try { return new Set<string>(JSON.parse(storage()?.getItem(key) || "[]").map(String)); }
  catch { return new Set<string>(); }
};
const write = (key: string, ids: Set<string>) => storage()?.setItem(key, JSON.stringify([...ids]));
const emit = () => window.dispatchEvent(new Event(COURSE_STATE_EVENT));

export const initializeCourseState = () => {
  state.completedCourseIds = read(keys.selected);
};
export const getFavoriteCourseIds = () => read(keys.favorite);
export const getSelectedCourseIds = () => read(keys.selected);
export const getCreditTarget = () => Number(storage()?.getItem(keys.target)) || CREDIT_TARGET;
export const getCoursesByIds = (ids: Set<string>) => MOCK_COURSES.filter((course) => ids.has(course.id));
export const getSelectedCourses = () => getCoursesByIds(getSelectedCourseIds());
export const getFavoriteCourses = () => getCoursesByIds(getFavoriteCourseIds());
export const getCourseStats = () => {
  const selected = getSelectedCourses();
  const target = getCreditTarget();
  const selectedCredits = selected.reduce((sum, course) => sum + course.credits, 0);
  return {
    selectedCount: selected.length,
    favoriteCount: getFavoriteCourses().length,
    selectedCredits,
    targetCredits: target,
    remainingCredits: Math.max(target - selectedCredits, 0),
    exceededCredits: Math.max(selectedCredits - target, 0),
  };
};
export const isSelectedCourse = (id: string) => getSelectedCourseIds().has(id);
export const isFavoriteCourse = (id: string) => getFavoriteCourseIds().has(id);
export const toggleSelectedCourse = (course: Course) => {
  const ids = getSelectedCourseIds(); ids.has(course.id) ? ids.delete(course.id) : ids.add(course.id);
  state.completedCourseIds = new Set(ids); write(keys.selected, ids); emit();
};
export const addSelectedCourses = (courses: Course[]) => {
  const ids = getSelectedCourseIds();
  courses.forEach((course) => ids.add(course.id));
  state.completedCourseIds = new Set(ids);
  write(keys.selected, ids);
  emit();
};
export const toggleFavoriteCourse = (course: Course) => {
  const ids = getFavoriteCourseIds(); ids.has(course.id) ? ids.delete(course.id) : ids.add(course.id);
  write(keys.favorite, ids); emit();
};
