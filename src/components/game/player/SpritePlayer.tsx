import Image from "next/image";
import { useState } from "react";
import type { PlayerDTO } from "@/lib/types";
import { PlayerCard } from "./PlayerCard";

export function SpritePlayer({
  player,
  showMeta,
  posLabel,
  compact,
  size = "normal",
}: {
  player: PlayerDTO;
  showMeta: boolean;
  posLabel?: string;      // PG/SG/SF/PF/C
  compact?: boolean;      // bench için daha küçük (deprecated, size kullan)
  size?: "small" | "medium" | "normal"; // small=arena/bench, medium=court, normal=büyük
}) {
  const [showCard, setShowCard] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

  // Backward compatibility
  const actualSize = compact === true ? "small" : size;

  const spriteSize =
    actualSize === "small" ? "h-28 w-28" :
    actualSize === "medium" ? "h-40 w-40" :
    "h-56 w-56";

  const scaleClass =
    actualSize === "small" ? "scale-100" :
    actualSize === "medium" ? "scale-125" :
    "scale-150";

  const nameSize =
    actualSize === "small" ? "text-xs" :
    actualSize === "medium" ? "text-sm" :
    "text-sm";

  const ovrSize =
    actualSize === "small" ? "text-[11px]" :
    actualSize === "medium" ? "text-xs" :
    "text-xs";

  const posSize =
    actualSize === "small" ? "text-[10px]" :
    actualSize === "medium" ? "text-[11px]" :
    "text-[11px]";

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardPosition({
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY,
    });
    setShowCard(true);
  }

  function handleMouseLeave() {
    setShowCard(false);
  }

  return (
    <>
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      {/* sprite */}
      <div className={`relative ${spriteSize}`}>
        <Image
          src={player.imageUrl}
          alt={player.name}
          fill
          priority={false}
          className={[
            "object-contain",
            "drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)]", // sahaya oturtur
            scaleClass,
            "origin-bottom",
          ].join(" ")}
        />
      </div>

        {/* label pill */}
        {showMeta ? (
          <div className={`flex items-center rounded-full bg-black/60 text-white backdrop-blur ${actualSize === 'small' ? 'mt-0.5 gap-0.5 px-1.5 py-0.5' : 'mt-1 gap-1.5 px-2.5 py-0.5'}`}>
            {posLabel ? (
              <span className={`rounded-full bg-white/15 font-semibold ${posSize} ${actualSize === 'small' ? 'px-1 py-[1px]' : 'px-1.5 py-[1px]'}`}>
                {posLabel}
              </span>
            ) : null}

            <span className={`${nameSize} font-semibold leading-none`}>{player.name}</span>

            <span className={`${ovrSize} opacity-80`}>OVR {player.overall}</span>
          </div>
        ) : null}
      </div>

      {/* Player Card on Hover */}
      {showCard && <PlayerCard player={player} position={cardPosition} />}
    </>
  );
}
