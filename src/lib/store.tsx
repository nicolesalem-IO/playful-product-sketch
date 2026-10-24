import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ModuleId, Upcoming } from "@/content/curriculum";
import { getSupabase } from "@/lib/supabase";
import { mergeStates } from "@/lib/sync";

// Personal data is kept in this browser's localStorage under one key. When someone
// signs in, the same state is also saved to their account in Supabase (see AppProvider).
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
  step: string;
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
  date: string; sessionId?: string | undefined; favorite: boolean;
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

export type SyncStatus = "local" | "loading" | "saving" | "saved" | "error";

interface Ctx {
  state: AppState;
  hydrated: boolean;
  daysAway: number;
  update: (fn: (s: AppState) => AppState) => void;
  reset: () => Promise<void>;
  /** Email of the signed-in account, or null when data stays only in this browser. */
  account: string | null;
  sync: SyncStatus;
  signIn: (email: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AppCtx = createContext<Ctx | null>(null);
const TABLE = "app_state";
const SAVE_DELAY = 1200;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [daysAway, setDaysAway] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [sync, setSync] = useState<SyncStatus>("local");
  const loaded = useRef(false);
  // Cloud saves start only after the account copy has been pulled and merged,
  // so a fresh browser can never overwrite someone's saved data with an empty state.
  const cloudReady = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

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

  // Follow the sign-in session once local data has loaded.
  useEffect(() => {
    if (!hydrated) return;
    const sb = getSupabase();
    if (!sb) return;
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setAccount(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [hydrated]);

  // On sign-in: pull the account copy, merge it with this browser, and save the result back.
  useEffect(() => {
    const sb = getSupabase();
    cloudReady.current = false;
    if (!sb || !userId) { setSync("local"); return; }
    let cancelled = false;
    setSync("loading");
    (async () => {
      const { data, error } = await sb.from(TABLE).select("data").eq("user_id", userId).maybeSingle();
      if (cancelled) return;
      if (error) { setSync("error"); return; }
      const cloud = data?.data ? ({ ...initialState, ...(data.data as Partial<AppState>) } as AppState) : null;
      const merged = cloud ? mergeStates(cloud, stateRef.current) : stateRef.current;
      setState(merged);
      const { error: saveError } = await sb.from(TABLE).upsert({ user_id: userId, data: merged });
      if (cancelled) return;
      cloudReady.current = true;
      setSync(saveError ? "error" : "saved");
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // Save changes to the account a moment after they stop.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userId || !cloudReady.current) return;
    setSync("saving");
    const t = setTimeout(async () => {
      const { error } = await sb.from(TABLE).upsert({ user_id: userId, data: state });
      setSync(error ? "error" : "saved");
    }, SAVE_DELAY);
    return () => clearTimeout(t);
  }, [state, userId]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  const reset = useCallback(async () => {
    const sb = getSupabase();
    if (sb && userId) await sb.from(TABLE).delete().eq("user_id", userId);
    localStorage.removeItem(KEY);
    setState({ ...initialState, lastVisit: localDate() });
  }, [userId]);

  const signIn = useCallback(async (email: string) => {
    const sb = getSupabase();
    if (!sb) return "Sign-in isn't available right now.";
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/settings` },
    });
    return error ? error.message : null;
  }, []);

  // Signing out clears this browser, since everything is safely stored in the account.
  const signOut = useCallback(async () => {
    const sb = getSupabase();
    cloudReady.current = false;
    if (sb) await sb.auth.signOut();
    localStorage.removeItem(KEY);
    setState({ ...initialState, lastVisit: localDate() });
  }, []);

  const value = useMemo(
    () => ({ state, hydrated, daysAway, update, reset, account, sync, signIn, signOut }),
    [state, hydrated, daysAway, update, reset, account, sync, signIn, signOut],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}

export const completedIds = (s: AppState) =>
  Object.entries(s.progress).filter(([, p]) => p.completedAt).map(([id]) => id);
