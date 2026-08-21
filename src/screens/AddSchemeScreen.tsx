import React, { useRef, useState } from 'react';
import type { Profile } from '../data';
import { ArrowLeft, Upload, MessageCircle } from 'lucide-react';

interface Props {
  profile: Profile;
  onBack: () => void;
  onSuccess: (updated: Profile) => void;
}

export default function AddSchemeScreen({ profile, onBack, onSuccess }: Props) {
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setUploaded(true);
      // Simulate AI extraction
      setTimeout(() => {
        alert(`AI extracted scheme details from "${f.name}". Review and save to add to your portfolio.`);
      }, 500);
    }
  }

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* Header */}
      <div style={{
        height: 56,
        padding: '0 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        boxSizing: 'border-box',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginRight: 12, display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={22} color="var(--text-primary)" />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Upload Scheme</h2>
      </div>

      <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%', borderRadius: 18, border: '2px dashed #C0CDD8',
            padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            cursor: 'pointer', background: uploaded ? '#F0FFF4' : '#FAFBFC',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 18, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={30} color="#27AE60" strokeWidth={2} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Upload Scheme Document</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
              {uploaded ? `✓ ${fileName}` : 'Upload images, PDFs or\nWhatsApp forwards'}
            </p>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} />

        {/* Choose File button */}
        <button
          onClick={() => fileRef.current?.click()}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)', width: '100%' }}
        >
          Choose File
        </button>

        {/* OR divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>OR</p>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* WhatsApp import */}
        <button
          onClick={() => alert('WhatsApp import coming soon!')}
          style={{
            width: '100%', padding: '14px', border: '1.5px solid var(--border)', borderRadius: 99,
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit',
          }}
        >
          <MessageCircle size={20} color="#25D366" fill="#25D366" />
          Import from WhatsApp
        </button>

        {/* AI info banner */}
        <div style={{ background: '#F0FFF4', border: '1px solid #A8DFBB', borderRadius: 14, padding: '14px 16px', width: '100%', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#27AE60', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>✓</span>
          </div>
          <p style={{ fontSize: 13, color: '#1E5C37', fontWeight: 500, lineHeight: 1.5 }}>
            AI will extract scheme details automatically and match with your ledger.
          </p>
        </div>
      </div>
    </div>
  );
}
