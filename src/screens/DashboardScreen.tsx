import React from 'react';
import { Profile, fmt } from '../data';
import { Menu, Bell, AlertTriangle, Filter } from 'lucide-react';

interface Props {
  profile: Profile;
  onSchemeClick: (id: string) => void;
  onAddScheme: () => void;
  onRefresh: () => void;
}

// SVG Donut Chart (from wireframe 5)
function DonutChart({ active, atRisk, completed, total }: { active: number; atRisk: number; completed: number; total: number }) {
  const size = 136;
  const r = 48;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  const segments = [
    { count: active, color: '#27AE60' },     // Active - green
    { count: atRisk, color: '#E67E22' },     // At Risk - orange/amber
    { count: completed, color: '#95A5A6' },  // Completed - grey
  ];

  let offset = circ / 4; // start from top (12 o'clock)
  const arcs = segments.map(seg => {
    const pct = total > 0 ? seg.count / total : 0;
    const len = pct * circ;
    const arc = { color: seg.color, offset, len };
    offset -= len;
    return arc;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F2F5" strokeWidth={14} />
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
      {/* Center Text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="24" fontWeight="900" fill="#1A2B4A">{total}</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7A9A">Total Schemes</text>
    </svg>
  );
}

// SVG Recovery Trend Line Chart (from wireframe 5)
function RecoveryTrendChart() {
  const W = 320, H = 140;
  // 6 points matching the wireframe curve: Jul (50k), midpoint (~70k), Aug (~78k), midpoint (~100k), Sep (~130k), Oct (~155k)
  const pts = [
    { x: 38, y: 110, label: 'Jul' },
    { x: 92, y: 92 },
    { x: 146, y: 86, label: 'Aug' },
    { x: 200, y: 68 },
    { x: 254, y: 48, label: 'Sep' },
    { x: 304, y: 34, label: 'Oct' },
  ];

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1].x},130 L${pts[0].x},130 Z`;
  const yLabels = [
    { text: '₹2L', y: 22 },
    { text: '₹1.5L', y: 48 },
    { text: '₹1L', y: 74 },
    { text: '₹50K', y: 100 },
    { text: '₹0', y: 126 },
  ];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 15}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27AE60" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#27AE60" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines & Y-axis labels */}
      {yLabels.map(l => (
        <g key={l.text}>
          <text x={0} y={l.y + 3} fontSize="9" fill="#95A5A6" fontWeight="500">{l.text}</text>
          <line x1={32} y1={l.y} x2={W} y2={l.y} stroke="#F2F4F7" strokeWidth={1} />
        </g>
      ))}

      {/* Area Fill under curve */}
      <path d={areaD} fill="url(#trendGrad)" />

      {/* Curve Stroke */}
      <path d={pathD} fill="none" stroke="#27AE60" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

      {/* Data dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#27AE60" strokeWidth={2.5} />
      ))}

      {/* X-axis labels */}
      {pts.filter(p => p.label).map(p => (
        <text key={p.label} x={p.x} y={H + 10} fontSize="10" fill="#6B7A9A" fontWeight="500" textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  );
}

export default function DashboardScreen({ profile, onSchemeClick, onAddScheme, onRefresh }: Props) {
  const atRiskSchemes = profile.schemes.filter(s => s.status === 'at_risk');

  // Wireframe 5 counts
  const totalSchemes = profile.totalSchemes || 90;
  const activeCount = 34;
  const atRiskCount = 18;
  const completedCount = 56;

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* ── Top Bar — wireframe 4: ≡ | [H logo] HERMIOUS | 🔔 ── */}
      <div style={{
        height: 56,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        boxSizing: 'border-box',
      }}>
        {/* Hamburger */}
        <button
          onClick={() => alert('Menu opened')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Menu size={22} color="var(--text-primary)" strokeWidth={2.2} />
        </button>

        {/* Center: H mark + HERMIOUS wordmark — perfectly centered vertically */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%' }}>
          <img
            src="/hermious-logo.png"
            alt="H"
            style={{
              height: 24,
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
          />
          <span style={{
            fontSize: 17,
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: 2,
            fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1,
          }}>
            HERMIOUS
          </span>
        </div>

        {/* Bell with notification dot */}
        <button
          onClick={onRefresh}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            width: 36,
            height: 36,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Bell size={22} color="var(--text-primary)" strokeWidth={2.2} />
          <span style={{
            position: 'absolute', top: 5, right: 3, width: 7, height: 7,
            borderRadius: '50%', background: '#E74C3C', border: '1.5px solid #fff',
          }} />
        </button>
      </div>

      {/* Greeting below header */}
      <div style={{ padding: '18px 20px 8px' }}>
        <h2 style={{ fontSize: 20, color: 'var(--text-primary)', margin: 0, letterSpacing: -0.3 }}>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Hello, </span>
          <span style={{ fontWeight: 800 }}>{profile.name}</span>
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>
          {profile.company}
        </p>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 88 }}>

        {/* Potential Recovery Card — dark navy (wireframe 4) */}
        <div style={{
          background: 'var(--primary)', borderRadius: 16, padding: '20px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 4px 20px rgba(26,43,74,0.25)',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600, textTransform: 'capitalize', letterSpacing: 0.3 }}>Potential Recovery</p>
            <p style={{ color: '#2ECC71', fontSize: 30, fontWeight: 900, marginTop: 4, letterSpacing: -0.5 }}>₹1,55,000</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>Across {profile.brands} Schemes</p>
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(39,174,96,0.18)', border: '1px solid rgba(46,204,113,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 22 }}>💼</span>
          </div>
        </div>

        {/* Recovery Overview 2x2 Grid (wireframe 4) */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Recovery Overview</p>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
              This Month <span style={{ fontSize: 9 }}>▾</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            <div style={{ padding: '16px', borderRight: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Total Schemes</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>90</p>
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Matched</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>56</p>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E8F8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#27AE60', fontSize: 13, fontWeight: 900 }}>✓</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '16px', borderRight: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>At Risk</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>18</p>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FEF5E7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={13} color="#E67E22" />
                </div>
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Recovered</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#27AE60', marginTop: 4 }}>₹85,000</p>
            </div>
          </div>
        </div>

        {/* Top At-Risk Schemes (wireframe 4) */}
        {atRiskSchemes.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Top At-Risk Schemes</p>
              <button onClick={() => onAddScheme()} style={{ background: 'none', border: 'none', color: '#27AE60', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                View All
              </button>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              {atRiskSchemes.slice(0, 3).map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => onSchemeClick(s.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: i < Math.min(atRiskSchemes.length, 3) - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: s.brandColor + '18', border: `1.5px solid ${s.brandColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: s.brandColor }}>{s.brandInitials}</span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{s.name}</p>
                  </div>
                  <p style={{ fontWeight: 800, color: '#E67E22', fontSize: 14, flexShrink: 0 }}>{fmt(s.atRiskAmount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════ */}
        {/* ── All Schemes Overview Section (Wireframe 5) ───────────────────── */}
        {/* ══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>All Schemes Overview</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Filter size={18} color="var(--text-secondary)" />
            </button>
          </div>

          {/* Donut Chart + Legend Card */}
          <div style={{
            background: '#fff', borderRadius: 18, border: '1px solid var(--border)',
            padding: '20px 16px', boxShadow: 'var(--shadow)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 12,
          }}>
            <DonutChart active={activeCount} atRisk={atRiskCount} completed={completedCount} total={totalSchemes} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 120 }}>
              {[
                { color: '#27AE60', label: 'Active', count: activeCount },
                { color: '#E67E22', label: 'At Risk', count: atRiskCount },
                { color: '#95A5A6', label: 'Completed', count: completedCount },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{item.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Recovery & Recovered Amount (2 Cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '16px', boxShadow: 'var(--shadow)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Potential Recovery</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#27AE60', marginTop: 4 }}>₹1,55,000</p>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '16px', boxShadow: 'var(--shadow)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Recovered Amount</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#27AE60', marginTop: 4 }}>₹85,000</p>
            </div>
          </div>

          {/* Recovery Trend Line Chart Card */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--border)', padding: '18px 16px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Recovery Trend</p>
              <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
                This Quarter <span style={{ fontSize: 9 }}>▾</span>
              </button>
            </div>
            <RecoveryTrendChart />
          </div>
        </div>

      </div>
    </div>
  );
}
