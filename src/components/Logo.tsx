export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Own Your Presence logo">
      <rect width="48" height="48" rx="14" fill="var(--primary)" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="var(--mint-dim)" strokeWidth="2.5" />
      <path d="M24 13c6 4 7 12 0 22-7-10-6-18 0-22z" fill="var(--mint)" />
    </svg>
  );
}
