"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGameTransition } from "@/components/game/gameTransition";

export function GoToCourtButton() {
  const router = useRouter();
  const { setTransition } = useGameTransition();

  const positionClass = "fixed bottom-[150px] right-[400px]";
  const size = { width: 600, height: 100 };

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const cx = (r.left + r.width / 2) / window.innerWidth;
    const cy = (r.top + r.height / 2) / window.innerHeight;

    setTransition({
      type: "toCourt",
      originX: Math.round(cx * 100),
      originY: Math.round(cy * 100),
      ts: Date.now(),
    });

    window.setTimeout(() => {
      router.push("/");
    }, 400);
  }

  return (
    <button
      onClick={onClick}
      className={`${positionClass} z-50 transition-transform duration-200 hover:scale-105 active:scale-95`}
      aria-label="Back to Court"
      type="button"
    >
      <Image
        src="/ui/btn-court.png"
        alt="Back to Court"
        {...size}
        priority
        className="object-contain opacity-90 transition hover:opacity-100"
      />
    </button>
  );
}
