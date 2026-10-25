import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { AppShell, PageTitle, Loading } from "@/components/AppShell";
import { modules, sessionsInModule, moduleById, type ModuleId } from "@/content/curriculum";
import { nextSession } from "@/lib/recommend";
import { useApp, completedIds } from "@/lib/store";

export const Route = createFileRoute("/path")({
  head: () => ({
    meta: [
      { title: "Your Path | Own Your Presence" },
      { name: "description", content: "Seven modules, twenty-one sessions. Follow the suggested path or choose what you need today." },
      { property: "og:title", content: "Your Path | Own Your Presence" },
      { property: "og:description", content: "Seven modules, twenty-one sessions. Follow the suggested path or choose what you need today." },
    ],
  }),
  component: PathPage,
});

function PathPage() {
  const { state, hydrated, update } = useApp();
  if (!hydrated) return <Loading />;
  const done = completedIds(state);
  const suggested = nextSession(state.profile.focus, done);
  const setFocus = (id: ModuleId) => update((s) => ({ ...s, profile: { ...s.profile, focus: id } }));

  return (
    <AppShell>
      <PageTitle eyebrow={`${done.length} of 21 sessions explored`} title="Your Path">
        Every module is open. Your focus is <strong className="text-primary">{moduleById(state.profile.focus).title}</strong>.
      </PageTitle>

      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <Link to="/session/$id" params={{ id: suggested.id }} className="card-quiet block p-5 hover:border-primary">
          <span className="eyebrow">Follow my suggested path</span>
          <span className="mt-2 flex items-center justify-between font-serif text-xl">{suggested.title} <ArrowRight className="h-5 w-5 text-primary" aria-hidden /></span>
        </Link>
        <a href="#modules" className="card-quiet block p-5 hover:border-primary">
          <span className="eyebrow">Choose what I need today</span>
          <span className="mt-2 block font-serif text-xl">Browse all modules</span>
        </a>
      </div>

      <div id="modules" className="flex flex-col gap-5">
        {modules.map((m) => {
          const isFocus = state.profile.focus === m.id;
          return (
            <section key={m.id} className={`card-quiet p-5 md:p-6 ${isFocus ? "border-primary" : ""}`} aria-labelledby={`mod-${m.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Module {m.n}</p>
                  <h2 id={`mod-${m.id}`} className="text-2xl text-primary">{m.title}</h2>
                  <p className="mt-1 text-muted-foreground">{m.description}</p>
                </div>
                {isFocus ? (
                  <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-primary">Your focus</span>
                ) : (
                  <button className="btn btn-ghost !min-h-9 shrink-0 !px-3 text-sm" onClick={() => setFocus(m.id)}>Make this my focus</button>
                )}
              </div>
              <ol className="mt-4 flex flex-col gap-1">
                {sessionsInModule(m.id).map((s) => {
                  const complete = done.includes(s.id);
                  return (
                    <li key={s.id}>
                      <Link to="/session/$id" params={{ id: s.id }} className="flex min-h-12 items-center gap-3 rounded-lg px-2 hover:bg-surface">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm ${complete ? "border-success bg-success text-success-foreground" : ""}`}>
                          {complete ? <Check className="h-4 w-4" aria-hidden /> : s.n}
                        </span>
                        <span className="flex-1">{s.title}</span>
                        {complete && <span className="sr-only">Completed</span>}
                        {s.id === suggested.id && <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">Suggested next</span>}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
