import React, { useState } from 'react';
import type { Profile, Scheme } from '../data';
import { fmt, deleteScheme, updateScheme, getBrandLogo } from '../data';
import { ArrowLeft, Share2, FileText, Pencil, Trash2, X, Check } from 'lucide-react';

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
  const [isEditing, setIsEditing] = useState(false);

  // Form edit states
  const [formName, setFormName] = useState(scheme?.name || '');
  const [formBrand, setFormBrand] = useState(scheme?.brand || '');
  const [formTarget, setFormTarget] = useState(scheme?.target ? String(scheme.target) : '');
  const [formAchieved, setFormAchieved] = useState(scheme?.achieved ? String(scheme.achieved) : '');
  const [formTargetUnit, setFormTargetUnit] = useState(scheme?.targetUnit || 'cases');
  const [formOffer, setFormOffer] = useState(scheme?.offer || '');
  const [formExpectedBenefit, setFormExpectedBenefit] = useState(scheme?.expectedBenefit ? String(scheme.expectedBenefit) : '');
  const [formDueDate, setFormDueDate] = useState(scheme?.dueDate || '');
  const [formStatus, setFormStatus] = useState<'active' | 'at_risk' | 'completed'>(scheme?.status || 'active');

  if (!scheme || deleted) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Scheme not found</p>
        <button className="btn-primary" onClick={onBack} style={{ marginTop: 16, width: 'auto', padding: '12px 24px' }}>Go Back</button>
      </div>
    );
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    const targetNum = Number(formTarget) || scheme!.target;
    const achievedNum = Number(formAchieved) || scheme!.achieved;
    const pct = targetNum > 0 ? Math.min(100, Math.round((achievedNum / targetNum) * 100)) : 0;
    const benefitNum = Number(formExpectedBenefit) || scheme!.expectedBenefit;
    const atRiskNum = formStatus === 'at_risk' ? benefitNum : 0;

    const updates: Partial<Scheme> = {
      name: formName,
      brand: formBrand,
      target: targetNum,
      achieved: achievedNum,
      targetUnit: formTargetUnit,
      targetLabel: `${targetNum} ${formTargetUnit}`,
      achievedPct: pct,
      offer: formOffer,
      expectedBenefit: benefitNum,
      atRiskAmount: atRiskNum,
      dueDate: formDueDate,
      status: formStatus,
    };

    updateScheme(profile.id, scheme!.id, updates);
    setIsEditing(false);
    onEdit();
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
    <div className="screen fade-in" style={{ background: '#fff', position: 'relative' }}>
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
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Scheme Details</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Edit button in header */}
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
            title="Edit Scheme"
          >
            <Pencil size={14} color="var(--text-primary)" />
            Edit
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <Share2 size={20} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Brand + Name Info Bar */}
      <div style={{ padding: '16px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#fff', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            overflow: 'hidden', padding: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            {getBrandLogo(scheme.brand) ? (
              <img src={getBrandLogo(scheme.brand)} alt={scheme.brand} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: scheme.brandInitials.length > 2 ? 9 : 13, fontWeight: 900, color: scheme.brandColor }}>
                {scheme.brandInitials}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.3 }}>{scheme.name}</p>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 3 }}>{scheme.dateRange}</p>
            <span style={{ display: 'inline-block', marginTop: 6, background: badgeBg, color: badgeColor, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
              {badgeLabel}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>

        {/* Scheme Summary Card */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Scheme Summary</p>
            <button
              onClick={() => setIsEditing(true)}
              style={{ background: 'none', border: 'none', color: '#27AE60', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Pencil size={12} /> Edit Details
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Primary Target</span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{scheme.targetLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Achieved</span>
              <span style={{ fontWeight: 700, fontSize: 13, color: scheme.achieved < scheme.target ? '#E74C3C' : '#27AE60' }}>
                {scheme.achieved} {scheme.targetUnit}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, flexShrink: 0 }}>Offer</span>
              <span style={{ fontWeight: 700, fontSize: 13, textAlign: 'right', maxWidth: '60%' }}>{scheme.offer}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Valid Upto</span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{scheme.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Your Performance Card */}
        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Your Performance</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <DonutRing pct={scheme.achievedPct} />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Expected Benefit</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#27AE60', marginTop: 2 }}>{fmt(scheme.expectedBenefit)}</p>
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
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: '13px',
              borderRadius: 12,
              border: '1.5px solid var(--border)',
              background: '#fff',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Pencil size={16} /> Edit Scheme Details
          </button>
        </div>
      </div>

      {/* ── Edit Modal Sheet ── */}
      {isEditing && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'rgba(10, 20, 40, 0.65)', backdropFilter: 'blur(3px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div
            className="fade-in"
            style={{
              background: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '24px 20px 36px',
              maxHeight: '88%',
              overflowY: 'auto',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E8F8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil size={16} color="#27AE60" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Edit Scheme</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Scheme Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      background: '#fff', boxSizing: 'border-box',
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="at_risk">At Risk</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Target</label>
                  <input
                    type="number"
                    value={formTarget}
                    onChange={e => setFormTarget(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Achieved</label>
                  <input
                    type="number"
                    value={formAchieved}
                    onChange={e => setFormAchieved(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Expected Benefit (₹)</label>
                  <input
                    type="number"
                    value={formExpectedBenefit}
                    onChange={e => setFormExpectedBenefit(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Valid Upto</label>
                  <input
                    type="text"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    placeholder="e.g. 2024-10-31"
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 10,
                      border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Offer Description</label>
                <input
                  type="text"
                  value={formOffer}
                  onChange={e => setFormOffer(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10,
                    border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Action buttons in modal */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid var(--border)',
                    background: '#fff', color: 'var(--text-secondary)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2, padding: '13px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #27AE60, #2ECC71)', color: '#fff',
                    fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
                  }}
                >
                  <Check size={16} /> Save Changes
                </button>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: 'none', border: 'none', color: '#E74C3C',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4,
                }}
              >
                <Trash2 size={15} /> Delete Scheme
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
