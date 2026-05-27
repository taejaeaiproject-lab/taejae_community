-- Taejae Community — Supabase PostgreSQL Init Script
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "users" (
    "id"             TEXT        NOT NULL,
    "email"          TEXT        NOT NULL,
    "name"           TEXT        NOT NULL,
    "nameEn"         TEXT,
    "password"       TEXT        NOT NULL,
    "role"           TEXT        NOT NULL DEFAULT 'STUDENT',
    "status"         TEXT        NOT NULL DEFAULT 'PENDING',
    "cohort"         INTEGER,
    "major"          TEXT,
    "currentCity"    TEXT,
    "currentCountry" TEXT,
    "bio"            TEXT,
    "linkedinUrl"    TEXT,
    "instagramUrl"   TEXT,
    "graduationYear" INTEGER,
    "company"        TEXT,
    "jobTitle"       TEXT,
    "isPublic"       BOOLEAN     NOT NULL DEFAULT true,
    "createdAt"      TIMESTAMP   NOT NULL DEFAULT NOW(),
    "updatedAt"      TIMESTAMP   NOT NULL DEFAULT NOW(),
    "approvedById"   TEXT,
    PRIMARY KEY ("id"),
    CONSTRAINT "users_approvedById_fkey"
        FOREIGN KEY ("approvedById") REFERENCES "users" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

CREATE TABLE IF NOT EXISTS "posts" (
    "id"        TEXT      NOT NULL,
    "title"     TEXT      NOT NULL,
    "content"   TEXT      NOT NULL,
    "category"  TEXT      NOT NULL DEFAULT 'GENERAL',
    "isPinned"  BOOLEAN   NOT NULL DEFAULT false,
    "authorId"  TEXT      NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    CONSTRAINT "posts_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "users" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id"        TEXT      NOT NULL,
    "content"   TEXT      NOT NULL,
    "isDeleted" BOOLEAN   NOT NULL DEFAULT false,
    "postId"    TEXT      NOT NULL,
    "authorId"  TEXT      NOT NULL,
    "parentId"  TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    CONSTRAINT "comments_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "posts" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "users" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_parentId_fkey"
        FOREIGN KEY ("parentId") REFERENCES "comments" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "likes" (
    "id"        TEXT      NOT NULL,
    "userId"    TEXT      NOT NULL,
    "postId"    TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    CONSTRAINT "likes_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "likes_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "posts" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "likes_commentId_fkey"
        FOREIGN KEY ("commentId") REFERENCES "comments" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_postId_key"    ON "likes"("userId", "postId");
CREATE UNIQUE INDEX IF NOT EXISTS "likes_userId_commentId_key" ON "likes"("userId", "commentId");

CREATE TABLE IF NOT EXISTS "events" (
    "id"          TEXT      NOT NULL,
    "title"       TEXT      NOT NULL,
    "description" TEXT      NOT NULL,
    "location"    TEXT,
    "isOnline"    BOOLEAN   NOT NULL DEFAULT false,
    "startDate"   TIMESTAMP NOT NULL,
    "endDate"     TIMESTAMP,
    "authorId"    TEXT      NOT NULL,
    "createdAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    CONSTRAINT "events_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "users" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "mentor_requests" (
    "id"         TEXT      NOT NULL,
    "fromUserId" TEXT      NOT NULL,
    "toUserId"   TEXT      NOT NULL,
    "message"    TEXT,
    "status"     TEXT      NOT NULL DEFAULT 'PENDING',
    "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("id"),
    CONSTRAINT "mentor_requests_fromUserId_fkey"
        FOREIGN KEY ("fromUserId") REFERENCES "users" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "mentor_requests_toUserId_fkey"
        FOREIGN KEY ("toUserId") REFERENCES "users" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "mentor_requests_fromUserId_toUserId_key"
    ON "mentor_requests"("fromUserId", "toUserId");
