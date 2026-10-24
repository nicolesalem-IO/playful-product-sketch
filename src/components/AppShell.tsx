import { Link } from "@tanstack/react-router";
import { Sun, Map, BookHeart, NotebookPen, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

const nav = [
  { to: "/", label: "Today", icon: Sun },
  { to: "/path", label: "Your Path", icon: Map },
  { to: "/evidence", label: "My Evidence", icon: BookHeart },
  { to: "/reflect", label: "Reflect", icon: NotebookPen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:px-5 md:py-8 sticky top-0 h-screen">
        <Link to="/" className="mb-10 block">
          <span className="flex items-center gap-2.5"><Logo className="h-10 w-10" /><span className="font-serif text-xl font-bold leading-tight text-primary">Own Your Presence</span></span>
          <span className="mt-1 block text-sm text-muted-foreground">Warmth. Confidence. Recognition.</span>
        </Link>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-surface data-[status=active]:bg-surface data-[status=active]:font-semibold data-[status=active]:text-primary">
              <Icon className="h-5 w-5" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <Link to="/settings" className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-surface data-[status=active]:text-primary">
          <UserRound className="h-5 w-5" aria-hidden /> Profile & settings
        </Link>
      </aside>

      <header className="flex items-center justify-between px-5 pt-5 md:hidden">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg font-bold text-primary"><Logo className="h-8 w-8" />Own Your Presence</Link>
        <Link to="/settings" aria-label="Profile and settings" className="flex h-11 w-11 items-center justify-center rounded-full border bg-card text-primary">
          <UserRound className="h-5 w-5" aria-hidden />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-28 pt-6 md:px-10 md:pb-16 md:pt-12">{children}</main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-card md:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs text-muted-foreground data-[status=active]:font-semibold data-[status=active]:text-primary">
            <Icon className="h-5 w-5" aria-hidden /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 animate-rise">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="text-4xl leading-tight text-primary md:text-5xl">{title}</h1>
      {children && <div className="mt-3 text-lg text-muted-foreground">{children}</div>}
    </div>
  );
}

export function Loading() {
  return <div className="min-h-screen" aria-busy="true" />;
}
