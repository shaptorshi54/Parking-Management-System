"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSlotStatus(formData: FormData) {
    const slotId = formData.get("slotId") as string;
    const newStatus = formData.get("status") as string;
    const lotId = formData.get("lotId") as string;

    if (!slotId || !newStatus || !lotId) {
        throw new Error("Missing required fields");
    }

    // Only allow updating to specific statuses manually
    if (!["AVAILABLE", "MAINTENANCE", "CLOSED"].includes(newStatus)) {
        throw new Error("Invalid status update");
    }

    try {
        await prisma.parking_Slots.update({
            where: { id: slotId },
            data: { 
                // @ts-ignore Prisma types
                status: newStatus 
            }
        });

        // Instantly refresh the page data
        revalidatePath(`/dashboard/owner/lots/${lotId}`);
    } catch (error) {
        console.error("Failed to update slot:", error);
        throw new Error("Failed to update slot");
    }
}
