import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { SlotDTO } from "@/lib/types";
import { PlayerTile } from "../player/PlayerTile";
import { SpritePlayer } from "../player/SpritePlayer";

function BenchCell({ slot, data }: { slot: number; data: SlotDTO }) {
  const droppableId = `bench-${slot}`;
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: droppableId });

  const { setNodeRef: setDragRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: droppableId,
  });

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setDropRef}
      className={`rounded-2xl border border-white/15 bg-black/45 p-2 ${isOver ? "outline outline-2 outline-emerald-400/60" : ""}`}
    >
      <div
        ref={setDragRef}
        style={style}
        className={isDragging ? "opacity-60" : "opacity-100"}
        {...listeners}
        {...attributes}
      >
        <PlayerTile player={data.player} showMeta={false} />
      </div>
    </div>
  );
}

export function Bench({ bench }: { bench: SlotDTO[] }) {
  const sorted = [...bench].sort((a, b) => a.slot - b.slot);

  return (
    <div className="rounded-3xl border border-white/15 bg-black/35 p-4 text-white shadow">
      <div className="mb-3 text-sm font-semibold">Yedekler</div>
      <div className="grid grid-cols-2 gap-3">
        {sorted.map((b) => (
          <BenchCell key={b.slot} slot={b.slot} data={b} />
        ))}
      </div>
    </div>
  );
}
