import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type SwapBody = {
  from: { location: "STARTER" | "BENCH"; slot: number };
  to: { location: "STARTER" | "BENCH"; slot: number };
};

export async function POST(req: Request) {
  const body = (await req.json()) as SwapBody;

  const user = await prisma.user.findFirst({ include: { roster: true } });
  if (!user?.roster) return NextResponse.json({ error: "No roster" }, { status: 404 });

  const rosterId = user.roster.id;

  const [a, b] = await Promise.all([
    prisma.rosterItem.findUnique({
      where: { rosterId_location_slotIndex: { rosterId, location: body.from.location, slotIndex: body.from.slot } },
      include: { player: true },
    }),
    prisma.rosterItem.findUnique({
      where: { rosterId_location_slotIndex: { rosterId, location: body.to.location, slotIndex: body.to.slot } },
      include: { player: true },
    }),
  ]);

  if (!a || !b) return NextResponse.json({ error: "Invalid slots" }, { status: 400 });

  // Transaction: swap playerId
  await prisma.$transaction([
    prisma.rosterItem.update({
      where: { id: a.id },
      data: { playerId: b.playerId },
    }),
    prisma.rosterItem.update({
      where: { id: b.id },
      data: { playerId: a.playerId },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
