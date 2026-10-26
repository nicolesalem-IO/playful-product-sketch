import type { ReactNode } from "react";
import type { ModuleId } from "@/content/curriculum";

// Original flat illustrations, one per module, in the app's paper, green, and gold palette.
// Decorative only: the lesson title and text carry the meaning.

const G = "#0E5647";
const G2 = "#2E7A64";
const SAGE = "#8FBFA8";
const MINT = "#CFE3D8";
const GOLD = "#E2B23C";
const GOLD_L = "#F3DA94";
const BROWN = "#7A5A0F";
const SAND = "#EFE6D3";
const SAND_D = "#E3D5B8";
const PAPER = "#F7F3EA";
const WHITE = "#FFFFFF";

/** A single leaf pointing up from (0,0), with a midrib. */
function Leaf({ x, y, r = 0, s = 1, fill = G2, rib = true }: { x: number; y: number; r?: number; s?: number; fill?: string; rib?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0C-15-17-14-44 0-62 14-44 15-17 0 0Z" fill={fill} />
      {rib && <path d="M0-4V-54" stroke={PAPER} strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />}
    </g>
  );
}

/** A small sprig of leaves growing from (x,y). */
function Sprig({ x, y, s = 1, flip = false, tone = [G, G2, SAGE] }: { x: number; y: number; s?: number; flip?: boolean; tone?: [string, string, string] }) {
  const d = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${d * s} ${s})`}>
      <path d="M0 0C4-40 14-80 34-112" stroke={tone[0]} strokeWidth="5" strokeLinecap="round" fill="none" />
      <Leaf x={6} y={-30} r={-48} s={0.8} fill={tone[1]} />
      <Leaf x={14} y={-62} r={42} s={0.75} fill={tone[2]} />
      <Leaf x={22} y={-86} r={-38} s={0.7} fill={tone[0]} />
      <Leaf x={34} y={-112} r={20} s={0.6} fill={tone[1]} />
    </g>
  );
}

function Star({ x, y, r = 22, fill = GOLD }: { x: number; y: number; r?: number; fill?: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} strokeLinejoin="round" />;
}

function Sparkle({ x, y, s = 1, fill = GOLD }: { x: number; y: number; s?: number; fill?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0-14C2-4 4-2 14 0 4 2 2 4 0 14-2 4-4 2-14 0-4-2-2-4 0-14Z" fill={fill} />;
}

// Leaf positions around the medal: angle on the circle, and which side.
const wreath: [number, "l" | "r"][] = [
  [115, "l"], [145, "l"], [175, "l"], [205, "l"],
  [65, "r"], [35, "r"], [5, "r"], [-25, "r"],
];

const scenes: Record<ModuleId, ReactNode> = {
  // Know What You Bring: a bag filled with leaves and a star
  value: (
    <>
      <rect width="640" height="360" fill={SAND} />
      <circle cx="492" cy="104" r="58" fill={GOLD_L} />
      <ellipse cx="320" cy="320" rx="190" ry="12" fill={SAND_D} />
      <path d="M268 186C268 120 372 120 372 186" stroke={G2} strokeWidth="14" strokeLinecap="round" fill="none" />
      <Leaf x={276} y={186} r={-34} s={1.05} fill={SAGE} />
      <Leaf x={300} y={182} r={-10} s={1.25} fill={G2} />
      <Leaf x={346} y={184} r={18} s={1.15} fill={SAGE} />
      <Leaf x={366} y={190} r={40} s={0.95} fill={G2} />
      <rect x="222" y="176" width="196" height="140" rx="26" fill={G} />
      <rect x="222" y="232" width="196" height="12" fill={G2} />
      <circle cx="320" cy="238" r="16" fill={GOLD} />
      <Star x={324} y={96} r={26} />
      <Sparkle x={420} y={150} s={0.8} />
      <Sparkle x={214} y={120} s={0.6} fill={G2} />
      <Sprig x={92} y={350} s={1.1} />
      <Sprig x={560} y={350} s={0.9} flip tone={[G2, SAGE, G]} />
    </>
  ),
  // Own Your Wins: a gold medal on a ribbon, with a leaf wreath
  contribution: (
    <>
      <rect width="640" height="360" fill="#E7EFE9" />
      <polygon points="282,40 318,40 300,196 262,180" fill={G} />
      <polygon points="358,40 322,40 340,196 378,180" fill={G2} />
      {wreath.map(([phi, side], i) => {
        const rad = (phi * Math.PI) / 180;
        const [dx, dy] = side === "l" ? [-Math.sin(rad), Math.cos(rad)] : [Math.sin(rad), -Math.cos(rad)];
        const rot = (Math.atan2(dy, dx) * 180) / Math.PI + 90 + (side === "l" ? -18 : 18);
        return <Leaf key={i} x={320 + 90 * Math.cos(rad)} y={238 + 90 * Math.sin(rad)} r={rot} s={0.68} fill={i % 2 ? SAGE : G2} rib={false} />;
      })}
      <circle cx="320" cy="238" r="74" fill={GOLD} />
      <circle cx="320" cy="238" r="56" fill={GOLD_L} />
      <Star x={320} y={240} r={32} />
      <Sparkle x={182} y={110} s={1} />
      <Sparkle x={470} y={86} s={0.8} />
      <Sparkle x={500} y={190} s={0.55} fill={G2} />
      <Sprig x={70} y={360} s={1} />
      <Sprig x={580} y={360} s={1.05} flip tone={[G2, SAGE, G]} />
    </>
  ),
  // Be Liked and Respected: two speech bubbles, warm and clear
  warmth: (
    <>
      <rect width="640" height="360" fill="#F7ECD0" />
      <rect x="132" y="70" width="250" height="140" rx="44" fill={G} />
      <polygon points="182,200 168,252 236,206" fill={G} />
      <path d="M257 158c-26-18-42-30-42-48 0-12 10-21 21-21 9 0 16 5 21 12 5-7 12-12 21-12 11 0 21 9 21 21 0 18-16 30-42 48z" fill={GOLD} />
      <rect x="290" y="160" width="224" height="126" rx="44" fill={WHITE} />
      <polygon points="470,276 494,322 420,284" fill={WHITE} />
      <path d="M368 224l26 24 50-52" stroke={G} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Sparkle x={540} y={110} s={0.9} />
      <Sparkle x={96} y={250} s={0.6} fill={G2} />
      <Sprig x={64} y={360} s={0.9} />
      <Sprig x={590} y={360} s={0.85} flip tone={[G2, SAGE, G]} />
    </>
  ),
  // Become More Visible: a spotlight on a young plant
  visible: (
    <>
      <rect width="640" height="360" fill={G} />
      <polygon points="176,74 214,58 470,312 250,312" fill={GOLD_L} opacity=".28" />
      <ellipse cx="360" cy="312" rx="132" ry="22" fill={GOLD_L} opacity=".55" />
      <g transform="translate(150 40) rotate(-28)">
        <rect x="0" y="0" width="70" height="44" rx="10" fill={GOLD} />
        <rect x="62" y="6" width="18" height="32" rx="4" fill={GOLD_L} />
      </g>
      <path d="M150 0V40" stroke={GOLD} strokeWidth="5" />
      <path d="M342 296h36l-6 -40h-24z" fill={GOLD} transform="translate(0 0)" />
      <rect x="334" y="250" width="52" height="12" rx="4" fill={GOLD_L} />
      <path d="M360 252C360 214 362 186 368 164" stroke={MINT} strokeWidth="5" strokeLinecap="round" fill="none" />
      <Leaf x={360} y={226} r={-52} s={0.85} fill={SAGE} />
      <Leaf x={363} y={200} r={48} s={0.8} fill={MINT} />
      <Leaf x={368} y={170} r={-8} s={0.7} fill={SAGE} />
      <Sparkle x={520} y={80} s={0.8} fill={GOLD_L} />
      <Sparkle x={560} y={150} s={0.5} fill={GOLD_L} />
      <Sparkle x={460} y={60} s={0.45} fill={GOLD_L} />
      <circle cx="90" cy="250" r="3" fill={GOLD_L} />
      <circle cx="580" cy="260" r="3" fill={GOLD_L} />
    </>
  ),
  // Build Your Network: connected circles, like a growing vine
  connect: (
    <>
      <rect width="640" height="360" fill="#E7EFE9" />
      <g stroke={G2} strokeWidth="5" strokeLinecap="round">
        <path d="M320 180L178 104M320 180L182 262M320 180L470 98M320 180L488 252M178 104L94 172M470 98L566 150M488 252L566 150M182 262L94 172" />
      </g>
      <circle cx="320" cy="180" r="50" fill={GOLD} />
      <Star x={320} y={182} r={24} fill={WHITE} />
      <circle cx="178" cy="104" r="32" fill={G} />
      <circle cx="182" cy="262" r="28" fill={WHITE} stroke={G} strokeWidth="5" />
      <circle cx="470" cy="98" r="30" fill={WHITE} stroke={G} strokeWidth="5" />
      <circle cx="488" cy="252" r="34" fill={G} />
      <circle cx="94" cy="172" r="20" fill={SAGE} />
      <circle cx="566" cy="150" r="22" fill={GOLD_L} />
      <circle cx="182" cy="262" r="9" fill={GOLD} />
      <circle cx="470" cy="98" r="10" fill={GOLD} />
      <Sparkle x={250} y={42} s={0.7} />
      <Sparkle x={400} y={322} s={0.6} fill={G2} />
    </>
  ),
  // Ask with Confidence: a paper plane taking off
  ask: (
    <>
      <rect width="640" height="360" fill={SAND} />
      <circle cx="470" cy="118" r="70" fill={GOLD_L} />
      <path d="M96 300C170 300 210 250 250 226S340 206 372 170" stroke={G2} strokeWidth="6" strokeLinecap="round" strokeDasharray="2 16" fill="none" />
      <g transform="translate(372 170) rotate(-24)">
        <polygon points="0,0 150,-20 26,30" fill={WHITE} />
        <polygon points="26,30 150,-20 52,60" fill={MINT} />
        <polygon points="26,30 52,60 40,30" fill={SAGE} />
        <path d="M0 0L150-20 52 60 26 30Z" stroke={G} strokeWidth="5" strokeLinejoin="round" fill="none" />
        <path d="M26 30L150-20" stroke={G} strokeWidth="4" strokeLinecap="round" />
      </g>
      <g fill={PAPER}>
        <ellipse cx="190" cy="104" rx="56" ry="20" />
        <ellipse cx="226" cy="92" rx="34" ry="22" />
        <ellipse cx="560" cy="236" rx="46" ry="16" />
      </g>
      <Sparkle x={590} y={70} s={0.7} />
      <Sparkle x={300} y={300} s={0.55} fill={G2} />
      <Sprig x={60} y={360} s={1} />
    </>
  ),
  // Stay Grounded: a tree with deep roots
  grounded: (
    <>
      <rect width="640" height="360" fill="#E7EFE9" />
      <rect y="236" width="640" height="124" fill={SAND_D} />
      <path d="M0 236H640" stroke={G2} strokeWidth="4" />
      <g stroke={BROWN} strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M320 236C318 270 300 296 262 318M320 236C324 274 344 300 388 322M320 250C306 270 268 276 228 290M322 248C340 266 380 268 420 282M312 300C306 320 292 334 276 344" />
      </g>
      <ellipse cx="160" cy="306" rx="16" ry="9" fill={GOLD_L} />
      <ellipse cx="500" cy="318" rx="20" ry="10" fill={GOLD_L} />
      <ellipse cx="540" cy="282" rx="10" ry="6" fill={GOLD} />
      <path d="M306 238L310 150H330L334 238Z" fill={BROWN} />
      <circle cx="270" cy="128" r="58" fill={G2} />
      <circle cx="372" cy="122" r="62" fill={G} />
      <circle cx="320" cy="78" r="64" fill={G2} />
      <circle cx="318" cy="140" r="54" fill={G2} />
      <circle cx="294" cy="70" r="26" fill={SAGE} />
      <circle cx="350" cy="64" r="9" fill={GOLD} />
      <circle cx="262" cy="110" r="8" fill={GOLD} />
      <circle cx="398" cy="140" r="8" fill={GOLD} />
      <Sparkle x={120} y={90} s={0.7} />
      <Sparkle x={540} y={70} s={0.6} fill={G2} />
    </>
  ),
};

export function ModuleArt({ id, className = "" }: { id: ModuleId; className?: string }) {
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      {scenes[id]}
    </svg>
  );
}
