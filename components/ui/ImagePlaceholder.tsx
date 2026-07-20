import { cn } from "@/lib/utils";

const PALETTES = [
  "from-[#1a1a18] via-[#2b1210] to-[#0a0a0a]",
  "from-[#1c1c1a] via-[#241a12] to-[#0a0a0a]",
  "from-[#20120f] via-[#0a0a0a] to-[#1a1a18]",
  "from-[#151513] via-[#2a1512] to-[#0a0a0a]",
];

function hashToIndex(str: string, mod: number) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

export default function ImagePlaceholder({
  label,
  className,
  seed,
}: {
  label: string;
  className?: string;
  seed?: string;
}) {
  const palette = PALETTES[hashToIndex(seed ?? label, PALETTES.length)];
  return (
    <div
      className={cn(
        "relative flex items-end overflow-hidden bg-gradient-to-br",
        palette,
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <p className="relative z-10 p-4 font-display text-xl uppercase leading-none text-bone/70">
        {label}
      </p>
    </div>
  );
}
