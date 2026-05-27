import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const cohort = searchParams.get("cohort");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { status: "APPROVED", isPublic: true };
  if (role && role !== "ALL") where.role = role;
  if (cohort) where.cohort = parseInt(cohort);
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { nameEn: { contains: search } },
      { company: { contains: search } },
      { jobTitle: { contains: search } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      nameEn: true,
      role: true,
      cohort: true,
      major: true,
      currentCity: true,
      currentCountry: true,
      bio: true,
      linkedinUrl: true,
      profileImage: true,
      company: true,
      jobTitle: true,
      graduationYear: true,
    },
    orderBy: [{ cohort: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(users);
}
