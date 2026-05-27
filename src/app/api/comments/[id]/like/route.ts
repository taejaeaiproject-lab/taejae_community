import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: commentId } = await params;

  const existing = await prisma.like.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await prisma.like.count({ where: { commentId } });
    return NextResponse.json({ liked: false, count });
  }

  await prisma.like.create({ data: { userId: session.user.id, commentId } });
  const count = await prisma.like.count({ where: { commentId } });
  return NextResponse.json({ liked: true, count });
}
