import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, BookOpenCheck, Lock, MessageSquareText, ShieldCheck, User, UserPlus } from "lucide-react";
import { SchoolMark } from "../components/layout";
import { state } from "../data";
import { login, register } from "../api";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [studentId, setStudentId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = mode === "login"
        ? await login(studentId, password)
        : await register(studentId, nickname, password);
      state.isLoggedIn = true;
      state.user.name = user.nickname;
      navigate(mode === "register" ? "/recommendation" : "/home");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-4 lg:flex lg:items-center lg:justify-center lg:p-8">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden bg-white shadow-xl shadow-slate-900/5 lg:min-h-[680px] lg:grid-cols-[1.08fr_0.92fr] lg:rounded-2xl"
      >
        <section className="hidden bg-[#12366d] p-12 text-white lg:flex lg:flex-col">
          <div className="w-fit rounded-xl bg-white px-3 py-2">
            <SchoolMark compact />
          </div>
          <div className="my-auto max-w-lg">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">ZUFE Finance Course</p>
            <h1 className="mt-5 text-4xl font-black leading-tight">把选课、职业方向和课程经验放在一起。</h1>
            <p className="mt-5 text-base leading-7 text-blue-100/80">
              面向金融专业学生的课程辅助工具。先了解自己的方向，再查看课程、安排学分并参考同学反馈。
            </p>
            <div className="mt-10 grid gap-5">
              {[
                [BookOpenCheck, "课程信息集中查看", "按类别、热度与方向筛选课程"],
                [ShieldCheck, "职业方向辅助判断", "问卷结果用于辅助选课，不替代培养方案"],
                [MessageSquareText, "真实课程经验", "登录后参与课程评论与回复"],
              ].map(([Icon, title, detail]) => {
                const FeatureIcon = Icon as typeof BookOpenCheck;
                return (
                  <div key={title as string} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <FeatureIcon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{title as string}</p>
                      <p className="mt-1 text-xs text-blue-100/65">{detail as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-blue-100/45">浙江财经大学金融学专业课程辅助项目</p>
        </section>

        <section className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="lg:hidden"><SchoolMark /></div>
            <div className="mt-8 lg:mt-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Student Access</p>
              <h2 className="mt-3 text-3xl font-black text-gray-950">{mode === "login" ? "欢迎回来" : "创建学生账号"}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {mode === "login" ? "登录后继续查看你的课程与职业方向。" : "注册后先完成方向问卷，再生成课程建议。"}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 border-b border-gray-200">
              {(["login", "register"] as const).map((item) => (
                <button key={item} onClick={() => { setMode(item); setError(""); }} className={`relative h-11 text-sm font-bold ${mode === item ? "text-blue-800" : "text-gray-400"}`}>
                  {item === "login" ? "账号登录" : "新生注册"}
                  {mode === item && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-800" />}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-gray-700">学号或账号</span>
                <span className="relative block">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-50" placeholder="请输入学号或账号" required />
                </span>
              </label>
              {mode === "register" && (
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-gray-700">评论区昵称</span>
                  <span className="relative block">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-50" placeholder="请输入昵称" required />
                  </span>
                </label>
              )}
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-gray-700">密码</span>
                <span className="relative block">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-50" placeholder="至少 8 位密码" required />
                </span>
              </label>
              {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-xs font-bold text-red-600">{error}</p>}
              <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#173b83] text-sm font-bold text-white transition hover:bg-[#102d60] disabled:opacity-50">
                {loading ? "正在提交..." : mode === "login" ? "登录并进入系统" : "注册并开始测评"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>
          </div>
        </section>
      </motion.main>
    </div>
  );
};
