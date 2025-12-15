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
      <div className="relative h-24 w-24 rounded-2xl bg-black/40 shadow">
        <Image src={player.imageUrl} alt={player.name} fill className="object-cover objet-center" />
      </div>
    </div>
  );
}
