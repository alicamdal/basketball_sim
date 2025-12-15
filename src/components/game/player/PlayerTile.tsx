import Image from "next/image";
import type { PlayerDTO } from "@/lib/types";

export function PlayerTile({
  player,
  showMeta,
}: {
  player: PlayerDTO;
  showMeta: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24 rounded-2xl border border-white/20 bg-black/40 shadow">
        <Image src={player.imageUrl} alt={player.name} fill className="object-cover objet-center" />
      </div>
      {showMeta ? (
        <div className="mt-2 text-center text-white">
          <div className="text-xs font-semibold leading-4">{player.name}</div>
          <div className="text-[11px] opacity-80">OVR {player.overall}</div>
        </div>
      ) : null}
    </div>
  );
}
