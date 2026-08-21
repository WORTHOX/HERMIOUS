import React, { useState } from 'react';
import { DEMO_PASSWORD, INITIAL_PROFILES, Profile } from '../data';
import { Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';

interface Props { onLogin: (profile: Profile) => void; }

export default function LoginScreen({ onLogin }: Props) {
  const profiles = INITIAL_PROFILES;
  const [selected, setSelected] = useState<Profile | null>(null);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'select' | 'password'>('select');

  function handleSelect(p: Profile) {
    setSelected(p);
    setStep('password');
    setError('');
  }

  function handleLogin() {
    if (password === DEMO_PASSWORD) {
      onLogin(selected!);
    } else {
      setError('Incorrect password. Try: hermious123');
    }
  }

  return (
    <div className="screen" style={{
      background: '#fff',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 24px 32px',
    }}>
      {/* ── Brand section — large logo + wordmark on white ── */}
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 150, paddingBottom: 32 }}>
        {/* Large H logo mark */}
        <img
          src="/hermious-logo.png"
          alt="Hermious"
          style={{ width: 100, height: 85, objectFit: 'contain', marginBottom: 14 }}
        />
        {/* HERMIOUS wordmark */}
        <img
          src="/hermious-wordmark.png"
          alt="HERMIOUS"
          style={{ height: 30, width: 'auto', objectFit: 'contain', marginBottom: 10 }}
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textAlign: 'center', marginTop: 2 }}>
          Recover Every Rupee · Protect Every Margin
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

      {step === 'select' ? (
        <div className="fade-in" style={{ flex: 1 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Select Your Profile
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {profiles.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  background: '#fff', border: '1.5px solid var(--border)',
                  borderRadius: 16, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 6px rgba(26,43,74,0.06)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#27AE60')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: '#fff', fontSize: 16, flexShrink: 0,
                }}>
                  {p.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15 }}>{p.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{p.company}</p>
                </div>
                <ChevronRight size={18} color="var(--text-secondary)" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fade-in" style={{ flex: 1 }}>
          <button
            onClick={() => { setStep('select'); setPassword(''); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
          >
            ← Back
          </button>

          {/* Selected profile card */}
          <div style={{
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#fff', fontSize: 16,
            }}>
              {selected?.avatar}
            </div>
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{selected?.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{selected?.company}</p>
            </div>
          </div>

          <div className="input-group">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ paddingRight: 48 }}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A9A' }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

          <button className="btn-primary" onClick={handleLogin} style={{ marginBottom: 12 }}>Login</button>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, textAlign: 'center' }}>Demo password: hermious123</p>
        </div>
      )}
    </div>
  );
}
