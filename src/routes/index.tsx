import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { AppShell, Loading } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";
import { moduleById, sessionById, upcomingOptions, type Upcoming } from "@/content/curriculum";
import { nextSession, suggestForUpcoming } from "@/lib/recommend";
import { useApp, completedIds, localDate, type ActionStatus } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today | Own Your Presence" },
      { name: "description", content: "Your daily practice for naming your strengths and letting them be seen." },
      { property: "og:title", content: "Own Your Presence | Warmth. Confidence. Recognition." },
      { property: "og:description", content: "Short coaching sessions for women navigating career transitions." },
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
  const followUps = state.actions.filter((a) => a.status === "planned" && a.createdDate !== today && a.snoozedDate !== today).slice(0, 1);
  const inProgress = Object.entries(state.progress).find(([, p]) => p.draft && !p.completedAt && p.draft.step !== "idea");
  const minutes = state.profile.rhythm === "quick" ? "About 2 minutes" : state.profile.rhythm === "deep" ? "About 5 minutes" : "2–5 minutes";

  return (
    <AppShell>
      <div className="mb-8 animate-rise">
        <p className="eyebrow mb-2">{greet}{state.profile.name ? `, ${state.profile.name}` : ""}</p>
        <h1 className="text-4xl leading-tight text-primary md:text-5xl">{daysAway > 2 ? "Welcome back. You can begin with what matters today." : line}</h1>
      </div>

      {!state.onboarded && (
        <div className="mb-6 rounded-xl bg-surface p-5">
          <p>You're exploring. When you're ready, a few questions can tailor your sessions.</p>
          <Link to="/welcome" className="btn btn-secondary mt-3">Find my starting point</Link>
        </div>
      )}

      {followUps.map((a) => <FollowUp key={a.id} id={a.id} />)}

      {doneToday ? (
        <section className="card-quiet p-6 md:p-8 animate-rise" aria-label="Today's completed practice">
          <div className="flex items-center gap-3 text-success">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground"><Check className="h-4 w-4" aria-hidden /></span>
            <span className="font-semibold">Today's practice is complete</span>
          </div>
          <h2 className="mt-4 text-3xl text-primary">{doneToday.completion}</h2>
          <p className="mt-2 text-muted-foreground">{doneToday.title}</p>
          {(() => {
            const a = state.actions.find((x) => x.sessionId === doneToday.id && x.status === "planned");
            return a ? <p className="mt-4 rounded-lg bg-surface p-4"><span className="text-sm text-muted-foreground">Planned practice · </span>{a.text}</p> : null;
          })()}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/session/$id" params={{ id: doneToday.id }} className="btn btn-secondary">Revisit this session</Link>
            <Link to="/session/$id" params={{ id: featured.id }} className="btn btn-ghost">Try another: {featured.title}</Link>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl bg-primary p-6 text-primary-foreground md:p-8 animate-rise" aria-label="Today's practice">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">{moduleById(featured.moduleId).title} · {minutes}</p>
          <h2 className="mt-3 text-3xl leading-tight md:text-4xl">{featured.title}</h2>
          <p className="mt-3 opacity-90">{featured.quick}</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/session/$id" params={{ id: featured.id }} className="btn bg-primary-foreground text-primary hover:opacity-90">
              {state.progress[featured.id]?.draft ? "Continue today's practice" : "Begin today's practice"}
            </Link>
            <Link to="/path" className="btn text-primary-foreground underline-offset-4 hover:underline">Choose a different focus</Link>
          </div>
        </section>
      )}

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
            <p className="flex items-center gap-2 font-semibold">{preview.favorite && <Star className="h-4 w-4 fill-accent text-accent" aria-label="Favorite" />}{preview.title}</p>
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

function FollowUp({ id }: { id: string }) {
  const { state, update } = useApp();
  const a = state.actions.find((x) => x.id === id)!;
  const [stage, setStage] = useState<"ask" | "note" | "notyet" | "thanks">("ask");
  const [note, setNote] = useState("");
  const set = (patch: Partial<typeof a>) => update((s) => ({ ...s, actions: s.actions.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  const session = sessionById(a.sessionId);
  const answer = (st: ActionStatus) => {
    if (st === "yes" || st === "smaller") { setStage("note"); setPending(st); }
    else { set({ status: st }); setStage("thanks"); }
  };
  const [pending, setPending] = useState<ActionStatus>("yes");

  if (stage === "thanks") return <div className="mb-6 rounded-xl bg-surface p-5" role="status">Thanks for checking in. Your judgment about what fits is part of the practice.</div>;

  return (
    <section className="mb-6 card-quiet p-5" aria-label="Practice check-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">From “{session?.title}”</p>
          <p className="mt-1 font-semibold">{a.text}</p>
        </div>
        <button className="btn btn-ghost !min-h-9 !px-3 text-sm" onClick={() => set({ snoozedDate: localDate() })}>Dismiss</button>
      </div>
      {stage === "ask" && (
        <>
          <p className="mt-4">Did you get a chance to try this?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-secondary !min-h-10" onClick={() => answer("yes")}>Yes</button>
            <button className="btn btn-secondary !min-h-10" onClick={() => answer("smaller")}>I tried a smaller version</button>
            <button className="btn btn-secondary !min-h-10" onClick={() => setStage("notyet")}>Not yet</button>
            <button className="btn btn-secondary !min-h-10" onClick={() => answer("notright")}>I decided it wasn't right for me</button>
          </div>
        </>
      )}
      {stage === "note" && (
        <div className="mt-4">
          <label htmlFor={`note-${id}`} className="block">What did you notice? <span className="text-muted-foreground">(optional)</span></label>
          <textarea id={`note-${id}`} className="field mt-2 min-h-24" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn-primary mt-3" onClick={() => {
            update((s) => ({
              ...s,
              actions: s.actions.map((x) => (x.id === id ? { ...x, status: pending, note } : x)),
              evidence: [{ id: crypto.randomUUID(), title: pending === "smaller" ? "Tried a smaller version" : "Tried a practice", content: a.text + (note.trim() ? `\n\nWhat I noticed: ${note.trim()}` : ""), category: "actions", date: localDate(), sessionId: a.sessionId, favorite: false }, ...s.evidence],
            }));
            setStage("thanks");
          }}>Save</button>
          <p className="mt-2 text-sm text-muted-foreground">This will be added to “Actions I took.”</p>
        </div>
      )}
      {stage === "notyet" && (
        <div className="mt-4">
          <p>You can keep it, make it smaller, or let it go.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-secondary !min-h-10" onClick={() => { set({ snoozedDate: localDate() }); }}>Keep it</button>
            {session && <button className="btn btn-secondary !min-h-10" onClick={() => { set({ text: session.smaller, snoozedDate: localDate() }); }}>Make it smaller</button>}
            <button className="btn btn-secondary !min-h-10" onClick={() => { set({ status: "dismissed" }); setStage("thanks"); }}>Let it go</button>
          </div>
        </div>
      )}
    </section>
  );
}
