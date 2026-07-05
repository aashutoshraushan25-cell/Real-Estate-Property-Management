/* Lightweight dependency-free SVG charts for dashboard analytics */

export function BarChart({ data, height = 180, color = '#3f6bf0' }: {
  data: { label: string; value: number }[]; height?: number; color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const bw = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height / 2.4}`} className="w-full" role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const h = (d.value / max) * (height / 2.4 - 12);
        return (
          <g key={d.label}>
            <rect x={i * bw + bw * 0.22} y={height / 2.4 - 10 - h} width={bw * 0.56} height={h}
              rx={1.6} fill={color} opacity={0.85}>
              <animate attributeName="height" from="0" to={h} dur="0.7s" fill="freeze" />
              <animate attributeName="y" from={height / 2.4 - 10} to={height / 2.4 - 10 - h} dur="0.7s" fill="freeze" />
            </rect>
            <text x={i * bw + bw / 2} y={height / 2.4 - 2.5} textAnchor="middle" fontSize={3}
              className="fill-slate-400">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function AreaChart({ data, height = 180, color = '#10b981' }: {
  data: { label: string; value: number }[]; height?: number; color?: string;
}) {
  const H = height / 2.4;
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 96 + 2;
    const y = H - 10 - (d.value / max) * (H - 14);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${line} L98,${H - 10} L2,${H - 10} Z`;
  const gid = `grad-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 100 ${H}`} className="w-full" role="img" aria-label="Area chart">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="2" x2="98" y1={(H - 10) * f} y2={(H - 10) * f} strokeWidth="0.2" className="stroke-slate-300 dark:stroke-slate-700" />
      ))}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill={color} />
      ))}
      {data.map((d, i) => (
        <text key={d.label} x={(i / (data.length - 1)) * 96 + 2} y={H - 2.5} textAnchor="middle"
          fontSize={2.8} className="fill-slate-400">{d.label}</text>
      ))}
    </svg>
  );
}

export function DonutChart({ data, size = 160 }: {
  data: { label: string; value: number; color: string }[]; size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 15.9155; // circumference = 100
  let offset = 25;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 42 42" style={{ width: size, height: size }} role="img" aria-label="Donut chart">
        <circle cx="21" cy="21" r={R} fill="none" strokeWidth="6" className="stroke-slate-100 dark:stroke-slate-800" />
        {data.map((d) => {
          const pct = (d.value / total) * 100;
          const el = (
            <circle key={d.label} cx="21" cy="21" r={R} fill="none" stroke={d.color} strokeWidth="6"
              strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset} strokeLinecap="butt" />
          );
          offset -= pct;
          return el;
        })}
        <text x="21" y="20" textAnchor="middle" fontSize="6.5" fontWeight="800" className="fill-slate-900 dark:fill-white">{total}</text>
        <text x="21" y="26.5" textAnchor="middle" fontSize="2.8" className="fill-slate-400">TOTAL</text>
      </svg>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="font-medium text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="ml-auto pl-3 font-bold text-slate-900 dark:text-white">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
