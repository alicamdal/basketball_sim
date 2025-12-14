export type MeDTO = {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  money: string; // BigInt JSON için string
};

export type PlayerDTO = {
  id: string;
  name: string;
  pos: string;
  overall: number;
  imageUrl: string;
};

export type SlotDTO = {
  location: "STARTER" | "BENCH";
  slot: number;
  player: PlayerDTO;
};

export type RosterDTO = {
  starters: SlotDTO[]; // 5
  bench: SlotDTO[];    // N
};
