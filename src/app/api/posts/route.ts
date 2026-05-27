import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (category && category !== "ALL") where.category = category;

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, role: true, cohort: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, category } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      category: category || "GENERAL",
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, role: true, cohort: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
