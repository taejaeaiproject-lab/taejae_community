import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaSync(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("postgresql") || url.startsWith("postgres")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: url });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  // SQLite via libSQL (dev)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const dbUrl = url || `file:${process.cwd()}/dev.db`;
  return new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaSync();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
