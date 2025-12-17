import { useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { SlotDTO } from "@/lib/types";
import { SpritePlayer } from "../player/SpritePlayer";

const POS_LABELS = ["PG", "SG", "SF", "PF", "C"] as const;

type ArenaPlayersProps = {
  starters: SlotDTO[];
  onSwap?: (target: { location: "STARTER"; slot: number }) => void;
  selected?: { location: string; slot: number } | null;
  scoreAnim?: { playerId: string; key: number; points: number; assistPlayerId?: string; assistKey?: number } | null;
  blockAnim?: { playerId: string; key: number } | null;
  foulAnim?: { playerId: string; key: number } | null;
};

function ArenaPlayerSlot({
  slot,
  data,
  selected,
  onSelect,
  scoreAnim,
  blockAnim,
  foulAnim,
}: {
  slot: number;
  data?: SlotDTO;
  selected: boolean;
  onSelect: (slot: number) => void;
  scoreAnim?: { playerId: string; key: number; points: number; assistPlayerId?: string; assistKey?: number } | null;
  blockAnim?: { playerId: string; key: number } | null;
  foulAnim?: { playerId: string; key: number } | null;
}) {
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
      className="absolute pointer-events-auto"
      style={{
        left: pos.left,
        bottom: pos.bottom,
        transform: "translate(-50%, 50%)",
      }}
    >
      <div
        className={["rounded", selected ? "ring-2 ring-emerald-400" : "bg-transparent"].join(" ")}
        onClick={() => onSelect(slot)}
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
    </div>
  );
}

export function ArenaPlayers({ starters, onSwap, selected, scoreAnim, blockAnim, foulAnim }: ArenaPlayersProps) {
  const map = new Map(starters.map((s) => [s.slot, s]));

  const handleSelect = (slot: number) => {
    if (onSwap) onSwap({ location: "STARTER", slot });
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[0, 1, 2, 3, 4].map((slot) => (
        <ArenaPlayerSlot
          key={slot}
          slot={slot}
          data={map.get(slot)}
          selected={selected?.location === "STARTER" && selected?.slot === slot}
          onSelect={handleSelect}
          scoreAnim={scoreAnim}
          blockAnim={blockAnim}
          foulAnim={foulAnim}
        />
      ))}
    </div>
  );
}
