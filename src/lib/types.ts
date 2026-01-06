
import { LoanInput, LoanSummary } from "@/lib/calculators";

export interface LoanSchedule extends LoanInput {
    id: string;
    createdAt: string; // ISO date string
    status: 'DRAFT' | 'APPROVED';
    summary?: LoanSummary; // Cache the calculation result associated with this input
}
