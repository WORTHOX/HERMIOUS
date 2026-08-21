import React, { useState } from 'react';
import type { Profile } from '../data';
import { fmt, deleteScheme } from '../data';
import { ArrowLeft, Share2, FileText } from 'lucide-react';

interface Props {
  profile: Profile;
  schemeId: string;
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onLedger: (schemeId: string) => void;
  onClaim: (schemeId: string) => void;
}

// SVG Donut Ring component
function DonutRing({ pct, size = 120 }: { pct: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;
  const isAtRisk = pct < 95;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0F0F0" strokeWidth={10} />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={isAtRisk ? '#F39C12' : '#27AE60'}
        strokeWidth={10}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="900" fill={isAtRisk ? '#F39C12' : '#27AE60'}>
        {pct}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6B7A9A">
        achieved
      </text>
    </svg>
  );
}

export default function SchemeDetailScreen({ profile, schemeId, onBack, onDelete, onEdit, onLedger, onClaim }: Props) {
  const scheme = profile.schemes.find(s => s.id === schemeId);
  const [deleted, setDeleted] = useState(false);

  if (!scheme || deleted) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Scheme not found</p>
        <button className="btn-primary" onClick={onBack} style={{ marginTop: 16, width: 'auto', padding: '12px 24px' }}>Go Back</button>
      </div>
    );
  }

  function handleDelete() {
    if (window.confirm(`Delete "${scheme!.name}"?`)) {
      deleteScheme(profile.id, scheme!.id);
      setDeleted(true);
      onDelete();
    }
  }

  const badgeBg = scheme.status === 'at_risk' ? '#FEF3CD' : scheme.status === 'active' ? '#DCFCE7' : '#F0F0F0';
  const badgeColor = scheme.status === 'at_risk' ? '#D97706' : scheme.status === 'active' ? '#16A34A' : '#6B7280';
  const badgeLabel = scheme.status === 'at_risk' ? 'At Risk' : scheme.status === 'active' ? 'Active' : 'Completed';

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '52px 16px 16px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={22} color="var(--text-primary)" />
          </button>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Scheme Details</h2>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Share2 size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Brand + name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: scheme.brandColor + '15', border: `2px solid ${scheme.brandColor}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: scheme.brandInitials.length > 2 ? 9 : 13, fontWeight: 900, color: scheme.brandColor }}>
              {scheme.brandInitials}
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.3 }}>{scheme.name}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 3 }}>{scheme.dateRange}</p>
            <span style={{ display: 'inline-block', marginTop: 6, background: badgeBg, color: badgeColor, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
              {badgeLabel}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>

        {/* Scheme Summary table */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <p style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--border)' }}>Scheme Summary</p>
          {[
            { label: 'Primary Target', value: scheme.targetLabel, color: 'var(--text-primary)' },
            { label: 'Achieved', value: `${scheme.achieved} ${scheme.targetUnit}`, color: scheme.achievedPct < 100 ? '#E74C3C' : '#27AE60' },
            { label: 'Offer', value: scheme.offer, color: 'var(--text-primary)' },
            { label: 'Valid Upto', value: new Date(scheme.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), color: 'var(--text-primary)' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, flex: 1 }}>{row.label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: row.color, textAlign: 'right', flex: 1.2 }}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Your Performance — donut ring */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: '14px 16px' }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Your Performance</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <DonutRing pct={scheme.achievedPct} size={110} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Expected Benefit</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#27AE60', marginTop: 2 }}>{fmt(scheme.expectedBenefit)}</p>
              <div style={{ height: 12 }} />
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>At Risk Amount</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: scheme.atRiskAmount > 0 ? '#E74C3C' : '#27AE60', marginTop: 2 }}>
                {scheme.atRiskAmount > 0 ? fmt(scheme.atRiskAmount) : '₹0'}
              </p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, textAlign: 'center' }}>
            {scheme.achieved} / {scheme.target} {scheme.targetUnit}
          </p>
        </div>

        {/* Documents */}
        {scheme.documents.length > 0 && (
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Documents</p>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
              {scheme.documents.map(doc => (
                <div key={doc.id} style={{
                  flexShrink: 0, width: 80, background: '#F8F9FA', borderRadius: 10,
                  border: '1px solid var(--border)', padding: 10, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <FileText size={22} color="var(--text-secondary)" />
                  <p style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.2 }}>{doc.name}</p>
                  <p style={{ fontSize: 8, color: '#B0B8CC' }}>{doc.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => onLedger(scheme.id)}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, var(--primary), #2D4A8A)' }}
          >
            View Ledger Match
          </button>
          <button
            onClick={() => onClaim(scheme.id)}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)' }}
          >
            View Claim Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
