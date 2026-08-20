import React, { useState } from 'react';
import type { Profile } from './data';
import { getProfileById } from './data';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SchemesScreen from './screens/SchemesScreen';
import SchemeDetailScreen from './screens/SchemeDetailScreen';
import AddSchemeScreen from './screens/AddSchemeScreen';
import EditSchemeScreen from './screens/EditSchemeScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import ProfileScreen from './screens/ProfileScreen';
import { LayoutDashboard, List, BarChart2, User } from 'lucide-react';

type Tab = 'dashboard' | 'schemes' | 'analytics' | 'profile';
type NavState =
  | { screen: 'login' }
  | { screen: 'main'; tab: Tab }
  | { screen: 'schemeDetail'; schemeId: string; fromTab: Tab }
  | { screen: 'editScheme'; schemeId: string; fromTab: Tab }
  | { screen: 'addScheme' };

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nav, setNav] = useState<NavState>({ screen: 'login' });

  function refreshProfile() {
    if (profile) {
      const updated = getProfileById(profile.id);
      if (updated) setProfile(updated);
    }
  }

  function handleLogin(p: Profile) {
    setProfile(p);
    setNav({ screen: 'main', tab: 'dashboard' });
  }

  function handleLogout() {
    setProfile(null);
    setNav({ screen: 'login' });
  }

  function goTab(tab: Tab) {
    setNav({ screen: 'main', tab });
  }

  function openScheme(id: string) {
    const currentTab = nav.screen === 'main' ? nav.tab : 'dashboard';
    setNav({ screen: 'schemeDetail', schemeId: id, fromTab: currentTab });
  }

  function openEdit(schemeId: string) {
    const fromTab = nav.screen === 'schemeDetail' ? nav.fromTab : 'schemes';
    setNav({ screen: 'editScheme', schemeId, fromTab });
  }

  // ── Render ──
  if (nav.screen === 'login' || !profile) {
    return <div className="app-shell"><LoginScreen onLogin={handleLogin} /></div>;
  }

  if (nav.screen === 'schemeDetail') {
    return (
      <div className="app-shell">
        <SchemeDetailScreen
          profile={profile}
          schemeId={nav.schemeId}
          onBack={() => { refreshProfile(); setNav({ screen: 'main', tab: nav.fromTab }); }}
          onDelete={() => { refreshProfile(); setNav({ screen: 'main', tab: nav.fromTab }); }}
          onEdit={() => openEdit(nav.schemeId)}
        />
      </div>
    );
  }

  if (nav.screen === 'editScheme') {
    return (
      <div className="app-shell">
        <EditSchemeScreen
          profile={profile}
          schemeId={nav.schemeId}
          onBack={() => setNav({ screen: 'schemeDetail', schemeId: nav.schemeId, fromTab: nav.fromTab })}
          onSave={(updated) => {
            setProfile(updated);
            setNav({ screen: 'schemeDetail', schemeId: nav.schemeId, fromTab: nav.fromTab });
          }}
        />
      </div>
    );
  }

  if (nav.screen === 'addScheme') {
    return (
      <div className="app-shell">
        <AddSchemeScreen
          profile={profile}
          onBack={() => setNav({ screen: 'main', tab: 'schemes' })}
          onSuccess={(updated) => { setProfile(updated); setNav({ screen: 'main', tab: 'schemes' }); }}
        />
      </div>
    );
  }

  const tab = nav.tab;
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Home', icon: <LayoutDashboard size={22} /> },
    { id: 'schemes' as Tab, label: 'Schemes', icon: <List size={22} /> },
    { id: 'analytics' as Tab, label: 'Analytics', icon: <BarChart2 size={22} /> },
    { id: 'profile' as Tab, label: 'Profile', icon: <User size={22} /> },
  ];

  return (
    <div className="app-shell">
      {tab === 'dashboard' && <DashboardScreen profile={profile} onSchemeClick={openScheme} onAddScheme={() => setNav({ screen: 'addScheme' })} onRefresh={refreshProfile} />}
      {tab === 'schemes' && <SchemesScreen profile={profile} onSchemeClick={openScheme} />}
      {tab === 'analytics' && <AnalyticsScreen profile={profile} />}
      {tab === 'profile' && <ProfileScreen profile={profile} onLogout={handleLogout} />}

      <nav className="tab-bar">
        {tabs.map(t => (
          <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => goTab(t.id)}>
            {t.icon}
            <span>{t.label}</span>
            {tab === t.id && <div className="tab-dot" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
