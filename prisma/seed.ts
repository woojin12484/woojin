import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Origins
    const domestic = await prisma.vehicleOrigin.upsert({
        where: { code: 'DOMESTIC' },
        update: {},
        create: { name: '국산', code: 'DOMESTIC' },
    })

    const imported = await prisma.vehicleOrigin.upsert({
        where: { code: 'IMPORT' },
        update: {},
        create: { name: '외산', code: 'IMPORT' },
    })

    // 2. Manufacturers (Hyundai example)
    const hyundai = await prisma.vehicleManufacturer.create({
        data: {
            name: '현대 (Hyundai)',
            originId: domestic.id,
            types: {
                create: [
                    {
                        name: '승용 (Sedan)',
                        models: {
                            create: [
                                {
                                    name: '그랜저 (Grandeur)',
                                    imageUrl: '/images/cars/grandeur.png',
                                    trims: {
                                        create: [
                                            { name: '2.5 가솔린 프리미엄', fuelType: 'gasoline', price: 37850000, engineDisplacement: 2497 },
                                            { name: '3.5 가솔린 익스클루시브', fuelType: 'gasoline', price: 42800000, engineDisplacement: 3470 },
                                            { name: '하이브리드 캘리그래피', fuelType: 'hybrid', price: 54000000, engineDisplacement: 1598 }
                                        ]
                                    },
                                    options: {
                                        create: [
                                            { name: '파노라마 선루프', price: 1200000 },
                                            { name: '헤드업 디스플레이', price: 1000000 },
                                            { name: '현대 스마트센스 I', price: 750000 }
                                        ]
                                    }
                                },
                                {
                                    name: '쏘나타 (Sonata)',
                                    imageUrl: '/images/cars/sonata.png',
                                    trims: {
                                        create: [
                                            { name: '2.0 가솔린 프리미엄', fuelType: 'gasoline', price: 28000000, engineDisplacement: 1999 },
                                            { name: '1.6 터보 인스퍼레이션', fuelType: 'gasoline', price: 35000000, engineDisplacement: 1598 }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        name: 'SUV',
                        models: {
                            create: [
                                {
                                    name: '싼타페 (Santa Fe)',
                                    imageUrl: '/images/cars/santafe.png',
                                    trims: {
                                        create: [
                                            { name: '2.5 터보 가솔린 프레스티지', fuelType: 'gasoline', price: 38000000, engineDisplacement: 2497 },
                                            { name: '하이브리드 캘리그래피', fuelType: 'hybrid', price: 48000000, engineDisplacement: 1598 }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    // 2. Manufacturers (Kia example)
    await prisma.vehicleManufacturer.create({
        data: {
            name: '기아 (Kia)',
            originId: domestic.id,
            types: {
                create: [
                    {
                        name: 'SUV',
                        models: {
                            create: [
                                {
                                    name: '쏘렌토 (Sorento)',
                                    imageUrl: '/images/cars/sorento.png',
                                    trims: {
                                        create: [
                                            { name: '2.2 디젤 프레스티지', fuelType: 'diesel', price: 39000000, engineDisplacement: 2151 },
                                            { name: '하이브리드 시그니처', fuelType: 'hybrid', price: 45000000, engineDisplacement: 1598 }
                                        ]
                                    },
                                    options: {
                                        create: [
                                            { name: '드라이브 와이즈', price: 900000 },
                                            { name: '스마트 커넥트', price: 900000 }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    // 3. Manufacturers (BMW example - Import)
    await prisma.vehicleManufacturer.create({
        data: {
            name: 'BMW',
            originId: imported.id,
            types: {
                create: [
                    {
                        name: '승용 (Sedan)',
                        models: {
                            create: [
                                {
                                    name: '5 Series',
                                    imageUrl: '/images/cars/bmw5.png',
                                    trims: {
                                        create: [
                                            { name: '520i M Sport', fuelType: 'gasoline', price: 68000000, engineDisplacement: 1998 },
                                            { name: '530e (PHEV)', fuelType: 'hybrid', price: 82000000, engineDisplacement: 1998 }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
