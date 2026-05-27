import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendRegistrationEmail, sendNewApplicantNotification } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, nameEn, role, cohort, major } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        nameEn,
        role,
        cohort: cohort ? parseInt(cohort) : null,
        major,
        status: "PENDING",
      },
    });

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN", status: "APPROVED" },
      select: { email: true },
    });

    await Promise.allSettled([
      sendRegistrationEmail(user.email, user.name),
      ...admins.map((a) =>
        sendNewApplicantNotification(a.email, user.name, user.email, role)
      ),
    ]);

    return NextResponse.json({ message: "가입 신청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다." });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
