"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBookingAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to book a spot." };
    }

    const userId = session.user.id;
    const lotId = formData.get("lotId") as string;
    const vehicleId = formData.get("vehicleId") as string;
    const durationHours = parseInt(formData.get("durationHours") as string);
    const totalPrice = parseInt(formData.get("totalPrice") as string);

    if (!lotId || !vehicleId || !durationHours || !totalPrice) {
      return { error: "Missing required booking details." };
    }

    // 1. Fetch the Vehicle to know what type of slot we need (CAR, BIKE, MPV)
    const vehicle = await prisma.vehicles.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle || vehicle.user_id !== userId) {
      return { error: "Invalid vehicle selected." };
    }

    // 2. Perform a Prisma Transaction to ensure we don't double-book a slot
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Find an available slot of the correct type in this specific lot
      const availableSlot = await tx.parking_Slots.findFirst({
        where: {
          lot_id: lotId,
          slot_type: vehicle.type,
          status: "AVAILABLE" // Only looking for empty spots!
        }
      });

      if (!availableSlot) {
        throw new Error(`Sorry, there are no available ${vehicle.type.toLowerCase()} spots in this lot right now.`);
      }

      // Calculate Time
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

      // Create the Booking
      const booking = await tx.bookings.create({
        data: {
          user_id: userId,
          slot_id: availableSlot.id,
          vehicle_id: vehicle.id,
          booking_start: startTime,
          booking_end: endTime,
          total_price: totalPrice,
          status: "CONFIRMED"
        }
      });

      // Mark the Slot as OCCUPIED so no one else can book it
      await tx.parking_Slots.update({
        where: { id: availableSlot.id },
        data: { status: "OCCUPIED" }
      });

      return booking;
    });

    // 3. Clear cache so the UI updates instantly
    revalidatePath(`/dashboard/spotter/lots/${lotId}`);
    revalidatePath(`/dashboard/owner/lots/${lotId}`); // Owner dashboard updates instantly too!
    revalidatePath(`/dashboard/spotter/active-tickets`); // FORCE REFRESH FOR ACTIVE TICKETS
    
    return { success: true, bookingId: result.id };

  } catch (error: any) {
    console.error("Booking Error:", error);
    // Return the specific error message if it's our custom throw, otherwise generic error
    return { error: error.message || "Failed to process your booking. Please try again." };
  }
}
