import { useState, useEffect } from "react";
import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

function BenchCell({ slot, data, selected, onSelect }: { slot: number; data: SlotDTO; selected: boolean; onSelect: (slot: number) => void }) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-black/45 p-2 ${selected ? "ring-2 ring-emerald-400" : ""}`}
      onClick={() => onSelect(slot)}
      style={{ cursor: "pointer" }}
    >
      <SpritePlayer player={data.player} showMeta={false} size="small" />
    </div>
  );
}

export function Bench({ bench, onSwap, selected }: { bench: SlotDTO[]; onSwap?: (target: { location: "BENCH"; slot: number }) => void; selected?: { location: string; slot: number } | null }) {
  const sorted = [...bench].sort((a, b) => a.slot - b.slot).slice(0, 5);

  const handleSelect = (slot: number) => {
    if (onSwap) onSwap({ location: "BENCH", slot });
  };

  return (
    <div className="rounded-3xl border border-white/15 bg-black/35 p-4 text-white shadow mt-[-30px] ml-6">
      <div className="mb-3 text-sm font-semibold">Yedekler</div>
      <div className="grid grid-cols-2 gap-3">
        {sorted.map((b) => (
          <BenchCell key={b.slot} slot={b.slot} data={b} selected={selected?.location === "BENCH" && selected?.slot === b.slot} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
