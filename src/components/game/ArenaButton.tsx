"use client";

import Image from "next/image";

export function ArenaButton() {
  // Şimdilik placeholder pozisyon - sen değiştireceksin
  const positionClass = "fixed bottom-[400px] right-[30px]";
  const size = { width: 600, height: 100 };

  function onClick() {
    // Şimdilik boş - ileride işlev eklenecek
    console.log("Arena button clicked");
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
