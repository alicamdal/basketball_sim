"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type GameTransitionType = "toCity" | "toCourt";

export type GameTransitionState = {
  type: GameTransitionType;
  originX: number; // 0..100
  originY: number; // 0..100
  ts: number;      // key refresh
} | null;

type Ctx = {
  transition: GameTransitionState;
  setTransition: (t: GameTransitionState) => void;
};

const GameTransitionContext = createContext<Ctx | null>(null);

export function GameTransitionProvider({ children }: { children: React.ReactNode }) {
  const [transition, setTransition] = useState<GameTransitionState>(null);

  const value = useMemo(() => ({ transition, setTransition }), [transition]);
  return <GameTransitionContext.Provider value={value}>{children}</GameTransitionContext.Provider>;
}

export function useGameTransition() {
  const ctx = useContext(GameTransitionContext);
  if (!ctx) throw new Error("useGameTransition must be used inside GameTransitionProvider");
  return ctx;
}
