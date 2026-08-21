import React, { useState } from 'react';
import type { Profile } from './data';
import { getProfileById } from './data';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SchemesScreen from './screens/SchemesScreen';
import SchemeDetailScreen from './screens/SchemeDetailScreen';
import AddSchemeScreen from './screens/AddSchemeScreen';
import AllSchemesOverviewScreen from './screens/AllSchemesOverviewScreen';
import LedgerMatchScreen from './screens/LedgerMatchScreen';
import ClaimDossierScreen from './screens/ClaimDossierScreen';
import MoreScreen from './screens/MoreScreen';
import { LayoutDashboard, List, BookOpen, FileText, MoreHorizontal } from 'lucide-react';

type Tab = 'dashboard' | 'schemes' | 'ledger' | 'claims' | 'more';

type NavState =
  | { screen: 'login' }
  | { screen: 'main'; tab: Tab }
  | { screen: 'schemeDetail'; schemeId: string; fromTab: Tab }
  | { screen: 'ledgerMatch'; schemeId: string; fromTab: Tab }
  | { screen: 'claimDossier'; schemeId: string; fromTab: Tab }
  | { screen: 'addScheme' }
  | { screen: 'allOverview' };

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
    const fromTab = nav.screen === 'main' ? nav.tab : 'schemes';
    setNav({ screen: 'schemeDetail', schemeId: id, fromTab });
  }

  function openLedger(schemeId: string) {
    const fromTab = nav.screen === 'schemeDetail' ? nav.fromTab : 'ledger';
    setNav({ screen: 'ledgerMatch', schemeId, fromTab });
  }

  function openClaim(schemeId: string) {
    const fromTab = nav.screen === 'schemeDetail' ? nav.fromTab : 'claims';
    setNav({ screen: 'claimDossier', schemeId, fromTab });
  }

  // ── Render full-screen modals (no tab bar) ──
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
          onEdit={() => {}}
          onLedger={(id) => openLedger(id)}
          onClaim={(id) => openClaim(id)}
        />
      </div>
    );
  }

  if (nav.screen === 'ledgerMatch') {
    return (
      <div className="app-shell">
        <LedgerMatchScreen
          profile={profile}
          schemeId={nav.schemeId}
          onBack={() => setNav({ screen: 'schemeDetail', schemeId: nav.schemeId, fromTab: nav.fromTab })}
        />
      </div>
    );
  }

  if (nav.screen === 'claimDossier') {
    return (
      <div className="app-shell">
        <ClaimDossierScreen
          profile={profile}
          schemeId={nav.schemeId}
          onBack={() => setNav({ screen: 'schemeDetail', schemeId: nav.schemeId, fromTab: nav.fromTab })}
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

  if (nav.screen === 'allOverview') {
    return (
      <div className="app-shell">
        <AllSchemesOverviewScreen profile={profile} onBack={() => setNav({ screen: 'main', tab: 'dashboard' })} />
      </div>
    );
  }

  // ── Main tab layout ──
  const tab = nav.tab;

  // For Ledger/Claims tabs, we need to pick a scheme to show
  // Default to first at-risk scheme, or first scheme
  const defaultScheme = profile.schemes.find(s => s.status === 'at_risk') || profile.schemes[0];

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'schemes', label: 'Schemes', icon: <List size={20} /> },
    { id: 'ledger', label: 'Ledger Match', icon: <BookOpen size={20} /> },
    { id: 'claims', label: 'Claims', icon: <FileText size={20} /> },
    { id: 'more', label: 'More', icon: <MoreHorizontal size={20} /> },
  ];

  return (
    <div className="app-shell">
      {/* Screen content */}
      {tab === 'dashboard' && (
        <DashboardScreen
          profile={profile}
          onSchemeClick={openScheme}
          onAddScheme={() => setNav({ screen: 'addScheme' })}
          onRefresh={refreshProfile}
        />
      )}
      {tab === 'schemes' && (
        <SchemesScreen
          profile={profile}
          onSchemeClick={openScheme}
          onAddScheme={() => setNav({ screen: 'addScheme' })}
        />
      )}
      {tab === 'ledger' && defaultScheme && (
        <LedgerMatchScreen
          profile={profile}
          schemeId={defaultScheme.id}
          onBack={() => goTab('dashboard')}
        />
      )}
      {tab === 'claims' && defaultScheme && (
        <ClaimDossierScreen
          profile={profile}
          schemeId={defaultScheme.id}
          onBack={() => goTab('dashboard')}
        />
      )}
      {tab === 'more' && (
        <MoreScreen profile={profile} onLogout={handleLogout} />
      )}

      {/* 5-tab Bottom Navigation */}
      <nav className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => goTab(t.id)}
            style={{ fontSize: 9 }}
          >
            {t.icon}
            <span>{t.label}</span>
            {tab === t.id && <div className="tab-dot" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
