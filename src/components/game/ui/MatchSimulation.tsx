"use client";

import { useEffect, useRef } from "react";

type GameEvent = {
  type: string;
  data: any;
  timestamp: string;
};

type DisplayEvent = {
  id: string;
  text: string;
  timestamp: Date;
};

type Props = {
  events?: GameEvent[];
  isConnected?: boolean;
};

export function MatchSimulation({ events = [], isConnected = false }: Props) {
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // WebSocket olaylarını görsel mesajlara çevir
  function formatEvent(event: GameEvent): string {
    const { type, data } = event;

    switch (type) {
      case 'game_start':
        return `🏀 MAÇ BAŞLADI: ${data.team1_name} vs ${data.team2_name}`;

      case 'quarter_start':
        return `🏀 ${data.quarter}. ÇEYREK BAŞLADI - Skor: ${data.team1_name} ${data.team1_score} - ${data.team2_score} ${data.team2_name}`;

      case 'game_state':
        return `⏱️ ${data.time_remaining_formatted} | Skor: ${data.team1_score}-${data.team2_score} | Top: ${data.possession}`;

      case 'score':
        const assistText = data.assist ? ` (Asist: ${data.assister_name})` : '';
        return `✅ SAYI! ${data.scorer_name} (${data.scorer_team}) - ${data.points} sayı${assistText}`;

      case 'miss':
        return `❌ Iskalama: ${data.shooter_name} (${data.shooter_team})`;

      case 'block':
        return `🚫 BLOK! ${data.blocker_name} (${data.blocker_team}) → ${data.shooter_name}`;

      case 'foul':
        const shootingFoul = data.shooting_foul ? ' [Şut faülü]' : '';
        return `🚨 FAUL! ${data.fouler_name} (${data.fouler_team}) → ${data.victim_name}${shootingFoul}`;

      case 'free_throw':
        const result = data.made ? '✅ BULDU' : '❌ ISKALADI';
        return `🎯 Serbest atış ${data.attempt}/${data.total_attempts}: ${data.player_name} ${result}`;

      case 'turnover':
        return `🔄 Top kaybı: ${data.player_name} (${data.team})`;

      case 'quarter_end':
        return `🏁 ${data.quarter}. ÇEYREK BİTTİ - Çeyrek: ${data.team1_quarter_score}-${data.team2_quarter_score} | Toplam: ${data.team1_total_score}-${data.team2_total_score}`;

      case 'game_end':
        const winner = data.winner !== 'tie'
          ? `🏆 KAZANAN: ${data.winner}`
          : '🤝 BERABERE!';
        return `🎉 MAÇ BİTTİ! ${data.team1_name} ${data.team1_score} - ${data.team2_score} ${data.team2_name} | ${winner}`;

      case 'error':
        return `❌ HATA: ${data.message}`;

      default:
        return `${type}: ${JSON.stringify(data)}`;
    }
  }

  // GameEvent'leri DisplayEvent'lere çevir
  const displayEvents: DisplayEvent[] = events.map((event, index) => ({
    id: `${event.timestamp}-${index}`,
    text: formatEvent(event),
    timestamp: new Date(event.timestamp)
  }));

  return (
    <div className="fixed bottom-6 left-[580px] right-[400px] h-[280px] z-40">
      <div className="flex h-full w-full flex-col rounded-xl border border-white/20 bg-black/50 shadow-lg backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <h3 className="text-xs font-semibold text-white">
              {isConnected ? 'Live Match' : 'Disconnected'}
            </h3>
          </div>
          <div className="text-[10px] font-medium text-white/50">
            Basketball Simulation
          </div>
        </div>

        {/* Events feed */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {displayEvents.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-xs text-white/40">
                {isConnected ? 'Waiting for match to start...' : 'Connecting to server...'}
              </p>
            </div>
          ) : (
            displayEvents.map((event) => (
              <div
                key={event.id}
                className="animate-[slideIn_0.2s_ease-out] rounded-lg bg-white/5 px-2.5 py-1.5 transition-all hover:bg-white/10"
              >
                <div className="flex items-start gap-2">
                  <span className="text-[15px] text-white/90 flex-1">
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
