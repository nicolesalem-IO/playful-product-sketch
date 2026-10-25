import { modules, sessions, sessionsInModule, type ModuleId, type Session, type Upcoming } from "@/content/curriculum";

export const changeOptions = [
  { id: "returning", label: "Returning to work after time away" },
  { id: "field", label: "Moving into a different field" },
  { id: "newrole", label: "Looking for a new role" },
  { id: "leadership", label: "Moving toward leadership" },
  { id: "footing", label: "Finding my footing in a new role" },
  { id: "next", label: "Figuring out what comes next" },
  { id: "other", label: "Something else" },
];

export const wantOptions: { id: string; label: string; module: ModuleId }[] = [
  { id: "talk", label: "Talking about my accomplishments", module: "contribution" },
  { id: "grounded", label: "Feeling grounded in what I offer", module: "value" },
  { id: "respected", label: "Being respected while being myself", module: "warmth" },
  { id: "speak", label: "Speaking up and being more visible", module: "visible" },
  { id: "connect", label: "Building professional connections", module: "connect" },
  { id: "ask", label: "Asking for what I want", module: "ask" },
  { id: "forward", label: "Moving forward without waiting to feel completely ready", module: "visible" },
];

export const momentOptions: { id: string; label: string; module?: ModuleId; reason?: string }[] = [
  { id: "compliment", label: "When someone compliments my work", module: "contribution", reason: "compliments can be hard to receive" },
  { id: "introduce", label: "When I introduce myself", module: "warmth", reason: "introductions are a moment you hold back" },
  { id: "share", label: "When I share an accomplishment", module: "contribution", reason: "sharing accomplishments is a moment you hold back" },
  { id: "disagree", label: "When I disagree or offer an idea", module: "visible", reason: "offering ideas is a moment you hold back" },
  { id: "help", label: "When I ask for help or an opportunity", module: "ask", reason: "asking for help or opportunities feels hard" },
  { id: "comp", label: "When I discuss compensation", module: "ask", reason: "compensation conversations feel hard" },
  { id: "compare", label: "When I compare myself with someone else", module: "grounded", reason: "comparison tends to pull at you" },
  { id: "unsure", label: "I'm not sure yet" },
];

export const responseOptions: { id: string; label: string; module?: ModuleId; reason?: string }[] = [
  { id: "credit", label: "Give other people most of the credit", module: "contribution", reason: "giving others most of the credit" },
  { id: "apologize", label: "Apologize before I have said anything", module: "visible", reason: "apologizing before you've said anything" },
  { id: "overexplain", label: "Explain more than I need to", module: "visible", reason: "explaining more than you need to" },
  { id: "quiet", label: "Stay quiet and hope someone notices", module: "visible", reason: "staying quiet and hoping someone notices" },
  { id: "guarded", label: "Become guarded or overly formal", module: "warmth", reason: "becoming guarded or overly formal" },
  { id: "wait", label: "Wait until I feel completely prepared", module: "visible", reason: "waiting until you feel completely prepared" },
  { id: "replay", label: "Replay the conversation afterward", module: "grounded", reason: "replaying conversations afterward" },
  { id: "other", label: "Something else" },
  { id: "unsure", label: "I'm not sure" },
];

export const strengthStarters = [
  "Solving a problem", "Supporting someone", "Leading a group", "Explaining something",
  "Organizing a difficult situation", "Creating something", "Making a decision",
];

const focusIntro: Record<ModuleId, string> = {
  value: "We'll begin with what you want to be known for, and how people see you today.",
  contribution: "We'll begin with naming your part in your wins while thanking the people who helped.",
  warmth: "We'll begin with showing warmth and competence together, in ways that feel like you.",
  visible: "We'll begin with manageable ways to let your work be seen, in the room and online.",
  connect: "We'll begin with small acts of generosity and reconnecting with people who know your work.",
  ask: "We'll begin with naming what you want plainly.",
  grounded: "We'll begin with separating what happened from the story you add to it.",
};

export interface Selections { wants: string[]; moments: string[]; responses: string[] }

/** Transparent rule-based recommendation: responses weigh 3, moments 2, wants 1. */
export function recommendFocus(sel: Selections): ModuleId {
  const score = new Map<ModuleId, number>();
  const add = (m: ModuleId | undefined, w: number) => m && score.set(m, (score.get(m) ?? 0) + w);
  sel.responses.forEach((id) => add(responseOptions.find((o) => o.id === id)?.module, 3));
  sel.moments.forEach((id) => add(momentOptions.find((o) => o.id === id)?.module, 2));
  sel.wants.forEach((id) => add(wantOptions.find((o) => o.id === id)?.module, 1));
  let best: ModuleId = "value";
  let bestScore = 0;
  for (const m of modules) {
    const s = score.get(m.id) ?? 0;
    if (s > bestScore) { best = m.id; bestScore = s; }
  }
  return best;
}

export function explainFocus(focus: ModuleId, sel: Selections): string {
  const r = responseOptions.find((o) => sel.responses.includes(o.id) && o.module === focus);
  if (r?.reason) return `You mentioned ${r.reason}. ${focusIntro[focus]}`;
  const m = momentOptions.find((o) => sel.moments.includes(o.id) && o.module === focus);
  if (m?.reason) return `You mentioned that ${m.reason}. ${focusIntro[focus]}`;
  const w = wantOptions.find((o) => sel.wants.includes(o.id) && o.module === focus);
  if (w) return `You said you'd like to feel more comfortable ${w.label.charAt(0).toLowerCase() + w.label.slice(1)}. ${focusIntro[focus]}`;
  return focusIntro[focus];
}

/** First incomplete session in the focus module, then following modules in order. */
export function nextSession(focus: ModuleId, completed: string[]): Session {
  const start = modules.findIndex((m) => m.id === focus);
  for (let i = 0; i < modules.length; i++) {
    const mod = modules[(start + i) % modules.length]!;
    const s = sessionsInModule(mod.id).find((x) => !completed.includes(x.id));
    if (s) return s;
  }
  return sessionsInModule(focus)[0] ?? sessions[0]!;
}

export function suggestForUpcoming(up: Upcoming, completed: string[], limit = 3) {
  if (up === "none") return [];
  const matches = sessions.filter((s) => s.upcoming?.includes(up));
  return [...matches.filter((s) => !completed.includes(s.id)), ...matches.filter((s) => completed.includes(s.id))].slice(0, limit);
}
