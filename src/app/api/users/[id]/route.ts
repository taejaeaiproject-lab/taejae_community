import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id, status: "APPROVED" },
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
      instagramUrl: true,
      company: true,
      jobTitle: true,
      graduationYear: true,
      isPublic: true,
      createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!user.isPublic && session.user.id !== id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Private profile" }, { status: 403 });
  }

  // Check if current user has sent a mentor request to this user
  const mentorRequest = await prisma.mentorRequest.findUnique({
    where: { fromUserId_toUserId: { fromUserId: session.user.id, toUserId: id } },
    select: { id: true, status: true },
  });

  return NextResponse.json({ ...user, mentorRequestStatus: mentorRequest?.status ?? null });
}
