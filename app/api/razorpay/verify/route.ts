import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = await req.json()

        // Verifying signature using the crypto - cryptography
        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSign = crypto.createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!).update(sign.toString()).digest("hex")

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json({ error: `Invalid payment signature` }, { status: 400 })
        }

        // if the payment goes successful then the available slot will be booked
        const availableSlot = await prisma.parking_Slots.findFirst({
            where: {
                lot_id: bookingData.lotId,
                slot_type: bookingData.vehicleType,
                status: "AVAILABLE"
            }
        })

        if (!availableSlot) {
            return NextResponse.json({ error: `Sorry, the parking lot just filled up` }, { status: 400 })
        }

        // booking creation and slot locking
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + bookingData.durationHours * 60 * 60 * 1000)

        const booking = await prisma.$transaction(async (tx) => {
            const newBooking = await tx.bookings.create({
                data: {
                    user_id: bookingData.userId,
                    slot_id: availableSlot.id,
                    vehicle_id: bookingData.vehicleId,
                    booking_start: startTime,
                    booking_end: endTime,
                    total_price: bookingData.total_price,
                    status: "CONFIRMED"
                }
            })

            await tx.parking_Slots.update({
                where: { id: availableSlot.id },
                data: { status: "OCCUPIED" }
            })

            return newBooking
        })

        return NextResponse.json({success:true,bookingId:booking.id})

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: `Payment Verification Failed` }, { status: 500 })
    }
}