"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type SceneName = "CITY" | "COURT";

export type TransitionPayload = {
  from: SceneName;
  to: SceneName;
  // City’de tıklanan butonun ekran koordinatları
  anchorRect?: { left: number; top: number; width: number; height: number };
};

type Ctx = {
  payload: TransitionPayload | null;
  setPayload: (p: TransitionPayload | null) => void;
};

const SceneTransitionContext = createContext<Ctx | null>(null);

export function SceneTransitionProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<TransitionPayload | null>(null);

  const value = useMemo(() => ({ payload, setPayload }), [payload]);
  return <SceneTransitionContext.Provider value={value}>{children}</SceneTransitionContext.Provider>;
}

export function useSceneTransition() {
  const ctx = useContext(SceneTransitionContext);
  if (!ctx) throw new Error("useSceneTransition must be used within SceneTransitionProvider");
  return ctx;
}

export function rectToAnchorRect(r: DOMRect) {
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}
