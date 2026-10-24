import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageTitle, Loading } from "@/components/AppShell";
import { modules, type ModuleId } from "@/content/curriculum";
import { changeOptions } from "@/lib/recommend";
import { useApp, type Rhythm, type SyncStatus } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & settings — Own Your Presence" },
      { name: "description", content: "Manage your name, focus, session length, and personal data." },
      { property: "og:title", content: "Profile & settings — Own Your Presence" },
      { property: "og:description", content: "Manage your name, focus, session length, and personal data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, hydrated, update, reset, account } = useApp();
  const [confirming, setConfirming] = useState(false);
  const [msg, setMsg] = useState("");
  if (!hydrated) return <Loading />;
  const p = state.profile;
  const setP = (patch: Partial<typeof p>) => update((s) => ({ ...s, profile: { ...s.profile, ...patch } }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "own-your-presence-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <AppShell>
      <PageTitle title="Profile & settings" />

      <Group title="About you">
        <label className="block">
          <span className="mb-1.5 block font-semibold">Name</span>
          <input className="field" value={p.name} onChange={(e) => setP({ name: e.target.value })} />
        </label>
        <fieldset className="mt-5">
          <legend className="mb-2 font-semibold">The change you're navigating</legend>
          <div className="flex flex-wrap gap-2">
            {changeOptions.map((o) => (
              <button key={o.id} aria-pressed={p.changes.includes(o.id)} className="chip !w-auto !min-h-10 text-sm"
                onClick={() => setP({ changes: p.changes.includes(o.id) ? p.changes.filter((x) => x !== o.id) : [...p.changes, o.id] })}>{o.label}</button>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block">
          <span className="mb-1.5 block font-semibold">Role, field, or opportunity on your mind</span>
          <input className="field" value={p.context} onChange={(e) => setP({ context: e.target.value })} />
        </label>
      </Group>

      <Group title="Practice">
        <label className="block">
          <span className="mb-1.5 block font-semibold">Focus</span>
          <select className="field" value={p.focus} onChange={(e) => setP({ focus: e.target.value as ModuleId })}>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block font-semibold">Preferred session length</span>
          <select className="field" value={p.rhythm} onChange={(e) => setP({ rhythm: e.target.value as Rhythm })}>
            <option value="quick">A quick moment: about 2 minutes</option>
            <option value="deep">A little deeper: about 5 minutes</option>
            <option value="depends">It depends on the day</option>
          </select>
        </label>
        <Link to="/welcome" className="btn btn-ghost -ml-3 mt-3">Retake the starting questions</Link>
      </Group>

      <Group title="Reminders">
        <p className="text-muted-foreground">Reminders aren't available in this version. Nothing is scheduled, and you won't receive notifications.</p>
      </Group>

      <Group title="Accessibility">
        <label className="flex min-h-11 items-center gap-3">
          <input type="checkbox" className="h-5 w-5 accent-primary" checked={state.reducedMotion} onChange={(e) => update((s) => ({ ...s, reducedMotion: e.target.checked }))} />
          Reduce motion
        </label>
        <p className="mt-1 text-sm text-muted-foreground">Motion is also reduced automatically if your device asks for it.</p>
      </Group>

      <AccountGroup />

      <Group title="Your data">
        {account ? (
          <p>Your entries are saved to your account as <strong>{account}</strong> and kept in this browser for quick access. Signing out removes them from this browser.</p>
        ) : (
          <p>Everything you enter is saved only in this browser on this device. Other people using the same browser profile may be able to see it, and clearing your browser data will erase it. Sign in above to keep a copy in your account.</p>
        )}
        <p className="mt-2 text-muted-foreground">You can delete individual entries from My Evidence and Reflect.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn btn-secondary" onClick={exportData}>Export my data (JSON)</button>
          {!confirming && <button className="btn btn-ghost text-destructive" onClick={() => setConfirming(true)}>Reset all personal data</button>}
        </div>
        {confirming && (
          <div className="mt-4 rounded-xl border border-destructive/40 p-4" role="alertdialog" aria-label="Confirm reset">
            <p>This permanently erases your answers, evidence, reflections, and progress from this browser{account ? " and from your account" : ""}. Consider exporting first.</p>
            <div className="mt-3 flex gap-3">
              <button className="btn bg-destructive text-destructive-foreground" onClick={async () => { await reset(); setConfirming(false); setMsg("Your data has been reset."); }}>Yes, erase everything</button>
              <button className="btn btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
            </div>
          </div>
        )}
        {msg && <p className="mt-3" role="status">{msg} <Link to="/welcome" className="font-semibold text-primary underline">Start again</Link></p>}
      </Group>
    </AppShell>
  );
}

const syncLabels: Record<SyncStatus, string> = {
  local: "",
  loading: "Loading your saved entries…",
  saving: "Saving…",
  saved: "All changes saved to your account.",
  error: "Couldn't reach your account. Your changes are still saved in this browser.",
};

function AccountGroup() {
  const { account, sync, signIn, signOut } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (account) {
    return (
      <Group title="Account">
        <p>Signed in as <strong>{account}</strong>.</p>
        <p className={`mt-1 text-sm ${sync === "error" ? "text-destructive" : "text-muted-foreground"}`} role="status">{syncLabels[sync]}</p>
        <button className="btn btn-secondary mt-4" onClick={() => signOut()}>Sign out</button>
      </Group>
    );
  }

  const submit = async (e: import("react").FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    setBusy(true); setError("");
    const err = await signIn(email.trim());
    setBusy(false);
    if (err) setError(err); else setSent(true);
  };

  return (
    <Group title="Account">
      {sent ? (
        <p role="status">Check <strong>{email.trim()}</strong> for a sign-in link. Open it on this device to finish signing in. <button className="font-semibold text-primary underline" onClick={() => setSent(false)}>Use a different email</button></p>
      ) : (
        <form onSubmit={submit} noValidate>
          <p className="mb-4 text-muted-foreground">Optional. Sign in to keep your entries safe in your account and use them on other devices. We'll email you a link, so there's no password to remember.</p>
          <label className="block">
            <span className="mb-1.5 block font-semibold">Email</span>
            <input className="field" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
          </label>
          {error && <p className="mt-2 text-destructive" role="alert">{error}</p>}
          <button className="btn btn-primary mt-4" type="submit" disabled={busy}>{busy ? "Sending…" : "Email me a sign-in link"}</button>
        </form>
      )}
    </Group>
  );
}

function Group({ title, children }: { title: string; children: import("react").ReactNode }) {
  return (
    <section className="mb-10 border-b pb-10 last:border-0">
      <h2 className="mb-4 text-2xl">{title}</h2>
      {children}
    </section>
  );
}
