"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { MeDTO, SlotDTO } from "@/lib/types";

type ScoreboardData = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  minutes: number;
  seconds: number;
};

type TeamStats = {
  overall: number;
  offense: number;
  defense: number;
};

function calculateTeamStats(starters: SlotDTO[]): TeamStats {
  if (starters.length === 0) return { overall: 0, offense: 0, defense: 0 };

  const overall = Math.round(
    starters.reduce((sum, s) => sum + s.player.overall, 0) / starters.length
  );
  const offense = Math.round(
    starters.reduce((sum, s) => sum + (s.player.offense ?? 0), 0) / starters.length
  );
  const defense = Math.round(
    starters.reduce((sum, s) => sum + (s.player.defense ?? 0), 0) / starters.length
  );

  return { overall, offense, defense };
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

type ScoreboardProps = {
  homeStarters?: SlotDTO[];
  awayStarters?: SlotDTO[];
  liveScore?: {
    homeScore: number;
    awayScore: number;
    quarter: number;
    timeRemaining: string;
  };
};

export function Scoreboard({ homeStarters = [], awayStarters = [], liveScore }: ScoreboardProps) {
  const [data, setData] = useState<ScoreboardData>({
    homeTeam: "Loading...",
    awayTeam: "Warriors",
    homeScore: 0,
    awayScore: 0,
    quarter: 1,
    minutes: 12,
    seconds: 0,
  });

  // Fetch user data
  useEffect(() => {
    getJSON<MeDTO>("/api/me")
      .then((userData) => {
        setData((prev) => ({
          ...prev,
          homeTeam: userData.username,
        }));
      })
      .catch(console.error);
  }, []);

  // Live score'dan gelen verileri kullan
  useEffect(() => {
    if (liveScore) {
      // timeRemaining formatı: "11:45" veya "12:00"
      const [mins, secs] = liveScore.timeRemaining.split(':').map(Number);

      setData((prev) => ({
        ...prev,
        homeScore: liveScore.homeScore,
        awayScore: liveScore.awayScore,
        quarter: liveScore.quarter,
        minutes: mins || 0,
        seconds: secs || 0,
      }));
    }
  }, [liveScore]);

  const homeStats = calculateTeamStats(homeStarters);
  const awayStats = calculateTeamStats(awayStarters);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      {/* Home Team Stats - Left */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-white/50">OVR</span>
          <span className="text-sm font-bold text-white tabular-nums">{homeStats.overall}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-red-400/70">OFF</span>
          <span className="text-xs font-semibold text-red-400 tabular-nums">{homeStats.offense}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-blue-400/70">DEF</span>
          <span className="text-xs font-semibold text-blue-400 tabular-nums">{homeStats.defense}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-black/50 px-3 py-2 text-white shadow-lg backdrop-blur-md">
        {/* Home Team (User) - Left */}
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="h-[32px] w-[32px] flex-shrink-0 rounded-full border border-white/20 p-0.5">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              <Image
                src="/teams/logo.png"
                alt="Home Team Logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          </div>
          {/* Team Info */}
          <div className="flex flex-col items-start min-w-[70px]">
            <div className="text-[10px] font-medium text-white/60">{data.homeTeam}</div>
            <div className="text-xl font-bold text-white tabular-nums">{data.homeScore}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-[1px] bg-white/20" />

        {/* Game Info */}
        <div className="flex flex-col items-center gap-0.5 px-2">
          <div className="text-[9px] font-medium text-white/50">Q{data.quarter}</div>
          <div className="text-sm font-semibold text-white tabular-nums">
            {String(data.minutes).padStart(2, '0')}:{String(data.seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-[1px] bg-white/20" />

        {/* Away Team - Right */}
        <div className="flex items-center gap-2">
          {/* Team Info */}
          <div className="flex flex-col items-end min-w-[70px]">
            <div className="text-[10px] font-medium text-white/60">{data.awayTeam}</div>
            <div className="text-xl font-bold text-white tabular-nums">{data.awayScore}</div>
          </div>
          {/* Logo */}
          <div className="h-[32px] w-[32px] flex-shrink-0 rounded-full border border-white/20 p-0.5">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              <Image
                src="/teams/opponent-logo.png"
                alt="Away Team Logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Away Team Stats - Right */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white tabular-nums">{awayStats.overall}</span>
          <span className="text-[10px] font-medium text-white/50">OVR</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-red-400 tabular-nums">{awayStats.offense}</span>
          <span className="text-[10px] font-medium text-red-400/70">OFF</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-400 tabular-nums">{awayStats.defense}</span>
          <span className="text-[10px] font-medium text-blue-400/70">DEF</span>
        </div>
      </div>
    </div>
  );
}
