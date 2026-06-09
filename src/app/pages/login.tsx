import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Lock, User, UserPlus } from "lucide-react";
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
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col justify-center p-6 relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto">
        <SchoolMark />
        <div className="mt-5">
          <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest">ZUFE Finance</p>
          <h1 className="text-2xl font-black text-gray-900 mt-2">{mode === "login" ? "登录选课助手" : "创建学生账号"}</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">登录后可发布课程评论、点赞和回复。</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
          {(["login", "register"] as const).map((item) => (
            <button key={item} onClick={() => { setMode(item); setError(""); }} className={`h-10 rounded-lg text-xs font-black ${mode === item ? "bg-white text-blue-800 shadow-sm" : "text-gray-400"}`}>
              {item === "login" ? "登录" : "注册"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <label className="relative block">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full h-13 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm text-sm" placeholder="学号或账号" required />
          </label>
          {mode === "register" && (
            <label className="relative block">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full h-13 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm text-sm" placeholder="评论区昵称" required />
            </label>
          )}
          <label className="relative block">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-13 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm text-sm" placeholder="密码，至少 8 位" required />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600">{error}</p>}
          <button disabled={loading} className="w-full h-13 rounded-2xl bg-[#173b83] text-white font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "正在提交..." : mode === "login" ? "登录" : "注册并开始测评"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
