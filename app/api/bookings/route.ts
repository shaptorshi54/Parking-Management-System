import { prisma } from "@/lib/prisma";
import { bookingValidate } from '../validation/validation'
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {

        const body = await req.json()

        const parsed = bookingValidate.safeParse(body)

        if (!parsed.success) {
            return Response.json({ message: parsed.error.issues[0].message }, { status: 400 })
        }
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return Response.json({ message: 'Unauthorized' }, { status: 403 })
        }

        const user_id = session.user.id
        const { slot_id, booking_start, booking_end, total_price } = parsed.data

        const slot = await prisma.parking_Slots.findUnique({
            where: {
                id: slot_id
            }
        })

        if (!slot) {
            return Response.json({ message: "Slot not found" }, { status: 404 })
        }

        if (slot.status !== "AVAILABLE") {
            return Response.json({ message: "Slot not available" }, { status: 400 })
        }

        const existingSlot = await prisma.bookings.findFirst({
            where: {
                id: slot_id,
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            }
        })

        if (existingSlot) {
            return Response.json({ message: "Slot already in use" }, { status: 400 })
        }

        await prisma.bookings.create({
            data: {
                user_id, slot_id, booking_start, booking_end, total_price, vehicle_id: "FALLBACK_ID"
            }
        })
    } catch (error) {
        return Response.json({ message: "Server error" }, { status: 500 })
    }
}