import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

const POS_LABELS = ["PG", "SG", "SF", "PF", "C"] as const;

function StarterSlot({ slot, data }: { slot: number; data?: SlotDTO }) {
  const id = `starter-${slot}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  // sadece yeri belirle (örnek – senin sahana göre ayarlarsın)
const pos = [
  { left: "72%", top: "75%" }, // PG
  { left: "35%", top: "85%" }, // SG
  { left: "5%", top: "50%" }, // SF
  { left: "62%", top: "15%" }, // PF
  { left: "25%", top: "5%" }, // C
][slot];

  return (
    <div
      ref={setNodeRef}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.left, top: pos.top }}
    >
      {/* hover/highlight */}
      <div
        className={[
          "rounded-2xl p-2",
          isOver ? "bg-emerald-400/10 ring-2 ring-emerald-300/40" : "bg-transparent",
        ].join(" ")}
      >
        {data ? <StarterDraggable slot={slot} data={data} /> : null}
      </div>
    </div>
  );
}

function StarterDraggable({ slot, data }: { slot: number; data: SlotDTO }) {
  const id = `starter-${slot}`;
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
        showMeta
        posLabel={POS_LABELS[slot]}
        size="medium"
      />
    </div>
  );
}

export function Court({ starters }: { starters: SlotDTO[] }) {
  const map = new Map(starters.map((s) => [s.slot, s]));

  return (
    <div className="relative aspect-[16/9] w-full">
      {/* sahayı burada çiziyorsan overlay’i hafif tut */}
      {[0, 1, 2, 3, 4].map((slot) => (
        <StarterSlot key={slot} slot={slot} data={map.get(slot)} />
      ))}
    </div>
  );
}
