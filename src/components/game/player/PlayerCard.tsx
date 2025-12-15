"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import type { PlayerDTO } from "@/lib/types";

type PlayerCardProps = {
  player: PlayerDTO;
  position: { x: number; y: number };
};

export function PlayerCard({ player, position }: PlayerCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Utility to get color class for overall
  function getOverallColor(overall: number) {
    if (overall >= 90) return "text-purple-400"; // mor
    if (overall >= 80) return "text-blue-400";   // mavi
    if (overall >= 70) return "text-green-400";  // yeşil
    return "text-gray-400";                      // gri
  }

  const card = (
    <div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
    >
      <div className="rounded-xl border-2 border-white/30 bg-black/70 px-4 py-3 text-white shadow-2xl backdrop-blur-md min-w-[240px]">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div className={"text-sm font-bold " + getOverallColor(player.overall)}>{player.name}</div>
          <div className="flex items-center gap-2">
            <span className={"rounded bg-white/20 px-2 py-0.5 text-[10px] font-semibold " + getOverallColor(player.overall)}>
              {player.pos}
            </span>
            <span className="text-[10px] font-semibold text-white/80">
              OVR <span className={getOverallColor(player.overall)}>{player.overall}</span>
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-1.5 text-[11px]">
          {/* Salary */}
          <div className="flex justify-between">
            <span className="text-white/60">Salary:</span>
            <span className="font-semibold">
              ${player.salary ? Number(player.salary).toLocaleString() : '0'}
            </span>
          </div>

          {/* Price */}
          <div className="flex justify-between">
            <span className="text-white/60">Price:</span>
            <span className="font-semibold">
              ${player.price ? Number(player.price).toLocaleString() : '0'}
            </span>
          </div>

          {/* Rating (Overall) */}
          <div className="flex justify-between">
            <span className="text-white/60">Rating:</span>
            <span className={"font-semibold " + getOverallColor(player.overall)}>{player.overall}</span>
          </div>

          {/* Offense */}
          <div className="flex justify-between">
            <span className="text-white/60">Offense:</span>
            <span className="font-semibold">{player.offense ?? 50}</span>
          </div>

          {/* Defense */}
          <div className="flex justify-between">
            <span className="text-white/60">Defense:</span>
            <span className="font-semibold">{player.defense ?? 50}</span>
          </div>
        </div>
      </div>

      {/* Arrow pointing down to player */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2">
        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white/30" />
      </div>
    </div>
  );

  return createPortal(card, document.body);
}
