"use client";

import { useState, useEffect } from "react";
import { LoanInputForm } from "@/components/LoanInputForm";
import { ScheduleTable } from "@/components/ScheduleTable";
import { ScheduleList } from "@/components/ScheduleList";
import { calculateEqualPrincipalAndInterest, LoanInput, LoanSummary } from "@/lib/calculators";
import { LoanSchedule } from "@/lib/types";
import { getSchedules, saveSchedule, deleteSchedule, approveSchedule, getSchedule } from "@/lib/actions";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translations, Language } from "@/lib/translations";

export default function Home() {
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [schedules, setSchedules] = useState<LoanSchedule[]>([]);
  const [editingData, setEditingData] = useState<LoanInput | null>(null);
  const [language, setLanguage] = useState<Language>('ko');

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const refreshList = async () => {
    try {
      // @ts-ignore - mismatch in Prisma types vs LoanSchedule interface locally defined (string vs FuelType)
      const data = await getSchedules();

      const mapped: LoanSchedule[] = data.map((item: any) => ({
        ...item,
        fuelType: item.fuelType as any,
        createdAt: item.createdAt.toISOString()
      }));

      setSchedules(mapped);
    } catch (e) {
      console.error("Failed to fetch schedules make sure DB is connected", e);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleCalculate = (data: LoanInput) => {
    const result = calculateEqualPrincipalAndInterest(data);
    setSummary(result);
  };

  const handleSave = async (data: LoanInput) => {
    try {
      await saveSchedule(data);
      refreshList();
      alert("상환 스케줄이 저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다. DB 연결을 확인해주세요.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteSchedule(id);
        refreshList();
      } catch (e) {
        console.error(e);
        alert("삭제 실패");
      }
    }
  };

  const handleApprove = async (id: string) => {
    if (confirm("이 견적을 승인하시겠습니까?")) {
      try {
        await approveSchedule(id);
        refreshList();
      } catch (e) {
        console.error(e);
        alert("승인 실패");
      }
    }
  };

  const handleLoad = (schedule: LoanSchedule) => {
    setEditingData({
      vehiclePrice: schedule.vehiclePrice,
      downPayment: schedule.downPayment,
      engineDisplacement: schedule.engineDisplacement,
      fuelType: schedule.fuelType,
      envChargeSemiAnnual: schedule.envChargeSemiAnnual,
      loanAmount: schedule.loanAmount,
      interestRate: schedule.interestRate,
      termMonths: schedule.termMonths,
      startDate: new Date(schedule.startDate)
    });

    // Auto calculate for convenience:
    const result = calculateEqualPrincipalAndInterest({
      ...schedule,
      startDate: new Date(schedule.startDate)
    });
    setSummary(result);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#F0FDF8] dark:bg-[#022c22] selection:bg-teal-500/30">
      <div className="max-w-[1400px] mx-auto p-6 md:p-12 lg:p-20">

        <header className="mb-16 md:mb-24 fade-in-up flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-800 dark:text-emerald-50 mb-4">
              {t.appTitle}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-normal tracking-tight max-w-2xl">
              {t.appDesc1}<br />
              {t.appDesc2}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
              onClick={() => window.open('/smart_guide.pdf', '_blank')}
            >
              <FileText className="w-4 h-4 mr-2" />
              {t.introBtn}
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
              onClick={toggleLanguage}
            >
              <FileText className="w-4 h-4 mr-2" />
              {t.langBtn}
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-12 w-full">
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <LoanInputForm
              onCalculate={handleCalculate}
              onSave={handleSave}
              initialData={editingData}
              language={language}
            />

            <div className="text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.disclaimer1}<br />
                {t.disclaimer2}<br />
                {t.disclaimer3}
              </p>
            </div>
          </div>

          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">

            {/* Saved Schedules List */}
            <section className="max-w-4xl mx-auto">
              <ScheduleList
                schedules={schedules}
                onLoad={handleLoad}
                onDelete={handleDelete}
                onApprove={handleApprove}
                language={language}
              />
            </section>

            {/* Configured Table */}
            <div className="border-t border-black/5 dark:border-white/5 my-8"></div>
            <ScheduleTable summary={summary} language={language} />
          </div>
        </div>
      </div>
    </main>
  );
}
