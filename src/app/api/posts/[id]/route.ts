import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [post, myLike] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, role: true, cohort: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, name: true, role: true, cohort: true } },
            replies: {
              where: { isDeleted: false },
              include: {
                author: { select: { id: true, name: true, role: true, cohort: true } },
                _count: { select: { likes: true } },
              },
              orderBy: { createdAt: "asc" },
            },
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
      },
    }),
    prisma.like.findUnique({
      where: { userId_postId: { userId: session.user.id, postId: id } },
    }),
  ]);

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const commentsWithLikedStatus = await Promise.all(
    post.comments.map(async (comment) => {
      const myCommentLike = await prisma.like.findUnique({
        where: { userId_commentId: { userId: session.user.id, commentId: comment.id } },
      });
      const repliesWithLikes = await Promise.all(
        comment.replies.map(async (reply) => {
          const myReplyLike = await prisma.like.findUnique({
            where: { userId_commentId: { userId: session.user.id, commentId: reply.id } },
          });
          return { ...reply, liked: !!myReplyLike };
        })
      );
      return { ...comment, liked: !!myCommentLike, replies: repliesWithLikes };
    })
  );

  return NextResponse.json({
    ...post,
    liked: !!myLike,
    likeCount: post._count.likes,
    comments: commentsWithLikedStatus,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const { isPinned } = await req.json();
  const post = await prisma.post.update({ where: { id }, data: { isPinned } });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ message: "삭제되었습니다." });
}
