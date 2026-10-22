import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

      {state.reflections.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl">Earlier reflections</h2>
          <ul className="flex flex-col gap-3">
            {state.reflections.map((r) => (
              <li key={r.id} className="card-quiet p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{new Date(r.date + "T00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
                  <button className="text-sm text-muted-foreground underline hover:text-destructive" onClick={() => confirm("Delete this reflection?") && update((s) => ({ ...s, reflections: s.reflections.filter((x) => x.id !== r.id) }))}>Delete</button>
                </div>
                {prompts.filter((p) => r.answers[p.id]).map((p) => (
                  <div key={p.id} className="mt-3">
                    <p className="font-semibold">{p.q}</p>
                    <p className="whitespace-pre-wrap text-muted-foreground">{r.answers[p.id]}</p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="card-quiet p-4">
      <dd className="font-serif text-3xl text-primary">{n}</dd>
      <dt className="text-sm text-muted-foreground">{label}</dt>
    </div>
  );
}
