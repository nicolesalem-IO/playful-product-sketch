import { Link } from "@tanstack/react-router";
import { Sprout, Footprints, NotebookPen, BookHeart } from "lucide-react";
import { sessions } from "@/content/curriculum";
import { useApp, completedIds, localDate, daysBetween } from "@/lib/store";

/** Overall progress + an 8-week activity trend. */
export function ProgressPanel() {
  const { state } = useApp();
  const done = completedIds(state);
  const total = sessions.length;
  const pct = total ? Math.round((done.length / total) * 100) : 0;
  const today = localDate();

  const dates: string[] = [
    ...Object.values(state.progress).filter((p) => p.completedAt).map((p) => localDate(new Date(p.completedAt!))),
    ...state.reflections.map((r) => r.date),
    ...state.evidence.map((e) => e.date),
  ];
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const w = 7 - i;
    return dates.filter((d) => Math.floor(daysBetween(d, today) / 7) === w).length;
  });
  const max = Math.max(1, ...weeks);
  const tried = state.actions.filter((a) => a.status === "yes" || a.status === "smaller").length;

  return (
    <section className="progress-panel mt-12 border-y py-8" aria-label="Your progress">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-xl"><Sprout className="h-5 w-5 shrink-0 text-primary" aria-hidden /> Your progress</h2>
        <Link to="/path" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">See path</Link>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-sm"><span>{done.length} of {total} sessions</span><span className="font-semibold text-primary">{pct}%</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-2 text-center">
        <Mini icon={Footprints} n={tried} label="Practices tried" tone="bg-panel-mint" />
        <Mini icon={NotebookPen} n={state.reflections.length} label="Reflections" tone="bg-panel-blue" />
        <Mini icon={BookHeart} n={state.evidence.length} label="Evidence" tone="bg-panel-peach" />
      </div>
      <p className="mt-6 text-sm font-semibold text-muted-foreground">Activity, last 8 weeks</p>
      <div className="mt-2 flex h-20 items-end gap-2" aria-label={`Weekly activity: ${weeks.join(", ")}`}>
        {weeks.map((n, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className={`w-full rounded-md ${i === 7 ? "bg-gold" : "bg-mint-dim"}`} style={{ height: `${Math.max(6, (n / max) * 64)}px`, opacity: n ? 1 : 0.35 }} />
            <span className="text-[10px] text-hint">{i === 7 ? "Now" : `${7 - i}w`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Mini({ icon: Icon, n, label, tone }: { icon: typeof Sprout; n: number; label: string; tone: string }) {
  return (
    <div className={`progress-stat rounded-lg px-2 py-4 ${tone}`}>
      <Icon className="mx-auto h-5 w-5 text-primary" aria-hidden />
      <p className="mt-1 text-2xl font-bold text-primary">{n}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
