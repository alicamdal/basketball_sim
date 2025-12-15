import type { SlotDTO } from "./types";

// Dummy karşı takım oyuncuları
export function generateDummyOpponent(): SlotDTO[] {
  const positions = ["PG", "SG", "SF", "PF", "C"];
  const firstNames = ["Marcus", "James", "Kevin", "Anthony", "Chris", "Darius", "Isaiah", "Malik", "Devin", "Brandon"];
  const lastNames = ["Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"];

  return positions.map((pos, slot) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const overall = 65 + Math.floor(Math.random() * 20); // 65-84 arası

    return {
      location: "STARTER" as const,
      slot,
      player: {
        id: `opponent-${slot}`,
        name: `${firstName} ${lastName}`,
        pos,
        overall,
        imageUrl: "/players/b1.png", // Geçici olarak opponent logo kullanıyoruz
        offense: 60 + Math.floor(Math.random() * 30),
        defense: 60 + Math.floor(Math.random() * 30),
      },
    };
  });
}
