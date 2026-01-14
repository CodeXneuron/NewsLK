import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-8 w-auto", className)}
      aria-label="LankaNow Logo"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M20 80 V 20 L 45 45 V 80 H 20 Z"
        fill="url(#grad1)"
      />
      <path
        d="M55 20 V 80 L 80 55 V 20 H 55 Z"
        fill="url(#grad1)"
      />
    </svg>
  );
}
