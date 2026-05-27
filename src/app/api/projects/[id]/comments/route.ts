import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { content, authorName } = await req.json();
  if (!content?.trim() || !authorName?.trim()) {
    return NextResponse.json({ error: "이름과 내용을 입력해주세요." }, { status: 400 });
  }
  const comment = await prisma.projectComment.create({
    data: { content: content.trim(), authorName: authorName.trim(), projectId: id },
  });
  return NextResponse.json(comment, { status: 201 });
}
