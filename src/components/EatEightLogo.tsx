export function EatEightLogo({ className }: { className?: string }) {
  const font = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 15 560 155"
      className={className}
      role="img"
      aria-label="EatEight"
    >
      <defs>
        <linearGradient id="eeBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
      <g transform="translate(30, 45)">
        <circle cx="60" cy="-10" r="15" fill="#0284c7" />
        <path d="M60 10 C25 10, 5 40, 5 75 L115 75 C115 40, 95 10, 60 10 Z" fill="url(#eeBlueGradient)" />
        <path d="M -5 85 Q 60 105 125 85 L 125 95 Q 60 115 -5 95 Z" fill="#0ea5e9" />
      </g>
      <text x="180" y="115" style={font} fontWeight={800} fontSize={85} fill="#1e293b">
        Eat
      </text>
      <text x="325" y="115" style={font} fontWeight={800} fontSize={85} fill="#0284c7">
        Eight.
      </text>
      <text x="185" y="155" style={font} fontWeight={700} fontSize={20} fill="#64748b" letterSpacing={3}>
        PLATFORM KATERING KAMPUS
      </text>
    </svg>
  );
}
