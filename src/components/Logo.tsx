export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Own Your Presence logo">
      <rect width="48" height="48" rx="14" fill="var(--primary)" />
      {/* Leaf, stem and midrib */}
      <path d="M12 36C11.5 21 21 11.5 36.5 11.5 36.5 27 27 36.5 12 36z" fill="var(--mint)" />
      <path d="M10 38 31.5 16.5" stroke="var(--primary)" strokeWidth="1.9" strokeLinecap="round" fill="none" />
      {/* Veins */}
      <path
        d="M18.5 29.5Q18.2 26 19.6 23.4M18.5 29.5Q22 29.8 24.6 28.4M24.5 23.5Q24.3 21 25.4 19M24.5 23.5Q27 23.7 29 22.6"
        stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".55"
      />
    </svg>
  );
}
