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
    <div className="app-shell min-h-screen">
      <aside className="desktop-header hidden md:flex">
        <Link to="/" className="brand-link shrink-0">
          <span className="flex items-center gap-3"><Logo className="h-10 w-10" /><span className="font-serif text-lg font-bold leading-tight text-primary">Own Your Presence</span></span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="desktop-nav-link flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground hover:text-primary data-[status=active]:font-semibold data-[status=active]:text-primary">
              <Icon className="h-5 w-5" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <Link to="/settings" aria-label="Profile and settings" title="Profile & settings" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-primary hover:bg-surface">
          <UserRound className="h-5 w-5" aria-hidden />
        </Link>
      </aside>

      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-5 py-4 md:hidden">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-serif text-base font-bold text-primary"><Logo className="h-8 w-8 shrink-0" /><span>Own Your Presence</span></Link>
        <Link to="/settings" aria-label="Profile and settings" className="flex h-11 w-11 items-center justify-center rounded-full border bg-card text-primary">
          <UserRound className="h-5 w-5" aria-hidden />
        </Link>
      </header>

      <main className="app-main mx-auto w-full max-w-3xl px-5 pb-28 pt-8 md:px-10 md:pb-20 md:pt-14">{children}</main>

      <nav aria-label="Main" className="mobile-nav fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-background md:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
            className="flex min-h-16 flex-col items-center justify-center gap-1.5 text-[11px] text-muted-foreground data-[status=active]:font-semibold data-[status=active]:text-primary">
            <Icon className="h-5 w-5" aria-hidden /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-title mb-10 animate-rise">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 className="text-3xl leading-tight text-primary md:text-5xl">{title}</h1>
      {children && <div className="mt-3 text-lg text-muted-foreground">{children}</div>}
    </div>
  );
}

export function Loading() {
  return <div className="min-h-screen" aria-busy="true" />;
}
