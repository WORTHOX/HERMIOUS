import React from 'react';
import type { Profile } from '../data';
import { fmt, getBrandLogo } from '../data';
import { ArrowLeft, Share2, CheckCircle } from 'lucide-react';

interface Props {
  profile: Profile;
  schemeId: string;
  onBack: () => void;
}

export default function ClaimDossierScreen({ profile, schemeId, onBack }: Props) {
  const scheme = profile.schemes.find(s => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Scheme not found</p>
      </div>
    );
  }

  const { claimDossier } = scheme;

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* Top Header Bar */}
      <div style={{
        height: 56,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        boxSizing: 'border-box',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={22} color="var(--text-primary)" />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Claim Dossier</h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <Share2 size={20} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Brand + scheme name */}
      <div style={{ padding: '16px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: '#fff', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            overflow: 'hidden', padding: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            {getBrandLogo(scheme.brand) ? (
              <img src={getBrandLogo(scheme.brand)} alt={scheme.brand} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: scheme.brandInitials.length > 2 ? 9 : 12, fontWeight: 900, color: scheme.brandColor }}>
                {scheme.brandInitials}
              </span>
            )}
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{scheme.name}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{scheme.dateRange}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>

        {/* Claim Summary */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <p style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--border)' }}>Claim Summary</p>
          {[
            { label: 'Total Claimable', value: fmt(claimDossier.totalClaimable), color: 'var(--text-primary)' },
            { label: 'Already Credited', value: fmt(claimDossier.alreadyCredited), color: '#27AE60' },
            { label: 'Balance Claim', value: fmt(claimDossier.balanceClaim), color: claimDossier.balanceClaim > 0 ? '#E74C3C' : '#27AE60' },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                background: i === arr.length - 1 ? 'var(--bg)' : '#fff',
              }}
            >
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: row.color }}>{row.value}</p>
            </div>
          ))}
        </div>

        {/* Dossier Includes */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <p style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--border)' }}>Dossier Includes</p>
          {claimDossier.includes.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < claimDossier.includes.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <CheckCircle size={18} color="#27AE60" fill="#27AE60" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item}</p>
            </div>
          ))}
        </div>

        {/* Generate CTA */}
        <button
          className="btn-primary"
          onClick={() => alert('Generating PDF dossier...')}
          style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)', marginTop: 4 }}
        >
          Generate Claim Dossier (PDF)
        </button>
      </div>
    </div>
  );
}
