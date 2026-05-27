import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_EMAIL = "taejae.ai.project@gmail.com";
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "이메일 서비스가 설정되지 않았습니다." }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `[태재 커뮤니티 문의] ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8f9fa">
        <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
            <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#1a3a5c,#c9a227);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;font-weight:bold;text-align:center;line-height:44px">泰</div>
            <div>
              <div style="font-weight:700;color:#1a3a5c;font-size:16px">태재대학교 동문회 커뮤니티</div>
              <div style="color:#999;font-size:12px">새 문의가 도착했습니다</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#666;font-size:13px;width:80px;vertical-align:top">이름</td>
              <td style="padding:10px 0;font-weight:600;font-size:13px;color:#111">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#666;font-size:13px;vertical-align:top">이메일</td>
              <td style="padding:10px 0;font-size:13px"><a href="mailto:${email}" style="color:#1a3a5c">${email}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #eee">
              <td style="padding:10px 0;color:#666;font-size:13px;vertical-align:top">문의 유형</td>
              <td style="padding:10px 0;font-size:13px;color:#111">${subject}</td>
            </tr>
          </table>
          <div style="background:#f8f9fa;border-radius:12px;padding:20px">
            <div style="font-size:12px;color:#999;margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">메시지</div>
            <div style="font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap">${message}</div>
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #eee;text-align:center">
            <p style="color:#999;font-size:11px">Reply-To가 설정되어 있어 이 이메일에 바로 답장할 수 있습니다</p>
          </div>
        </div>
      </div>`,
  });

  return NextResponse.json({ ok: true });
}
