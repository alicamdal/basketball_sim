"use client";

import { useEffect, useState, useRef } from "react";

type MatchEvent = {
  id: string;
  text: string;
  timestamp: Date;
};

export function MatchSimulation() {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // Demo match events
  useEffect(() => {
    const demoEvents: MatchEvent[] = [
      { id: "1", text: "Match started! Lakers vs Warriors", timestamp: new Date(Date.now() - 10000) },
      { id: "2", text: "LeBron James scores a 3-pointer! 3-0", timestamp: new Date(Date.now() - 9000) },
      { id: "3", text: "Stephen Curry answers with a deep three! 3-3", timestamp: new Date(Date.now() - 8000) },
      { id: "4", text: "Anthony Davis with a powerful dunk! 5-3", timestamp: new Date(Date.now() - 7000) },
      { id: "5", text: "Klay Thompson hits from downtown! 5-6", timestamp: new Date(Date.now() - 6000) },
    ];
    setEvents(demoEvents);

    // Simulate new events coming in
    const interval = setInterval(() => {
      const newEvent: MatchEvent = {
        id: Date.now().toString(),
        text: getRandomEvent(),
        timestamp: new Date(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }, 5000); // New event every 5 seconds

    return () => clearInterval(interval);
  }, []);

  function getRandomEvent(): string {
    const events = [
      "Defensive rebound secured",
      "Fast break opportunity!",
      "Assist to the corner for three!",
      "Offensive foul called",
      "Timeout called by the coach",
      "Substitution: Player coming in",
      "Jump ball situation",
      "Free throw made",
      "Steal and quick score!",
      "Block at the rim!",
    ];
    return events[Math.floor(Math.random() * events.length)];
  }

  return (
    <div className="fixed bottom-6 left-[580px] right-[400px] h-[280px] z-40">
      <div className="flex h-full w-full flex-col rounded-xl border border-white/20 bg-black/50 shadow-lg backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-xs font-semibold text-white">Live Match</h3>
          </div>
          <div className="text-[10px] font-medium text-white/50">
            Q1 - 8:45
          </div>
        </div>

        {/* Events feed */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {events.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-xs text-white/40">Waiting for match to start...</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="animate-[slideIn_0.2s_ease-out] rounded-lg bg-white/5 px-2.5 py-1.5 transition-all hover:bg-white/10"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-white/90 flex-1">
                    {event.text}
                  </span>
                  <span className="text-[9px] text-white/30 flex-shrink-0">
                    {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={eventsEndRef} />
        </div>
      </div>
    </div>
  );
}
