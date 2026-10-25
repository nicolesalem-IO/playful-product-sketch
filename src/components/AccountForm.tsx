import { useId, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "@/lib/store";

type Mode = "create" | "signin" | "forgot";

const MIN_PASSWORD = 8;
const emailOk = (e: string) => /^\S+@\S+\.\S+$/.test(e.trim());

/**
 * Create an account, sign in, or ask for a password-reset email.
 * Used after onboarding and in Settings. Calls onDone once someone is signed in.
 */
export function AccountForm({ initialMode = "create", onDone }: { initialMode?: Mode; onDone?: () => void }) {
  const { signUp, signIn, sendPasswordReset } = useApp();
  const id = useId();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const switchTo = (m: Mode) => { setMode(m); setError(""); setNotice(""); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setNotice("");
    if (!emailOk(email)) return setError("Enter a valid email address.");
    if (mode !== "forgot" && password.length < (mode === "create" ? MIN_PASSWORD : 1)) {
      return setError(mode === "create" ? `Choose a password with at least ${MIN_PASSWORD} characters.` : "Enter your password.");
    }
    setBusy(true);
    const err =
      mode === "create" ? await signUp(email.trim(), password)
      : mode === "signin" ? await signIn(email.trim(), password)
      : await sendPasswordReset(email.trim());
    setBusy(false);
    if (err) return setError(err);
    if (mode === "forgot") {
      setNotice(`If there's an account for ${email.trim()}, we've sent a link to choose a new password.`);
      return;
    }
    setPassword("");
    onDone?.();
  };

  const label = { create: "Create account", signin: "Sign in", forgot: "Send reset link" }[mode];

  return (
    <form onSubmit={submit} noValidate>
      <label className="block">
        <span className="mb-1.5 block font-semibold">Email</span>
        <input className="field" type="email" autoComplete="email" inputMode="email" value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }} />
      </label>

      {mode !== "forgot" && (
        <div className="mt-4">
          <label htmlFor={`${id}-password`} className="mb-1.5 block font-semibold">Password</label>
          <div className="relative">
            <input id={`${id}-password`} className="field !pr-12" type={show ? "text" : "password"}
              autoComplete={mode === "create" ? "new-password" : "current-password"}
              aria-describedby={mode === "create" ? `${id}-hint` : undefined}
              value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-primary">
              {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          {mode === "create" && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted-foreground">At least {MIN_PASSWORD} characters.</p>}
        </div>
      )}

      {error && <p className="mt-3 text-destructive" role="alert">{error}</p>}
      {notice && <p className="mt-3 rounded-xl bg-surface p-4" role="status">{notice}</p>}

      <button className="btn btn-primary mt-5 w-full sm:w-auto" type="submit" disabled={busy}>
        {busy ? "One moment…" : label}
      </button>

      <p className="mt-4 text-sm text-muted-foreground">
        {mode === "create" && (<>Already have an account? <TextButton onClick={() => switchTo("signin")}>Sign in</TextButton></>)}
        {mode === "signin" && (
          <>
            <TextButton onClick={() => switchTo("forgot")}>Forgot password?</TextButton>
            {" · "}New here? <TextButton onClick={() => switchTo("create")}>Create an account</TextButton>
          </>
        )}
        {mode === "forgot" && (<>Remembered it? <TextButton onClick={() => switchTo("signin")}>Back to sign in</TextButton></>)}
      </p>
    </form>
  );
}

function TextButton({ onClick, children }: { onClick: () => void; children: string }) {
  return <button type="button" className="font-semibold text-primary underline underline-offset-2" onClick={onClick}>{children}</button>;
}

/** Shown after someone opens a password-reset link. */
export function NewPasswordForm() {
  const { updatePassword } = useApp();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) return <p className="rounded-xl bg-surface p-4" role="status">Your new password is saved.</p>;

  return (
    <form noValidate onSubmit={async (e) => {
      e.preventDefault();
      if (password.length < MIN_PASSWORD) return setError(`Choose a password with at least ${MIN_PASSWORD} characters.`);
      setBusy(true);
      const err = await updatePassword(password);
      setBusy(false);
      if (err) setError(err); else setDone(true);
    }}>
      <label className="block">
        <span className="mb-1.5 block font-semibold">Choose a new password</span>
        <input className="field" type="password" autoComplete="new-password" value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }} />
      </label>
      {error && <p className="mt-3 text-destructive" role="alert">{error}</p>}
      <button className="btn btn-primary mt-4" type="submit" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
