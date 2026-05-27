import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "no-key");
}
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const SITE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function sendApprovalEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "[태재 커뮤니티] 가입이 승인되었습니다 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#1a3a5c,#c9a227);line-height:56px;text-align:center;font-size:24px;color:#fff;font-weight:bold">泰</div>
        </div>
        <h2 style="color:#1a3a5c;text-align:center;margin-bottom:8px">가입이 승인되었습니다!</h2>
        <p style="color:#555;text-align:center;margin-bottom:32px">Great Harmony — 태재 커뮤니티에 오신 것을 환영합니다</p>
        <p style="color:#333">안녕하세요, <strong>${name}</strong>님 👋</p>
        <p style="color:#555;line-height:1.7">
          태재대학교 동문회 커뮤니티 가입 신청이 <strong style="color:#1a3a5c">승인</strong>되었습니다.<br>
          이제 로그인하여 동문 디렉토리, 커뮤니티 게시판, 이벤트 캘린더 등 모든 기능을 이용하실 수 있습니다.
        </p>
        <div style="text-align:center;margin:32px 0">
          <a href="${SITE_URL}/login" style="display:inline-block;padding:14px 32px;background:#1a3a5c;color:#fff;border-radius:12px;text-decoration:none;font-weight:600">
            커뮤니티 입장하기 →
          </a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0">
        <p style="color:#999;font-size:12px;text-align:center">태재대학교 동문회 커뮤니티 · taejae.ac.kr</p>
      </div>`,
  });
}

export async function sendRejectionEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "[태재 커뮤니티] 가입 신청 검토 결과 안내",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <h2 style="color:#1a3a5c;text-align:center">가입 신청 검토 결과</h2>
        <p style="color:#333">안녕하세요, <strong>${name}</strong>님</p>
        <p style="color:#555;line-height:1.7">
          죄송합니다. 현재 제출하신 정보로는 가입 승인이 어렵습니다.<br>
          추가 문의사항이 있으시면 관리자에게 직접 연락해주세요.
        </p>
        <p style="color:#999;font-size:12px;text-align:center;margin-top:32px">태재대학교 동문회 커뮤니티 · taejae.ac.kr</p>
      </div>`,
  });
}

export async function sendNewApplicantNotification(adminEmail: string, applicantName: string, applicantEmail: string, role: string) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[태재 커뮤니티] 새 가입 신청: ${applicantName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <h2 style="color:#1a3a5c">새 가입 신청이 접수되었습니다</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;color:#666;width:100px">이름</td><td style="padding:8px;font-weight:600">${applicantName}</td></tr>
          <tr style="background:#f8f9fa"><td style="padding:8px;color:#666">이메일</td><td style="padding:8px">${applicantEmail}</td></tr>
          <tr><td style="padding:8px;color:#666">구분</td><td style="padding:8px">${role}</td></tr>
        </table>
        <a href="${SITE_URL}/admin" style="display:inline-block;padding:12px 24px;background:#1a3a5c;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;margin-top:8px">
          관리자 패널에서 검토하기
        </a>
      </div>`,
  });
}

export async function sendRegistrationEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "[태재 커뮤니티] 가입 신청이 접수되었습니다",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <div style="text-align:center;margin-bottom:24px">
          <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#1a3a5c,#c9a227);line-height:56px;text-align:center;font-size:24px;color:#fff;font-weight:bold">泰</div>
        </div>
        <h2 style="color:#1a3a5c;text-align:center">가입 신청이 접수되었습니다</h2>
        <p style="color:#333">안녕하세요, <strong>${name}</strong>님</p>
        <p style="color:#555;line-height:1.7">
          태재대학교 동문회 커뮤니티 가입 신청이 정상적으로 접수되었습니다.<br>
          관리자 검토 후 승인되면 이메일로 안내드립니다. <strong>보통 1~3 영업일</strong> 소요됩니다.
        </p>
        <p style="color:#999;font-size:12px;text-align:center;margin-top:32px">태재대학교 동문회 커뮤니티 · taejae.ac.kr</p>
      </div>`,
  });
}
