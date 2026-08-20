import React, { useState } from 'react';
import type { Profile } from '../data';
import { fmt, deleteScheme } from '../data';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle, Clock, Tag, Pencil } from 'lucide-react';

interface Props { profile: Profile; schemeId: string; onBack: () => void; onDelete: () => void; onEdit: () => void; }

export default function SchemeDetailScreen({ profile, schemeId, onBack, onDelete, onEdit }: Props) {
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

  const statusConfig = {
    active: { label: 'Active', icon: <CheckCircle size={14} />, cls: 'badge-green' },
    at_risk: { label: 'At Risk', icon: <AlertTriangle size={14} />, cls: 'badge-red' },
    expired: { label: 'Expired', icon: <Clock size={14} />, cls: 'badge-amber' },
  };
  const sc = statusConfig[scheme!.status];

  function handleDelete() {
    if (window.confirm(`Delete "${scheme!.name}"?`)) {
      deleteScheme(profile.id, scheme!.id);
      setDeleted(true);
      onDelete();
    }
  }

  const daysLeft = Math.ceil((new Date(scheme.dueDate).getTime() - Date.now()) / 86400000);

  return (
    <div className="screen fade-in">
      <div className="gradient-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onEdit} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}><Pencil size={16} /></button>
            <button onClick={handleDelete} style={{ background: 'rgba(231,76,60,0.2)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fc8181' }}><Trash2 size={16} /></button>
          </div>
        </div>
        <span className={`badge ${sc.cls}`} style={{ marginBottom: 10 }}>{sc.icon}&nbsp;{sc.label}</span>
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>{scheme.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 }}>{scheme.provider}</p>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Amount cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="stat-card">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Expected Benefit</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#27AE60' }}>{fmt(scheme.expectedBenefit)}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
              {scheme.status === 'at_risk' ? 'At Risk Amount' : 'Days Left'}
            </p>
            <p style={{ fontSize: 22, fontWeight: 900, color: scheme.status === 'at_risk' ? '#E74C3C' : 'var(--primary)' }}>
              {scheme.status === 'at_risk' ? fmt(scheme.atRiskAmount) : `${Math.max(0, daysLeft)}d`}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { label: 'Category', value: scheme.category, icon: <Tag size={16} /> },
            { label: 'Due Date', value: new Date(scheme.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: <Clock size={16} /> },
            { label: 'Status', value: sc.label, icon: sc.icon },
          ].map(row => (
            <div key={row.label} className="list-item" style={{ cursor: 'default' }}>
              <div style={{ color: 'var(--text-secondary)' }}>{row.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{row.label}</p>
                <p style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>About this Scheme</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{scheme.description}</p>
        </div>

        {/* Action button */}
        {scheme.status === 'at_risk' && (
          <div style={{ background: 'linear-gradient(135deg, #FDEDEC, #FEF9E7)', border: '1px solid #F5CBA7', borderRadius: 16, padding: 16 }}>
            <p style={{ fontWeight: 700, color: '#B7770D', marginBottom: 8 }}>⚡ Urgent Action Required</p>
            <p style={{ fontSize: 13, color: '#B7770D', marginBottom: 14, lineHeight: 1.5 }}>This scheme expires on {new Date(scheme.dueDate).toLocaleDateString('en-IN')}. You risk losing {fmt(scheme.atRiskAmount)}.</p>
            <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #E67E22, #E74C3C)' }}>Take Action Now</button>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
