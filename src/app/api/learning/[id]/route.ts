import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const raw = await req.json();
  const data = {
    title: raw.title,
    description: raw.description,
    category: raw.category,
    instructor: raw.instructor || null,
    tags: raw.tags || null,
  };
  const item = await prisma.learningContent.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.learningContent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
