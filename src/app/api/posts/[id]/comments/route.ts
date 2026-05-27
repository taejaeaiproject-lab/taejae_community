import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  const { content, parentId } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
      parentId: parentId ?? null,
    },
    include: {
      author: { select: { id: true, name: true, role: true, cohort: true } },
      replies: {
        include: { author: { select: { id: true, name: true, role: true, cohort: true } } },
      },
      _count: { select: { likes: true } },
    },
  });

  return NextResponse.json({ ...comment, liked: false }, { status: 201 });
}
