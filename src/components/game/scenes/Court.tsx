import { useState, useEffect } from "react";
import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

const POS_LABELS = ["PG", "SG", "SF", "PF", "C"] as const;

function StarterSlot({ slot, data, selected, onSelect }: { slot: number; data?: SlotDTO; selected: boolean; onSelect: (slot: number) => void }) {
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
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.left, top: pos.top }}
    >
      <div
        className={["rounded-2xl p-2", selected ? "ring-2 ring-emerald-400" : "bg-transparent"].join(" ")}
        onClick={() => onSelect(slot)}
        style={{ cursor: data ? "pointer" : "default" }}
      >
        {data ? <SpritePlayer player={data.player} showMeta posLabel={POS_LABELS[slot]} size="medium" /> : null}
      </div>
    </div>
  );
}

export function Court({ starters, onSwap, selected }: { starters: SlotDTO[]; onSwap?: (target: { location: "STARTER"; slot: number }) => void; selected?: { location: string; slot: number } | null }) {
  const map = new Map(starters.map((s) => [s.slot, s]));

  const handleSelect = (slot: number) => {
    if (onSwap) onSwap({ location: "STARTER", slot });
  };

  return (
    <div className="relative aspect-[16/9] w-full">
      {[0, 1, 2, 3, 4].map((slot) => (
        <StarterSlot key={slot} slot={slot} data={map.get(slot)} selected={selected?.location === "STARTER" && selected?.slot === slot} onSelect={handleSelect} />
      ))}
    </div>
  );
}
