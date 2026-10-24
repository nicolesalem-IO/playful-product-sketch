import { describe, expect, it } from "vitest";

import { initialState, type AppState, type Evidence } from "@/lib/store";
import { hasContent, mergeStates } from "@/lib/sync";

const ev = (id: string): Evidence => ({
  id,
  title: id,
  content: "",
  category: "learning",
  date: "2026-10-01",
  favorite: false,
});

describe("mergeStates", () => {
  it("uses the account copy when this browser is empty", () => {
    const cloud: AppState = { ...initialState, onboarded: true, evidence: [ev("a")] };
    const local: AppState = { ...initialState, lastVisit: "2026-10-24" };
    const out = mergeStates(cloud, local);
    expect(out.evidence.map((e) => e.id)).toEqual(["a"]);
    expect(out.onboarded).toBe(true);
    expect(out.lastVisit).toBe("2026-10-24");
  });

  it("keeps this browser's data when the account is empty", () => {
    const local: AppState = { ...initialState, evidence: [ev("b")] };
    expect(mergeStates({ ...initialState }, local)).toBe(local);
  });

  it("keeps entries from both sides without duplicates", () => {
    const cloud: AppState = { ...initialState, onboarded: true, evidence: [ev("a"), ev("shared")] };
    const local: AppState = { ...initialState, evidence: [ev("shared"), ev("b")] };
    expect(mergeStates(cloud, local).evidence.map((e) => e.id)).toEqual(["a", "shared", "b"]);
  });

  it("prefers a completed session over an unfinished draft", () => {
    const cloud: AppState = {
      ...initialState,
      onboarded: true,
      progress: { s1: { completedAt: "2026-10-20T10:00:00Z" } },
    };
    const local: AppState = {
      ...initialState,
      progress: {
        s1: {
          draft: {
            step: "reflect",
            mode: "full",
            reflection: "",
            followUp: "",
            actionChoice: "primary",
          },
        },
      },
    };
    expect(mergeStates(cloud, local).progress["s1"]?.completedAt).toBe("2026-10-20T10:00:00Z");
  });

  it("treats a fresh state as having no content", () => {
    expect(hasContent(initialState)).toBe(false);
  });
});
