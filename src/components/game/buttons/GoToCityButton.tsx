"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameTransition } from "@/components/game/gameTransition";

export function GoToCityButton() {
  const router = useRouter();
  const { setTransition } = useGameTransition();

  const positionClass = "fixed bottom-[24px] left-[1400px]";
  const size = { width: 154, height: 50 };

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.width / 2) / window.innerWidth;
    const cy = (r.top + r.height / 2) / window.innerHeight;

    setTransition({
      type: "toCity",
      originX: Math.round(cx * 100),
      originY: Math.round(cy * 100),
      ts: Date.now(),
    });

    window.setTimeout(() => {
      router.push("/city");
    }, 400);
  }

  return (
    <button
      onClick={onClick}
      className={`${positionClass} z-50 transition-transform duration-200 hover:scale-105 active:scale-95`}
      aria-label="Open City"
      type="button"
    >
      <Image
        src="/ui/btn-city.png"
        alt="Open City"
        {...size}
        priority
        className="object-contain opacity-90 transition hover:opacity-100"
      />
    </button>
  );
}
