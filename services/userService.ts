"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function deleteUserAction(userId: string) {
    try {
        await prisma.user.delete({ where: { id: userId } });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete" };
    }
}


export async function toggleUserRoleAction(userId: string, currentRole: string) {
    try {
        const newRole = currentRole === "admin" ? "user" : "admin";
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update role" };
    }
}