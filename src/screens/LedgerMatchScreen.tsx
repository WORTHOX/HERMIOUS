import React, { useState } from 'react';
import type { Profile } from '../data';
import { fmt } from '../data';
import { ArrowLeft, Filter } from 'lucide-react';

interface Props {
  profile: Profile;
  schemeId: string;
  onBack: () => void;
}

type LedgerTab = 'summary' | 'transactions';

// Mock transactions
const MOCK_TRANSACTIONS = [
  { id: 't1', date: '05 Oct 2024', desc: 'Purchase Invoice #1234', debit: 185000, credit: 0 },
  { id: 't2', date: '12 Oct 2024', desc: 'Purchase Invoice #1235', debit: 210000, credit: 0 },
  { id: 't3', date: '18 Oct 2024', desc: 'Purchase Invoice #1236', debit: 155000, credit: 0 },
  { id: 't4', date: '22 Oct 2024', desc: 'Purchase Invoice #1237', debit: 183333, credit: 0 },
  { id: 't5', date: '28 Oct 2024', desc: 'Credit Note Applied', debit: 0, credit: 0, note: 'Pending' },
];

export default function LedgerMatchScreen({ profile, schemeId, onBack }: Props) {
  const [tab, setTab] = useState<LedgerTab>('summary');
  const scheme = profile.schemes.find(s => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Scheme not found</p>
      </div>
    );
  }

  const { ledger } = scheme;

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
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Ledger Match</h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Tab switcher bar */}
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['summary', 'transactions'] as LedgerTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, fontWeight: 700,
                fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                background: tab === t ? '#27AE60' : 'var(--bg)',
                color: tab === t ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 32 }}>

        {/* Scheme header row */}
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{scheme.name}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{scheme.dateRange}</p>
        </div>

        {tab === 'summary' ? (
          <>
            {/* Expected / Credited / Gap */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
                {[
                  { label: 'Expected', value: fmt(ledger.expected), color: 'var(--text-primary)' },
                  { label: 'Credited', value: fmt(ledger.credited), color: '#27AE60' },
                  { label: 'Gap', value: fmt(ledger.gap), color: ledger.gap > 0 ? '#E74C3C' : '#27AE60' },
                ].map((col, i) => (
                  <div key={col.label} style={{ padding: '12px 10px', borderRight: i < 2 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{col.label}</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: col.color, marginTop: 4 }}>{col.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Breakdown */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <p style={{ padding: '14px 16px', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--border)' }}>Match Breakdown</p>
              {ledger.breakdown.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '11px 16px', borderBottom: i < ledger.breakdown.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <p style={{ fontSize: 13, color: row.highlight ? '#E74C3C' : 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: row.highlight ? '#E74C3C' : 'var(--text-primary)' }}>
                    {typeof row.amount === 'number' && row.amount > 999 ? fmt(row.amount) : row.amount === 0 ? '₹0' : `${row.amount}`}
                  </p>
                </div>
              ))}
            </div>

            {/* Gap Reason (AI Insight) */}
            {ledger.gapReason && (
              <div style={{ background: '#FFFBF0', border: '1px solid #F5E6A3', borderRadius: 14, padding: '14px 16px' }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 8 }}>Gap Reason (AI Insight)</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ledger.gapReason}</p>
                {ledger.shortfall && (
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E74C3C', marginTop: 8 }}>{ledger.shortfall}</p>
                )}
              </div>
            )}

            {/* View Transactions CTA */}
            <button
              onClick={() => setTab('transactions')}
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)', marginTop: 4 }}
            >
              View Transactions
            </button>
          </>
        ) : (
          <>
            {/* Transactions list */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 14px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>DATE</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center' }}>DEBIT</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>CREDIT</p>
              </div>
              {MOCK_TRANSACTIONS.map((tx, i) => (
                <div key={tx.id} style={{ borderBottom: i < MOCK_TRANSACTIONS.length - 1 ? '1px solid var(--border)' : 'none', padding: '12px 14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{tx.date}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#E74C3C', textAlign: 'center' }}>
                      {tx.debit > 0 ? fmt(tx.debit) : '—'}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: tx.credit > 0 ? '#27AE60' : 'var(--text-secondary)', textAlign: 'right' }}>
                      {tx.credit > 0 ? fmt(tx.credit) : tx.note || '—'}
                    </p>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{tx.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
