import { LoanSummary, AmortizationScheduleItem } from "@/lib/calculators";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ScheduleTableProps {
    summary: LoanSummary | null;
}

export function ScheduleTable({ summary }: ScheduleTableProps) {
    if (!summary || summary.schedule.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-50">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <p className="text-muted-foreground font-medium">조건을 입력하여 결과를 확인하세요</p>
            </div>
        );
    }

    const { totalInterest, totalPayment, schedule, vehiclePrice, downPayment, autoTax, envCharge } = summary;
    const loanPrincipal = (vehiclePrice || 0) - (downPayment || 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/50 border-0 shadow-sm">
                    <CardHeader className="pb-2 p-5">
                        <CardTitle className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">차량 가격</CardTitle>
                        <div className="text-xl font-semibold text-foreground mt-1">
                            {formatCurrency(vehiclePrice || 0)}
                        </div>
                    </CardHeader>
                </Card>
                <Card className="bg-white/50 border-0 shadow-sm">
                    <CardContent className="pb-2 p-5">
                        <CardTitle className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">총 이자</CardTitle>
                        <div className="text-xl font-semibold text-teal-600 mt-1">
                            {formatCurrency(totalInterest)}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 border-0 shadow-sm">
                    <CardHeader className="pb-2 p-5">
                        <CardTitle className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">연간 자동차세</CardTitle>
                        <div className="text-xl font-semibold text-emerald-600 mt-1">
                            {autoTax ? formatCurrency(autoTax.annual) : "-"}
                        </div>
                        {autoTax && (
                            <p className="text-xs text-slate-400 mt-1">
                                월 {formatCurrency(autoTax.monthly)}
                            </p>
                        )}
                    </CardHeader>
                </Card>

                {envCharge ? (
                    <Card className="bg-white/50 border-0 shadow-sm">
                        <CardHeader className="pb-2 p-5">
                            <CardTitle className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">환경부담금(반기)</CardTitle>
                            <div className="text-xl font-semibold text-emerald-600 mt-1">
                                {formatCurrency(envCharge.semiAnnual)}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                월 {formatCurrency(envCharge.monthly)}
                            </p>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card className="bg-white/50 border-0 shadow-sm">
                        <CardContent className="pb-2 p-5">
                            <CardTitle className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">총 상환 금액</CardTitle>
                            <div className="text-xl font-semibold text-teal-600 mt-1">
                                {formatCurrency(totalPayment)}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold px-2">상환 스케줄</h3>
                <div className="rounded-3xl border border-black/5 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-white/5 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <div className="overflow-x-auto max-h-[800px] scrollbar-thin">
                        <table className="w-full text-[15px] border-collapse">
                            <thead className="bg-slate-50/90 dark:bg-slate-900/90 border-b border-black/5 dark:border-white/5 sticky top-0 z-10 backdrop-blur-md">
                                <tr className="text-left text-slate-500 font-medium">
                                    <th className="p-5 font-normal whitespace-nowrap">회차</th>
                                    <th className="p-5 font-normal whitespace-nowrap">납입일</th>
                                    <th className="p-5 text-right font-normal whitespace-nowrap">월 납입금</th>
                                    <th className="p-5 text-right font-normal whitespace-nowrap">원금</th>
                                    <th className="p-5 text-right font-normal whitespace-nowrap">이자</th>
                                    {autoTax && <th className="p-5 text-right font-normal text-emerald-600/70 whitespace-nowrap">월 자동차세</th>}
                                    {envCharge && <th className="p-5 text-right font-normal text-emerald-600/70 whitespace-nowrap">월 부담금</th>}
                                    <th className="p-5 text-right font-semibold text-teal-600 whitespace-nowrap bg-teal-50/30 dark:bg-teal-900/10">월 총 지출</th>
                                    <th className="p-5 text-right font-normal text-slate-400 whitespace-nowrap">잔액</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                {schedule.map((row: AmortizationScheduleItem) => (
                                    <tr key={row.round} className="group hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors duration-200">
                                        <td className="p-5 text-slate-500 group-hover:text-teal-600 font-medium whitespace-nowrap">{row.round}</td>
                                        <td className="p-5 text-slate-600 group-hover:text-teal-600 whitespace-nowrap">
                                            {row.paymentDate.toISOString().split('T')[0]}
                                        </td>
                                        <td className="p-5 text-right font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                            {formatCurrency(row.monthlyPayment)}
                                        </td>
                                        <td className="p-5 text-right text-slate-500 whitespace-nowrap">
                                            {formatCurrency(row.principalPayment)}
                                        </td>
                                        <td className="p-5 text-right text-teal-600/90 font-medium whitespace-nowrap">
                                            {formatCurrency(row.interestPayment)}
                                        </td>
                                        {autoTax && (
                                            <td className="p-5 text-right text-emerald-600/80 font-medium whitespace-nowrap">
                                                {formatCurrency(row.monthlyTax || 0)}
                                            </td>
                                        )}
                                        {envCharge && (
                                            <td className="p-5 text-right text-emerald-600/80 font-medium whitespace-nowrap">
                                                {formatCurrency(row.monthlyEnvCharge || 0)}
                                            </td>
                                        )}
                                        <td className="p-5 text-right font-bold text-teal-600 text-lg whitespace-nowrap bg-teal-50/30 dark:bg-teal-900/10">
                                            {formatCurrency(row.totalMonthlyOutflow || row.monthlyPayment)}
                                        </td>
                                        <td className="p-5 text-right text-slate-400 font-light whitespace-nowrap">
                                            {formatCurrency(row.remainingBalance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
