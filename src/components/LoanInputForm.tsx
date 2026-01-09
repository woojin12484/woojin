"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoanInput, FuelType } from "@/lib/calculators";
import { formatCurrency } from "@/lib/utils";
import { Save, Car } from "lucide-react";
import { translations, Language } from "@/lib/translations";
import { VehicleSelector, SelectedVehicleData } from "@/components/VehicleSelector";

interface LoanInputFormProps {
    onCalculate: (data: LoanInput) => void;
    onSave?: (data: LoanInput) => void;
    initialData?: LoanInput | null;
    language: Language;
}

export function LoanInputForm({ onCalculate, onSave, initialData, language }: LoanInputFormProps) {
    const [vehiclePrice, setVehiclePrice] = useState<string>("");
    const [downPayment, setDownPayment] = useState<string>("");
    const [displacement, setDisplacement] = useState<string>(""); // cc
    const [fuelType, setFuelType] = useState<FuelType>("gasoline");
    const [envCharge, setEnvCharge] = useState<string>(""); // semi-annual

    const [rate, setRate] = useState<string>("");
    const [months, setMonths] = useState<string>("36");
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [loanAmount, setLoanAmount] = useState<number>(0);

    // Vehicle Selection State
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [selectedVehicleName, setSelectedVehicleName] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const t = translations[language];

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


    useEffect(() => {
        if (initialData) {
            setVehiclePrice(formatNumber(String(initialData.vehiclePrice || 0)));
            setDownPayment(formatNumber(String(initialData.downPayment || 0)));
            setDisplacement(formatNumber(String(initialData.engineDisplacement || 0)));
            setFuelType(initialData.fuelType || 'gasoline');
            setEnvCharge(formatNumber(String(initialData.envChargeSemiAnnual || 0)));
            setRate(String(initialData.interestRate || 0));
            setMonths(String(initialData.termMonths || 36));
            setDate(initialData.startDate instanceof Date ? initialData.startDate.toISOString().split('T')[0] : new Date(initialData.startDate).toISOString().split('T')[0]);

            if (initialData.vehicleName) {
                setSelectedVehicleName(initialData.vehicleName);
            }
        }
    }, [initialData]);

    const handleVehicleSelect = (data: SelectedVehicleData) => {
        setVehiclePrice(formatNumber(String(data.price)));
        setDisplacement(formatNumber(String(data.displacement)));

        // Map fuel type string to strict FuelType
        // Seed data: "gasoline", "diesel", "hybrid", "electric"
        // FuelType union: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'hydrogen'
        const fuel = data.fuelType.toLowerCase();
        if (['gasoline', 'diesel', 'hybrid', 'electric', 'hydrogen'].includes(fuel)) {
            setFuelType(fuel as FuelType);
        } else {
            setFuelType('gasoline'); // default fallback
        }

        setSelectedVehicleName(`${data.vehicleName} ${data.trimName}`);
        setSelectedOptions(data.options);
    };

    const getFormData = (): LoanInput => {
        return {
            vehiclePrice: parseNumber(vehiclePrice),
            downPayment: parseNumber(downPayment),
            engineDisplacement: parseNumber(displacement),
            fuelType,
            envChargeSemiAnnual: parseNumber(envCharge),
            loanAmount: loanAmount,
            interestRate: Number(rate),
            termMonths: Number(months),
            startDate: new Date(date),
            vehicleName: selectedVehicleName,
            selectedOptions: selectedOptions
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(getFormData());
    };

    const handleSave = () => {
        if (onSave) {
            onSave(getFormData());
        }
    };

    return (
        <Card className="w-full border-t-0 shadow-2xl shadow-black/5 dark:shadow-white/5">
            <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-400">
                    {t.formTitle}
                </CardTitle>
                <p className="text-slate-500 text-[15px]">{t.formDesc}</p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <VehicleSelector
                    open={selectorOpen}
                    onOpenChange={setSelectorOpen}
                    onSelect={handleVehicleSelect}
                />

                <CardContent className="space-y-8 p-8">

                    {/* Selected Vehicle Display */}
                    {selectedVehicleName && (
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-100 dark:border-teal-800 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                            <div>
                                <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Selected Vehicle</div>
                                <div className="font-bold text-lg text-teal-900 dark:text-teal-100">{selectedVehicleName}</div>
                                <div className="text-sm text-slate-500">
                                    {selectedOptions.length > 0 && `Included Options: ${selectedOptions.map(o => o.name).join(', ')}`}
                                </div>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => setSelectorOpen(true)}>
                                Change
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="vehiclePrice" className="text-slate-500 dark:text-slate-400 font-medium ml-1 transition-colors group-focus-within:text-teal-600">{t.vehiclePrice}</Label>
                                <button type="button" onClick={() => setSelectorOpen(true)} className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center">
                                    <Car className="w-3 h-3 mr-1" />
                                    차량 선택 마법사
                                </button>
                            </div>
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
                            <Label htmlFor="downPayment" className="text-slate-500 dark:text-slate-400 font-medium ml-1 transition-colors group-focus-within:text-teal-600">{t.downPayment}</Label>
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
                            <Label htmlFor="displacement" className="text-slate-500 dark:text-slate-400 font-medium ml-1 transition-colors group-focus-within:text-teal-600">{t.displacement}</Label>
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
                        <span className="text-teal-700/80 dark:text-teal-300/80 text-sm font-medium">{t.loanPrincipal}</span>
                        <span className="text-3xl font-bold text-teal-700 dark:text-teal-400 tracking-tight">
                            {formatCurrency(loanAmount)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-3">
                            <Label className="text-slate-500 dark:text-slate-400 font-medium ml-1">{t.fuelType}</Label>
                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => setFuelType('gasoline')}
                                    className={`py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${fuelType !== 'diesel' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'}`}
                                >
                                    {t.fuelGasoline}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFuelType('diesel')}
                                    className={`py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${fuelType === 'diesel' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'}`}
                                >
                                    {t.fuelDiesel}
                                </button>
                            </div>
                        </div>

                        {fuelType === 'diesel' && (
                            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-300 overflow-hidden group">
                                <Label htmlFor="envCharge" className="text-amber-600 dark:text-amber-500 ml-1 font-medium">{t.envCharge}</Label>
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
                            <Label htmlFor="rate" className="text-stone-500 dark:text-stone-400 font-medium ml-1 transition-colors group-focus-within:text-orange-500">{t.interestRate}</Label>
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
                            <Label htmlFor="months" className="text-stone-500 dark:text-stone-400 font-medium ml-1 transition-colors group-focus-within:text-orange-500">{t.loanTerm}</Label>
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
                            <Label htmlFor="date" className="text-stone-500 dark:text-stone-400 font-medium ml-1 transition-colors group-focus-within:text-orange-500">{t.startDate}</Label>
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
                    <div className="flex gap-4">
                        <Button type="submit" size="lg" className="flex-1 h-14 text-lg font-semibold shadow-orange-500/20 shadow-xl hover:shadow-orange-500/30 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white">
                            {t.calcBtn}
                        </Button>
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg font-semibold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            onClick={handleSave}
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {t.saveBtn}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
