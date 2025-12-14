"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { MeDTO } from "@/lib/types";
import { Hud } from "@/components/game/Hud";
import { CityToggleButton } from "@/components/game/CityToggleButton";
import { GameTransitionProvider, useGameTransition } from "@/components/game/gameTransition";

import { AnimatePresence, motion } from "framer-motion";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function AnimatedScene({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { transition } = useGameTransition();

  // route’a göre varsayılan origin (klik ölçümü gelmezse)
  const fallbackOrigin = pathname.startsWith("/city")
    ? { originX: 85, originY: 85 } // city’de genelde sağ-alt
    : { originX: 50, originY: 92 }; // court’ta genelde alt-orta

  const originX = transition?.originX ?? fallbackOrigin.originX;
  const originY = transition?.originY ?? fallbackOrigin.originY;

  const t = transition?.type;

  // City -> Court: zoom IN (scale up) ve fade
  // Court -> City: zoom OUT (scale down) ve fade
  const variants = {
    initial: () => {
      // Yeni sayfa girerken küçük bir “settle” hissi
      if (t === "toCourt") return { opacity: 0, scale: 0.96 };
      if (t === "toCity") return { opacity: 0, scale: 1.04 };
      return { opacity: 0, scale: 1.0 };
    },
    animate: { opacity: 1, scale: 1.0, transition: { duration: 0.22, ease: "easeOut" } },
    exit: () => {
      if (t === "toCourt") return { opacity: 0, scale: 1.10, transition: { duration: 0.22, ease: "easeIn" } };
      if (t === "toCity") return { opacity: 0, scale: 0.90, transition: { duration: 0.22, ease: "easeIn" } };
      return { opacity: 0, scale: 1.0, transition: { duration: 0.18 } };
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        custom={{}}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ transformOrigin: `${originX}% ${originY}%` }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function GameLayout({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<MeDTO | null>(null);

  useEffect(() => {
    getJSON<MeDTO>("/api/me").then(setMe).catch(console.error);
  }, []);

  return (
    <GameTransitionProvider>
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* HUD her sahnede */}
        <div className="absolute left-6 top-6 z-20">
          <Hud me={me} />
        </div>

        {/* Sahne içeriği animasyonlu */}
        <div className="relative z-10">
          <AnimatedScene>{children}</AnimatedScene>
        </div>

        {/* City/Court butonu her sahnede */}
        <CityToggleButton />
      </div>
    </GameTransitionProvider>
  );
}
