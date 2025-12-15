"use client";

import Image from "next/image";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";

export function FixtureModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [currentDate] = useState(new Date());
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });
  const firstDayOfWeek = getDay(startOfCurrentMonth);
  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // Dummy fixture for 18 Aralık
  const fixtureDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 18);
  const fixture = {
    date: fixtureDate,
    teamName: "Boston Celtics",
    logo: "/teams/logo.png",
    time: "19:00"
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
      <div className="relative w-[90vw] max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white flex items-center justify-center">
        <Image
          src="/arena/arena-bg.jpg"
          alt="Popup Background"
          fill
          className="object-cover"
          style={{ zIndex: 1 }}
        />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 transition"
          aria-label="Kapat"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Takvim UI */}
        <div className="absolute left-1/2 -translate-x-1/2 top-10 flex flex-col items-center justify-center z-10">
          <div className="text-2xl font-bold mb-4 text-white drop-shadow-lg">{format(currentDate, "MMMM yyyy")}</div>
          <div className="grid grid-cols-7 gap-4 bg-white/20 rounded-xl p-6 w-[80vw] max-w-4xl h-[60vh] items-center justify-center">
            {weekDays.map((day) => (
              <div key={day} className="text-lg font-semibold text-white text-center mb-2 drop-shadow">{day}</div>
            ))}
            {/* Boş kutular */}
            {Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }).map((_, i) => (
              <div key={"empty-" + i} />
            ))}
            {/* Günler */}
            {daysInMonth.map((day) => {
              const isFixtureDay = format(day, "yyyy-MM-dd") === format(fixture.date, "yyyy-MM-dd");
              return (
                <div
                  key={day.toISOString()}
                  className={`relative flex flex-col items-center justify-end w-20 h-20 md:w-24 md:h-24 rounded-xl transition border-2 border-transparent overflow-hidden ${format(day, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd") ? "bg-amber-400/80 text-white border-amber-600" : "bg-white/0 text-white hover:bg-blue-200/20"}`}
                  style={{ minWidth: 64, minHeight: 64 }}
                >
                  {/* Gün tarihi sol üstte */}
                  <span className="absolute top-1 left-2 text-xs font-bold text-white/80 drop-shadow">{format(day, "d")}</span>
                  {isFixtureDay && (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-blue-600 rounded-xl">
                      <img src={fixture.logo} alt="logo" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <span className="text-xs md:text-sm font-semibold text-white mt-1">{fixture.time}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
