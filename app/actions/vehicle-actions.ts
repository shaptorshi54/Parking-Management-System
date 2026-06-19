"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createVehicleAction(formData: FormData) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Unauthorized" }
        }

        const type = formData.get("type") as "CAR" | "BIKE" | "MPV"
        const vehicleModel = formData.get("model") as string
        const vehicleNumber = formData.get("number") as string

        if (!type || !vehicleModel || !vehicleNumber) {
            return { error: "Please fill all fields" }
        }

        const userId = session?.user.id as string

        await prisma.vehicles.create({
            data: {
                user: { connect: { id: userId } },
                type,
                vehicle_model:vehicleModel,
                vehicle_number:vehicleNumber
            }
        })

        revalidatePath("/dashboard/spotter/lots/[id]", "page")

        return { success: true }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: "This license plate is already registered" }
        }
        return { error: "Failed to add vehicle" }
    }
}