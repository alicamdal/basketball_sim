"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { MeDTO } from "@/lib/types";

export function Hud({ me }: { me: MeDTO | null }) {
  const username = me?.username ?? "Loading...";
  const level = me?.level ?? 0;
  const xp = me?.xp ?? 0;
  const xpToNext = me?.xpToNext ?? 1000;
  const money = me?.money ?? "0";

  const pct = Math.max(0, Math.min(100, (xp / xpToNext) * 100));

  // ---- LIVE CLOCK (Europe/Istanbul) ----
const [mounted, setMounted] = useState(false);
const [now, setNow] = useState<Date | null>(null);

useEffect(() => {
  setMounted(true);
  setNow(new Date());
  const id = window.setInterval(() => setNow(new Date()), 1000);
  return () => window.clearInterval(id);
}, []);

const formatter = useMemo(() => {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}, []);

// SSR sırasında boş string bas → hydration mismatch olmaz
const formattedNow = mounted && now ? formatter.format(now) : "";


  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border-3 border-blue-700/60 bg-gradient-to-br from-blue-700/60 via-blue-800/60 to-blue-900/60 px-4 py-3 text-white shadow-xl shadow-blue-900/50 backdrop-blur-sm">
      {/* TEAM LOGO */}
      <div className="h-[50px] w-[50px] flex-shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1 shadow-lg border-2 border-white/30">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
          <Image
            src="/teams/logo.png"
            alt="Team Logo"
            fill
            sizes="50px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* USER INFO - Compact */}
      <div className="flex flex-col gap-1.5">
        {/* Row 1: Username + Level */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-black drop-shadow-md">{username}</div>
          <div className="rounded-full bg-orange-400 px-2 py-0.5 text-[10px] font-black text-blue-900 shadow-md">Lv {level}</div>
        </div>

        {/* Row 2: XP Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold drop-shadow whitespace-nowrap">XP</span>
          <div className="h-2 w-[120px] rounded-full bg-white/20 border border-white/30 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-sm transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-bold drop-shadow whitespace-nowrap">
            {xp}/{xpToNext}
          </span>
        </div>

        {/* Row 3: Money + Time */}
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1">
            <span className="drop-shadow">💰</span>
            <span className="text-orange-300 drop-shadow">{Number(money).toLocaleString("tr-TR")} ₺</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="drop-shadow">🕒</span>
            <span className="tabular-nums drop-shadow">{formattedNow}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
