import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/resend";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, nameEn: true, email: true, role: true,
      status: true, cohort: true, major: true, createdAt: true, company: true,
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, status } = await req.json();
  if (!userId || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status, approvedById: session.user.id },
    select: { id: true, name: true, email: true, status: true },
  });

  await Promise.allSettled([
    status === "APPROVED"
      ? sendApprovalEmail(updated.email, updated.name)
      : sendRejectionEmail(updated.email, updated.name),
  ]);

  return NextResponse.json(updated);
}
