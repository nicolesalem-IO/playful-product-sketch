import type { ModuleId } from "@/content/curriculum";
import value from "@/assets/module-value.jpg";
import contribution from "@/assets/module-contribution.jpg";
import warmth from "@/assets/module-warmth.jpg";
import visible from "@/assets/module-visible.jpg";
import connect from "@/assets/module-connect.jpg";
import ask from "@/assets/module-ask.jpg";
import grounded from "@/assets/module-grounded.jpg";

// One photo per module showing a woman practicing what the module teaches.
// Decorative: the lesson title and text carry the meaning.
const photos: Record<ModuleId, string> = { value, contribution, warmth, visible, connect, ask, grounded };

export function ModuleArt({ id, className = "" }: { id: ModuleId; className?: string }) {
  return (
    <img
      src={photos[id]}
      alt=""
      aria-hidden="true"
      width={1536}
      height={864}
      loading="lazy"
      className={`object-cover object-[center_30%] ${className}`}
    />
  );
}
