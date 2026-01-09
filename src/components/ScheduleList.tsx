
import { LoanSchedule } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Edit, CheckCircle } from "lucide-react";
import { translations, Language } from "@/lib/translations";

interface ScheduleListProps {
    schedules: LoanSchedule[];
    onLoad: (schedule: LoanSchedule) => void;
    onDelete: (id: string) => void;
    onApprove: (id: string) => void;
    language: Language;
}

export function ScheduleList({ schedules, onLoad, onDelete, onApprove, language }: ScheduleListProps) {
    const t = translations[language];

    if (schedules.length === 0) {
        return (
            <Card className="w-full border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/20">
                <CardContent className="py-12 text-center text-slate-500">
                    {t.listEmpty}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {t.listTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {schedules.map((schedule) => (
                    <div
                        key={schedule.id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md gap-4"
                    >
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                                    {formatCurrency(schedule.vehiclePrice || 0)}원
                                </span>
                                <Badge variant={schedule.status === 'APPROVED' ? 'default' : 'secondary'} className={schedule.status === 'APPROVED' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                                    {schedule.status === 'APPROVED' ? t.statusApproved : t.statusDraft}
                                </Badge>
                                <span className="text-xs text-slate-400">
                                    {new Date(schedule.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                {schedule.termMonths}개월 | 금리 {schedule.interestRate}% | 선수금 {formatCurrency(schedule.downPayment || 0)}원
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onLoad(schedule)}
                                className="flex-1 md:flex-none"
                                disabled={schedule.status === 'APPROVED'}
                            >
                                <Edit className="w-4 h-4 mr-1.5" />
                                {t.btnEdit}
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onApprove(schedule.id)}
                                className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={schedule.status === 'APPROVED'}
                            >
                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                {t.btnApprove}
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(schedule.id)}
                                className="flex-1 md:flex-none"
                            >
                                <Trash2 className="w-4 h-4 mr-1.5" />
                                {t.btnDelete}
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
