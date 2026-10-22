import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ModuleId, Upcoming } from "@/content/curriculum";

// All personal data lives in this browser's localStorage under one key.
// The shape is versioned so it can later be synced to account storage.
const KEY = "own-your-presence:v1";

export type Rhythm = "quick" | "deep" | "depends";
export type EvidenceCategory = "strengths" | "contributions" | "words" | "actions" | "learning";
export type ActionStatus = "planned" | "yes" | "smaller" | "notright" | "dismissed";
export type Checkin = "comfortable" | "unfamiliar" | "uncomfortable" | "notright";

export const categoryLabels: Record<EvidenceCategory, string> = {
  strengths: "Strengths I recognize",
  contributions: "Contributions I own",
  words: "Words I want to practice",
  actions: "Actions I took",
  learning: "Things I am learning",
};

export interface Profile {
  name: string;
  changes: string[];
  primaryChange: string;
  context: string;
  wants: string[];
  moments: string[];
  responses: string[];
  focus: ModuleId;
  rhythm: Rhythm;
}

export interface SessionDraft {
  step: number;
  mode: "quick" | "full";
  reflection: string;
  followUp: string;
  actionChoice: "primary" | "smaller" | "alternative";
  checkin?: Checkin;
}

export interface SessionProgress { draft?: SessionDraft; completedAt?: string }

export interface PlannedAction {
  id: string; sessionId: string; text: string; status: ActionStatus;
  note: string; createdDate: string; snoozedDate?: string;
}

export interface Evidence {
  id: string; title: string; content: string; category: EvidenceCategory;
  date: string; sessionId?: string; favorite: boolean;
}

export interface WeeklyReflection { id: string; date: string; answers: Record<string, string> }

export interface AppState {
  onboarded: boolean;
  explored: boolean;
  profile: Profile;
  progress: Record<string, SessionProgress>;
  actions: PlannedAction[];
  evidence: Evidence[];
  reflections: WeeklyReflection[];
  upcoming: Upcoming | null;
  lastVisit: string | null;
  todayDone: { date: string; sessionId: string } | null;
  reducedMotion: boolean;
}

export const defaultProfile: Profile = {
  name: "", changes: [], primaryChange: "", context: "", wants: [], moments: [], responses: [],
  focus: "value", rhythm: "depends",
};

export const initialState: AppState = {
  onboarded: false, explored: false, profile: defaultProfile, progress: {}, actions: [],
  evidence: [], reflections: [], upcoming: null, lastVisit: null, todayDone: null, reducedMotion: false,
};

export const localDate = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b + "T00:00").getTime() - new Date(a + "T00:00").getTime()) / 86400000);

interface Ctx {
  state: AppState;
  hydrated: boolean;
  daysAway: number;
  update: (fn: (s: AppState) => AppState) => void;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [daysAway, setDaysAway] = useState(0);
  const loaded = useRef(false);

  useEffect(() => {
    let s = initialState;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) s = { ...initialState, ...JSON.parse(raw) };
    } catch { /* corrupted data: start fresh */ }
    const today = localDate();
    if (s.lastVisit) setDaysAway(daysBetween(s.lastVisit, today));
    setState({ ...s, lastVisit: today });
    loaded.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
    document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
  }, [state]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);
  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setState({ ...initialState, lastVisit: localDate() });
  }, []);

  const value = useMemo(() => ({ state, hydrated, daysAway, update, reset }), [state, hydrated, daysAway, update, reset]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}

export const completedIds = (s: AppState) =>
  Object.entries(s.progress).filter(([, p]) => p.completedAt).map(([id]) => id);
