import React, { useState } from 'react';
import { DEMO_PASSWORD, INITIAL_PROFILES, Profile } from '../data';
import { Lock, Phone, Eye, EyeOff, TrendingUp } from 'lucide-react';

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
    <div className="screen" style={{ background: 'linear-gradient(160deg, #1A2B4A 0%, #2D4A8A 60%, #1A2B4A 100%)', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }} className="fade-in">
        <div style={{ width: 88, height: 88, background: 'rgba(255,255,255,0.12)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <img src="/logo.png" alt="HERMIOUS" style={{ width: 60, height: 60, objectFit: 'contain' }} />
        </div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: 3 }}>HERMIOUS</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }}>Recover Every Rupee · Protect Every Margin</p>
      </div>

      {step === 'select' ? (
        <div className="fade-in">
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, marginBottom: 14, textAlign: 'center', letterSpacing: 0.5 }}>SELECT YOUR PROFILE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {profiles.map(p => (
              <div key={p.id} onClick={() => handleSelect(p)} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #2ECC71, #27AE60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16, flexShrink: 0 }}>{p.avatar}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{p.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 }}>{p.company}</p>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>›</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <button onClick={() => { setStep('select'); setPassword(''); setError(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>

          {/* Selected profile */}
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #2ECC71, #27AE60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16 }}>{selected?.avatar}</div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700 }}>{selected?.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{selected?.company}</p>
            </div>
          </div>

          <div className="input-group">
            <span className="input-icon"><Lock size={18} /></span>
            <input type={showPw ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ paddingRight: 48 }} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A9A' }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p style={{ color: '#fc8181', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

          <button className="btn-primary" onClick={handleLogin} style={{ marginBottom: 12 }}>Login</button>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, textAlign: 'center' }}>Demo password: hermious123</p>
        </div>
      )}
    </div>
  );
}
