'use client';

const orbs = [
  { size: 180, x: '8%', y: '15%', color: 'rgba(87, 51, 157, 0.55)', delay: 0 },
  { size: 120, x: '85%', y: '12%', color: 'rgba(192, 132, 252, 0.45)', delay: -2 },
  { size: 90, x: '72%', y: '55%', color: 'rgba(57, 31, 107, 0.5)', delay: -4 },
  { size: 140, x: '15%', y: '70%', color: 'rgba(124, 58, 237, 0.4)', delay: -1 },
  { size: 70, x: '50%', y: '8%', color: 'rgba(233, 213, 255, 0.35)', delay: -3 },
  { size: 100, x: '92%', y: '78%', color: 'rgba(87, 51, 157, 0.35)', delay: -5 },
  { size: 60, x: '35%', y: '85%', color: 'rgba(168, 85, 247, 0.4)', delay: -2.5 },
];

export default function BokehField() {
  return (
    <div className="rwa-bokeh" aria-hidden>
      {orbs.map((o, i) => (
        <span
          key={i}
          className="rwa-bokeh-orb"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: o.color,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
