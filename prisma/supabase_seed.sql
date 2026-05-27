-- ============================================================
-- 태재대학교 커뮤니티 시드 데이터
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 기존 데이터 초기화 (선택사항 — 처음 실행 시)
-- TRUNCATE users, posts, learning_contents, activity_contents, projects, project_comments RESTART IDENTITY CASCADE;

-- ── 사용자 ──────────────────────────────────────────────────

INSERT INTO users (id, email, password, name, "nameEn", role, status, "isPublic", "createdAt", "updatedAt")
VALUES
  ('admin001', 'admin@taejae.ac.kr', '$2b$12$tvDkYRoqTsDQRsuinzDhTOTCT/4LSubEUEMhGVBNQfiG/Mu6Hnyt2', '관리자', 'Admin', 'ADMIN', 'APPROVED', false, now(), now()),
  ('fac001', 'prof.kim@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '김성호', 'Kim Seongho', 'FACULTY', 'APPROVED', true, now(), now()),
  ('fac002', 'prof.lee@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '이혜진', 'Lee Hyejin', 'FACULTY', 'APPROVED', true, now(), now()),
  -- 1기 (베이징/선전)
  ('s1001', 'junseo@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '이준서', 'Lee Junseo', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s1002', 'seoyeon@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '박서연', 'Park Seoyeon', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s1003', 'minjun@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '최민준', 'Choi Minjun', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s1004', 'jiyu@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '김지유', 'Kim Jiyu', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s1005', 'haeun@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '윤하은', 'Yoon Haeun', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s1006', 'woojin@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '정우진', 'Jeong Woojin', 'STUDENT', 'APPROVED', true, now(), now()),
  -- 2기 (뉴욕/샌프란시스코)
  ('s2001', 'sua@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '한수아', 'Han Sua', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s2002', 'taeyang@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '오태양', 'Oh Taeyang', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s2003', 'chaewon@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '임채원', 'Lim Chaewon', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s2004', 'yerin@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '신예린', 'Shin Yerin', 'STUDENT', 'APPROVED', true, now(), now()),
  -- 3기 (서울)
  ('s3001', 'minseo@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '강민서', 'Kang Minseo', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s3002', 'junhyeok@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '배준혁', 'Bae Junhyeok', 'STUDENT', 'APPROVED', true, now(), now()),
  ('s3003', 'harin@taejae.ac.kr', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '류하린', 'Ryu Harin', 'STUDENT', 'APPROVED', true, now(), now()),
  -- 후원자
  ('sp001', 'sponsor@hanaem.com', '$2b$12$4/bOSL0PIhJEM82vxU7nsOjLyy8lfvBriAaFigB3ASp8TEcvxbcv.', '이재한', 'Lee Jaehan', 'SPONSOR', 'APPROVED', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- 추가 프로필 정보 업데이트
UPDATE users SET "jobTitle"='교수', company='태재대학교', "currentCity"='Seoul', "currentCountry"='South Korea',
  bio='비판적 사고와 글로벌 리더십 담당 교수. 하버드 교육대학원 박사 졸업 후 태재대학교 설립 초기부터 함께했습니다.'
  WHERE id='fac001';

UPDATE users SET "jobTitle"='교수', company='태재대학교', "currentCity"='Seoul', "currentCountry"='South Korea',
  bio='데이터과학 및 인공지능 교육 담당. MIT 컴퓨터과학과 출신으로 AI가 교육을 어떻게 바꿀 수 있는지 연구합니다.'
  WHERE id='fac002';

UPDATE users SET cohort=1, major='데이터과학과 인공지능학부', "currentCity"='Beijing', "currentCountry"='China',
  bio='1기 재학생. AI와 교육의 교차점을 탐구합니다. 베이징 캠퍼스에서 6학기 중.'
  WHERE id='s1001';

UPDATE users SET cohort=1, major='비즈니스혁신학부', "currentCity"='Beijing', "currentCountry"='China',
  bio='비즈니스혁신학부 1기. 소셜 임팩트 스타트업에 관심이 많고, 중국 시장을 직접 경험 중입니다.'
  WHERE id='s1002';

UPDATE users SET cohort=1, major='인문사회학부', "currentCity"='Shenzhen', "currentCountry"='China',
  bio='인문사회학부 1기. 동아시아 정치경제와 청년 세대 연구에 관심. 선전에서 지속가능성 프로젝트 진행 중.'
  WHERE id='s1003';

UPDATE users SET cohort=1, major='자연과학학부', "currentCity"='Beijing', "currentCountry"='China',
  bio='자연과학학부 1기. 기후과학과 환경정책을 연결하는 연구를 꿈꿉니다.'
  WHERE id='s1004';

UPDATE users SET cohort=1, major='데이터과학과 인공지능학부', "currentCity"='Shenzhen', "currentCountry"='China',
  bio='AI 윤리와 알고리즘 공정성 연구. 선전의 빠른 기술 생태계를 직접 경험하며 많은 것을 배우고 있습니다.'
  WHERE id='s1005';

UPDATE users SET cohort=1, major='비즈니스혁신학부', "currentCity"='Beijing', "currentCountry"='China',
  bio='비즈니스혁신학부 1기. 핀테크와 디지털 금융에 관심. 베이징에서 중국 스타트업 생태계를 연구합니다.'
  WHERE id='s1006';

UPDATE users SET cohort=2, major='데이터과학과 인공지능학부', "currentCity"='New York', "currentCountry"='United States',
  bio='2기 재학생. 헬스케어 데이터 분석에 관심. 뉴욕 캠퍼스에서 다양한 배경의 동료들과 협업 중.'
  WHERE id='s2001';

UPDATE users SET cohort=2, major='인문사회학부', "currentCity"='San Francisco', "currentCountry"='United States',
  bio='인문사회학부 2기. 테크 기업의 사회적 책임에 관심. 실리콘밸리에서 현장을 직접 경험 중입니다.'
  WHERE id='s2002';

UPDATE users SET cohort=2, major='비즈니스혁신학부', "currentCity"='New York', "currentCountry"='United States',
  bio='비즈니스혁신 2기. 글로벌 소비재 브랜딩과 마케팅 전략에 관심. 뉴욕에서 현지 스타트업과 협력 중.'
  WHERE id='s2003';

UPDATE users SET cohort=2, major='자연과학학부', "currentCity"='San Francisco', "currentCountry"='United States',
  bio='자연과학 2기. 생명과학과 AI 융합에 관심. 베이 에어리어의 바이오테크 생태계를 탐구 중.'
  WHERE id='s2004';

UPDATE users SET cohort=3, major='데이터과학과 인공지능학부', "currentCity"='Seoul', "currentCountry"='South Korea',
  bio='3기 신입생. 교육 AI에 관심이 많아 태재를 선택했습니다. 서울 캠퍼스에서 열심히 기초를 쌓는 중.'
  WHERE id='s3001';

UPDATE users SET cohort=3, major='인문사회학부', "currentCity"='Seoul', "currentCountry"='South Korea',
  bio='인문사회학부 3기. 국제관계와 외교정책을 공부하고 싶어 입학했습니다.'
  WHERE id='s3002';

UPDATE users SET cohort=3, major='비즈니스혁신학부', "currentCity"='Seoul', "currentCountry"='South Korea',
  bio='비즈니스혁신 3기. 사회적 기업과 임팩트 투자에 관심. 태재의 글로벌 여정이 기대됩니다.'
  WHERE id='s3003';

UPDATE users SET company='한샘', "jobTitle"='이사', "currentCity"='Seoul', "currentCountry"='South Korea',
  bio='태재대학교의 교육 혁신 비전에 공감하여 후원하고 있습니다. 다음 세대 글로벌 리더 양성을 응원합니다.'
  WHERE id='sp001';

-- ── Learning Content ─────────────────────────────────────────

INSERT INTO learning_contents (id, title, description, category, instructor, tags, "order", "createdAt", "updatedAt")
VALUES
  ('lc001', '비판적 사고와 논증', '모든 태재인의 필수 공통과목. 주장의 구조를 파악하고 논리적 오류를 식별하며 설득력 있는 글쓰기와 토론을 훈련합니다. 20명 이하 소규모 세미나로 진행되며 매 수업 전 사전 읽기 자료가 제공됩니다.', 'COURSE', '김성호 교수', '필수, 비판적사고, 논증, 글쓰기', 0, now(), now()),
  ('lc002', '글로벌 리더십 세미나', '다양성 추구의 글로벌 리더십을 기르는 세미나. 세계 각지의 사례를 분석하고 공감과 공존의 리더십 스타일을 탐구합니다. 캠퍼스 이동과 연계해 현지 리더들과의 만남도 포함됩니다.', 'SEMINAR', '김성호 교수', '리더십, 글로벌, 다양성, 세미나', 1, now(), now()),
  ('lc003', '데이터 과학 기초', '데이터 수집·정제·시각화·분석의 기초를 다룹니다. Python과 주요 데이터 분석 라이브러리를 활용하며, 실제 사회 문제 데이터셋으로 실습합니다. 비전공자도 수강 가능한 입문 과목입니다.', 'COURSE', '이혜진 교수', '데이터, Python, 분석, 시각화', 2, now(), now()),
  ('lc004', '인공지능과 사회', 'AI 기술이 경제·노동·교육·윤리에 미치는 영향을 다학제적으로 탐구합니다. 알고리즘 편향, AI 거버넌스, 미래 일자리를 주제로 토론하며, 전공 무관 수강 가능한 핵심 교양 과목입니다.', 'COURSE', '이혜진 교수', 'AI, 윤리, 사회, 미래기술', 3, now(), now()),
  ('lc005', '비즈니스 혁신과 창업', '린 스타트업 방법론, 비즈니스 모델 캔버스, 고객 발견 인터뷰를 실습합니다. 팀을 구성해 실제 문제를 정의하고 프로토타입을 만들어 피칭하는 과정으로 진행됩니다.', 'WORKSHOP', '김성호 교수', '창업, 비즈니스모델, 린스타트업, 팀프로젝트', 4, now(), now()),
  ('lc006', '다문화 소통과 협업', '서로 다른 문화적 배경을 가진 팀원들과 효과적으로 소통하고 협업하는 방법을 탐구합니다. 글로벌 캠퍼스 이동 전 필수 이수 권장 과목입니다.', 'SEMINAR', '이혜진 교수', '다문화, 협업, 소통, 글로벌', 5, now(), now())
ON CONFLICT (id) DO NOTHING;

-- ── Activity Content ─────────────────────────────────────────

INSERT INTO activity_contents (id, title, description, type, date, tags, "order", "createdAt", "updatedAt")
VALUES
  ('ac001', '베이징 지속가능성 해커톤', '1기 학생들이 베이징 캠퍼스에서 진행한 48시간 해커톤. 2030 동아시아 탄소중립 로드맵을 주제로 6개 팀이 솔루션을 개발했습니다. 현지 환경 스타트업과 협력해 실제 데이터를 활용한 프로토타입을 발표했습니다.', 'SESSION', '2026-04-18', '해커톤, 지속가능성, 베이징, 1기', 0, now(), now()),
  ('ac002', '선전 스타트업 이머전 프로그램', '세계 최대 스타트업 밀집 도시 선전에서 진행된 현장 학습. DJI, BYD 등 현지 혁신 기업 방문과 함께, 선전 스타트업 창업자들과의 소규모 세션으로 구성됐습니다.', 'WORKSHOP', '2026-03-07', '스타트업, 선전, 현장학습, 혁신', 1, now(), now()),
  ('ac003', '뉴욕 임팩트 투자 세션', '2기 학생들이 뉴욕 캠퍼스에서 진행한 임팩트 투자 액티브 러닝 세션. 월스트리트 출신 투자자와 소셜 벤처 창업자가 멘토로 참여해 ESG 투자의 현재와 미래를 주제로 심층 토론을 펼쳤습니다.', 'SESSION', '2026-02-21', '임팩트투자, 뉴욕, ESG, 2기', 2, now(), now()),
  ('ac004', '서울 글로벌 리더십 포럼', '서울 캠퍼스 전체 학기 개막 행사로 진행된 리더십 포럼. 태재대학교 교수진과 외부 연사가 함께 21세기 리더십이란 무엇인가를 주제로 강연과 소그룹 토의를 진행했습니다.', 'SESSION', '2025-09-05', '리더십, 포럼, 서울, 전기수', 3, now(), now()),
  ('ac005', '샌프란시스코 AI 연구소 탐방', '실리콘밸리 AI 연구소 및 테크 기업 탐방 프로그램. OpenAI, Stanford AI Lab 방문 후 각 기관 연구원과의 Q&A 세션. 2기 학생들이 현장에서 AI 연구의 최전선을 경험했습니다.', 'WORKSHOP', '2025-11-14', 'AI, 실리콘밸리, 탐방, 2기', 4, now(), now()),
  ('ac006', '1기 자기주도학습 성찰 세션', '1기 학생들의 3년 과정을 돌아보는 자기주도학습 성찰 세션. 포트폴리오 발표와 상호 피드백을 통해 각자의 학습 여정을 정리하고 남은 1년의 목표를 설계했습니다.', 'SESSION', '2026-01-30', '성찰, 자기주도, 포트폴리오, 1기', 5, now(), now())
ON CONFLICT (id) DO NOTHING;

-- ── Projects ──────────────────────────────────────────────────

INSERT INTO projects (id, title, description, tags, status, "teamMembers", "githubUrl", "demoUrl", "order", "createdAt", "updatedAt")
VALUES
  ('proj001', 'EduAI — AI 기반 개인화 학습 플랫폼',
   '태재의 액티브 러닝 철학을 기술로 구현하는 프로젝트. 학생 개개인의 학습 패턴을 분석해 맞춤형 사전학습 자료와 토론 주제를 추천하는 AI 플랫폼을 개발하고 있습니다.' || chr(10) || chr(10) || '서울·뉴욕·베이징 캠퍼스에서 파일럿 테스트를 완료했으며, 현재 피드백을 반영해 v2.0 개발 중입니다.',
   'AI, 교육, Python, Next.js, 머신러닝', 'ONGOING', '이준서, 윤하은, 한수아', 'https://github.com', NULL, 0, now(), now()),
  ('proj002', '동아시아 청년 기후 행동 리포트',
   '한국·중국·일본 청년 세대의 기후변화 인식과 행동 패턴을 비교 연구한 프로젝트. 3개국 대학생 500명 설문, 15명 심층 인터뷰, 정책 분석을 바탕으로 보고서를 완성했습니다.' || chr(10) || chr(10) || '보고서는 서울 기후 주간 행사에서 발표됐으며, 환경부 산하 기관에 정책 제언으로 제출됐습니다.',
   '기후변화, 동아시아, 정책연구, 청년', 'COMPLETED', '최민준, 김지유, 배준혁', NULL, 'https://taejae.ac.kr', 1, now(), now()),
  ('proj003', '글로벌 식량 안보 솔루션 — FoodBridge',
   '개발도상국 소농과 글로벌 식품 유통망을 연결하는 플랫폼 프로젝트. 뉴욕 캠퍼스 재학 중 FAO(유엔식량농업기구)와 협력해 아이디어를 발전시켰습니다.' || chr(10) || chr(10) || '현재 케냐 농업부와 파트너십 논의 중이며, 2026년 하반기 파일럿 런칭을 목표로 합니다.',
   '식량안보, 임팩트, 플랫폼, UN협력', 'ONGOING', '임채원, 오태양, 신예린', NULL, NULL, 2, now(), now()),
  ('proj004', 'K-스타트업 글로벌 진출 가이드북',
   '한국 초기 스타트업이 미국·중국·일본 시장에 진출할 때 실질적으로 필요한 정보를 정리한 가이드북. 태재 학생들이 각 캠퍼스에서 현지 창업 생태계를 직접 경험하며 수집한 인사이트를 담았습니다.' || chr(10) || chr(10) || '미국·중국·일본 편 3권으로 구성됐으며, 중소벤처기업부 스타트업 지원 프로그램에서 교재로 활용 중입니다.',
   '스타트업, 글로벌진출, 가이드북, 한중일', 'COMPLETED', '박서연, 정우진, 강민서', NULL, 'https://taejae.ac.kr', 3, now(), now())
ON CONFLICT (id) DO NOTHING;

-- ── Project Comments ──────────────────────────────────────────

INSERT INTO project_comments (id, content, "authorName", "projectId", "createdAt")
VALUES
  ('pc001', 'EduAI 정말 기대됩니다! 태재의 액티브 러닝을 기술로 확장하는 방향이 인상적이네요. v2.0 언제 공개되나요?', '김철수', 'proj001', now()),
  ('pc002', '저도 교육 AI에 관심이 많아서 관심있게 보고 있어요. 오픈소스로 공개할 계획이 있나요?', '이민지', 'proj001', now()),
  ('pc003', '동아시아 3국 청년 비교 연구라니 정말 의미있는 작업이네요. 전체 보고서를 어디서 볼 수 있나요?', '박현우', 'proj002', now()),
  ('pc004', 'FoodBridge 아이디어 너무 좋아요. 케냐 파일럿 결과가 정말 궁금합니다. 응원합니다!', '정소희', 'proj003', now())
ON CONFLICT (id) DO NOTHING;

-- ── 게시글 ───────────────────────────────────────────────────

INSERT INTO posts (id, title, content, category, "isPinned", "authorId", "likeCount", "createdAt", "updatedAt")
VALUES
  ('notice-001', '태재대학교 동문 커뮤니티에 오신 것을 환영합니다',
   'Great Harmony — 태재인 여러분, 환영합니다!' || chr(10) || chr(10) || '이 커뮤니티는 태재대학교 재학생, 동문, 교직원, 후원자가 함께 소통하고 네트워크를 형성하는 공간입니다.' || chr(10) || chr(10) || '서울 → 샌프란시스코 → 뉴욕 → 선전 → 베이징 → 유럽 → 도쿄, 전 세계를 무대로 공부하는 태재인들이 이 공간에서 이어집니다.',
   'NOTICE', true, 'admin001', 0, now(), now()),
  ('notice-002', '[공지] 2026 태재 글로벌 서밋 — 7월 서울 개최',
   '전 기수 재학생과 교직원이 한자리에 모이는 연례 행사 2026 태재 글로벌 서밋이 7월 서울 캠퍼스에서 개최됩니다.' || chr(10) || chr(10) || '일시: 2026년 7월 18~19일' || chr(10) || '장소: 태재대학교 서울 캠퍼스' || chr(10) || chr(10) || '주요 프로그램: 각 캠퍼스 프로젝트 발표 및 시상, 선후배 멘토링 매칭 세션, 글로벌 리더십 특별 강연',
   'EVENT', false, 'fac001', 0, now(), now()),
  ('post-001', '베이징 생활 적응기 — 6학기를 시작하며',
   '베이징 캠퍼스 입성한 지 두 달이 됐습니다. 선전에서 베이징으로 이동하면서 도시 분위기가 완전히 달라지는 걸 느꼈어요.' || chr(10) || chr(10) || '선전이 역동적이고 빠른 스타트업 도시라면, 베이징은 역사와 정책의 도시라는 느낌? 수업은 계속 온라인 액티브 러닝으로 진행되는데, 베이징 현지 기업과 연계한 케이스 스터디가 이번 학기 하이라이트입니다.',
   'GENERAL', false, 's1001', 0, now(), now()),
  ('post-002', '데이터과학 전공 멘토 찾습니다 (3기 → 1,2기)',
   '안녕하세요, 3기 강민서입니다.' || chr(10) || chr(10) || '데이터과학 전공을 선택했는데, 태재 수업에서 어떤 방식으로 공부하는 게 효과적인지 선배들의 조언이 너무 듣고 싶습니다.' || chr(10) || chr(10) || '사전 학습 자료 어떻게 소화하셨나요? 팀 프로젝트 주제 어떻게 잡으셨나요? 편하게 댓글 주세요.',
   'MENTOR', false, 's3001', 0, now(), now())
ON CONFLICT (id) DO NOTHING;
