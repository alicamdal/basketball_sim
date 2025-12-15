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
      {
        name: "A. Iverson",
        pos: "PG",
        overall: 99,
        imageKey: "/players/pg.png",
        salary: BigInt(8500000),
        price: BigInt(12000000),
        offense: 98,
        defense: 82
      },
      {
        name: "D. Wade",
        pos: "SG",
        overall: 99,
        imageKey: "/players/sg.png",
        salary: BigInt(9200000),
        price: BigInt(13500000),
        offense: 95,
        defense: 88
      },
      {
        name: "L. James",
        pos: "SF",
        overall: 99,
        imageKey: "/players/sf.png",
        salary: BigInt(10500000),
        price: BigInt(15000000),
        offense: 97,
        defense: 90
      },
      {
        name: "K. Garnett",
        pos: "PF",
        overall: 99,
        imageKey: "/players/pf.png",
        salary: BigInt(9800000),
        price: BigInt(14000000),
        offense: 89,
        defense: 96
      },
      {
        name: "A. Şengün",
        pos: "C",
        overall: 99,
        imageKey: "/players/c.png",
        salary: BigInt(8900000),
        price: BigInt(12500000),
        offense: 92,
        defense: 94
      },

      {
        name: "Bench 1",
        pos: "G",
        overall: 70,
        imageKey: "/players/b1.png",
        salary: BigInt(1200000),
        price: BigInt(1800000),
        offense: 72,
        defense: 65
      },
      {
        name: "Bench 2",
        pos: "G",
        overall: 71,
        imageKey: "/players/b2.png",
        salary: BigInt(1300000),
        price: BigInt(1900000),
        offense: 74,
        defense: 68
      },
      {
        name: "Bench 3",
        pos: "F",
        overall: 69,
        imageKey: "/players/b3.png",
        salary: BigInt(1100000),
        price: BigInt(1700000),
        offense: 70,
        defense: 66
      },
      {
        name: "Bench 4",
        pos: "F",
        overall: 68,
        imageKey: "/players/b4.png",
        salary: BigInt(1000000),
        price: BigInt(1600000),
        offense: 69,
        defense: 64
      },
      {
        name: "Bench 5",
        pos: "C",
        overall: 67,
        imageKey: "/players/b5.png",
        salary: BigInt(950000),
        price: BigInt(1500000),
        offense: 65,
        defense: 70
      },
      {
        name: "Bench 6",
        pos: "G",
        overall: 66,
        imageKey: "/players/b6.png",
        salary: BigInt(900000),
        price: BigInt(1400000),
        offense: 68,
        defense: 62
      },
      {
        name: "Bench 7",
        pos: "F",
        overall: 65,
        imageKey: "/players/b7.png",
        salary: BigInt(850000),
        price: BigInt(1300000),
        offense: 66,
        defense: 63
      },
      {
        name: "Bench 8",
        pos: "C",
        overall: 64,
        imageKey: "/players/b8.png",
        salary: BigInt(800000),
        price: BigInt(1200000),
        offense: 63,
        defense: 67
      },
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
