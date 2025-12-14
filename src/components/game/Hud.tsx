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
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
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

  const formattedNow = formatter.format(now);

  return (
    <div className="w-[360px] rounded-2xl border border-white/15 bg-black/55 p-4 text-white shadow backdrop-blur">
      {/* TOP: LOGO + USER */}
      <div className="flex items-center gap-4">
        {/* TEAM LOGO */}
        <div className="h-[72px] w-[72px] flex-shrink-0 rounded-full bg-black/40 p-1 shadow-lg">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <Image
              src="/teams/logo.png"
              alt="Team Logo"
              fill
              sizes="72px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* USER INFO */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{username}</div>
            <div className="text-xs opacity-80">Lv {level}</div>
          </div>

          {/* XP */}
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-xs opacity-80">
              <span>XP</span>
              <span>
                {xp}/{xpToNext}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/15">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* MONEY */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs opacity-80">Para</div>
            <div className="text-sm font-semibold">
              {Number(money).toLocaleString("tr-TR")} ₺
            </div>
          </div>

          {/* LIVE DATE/TIME */}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs opacity-80">Tarih/Saat</div>
            <div className="text-xs font-semibold tabular-nums">{formattedNow}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
