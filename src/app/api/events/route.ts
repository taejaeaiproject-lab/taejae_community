import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.event.findMany({
    include: { author: { select: { id: true, name: true, role: true } } },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, location, isOnline, startDate, endDate } = await req.json();
  if (!title || !startDate) {
    return NextResponse.json({ error: "제목과 시작일을 입력해주세요." }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description || "",
      location,
      isOnline: !!isOnline,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      authorId: session.user.id,
    },
    include: { author: { select: { id: true, name: true, role: true } } },
  });

  return NextResponse.json(event, { status: 201 });
}
