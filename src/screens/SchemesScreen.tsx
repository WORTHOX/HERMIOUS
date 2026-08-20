import React, { useState } from 'react';
import { Profile, Scheme, fmt } from '../data';
import { Search, Filter, TrendingUp, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

interface Props { profile: Profile; onSchemeClick: (id: string) => void; }

export default function SchemesScreen({ profile, onSchemeClick }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'at_risk' | 'expired'>('all');

  const filtered = profile.schemes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const icon = (status: Scheme['status']) => {
    if (status === 'active') return <TrendingUp size={18} color="#27AE60" />;
    if (status === 'at_risk') return <AlertTriangle size={18} color="#E74C3C" />;
    return <Clock size={18} color="#F39C12" />;
  };
  const bg = (status: Scheme['status']) => status === 'active' ? '#EAFAF1' : status === 'at_risk' ? '#FDEDEC' : '#FEF9E7';
  const amountColor = (status: Scheme['status']) => status === 'active' ? '#27AE60' : status === 'at_risk' ? '#E74C3C' : '#B7770D';

  return (
    <div className="screen fade-in">
      <div className="gradient-header">
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>Schemes</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>{profile.totalSchemes} schemes · {profile.atRiskSchemes} at risk</p>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Search */}
        <div className="input-group" style={{ marginBottom: 12 }}>
          <span className="input-icon"><Search size={18} /></span>
          <input placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {(['all', 'active', 'at_risk', 'expired'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 99, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer', background: filter === f ? 'var(--primary)' : 'var(--card)', color: filter === f ? '#fff' : 'var(--text-secondary)', boxShadow: filter === f ? '0 2px 8px rgba(26,43,74,0.2)' : 'none', transition: 'all 0.2s' }}>
              {f === 'all' ? 'All' : f === 'at_risk' ? 'At Risk' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>No schemes found</p>
          </div>
        ) : (
          <div className="card">
            {filtered.map(s => (
              <div key={s.id} className="list-item" onClick={() => onSchemeClick(s.id)}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: bg(s.status), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon(s.status)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 2 }}>{s.provider} · {s.category}</p>
                  <p style={{ fontSize: 11, marginTop: 3, color: s.status === 'at_risk' ? '#E74C3C' : 'var(--text-secondary)' }}>Due: {new Date(s.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, color: amountColor(s.status), fontSize: 14 }}>{fmt(s.expectedBenefit)}</p>
                  <ChevronRight size={14} color="var(--text-secondary)" style={{ marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
