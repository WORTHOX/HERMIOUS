import React from 'react';
import { Profile, fmt } from '../data';
import { ArrowLeft, Filter } from 'lucide-react';

interface Props { profile: Profile; onBack?: () => void; }

// SVG Donut Chart
function DonutChart({ active, atRisk, completed, total }: { active: number; atRisk: number; completed: number; total: number }) {
  const size = 140;
  const r = 50;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  const segments = [
    { count: active, color: '#27AE60' },
    { count: atRisk, color: '#F39C12' },
    { count: completed, color: '#C8C8C8' },
  ];

  let offset = circ / 4; // start from top
  const arcs = segments.map(seg => {
    const pct = total > 0 ? seg.count / total : 0;
    const len = pct * circ;
    const arc = { color: seg.color, offset, len };
    offset -= len;
    return arc;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth={14} />
      {arcs.map((arc, i) => arc.len > 0 && (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={14}
          strokeDasharray={`${arc.len} ${circ - arc.len}`}
          strokeDashoffset={arc.offset}
          strokeLinecap="butt"
        />
      ))}
      {/* Center */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="900" fill="#1A2B4A">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6B7A9A">Total Schemes</text>
    </svg>
  );
}

// Recovery Trend SVG line chart
function RecoveryTrendChart() {
  const W = 290, H = 120;
  const months = ['Jul', 'Aug', 'Sep', 'Oct'];
  const vals = [50000, 85000, 115000, 155000];
  const maxV = 200000;
  const pts = vals.map((v, i) => ({
    x: 28 + i * ((W - 36) / (vals.length - 1)),
    y: H - 16 - ((v / maxV) * (H - 26)),
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L${pts[pts.length - 1].x},${H - 16} L${pts[0].x},${H - 16} Z`;
  const yLabels = ['₹2L', '₹1.5L', '₹1L', '₹50K', '₹0'];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 10}`} style={{ overflow: 'visible' }}>
      {/* Y-axis labels */}
      {yLabels.map((lbl, i) => (
        <text key={lbl} x={0} y={16 + i * ((H - 26) / 4)} fontSize="8" fill="#6B7A9A">{lbl}</text>
      ))}
      {/* Grid lines */}
      {yLabels.map((_, i) => (
        <line key={i} x1={24} y1={16 + i * ((H - 26) / 4)} x2={W} y2={16 + i * ((H - 26) / 4)} stroke="#F0F0F0" strokeWidth={1} />
      ))}
      {/* Area fill */}
      <path d={areaD} fill="rgba(39,174,96,0.10)" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="#27AE60" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#27AE60" strokeWidth={2.5} />
      ))}
      {/* X-axis labels */}
      {months.map((m, i) => (
        <text key={m} x={pts[i].x} y={H + 8} fontSize="9" fill="#6B7A9A" textAnchor="middle">{m}</text>
      ))}
    </svg>
  );
}

export default function AllSchemesOverviewScreen({ profile, onBack }: Props) {
  const active = profile.schemes.filter(s => s.status === 'active').length;
  const atRisk = profile.schemes.filter(s => s.status === 'at_risk').length;
  const completed = profile.schemes.filter(s => s.status === 'completed').length;
  const total = active + atRisk + completed;

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* Header */}
      <div style={{
        height: 56,
        padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        boxSizing: 'border-box',
      }}>
        {onBack ? (
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={22} color="var(--text-primary)" />
          </button>
        ) : <div style={{ width: 30 }} />}
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>All Schemes Overview</h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-secondary)" />
        </button>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 32 }}>

        {/* Donut + Legend */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <DonutChart active={active} atRisk={atRisk} completed={completed} total={total} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { color: '#27AE60', label: 'Active', count: active },
              { color: '#F39C12', label: 'At Risk', count: atRisk },
              { color: '#C8C8C8', label: 'Completed', count: completed },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginLeft: 4 }}>{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Potential Recovery + Recovered Amount */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="stat-card">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>Potential Recovery</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#27AE60' }}>{fmt(profile.potentialRecovery)}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>Recovered Amount</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>{fmt(profile.recoveredAmount)}</p>
          </div>
        </div>

        {/* Recovery Trend */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Recovery Trend</p>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
              This Quarter <span style={{ fontSize: 9 }}>▾</span>
            </button>
          </div>
          <RecoveryTrendChart />
        </div>
      </div>
    </div>
  );
}
