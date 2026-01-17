import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      className={cn("h-10 w-auto", className)}
      aria-label="NewsLK Live Logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#991B1B', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Play Button Icon */}
      <g filter="url(#shadow)">
        <rect x="5" y="15" width="50" height="50" rx="8" fill="url(#redGradient)" />
        <path d="M 22 28 L 22 52 L 42 40 Z" fill="white" />
      </g>

      {/* LIVE Text Box */}
      <g filter="url(#shadow)">
        <rect x="65" y="15" width="130" height="50" rx="8" fill="url(#redGradient)" />
        <text x="130" y="50" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white" textAnchor="middle">
          LIVE
        </text>
      </g>
    </svg>
  );
}
