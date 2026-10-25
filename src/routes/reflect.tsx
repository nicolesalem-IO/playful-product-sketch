import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, CalendarDays, NotebookPen } from "lucide-react";
import { AppShell, PageTitle, Loading } from "@/components/AppShell";
import { moduleById, sessionById } from "@/content/curriculum";
import { useApp, localDate, uid, daysBetween } from "@/lib/store";

export const Route = createFileRoute("/reflect")({
  head: () => ({
    meta: [
      { title: "Reflect — Own Your Presence" },
      { name: "description", content: "An optional weekly reflection on what you practiced and noticed." },
      { property: "og:title", content: "Reflect — Own Your Presence" },
      { property: "og:description", content: "An optional weekly reflection on what you practiced and noticed." },
    ],
  }),
  component: ReflectPage,
});

const prompts = [
  { id: "credit", q: "Where did you give yourself more credit?" },
  { id: "practiced", q: "What did you practice, even if it felt awkward?" },
  { id: "surprised", q: "What response or result surprised you?" },
  { id: "fit", q: "What felt authentic—and what did not fit?" },
  { id: "carry", q: "What would you like to carry into next week?" },
];

function ReflectPage() {
  const { state, hydrated, update } = useApp();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  if (!hydrated) return <Loading />;

  const today = localDate();
  const inWeek = (d: string) => daysBetween(d, today) < 7;
  const sessionsDone = Object.entries(state.progress).filter(([, p]) => p.completedAt && inWeek(localDate(new Date(p.completedAt))));
  const tried = state.actions.filter((a) => (a.status === "yes" || a.status === "smaller"));
  const evidenceWeek = state.evidence.filter((e) => inWeek(e.date));
  const themes = [...new Set(sessionsDone.map(([id]) => sessionById(id)?.moduleId).filter(Boolean))].map((m) => moduleById(m!).title);
  const hasActivity = sessionsDone.length + evidenceWeek.length + tried.length > 0;

  const submit = () => {
    const clean = Object.fromEntries(Object.entries(answers).filter(([, v]) => v.trim()));
    if (!Object.keys(clean).length) return;
    update((s) => ({ ...s, reflections: [{ id: uid(), date: today, answers: clean }, ...s.reflections] }));
    setAnswers({});
    setSaved(true);
  };

  return (
    <AppShell>
      <PageTitle eyebrow="Weekly, optional" title="Reflect">Answer any of these that feel useful. Skip the rest.</PageTitle>

      <section className="mb-10" aria-label="Your past seven days">
        <h2 className="mb-3 text-2xl">Your past seven days</h2>
        {hasActivity ? (
          <>
            <dl className="grid grid-cols-3 gap-3">
              <Stat n={sessionsDone.length} label="Sessions completed" />
              <Stat n={tried.length} label="Practices tried" />
              <Stat n={evidenceWeek.length} label="Evidence saved" />
            </dl>
            {themes.length > 0 && <p className="mt-4 text-muted-foreground">Themes explored: {themes.join(", ")}</p>}
          </>
        ) : (
          <p className="rounded-xl bg-surface p-5">There isn't much activity here yet, and that's fine. A reflection can still help you notice what's on your mind.</p>
        )}
      </section>

      <section aria-label="Weekly reflection">
        {saved && <p className="mb-4 rounded-xl bg-surface p-4" role="status">Your reflection is saved below.</p>}
        <div className="flex flex-col gap-5">
          {prompts.map((p) => (
            <label key={p.id} className="block">
              <span className="mb-2 block font-serif text-xl">{p.q}</span>
              <textarea className="field min-h-24" value={answers[p.id] ?? ""} onChange={(e) => { setSaved(false); setAnswers({ ...answers, [p.id]: e.target.value }); }} />
            </label>
          ))}
        </div>
        <button className="btn btn-primary mt-6" disabled={!Object.values(answers).some((v) => v.trim())} onClick={submit}>Save reflection</button>
      </section>

      {state.reflections.length > 0 && (() => {
        const q = query.trim().toLowerCase();
        const list = state.reflections.filter((r) =>
          (!filter || r.answers[filter]) && (!q || Object.values(r.answers).some((v) => v.toLowerCase().includes(q))));
        const counts = prompts.map((p) => ({ ...p, n: state.reflections.filter((r) => r.answers[p.id]).length }));
        const maxN = Math.max(1, ...counts.map((c) => c.n));
        return (
          <section className="mt-12" aria-label="Saved reflections">
            <h2 className="mb-1 flex items-center gap-2 text-2xl"><NotebookPen className="h-6 w-6 text-primary" aria-hidden /> Your saved reflections</h2>
            <p className="mb-5 text-muted-foreground">{state.reflections.length} saved. Tap a theme to see only those answers.</p>
            <div className="mb-6 rounded-2xl bg-panel-mint p-5">
              <p className="mb-3 text-sm font-semibold">What you reflect on most</p>
              <ul className="flex flex-col gap-2">
                {counts.map((c) => (
                  <li key={c.id}>
                    <button className="w-full text-left" aria-pressed={filter === c.id} onClick={() => setFilter(filter === c.id ? null : c.id)}>
                      <span className={`block text-sm ${filter === c.id ? "font-bold text-primary" : ""}`}>{c.q}</span>
                      <span className="mt-1 flex items-center gap-2">
                        <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-card"><span className="block h-full rounded-full bg-primary" style={{ width: `${(c.n / maxN) * 100}%` }} /></span>
                        <span className="w-6 text-right text-xs text-muted-foreground">{c.n}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <label className="relative mb-4 block">
              <span className="sr-only">Search reflections</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hint" aria-hidden />
              <input className="field !pl-9" placeholder="Search your reflections" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            {list.length === 0 && <p className="text-muted-foreground">No reflections match.</p>}
            <ul className="flex flex-col gap-3">
              {list.map((r) => (
                <li key={r.id} className="card-quiet p-5">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-primary"><CalendarDays className="h-4 w-4" aria-hidden />{new Date(r.date + "T00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
                    <button className="text-sm text-muted-foreground underline hover:text-destructive" onClick={() => confirm("Delete this reflection?") && update((s) => ({ ...s, reflections: s.reflections.filter((x) => x.id !== r.id) }))}>Delete</button>
                  </div>
                  {prompts.filter((p) => r.answers[p.id] && (!filter || filter === p.id)).map((p) => (
                    <div key={p.id} className="mt-3 border-l-4 border-mint-dim pl-3">
                      <p className="font-semibold">{p.q}</p>
                      <p className="whitespace-pre-wrap text-muted-foreground">{r.answers[p.id]}</p>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </section>
        );
      })()}
    </AppShell>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    // Label first for screen readers; flex-col-reverse keeps the number on top visually.
    <div className="card-quiet flex flex-col-reverse p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-serif text-3xl text-primary">{n}</dd>
    </div>
  );
}
