import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, nameEn: true, email: true, role: true,
      cohort: true, major: true, currentCity: true, currentCountry: true,
      bio: true, linkedinUrl: true, instagramUrl: true,
      company: true, jobTitle: true, graduationYear: true, isPublic: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    nameEn, currentCity, currentCountry, bio,
    linkedinUrl, instagramUrl, company, jobTitle, isPublic,
  } = body;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { nameEn, currentCity, currentCountry, bio, linkedinUrl, instagramUrl, company, jobTitle, isPublic },
    select: {
      id: true, name: true, nameEn: true, email: true, role: true,
      cohort: true, major: true, currentCity: true, currentCountry: true,
      bio: true, linkedinUrl: true, instagramUrl: true, company: true, jobTitle: true, isPublic: true,
    },
  });

  return NextResponse.json(updated);
}
