"use server";

import db from "@/lib/db";
import { LoanInput } from "@/lib/calculators";
import { revalidatePath } from "next/cache";

export async function getSchedules() {
    const schedules = await db.loanSchedule.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return schedules;
}

export async function getSchedule(id: string) {
    const schedule = await db.loanSchedule.findUnique({
        where: { id },
    });
    return schedule;
}

export async function saveSchedule(data: LoanInput) {
    await db.loanSchedule.create({
        data: {
            vehiclePrice: data.vehiclePrice || 0,
            downPayment: data.downPayment || 0,
            engineDisplacement: data.engineDisplacement || 0,
            fuelType: data.fuelType || 'gasoline',
            envChargeSemiAnnual: data.envChargeSemiAnnual || 0,
            loanAmount: data.loanAmount,
            interestRate: data.interestRate,
            termMonths: data.termMonths,
            startDate: new Date(data.startDate),
            status: 'DRAFT',
        },
    });
    revalidatePath('/');
}

export async function deleteSchedule(id: string) {
    await db.loanSchedule.delete({
        where: { id },
    });
    revalidatePath('/');
}

export async function approveSchedule(id: string) {
    await db.loanSchedule.update({
        where: { id },
        data: { status: 'APPROVED' },
    });
    revalidatePath('/');
}
