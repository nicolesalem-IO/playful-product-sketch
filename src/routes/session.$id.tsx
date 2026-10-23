import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { sessionById, moduleById, type Session } from "@/content/curriculum";
import { AppShell, Loading } from "@/components/AppShell";
import { useApp, localDate, uid, categoryLabels, type Checkin, type EvidenceCategory, type SessionDraft } from "@/lib/store";

export const Route = createFileRoute("/session/$id")({
  loader: ({ params }) => {
    const s = sessionById(params.id);
    if (!s) throw notFound();
    return { title: s.title };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} — Own Your Presence` : "Session — Own Your Presence";
    return {
      meta: [
        { title: t },
        { name: "description", content: "A short coaching session: one idea, one reflection, one small practice." },
        { property: "og:title", content: t },
        { property: "og:description", content: "A short coaching session: one idea, one reflection, one small practice." },
      ],
    };
  },
  component: SessionPage,
});

const FULL = ["idea", "example", "reflect", "deeper", "try", "checkin", "save", "done"];
const QUICK = ["idea", "reflect", "try", "checkin", "save", "done"];

const saveTypes: { id: string; label: string; category: EvidenceCategory }[] = [
  { id: "reflection", label: "My reflection", category: "learning" },
  { id: "sentence", label: "A sentence I want to practice", category: "words" },
  { id: "accomplishment", label: "An accomplishment", category: "contributions" },
  { id: "commitment", label: "A commitment (something I intend to try)", category: "learning" },
  { id: "insight", label: "A personal insight", category: "learning" },
];

const checkinLabels: [Checkin, string][] = [
  ["comfortable", "Comfortable"], ["unfamiliar", "Unfamiliar, but useful"],
  ["uncomfortable", "Uncomfortable"], ["notright", "Not right for my situation"],
];

function SessionPage() {
  const { id } = Route.useParams();
  const { state, hydrated } = useApp();
  const session = sessionById(id)!;
  if (!hydrated) return <Loading />;
  return <AppShell><Flow key={id} session={session} rhythm={state.profile.rhythm} /></AppShell>;
}

function Flow({ session, rhythm }: { session: Session; rhythm: string }) {
  const { state, update } = useApp();
  const navigate = useNavigate();
  const mod = moduleById(session.moduleId);
  const saved = state.progress[session.id]?.draft;
  const [d, setD] = useState<SessionDraft>(
    saved ?? { step: "idea", mode: rhythm === "quick" ? "quick" : "full", reflection: "", followUp: "", actionChoice: "primary" },
  );
  const [deeper, setDeeper] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Persist the draft so a partially completed session can be restored.
  useEffect(() => {
    if (d.step === "done") return;
    update((s) => ({ ...s, progress: { ...s.progress, [session.id]: { ...s.progress[session.id], draft: d } } }));
  }, [d, session.id, update]);

  const steps = d.mode === "quick" ? QUICK : FULL;
  const idx = Math.max(0, steps.indexOf(d.step));
  const set = (patch: Partial<SessionDraft>) => setD((prev) => ({ ...prev, ...patch }));
  const goto = (step: string) => { set({ step }); setTimeout(() => headingRef.current?.focus(), 0); };
  const next = () => goto(steps[idx + 1] ?? "done");
  const back = () => (idx === 0 ? navigate({ to: "/" }) : goto(steps[idx - 1] ?? "idea"));

  const actionText = { primary: session.action, smaller: session.smaller, alternative: session.alternative }[d.actionChoice];
  const planned = state.actions.find((a) => a.sessionId === session.id && a.status === "planned");

  const commit = () => {
    update((s) => ({
      ...s,
      actions: [
        ...s.actions.filter((a) => !(a.sessionId === session.id && a.status === "planned")),
        { id: uid(), sessionId: session.id, text: actionText, status: "planned", note: "", createdDate: localDate() },
      ],
    }));
    next();
  };

  const complete = () => {
    update((s) => ({
      ...s,
      progress: { ...s.progress, [session.id]: { completedAt: new Date().toISOString() } },
      todayDone: { date: localDate(), sessionId: session.id },
    }));
    setD((prev) => ({ ...prev, step: "done" }));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <button className="btn btn-ghost -ml-3 !min-h-10 !px-3" onClick={back}><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
        {d.step !== "done" && (
          <div className="flex rounded-full border bg-card p-1 text-sm" role="group" aria-label="Session length">
            {(["quick", "full"] as const).map((m) => (
              <button key={m} aria-pressed={d.mode === m}
                className={`rounded-full px-3 py-1.5 ${d.mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => set({ mode: m, step: (m === "quick" ? QUICK : FULL).includes(d.step) ? d.step : "reflect" })}>
                {m === "quick" ? "Quick · 2 min" : "Full · 5 min"}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="eyebrow">{mod.title} · Session {session.n}</p>
      <p className="mt-1 font-serif text-xl text-muted-foreground">{session.title}</p>
      {d.step !== "done" && (
        <div className="mt-4 flex gap-1.5" aria-label={`Step ${idx + 1} of ${steps.length - 1}`} role="progressbar" aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={steps.length - 1}>
          {steps.slice(0, -1).map((s, i) => <span key={s} className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-primary" : "bg-surface"}`} />)}
        </div>
      )}

      <section key={d.step} className="mt-8 animate-rise" aria-live="polite">
        {d.step === "idea" && (
          <Step title="Today's idea" h={headingRef}>
            <p className="text-lg leading-relaxed">{d.mode === "quick" && !deeper ? session.quick : session.lesson}</p>
            {d.mode === "quick" && (
              <button className="btn btn-ghost mt-3 -ml-3" aria-expanded={deeper} onClick={() => setDeeper(!deeper)}>
                {deeper ? "Show the short version" : "Go deeper"}
              </button>
            )}
            <Nav onNext={next} />
          </Step>
        )}

        {d.step === "example" && (
          <Step title="What this can sound like" h={headingRef}>
            <div className="rounded-xl border bg-muted p-5">
              <p className="text-sm font-semibold text-muted-foreground">A familiar response</p>
              <p className="mt-2 text-lg">{session.familiar}</p>
            </div>
            <div className="mt-3 rounded-xl border border-primary/30 bg-surface p-5">
              <p className="text-sm font-semibold text-primary">Another way to say it</p>
              <p className="mt-2 text-lg">{session.another}</p>
            </div>
            <Nav onNext={next} />
          </Step>
        )}

        {d.step === "reflect" && (
          <Step title="Your turn" h={headingRef}>
            <label htmlFor="reflection" className="block text-lg">{session.reflection}</label>
            <textarea id="reflection" className="field mt-4 min-h-36" placeholder={session.starter}
              value={d.reflection} onChange={(e) => set({ reflection: e.target.value })} />
            <p className="mt-2 text-sm text-muted-foreground">Starter: “{session.starter}” Your words stay in this draft unless you choose to save them.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={next}>Continue</button>
              {!d.reflection && <button className="btn btn-ghost" onClick={next}>I'll think about it privately</button>}
            </div>
          </Step>
        )}

        {d.step === "deeper" && (
          <Step title="A little deeper" h={headingRef}>
            <label htmlFor="followup" className="block text-lg">{session.followUp}</label>
            <textarea id="followup" className="field mt-4 min-h-28" value={d.followUp} onChange={(e) => set({ followUp: e.target.value })} />
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={next}>Continue</button>
              <button className="btn btn-ghost" onClick={next}>Skip this</button>
            </div>
          </Step>
        )}

        {d.step === "try" && (
          <Step title="Try this" h={headingRef}>
            <div className="card-quiet p-6">
              {d.actionChoice !== "primary" && <p className="mb-2 text-sm text-muted-foreground">{d.actionChoice === "smaller" ? "A smaller version" : "Another option"}</p>}
              <p className="text-lg">{actionText}</p>
            </div>
            {planned && <p className="mt-3 text-sm text-muted-foreground">You already planned: “{planned.text}”. Choosing again will replace it.</p>}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button className="btn btn-primary" onClick={commit}>I'll try this</button>
              {d.actionChoice !== "smaller" && <button className="btn btn-secondary" onClick={() => set({ actionChoice: "smaller" })}>Make it smaller</button>}
              <button className="btn btn-secondary" onClick={() => set({ actionChoice: d.actionChoice === "alternative" ? "primary" : "alternative" })}>Choose another action</button>
              <button className="btn btn-ghost" onClick={next}>Not right now</button>
            </div>
          </Step>
        )}

        {d.step === "checkin" && (
          <Step title="How does this practice feel right now?" h={headingRef}>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="How this practice feels">
              {checkinLabels.map(([cid, label]) => (
                <button key={cid} role="radio" aria-checked={d.checkin === cid} className="chip" onClick={() => set({ checkin: cid })}>{label}</button>
              ))}
            </div>
            {d.checkin && (
              <div className="mt-5 rounded-xl bg-surface p-5 animate-rise" role="status">
                <p>{session.checkin[d.checkin]}</p>
                {d.checkin === "notright" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="btn btn-secondary" onClick={() => { set({ actionChoice: "alternative" }); goto("try"); }}>Try another action</button>
                    <Link to="/path" className="btn btn-secondary">Choose a different session</Link>
                  </div>
                )}
              </div>
            )}
            <Nav onNext={next} label={d.checkin ? "Continue" : "Skip"} />
          </Step>
        )}

        {d.step === "save" && <SaveStep session={session} draft={d} actionText={actionText} h={headingRef} onDone={complete} />}

        {d.step === "done" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground"><Check className="h-8 w-8" aria-hidden /></div>
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl text-primary md:text-4xl">{session.completion}</h2>
            <p className="mt-3 text-muted-foreground" role="status">Session complete.{planned ? " Your practice is saved as planned—you can check in on it later." : ""}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/" className="btn btn-primary">Back to Today</Link>
              <Link to="/path" className="btn btn-secondary">See your path</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SaveStep({ session, draft, actionText, h, onDone }: { session: Session; draft: SessionDraft; actionText: string; h: import("react").RefObject<HTMLHeadingElement | null>; onDone: () => void }) {
  const { update } = useApp();
  const [type, setType] = useState(draft.reflection ? "reflection" : "commitment");
  const initial = (t: string) =>
    t === "commitment" ? `I intend to: ${actionText}` : [draft.reflection, draft.followUp].filter(Boolean).join("\n\n");
  const [title, setTitle] = useState(session.title);
  const [content, setContent] = useState(initial(type));
  const [error, setError] = useState("");

  const save = () => {
    if (!content.trim()) { setError("Add a few words before saving, or choose “Not this time.”"); return; }
    const t = saveTypes.find((x) => x.id === type)!;
    update((s) => ({
      ...s,
      evidence: [{ id: uid(), title: title.trim() || session.title, content: content.trim(), category: t.category, date: localDate(), sessionId: session.id, favorite: false }, ...s.evidence],
    }));
    onDone();
  };

  return (
    <Step title={session.savePrompt} h={h}>
      <fieldset>
        <legend className="mb-2 font-semibold">What would you like to keep?</legend>
        <div className="flex flex-col gap-2" role="radiogroup">
          {saveTypes.map((t) => (
            <button key={t.id} role="radio" aria-checked={type === t.id} className="chip"
              onClick={() => { setType(t.id); setContent(initial(t.id) || content); }}>
              <span className="flex-1">{t.label}</span>
              <span className="text-sm text-muted-foreground">{categoryLabels[t.category]}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-6 block">
        <span className="mb-2 block font-semibold">Title</span>
        <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block font-semibold">Your words</span>
        <textarea className="field min-h-32" value={content} onChange={(e) => { setContent(e.target.value); setError(""); }} />
      </label>
      {error && <p className="mt-2 text-destructive" role="alert">{error}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="btn btn-primary" onClick={save}>Save to My Evidence</button>
        <button className="btn btn-ghost" onClick={onDone}>Not this time</button>
      </div>
    </Step>
  );
}

function Step({ title, children, h }: { title: string; children: import("react").ReactNode; h: import("react").RefObject<HTMLHeadingElement | null> }) {
  return (
    <div>
      <h2 ref={h} tabIndex={-1} className="mb-6 text-3xl text-primary md:text-4xl">{title}</h2>
      {children}
    </div>
  );
}

function Nav({ onNext, label = "Continue" }: { onNext: () => void; label?: string }) {
  return <div className="mt-8"><button className="btn btn-primary" onClick={onNext}>{label}</button></div>;
}
