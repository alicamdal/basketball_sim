"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useGameTransition } from "@/components/game/gameTransition";

export function CityToggleButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTransition } = useGameTransition();

  const isCity = pathname?.startsWith("/city");
  const nextHref = isCity ? "/" : "/city";

  const src = isCity ? "/ui/btn-court.png" : "/ui/btn-city.png";
  const alt = isCity ? "Back to Court" : "Open City";

  // Konum: örnek (px bazlı)
  const positionClass = isCity
    ? "fixed bottom-[150px] right-[400px]"
    : "fixed bottom-[24px] left-1/2 -translate-x-1/2";

  // Boyut: city’de büyük
  const size = isCity ? { width: 600, height: 100 } : { width: 220, height: 72 };

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.width / 2) / window.innerWidth;
    const cy = (r.top + r.height / 2) / window.innerHeight;

    setTransition({
      type: isCity ? "toCourt" : "toCity",
      originX: Math.round(cx * 100),
      originY: Math.round(cy * 100),
      ts: Date.now(),
    });

    // Exit animasyon süresiyle uyumlu
    window.setTimeout(() => {
      router.push(nextHref);
    }, 220);
  }

  return (
    <button
      onClick={onClick}
      className={`${positionClass} z-50 transition-transform duration-200 hover:scale-105 active:scale-95`}
      aria-label={alt}
      type="button"
    >
      <Image
        src={src}
        alt={alt}
        {...size}
        priority
        className="object-contain opacity-90 transition hover:opacity-100"
      />
    </button>
  );
}
