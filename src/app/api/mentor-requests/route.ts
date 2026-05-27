import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { toUserId, message } = await req.json();
  if (!toUserId) return NextResponse.json({ error: "toUserId required" }, { status: 400 });
  if (toUserId === session.user.id) return NextResponse.json({ error: "자신에게 요청할 수 없습니다." }, { status: 400 });

  const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
  if (!toUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = await prisma.mentorRequest.findUnique({
    where: { fromUserId_toUserId: { fromUserId: session.user.id, toUserId } },
  });
  if (existing) return NextResponse.json({ error: "이미 요청을 보냈습니다.", status: existing.status }, { status: 409 });

  const request = await prisma.mentorRequest.create({
    data: { fromUserId: session.user.id, toUserId, message: message || null },
  });

  return NextResponse.json(request, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [received, sent] = await Promise.all([
    prisma.mentorRequest.findMany({
      where: { toUserId: session.user.id },
      include: { fromUser: { select: { id: true, name: true, nameEn: true, role: true, cohort: true, major: true, jobTitle: true, company: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.mentorRequest.findMany({
      where: { fromUserId: session.user.id },
      include: { toUser: { select: { id: true, name: true, nameEn: true, role: true, cohort: true, major: true, jobTitle: true, company: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ received, sent });
}
