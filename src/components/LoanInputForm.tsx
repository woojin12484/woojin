"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoanInput, FuelType } from "@/lib/calculators";
import { formatCurrency } from "@/lib/utils";

interface LoanInputFormProps {
    onCalculate: (data: LoanInput) => void;
}

export function LoanInputForm({ onCalculate }: LoanInputFormProps) {
    const [vehiclePrice, setVehiclePrice] = useState<string>("");
    const [downPayment, setDownPayment] = useState<string>("");
    const [displacement, setDisplacement] = useState<string>(""); // cc
    const [fuelType, setFuelType] = useState<FuelType>("gasoline");
    const [envCharge, setEnvCharge] = useState<string>(""); // semi-annual

    const [rate, setRate] = useState<string>("");
    const [months, setMonths] = useState<string>("36");
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [loanAmount, setLoanAmount] = useState<number>(0);

    // Helper to format number with commas
    const formatNumber = (value: string) => {
        // Remove existing commas and non-digits
        const numStr = value.replace(/,/g, '');
        if (!numStr) return '';
        // Format with commas
        return Number(numStr).toLocaleString();
    };

    // Helper to parse formatted string to number
    const parseNumber = (value: string) => {
        return Number(value.replace(/,/g, '')) || 0;
    };

    useEffect(() => {
        const price = parseNumber(vehiclePrice);
        const payment = parseNumber(downPayment);
        setLoanAmount(Math.max(0, price - payment));
    }, [vehiclePrice, downPayment]);

    useEffect(() => {
        if (fuelType !== 'diesel') {
            setEnvCharge("");
        } else {
            // Default 50,000 -> "50,000"
            if (envCharge === "") setEnvCharge("50,000");
        }
    }, [fuelType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate({
            vehiclePrice: parseNumber(vehiclePrice),
            downPayment: parseNumber(downPayment),
            engineDisplacement: parseNumber(displacement),
            fuelType,
            envChargeSemiAnnual: parseNumber(envCharge),
            loanAmount: loanAmount,
            interestRate: Number(rate),
            termMonths: Number(months),
            startDate: new Date(date),
        });
    };

    return (
        <Card className="w-full border-t-0 shadow-2xl shadow-black/5 dark:shadow-white/5">
            <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-400">
                    신한캐피탈
                </CardTitle>
                <p className="text-slate-500 text-[15px]">대출 조건을 입력하여 상환 스케줄을 확인하세요.</p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-8 p-8">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 group">
                            <Label htmlFor="vehiclePrice" className="text-slate-500 dark:text-slate-400 font-medium ml-1 transition-colors group-focus-within:text-teal-600">차량 가격</Label>
                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                <Input
                                    id="vehiclePrice"
                                    type="text"
                                    placeholder="0"
                                    className="text-right pr-8 font-medium bg-slate-50/50 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:shadow-md transition-all focus:ring-teal-500/20"
                                    value={vehiclePrice}
                                    onChange={(e) => setVehiclePrice(formatNumber(e.target.value))}
                                    required
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">원</span>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <Label htmlFor="downPayment" className="text-slate-500 dark:text-slate-400 font-medium ml-1 transition-colors group-focus-within:text-teal-600">선수금</Label>
                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                <Input
                                    id="downPayment"
                                    type="text"
                                    placeholder="0"
                                    className="text-right pr-8 font-medium bg-slate-50/50 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:shadow-md transition-all focus:ring-teal-500/20"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(formatNumber(e.target.value))}
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">원</span>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <Label htmlFor="displacement" className="text-slate-500 dark:text-slate-400 font-medium ml-1 transition-colors group-focus-within:text-teal-600">배기량</Label>
                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                <Input
                                    id="displacement"
                                    type="text"
                                    placeholder="0"
                                    className="text-right pr-8 font-medium bg-slate-50/50 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:shadow-md transition-all focus:ring-teal-500/20"
                                    value={displacement}
                                    onChange={(e) => setDisplacement(formatNumber(e.target.value))}
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">cc</span>
                            </div>
                        </div>
                    </div>

                    <div className="py-5 px-6 bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-teal-100/50 dark:border-teal-500/10">
                        <span className="text-teal-700/80 dark:text-teal-300/80 text-sm font-medium">예상 대출 원금 (차량가 - 선수금)</span>
                        <span className="text-3xl font-bold text-teal-700 dark:text-teal-400 tracking-tight">
                            {formatCurrency(loanAmount)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-3">
                            <Label className="text-slate-500 dark:text-slate-400 font-medium ml-1">연료 종류</Label>
                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => setFuelType('gasoline')}
                                    className={`py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${fuelType !== 'diesel' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'}`}
                                >
                                    일반
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFuelType('diesel')}
                                    className={`py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${fuelType === 'diesel' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'}`}
                                >
                                    디젤 (경유)
                                </button>
                            </div>
                        </div>

                        {fuelType === 'diesel' && (
                            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-300 overflow-hidden group">
                                <Label htmlFor="envCharge" className="text-amber-600 dark:text-amber-500 ml-1 font-medium">환경개선부담금 (반기)</Label>
                                <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                    <Input
                                        id="envCharge"
                                        type="number"
                                        placeholder="50000"
                                        className="pl-4 font-medium bg-amber-50/50 border-amber-100 focus:border-amber-300 focus:bg-white dark:focus:bg-stone-900 focus:ring-amber-200 transition-all shadow-sm"
                                        value={envCharge}
                                        onChange={(e) => setEnvCharge(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-2.5 text-amber-600/50 pointer-events-none">원</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 group">
                            <Label htmlFor="rate" className="text-stone-500 dark:text-stone-400 font-medium ml-1 transition-colors group-focus-within:text-orange-500">연 이자율</Label>
                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                <Input
                                    id="rate"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.0"
                                    className="text-right pr-8 font-medium bg-stone-50/50 dark:bg-stone-800/50 border-transparent focus:bg-white dark:focus:bg-stone-900 focus:shadow-md transition-all focus:ring-orange-500/20"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    required
                                />
                                <span className="absolute right-3 top-2.5 text-stone-400 pointer-events-none">%</span>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <Label htmlFor="months" className="text-stone-500 dark:text-stone-400 font-medium ml-1 transition-colors group-focus-within:text-orange-500">대출 기간</Label>
                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                <Input
                                    id="months"
                                    type="number"
                                    placeholder="36"
                                    className="text-right pr-10 font-medium bg-stone-50/50 dark:bg-stone-800/50 border-transparent focus:bg-white dark:focus:bg-stone-900 focus:shadow-md transition-all focus:ring-orange-500/20"
                                    value={months}
                                    onChange={(e) => setMonths(e.target.value)}
                                    required
                                />
                                <span className="absolute right-3 top-2.5 text-stone-400 pointer-events-none">개월</span>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <Label htmlFor="date" className="text-stone-500 dark:text-stone-400 font-medium ml-1 transition-colors group-focus-within:text-orange-500">대출 실행일</Label>
                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                <Input
                                    id="date"
                                    type="date"
                                    className="font-mono bg-stone-50/50 dark:bg-stone-800/50 border-transparent focus:bg-white dark:focus:bg-stone-900 focus:shadow-md transition-all focus:ring-orange-500/20"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="pt-0 pb-8 px-8">
                    <Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold shadow-orange-500/20 shadow-xl hover:shadow-orange-500/30 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white">
                        상환 스케줄 계산하기
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
