'use client';

export default function ConcentricPattern() {
  return (
    <svg className="concentric-pattern" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <ellipse
          key={i}
          cx="400"
          cy="400"
          rx={80 + i * 42}
          ry={50 + i * 28}
          fill="none"
          stroke="rgba(107, 40, 201, 0.08)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
