import { prisma } from "@/lib/prisma";
import { parkingSlotsValidate } from "../validation/validation";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const body = await req.json()

    const parsed = parkingSlotsValidate.safeParse(body)

    if (!parsed.success) {
        return Response.json({ message: parsed.error.issues[0].message }, { status: 400 })
    }

    const session = await auth()

    if (!session || !session.user || !session.user.id) {
        return Response.json({ message: "Unauthorized" }, { status: 403 })
    }
    
    const user_id = session.user.id

    const { lot_id, slot_type, status } = parsed.data
    const lastSlot = await prisma.parking_Slots.findFirst({
        where: { lot_id },
        orderBy: {
            slot_number: "desc"
        }
    })
    const parkingLot = await prisma.parking_Lots.findUnique({
        where: {
            id: lot_id
        }
    })

    if (!parkingLot) {
        return Response.json({ message: "Parking Lot not found" }, { status: 404 })
    }
    if (parkingLot.owner_id !== user_id) {
        return Response.json({ message: "Forbidden" }, { status: 403 })
    }
    const nextSlotNumber = lastSlot ? lastSlot.slot_number + 1 : 1

    await prisma.parking_Slots.create({
        data: {
            lot_id, slot_number: nextSlotNumber, slot_type, status
        }
    })
}