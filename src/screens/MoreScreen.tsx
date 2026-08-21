import React from 'react';
import { Profile, fmt } from '../data';
import { ChevronRight, User, Building2, Tag, HelpCircle, Shield, LogOut } from 'lucide-react';

interface Props { profile: Profile; onLogout: () => void; }

export default function MoreScreen({ profile, onLogout }: Props) {
  const menuItems = [
    { icon: <User size={20} />, label: 'Account Settings', value: '', action: () => alert('Coming soon') },
    { icon: <Building2 size={20} />, label: 'My Brands', value: `${profile.brands} Brands`, action: () => alert('Coming soon') },
    { icon: <Tag size={20} />, label: 'Subscription', value: profile.subscription, action: () => alert('Coming soon') },
    { icon: <HelpCircle size={20} />, label: 'Help & Support', value: '', action: () => alert('Coming soon') },
    { icon: <Shield size={20} />, label: 'Privacy Policy', value: '', action: () => alert('Coming soon') },
  ];

  return (
    <div className="screen fade-in" style={{ background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center' }}>More</h2>
      </div>

      {/* Profile Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#fff' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, color: '#fff', fontSize: 18,
        }}>
          {profile.avatar}
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{profile.name}</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{profile.company}</p>
        </div>
      </div>

      {/* Menu List */}
      <div style={{ margin: '8px 0', background: '#fff', borderTop: '1px solid var(--border)' }}>
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px', border: 'none', borderBottom: '1px solid var(--border)',
              background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>{item.icon}</span>
            <p style={{ flex: 1, fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{item.label}</p>
            {item.value && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginRight: 4 }}>{item.value}</p>
            )}
            <ChevronRight size={16} color="var(--text-secondary)" />
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px', border: 'none', borderBottom: 'none',
            background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          }}
        >
          <LogOut size={20} color="#E74C3C" />
          <p style={{ flex: 1, fontWeight: 700, fontSize: 15, color: '#E74C3C' }}>Logout</p>
          <ChevronRight size={16} color="#E74C3C" />
        </button>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Version 1.0.0</p>
        <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>H</span>
        </div>
      </div>
    </div>
  );
}
