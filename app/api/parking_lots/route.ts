import { prisma, TransactionClient } from '@/lib/prisma'
import { parkingLotValidate } from '../validation/validation'
import { auth } from '@/auth'

export async function POST(req: Request) {
    const body = await req.json()

    const parsed = parkingLotValidate.safeParse(body)

    if (!parsed.success) {
        return Response.json({ message: parsed.error.issues[0].message }, { status: 400 })
    }
    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        return Response.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const owner_id = session.user.id
    const { 
        name, address, lat, lng, description, 
        is_24_7, opening_time, closing_time, pricePerHour, 
        amenities, slots_car, slots_bike, slots_mpv 
    } = parsed.data

    // 1. Convert time strings ("08:00") into dummy Date objects for Prisma
    const openingDate = is_24_7 || !opening_time ? null : new Date(`1970-01-01T${opening_time}:00Z`);
    const closingDate = is_24_7 || !closing_time ? null : new Date(`1970-01-01T${closing_time}:00Z`);

    try {
        // 2. Start a Prisma Transaction to ensure if slots fail, the lot isn't created empty
        const result = await prisma.$transaction(async (tx: TransactionClient) => {
            
            // A. Create the main Parking Lot
            const lot = await tx.parking_Lots.create({
                data: {
                    owner_id,
                    name,
                    address,
                    location_latitude: lat ? parseFloat(lat) : 0,
                    location_longitude: lng ? parseFloat(lng) : 0,
                    description: description || "",
                    is_24_7,
                    opening_time: openingDate,
                    closing_time: closingDate,
                    pricePerHour,
                    amenities,
                    images: [] // Empty for now until upload is implemented
                }
            });

            // B. Prepare the bulk array of slots
            const slotsToCreate = [];
            let currentSlotNumber = 1;

            // Generate CAR slots
            for (let i = 0; i < slots_car; i++) {
                slotsToCreate.push({ lot_id: lot.id, slot_number: currentSlotNumber++, slot_type: "CAR" as const });
            }
            // Generate BIKE slots
            for (let i = 0; i < slots_bike; i++) {
                slotsToCreate.push({ lot_id: lot.id, slot_number: currentSlotNumber++, slot_type: "BIKE" as const });
            }
            // Generate MPV slots
            for (let i = 0; i < slots_mpv; i++) {
                slotsToCreate.push({ lot_id: lot.id, slot_number: currentSlotNumber++, slot_type: "MPV" as const });
            }

            // C. Insert all slots into the database instantly
            if (slotsToCreate.length > 0) {
                await tx.parking_Slots.createMany({
                    data: slotsToCreate
                });
            }

            return lot;
        });

        return Response.json({ message: 'Lot and Slots Created successfully!', lot: result }, { status: 201 })
    } catch (error) {
        console.error("Failed to create lot:", error);
        return Response.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
