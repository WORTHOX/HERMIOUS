import React, { useState } from 'react';
import type { Profile, Scheme } from '../data';
import { updateScheme, getProfileById } from '../data';
import { ArrowLeft, CheckCircle, Paperclip, X } from 'lucide-react';

interface Props {
  profile: Profile;
  schemeId: string;
  onBack: () => void;
  onSave: (updated: Profile) => void;
}

export default function EditSchemeScreen({ profile, schemeId, onBack, onSave }: Props) {
  const original = profile.schemes.find(s => s.id === schemeId);

  if (!original) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
        <p>Scheme not found.</p>
      </div>
    );
  }

  const [name, setName] = useState(original.name);
  const [provider, setProvider] = useState(original.provider);
  const [category, setCategory] = useState(original.category);
  const [dueDate, setDueDate] = useState(original.dueDate);
  const [benefit, setBenefit] = useState(String(original.expectedBenefit));
  const [atRiskAmount, setAtRiskAmount] = useState(String(original.atRiskAmount));
  const [status, setStatus] = useState<Scheme['status']>(original.status);
  const [description, setDescription] = useState(original.description);
  const [docName, setDocName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const categories = ['Government', 'Credit', 'Tax', 'Subsidy', 'Funding', 'Market'];
  const statuses: { value: Scheme['status']; label: string; color: string }[] = [
    { value: 'active', label: 'Active', color: '#27AE60' },
    { value: 'at_risk', label: 'At Risk', color: '#E74C3C' },
    { value: 'expired', label: 'Expired', color: '#F39C12' },
  ];

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setDocName(file.name);
  }

  function handleSave() {
    if (!name || !provider || !dueDate || !benefit) {
      alert('Please fill all required fields');
      return;
    }
    updateScheme(profile.id, schemeId, {
      name,
      provider,
      category,
      dueDate,
      expectedBenefit: Number(benefit),
      atRiskAmount: Number(atRiskAmount) || 0,
      status,
      description,
    });
    setSaved(true);
    setTimeout(() => {
      const updated = getProfileById(profile.id);
      if (updated) onSave(updated);
    }, 1000);
  }

  if (saved) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: 24, background: '#EAFAF1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={36} color="#27AE60" />
        </div>
        <h3 style={{ fontWeight: 800, fontSize: 20 }}>Changes Saved!</h3>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Scheme updated successfully.</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid var(--border)', borderRadius: 10,
    fontSize: 15, fontFamily: 'inherit',
    color: 'var(--text-primary)', outline: 'none', background: 'var(--bg)',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700,
    color: 'var(--text-secondary)', marginBottom: 6, display: 'block',
  };

  return (
    <div className="screen fade-in">
      {/* Header */}
      <div className="gradient-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Edit Scheme</h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>Update details, amount, date or attach documents</p>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Main fields */}
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div>
            <label style={labelStyle}>Scheme Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Scheme name" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Provider / Authority *</label>
            <input value={provider} onChange={e => setProvider(e.target.value)} placeholder="Provider" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} style={{ padding: '7px 14px', borderRadius: 99, border: '1.5px solid', borderColor: category === c ? 'var(--primary)' : 'var(--border)', background: category === c ? 'var(--primary)' : 'transparent', color: category === c ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {statuses.map(s => (
                <button key={s.value} onClick={() => setStatus(s.value)} style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: '1.5px solid', borderColor: status === s.value ? s.color : 'var(--border)', background: status === s.value ? s.color + '18' : 'transparent', color: status === s.value ? s.color : 'var(--text-secondary)', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: -4 }}>FINANCIAL DETAILS</p>

          <div>
            <label style={labelStyle}>Expected Benefit (₹) *</label>
            <input type="number" value={benefit} onChange={e => setBenefit(e.target.value)} placeholder="e.g. 50000" style={inputStyle} />
          </div>

          {status === 'at_risk' && (
            <div>
              <label style={labelStyle}>At Risk Amount (₹)</label>
              <input type="number" value={atRiskAmount} onChange={e => setAtRiskAmount(e.target.value)} placeholder="Amount at risk" style={inputStyle} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Due Date *</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Document upload */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📎 Attach Bill / Document</p>
          {docName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#EAFAF1', border: '1px solid #A9DFBF', borderRadius: 12, padding: '12px 14px' }}>
              <Paperclip size={18} color="#27AE60" />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#27AE60', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docName}</span>
              <button onClick={() => setDocName(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E74C3C' }}><X size={16} /></button>
            </div>
          ) : (
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFilePick} style={{ display: 'none' }} />
              <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '20px 16px', textAlign: 'center', transition: 'border-color 0.2s' }}>
                <Paperclip size={24} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 14 }}>Tap to attach bill or document</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>PDF, JPG, PNG · Max 10MB</p>
              </div>
            </label>
          )}
        </div>

        {/* Description */}
        <div className="card" style={{ padding: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'none' }} />
        </div>

        <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
