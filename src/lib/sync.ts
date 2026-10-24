import type { AppState, SessionProgress } from "@/lib/store";

/** True when someone has entered anything worth keeping. */
export function hasContent(s: AppState): boolean {
  return (
    s.onboarded ||
    s.evidence.length > 0 ||
    s.actions.length > 0 ||
    s.reflections.length > 0 ||
    Object.keys(s.progress).length > 0
  );
}

function mergeById<T extends { id: string }>(primary: T[], secondary: T[]): T[] {
  const seen = new Set(primary.map((x) => x.id));
  return [...primary, ...secondary.filter((x) => !seen.has(x.id))];
}

function mergeProgress(a: Record<string, SessionProgress>, b: Record<string, SessionProgress>) {
  const out: Record<string, SessionProgress> = { ...b };
  for (const [id, p] of Object.entries(a)) {
    const other = out[id];
    // A completed session wins over an unfinished draft from the other device.
    out[id] = other?.completedAt && !p.completedAt ? other : p;
  }
  return out;
}

/**
 * Combine the copy saved in the account (cloud) with what is in this browser (local),
 * so signing in on a device you already used never throws away entries from either side.
 * The account copy wins for single values like the profile and settings.
 */
export function mergeStates(cloud: AppState, local: AppState): AppState {
  if (!hasContent(local)) return { ...cloud, lastVisit: local.lastVisit ?? cloud.lastVisit };
  if (!hasContent(cloud)) return local;
  return {
    ...cloud,
    onboarded: cloud.onboarded || local.onboarded,
    explored: cloud.explored || local.explored,
    profile: cloud.onboarded ? cloud.profile : local.profile,
    progress: mergeProgress(cloud.progress, local.progress),
    actions: mergeById(cloud.actions, local.actions),
    evidence: mergeById(cloud.evidence, local.evidence),
    reflections: mergeById(cloud.reflections, local.reflections),
    upcoming: cloud.upcoming ?? local.upcoming,
    todayDone:
      [cloud.todayDone, local.todayDone]
        .filter(Boolean)
        .sort((x, y) => (y!.date > x!.date ? 1 : -1))[0] ?? null,
    lastVisit: local.lastVisit ?? cloud.lastVisit,
  };
}
