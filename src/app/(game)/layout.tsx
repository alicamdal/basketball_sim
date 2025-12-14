"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { MeDTO } from "@/lib/types";
import { Hud } from "@/components/game/Hud";
import { GoToCityButton } from "@/components/game/GoToCityButton";
import { GoToCourtButton } from "@/components/game/GoToCourtButton";
import { ChatPanel } from "@/components/game/ChatPanel";
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
      // Yeni sayfa girerken smooth bir giriş
      if (t === "toCourt") return { opacity: 0, scale: 0.92, filter: "blur(8px)" };
      if (t === "toCity") return { opacity: 0, scale: 1.08, filter: "blur(8px)" };
      return { opacity: 0, scale: 1.0, filter: "blur(0px)" };
    },
    animate: {
      opacity: 1,
      scale: 1.0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0] as const, // cubic-bezier for smooth easing
        opacity: { duration: 0.4 },
        scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }, // slight bounce
        filter: { duration: 0.35 }
      }
    },
    exit: () => {
      if (t === "toCourt") {
        return {
          opacity: 0,
          scale: 1.15,
          filter: "blur(10px)",
          transition: {
            duration: 0.4,
            ease: [0.76, 0, 0.24, 1] as const,
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
            filter: { duration: 0.3 }
          }
        };
      }
      if (t === "toCity") {
        return {
          opacity: 0,
          scale: 0.85,
          filter: "blur(10px)",
          transition: {
            duration: 0.4,
            ease: [0.76, 0, 0.24, 1] as const,
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 },
            filter: { duration: 0.3 }
          }
        };
      }
      return {
        opacity: 0,
        scale: 1.0,
        filter: "blur(5px)",
        transition: { duration: 0.3 }
      };
    },
  };

  return (
    <AnimatePresence mode="wait">
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
  const pathname = usePathname();

  useEffect(() => {
    getJSON<MeDTO>("/api/me").then(setMe).catch(console.error);
  }, []);

  const isCity = pathname?.startsWith("/city");

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

        {/* City/Court butonları - sayfaya göre */}
        {isCity ? <GoToCourtButton /> : <GoToCityButton />}

        {/* Chat paneli her sahnede */}
        <ChatPanel />
      </div>
    </GameTransitionProvider>
  );
}
