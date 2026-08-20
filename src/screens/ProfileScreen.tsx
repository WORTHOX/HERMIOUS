import React from 'react';
import { Profile, fmt } from '../data';
import { User, Building2, Phone, FileText, Shield, LogOut, ChevronRight, TrendingUp } from 'lucide-react';

interface Props { profile: Profile; onLogout: () => void; }

export default function ProfileScreen({ profile, onLogout }: Props) {
  const completionRate = Math.round((profile.totalSchemes > 0 ? (profile.totalSchemes - profile.atRiskSchemes) / profile.totalSchemes : 0) * 100);

  return (
    <div className="screen fade-in">
      <div className="gradient-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #2ECC71, #27AE60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 24, flexShrink: 0 }}>
            {profile.avatar}
          </div>
          <div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{profile.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>{profile.company}</p>
            <span className="badge badge-green" style={{ marginTop: 6 }}>Verified Business</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Schemes', value: profile.totalSchemes, color: 'var(--primary)' },
            { label: 'At Risk', value: profile.atRiskSchemes, color: '#E74C3C' },
            { label: 'Recovery', value: fmt(profile.potentialRecovery), color: '#27AE60' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 700 }}>Compliance Score</span>
            <span style={{ fontWeight: 800, color: '#27AE60', fontSize: 18 }}>{completionRate}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 8 }}>
            {completionRate >= 80 ? '🌟 Excellent compliance record!' : completionRate >= 50 ? '📈 Good progress, keep improving' : '⚠️ Action needed on multiple schemes'}
          </p>
        </div>

        {/* Business Info */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <p style={{ padding: '14px 16px 0', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>BUSINESS DETAILS</p>
          {[
            { icon: <Building2 size={18} />, label: 'Company', value: profile.company },
            { icon: <Phone size={18} />, label: 'Phone', value: profile.phone },
            { icon: <FileText size={18} />, label: 'GST Number', value: profile.gst },
          ].map(row => (
            <div key={row.label} className="list-item" style={{ cursor: 'default' }}>
              <div style={{ color: 'var(--text-secondary)' }}>{row.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{row.label}</p>
                <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <p style={{ padding: '14px 16px 0', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>QUICK ACTIONS</p>
          {[
            { icon: <Shield size={18} />, label: 'Data Privacy Settings', color: 'var(--primary)' },
            { icon: <TrendingUp size={18} />, label: 'Export Scheme Report', color: '#27AE60' },
          ].map(a => (
            <div key={a.label} className="list-item" onClick={() => alert('Coming soon!')}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>{a.icon}</div>
              <p style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{a.label}</p>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={onLogout} style={{ width: '100%', padding: '16px', background: '#FDEDEC', border: '1.5px solid #FADBD8', borderRadius: 16, color: '#E74C3C', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <LogOut size={18} /> Sign Out
        </button>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
