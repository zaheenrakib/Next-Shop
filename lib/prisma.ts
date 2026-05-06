import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// গ্লোবাল ডিক্লেয়ারেশন যাতে টাইপস্ক্রিপ্ট 'globalThis.prisma' চিনতে পারে
declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}