@AGENTS.md

# 태재대학교 동문회 커뮤니티 — 프로젝트 가이드

## 프로젝트 개요

태재대학교(Taejae University) 재학생·동문·교직원·후원자가 함께 소통하는 커뮤니티 플랫폼.
교명의 뜻인 "Great Harmony(泰齋 — 동서양의 조화)"를 브랜드 정체성으로 삼는다.

- **운영 주체**: 태재대학교 동문회
- **주요 타겟**: 1~3기 재학생, 향후 졸업생(동문), 교직원, 외부 후원자/기업
- **브랜드 컬러**: 네이비 `#1a3a5c` (주), 골드 `#c9a227` (강조)
- **언어**: 한국어(기본) / 영어(이름·직책 등 선택 입력)

---

## 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| 프레임워크 | Next.js 16 (App Router) | proxy.ts = 구 middleware |
| 언어 | TypeScript | strict 모드 |
| 스타일 | Tailwind CSS v4 | 커스텀 CSS 변수 활용 |
| ORM | Prisma 7 | adapter 방식, schema에 url 없음 |
| DB (개발) | SQLite + libSQL (`@prisma/adapter-libsql`) | `DATABASE_URL=file:…` |
| DB (프로덕션) | Supabase PostgreSQL + pg (`@prisma/adapter-pg`) | `DATABASE_URL=postgresql://…` |
| 인증 | NextAuth.js v5 (beta) | JWT 세션, Credentials provider |
| 이메일 | Resend (무료: 3,000건/월) | 승인/거절/가입완료 알림 |
| 배포 | Vercel (프론트+API) + Supabase (DB) | |
| 아이콘 | lucide-react | |

### Next.js 16 주요 변경사항 (반드시 숙지)
- `middleware.ts` → **`proxy.ts`** (파일명·함수명 모두 변경)
- `proxy.ts`의 함수 export는 반드시 `export function proxy()` 또는 `export default`
- Prisma 7: `datasource` 블록에 `url` 속성 **불가** → `prisma.config.ts`의 `datasource.url`에 설정
- Prisma 7: `PrismaClient`는 반드시 `adapter` 옵션으로 초기화

---

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/              # 인증 페이지 (로그인·가입·대기)
│   ├── (main)/              # 로그인 후 페이지 (대시보드·디렉토리·커뮤니티 등)
│   ├── admin/               # 관리자 전용 (승인·회원·게시글 관리)
│   ├── api/                 # Route Handlers
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   ├── users/
│   │   ├── posts/
│   │   ├── events/
│   │   └── admin/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx             # 랜딩 페이지 (비로그인)
│   └── providers.tsx
├── components/
│   ├── Navbar.tsx
│   ├── RoleBadge.tsx
│   ├── PostCard.tsx
│   ├── MemberCard.tsx
│   ├── EventCard.tsx
│   ├── CommentThread.tsx    # 댓글+대댓글
│   ├── LikeButton.tsx
│   └── ui/                 # 재사용 UI 컴포넌트
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       └── Toast.tsx
├── lib/
│   ├── auth.ts              # NextAuth (prisma 의존, Node.js only)
│   ├── auth.config.ts       # NextAuth config (Edge-safe, proxy.ts에서 사용)
│   ├── prisma.ts            # PrismaClient 싱글톤
│   ├── resend.ts            # 이메일 전송 헬퍼
│   └── utils.ts             # 상수·유틸 함수
├── proxy.ts                 # Next.js 16 Proxy (구 middleware)
└── types/
    └── next-auth.d.ts       # Session 타입 확장
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
prisma.config.ts             # Prisma 7 설정 (datasource url 여기에)
```

---

## 데이터베이스 스키마

### User
| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (cuid) | PK |
| email | String (unique) | 로그인 이메일 |
| password | String | bcrypt 해시 |
| name | String | 한글 이름 |
| nameEn | String? | 영문 이름 |
| role | String | STUDENT / ALUMNI / FACULTY / SPONSOR / ADMIN |
| status | String | PENDING / APPROVED / REJECTED |
| cohort | Int? | 기수 (1, 2, 3, …) |
| major | String? | 전공학부 |
| currentCity | String? | 현재 도시 |
| currentCountry | String? | 현재 국가 |
| bio | String? | 자기소개 |
| linkedinUrl | String? | |
| instagramUrl | String? | |
| company | String? | 소속 회사 |
| jobTitle | String? | 직책 |
| graduationYear | Int? | 졸업 연도 |
| isPublic | Boolean | 디렉토리 공개 여부 (기본 true) |
| approvedById | String? | 승인한 관리자 ID |

### Post
| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (cuid) | PK |
| title | String | 제목 |
| content | String | 본문 |
| category | String | GENERAL / NOTICE / EVENT / JOB / MENTOR |
| isPinned | Boolean | 상단 고정 |
| authorId | String | FK → User |
| likeCount | Int | 집계 캐시 (likes 테이블과 별도) |

### Comment
| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (cuid) | PK |
| content | String | 내용 |
| postId | String | FK → Post |
| authorId | String | FK → User |
| parentId | String? | FK → Comment (대댓글용) |
| isDeleted | Boolean | 소프트 삭제 |

### Like
| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (cuid) | PK |
| userId | String | FK → User |
| postId | String? | FK → Post (둘 중 하나만) |
| commentId | String? | FK → Comment (둘 중 하나만) |
| @@unique([userId, postId]) | | 중복 좋아요 방지 |
| @@unique([userId, commentId]) | | |

### Event
| 필드 | 타입 | 설명 |
|------|------|------|
| id | String (cuid) | PK |
| title | String | 행사명 |
| description | String | 설명 |
| location | String? | 장소 |
| isOnline | Boolean | 온라인 여부 |
| startDate | DateTime | 시작일시 |
| endDate | DateTime? | 종료일시 |
| authorId | String | FK → User |

---

## 환경 변수 (`.env`)

```env
# 데이터베이스
# 개발: SQLite
DATABASE_URL="file:/절대경로/dev.db"
# 프로덕션: Supabase PostgreSQL (Transaction Pooler 권장)
# DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="최소-32자-랜덤-문자열"
NEXTAUTH_URL="http://localhost:3000"   # 프로덕션: https://yourdomain.com

# Resend (이메일)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"   # Resend에서 도메인 인증 필요
```

---

## Supabase 연동 방법

1. Supabase 프로젝트 생성 → Settings → Database → Connection string 복사
2. **Transaction Pooler** URL을 `DATABASE_URL`로 사용 (pgbouncer=true 필수)
3. **Direct connection** URL을 `DIRECT_URL`로 사용 (마이그레이션 전용)
4. `prisma.config.ts`에서 `datasource.url = process.env.DATABASE_URL` 설정
5. `src/lib/prisma.ts`에서 DB 종류에 따라 adapter 분기
6. `npx prisma migrate deploy` 실행

### prisma.config.ts 프로덕션 설정
```ts
datasource: {
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL, // 마이그레이션용
}
```

---

## 기능 목록

### 인증 & 접근 제어
- [x] 이메일/비밀번호 로그인 (JWT)
- [x] 관리자 승인 기반 회원가입
- [x] 역할별 접근 제어 (STUDENT, ALUMNI, FACULTY, SPONSOR, ADMIN)
- [x] proxy.ts에서 비인증 접근 차단

### 동문 디렉토리
- [x] 역할·기수·검색어 필터링
- [x] 공개/비공개 프로필 설정
- [ ] 멘토-멘티 연결 신청 (예정)

### 커뮤니티 게시판
- [x] 5개 카테고리 (공지·이벤트·멘토링·취업·자유)
- [x] 게시글 작성/삭제
- [x] 댓글
- [ ] **대댓글** (구현 예정)
- [ ] **좋아요** (게시글·댓글) (구현 예정)
- [x] 공지 글 상단 고정 (관리자)

### 이벤트 캘린더
- [ ] 행사 등록·수정·삭제 (구현 예정)
- [ ] 월별 캘린더 뷰 (구현 예정)
- [ ] 행사 상세 페이지 (구현 예정)

### 글로벌 지도
- [x] 캠퍼스별 동문 위치 현황
- [x] 글로벌 캠퍼스 순환 경로 표시

### 이메일 알림 (Resend)
- [ ] 가입 신청 접수 확인 (구현 예정)
- [ ] 관리자에게 신규 신청 알림 (구현 예정)
- [ ] 승인/거절 알림 → 신청자 (구현 예정)

### 관리자 패널
- [x] 가입 신청 승인/거절
- [x] 전체 회원 목록
- [ ] **게시글 삭제·핀 설정** (구현 예정)
- [ ] **댓글 삭제** (구현 예정)
- [ ] 통계 대시보드 (구현 예정)

---

## 개발 명령어

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run seed         # DB 초기 데이터 삽입
npm run db:reset     # DB 초기화 + 시드 재실행

# Prisma
npx prisma migrate dev --name <name>   # 개발 마이그레이션
npx prisma migrate deploy              # 프로덕션 마이그레이션 적용
npx prisma studio                      # DB GUI
```

---

## 테스트 계정

| 계정 | 이메일 | 비밀번호 | 역할 |
|------|--------|----------|------|
| 관리자 | admin@taejae.ac.kr | admin1234! | ADMIN |
| 재학생 | student@taejae.ac.kr | test1234! | STUDENT |

---

## 코딩 컨벤션

- **API 응답**: 성공 시 데이터 직접 반환, 실패 시 `{ error: "메시지" }` + 적절한 HTTP 상태코드
- **인증 확인**: API Route에서 `const session = await auth()` → `if (!session) return 401`
- **Prisma 쿼리**: `select`로 필요한 필드만 명시 (비밀번호 필드 절대 노출 금지)
- **타입**: `any` 사용 금지, 명시적 타입 정의
- **컴포넌트**: Server Component 기본, 인터랙션 필요 시 `"use client"` 명시
- **스타일**: Tailwind 클래스 우선, 인라인 스타일 지양
- **에러 처리**: try-catch는 API Route에만, 컴포넌트는 Error Boundary 활용

---

## 배포 (Vercel + Supabase)

### Vercel 환경변수 설정
Vercel 대시보드 → Project → Settings → Environment Variables에 아래 추가:
- `DATABASE_URL` (Supabase Transaction Pooler URL)
- `DIRECT_URL` (Supabase Direct URL, 마이그레이션용)
- `NEXTAUTH_SECRET` (랜덤 32자 이상)
- `NEXTAUTH_URL` (배포된 도메인)
- `RESEND_API_KEY`
- `EMAIL_FROM`

### Vercel Build Command
```
npx prisma migrate deploy && next build
```

### 주의사항
- `package.json`의 `prisma.seed`는 로컬 개발 전용 (`npx prisma db seed`)
- 프로덕션 DB 마이그레이션은 반드시 `migrate deploy` 사용 (`migrate dev` 금지)
- Supabase free tier: 500MB DB, 2GB bandwidth/월
- Resend free tier: 3,000 이메일/월, 100/일
