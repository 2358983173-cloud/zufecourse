const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.zufe-course.online";
const TOKEN_KEY = "zufecourseAuthToken";
const USER_KEY = "zufecourseAuthUser";

export interface AuthUser {
  id: number;
  studentId: string;
  nickname: string;
  role: "student" | "admin";
}

export interface CourseComment {
  id: number;
  courseId: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  userId: number;
  nickname: string;
  role: string;
  likes: number;
  liked?: boolean;
  canDelete?: boolean;
}

export const getAuthUser = (): AuthUser | null => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
  catch { return null; }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const request = async <T>(path: string, options: RequestInit = {}, authenticated = true): Promise<T> => {
  const token = localStorage.getItem(TOKEN_KEY);
  const hasBody = options.body !== undefined;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 401) clearAuth();
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "网络请求失败" }));
    throw new Error(payload.error || "网络请求失败");
  }
  if (response.status === 204) return undefined as T;
  return response.json();
};

const saveAuth = (payload: { token: string; user: AuthUser }) => {
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  return payload.user;
};

export const login = async (studentId: string, password: string) =>
  saveAuth(await request<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ studentId, password }),
  }));

export const register = async (studentId: string, nickname: string, password: string) =>
  saveAuth(await request<{ token: string; user: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ studentId, nickname, password }),
  }));

export const getComments = (courseId: string, fresh = false) =>
  request<{ comments: CourseComment[] }>(
    `/courses/${encodeURIComponent(courseId)}/comments${fresh ? `?refresh=${Date.now()}` : ""}`,
    { cache: fresh ? "no-store" : "default" },
    false
  );

export const postComment = (courseId: string, content: string, parentId?: number) =>
  request<{ id: number }>(`/courses/${encodeURIComponent(courseId)}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, parentId }),
  });

export const toggleCommentLike = (commentId: number) =>
  request<{ liked: boolean }>(`/comments/${commentId}/like`, { method: "POST" });

export const deleteComment = (commentId: number) =>
  request<void>(`/comments/${commentId}`, { method: "DELETE" });

export const reportComment = (commentId: number) =>
  request<{ reported: boolean }>(`/comments/${commentId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason: "内容不适当" }),
  });
