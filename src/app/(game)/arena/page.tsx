"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChatPanel } from "@/components/game/ui/ChatPanel";
import { MatchSimulation } from "@/components/game/ui/MatchSimulation";
import { Scoreboard } from "@/components/game/ui/Scoreboard";
import { ArenaPlayers } from "@/components/game/scenes/ArenaPlayers";
import { OpponentPlayers } from "@/components/game/scenes/OpponentPlayers";
import type { RosterDTO } from "@/lib/types";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { generateDummyOpponent } from "@/lib/dummyOpponent";

type DragId = { slot: number };

function idToDrag(id: string): DragId {
  const slotStr = id.split("-")[1];
  return { slot: Number(slotStr) };
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function ArenaPage() {
  const router = useRouter();
  const [roster, setRoster] = useState<RosterDTO | null>(null);
  const [opponentStarters] = useState(() => generateDummyOpponent());

  useEffect(() => {
    getJSON<RosterDTO>("/api/roster")
      .then(setRoster)
      .catch(console.error);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const starterSlots = useMemo(() => roster?.starters ?? [], [roster]);

  function swapLocal(fromSlot: number, toSlot: number) {
    if (!roster) return;
    const clone: RosterDTO = {
      starters: roster.starters.map((x) => ({ ...x, player: { ...x.player } })),
      bench: roster.bench.map((x) => ({ ...x, player: { ...x.player } })),
    };

    const a = clone.starters.find((x) => x.slot === fromSlot);
    const b = clone.starters.find((x) => x.slot === toSlot);
    if (!a || !b) return;

    const tmp = a.player;
    a.player = b.player;
    b.player = tmp;

    setRoster(clone);
  }

  function onDragEnd(e: DragEndEvent) {
    if (!roster) return;
    const activeId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId || activeId === overId) return;

    const from = idToDrag(activeId);
    const to = idToDrag(overId);

    swapLocal(from.slot, to.slot);
  }

  function handleClose() {
    router.push("/city");
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="relative min-h-screen w-full">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center"
          style={{
            backgroundImage: "url(/arena/arena-bg.jpg)",
            backgroundSize: "100% 100%"
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* Scoreboard - top center */}
        <Scoreboard homeStarters={starterSlots} awayStarters={opponentStarters} />

        {/* Close button - top right */}
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 rounded-full bg-red-500/80 p-3 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-red-600/90 hover:shadow-xl"
          aria-label="Close Arena"
          type="button"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Players on court - left side */}
        {starterSlots.length > 0 && <ArenaPlayers starters={starterSlots} />}

        {/* Opponent players - right side */}
        <OpponentPlayers starters={opponentStarters} />

        {/* Chat panel - left side */}
        <ChatPanel />

        {/* Match simulation - right side */}
        <MatchSimulation />
      </div>
    </DndContext>
  );
}
