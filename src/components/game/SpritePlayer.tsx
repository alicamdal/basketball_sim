import Image from "next/image";
import type { PlayerDTO } from "@/lib/types";

export function SpritePlayer({
  player,
  showMeta,
  posLabel,
  compact,
}: {
  player: PlayerDTO;
  showMeta: boolean;
  posLabel?: string;      // PG/SG/SF/PF/C
  compact?: boolean;      // bench için daha küçük
}) {
  const spriteSize = compact ? "h-32 w-32" : "h-48 w-48"; // sadece görselin “kapsadığı” alan
  const nameSize = compact ? "text-[11px]" : "text-xs";
  const ovrSize = compact ? "text-[10px]" : "text-[11px]";

  return (
    <div className="relative flex flex-col items-center">
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
            compact ? "scale-110" : "scale-125",
            "origin-bottom",
          ].join(" ")}
        />
      </div>

      {/* label pill */}
      {showMeta ? (
        <div className="mt-1 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-white backdrop-blur">
          {posLabel ? (
            <span className="rounded-full bg-white/15 px-2 py-[2px] text-[10px] font-semibold">
              {posLabel}
            </span>
          ) : null}

          <span className={`${nameSize} font-semibold leading-none`}>{player.name}</span>

          <span className={`${ovrSize} opacity-80`}>OVR {player.overall}</span>
        </div>
      ) : null}
    </div>
  );
}
