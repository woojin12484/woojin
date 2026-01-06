-- Create Table Statement for PostgreSQL
CREATE TABLE "LoanSchedule" (
    "id" TEXT NOT NULL,
    "vehiclePrice" DOUBLE PRECISION NOT NULL,
    "downPayment" DOUBLE PRECISION NOT NULL,
    "engineDisplacement" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "envChargeSemiAnnual" DOUBLE PRECISION NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanSchedule_pkey" PRIMARY KEY ("id")
);
