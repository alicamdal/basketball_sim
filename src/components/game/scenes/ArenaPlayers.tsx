import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

const POS_LABELS = ["PG", "SG", "SF", "PF", "C"] as const;

type ArenaPlayersProps = {
  starters: SlotDTO[];
};

function ArenaPlayerSlot({ slot, data }: { slot: number; data?: SlotDTO }) {
  const id = `arena-${slot}`;
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id });

  // Sol tarafta oyuncuların pozisyonları (screenshot'a göre ayarlandı)
  const positions = [
    { left: "42%", bottom: "50%" },   // PG - sol alt köşe yakını
    { left: "33%", bottom: "40%" },  // SG - biraz yukarıda
    { left: "20%", bottom: "40%" },   // SF - orta sol
    { left: "27%", bottom: "55%" },  // PF - üst sol
    { left: "12%", bottom: "50%" },   // C - en üst sol (potaya yakın)
  ];

  const pos = positions[slot];

  return (
    <div
      ref={setDropRef}
      className="absolute pointer-events-auto"
      style={{
        left: pos.left,
        bottom: pos.bottom,
        transform: "translate(-50%, 50%)",
      }}
    >
      <div
        className={[
          "rounded",
          isOver ? "bg-emerald-400/10 ring-1 ring-emerald-300/40" : "bg-transparent",
        ].join(" ")}
      >
        {data ? <ArenaPlayerDraggable slot={slot} data={data} /> : null}
      </div>
    </div>
  );
}

function ArenaPlayerDraggable({ slot, data }: { slot: number; data: SlotDTO }) {
  const id = `arena-${slot}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-70" : "opacity-100",
      ].join(" ")}
      {...listeners}
      {...attributes}
    >
      <SpritePlayer
        player={data.player}
        showMeta={true}
        posLabel={POS_LABELS[slot]}
        compact={true}
      />
    </div>
  );
}

export function ArenaPlayers({ starters }: ArenaPlayersProps) {
  const map = new Map(starters.map((s) => [s.slot, s]));

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[0, 1, 2, 3, 4].map((slot) => (
        <ArenaPlayerSlot key={slot} slot={slot} data={map.get(slot)} />
      ))}
    </div>
  );
}
