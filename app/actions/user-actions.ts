"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (!userId || !name || !phone) {
      return { error: "Missing required fields" };
    }

    await prisma.users.update({
      where: { id: userId },
      data: { name, phone },
    });

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}
