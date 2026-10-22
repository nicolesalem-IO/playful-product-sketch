import { describe, expect, it } from "vitest";
import { recommendFocus, nextSession, suggestForUpcoming } from "@/lib/recommend";
import { sessions, modules } from "@/content/curriculum";

describe("curriculum", () => {
  it("has 7 modules with 3 sessions each", () => {
    expect(modules).toHaveLength(7);
    expect(sessions).toHaveLength(21);
    modules.forEach((m) => expect(sessions.filter((s) => s.moduleId === m.id)).toHaveLength(3));
  });
});

describe("recommendations", () => {
  it("giving credit away points to Own Your Contribution", () => {
    expect(recommendFocus({ wants: [], moments: [], responses: ["credit"] })).toBe("contribution");
  });
  it("replaying conversations points to Stay Grounded", () => {
    expect(recommendFocus({ wants: [], moments: [], responses: ["replay"] })).toBe("grounded");
  });
  it("defaults to Recognize Your Value with no answers", () => {
    expect(recommendFocus({ wants: [], moments: [], responses: [] })).toBe("value");
  });
  it("picks the first incomplete session in the focus, then moves on", () => {
    expect(nextSession("contribution", []).id).toBe("s4");
    expect(nextSession("contribution", ["s4", "s5", "s6"]).id).toBe("s7");
  });
  it("changing focus changes the recommendation", () => {
    expect(nextSession("ask", []).id).not.toBe(nextSession("value", []).id);
  });
  it("nothing specific coming up suggests no sessions", () => {
    expect(suggestForUpcoming("none", [])).toEqual([]);
  });
});
