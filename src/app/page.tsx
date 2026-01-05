"use client";

import { useState } from "react";
import { LoanInputForm } from "@/components/LoanInputForm";
import { ScheduleTable } from "@/components/ScheduleTable";
import { calculateEqualPrincipalAndInterest, LoanInput, LoanSummary } from "@/lib/calculators";

export default function Home() {
  const [summary, setSummary] = useState<LoanSummary | null>(null);

  const handleCalculate = (data: LoanInput) => {
    const result = calculateEqualPrincipalAndInterest(data);
    setSummary(result);
  };

  return (
    <main className="min-h-screen bg-[#F0FDF8] dark:bg-[#022c22] selection:bg-teal-500/30">
      <div className="max-w-[1400px] mx-auto p-6 md:p-12 lg:p-20">

        <header className="mb-16 md:mb-24 fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-800 dark:text-emerald-50 mb-4">
            woojin Capital
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-normal tracking-tight max-w-2xl">
            가장 합리적인 자동차 금융 계획을 세워보세요.<br />
            투명한 견적과 스마트한 상환 스케줄을 제공합니다.
          </p>
        </header>

        <div className="flex flex-col gap-12 w-full">
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <LoanInputForm onCalculate={handleCalculate} />

            <div className="text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                * 본 시뮬레이션 결과는 고객님의 입력을 바탕으로 한 단순 참고용입니다.<br />
                * 실제 대출 실행 시점의 금리 및 금융사 정책에 따라 비용은 달라질 수 있습니다.<br />
                * 원리금균등분할상환 방식을 기준으로 계산됩니다.
              </p>
            </div>
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="border-t border-black/5 dark:border-white/5 my-8"></div>
            <ScheduleTable summary={summary} />
          </div>
        </div>
      </div>
    </main>
  );
}
