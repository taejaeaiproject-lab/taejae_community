import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.learningContent.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, description, category, instructor, tags, order } = await req.json();
  if (!title || !description) return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  const item = await prisma.learningContent.create({
    data: { title, description, category: category || "COURSE", instructor, tags, order: order || 0 },
  });
  return NextResponse.json(item, { status: 201 });
}
