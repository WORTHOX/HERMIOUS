import React from 'react';
import { Profile, fmt, getProfiles, saveProfiles } from '../data';
import { Bell, TrendingUp, AlertTriangle, ChevronRight, Plus, RefreshCw } from 'lucide-react';

interface Props { profile: Profile; onSchemeClick: (id: string) => void; onAddScheme: () => void; onRefresh: () => void; }

export default function DashboardScreen({ profile, onSchemeClick, onAddScheme, onRefresh }: Props) {
  const atRisk = profile.schemes.filter(s => s.status === 'at_risk');
  const active = profile.schemes.filter(s => s.status === 'active');
  const recovered = profile.schemes.filter(s => s.status === 'expired').length;

  return (
    <div className="screen fade-in">
      {/* Header */}
      <div className="gradient-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="H" style={{ width: 26, height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 2.5 }}>HERMIOUS</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onRefresh} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><RefreshCw size={16} /></button>
            <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><Bell size={16} /></button>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 2 }}>Welcome back,</p>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{profile.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 }}>{profile.company}</p>

        {/* Hero stat */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px', marginTop: 20, border: '1px solid rgba(255,255,255,0.12)' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>Total Potential Recovery</p>
          <p style={{ color: '#2ECC71', fontSize: 32, fontWeight: 900, marginTop: 4 }}>{fmt(profile.potentialRecovery)}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{profile.totalSchemes}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Schemes</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#F39C12', fontSize: 18, fontWeight: 800 }}>{profile.atRiskSchemes}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>At Risk</p>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#2ECC71', fontSize: 18, fontWeight: 800 }}>{active.length}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Active</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Alert banner */}
        {atRisk.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #FEF9E7, #FDEBD0)', border: '1px solid #F39C12', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={20} color="#E67E22" />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#B7770D' }}>{atRisk.length} scheme{atRisk.length > 1 ? 's' : ''} at risk!</p>
              <p style={{ fontSize: 12, color: '#B7770D', marginTop: 2 }}>Action required to avoid losing {fmt(atRisk.reduce((s, x) => s + x.atRiskAmount, 0))}</p>
            </div>
          </div>
        )}

        {/* Stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'At Risk Amount', value: fmt(atRisk.reduce((s, x) => s + x.atRiskAmount, 0)), color: '#E74C3C', bg: '#FDEDEC' },
            { label: 'Recovery Rate', value: `${Math.round((active.length / Math.max(profile.totalSchemes, 1)) * 100)}%`, color: '#2ECC71', bg: '#EAFAF1' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recovery Progress</span>
            <span style={{ color: 'var(--green-light)', fontWeight: 700, fontSize: 14 }}>{Math.round((active.length / Math.max(profile.totalSchemes, 1)) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round((active.length / Math.max(profile.totalSchemes, 1)) * 100)}%` }} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 8 }}>{active.length} of {profile.totalSchemes} schemes active</p>
        </div>

        {/* At-risk list */}
        {atRisk.length > 0 && (
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>⚠️ Needs Attention</p>
            <div className="card">
              {atRisk.slice(0, 3).map(s => (
                <div key={s.id} className="list-item" onClick={() => onSchemeClick(s.id)}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FDEDEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertTriangle size={18} color="#E74C3C" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                    <p style={{ color: '#E74C3C', fontSize: 12, marginTop: 2 }}>Due: {new Date(s.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <p style={{ fontWeight: 800, color: '#E74C3C', fontSize: 14, flexShrink: 0 }}>{fmt(s.atRiskAmount)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active schemes */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontWeight: 700, fontSize: 16 }}>Active Schemes</p>
            <button onClick={onAddScheme} style={{ background: 'var(--primary)', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="card">
            {active.length === 0 && <p style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)' }}>No active schemes</p>}
            {active.slice(0, 4).map(s => (
              <div key={s.id} className="list-item" onClick={() => onSchemeClick(s.id)}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EAFAF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TrendingUp size={18} color="#27AE60" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{s.provider}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, color: '#27AE60', fontSize: 14 }}>{fmt(s.expectedBenefit)}</p>
                  <ChevronRight size={16} color="var(--text-secondary)" style={{ marginTop: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
