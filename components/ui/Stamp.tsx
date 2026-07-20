import { cn } from "@/lib/utils";

export default function Stamp({
  children,
  className,
  filled = false,
}: {
  children: React.ReactNode;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={cn(
        "stamp px-3 py-1 font-mono text-[10px] uppercase tracking-widest2",
        filled ? "bg-signal text-ink border-signal" : "text-signal",
        className
      )}
    >
      {children}
    </span>
  );
}
