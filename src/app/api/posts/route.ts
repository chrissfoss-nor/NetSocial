import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  // Get IDs of everyone the current user follows
  const follows = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });

  const authorIds = [session.user.id, ...follows.map((f) => f.followingId)];

  const posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, imageUrl } = await req.json();
  if (!content?.trim() && !imageUrl) {
    return NextResponse.json({ error: "Content or image required" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: { content: content?.trim() ?? "", imageUrl: imageUrl ?? null, authorId: session.user.id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
