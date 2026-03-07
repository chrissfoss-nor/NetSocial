import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: groupId } = await params;

  const existing = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });

  if (existing) {
    await prisma.groupMember.delete({ where: { id: existing.id } });
    return NextResponse.json({ joined: false });
  } else {
    await prisma.groupMember.create({ data: { userId: session.user.id, groupId } });
    return NextResponse.json({ joined: true });
  }
}
