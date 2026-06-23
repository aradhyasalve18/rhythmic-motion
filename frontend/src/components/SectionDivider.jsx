// A row of alternating gold footprints — used between major sections on the
// homepage. The motif literally encodes "steps", which is the one piece of
// structural meaning this page leans on instead of generic numbering.
export default function SectionDivider() {
  return (
    <div className="step-divider" role="presentation" aria-hidden="true">
      <svg viewBox="0 0 600 60" preserveAspectRatio="xMidYMid meet">
        {Array.from({ length: 6 }).map((_, i) => {
          const x = 40 + i * 100
          const up = i % 2 === 0
          return (
            <ellipse
              key={i}
              cx={x}
              cy={up ? 20 : 40}
              rx="9"
              ry="14"
              transform={`rotate(${up ? -12 : 12} ${x} ${up ? 20 : 40})`}
              fill="url(#stepGradient)"
              opacity={0.85}
            />
          )
        })}
        <defs>
          <linearGradient id="stepGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d78c" />
            <stop offset="100%" stopColor="#9c7423" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
