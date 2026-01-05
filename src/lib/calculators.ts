export type FuelType = 'diesel' | 'gasoline' | 'electric' | 'hybrid' | 'other';

export interface LoanInput {
    vehiclePrice?: number; // Optional: Total vehicle price
    downPayment?: number; // Optional: Down payment amount
    engineDisplacement?: number; // Optional: Engine displacement in cc
    fuelType?: FuelType; // Optional: Fuel type
    envChargeSemiAnnual?: number; // Optional: Environmental charge per half-year (for diesel)
    loanAmount: number; // Principal amount (usually vehiclePrice - downPayment)
    interestRate: number; // Annual interest rate in percentage
    termMonths: number; // Loan term in months
    startDate: Date; // Start date of the loan
}

export interface AmortizationScheduleItem {
    round: number; // Payment round (1, 2, 3...)
    paymentDate: Date; // Date of payment
    monthlyPayment: number; // Total monthly payment (Principal + Interest)
    principalPayment: number; // Principal portion
    interestPayment: number; // Interest portion
    remainingBalance: number; // Remaining balance after payment
    monthlyTax?: number; // Monthly equivalent auto tax
    monthlyEnvCharge?: number; // Monthly equivalent env charge
    totalMonthlyOutflow?: number; // monthlyPayment + monthlyTax + monthlyEnvCharge
}

export interface LoanSummary {
    vehiclePrice?: number;
    downPayment?: number;
    autoTax?: {
        annual: number;
        monthly: number;
    };
    envCharge?: {
        semiAnnual: number;
        monthly: number;
    };
    totalInterest: number;
    totalPayment: number;
    schedule: AmortizationScheduleItem[];
}

/**
 * Calculate Annual Automobile Tax based on Korean standards.
 * - cc <= 1000: 80 won/cc
 * - cc <= 1600: 140 won/cc
 * - cc > 1600: 200 won/cc
 * - Education Tax: 30% of the calculated tax
 */
function calculateAutoTax(cc: number): number {
    if (cc <= 0) return 0;

    let taxPerCc = 0;
    if (cc <= 1000) {
        taxPerCc = 80;
    } else if (cc <= 1600) {
        taxPerCc = 140;
    } else {
        taxPerCc = 200;
    }

    const baseTax = cc * taxPerCc;
    const educationTax = baseTax * 0.3;
    return Math.floor(baseTax + educationTax);
}

/**
 * Calculates the amortization schedule using the Equal Principal and Interest method (원리금균등상환).
 */
export function calculateEqualPrincipalAndInterest(input: LoanInput): LoanSummary {
    const { loanAmount, interestRate, termMonths, startDate, vehiclePrice, downPayment, engineDisplacement, fuelType, envChargeSemiAnnual } = input;

    // Calculate Auto Tax
    let autoTax = undefined;
    if (engineDisplacement && engineDisplacement > 0) {
        const annual = calculateAutoTax(engineDisplacement);
        autoTax = {
            annual,
            monthly: Math.floor(annual / 12),
        };
    }

    // Calculate Env Charge (Diesel only)
    let envCharge = undefined;
    if (fuelType === 'diesel' && envChargeSemiAnnual && envChargeSemiAnnual > 0) {
        envCharge = {
            semiAnnual: envChargeSemiAnnual,
            monthly: Math.floor(envChargeSemiAnnual / 6),
        };
    }

    if (loanAmount <= 0 || termMonths <= 0) {
        return {
            vehiclePrice,
            downPayment,
            autoTax,
            envCharge,
            totalInterest: 0,
            totalPayment: 0,
            schedule: []
        };
    }

    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;

    // Calculate monthly total payment (PMT formula)
    // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
        monthlyPayment = loanAmount / termMonths;
    } else {
        monthlyPayment =
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    // Floor the payment to integer to avoid fractional KRW issues (common practice in KR is floor or round, usually floor 10 won or 1 won. Let's stick to simple Math.floor for now)
    // Actually, standard math keeps it precise, but display rounds it. Let's keep precise for calculation internal, round for display.
    // However, for Auto financing, usually it's floor to 10 won or similar. Let's use Math.floor(monthlyPayment).
    monthlyPayment = Math.floor(monthlyPayment);

    let currentBalance = loanAmount;
    let totalInterest = 0;
    const schedule: AmortizationScheduleItem[] = [];

    for (let i = 1; i <= termMonths; i++) {
        // Interest for this month
        let interestPayment = Math.floor(currentBalance * monthlyRate);

        // Principal for this month
        let principalPayment = monthlyPayment - interestPayment;

        // Adjust for last month
        if (i === termMonths) {
            principalPayment = currentBalance;
            monthlyPayment = principalPayment + interestPayment;
        }

        currentBalance -= principalPayment;
        totalInterest += interestPayment;

        // Calculate Payment Date
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);

        schedule.push({
            round: i,
            paymentDate,
            monthlyPayment,
            principalPayment,
            interestPayment,
            remainingBalance: Math.max(0, currentBalance), // ensure no negative zero
            monthlyTax: autoTax?.monthly,
            monthlyEnvCharge: envCharge?.monthly,
            totalMonthlyOutflow: monthlyPayment + (autoTax?.monthly || 0) + (envCharge?.monthly || 0),
        });
    }

    return {
        vehiclePrice,
        downPayment,
        autoTax,
        envCharge,
        totalInterest,
        totalPayment: loanAmount + totalInterest,
        schedule,
    };
}
