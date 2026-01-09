-- CreateTable
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
    "vehicleName" TEXT,
    "trimName" TEXT,
    "selectedOptions" JSONB,

    CONSTRAINT "LoanSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOrigin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "VehicleOrigin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleManufacturer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "originId" INTEGER NOT NULL,

    CONSTRAINT "VehicleManufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturerId" INTEGER NOT NULL,

    CONSTRAINT "VehicleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleTrim" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "engineDisplacement" INTEGER NOT NULL,

    CONSTRAINT "VehicleTrim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOption" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "VehicleOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOrigin_code_key" ON "VehicleOrigin"("code");

-- AddForeignKey
ALTER TABLE "VehicleManufacturer" ADD CONSTRAINT "VehicleManufacturer_originId_fkey" FOREIGN KEY ("originId") REFERENCES "VehicleOrigin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleType" ADD CONSTRAINT "VehicleType_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "VehicleManufacturer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleTrim" ADD CONSTRAINT "VehicleTrim_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOption" ADD CONSTRAINT "VehicleOption_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
