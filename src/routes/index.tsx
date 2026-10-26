import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { AppShell, Loading } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";
import { ModuleArt } from "@/components/ModuleArt";
import { moduleById, sessionById, upcomingOptions, type Upcoming } from "@/content/curriculum";
import { nextSession, suggestForUpcoming } from "@/lib/recommend";
import { useApp, completedIds, localDate, uid, type ActionStatus } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today | Own Your Presence" },
      { name: "description", content: "Your daily practice for naming your strengths and letting them be seen." },
      { property: "og:title", content: "Own Your Presence | Warmth. Confidence. Recognition." },
      { property: "og:description", content: "Short coaching sessions for women navigating career transitions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Today,
});

const lines = [
  "Small, honest practice adds up.",
  "You don't need to feel ready to take one step.",
  "What you bring is worth naming.",
  "Accurate is enough. You don't need to make it bigger.",
  "Being seen can start with one sentence.",
  "Your judgment about your situation counts.",
  "Warmth and competence can live in the same moment.",
];

function Today() {
  const { state, hydrated, daysAway } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !state.onboarded && !state.explored) navigate({ to: "/welcome" });
  }, [hydrated, state.onboarded, state.explored, navigate]);

  if (!hydrated || (!state.onboarded && !state.explored)) return <Loading />;

  const today = localDate();
  const done = completedIds(state);
  const featured = nextSession(state.profile.focus, done);
  const doneToday = state.todayDone?.date === today ? sessionById(state.todayDone.sessionId) : undefined;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const line = lines[new Date().getDate() % lines.length];
  const preview = state.evidence.find((e) => e.favorite) ?? state.evidence[0];
  const plan = state.actions.filter((a) => a.status === "planned" && a.snoozedDate !== today);
  const inProgress = Object.entries(state.progress).find(([, p]) => p.draft && !p.completedAt && p.draft.step !== "idea");
  const minutes = state.profile.rhythm === "quick" ? "About 2 minutes" : state.profile.rhythm === "deep" ? "About 5 minutes" : "2–5 minutes";

  return (
    <AppShell>
      <div className="today-title mb-10 animate-rise">
        <p className="eyebrow mb-2">{greet}{state.profile.name ? `, ${state.profile.name}` : ""}</p>
        <h1 className="max-w-xl text-3xl leading-tight text-primary md:text-5xl">{daysAway > 2 ? "Welcome back. You can begin with what matters today." : line}</h1>
      </div>

      {!state.onboarded && (
        <div className="mb-6 rounded-xl bg-surface p-5">
          <p>You're exploring. When you're ready, a few questions can tailor your sessions.</p>
          <Link to="/welcome" className="btn btn-secondary mt-3">Find my starting point</Link>
        </div>
      )}

      {doneToday ? (
        <section className="completed-practice border-y py-8 animate-rise" aria-label="Today's completed practice">
          <div className="flex items-center gap-3 text-success">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-gold-foreground"><Check className="h-4 w-4" aria-hidden /></span>
            <span className="font-semibold">Today's practice is complete</span>
          </div>
          <h2 className="mt-4 text-3xl text-primary">{doneToday.completion}</h2>
          <p className="mt-2 text-muted-foreground">{doneToday.title}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/session/$id" params={{ id: doneToday.id }} className="btn btn-secondary">Revisit this session</Link>
            <Link to="/session/$id" params={{ id: featured.id }} className="btn btn-ghost">Try another: {featured.title}</Link>
          </div>
        </section>
      ) : (
        <section className="practice-feature overflow-hidden bg-primary text-primary-foreground animate-rise" aria-label="Today's practice">
          <ModuleArt id={featured.moduleId} className="block aspect-[16/6] w-full" />
          <div className="p-6 md:p-9">
          <p className="text-sm font-semibold">{moduleById(featured.moduleId).title} · {minutes}</p>
          <h2 className="mt-5 max-w-lg text-3xl leading-tight md:text-4xl">{featured.title}</h2>
          <p className="mt-4 max-w-lg">{featured.quick}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/session/$id" params={{ id: featured.id }} className="btn bg-gold text-gold-foreground hover:opacity-90">
              {state.progress[featured.id]?.draft ? "Continue today's practice" : "Begin today's practice"}
            </Link>
            <Link to="/path" className="btn text-primary-foreground underline-offset-4 hover:underline">Choose a different focus</Link>
          </div>
          </div>
        </section>
      )}

      {plan.length > 0 && <YourPlan ids={plan.map((a) => a.id)} />}

      {inProgress && inProgress[0] !== featured.id && (
        <p className="mt-4 text-muted-foreground">
          You have a session in progress:{" "}
          <Link to="/session/$id" params={{ id: inProgress[0] }} className="font-semibold text-primary underline">{sessionById(inProgress[0])?.title}</Link>
        </p>
      )}

      <ProgressPanel />

      <Upcoming />

      <section className="mt-10">
        <h2 className="mb-3 text-2xl">From your evidence</h2>
        {preview ? (
          <Link to="/evidence" className="card-quiet block p-5 hover:border-primary">
            <p className="flex items-center gap-2 font-semibold">{preview.favorite && <Star className="h-4 w-4 fill-gold text-accent" aria-label="Favorite" />}{preview.title}</p>
            <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-muted-foreground">{preview.content}</p>
          </Link>
        ) : (
          <p className="text-muted-foreground">You don't need a dramatic achievement to begin. Save one moment that reminds you what you bring.</p>
        )}
      </section>
    </AppShell>
  );
}

function Upcoming() {
  const { state, update } = useApp();
  const sel = state.upcoming;
  const suggestions = sel ? suggestForUpcoming(sel, completedIds(state)) : [];
  return (
    <section className="mt-10">
      <h2 className="mb-1 text-2xl">What's coming up?</h2>
      <p className="mb-4 text-muted-foreground">Optional. We'll point you to sessions that fit.</p>
      <div className="flex flex-wrap gap-2">
        {upcomingOptions.map((o) => (
          <button key={o.id} aria-pressed={sel === o.id} className="chip !w-auto !min-h-11"
            onClick={() => update((s) => ({ ...s, upcoming: s.upcoming === o.id ? null : (o.id as Upcoming) }))}>{o.label}</button>
        ))}
      </div>
      {suggestions.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {suggestions.map((s) => (
            <li key={s.id}>
              <Link to="/session/$id" params={{ id: s.id }} className="card-quiet flex items-center justify-between gap-3 p-4 hover:border-primary">
                <span><span className="block text-sm text-muted-foreground">{moduleById(s.moduleId).title}</span>{s.title}</span>
                {state.progress[s.id]?.completedAt && <span className="text-sm text-success">Completed</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {sel === "none" && <p className="mt-4 text-muted-foreground">That's fine. Today's practice is a good place to start.</p>}
    </section>
  );
}

function YourPlan({ ids }: { ids: string[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? ids : ids.slice(0, 3);
  return (
    <section className="mt-8" aria-labelledby="plan-heading">
      <h2 id="plan-heading" className="text-2xl">Your plan</h2>
      <p className="mb-4 text-muted-foreground">Practices you've chosen to try in your day. Check in when you've done one.</p>
      <ul className="flex flex-col gap-3">
        {shown.map((id) => <li key={id}><PlanItem id={id} /></li>)}
      </ul>
      {ids.length > 3 && (
        <button className="btn btn-ghost mt-2 -ml-3" onClick={() => setAll(!all)}>{all ? "Show fewer" : `Show all ${ids.length}`}</button>
      )}
    </section>
  );
}

function PlanItem({ id }: { id: string }) {
  const { state, update } = useApp();
  const a = state.actions.find((x) => x.id === id);
  const [stage, setStage] = useState<"ask" | "note" | "notyet" | "thanks">("ask");
  const [pending, setPending] = useState<ActionStatus>("yes");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  if (!a) return null;
  const set = (patch: Partial<typeof a>) => update((s) => ({ ...s, actions: s.actions.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  const session = sessionById(a.sessionId);
  const today = localDate();
  const when = a.due === "week" ? "This week" : a.createdDate === today ? "Today" : "Still open";

  if (stage === "thanks") {
    return <div className="rounded-xl bg-surface p-5" role="status">Thanks for checking in. Your judgment about what fits is part of the practice.</div>;
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(a.draft ?? ""); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  return (
    <article className="card-quiet p-5" aria-label={`Planned practice: ${a.text}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            <span className="mr-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-gold-foreground">{when}</span>
            From “{session?.title}”
          </p>
          <p className="mt-2 font-semibold">{a.text}</p>
        </div>
      </div>

      {a.draft && (
        <div className="mt-3 rounded-lg bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-muted-foreground">Your draft</p>
            <button className="btn btn-ghost !min-h-9 !px-3 text-sm" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <p className="mt-1 whitespace-pre-wrap">{a.draft}</p>
        </div>
      )}

      {stage === "ask" && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-primary !min-h-10" onClick={() => { setPending("yes"); setStage("note"); }}>I did it</button>
          <button className="btn btn-secondary !min-h-10" onClick={() => { setPending("smaller"); setStage("note"); }}>I did a smaller version</button>
          <button className="btn btn-secondary !min-h-10" onClick={() => setStage("notyet")}>Not yet</button>
        </div>
      )}

      {stage === "note" && (
        <div className="mt-4">
          <label htmlFor={`note-${id}`} className="block">How did it go? <span className="text-muted-foreground">(optional)</span></label>
          <textarea id={`note-${id}`} className="field mt-2 min-h-24" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn-primary mt-3" onClick={() => {
            update((s) => ({
              ...s,
              actions: s.actions.map((x) => (x.id === id ? { ...x, status: pending, note } : x)),
              evidence: [{ id: uid(), title: pending === "smaller" ? "Did a smaller version" : "Did a practice", content: a.text + (note.trim() ? `\n\nHow it went: ${note.trim()}` : ""), category: "actions", date: today, sessionId: a.sessionId, favorite: false }, ...s.evidence],
            }));
            setStage("thanks");
          }}>Save</button>
          <p className="mt-2 text-sm text-muted-foreground">This will be added to “Actions I took.”</p>
        </div>
      )}

      {stage === "notyet" && (
        <div className="mt-4">
          <p>You can keep it on your plan, make it smaller, or let it go.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-secondary !min-h-10" onClick={() => set({ snoozedDate: today })}>Keep it for later</button>
            {session && <button className="btn btn-secondary !min-h-10" onClick={() => { set({ text: session.smaller }); setStage("ask"); }}>Make it smaller</button>}
            <button className="btn btn-secondary !min-h-10" onClick={() => { set({ status: "notright" }); setStage("thanks"); }}>It isn't right for me</button>
            <button className="btn btn-ghost !min-h-10" onClick={() => { set({ status: "dismissed" }); setStage("thanks"); }}>Let it go</button>
          </div>
        </div>
      )}
    </article>
  );
}
