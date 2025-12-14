import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // MVP: tek user
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: "No user" }, { status: 404 });

  return NextResponse.json({
    username: user.username,
    level: user.level,
    xp: user.xp,
    xpToNext: 1000,
    money: user.money.toString(),
  });
}
