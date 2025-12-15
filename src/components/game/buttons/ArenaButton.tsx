"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function ArenaButton() {
  const router = useRouter();
  const positionClass = "fixed bottom-[500px] right-[100px]";
  const size = { width: 420, height: 70 };

  function onClick() {
    router.push("/arena");
  }

  return (
    <button
      onClick={onClick}
      className={`${positionClass} z-50 transition-transform duration-200 hover:scale-105 active:scale-95`}
      aria-label="Go to Arena"
      type="button"
    >
      <Image
        src="/ui/btn-vs.png"
        alt="Go to Arena"
        {...size}
        priority
        className="object-contain opacity-90 transition hover:opacity-100"
      />
    </button>
  );
}
