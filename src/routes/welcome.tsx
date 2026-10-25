import heroImg from "@/assets/welcome-hero.jpg";
import { Logo } from "@/components/Logo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { modules, moduleById, type ModuleId } from "@/content/curriculum";
import {
  changeOptions, wantOptions, momentOptions, responseOptions, strengthStarters,
  recommendFocus, explainFocus, nextSession,
} from "@/lib/recommend";
import { AccountForm } from "@/components/AccountForm";
import { useApp, localDate, type Profile, type Rhythm } from "@/lib/store";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Own Your Presence | A career learning program for women" },
      { name: "description", content: "A self-paced career learning program for women: 21 short sessions on recognizing your strengths, speaking up, and asking for what you want." },
      { property: "og:title", content: "Own Your Presence | A career learning program for women" },
      { property: "og:description", content: "A self-paced career learning program for women: 21 short sessions on recognizing your strengths, speaking up, and asking for what you want." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

const TOTAL = 7;
// Screens after the numbered questions.
const ACCOUNT = 8;
const SUMMARY = 9;

function Welcome() {
  const { state, hydrated, update, account } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(state.profile);

  // On a fresh page load the saved profile arrives after the first render, so
  // copy it in before the questions start. Otherwise finishing would erase it.
  useEffect(() => {
    if (hydrated && step === 0) setP(state.profile);
  }, [hydrated, state.profile, step]);
  const [strength, setStrength] = useState("");
  const [strengthStarter, setStrengthStarter] = useState("");
  const [focusTouched, setFocusTouched] = useState(false);

  const sel = { wants: p.wants, moments: p.moments, responses: p.responses };
  const recommended = recommendFocus(sel);

  const toggle = (key: "changes" | "wants" | "moments" | "responses", id: string, max?: number) =>
    setP((prev) => {
      const list = prev[key];
      if (list.includes(id)) return { ...prev, [key]: list.filter((x) => x !== id) };
      if (max && list.length >= max) return prev;
      return { ...prev, [key]: [...list, id] };
    });

  const go = (n: number) => {
    if (n === 6 && !focusTouched) setP((prev) => ({ ...prev, focus: recommended }));
    setStep(n);
    window.scrollTo(0, 0);
  };

  const finish = () => {
    const profile = { ...p, primaryChange: p.changes.length === 1 ? (p.changes[0] ?? "") : p.primaryChange };
    const text = [strengthStarter, strength.trim()].filter(Boolean).join(": ");
    update((s) => ({
      ...s,
      onboarded: true,
      profile,
      evidence: text && !s.evidence.some((e) => e.id === "onboarding-strength")
        ? [{ id: "onboarding-strength", title: "A time I felt capable", content: text, category: "strengths", date: localDate(), favorite: false }, ...s.evidence]
        : s.evidence,
    }));
    // Offer an account right after the questions, unless they're already signed in.
    go(account ? SUMMARY : ACCOUNT);
  };

  const explore = () => {
    update((s) => ({ ...s, explored: true }));
    navigate({ to: "/" });
  };

  if (step === 0) {
    return (
      <Frame>
        <div className="welcome-intro flex flex-col animate-rise">
          <img src={heroImg} alt="Illustration of a calm, confident woman among leaves" width={1024} height={768} className="welcome-image mb-7 w-full object-cover" />
          <h1 className="welcome-brand mb-4 flex items-center gap-3 text-primary"><Logo className="h-10 w-10 shrink-0" /> Own Your Presence</h1>
          <p className="mb-3 inline-flex w-fit rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-primary">
            A career learning program for women
          </p>
          <h2 className="mt-2 text-2xl leading-snug text-primary md:text-3xl">You don't have to become someone else to be taken seriously.</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Whether you're returning to work, changing fields, or stepping into leadership, Own Your Presence helps you
            recognize your strengths, talk about your work with confidence, and ask for what you want.
          </p>
          <ul className="welcome-details mt-5 flex flex-wrap gap-3 text-sm text-primary" aria-label="How the program works">
            {["21 short sessions", "2–5 minutes a day", "At your own pace"].map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />{t}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-primary" onClick={() => go(1)}>Find my starting point</button>
            <button className="btn btn-ghost" onClick={explore}>Explore first</button>
          </div>
        </div>
      </Frame>
    );
  }

  if (step === ACCOUNT) {
    return (
      <Frame>
        <div className="animate-rise">
          <p className="eyebrow mb-3">One last thing{p.name ? `, ${p.name}` : ""}</p>
          <h1 className="text-4xl leading-tight text-primary md:text-5xl">Save your progress</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Create a free account so your answers, evidence, and reflections are kept safe and follow you to any device.
          </p>
          <div className="mt-8 border-t pt-6">
            <AccountForm initialMode="create" onDone={() => go(SUMMARY)} />
          </div>
          <button className="btn btn-ghost mt-4 -ml-3" onClick={() => go(SUMMARY)}>Not now</button>
          <p className="mt-1 text-sm text-muted-foreground">
            Without an account, everything stays only in this browser. You can create one later in Profile &amp; settings.
          </p>
        </div>
      </Frame>
    );
  }

  if (step === SUMMARY) {
    const session = nextSession(p.focus, []);
    const text = [strengthStarter, strength.trim()].filter(Boolean).join(": ");
    return (
      <Frame>
        <div className="animate-rise">
          <p className="eyebrow mb-3">{p.name ? `For you, ${p.name}` : "Your starting point"}</p>
          <h1 className="text-4xl text-primary md:text-5xl">Here's where we'll begin.</h1>
          <div className="mt-8 border-l-4 border-gold bg-surface p-6">
            <p className="text-sm text-muted-foreground">Your focus</p>
            <p className="font-serif text-2xl text-primary">{moduleById(p.focus).title}</p>
            <p className="mt-3">{explainFocus(p.focus, sel)}</p>
          </div>
          <div className="mt-4 border-b py-6">
            <p className="text-sm text-muted-foreground">Your first session</p>
            <p className="font-serif text-xl">{session.title}</p>
          </div>
          {text && (
            <div className="mt-4 rounded-xl bg-surface p-6">
              <p className="text-sm text-muted-foreground">Saved to My Evidence</p>
              <p className="mt-1 whitespace-pre-wrap">{text}</p>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-primary" onClick={() => navigate({ to: "/session/$id", params: { id: session.id } })}>Start my first session</button>
            <button className="btn btn-secondary" onClick={() => go(6)}>Change my starting point</button>
          </div>
        </div>
      </Frame>
    );
  }

  const steps: Record<number, { q: string; body: ReactNode; note?: string }> = {
    1: {
      q: "What kind of change are you navigating?",
      note: "Choose any that apply.",
      body: (
        <>
          <Choices options={changeOptions} selected={p.changes} onToggle={(id) => toggle("changes", id)} />
          {p.changes.length > 1 && (
            <fieldset className="mt-6">
              <legend className="mb-2 font-semibold">Which is your main focus right now?</legend>
              <div className="flex flex-wrap gap-2">
                {p.changes.map((id) => (
                  <button key={id} type="button" aria-pressed={p.primaryChange === id} className="chip !w-auto"
                    onClick={() => setP({ ...p, primaryChange: id })}>
                    {changeOptions.find((o) => o.id === id)?.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <label className="mt-6 block">
            <span className="mb-2 block font-semibold">What role, field, or opportunity is on your mind? <span className="font-normal text-muted-foreground">(optional)</span></span>
            <input className="field" value={p.context} onChange={(e) => setP({ ...p, context: e.target.value })} placeholder="For example, project management in healthcare" />
          </label>
        </>
      ),
    },
    2: { q: "What brought you here?", note: "Choose up to two.", body: <Choices options={wantOptions} selected={p.wants} onToggle={(id) => toggle("wants", id, 2)} max={2} /> },
    3: { q: "When do you find yourself holding back?", note: "Choose up to two.", body: <Choices options={momentOptions} selected={p.moments} onToggle={(id) => toggle("moments", id, 2)} max={2} /> },
    4: {
      q: "What do you tend to do in those moments?",
      note: "These are habits you can explore, not labels that define you. Choose up to two.",
      body: <Choices options={responseOptions} selected={p.responses} onToggle={(id) => toggle("responses", id, 2)} max={2} />,
    },
    5: {
      q: "Think of a time you felt capable and comfortable being yourself. What were you doing?",
      note: "What did you contribute? How did you connect with others? What felt natural? You can skip this.",
      body: (
        <>
          <p className="mb-2 font-semibold">A starting point, if it helps</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {strengthStarters.map((s) => (
              <button key={s} type="button" aria-pressed={strengthStarter === s} className="chip !w-auto"
                onClick={() => setStrengthStarter(strengthStarter === s ? "" : s)}>{s}</button>
            ))}
          </div>
          <label>
            <span className="sr-only">Your reflection</span>
            <textarea className="field min-h-36" value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="I was…" />
          </label>
          <p className="mt-2 text-sm text-muted-foreground">If you write something, it will be saved to My Evidence. You can edit or delete it anytime.</p>
        </>
      ),
    },
    6: {
      q: "What would you like to practice first?",
      note: "We've suggested one based on your answers. Choose whatever feels right.",
      body: (
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="First focus">
          {modules.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={p.focus === m.id} className="chip"
              onClick={() => { setFocusTouched(true); setP({ ...p, focus: m.id as ModuleId }); }}>
              <span className="flex-1">{m.practiceLabel}</span>
              {m.id === recommended && <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-gold-foreground">Suggested</span>}
            </button>
          ))}
        </div>
      ),
    },
    7: {
      q: "How much space would you like to give this?",
      body: (
        <>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Session length">
            {([["quick", "A quick moment: about 2 minutes"], ["deep", "A little deeper: about 5 minutes"], ["depends", "It depends on the day"]] as [Rhythm, string][]).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={p.rhythm === id} className="chip" onClick={() => setP({ ...p, rhythm: id })}>{label}</button>
            ))}
          </div>
          <label className="mt-6 block">
            <span className="mb-2 block font-semibold">What would you like us to call you? <span className="font-normal text-muted-foreground">(optional)</span></span>
            <input className="field" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} autoComplete="given-name" />
          </label>
        </>
      ),
    },
  };

  const cur = steps[step]!;
  return (
    <Frame>
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <button className="btn btn-ghost -ml-3 !min-h-10 !px-3" onClick={() => go(step - 1)}><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
          <span aria-live="polite">Step {step} of {TOTAL}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={step} aria-label="Onboarding progress">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
      </div>
      <div key={step} className="animate-rise">
        <h1 className="text-3xl leading-snug text-primary md:text-4xl">{cur.q}</h1>
        {cur.note && <p className="mt-3 text-muted-foreground">{cur.note}</p>}
        <div className="mt-8">{cur.body}</div>
      </div>
      <div className="mt-10 flex gap-3">
        <button className="btn btn-primary" onClick={() => (step === TOTAL ? finish() : go(step + 1))}>
          {step === TOTAL ? "See my starting point" : "Continue"}
        </button>
        {(step === 1 || step === 5) && <button className="btn btn-ghost" onClick={() => { if (step === 5) { setStrength(""); setStrengthStarter(""); } go(step + 1); }}>Skip</button>}
      </div>
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return <main className="welcome-frame mx-auto min-h-screen max-w-2xl px-5 py-6 md:px-10 md:py-10">{children}</main>;
}

function Choices({ options, selected, onToggle, max }: { options: { id: string; label: string }[]; selected: string[]; onToggle: (id: string) => void; max?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const on = selected.includes(o.id);
        const disabled = !on && !!max && selected.length >= max;
        return (
          <button key={o.id} type="button" aria-pressed={on} disabled={disabled} className="chip disabled:opacity-50" onClick={() => onToggle(o.id)}>
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-foreground" : "border-input"}`} aria-hidden>
              {on && <Check className="h-3.5 w-3.5" />}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}


