"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    getVehicleOrigins,
    getManufacturers,
    getVehicleTypes,
    getVehicleModels,
    getVehicleTrims,
    getVehicleOptions
} from "@/lib/vehicle-actions";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Car, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (data: SelectedVehicleData) => void;
}

export interface SelectedVehicleData {
    vehicleName: string;
    trimName: string;
    price: number;
    displacement: number;
    fuelType: string;
    options: { name: string; price: number }[];
}

// Types for DB records (simplified)
type Item = { id: number; name: string; imageUrl?: string | null };
type Trim = Item & { price: number; fuelType: string; engineDisplacement: number };
type Option = Item & { price: number };

export function VehicleSelector({ open, onOpenChange, onSelect }: VehicleSelectorProps) {
    const [step, setStep] = useState(1);

    // Selections
    const [origin, setOrigin] = useState<Item | null>(null);
    const [manufacturer, setManufacturer] = useState<Item | null>(null);
    const [type, setType] = useState<Item | null>(null);
    const [model, setModel] = useState<Item | null>(null);
    const [trim, setTrim] = useState<Trim | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    // Lists
    const [origins, setOrigins] = useState<Item[]>([]);
    const [manufacturers, setManufacturers] = useState<Item[]>([]);
    const [types, setTypes] = useState<Item[]>([]);
    const [models, setModels] = useState<Item[]>([]);
    const [trims, setTrims] = useState<Trim[]>([]);
    const [options, setOptions] = useState<Option[]>([]);

    const [loading, setLoading] = useState(false);

    // Initial Load
    useEffect(() => {
        if (open && step === 1) {
            loadOrigins();
        }
    }, [open]);

    const loadOrigins = async () => {
        setLoading(true);
        try {
            const data = await getVehicleOrigins();
            setOrigins(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrigin = async (item: Item) => {
        setOrigin(item);
        setLoading(true);
        // Reset subsequent selections
        setManufacturer(null); setType(null); setModel(null); setTrim(null); setSelectedOptions([]);

        try {
            const data = await getManufacturers(item.id);
            setManufacturers(data);
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectManufacturer = async (item: Item) => {
        setManufacturer(item);
        setLoading(true);
        setType(null); setModel(null); setTrim(null); setSelectedOptions([]);

        try {
            const data = await getVehicleTypes(item.id);
            setTypes(data);
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectType = async (item: Item) => {
        setType(item);
        setLoading(true);
        setModel(null); setTrim(null); setSelectedOptions([]);

        try {
            const data = await getVehicleModels(item.id);
            setModels(data);
            setStep(4);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectModel = async (item: Item) => {
        setModel(item);
        setLoading(true);
        setTrim(null); setSelectedOptions([]);

        try {
            const data = await getVehicleTrims(item.id);
            setTrims(data as Trim[]);
            setStep(5);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTrim = async (item: Trim) => {
        setTrim(item);
        setLoading(true);
        setSelectedOptions([]);

        try {
            if (model) {
                const data = await getVehicleOptions(model.id);
                setOptions(data as Option[]);
                setStep(6);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleOption = (opt: Option) => {
        if (selectedOptions.find(o => o.id === opt.id)) {
            setSelectedOptions(selectedOptions.filter(o => o.id !== opt.id));
        } else {
            setSelectedOptions([...selectedOptions, opt]);
        }
    };

    const handleConfirm = () => {
        if (!trim) return;

        const basePrice = trim.price;
        const optionsPrice = selectedOptions.reduce((acc, curr) => acc + curr.price, 0);

        onSelect({
            vehicleName: `${manufacturer?.name} ${model?.name}`,
            trimName: trim.name,
            price: basePrice + optionsPrice,
            displacement: trim.engineDisplacement,
            fuelType: trim.fuelType, // This needs mapping to our Enum if distinct
            options: selectedOptions
        });
        onOpenChange(false);
        // Reset wizard
        setStep(1); setOrigin(null); setManufacturer(null); setType(null); setModel(null); setTrim(null); setSelectedOptions([]);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Render step content
    const renderContent = () => {
        if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        {origins.length === 0 && !loading && (
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed">
                                <p className="mb-2">차량 데이터를 불러올 수 없습니다.</p>
                                <Button variant="outline" size="sm" onClick={loadOrigins} className="gap-2">
                                    <Car className="w-4 h-4" />
                                    데이터 다시 불러오기
                                </Button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {origins.map(item => (
                                <div key={item.id}
                                    className={cn(
                                        "cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-3 transition-all hover:bg-slate-50",
                                        origin?.id === item.id ? "border-teal-600 bg-teal-50/50" : "border-slate-200"
                                    )}
                                    onClick={() => setOrigin(item)}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                        origin?.id === item.id ? "border-teal-600" : "border-slate-300"
                                    )}>
                                        {origin?.id === item.id && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                                    </div>
                                    <span className={cn(
                                        "text-lg font-semibold",
                                        origin?.id === item.id ? "text-teal-700" : "text-slate-600"
                                    )}>
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => handleSelectOrigin(origin!)}
                                disabled={!origin}
                                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                            >
                                다음 단계로
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {manufacturers.map(item => (
                            <Button key={item.id} variant="outline" className="h-20 text-md" onClick={() => handleSelectManufacturer(item)}>
                                {item.name}
                            </Button>
                        ))}
                    </div>
                );
            case 3:
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {types.map(item => (
                            <Button key={item.id} variant="outline" className="h-20 text-md" onClick={() => handleSelectType(item)}>
                                {item.name}
                            </Button>
                        ))}
                    </div>
                );
            case 4:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {models.map(item => (
                            <Button
                                key={item.id}
                                variant="outline"
                                className="h-auto py-4 justify-start px-6 text-md flex-col items-start gap-3"
                                onClick={() => handleSelectModel(item)}
                            >
                                <div className="flex items-center w-full">
                                    <Car className="w-5 h-5 mr-3 text-slate-400 shrink-0" />
                                    <span className="font-semibold">{item.name}</span>
                                </div>
                                {item.imageUrl && (
                                    <div className="w-full aspect-[16/9] relative bg-slate-50 rounded-lg overflow-hidden mt-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-contain mix-blend-multiply p-2"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </Button>
                        ))}
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-3">
                        {trims.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleSelectTrim(item)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left group"
                            >
                                <div>
                                    <div className="font-semibold text-slate-800 group-hover:text-teal-700">{item.name}</div>
                                    <div className="text-sm text-slate-500">
                                        {item.engineDisplacement}cc | {item.fuelType}
                                    </div>
                                </div>
                                <div className="text-right font-medium text-slate-900">
                                    {formatCurrency(item.price)}
                                </div>
                            </button>
                        ))}
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                            <h4 className="font-semibold text-sm text-slate-500 mb-2">선택된 차량</h4>
                            <div className="text-lg font-bold text-slate-800">{manufacturer?.name} {model?.name}</div>
                            <div className="text-slate-600">{trim?.name}</div>
                            <div className="text-right mt-2 font-bold text-teal-600 text-xl">{formatCurrency(trim?.price || 0)}</div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold">옵션 선택</Label>
                            {options.length === 0 && <div className="text-slate-400 text-sm py-2">선택 가능한 옵션이 없습니다.</div>}
                            {options.map(opt => {
                                const isSelected = !!selectedOptions.find(o => o.id === opt.id);
                                return (
                                    <div
                                        key={opt.id}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                                            isSelected ? "border-teal-500 bg-teal-50/30" : "border-slate-200 hover:border-slate-300"
                                        )}
                                        onClick={() => toggleOption(opt)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox id={`opt-${opt.id}`} checked={isSelected} onCheckedChange={() => toggleOption(opt)} />
                                            <label htmlFor={`opt-${opt.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                                {opt.name}
                                            </label>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">
                                            +{formatCurrency(opt.price)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t mt-6">
                            <div className="text-sm text-slate-500">
                                총 차량 가격 (옵션 포함)
                            </div>
                            <div className="text-2xl font-bold text-teal-700">
                                {formatCurrency((trim?.price || 0) + selectedOptions.reduce((acc, curr) => acc + curr.price, 0))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const getTitle = () => {
        switch (step) {
            case 1: return "1. 국내/외산 선택";
            case 2: return "2. 제조사 선택";
            case 3: return "3. 차종 선택";
            case 4: return "4. 모델 선택";
            case 5: return "5. 등급/연료 선택";
            case 6: return "6. 옵션 선택";
            default: return "차량 선택";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        {step > 1 && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={handleBack}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
                    </div>
                    {/* Progress Indicator (Optional) */}
                    <div className="flex gap-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={cn("flex-1 transition-all duration-300", i <= step ? "bg-teal-500" : "bg-transparent")} />
                        ))}
                    </div>
                </DialogHeader>

                <div className="py-6 min-h-[300px]">
                    {renderContent()}
                </div>

                {step === 6 && (
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
                        <Button onClick={handleConfirm} className="bg-teal-600 hover:bg-teal-700 text-white">
                            <Check className="w-4 h-4 mr-2" />
                            선택 완료
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
