import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

const POS_LABELS = ["PG", "SG", "SF", "PF", "C"] as const;

type OpponentPlayersProps = {
  starters: SlotDTO[];
  scoreAnim?: { playerId: string; key: number; points: number; assistPlayerId?: string; assistKey?: number } | null;
  blockAnim?: { playerId: string; key: number } | null;
  foulAnim?: { playerId: string; key: number } | null;
};

function OpponentPlayerSlot({ slot, data, scoreAnim, blockAnim, foulAnim }: { slot: number; data?: SlotDTO; scoreAnim?: { playerId: string; key: number; points: number; assistPlayerId?: string; assistKey?: number } | null; blockAnim?: { playerId: string; key: number } | null; foulAnim?: { playerId: string; key: number } | null }) {
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
      {data ? (
        <SpritePlayer
          player={data.player}
          showMeta={true}
          posLabel={POS_LABELS[slot]}
          compact={true}
          scoreAnimKey={scoreAnim?.playerId === data.player.id ? scoreAnim.key : undefined}
          scoreAnimPoints={scoreAnim?.playerId === data.player.id ? scoreAnim.points : undefined}
          assistAnimKey={scoreAnim?.assistPlayerId === data.player.id ? scoreAnim.assistKey : undefined}
          blockAnimKey={blockAnim?.playerId === data.player.id ? blockAnim.key : undefined}
          foulAnimKey={foulAnim?.playerId === data.player.id ? foulAnim.key : undefined}
        />
      ) : null}
    </div>
  );
}

export function OpponentPlayers({ starters, scoreAnim, blockAnim, foulAnim }: OpponentPlayersProps) {
  const map = new Map(starters.map((s) => [s.slot, s]));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[0, 1, 2, 3, 4].map((slot) => (
        <OpponentPlayerSlot key={slot} slot={slot} data={map.get(slot)} scoreAnim={scoreAnim} blockAnim={blockAnim} foulAnim={foulAnim} />
      ))}
    </div>
  );
}
