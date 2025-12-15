"use client";
import { useEffect, useState } from "react";
import type { RosterDTO } from "@/lib/types";

export function SalaryPanels() {
  const [salary, setSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(100000000); // örnek max

  useEffect(() => {
    fetch("/api/roster")
      .then((res) => res.json())
      .then((data: RosterDTO) => {
        const allPlayers = [...(data.starters || []), ...(data.bench || [])];
        const total = allPlayers.reduce((sum, slot) => sum + Number(slot.player.salary || 0), 0);
        setSalary(total);
      });
  }, []);

  return (
    <div className="fixed top-6 right-40 z-30 flex flex-row gap-4 items-start">
      <div className="bg-black/70 text-white rounded-xl px-5 py-3 shadow-lg border border-white/20 min-w-[180px] text-right">
        <div className="text-xs text-white/60 mb-1">Toplam Maaş</div>
        <div className="text-lg font-bold">{salary.toLocaleString("tr-TR")} ₺</div>
      </div>
      <div className="bg-black/70 text-white rounded-xl px-5 py-3 shadow-lg border border-white/20 min-w-[180px] text-right">
        <div className="text-xs text-white/60 mb-1">Maksimum Maaş</div>
        <div className="text-lg font-bold">{maxSalary.toLocaleString("tr-TR")} ₺</div>
      </div>
    </div>
  );
}
