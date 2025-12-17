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
  data: Record<string, unknown>;
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
  const [scoreAnim, setScoreAnim] = useState<null | {
    side: "home" | "away";
    playerId: string;
    key: number;
    points: number;
    assistPlayerId?: string;
    assistKey?: number;
  }>(null);

  const [blockAnim, setBlockAnim] = useState<null | {
    side: "home" | "away";
    playerId: string;
    key: number;
  }>(null);

  const [foulAnim, setFoulAnim] = useState<null | {
    side: "home" | "away";
    playerId: string;
    key: number;
  }>(null);

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

      // Skor animasyonu (skor yapan oyuncunun kartında)
      // Blok animasyonu (blok yapan oyuncunun kartında)
      if (event.type === "block") {
        const blockerIdRaw = event.data?.blocker_id;
        const blockerId = typeof blockerIdRaw === "number" ? blockerIdRaw : Number(blockerIdRaw ?? NaN);
        const blockerName = typeof event.data?.blocker_name === "string" ? event.data.blocker_name : undefined;
        const blockerTeam = typeof event.data?.blocker_team === "string" ? event.data.blocker_team : undefined;
        const baseKey = Date.now();

        let home = null, away = null;
        if (Number.isFinite(blockerId)) {
          home = roster.starters.find((s) => Number(s.player.id) === blockerId);
          away = opponentStarters.find((s) => Number(s.player.id) === blockerId);
        }
        if (!home && !away && blockerName) {
          home = roster.starters.find((s) => s.player.name === blockerName);
          away = opponentStarters.find((s) => s.player.name === blockerName);
        }
        if (home) {
          setBlockAnim({ side: "home", playerId: home.player.id, key: baseKey });
        } else if (away) {
          setBlockAnim({ side: "away", playerId: away.player.id, key: baseKey });
        }
      }

      // Faul animasyonu (faul yapan oyuncunun kartında)
      if (event.type === "foul") {
        const foulerIdRaw = event.data?.fouler_id;
        const foulerId = typeof foulerIdRaw === "number" ? foulerIdRaw : Number(foulerIdRaw ?? NaN);
        const foulerName = typeof event.data?.fouler_name === "string" ? event.data.fouler_name : undefined;
        const baseKey = Date.now();

        let home = null, away = null;
        if (Number.isFinite(foulerId)) {
          home = roster.starters.find((s) => Number(s.player.id) === foulerId);
          away = opponentStarters.find((s) => Number(s.player.id) === foulerId);
        }
        if (!home && !away && foulerName) {
          home = roster.starters.find((s) => s.player.name === foulerName);
          away = opponentStarters.find((s) => s.player.name === foulerName);
        }
        if (home) {
          setFoulAnim({ side: "home", playerId: home.player.id, key: baseKey });
        } else if (away) {
          setFoulAnim({ side: "away", playerId: away.player.id, key: baseKey });
        }
      }
      if (event.type === "score") {
        const scorerIdRaw = event.data?.scorer_id;
        const scorerId = typeof scorerIdRaw === "number" ? scorerIdRaw : Number(scorerIdRaw ?? NaN);
        const scorerName = typeof event.data?.scorer_name === "string" ? event.data.scorer_name : undefined;
        const scorerTeam = typeof event.data?.scorer_team === "string" ? event.data.scorer_team : undefined;
        const pointsRaw = event.data?.points;
        const points: number = typeof pointsRaw === "number" ? pointsRaw : Number(pointsRaw ?? 0);
        const assistHappened: boolean = Boolean(event.data?.assist);

        const assisterIdRaw = event.data?.assister_id;
        const assisterId = typeof assisterIdRaw === "number" ? assisterIdRaw : Number(assisterIdRaw ?? NaN);
        const assisterName = typeof event.data?.assister_name === "string" ? event.data.assister_name : undefined;

        if (scorerName || Number.isFinite(scorerId)) {
          const home = roster.starters.find((s) => (Number.isFinite(scorerId) && Number(s.player.id) === scorerId) || s.player.name === scorerName);
          const away = opponentStarters.find((s) => (Number.isFinite(scorerId) && Number(s.player.id) === scorerId) || s.player.name === scorerName);

          const assistHome = assistHappened && (assisterName || Number.isFinite(assisterId))
            ? roster.starters.find((s) => (Number.isFinite(assisterId) && Number(s.player.id) === assisterId) || s.player.name === assisterName)
            : undefined;
          const assistAway = assistHappened && (assisterName || Number.isFinite(assisterId))
            ? opponentStarters.find((s) => (Number.isFinite(assisterId) && Number(s.player.id) === assisterId) || s.player.name === assisterName)
            : undefined;

          const baseKey = Date.now();

          if (home) {
            setScoreAnim({
              side: "home",
              playerId: home.player.id,
              key: baseKey,
              points,
              assistPlayerId: assistHome?.player.id,
              assistKey: assistHome ? baseKey + 1 : undefined,
            });
          } else if (away) {
            setScoreAnim({
              side: "away",
              playerId: away.player.id,
              key: baseKey,
              points,
              assistPlayerId: assistAway?.player.id,
              assistKey: assistAway ? baseKey + 1 : undefined,
            });
          } else if (scorerTeam) {
            // isim eşleşmezse (ör: format farkı) en azından side bilgisini kullanma şansı
            // (şimdilik no-op)
          }
        }
      }

      // Game state'i güncelle
      if (event.type === 'game_state' || event.type === 'quarter_start' || event.type === 'score') {
        const team1ScoreRaw = event.data?.team1_score;
        const team2ScoreRaw = event.data?.team2_score;
        const quarterRaw = event.data?.quarter;
        const timeRemainingRaw = event.data?.time_remaining_formatted;

        setGameState({
          homeScore: typeof team1ScoreRaw === "number" ? team1ScoreRaw : 0,
          awayScore: typeof team2ScoreRaw === "number" ? team2ScoreRaw : 0,
          quarter: typeof quarterRaw === "number" ? quarterRaw : 1,
          timeRemaining: typeof timeRemainingRaw === "string" ? timeRemainingRaw : "12:00",
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
        {starterSlots.length > 0 && (
          <ArenaPlayers
            starters={starterSlots}
            onSwap={handleClickSwap}
            selected={clickSwap}
            scoreAnim={scoreAnim?.side === "home" ? scoreAnim : null}
            blockAnim={blockAnim?.side === "home" ? blockAnim : null}
            foulAnim={foulAnim?.side === "home" ? foulAnim : null}
          />
        )}

        {/* Opponent players - right side */}
        <OpponentPlayers
          starters={opponentStarters}
          scoreAnim={scoreAnim?.side === "away" ? scoreAnim : null}
          blockAnim={blockAnim?.side === "away" ? blockAnim : null}
          foulAnim={foulAnim?.side === "away" ? foulAnim : null}
        />

        {/* Chat panel - left side */}
        <ChatPanel />

        {/* Match simulation - right side */}
        <MatchSimulation events={events} isConnected={isConnected} />
      </div>
    </DndContext>
  );
}
