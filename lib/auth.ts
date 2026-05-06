
import jwt from "jsonwebtoken";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma"


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface UserPayload {
  id: string;
  phone: string;
  role: string;
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(
    { userId: user.id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Better Auth কনফিগারেশন
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true, // Better Auth এখন নিজেই অত্যন্ত সিকিউরভাবে পাসওয়ার্ড হ্যাশ করে ডাটাবেজে পাঠাবে
  },
});