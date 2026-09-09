import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 需要显式传 driver adapter（这里用 pg 连接 Postgres）
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// 单例模式：开发环境下避免 Next.js HMR 重复创建连接池
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
