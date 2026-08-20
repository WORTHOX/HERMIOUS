import React, { useState } from 'react';
import { Profile, Scheme, addScheme, getProfileById } from '../data';
import { ArrowLeft, FileText, Upload, CheckCircle } from 'lucide-react';

interface Props { profile: Profile; onBack: () => void; onSuccess: (updated: Profile) => void; }

export default function AddSchemeScreen({ profile, onBack, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('Government');
  const [dueDate, setDueDate] = useState('');
  const [benefit, setBenefit] = useState('');
  const [description, setDescription] = useState('');
  const [saved, setSaved] = useState(false);

  const categories = ['Government', 'Credit', 'Tax', 'Subsidy', 'Funding', 'Market'];

  function handleSave() {
    if (!name || !provider || !dueDate || !benefit) return alert('Please fill all required fields');
    const scheme: Scheme = {
      id: 'sch_' + Date.now(),
      name, provider, category,
      dueDate,
      expectedBenefit: Number(benefit.replace(/[^0-9]/g, '')),
      atRiskAmount: 0,
      status: 'active',
      description: description || 'Custom scheme added by user.',
    };
    addScheme(profile.id, scheme);
    setSaved(true);
    setTimeout(() => {
      const updated = getProfileById(profile.id);
      if (updated) onSuccess(updated);
    }, 1200);
  }

  if (saved) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: 24, background: '#EAFAF1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={36} color="#27AE60" />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 20 }}>Scheme Added!</h3>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Your scheme has been saved successfully.</p>
      </div>
    );
  }

  return (
    <div className="screen fade-in">
      <div className="gradient-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Add Scheme</h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Track a new government scheme or benefit</p>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {[
            { label: 'Scheme Name *', value: name, set: setName, placeholder: 'e.g. MSME Samadhaan Scheme' },
            { label: 'Provider / Authority *', value: provider, set: setProvider, placeholder: 'e.g. Ministry of MSME' },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>{f.label}</p>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg)' }} />
            </div>
          ))}

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Category</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{ padding: '7px 14px', borderRadius: 99, border: '1.5px solid', borderColor: category === c ? 'var(--primary)' : 'var(--border)', background: category === c ? 'var(--primary)' : 'transparent', color: category === c ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Due Date *</p>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg)' }} />
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Expected Benefit (₹) *</p>
            <input type="number" value={benefit} onChange={e => setBenefit(e.target.value)} placeholder="e.g. 50000" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg)' }} />
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Description (optional)</p>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the scheme..." rows={3} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg)', resize: 'none' }} />
          </div>
        </div>

        {/* Upload Doc */}
        <div style={{ border: '2px dashed var(--border)', borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--card)' }}>
          <Upload size={28} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Upload Document (optional)</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>PDF, JPG, PNG · Max 10MB</p>
        </div>

        <button className="btn-primary" onClick={handleSave}>Save Scheme</button>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
