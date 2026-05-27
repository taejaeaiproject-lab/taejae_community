import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { _count: { select: { comments: true } } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { title, description, tags, status, teamMembers, demoUrl, githubUrl, order } = await req.json();
  if (!title || !description) return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  const project = await prisma.project.create({
    data: { title, description, tags, status: status || "ONGOING", teamMembers, demoUrl, githubUrl, order: order || 0 },
  });
  return NextResponse.json(project, { status: 201 });
}
