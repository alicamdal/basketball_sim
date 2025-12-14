import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await prisma.user.findFirst({ include: { roster: true } });
  if (!user?.roster) return NextResponse.json({ error: "No roster" }, { status: 404 });

  const items = await prisma.rosterItem.findMany({
    where: { rosterId: user.roster.id },
    include: { player: true },
    orderBy: [{ location: "asc" }, { slotIndex: "asc" }],
  });

  const starters = items
    .filter((x) => x.location === "STARTER")
    .sort((a, b) => a.slotIndex - b.slotIndex)
    .map((x) => ({
      location: "STARTER" as const,
      slot: x.slotIndex,
      player: {
        id: x.player.id,
        name: x.player.name,
        pos: x.player.pos,
        overall: x.player.overall,
        imageUrl: x.player.imageKey,
      },
    }));

  const bench = items
    .filter((x) => x.location === "BENCH")
    .sort((a, b) => a.slotIndex - b.slotIndex)
    .map((x) => ({
      location: "BENCH" as const,
      slot: x.slotIndex,
      player: {
        id: x.player.id,
        name: x.player.name,
        pos: x.player.pos,
        overall: x.player.overall,
        imageUrl: x.player.imageKey,
      },
    }));

  return NextResponse.json({ starters, bench });
}
