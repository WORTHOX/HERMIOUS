import React, { useState } from 'react';
import { Profile, Scheme, fmt } from '../data';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  profile: Profile;
  onSchemeClick: (id: string) => void;
  onAddScheme: () => void;
}

type Filter = 'all' | 'active' | 'completed';

export default function SchemesScreen({ profile, onSchemeClick, onAddScheme }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const allSchemes = profile.schemes;
  const filtered = allSchemes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.brand.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && (s.status === 'active' || s.status === 'at_risk')) ||
      (filter === 'completed' && s.status === 'completed');
    return matchSearch && matchFilter;
  });

  const counts = {
    all: allSchemes.length,
    active: allSchemes.filter(s => s.status === 'active' || s.status === 'at_risk').length,
    completed: allSchemes.filter(s => s.status === 'completed').length,
  };

  const TABS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'active', label: `Active (${counts.active})` },
    { key: 'completed', label: `Completed (${counts.completed})` },
  ];

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 20px 12px', background: '#fff' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Schemes</h2>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <SlidersHorizontal size={20} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 0' }}>
        <div style={{ position: 'relative', marginBottom: 0 }}>
          <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search schemes, brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 40px',
              border: '1.5px solid var(--border)', borderRadius: 12,
              fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)',
              background: 'var(--bg)', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Underline Tabs */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border)', margin: '12px 16px 0', gap: 0 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: filter === t.key ? '2.5px solid #27AE60' : '2.5px solid transparent',
              marginBottom: -1.5,
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              background: 'none',
              color: filter === t.key ? '#27AE60' : 'var(--text-secondary)',
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap', fontFamily: 'inherit',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scheme Cards */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>No schemes found</p>
          </div>
        ) : (
          filtered.map(s => <SchemeCard key={s.id} scheme={s} onClick={() => onSchemeClick(s.id)} />)
        )}
      </div>
    </div>
  );
}

function SchemeCard({ scheme: s, onClick }: { scheme: Scheme; onClick: () => void }) {
  const statusBg = s.status === 'at_risk' ? '#FFF4F4' : s.status === 'active' ? '#F0FFF4' : '#F5F5F5';
  const statusBorder = s.status === 'at_risk' ? '#FFCCCC' : s.status === 'active' ? '#C3F0D0' : '#E0E0E0';
  const badgeBg = s.status === 'at_risk' ? '#FEF3CD' : s.status === 'active' ? '#DCFCE7' : '#F0F0F0';
  const badgeColor = s.status === 'at_risk' ? '#D97706' : s.status === 'active' ? '#16A34A' : '#6B7280';
  const badgeLabel = s.status === 'at_risk' ? 'At Risk' : s.status === 'active' ? 'Active' : 'Completed';

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: 14, border: `1px solid ${statusBorder}`,
        padding: '14px 16px', cursor: 'pointer',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        transition: 'transform 0.15s',
      }}
    >
      {/* Top row: brand logo + name + date + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Brand logo */}
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: s.brandColor + '15', border: `1.5px solid ${s.brandColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: s.brandInitials.length > 2 ? 9 : 12, fontWeight: 900, color: s.brandColor, letterSpacing: -0.5 }}>
            {s.brandInitials}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.3, paddingRight: 8 }}>{s.name}</p>
            <span style={{ background: badgeBg, color: badgeColor, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {badgeLabel}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{s.dateRange}</p>
        </div>
      </div>

      {/* Target + Recovery row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Target</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{s.targetLabel}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Recovery</p>
          <p style={{ fontSize: 15, fontWeight: 800, color: s.status === 'at_risk' ? '#E74C3C' : '#27AE60', marginTop: 2 }}>
            {fmt(s.expectedBenefit)}
          </p>
        </div>
      </div>
    </div>
  );
}
