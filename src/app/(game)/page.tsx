"use client";

import { useEffect, useMemo, useState } from "react";
import type { MeDTO, RosterDTO, SlotDTO } from "@/lib/types";
import { Court } from "@/components/game/scenes/Court";
import { Bench } from "@/components/game/scenes/Bench";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

type DragId = { location: "STARTER" | "BENCH"; slot: number };

function idToDrag(id: string): DragId {
  const [loc, slotStr] = id.split("-");
  return { location: loc.toUpperCase() as DragId["location"], slot: Number(slotStr) };
}
function dragToId(d: DragId): string {
  return `${d.location.toLowerCase()}-${d.slot}`;
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function postJSON<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function GamePage() {
  const [me, setMe] = useState<MeDTO | null>(null);
  const [roster, setRoster] = useState<RosterDTO | null>(null);

  useEffect(() => {
    (async () => {
      const [m, r] = await Promise.all([getJSON<MeDTO>("/api/me"), getJSON<RosterDTO>("/api/roster")]);
      setMe(m);
      setRoster(r);
    })().catch(console.error);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const starterSlots = useMemo(() => roster?.starters ?? [], [roster]);
  const benchSlots = useMemo(() => roster?.bench ?? [], [roster]);

  // optimistic swap helper
  function swapLocal(from: DragId, to: DragId) {
    if (!roster) return;
    const clone: RosterDTO = {
      starters: roster.starters.map((x) => ({ ...x, player: { ...x.player } })),
      bench: roster.bench.map((x) => ({ ...x, player: { ...x.player } })),
    };

    const getArr = (loc: DragId["location"]) => (loc === "STARTER" ? clone.starters : clone.bench);

    const aArr = getArr(from.location);
    const bArr = getArr(to.location);

    const a = aArr.find((x) => x.slot === from.slot);
    const b = bArr.find((x) => x.slot === to.slot);
    if (!a || !b) return;

    const tmp = a.player;
    a.player = b.player;
    b.player = tmp;

    setRoster(clone);
  }

  async function onDragEnd(e: DragEndEvent) {
    if (!roster) return;
    const activeId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId || activeId === overId) return;

    const from = idToDrag(activeId);
    const to = idToDrag(overId);

    // optimistic UI
    const prev = roster;
    swapLocal(from, to);

    try {
      await postJSON("/api/roster/swap", { from, to });
    } catch (err) {
      console.error(err);
      // rollback
      setRoster(prev);
    }
  }

  // click-to-swap state
  const [clickSwap, setClickSwap] = useState<null | DragId>(null);

  async function handleClickSwap(target: DragId) {
    if (!roster) return;
    if (!clickSwap) {
      setClickSwap(target);
    } else if (clickSwap.location !== target.location || clickSwap.slot !== target.slot) {
      const prev = roster;
      swapLocal(clickSwap, target);
      setClickSwap(null);
      try {
        await postJSON("/api/roster/swap", { from: clickSwap, to: target });
      } catch (err) {
        setRoster(prev);
      }
    } else {
      setClickSwap(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background court image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/court-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          filter: "brightness(0.45) saturate(0.65) blur(1px)",
          transform: "scale(1.02)",
        }}
      />

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6 pt-64 pl-32">
          {/* court center */}
          <div className="col-span-9">
            <Court starters={starterSlots} onSwap={handleClickSwap} selected={clickSwap} />
          </div>

          {/* bench right */}
          <div className="col-span-3 -mt-15">
            <Bench bench={benchSlots} onSwap={handleClickSwap} selected={clickSwap} />
          </div>
        </div>
      </DndContext>
    </div>
  );
}
