"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChatPanel } from "@/components/game/ui/ChatPanel";
import { MatchSimulation } from "@/components/game/ui/MatchSimulation";
import { Scoreboard } from "@/components/game/ui/Scoreboard";
import { ArenaPlayers } from "@/components/game/scenes/ArenaPlayers";
import { OpponentPlayers } from "@/components/game/scenes/OpponentPlayers";
import type { RosterDTO, SlotDTO } from "@/lib/types";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { generateDummyOpponent } from "@/lib/dummyOpponent";
import { websocketManager } from "@/lib/websocket";

type DragId = { slot: number };

type GameEvent = {
  type: string;
  data: any;
  timestamp: string;
};

type GameState = {
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
};

function idToDrag(id: string): DragId {
  const slotStr = id.split("-")[1];
  return { slot: Number(slotStr) };
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Roster oyuncularını WebSocket formatına çevir
function convertToWebSocketFormat(starters: SlotDTO[], teamName: string) {
  return {
    name: teamName,
    players: starters.map((slot) => ({
      id: parseInt(slot.player.id),
      name: slot.player.name,
      attack: slot.player.offense || 70,
      defense: slot.player.defense || 70,
      max_energy: 100,
    })),
  };
}

export default function ArenaPage() {
  const router = useRouter();
  const [roster, setRoster] = useState<RosterDTO | null>(null);
  const [opponentStarters] = useState(() => generateDummyOpponent());
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    homeScore: 0,
    awayScore: 0,
    quarter: 1,
    timeRemaining: "12:00",
  });

  useEffect(() => {
    getJSON<RosterDTO>("/api/roster")
      .then(setRoster)
      .catch(console.error);
  }, []);

  // WebSocket bağlantısı ve maç başlatma
  useEffect(() => {
    if (!roster || roster.starters.length === 0) return;

    console.log('Arena mounted - starting match');

    // WebSocket bağlantısını kur
    websocketManager.connect();

    // Event listener'ları ekle
    const unsubscribeEvent = websocketManager.onEvent((event) => {
      setEvents((prev) => [...prev, event]);

      // Game state'i güncelle
      if (event.type === 'game_state' || event.type === 'quarter_start' || event.type === 'score') {
        setGameState({
          homeScore: event.data.team1_score || 0,
          awayScore: event.data.team2_score || 0,
          quarter: event.data.quarter || 1,
          timeRemaining: event.data.time_remaining_formatted || "12:00",
        });
      }
    });

    const unsubscribeConnection = websocketManager.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    // Maç verilerini gönder
    if (roster.starters.length > 0) {
      const team1 = convertToWebSocketFormat(roster.starters, "Home Team");
      const team2 = convertToWebSocketFormat(opponentStarters, "Away Team");

      const gameData = {
        team1,
        team2,
      };

      console.log('Sending match data to WebSocket:', gameData);
      websocketManager.connect(gameData);
    }

    // Cleanup - listener'ları kaldır
    return () => {
      console.log('Arena unmounting');
      unsubscribeEvent();
      unsubscribeConnection();
    };
  }, [roster, opponentStarters]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const starterSlots = useMemo(() => roster?.starters ?? [], [roster]);

  function swapLocal(fromSlot: number, toSlot: number) {
    if (!roster) return;
    const clone: RosterDTO = {
      starters: roster.starters.map((x) => ({ ...x, player: { ...x.player } })),
      bench: roster.bench.map((x) => ({ ...x, player: { ...x.player } })),
    };

    const a = clone.starters.find((x) => x.slot === fromSlot);
    const b = clone.starters.find((x) => x.slot === toSlot);
    if (!a || !b) return;

    const tmp = a.player;
    a.player = b.player;
    b.player = tmp;

    setRoster(clone);
  }

  function onDragEnd(e: DragEndEvent) {
    if (!roster) return;
    const activeId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId || activeId === overId) return;

    const from = idToDrag(activeId);
    const to = idToDrag(overId);

    swapLocal(from.slot, to.slot);
  }

  // click-to-swap state
  const [clickSwap, setClickSwap] = useState<null | { location: "STARTER"; slot: number }>(null);

  async function handleClickSwap(target: { location: "STARTER"; slot: number }) {
    if (!roster) return;
    if (!clickSwap) {
      setClickSwap(target);
    } else if (clickSwap.slot !== target.slot) {
      const prev = roster;
      swapLocal(clickSwap.slot, target.slot);
      setClickSwap(null);
      try {
        await fetch("/api/roster/swap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from: clickSwap, to: target }),
        });
      } catch (err) {
        setRoster(prev);
      }
    } else {
      setClickSwap(null);
    }
  }

  function handleClose() {
    // Bağlantıyı kapat ve city'ye dön
    websocketManager.disconnect();
    setEvents([]);
    router.push("/city");
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="relative min-h-screen w-full">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center"
          style={{
            backgroundImage: "url(/arena/arena-bg.jpg)",
            backgroundSize: "100% 100%"
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* Scoreboard - top center */}
        <Scoreboard
          homeStarters={starterSlots}
          awayStarters={opponentStarters}
          liveScore={gameState}
        />

        {/* Close button - top right */}
        <button
          onClick={handleClose}
          className="fixed top-6 right-6 z-50 rounded-full bg-red-500/80 p-3 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-red-600/90 hover:shadow-xl"
          aria-label="Close Arena"
          type="button"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Players on court - left side */}
        {starterSlots.length > 0 && <ArenaPlayers starters={starterSlots} onSwap={handleClickSwap} selected={clickSwap} />}

        {/* Opponent players - right side */}
        <OpponentPlayers starters={opponentStarters} />

        {/* Chat panel - left side */}
        <ChatPanel />

        {/* Match simulation - right side */}
        <MatchSimulation events={events} isConnected={isConnected} />
      </div>
    </DndContext>
  );
}
