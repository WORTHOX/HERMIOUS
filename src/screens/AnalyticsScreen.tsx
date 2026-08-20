import React from 'react';
import { Profile, fmt } from '../data';
import { TrendingUp, TrendingDown, BarChart2, PieChart, Activity } from 'lucide-react';

interface Props { profile: Profile; }

export default function AnalyticsScreen({ profile }: Props) {
  const active = profile.schemes.filter(s => s.status === 'active');
  const atRisk = profile.schemes.filter(s => s.status === 'at_risk');
  const expired = profile.schemes.filter(s => s.status === 'expired');

  const categories = profile.schemes.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.expectedBenefit;
    return acc;
  }, {});

  const catEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries[0]?.[1] || 1;

  const catColors: Record<string, string> = {
    Government: '#1A2B4A', Credit: '#2ECC71', Tax: '#E74C3C',
    Subsidy: '#F39C12', Funding: '#9B59B6', Market: '#3498DB',
  };

  const total = profile.schemes.reduce((s, x) => s + x.expectedBenefit, 0);
  const recovered = active.reduce((s, x) => s + x.expectedBenefit, 0);
  const rate = total > 0 ? Math.round((recovered / total) * 100) : 0;

  return (
    <div className="screen fade-in">
      <div className="gradient-header">
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>Analytics</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>Financial recovery insights</p>

        {/* Big number */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px', marginTop: 18, border: '1px solid rgba(255,255,255,0.12)' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Total Portfolio Value</p>
          <p style={{ color: '#2ECC71', fontSize: 30, fontWeight: 900, marginTop: 4 }}>{fmt(total)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <TrendingUp size={14} color="#2ECC71" />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{rate}% recovery rate</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Status breakdown */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Activity size={16} /> Status Breakdown</p>
          {[
            { label: 'Active', count: active.length, amount: active.reduce((s,x)=>s+x.expectedBenefit,0), color: '#27AE60', bg: '#EAFAF1' },
            { label: 'At Risk', count: atRisk.length, amount: atRisk.reduce((s,x)=>s+x.atRiskAmount,0), color: '#E74C3C', bg: '#FDEDEC' },
            { label: 'Expired', count: expired.length, amount: expired.reduce((s,x)=>s+x.expectedBenefit,0), color: '#F39C12', bg: '#FEF9E7' },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: row.color }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{row.label}</span>
                  <span style={{ background: row.bg, color: row.color, borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{row.count}</span>
                </div>
                <span style={{ fontWeight: 800, color: row.color }}>{fmt(row.amount)}</span>
              </div>
              <div className="progress-bar">
                <div style={{ height: '100%', borderRadius: 99, background: row.color, width: `${profile.totalSchemes > 0 ? (row.count / profile.totalSchemes) * 100 : 0}%`, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><BarChart2 size={16} /> By Category</p>
          {catEntries.map(([cat, amount]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: catColors[cat] || '#6B7A9A' }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{cat}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: 13 }}>{fmt(amount)}</span>
              </div>
              <div className="progress-bar">
                <div style={{ height: '100%', borderRadius: 99, background: catColors[cat] || '#6B7A9A', width: `${(amount / maxCat) * 100}%`, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recovery funnel */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><PieChart size={16} /> Recovery Funnel</p>
          {[
            { label: 'Total Identified', value: total, pct: 100, color: '#1A2B4A' },
            { label: 'Currently Active', value: recovered, pct: rate, color: '#2ECC71' },
            { label: 'At Risk of Loss', value: atRisk.reduce((s,x)=>s+x.atRiskAmount,0), pct: total > 0 ? Math.round((atRisk.reduce((s,x)=>s+x.atRiskAmount,0)/total)*100) : 0, color: '#E74C3C' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontWeight: 900, color: f.color, fontSize: 13 }}>{f.pct}%</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>{f.label}</p>
                <p style={{ fontWeight: 800, fontSize: 16, color: f.color }}>{fmt(f.value)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div style={{ background: 'linear-gradient(135deg, #EBF5FB, #E8F8F5)', border: '1px solid #AED6F1', borderRadius: 16, padding: 16 }}>
          <p style={{ fontWeight: 700, color: '#1A5276', marginBottom: 6 }}>💡 Key Insight</p>
          <p style={{ fontSize: 13, color: '#1A5276', lineHeight: 1.6 }}>
            {atRisk.length > 0
              ? `Acting on your ${atRisk.length} at-risk scheme${atRisk.length > 1 ? 's' : ''} could recover ${fmt(atRisk.reduce((s,x)=>s+x.atRiskAmount,0))} before their deadlines.`
              : `All your schemes are active. Your recovery rate of ${rate}% is excellent!`
            }
          </p>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
