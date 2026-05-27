import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("postgresql") || url.startsWith("postgres")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: url });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require("@prisma/adapter-libsql");
  const dbUrl = url || `file:${path.resolve(process.cwd(), "dev.db")}`;
  return new PrismaClient({ adapter: new PrismaLibSql({ url: dbUrl }) });
}

const prisma = createPrisma();

async function main() {
  const adminPw = await bcrypt.hash("admin1234!", 12);
  const userPw  = await bcrypt.hash("test1234!", 12);

  // ── 관리자 ─────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@taejae.ac.kr" },
    update: {},
    create: {
      email: "admin@taejae.ac.kr",
      password: adminPw,
      name: "관리자",
      nameEn: "Admin",
      role: "ADMIN",
      status: "APPROVED",
      isPublic: false,
    },
  });

  // ── 교직원 ─────────────────────────────────────────────────────────
  const faculty1 = await prisma.user.upsert({
    where: { email: "prof.kim@taejae.ac.kr" },
    update: {},
    create: {
      email: "prof.kim@taejae.ac.kr",
      password: userPw,
      name: "김성호",
      nameEn: "Kim Seongho",
      role: "FACULTY",
      status: "APPROVED",
      jobTitle: "교수",
      company: "태재대학교",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "비판적 사고와 글로벌 리더십 담당 교수. 하버드 교육대학원 박사 졸업 후 태재대학교 설립 초기부터 함께했습니다.",
      isPublic: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "prof.lee@taejae.ac.kr" },
    update: {},
    create: {
      email: "prof.lee@taejae.ac.kr",
      password: userPw,
      name: "이혜진",
      nameEn: "Lee Hyejin",
      role: "FACULTY",
      status: "APPROVED",
      jobTitle: "교수",
      company: "태재대학교",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "데이터과학 및 인공지능 교육 담당. MIT 컴퓨터과학과 출신으로 AI가 교육을 어떻게 바꿀 수 있는지 연구합니다.",
      isPublic: true,
    },
  });

  // ── 1기 재학생 (2023 입학 · 현재 베이징/선전 캠퍼스) ──────────────
  const s1_1 = await prisma.user.upsert({
    where: { email: "junseo@taejae.ac.kr" },
    update: {},
    create: {
      email: "junseo@taejae.ac.kr",
      password: userPw,
      name: "이준서",
      nameEn: "Lee Junseo",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "데이터과학과 인공지능학부",
      currentCity: "Beijing",
      currentCountry: "China",
      bio: "1기 재학생. AI와 교육의 교차점을 탐구합니다. 베이징 캠퍼스에서 6학기 중.",
      linkedinUrl: "https://linkedin.com",
      isPublic: true,
    },
  });

  const s1_2 = await prisma.user.upsert({
    where: { email: "seoyeon@taejae.ac.kr" },
    update: {},
    create: {
      email: "seoyeon@taejae.ac.kr",
      password: userPw,
      name: "박서연",
      nameEn: "Park Seoyeon",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "비즈니스혁신학부",
      currentCity: "Beijing",
      currentCountry: "China",
      bio: "비즈니스혁신학부 1기. 소셜 임팩트 스타트업에 관심이 많고, 중국 시장을 직접 경험 중입니다.",
      isPublic: true,
    },
  });

  const s1_3 = await prisma.user.upsert({
    where: { email: "minjun@taejae.ac.kr" },
    update: {},
    create: {
      email: "minjun@taejae.ac.kr",
      password: userPw,
      name: "최민준",
      nameEn: "Choi Minjun",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "인문사회학부",
      currentCity: "Shenzhen",
      currentCountry: "China",
      bio: "인문사회학부 1기. 동아시아 정치경제와 청년 세대 연구에 관심. 선전에서 지속가능성 프로젝트 진행 중.",
      isPublic: true,
    },
  });

  const s1_4 = await prisma.user.upsert({
    where: { email: "jiyu@taejae.ac.kr" },
    update: {},
    create: {
      email: "jiyu@taejae.ac.kr",
      password: userPw,
      name: "김지유",
      nameEn: "Kim Jiyu",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "자연과학학부",
      currentCity: "Beijing",
      currentCountry: "China",
      bio: "자연과학학부 1기. 기후과학과 환경정책을 연결하는 연구를 꿈꿉니다. 베이징 환경연구소와 협력 프로젝트 진행 중.",
      isPublic: true,
    },
  });

  const s1_5 = await prisma.user.upsert({
    where: { email: "haeun@taejae.ac.kr" },
    update: {},
    create: {
      email: "haeun@taejae.ac.kr",
      password: userPw,
      name: "윤하은",
      nameEn: "Yoon Haeun",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "데이터과학과 인공지능학부",
      currentCity: "Shenzhen",
      currentCountry: "China",
      bio: "AI 윤리와 알고리즘 공정성 연구. 선전의 빠른 기술 생태계를 직접 경험하며 많은 것을 배우고 있습니다.",
      linkedinUrl: "https://linkedin.com",
      isPublic: true,
    },
  });

  const s1_6 = await prisma.user.upsert({
    where: { email: "woojin@taejae.ac.kr" },
    update: {},
    create: {
      email: "woojin@taejae.ac.kr",
      password: userPw,
      name: "정우진",
      nameEn: "Jeong Woojin",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 1,
      major: "비즈니스혁신학부",
      currentCity: "Beijing",
      currentCountry: "China",
      bio: "비즈니스혁신학부 1기. 핀테크와 디지털 금융에 관심. 베이징에서 중국 스타트업 생태계를 연구합니다.",
      isPublic: true,
    },
  });

  // ── 2기 재학생 (2024 입학 · 현재 뉴욕/샌프란시스코 캠퍼스) ─────────
  const s2_1 = await prisma.user.upsert({
    where: { email: "sua@taejae.ac.kr" },
    update: {},
    create: {
      email: "sua@taejae.ac.kr",
      password: userPw,
      name: "한수아",
      nameEn: "Han Sua",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 2,
      major: "데이터과학과 인공지능학부",
      currentCity: "New York",
      currentCountry: "United States",
      bio: "2기 재학생. 헬스케어 데이터 분석에 관심. 뉴욕 캠퍼스에서 다양한 배경의 동료들과 협업 중.",
      isPublic: true,
    },
  });

  const s2_2 = await prisma.user.upsert({
    where: { email: "taeyang@taejae.ac.kr" },
    update: {},
    create: {
      email: "taeyang@taejae.ac.kr",
      password: userPw,
      name: "오태양",
      nameEn: "Oh Taeyang",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 2,
      major: "인문사회학부",
      currentCity: "San Francisco",
      currentCountry: "United States",
      bio: "인문사회학부 2기. 테크 기업의 사회적 책임에 관심. 실리콘밸리에서 현장을 직접 경험 중입니다.",
      isPublic: true,
    },
  });

  const s2_3 = await prisma.user.upsert({
    where: { email: "chaewon@taejae.ac.kr" },
    update: {},
    create: {
      email: "chaewon@taejae.ac.kr",
      password: userPw,
      name: "임채원",
      nameEn: "Lim Chaewon",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 2,
      major: "비즈니스혁신학부",
      currentCity: "New York",
      currentCountry: "United States",
      bio: "비즈니스혁신 2기. 글로벌 소비재 브랜딩과 마케팅 전략에 관심. 뉴욕에서 현지 스타트업과 협력 프로젝트 진행 중.",
      linkedinUrl: "https://linkedin.com",
      isPublic: true,
    },
  });

  const s2_4 = await prisma.user.upsert({
    where: { email: "yerin@taejae.ac.kr" },
    update: {},
    create: {
      email: "yerin@taejae.ac.kr",
      password: userPw,
      name: "신예린",
      nameEn: "Shin Yerin",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 2,
      major: "자연과학학부",
      currentCity: "San Francisco",
      currentCountry: "United States",
      bio: "자연과학 2기. 생명과학과 AI 융합에 관심. 베이 에어리어의 바이오테크 생태계를 탐구 중.",
      isPublic: true,
    },
  });

  // ── 3기 재학생 (2025 입학 · 현재 서울 캠퍼스) ───────────────────────
  const s3_1 = await prisma.user.upsert({
    where: { email: "minseo@taejae.ac.kr" },
    update: {},
    create: {
      email: "minseo@taejae.ac.kr",
      password: userPw,
      name: "강민서",
      nameEn: "Kang Minseo",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 3,
      major: "데이터과학과 인공지능학부",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "3기 신입생. 교육 AI에 관심이 많아 태재를 선택했습니다. 서울 캠퍼스에서 열심히 기초를 쌓는 중.",
      isPublic: true,
    },
  });

  const s3_2 = await prisma.user.upsert({
    where: { email: "junhyeok@taejae.ac.kr" },
    update: {},
    create: {
      email: "junhyeok@taejae.ac.kr",
      password: userPw,
      name: "배준혁",
      nameEn: "Bae Junhyeok",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 3,
      major: "인문사회학부",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "인문사회학부 3기. 국제관계와 외교정책을 공부하고 싶어 입학했습니다. 비판적 사고 수업이 시각을 넓혀주고 있습니다.",
      isPublic: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "harin@taejae.ac.kr" },
    update: {},
    create: {
      email: "harin@taejae.ac.kr",
      password: userPw,
      name: "류하린",
      nameEn: "Ryu Harin",
      role: "STUDENT",
      status: "APPROVED",
      cohort: 3,
      major: "비즈니스혁신학부",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "비즈니스혁신 3기. 사회적 기업과 임팩트 투자에 관심. 태재의 글로벌 여정이 기대됩니다.",
      isPublic: true,
    },
  });

  // ── 후원자 ─────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "sponsor@hanaem.com" },
    update: {},
    create: {
      email: "sponsor@hanaem.com",
      password: userPw,
      name: "이재한",
      nameEn: "Lee Jaehan",
      role: "SPONSOR",
      status: "APPROVED",
      company: "한샘",
      jobTitle: "이사",
      currentCity: "Seoul",
      currentCountry: "South Korea",
      bio: "태재대학교의 교육 혁신 비전에 공감하여 후원하고 있습니다. 다음 세대 글로벌 리더 양성을 응원합니다.",
      isPublic: true,
    },
  });

  // ── Learning Content ───────────────────────────────────────────────
  const learningItems = [
    {
      title: "비판적 사고와 논증",
      description: "모든 태재인의 필수 공통과목. 주장의 구조를 파악하고 논리적 오류를 식별하며 설득력 있는 글쓰기와 토론을 훈련합니다. 20명 이하 소규모 세미나로 진행되며 매 수업 전 사전 읽기 자료가 제공됩니다.",
      category: "COURSE",
      instructor: "김성호 교수",
      tags: "필수, 비판적사고, 논증, 글쓰기",
    },
    {
      title: "글로벌 리더십 세미나",
      description: "다양성 추구의 글로벌 리더십을 기르는 세미나. 세계 각지의 사례를 분석하고 공감과 공존의 리더십 스타일을 탐구합니다. 캠퍼스 이동과 연계해 현지 리더들과의 만남도 포함됩니다.",
      category: "SEMINAR",
      instructor: "김성호 교수",
      tags: "리더십, 글로벌, 다양성, 세미나",
    },
    {
      title: "데이터 과학 기초",
      description: "데이터 수집·정제·시각화·분석의 기초를 다룹니다. Python과 주요 데이터 분석 라이브러리를 활용하며, 실제 사회 문제 데이터셋으로 실습합니다. 비전공자도 수강 가능한 입문 과목입니다.",
      category: "COURSE",
      instructor: "이혜진 교수",
      tags: "데이터, Python, 분석, 시각화",
    },
    {
      title: "인공지능과 사회",
      description: "AI 기술이 경제·노동·교육·윤리에 미치는 영향을 다학제적으로 탐구합니다. 알고리즘 편향, AI 거버넌스, 미래 일자리를 주제로 토론하며, 전공 무관 수강 가능한 핵심 교양 과목입니다.",
      category: "COURSE",
      instructor: "이혜진 교수",
      tags: "AI, 윤리, 사회, 미래기술",
    },
    {
      title: "비즈니스 혁신과 창업",
      description: "린 스타트업 방법론, 비즈니스 모델 캔버스, 고객 발견 인터뷰를 실습합니다. 팀을 구성해 실제 문제를 정의하고 프로토타입을 만들어 피칭하는 과정으로 진행됩니다.",
      category: "WORKSHOP",
      instructor: "김성호 교수",
      tags: "창업, 비즈니스모델, 린스타트업, 팀프로젝트",
    },
    {
      title: "다문화 소통과 협업",
      description: "서로 다른 문화적 배경을 가진 팀원들과 효과적으로 소통하고 협업하는 방법을 탐구합니다. 글로벌 캠퍼스 이동 전 필수 이수 권장 과목입니다.",
      category: "SEMINAR",
      instructor: "이혜진 교수",
      tags: "다문화, 협업, 소통, 글로벌",
    },
  ];

  for (let i = 0; i < learningItems.length; i++) {
    await prisma.learningContent.create({ data: { ...learningItems[i], order: i } }).catch(() => {});
  }

  // ── Activity Content (액티브 러닝 세션) ────────────────────────────
  const activityItems = [
    {
      title: "베이징 지속가능성 해커톤",
      description: "1기 학생들이 베이징 캠퍼스에서 진행한 48시간 해커톤. '2030 동아시아 탄소중립 로드맵'을 주제로 6개 팀이 솔루션을 개발했습니다. 현지 환경 스타트업과 협력해 실제 데이터를 활용한 프로토타입을 발표했습니다.",
      type: "SESSION",
      date: "2026-04-18",
      tags: "해커톤, 지속가능성, 베이징, 1기",
    },
    {
      title: "선전 스타트업 이머전 프로그램",
      description: "세계 최대 스타트업 밀집 도시 선전에서 진행된 현장 학습. DJI, BYD, 화웨이 등 현지 혁신 기업 방문과 함께, 선전 스타트업 창업자들과의 소규모 세션으로 구성됐습니다. 빠른 실행과 실패를 통한 학습을 직접 경험했습니다.",
      type: "WORKSHOP",
      date: "2026-03-07",
      tags: "스타트업, 선전, 현장학습, 혁신",
    },
    {
      title: "뉴욕 임팩트 투자 세션",
      description: "2기 학생들이 뉴욕 캠퍼스에서 진행한 임팩트 투자 액티브 러닝 세션. 월스트리트 출신 투자자와 소셜 벤처 창업자가 멘토로 참여해 'ESG 투자의 현재와 미래'를 주제로 심층 토론을 펼쳤습니다.",
      type: "SESSION",
      date: "2026-02-21",
      tags: "임팩트투자, 뉴욕, ESG, 2기",
    },
    {
      title: "서울 글로벌 리더십 포럼",
      description: "서울 캠퍼스 전체 학기 개막 행사로 진행된 리더십 포럼. 태재대학교 교수진과 외부 연사가 함께 '21세기 리더십이란 무엇인가'를 주제로 강연과 소그룹 토의를 진행했습니다. 전 기수 학생과 교직원이 함께했습니다.",
      type: "SESSION",
      date: "2025-09-05",
      tags: "리더십, 포럼, 서울, 전기수",
    },
    {
      title: "샌프란시스코 AI 연구소 탐방",
      description: "실리콘밸리 AI 연구소 및 테크 기업 탐방 프로그램. OpenAI, Anthropic, Stanford AI Lab 방문 후 각 기관 연구원과의 Q&A 세션. 2기 학생들이 현장에서 AI 연구의 최전선을 경험했습니다.",
      type: "WORKSHOP",
      date: "2025-11-14",
      tags: "AI, 실리콘밸리, 탐방, 2기",
    },
    {
      title: "1기 자기주도학습 성찰 세션",
      description: "1기 학생들의 3년 과정을 돌아보는 자기주도학습 성찰 세션. 포트폴리오 발표와 상호 피드백을 통해 각자의 학습 여정을 정리하고 남은 1년의 목표를 설계했습니다.",
      type: "SESSION",
      date: "2026-01-30",
      tags: "성찰, 자기주도, 포트폴리오, 1기",
    },
  ];

  for (let i = 0; i < activityItems.length; i++) {
    await prisma.activityContent.create({ data: { ...activityItems[i], order: i } }).catch(() => {});
  }

  // ── Projects ───────────────────────────────────────────────────────
  const proj1 = await prisma.project.create({
    data: {
      title: "EduAI — AI 기반 개인화 학습 플랫폼",
      description: "태재의 액티브 러닝 철학을 기술로 구현하는 프로젝트. 학생 개개인의 학습 패턴을 분석해 맞춤형 사전학습 자료와 토론 주제를 추천하는 AI 플랫폼을 개발하고 있습니다.\n\n서울·뉴욕·베이징 캠퍼스에서 파일럿 테스트를 완료했으며, 현재 피드백을 반영해 v2.0 개발 중입니다. 궁극적으로 태재의 전 과목에 적용하는 것이 목표입니다.",
      tags: "AI, 교육, Python, Next.js, 머신러닝",
      status: "ONGOING",
      teamMembers: "이준서, 윤하은, 한수아",
      githubUrl: "https://github.com",
      order: 0,
    },
  });

  const proj2 = await prisma.project.create({
    data: {
      title: "동아시아 청년 기후 행동 리포트",
      description: "한국·중국·일본 청년 세대의 기후변화 인식과 행동 패턴을 비교 연구한 프로젝트. 3개국 대학생 500명 설문, 15명 심층 인터뷰, 정책 분석을 바탕으로 보고서를 완성했습니다.\n\n보고서는 서울 기후 주간 행사에서 발표됐으며, 환경부 산하 기관에 정책 제언으로 제출됐습니다.",
      tags: "기후변화, 동아시아, 정책연구, 청년",
      status: "COMPLETED",
      teamMembers: "최민준, 김지유, 배준혁",
      demoUrl: "https://taejae.ac.kr",
      order: 1,
    },
  });

  const proj3 = await prisma.project.create({
    data: {
      title: "글로벌 식량 안보 솔루션 — FoodBridge",
      description: "개발도상국 소농과 글로벌 식품 유통망을 연결하는 플랫폼 프로젝트. 뉴욕 캠퍼스 재학 중 FAO(유엔식량농업기구)와 협력해 아이디어를 발전시켰습니다.\n\n현재 케냐 농업부와 파트너십 논의 중이며, 2026년 하반기 파일럿 런칭을 목표로 하고 있습니다.",
      tags: "식량안보, 임팩트, 플랫폼, UN협력",
      status: "ONGOING",
      teamMembers: "임채원, 오태양, 신예린",
      order: 2,
    },
  });

  await prisma.project.create({
    data: {
      title: "K-스타트업 글로벌 진출 가이드북",
      description: "한국 초기 스타트업이 미국·중국·일본 시장에 진출할 때 실질적으로 필요한 정보를 정리한 가이드북. 태재 학생들이 각 캠퍼스에서 현지 창업 생태계를 직접 경험하며 수집한 인사이트를 담았습니다.\n\n미국·중국·일본 편 3권으로 구성됐으며, 현재 중소벤처기업부 스타트업 지원 프로그램에서 교재로 활용 중입니다.",
      tags: "스타트업, 글로벌진출, 가이드북, 한중일",
      status: "COMPLETED",
      teamMembers: "박서연, 정우진, 강민서",
      demoUrl: "https://taejae.ac.kr",
      order: 3,
    },
  });

  // 프로젝트 댓글 샘플
  await prisma.projectComment.create({
    data: {
      projectId: proj1.id,
      authorName: "김철수",
      content: "EduAI 정말 기대됩니다! 태재의 액티브 러닝을 기술로 확장하는 방향이 인상적이네요. v2.0 언제 공개되나요?",
    },
  });

  await prisma.projectComment.create({
    data: {
      projectId: proj1.id,
      authorName: "이민지",
      content: "저도 교육 AI에 관심이 많아서 관심있게 보고 있어요. 오픈소스로 공개할 계획이 있나요?",
    },
  });

  await prisma.projectComment.create({
    data: {
      projectId: proj2.id,
      authorName: "박현우",
      content: "동아시아 3국 청년 비교 연구라니 정말 의미있는 작업이네요. 전체 보고서를 어디서 볼 수 있나요?",
    },
  });

  await prisma.projectComment.create({
    data: {
      projectId: proj3.id,
      authorName: "정소희",
      content: "FoodBridge 아이디어 너무 좋아요. 케냐 파일럿 결과가 정말 궁금합니다. 응원합니다!",
    },
  });

  // ── 게시글 ─────────────────────────────────────────────────────────
  await prisma.post.upsert({
    where: { id: "notice-001" },
    update: {},
    create: {
      id: "notice-001",
      title: "태재대학교 동문 커뮤니티에 오신 것을 환영합니다",
      content: `Great Harmony — 태재인 여러분, 환영합니다!\n\n이 커뮤니티는 태재대학교 재학생, 동문, 교직원, 후원자가 함께 소통하고 네트워크를 형성하는 공간입니다.\n\n서울 → 샌프란시스코 → 뉴욕 → 선전 → 베이징 → 유럽 → 도쿄, 전 세계를 무대로 공부하는 태재인들이 이 공간에서 이어집니다.\n\n커뮤니티를 통해 프로젝트 협업 파트너를 찾고, 선후배 멘토링을 연결하고, 각 캠퍼스의 생생한 경험을 나눠주세요.`,
      category: "NOTICE",
      isPinned: true,
      authorId: admin.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "notice-002" },
    update: {},
    create: {
      id: "notice-002",
      title: "[공지] 2026 태재 글로벌 서밋 — 7월 서울 개최",
      content: `전 기수 재학생과 교직원이 한자리에 모이는 연례 행사 '2026 태재 글로벌 서밋'이 7월 서울 캠퍼스에서 개최됩니다.\n\n📅 일시: 2026년 7월 18~19일\n📍 장소: 태재대학교 서울 캠퍼스\n\n주요 프로그램:\n- 각 캠퍼스 프로젝트 발표 및 시상\n- 선후배 멘토링 매칭 세션\n- 글로벌 리더십 특별 강연\n- 1기~3기 전체 네트워킹 만찬\n\n참가 신청은 5월 말 별도 안내 예정입니다.`,
      category: "EVENT",
      isPinned: false,
      authorId: faculty1.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post-001" },
    update: {},
    create: {
      id: "post-001",
      title: "베이징 생활 적응기 — 6학기를 시작하며",
      content: `베이징 캠퍼스 입성한 지 두 달이 됐습니다. 선전에서 베이징으로 이동하면서 도시 분위기가 완전히 달라지는 걸 느꼈어요.\n\n선전이 역동적이고 빠른 스타트업 도시라면, 베이징은 역사와 정책의 도시라는 느낌? 대학원생들이 많고 연구 분위기가 강합니다.\n\n수업은 계속 온라인 액티브 러닝으로 진행되는데, 베이징 현지 기업과 연계한 케이스 스터디가 이번 학기 하이라이트입니다. 같은 캠퍼스 있는 분들 밥 한 번 같이 먹어요!`,
      category: "GENERAL",
      isPinned: false,
      authorId: s1_1.id,
    },
  });

  await prisma.post.upsert({
    where: { id: "post-002" },
    update: {},
    create: {
      id: "post-002",
      title: "데이터과학 전공 멘토 찾습니다 (3기 → 1,2기)",
      content: `안녕하세요, 3기 강민서입니다.\n\n데이터과학 전공을 선택했는데 Python 기초는 어느 정도 됩니다만, 태재 수업에서 어떤 방식으로 공부하는 게 효과적인지 선배들의 조언이 너무 듣고 싶습니다.\n\n특히 이런 게 궁금해요:\n- 사전 학습 자료 어떻게 소화하셨나요?\n- 팀 프로젝트 주제 어떻게 잡으셨나요?\n- 첫 캠퍼스 이동(3학기 샌프란시스코) 준비 어떻게 하셨나요?\n\n편하게 댓글이나 DM 주세요 :)`,
      category: "MENTOR",
      isPinned: false,
      authorId: s3_1.id,
    },
  });

  console.log("✅ 시드 데이터 생성 완료");
  console.log("   - 관리자 1명, 교직원 2명, 후원자 1명");
  console.log("   - 1기 6명 (베이징/선전), 2기 4명 (뉴욕/샌프란시스코), 3기 3명 (서울)");
  console.log("   - Learning 6개, Activity 6개, Project 4개");
  console.log("   - 게시글 4개, 프로젝트 댓글 4개");
}

main().finally(() => prisma.$disconnect());
