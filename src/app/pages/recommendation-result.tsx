import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { CareerReport } from "../components/career-report";
import { clearCareerResult, loadCareerResult } from "../career-storage";

export const RecommendationResult = () => {
  const navigate = useNavigate();
  const result = loadCareerResult();

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] p-6 flex flex-col justify-center">
        <div className="rounded-[32px] bg-white border border-gray-100 p-6 text-center shadow-sm">
          <h1 className="text-2xl font-black text-gray-900">还没有职业方向报告</h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">完成 10 题测评后，会在这里生成职业类型、职业树和课程路径。</p>
          <button onClick={() => navigate("/recommendation")} className="mt-6 w-full h-14 rounded-2xl bg-blue-800 text-white font-black">
            开始职业方向测评
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-5 pt-5 pb-28 overflow-x-hidden lg:mx-auto lg:max-w-5xl lg:px-0 lg:pb-8">
      <button
        onClick={() => navigate("/profile")}
        className="mb-5 w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-700"
      >
        <ArrowLeft size={20} />
      </button>
      <CareerReport
        result={result}
        onRetake={() => {
          clearCareerResult();
          navigate("/recommendation");
        }}
      />
    </div>
  );
};
