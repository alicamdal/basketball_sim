import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

const POS_LABELS = ["PG", "SG", "SF", "PF", "C"] as const;

type OpponentPlayersProps = {
  starters: SlotDTO[];
};

function OpponentPlayerSlot({ slot, data }: { slot: number; data?: SlotDTO }) {
  // Sağ tarafta oyuncuların pozisyonları (sol tarafın mirror'ı)
  const positions = [
    { right: "42%", bottom: "50%" },   // PG
    { right: "33%", bottom: "40%" },   // SG
    { right: "20%", bottom: "40%" },   // SF
    { right: "27%", bottom: "55%" },   // PF
    { right: "12%", bottom: "50%" },   // C
  ];

  const pos = positions[slot];

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        right: pos.right,
        bottom: pos.bottom,
        transform: "translate(50%, 50%)",
      }}
    >
      {data ? <SpritePlayer player={data.player} showMeta={true} posLabel={POS_LABELS[slot]} compact={true} /> : null}
    </div>
  );
}

export function OpponentPlayers({ starters }: OpponentPlayersProps) {
  const map = new Map(starters.map((s) => [s.slot, s]));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[0, 1, 2, 3, 4].map((slot) => (
        <OpponentPlayerSlot key={slot} slot={slot} data={map.get(slot)} />
      ))}
    </div>
  );
}
