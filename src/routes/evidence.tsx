import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Star, Trash2, Plus, Search } from "lucide-react";
import { AppShell, PageTitle, Loading } from "@/components/AppShell";
import { sessionById } from "@/content/curriculum";
import { useApp, categoryLabels, localDate, uid, type Evidence, type EvidenceCategory } from "@/lib/store";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "My Evidence — Own Your Presence" },
      { name: "description", content: "A personal collection of strengths, contributions, and moments worth remembering." },
      { property: "og:title", content: "My Evidence — Own Your Presence" },
      { property: "og:description", content: "A personal collection of strengths, contributions, and moments worth remembering." },
    ],
  }),
  component: EvidencePage,
});

const cats = Object.keys(categoryLabels) as EvidenceCategory[];

function EvidencePage() {
  const { state, hydrated, update } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<EvidenceCategory | "all">("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  if (!hydrated) return <Loading />;

  const list = state.evidence.filter((e) =>
    (cat === "all" || e.category === cat) &&
    (!q || (e.title + " " + e.content).toLowerCase().includes(q.toLowerCase())));

  const save = (e: Evidence) => update((s) => ({
    ...s, evidence: s.evidence.some((x) => x.id === e.id) ? s.evidence.map((x) => (x.id === e.id ? e : x)) : [e, ...s.evidence],
  }));
  const remove = (id: string) => {
    if (confirm("Delete this entry? This can't be undone.")) update((s) => ({ ...s, evidence: s.evidence.filter((x) => x.id !== id) }));
  };

  return (
    <AppShell>
      <PageTitle eyebrow="Grounded in your own experience" title="My Evidence" />

      {adding ? (
        <EntryForm onCancel={() => setAdding(false)} onSave={(e) => { save(e); setAdding(false); }} />
      ) : (
        <button className="btn btn-primary mb-8" onClick={() => setAdding(true)}><Plus className="h-4 w-4" aria-hidden /> Add something worth remembering</button>
      )}

      {state.evidence.length === 0 ? (
        <p className="rounded-xl bg-surface p-6 text-lg">You don't need a dramatic achievement to begin. Save one moment that reminds you what you bring.</p>
      ) : (
        <>
          <label className="relative mb-4 block">
            <span className="sr-only">Search your evidence</span>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input className="field !pl-10" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(["all", ...cats] as const).map((c) => (
              <button key={c} aria-pressed={cat === c} className="chip !w-auto !min-h-10 !py-1.5 text-sm" onClick={() => setCat(c)}>
                {c === "all" ? "All" : categoryLabels[c]}
              </button>
            ))}
          </div>
          {list.length === 0 && <p className="text-muted-foreground">Nothing matches. Try a different search or category.</p>}
          <ul className="flex flex-col gap-3">
            {list.map((e) => (
              <li key={e.id}>
                {editing === e.id ? (
                  <EntryForm entry={e} onCancel={() => setEditing(null)} onSave={(x) => { save(x); setEditing(null); }} />
                ) : (
                  <article className="card-quiet p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">{categoryLabels[e.category]} · {new Date(e.date + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
                        <h2 className="mt-1 font-serif text-xl">{e.title}</h2>
                      </div>
                      <div className="flex shrink-0">
                        <IconBtn label={e.favorite ? "Remove from favorites" : "Add to favorites"} pressed={e.favorite} onClick={() => save({ ...e, favorite: !e.favorite })}>
                          <Star className={`h-4 w-4 ${e.favorite ? "fill-accent text-accent" : ""}`} />
                        </IconBtn>
                        <IconBtn label="Edit" onClick={() => setEditing(e.id)}><Pencil className="h-4 w-4" /></IconBtn>
                        <IconBtn label="Delete" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></IconBtn>
                      </div>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{e.content}</p>
                    {e.sessionId && <p className="mt-3 text-sm text-muted-foreground">From “{sessionById(e.sessionId)?.title}”</p>}
                  </article>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </AppShell>
  );
}

function IconBtn({ label, onClick, children, pressed }: { label: string; onClick: () => void; children: import("react").ReactNode; pressed?: boolean }) {
  return (
    <button aria-label={label} aria-pressed={pressed} title={label} onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-primary">{children}</button>
  );
}

function EntryForm({ entry, onSave, onCancel }: { entry?: Evidence; onSave: (e: Evidence) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [category, setCategory] = useState<EvidenceCategory>(entry?.category ?? "strengths");
  const [error, setError] = useState("");
  return (
    <form className="card-quiet mb-8 p-5" onSubmit={(ev) => {
      ev.preventDefault();
      if (!content.trim()) return setError("Write a few words about what you'd like to remember.");
      onSave({ id: entry?.id ?? uid(), date: entry?.date ?? localDate(), favorite: entry?.favorite ?? false, sessionId: entry?.sessionId,
        title: title.trim() || "Something worth remembering", content: content.trim(), category });
    }}>
      <label className="block">
        <span className="mb-1.5 block font-semibold">Title</span>
        <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="mt-4 block">
        <span className="mb-1.5 block font-semibold">What happened, or what you want to remember</span>
        <textarea className="field min-h-28" value={content} onChange={(e) => { setContent(e.target.value); setError(""); }} />
      </label>
      {error && <p className="mt-2 text-destructive" role="alert">{error}</p>}
      <label className="mt-4 block">
        <span className="mb-1.5 block font-semibold">Category</span>
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value as EvidenceCategory)}>
          {cats.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
        </select>
      </label>
      <div className="mt-5 flex gap-3">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
