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
    <div className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-white shadow-lg backdrop-blur-md text-base">
      {/* TEAM LOGO */}
      <div className="h-[48px] w-[48px] flex-shrink-0 rounded-full border border-white/20 p-0.5">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
          <Image
            src="/teams/logo.png"
            alt="Team Logo"
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* USER INFO - Compact */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Username + Level */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold">{username}</div>
          <div className="rounded bg-white/20 px-2 py-1 text-[12px] font-semibold">Lv {level}</div>
        </div>

        {/* Row 2: XP Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-white/60 whitespace-nowrap">XP</span>
          <div className="h-2 w-[130px] rounded-full bg-white/10 border border-white/20">
            <div
              className="h-full rounded-full bg-white/60 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[12px] font-medium text-white/60 whitespace-nowrap">
            {xp}/{xpToNext}
          </span>
        </div>

        {/* Row 3: Money + Time */}
        <div className="flex items-center gap-3 text-[13px] font-medium text-white/80">
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span>{Number(money).toLocaleString("tr-TR")} ₺</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <span className="tabular-nums">{formattedNow}</span>
          </div>
        </div>

        {/* Row 4: Salary Info */}
        {/* Salary info removed from HUD, will be shown in separate panels */}
      </div>
    </div>
  );
}
