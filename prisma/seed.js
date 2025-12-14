const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.rosterItem.deleteMany();
  await prisma.roster.deleteMany();
  await prisma.player.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      username: "Lent",
      level: 5,
      xp: 732,
      money: BigInt(3965000),
    },
  });

  const players = await prisma.player.createMany({
    data: [
      { name: "A. Iverson", pos: "PG", overall: 99, imageKey: "/players/pg.png" },
      { name: "D. Wade", pos: "SG", overall: 99, imageKey: "/players/sg.png" },
      { name: "L. James", pos: "SF", overall: 99, imageKey: "/players/sf.png" },
      { name: "K. Garnett", pos: "PF", overall: 99, imageKey: "/players/pf.png" },
      { name: "A. Şengün", pos: "C", overall: 99, imageKey: "/players/c.png" },

      { name: "Bench 1", pos: "G", overall: 70, imageKey: "/players/b1.png" },
      { name: "Bench 2", pos: "G", overall: 71, imageKey: "/players/b2.png" },
      { name: "Bench 3", pos: "F", overall: 69, imageKey: "/players/b3.png" },
      { name: "Bench 4", pos: "F", overall: 68, imageKey: "/players/b4.png" },
      { name: "Bench 5", pos: "C", overall: 67, imageKey: "/players/b5.png" },
      { name: "Bench 6", pos: "G", overall: 66, imageKey: "/players/b6.png" },
      { name: "Bench 7", pos: "F", overall: 65, imageKey: "/players/b7.png" },
      { name: "Bench 8", pos: "C", overall: 64, imageKey: "/players/b8.png" },
    ],
  });

  const all = await prisma.player.findMany({ orderBy: { createdAt: "asc" } });

  const roster = await prisma.roster.create({
    data: { userId: user.id },
  });

  const starters = all.slice(0, 5);
  const bench = all.slice(5);

  await prisma.rosterItem.createMany({
    data: [
      ...starters.map((p, i) => ({
        rosterId: roster.id,
        playerId: p.id,
        location: "STARTER",
        slotIndex: i,
      })),
      ...bench.map((p, i) => ({
        rosterId: roster.id,
        playerId: p.id,
        location: "BENCH",
        slotIndex: i,
      })),
    ],
  });

  console.log("Seed OK");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
