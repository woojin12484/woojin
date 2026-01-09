"use server";

import db from "@/lib/db";

export async function getVehicleOrigins() {
    console.log("Fetching vehicle origins...");
    try {
        const origins = await db.vehicleOrigin.findMany({
            orderBy: { id: 'asc' }
        });
        console.log("Fetched origins count:", origins.length);
        return origins;
    } catch (error) {
        console.error("Error fetching origins:", error);
        throw error;
    }
}

export async function getManufacturers(originId: number) {
    return await db.vehicleManufacturer.findMany({
        where: { originId },
        orderBy: { name: 'asc' }
    });
}

export async function getVehicleTypes(manufacturerId: number) {
    return await db.vehicleType.findMany({
        where: { manufacturerId },
        orderBy: { name: 'asc' }
    });
}

export async function getVehicleModels(typeId: number) {
    return await db.vehicleModel.findMany({
        where: { typeId },
        orderBy: { name: 'asc' }
    });
}

export async function getVehicleTrims(modelId: number) {
    return await db.vehicleTrim.findMany({
        where: { modelId },
        orderBy: { price: 'asc' }
    });
}

export async function getVehicleOptions(modelId: number) {
    return await db.vehicleOption.findMany({
        where: { modelId },
        orderBy: { price: 'asc' }
    });
}
