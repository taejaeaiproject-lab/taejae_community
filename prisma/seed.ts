import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("postgresql") || url.startsWith("postgres")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: url });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const dbUrl = url || `file:${path.resolve(process.cwd(), "dev.db")}`;
  return new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) });
}

const prisma = createPrisma();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@taejae.ac.kr" },
    update: {},
    create: {
      email: "admin@taejae.ac.kr",
      password: adminPassword,
      name: "관리자",
      nameEn: "Admin",
      role: "ADMIN",
      status: "APPROVED",
    },
  });

  const testPassword = await bcrypt.hash("test1234!", 12);

  await prisma.user.upsert({
    where: { email: "student@taejae.ac.kr" },
    update: {},
    create: {
      email: "student@taejae.ac.kr",
      password: testPassword,
      name: "김태재",
      nameEn: "Kim Taejae",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "데이터과학과 인공지능학부",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "태재대학교 1기 재학생입니다. AI와 데이터사이언스에 관심이 많습니다.",
      linkedinUrl: "https://linkedin.com",
      isPublic: true,
    },
  });

  await prisma.post.upsert({
    where: { id: "welcome-post-001" },
    update: {},
    create: {
      id: "welcome-post-001",
      title: "태재대학교 동문회 커뮤니티에 오신 것을 환영합니다!",
      content: `Great Harmony — 태재인 여러분, 환영합니다!\n\n이 커뮤니티는 태재대학교 재학생, 동문, 교직원, 그리고 후원자들이 함께 소통하고 네트워크를 형성하는 공간입니다.\n\n📌 주요 기능:\n- 동문 디렉토리: 기수별 동문 검색 및 연결\n- 커뮤니티 게시판: 공지, 이벤트, 멘토링, 취업 정보\n- 글로벌 지도: 전 세계 태재인 위치 확인\n\n서울에서 시작해 뉴욕, 도쿄까지 — 전 세계 태재인과 함께합니다.`,
      category: "NOTICE",
      isPinned: true,
      authorId: admin.id,
    },
  });

  console.log("Seed completed.");
}

main().finally(() => prisma.$disconnect());
