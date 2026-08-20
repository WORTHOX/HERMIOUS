// ─── Mock Data & Storage ───────────────────────────────────────────
export const DEMO_PASSWORD = 'hermious123';

export interface Scheme {
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'at_risk' | 'expired';
  dueDate: string;
  expectedBenefit: number;
  atRiskAmount: number;
  category: string;
  description: string;
}

export interface Profile {
  id: string;
  name: string;
  company: string;
  phone: string;
  gst: string;
  schemes: Scheme[];
  totalSchemes: number;
  atRiskSchemes: number;
  potentialRecovery: number;
  avatar: string;
}

const MOCK_SCHEMES_RAJESH: Scheme[] = [
  { id: 's1', name: 'MSME Samadhaan Scheme', provider: 'Ministry of MSME', status: 'at_risk', dueDate: '2026-09-15', expectedBenefit: 125000, atRiskAmount: 125000, category: 'Government', description: 'Delayed payment recovery portal for MSME units with overdue payments from buyers.' },
  { id: 's2', name: 'PM SVANidhi Micro Credit', provider: 'Housing & Urban Affairs', status: 'active', dueDate: '2026-11-30', expectedBenefit: 50000, atRiskAmount: 0, category: 'Credit', description: 'Collateral-free working capital loans for street vendors and small retailers.' },
  { id: 's3', name: 'GST ITC Refund', provider: 'GST Council', status: 'at_risk', dueDate: '2026-08-31', expectedBenefit: 78000, atRiskAmount: 78000, category: 'Tax', description: 'Input Tax Credit refund claim for accumulated credit on exports and inverted duty.' },
  { id: 's4', name: 'Udyam Credit Guarantee', provider: 'CGTMSE', status: 'active', dueDate: '2026-12-15', expectedBenefit: 200000, atRiskAmount: 0, category: 'Credit', description: 'Credit guarantee scheme for collateral-free loans to MSME businesses.' },
  { id: 's5', name: 'Interest Subsidy – CLCSS', provider: 'Ministry of MSME', status: 'expired', dueDate: '2026-07-01', expectedBenefit: 35000, atRiskAmount: 35000, category: 'Subsidy', description: 'Capital subsidy for technology upgradation in small-scale industries.' },
];

const MOCK_SCHEMES_PRIYA: Scheme[] = [
  { id: 'p1', name: 'Mudra Loan – Tarun', provider: 'MUDRA Bank', status: 'active', dueDate: '2026-10-20', expectedBenefit: 1000000, atRiskAmount: 0, category: 'Credit', description: 'Loans up to ₹10 lakh for non-farm income-generating activities.' },
  { id: 'p2', name: 'Stand Up India Scheme', provider: 'SIDBI', status: 'at_risk', dueDate: '2026-09-05', expectedBenefit: 500000, atRiskAmount: 500000, category: 'Government', description: 'Bank loans between ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs.' },
  { id: 'p3', name: 'NSIC Raw Material Assist', provider: 'NSIC', status: 'active', dueDate: '2026-11-10', expectedBenefit: 90000, atRiskAmount: 0, category: 'Subsidy', description: 'Assistance for procurement of raw materials from approved suppliers.' },
];

const MOCK_SCHEMES_AMIT: Scheme[] = [
  { id: 'a1', name: 'Startup India Seed Fund', provider: 'DPIIT', status: 'active', dueDate: '2026-10-01', expectedBenefit: 5000000, atRiskAmount: 0, category: 'Funding', description: 'Seed funding for startups for proof of concept, prototype development, and trials.' },
  { id: 'a2', name: 'Atal Innovation Mission', provider: 'NITI Aayog', status: 'at_risk', dueDate: '2026-08-25', expectedBenefit: 250000, atRiskAmount: 250000, category: 'Government', description: 'Support for incubators and innovation hubs across India.' },
  { id: 'a3', name: 'GeM Seller Advantage', provider: 'Govt e-Marketplace', status: 'active', dueDate: '2027-01-15', expectedBenefit: 180000, atRiskAmount: 0, category: 'Market', description: 'Benefits for MSME sellers registered on Government e-Marketplace portal.' },
  { id: 'a4', name: 'RoDTEP Export Scheme', provider: 'Commerce Ministry', status: 'expired', dueDate: '2026-06-30', expectedBenefit: 95000, atRiskAmount: 95000, category: 'Tax', description: 'Remission of duties and taxes on exported products.' },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'raj001',
    name: 'Rajesh Gupta',
    company: 'Shree Ganesh Trading Co.',
    phone: '+91 98765 43210',
    gst: '27AABCS1429B1Z1',
    schemes: MOCK_SCHEMES_RAJESH,
    totalSchemes: 5,
    atRiskSchemes: 2,
    potentialRecovery: 488000,
    avatar: 'RG',
  },
  {
    id: 'pri002',
    name: 'Priya Sharma',
    company: 'Lakshmi Distributors Pvt. Ltd.',
    phone: '+91 87654 32109',
    gst: '07AAACL1234A1Z3',
    schemes: MOCK_SCHEMES_PRIYA,
    totalSchemes: 3,
    atRiskSchemes: 1,
    potentialRecovery: 590000,
    avatar: 'PS',
  },
  {
    id: 'ami003',
    name: 'Amit Patel',
    company: 'Om Traders & Co.',
    phone: '+91 76543 21098',
    gst: '24AAAPA5678C1Z9',
    schemes: MOCK_SCHEMES_AMIT,
    totalSchemes: 4,
    atRiskSchemes: 1,
    potentialRecovery: 345000,
    avatar: 'AP',
  },
];

// ─── Local Storage CRUD ─────────────────────────────────────────────
const KEY = 'hermious_profiles';

export function getProfiles(): Profile[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(INITIAL_PROFILES));
    return INITIAL_PROFILES;
  }
  return JSON.parse(raw);
}

export function saveProfiles(profiles: Profile[]): void {
  localStorage.setItem(KEY, JSON.stringify(profiles));
}

export function getProfileById(id: string): Profile | undefined {
  return getProfiles().find(p => p.id === id);
}

export function addScheme(profileId: string, scheme: Scheme): void {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  profiles[idx].schemes = [scheme, ...profiles[idx].schemes];
  profiles[idx].totalSchemes += 1;
  profiles[idx].potentialRecovery += scheme.expectedBenefit;
  saveProfiles(profiles);
}

export function deleteScheme(profileId: string, schemeId: string): void {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx === -1) return;
  const scheme = profiles[idx].schemes.find(s => s.id === schemeId);
  profiles[idx].schemes = profiles[idx].schemes.filter(s => s.id !== schemeId);
  if (scheme) {
    profiles[idx].totalSchemes = Math.max(0, profiles[idx].totalSchemes - 1);
    if (scheme.status === 'at_risk') {
      profiles[idx].atRiskSchemes = Math.max(0, profiles[idx].atRiskSchemes - 1);
      profiles[idx].potentialRecovery = Math.max(0, profiles[idx].potentialRecovery - scheme.atRiskAmount);
    }
  }
  saveProfiles(profiles);
}

export function updateScheme(profileId: string, schemeId: string, updates: Partial<Scheme>): void {
  const profiles = getProfiles();
  const pidx = profiles.findIndex(p => p.id === profileId);
  if (pidx === -1) return;
  const sidx = profiles[pidx].schemes.findIndex(s => s.id === schemeId);
  if (sidx === -1) return;
  const old = profiles[pidx].schemes[sidx];
  // Recalculate potentialRecovery if benefit changed
  const oldBenefit = old.expectedBenefit;
  const newBenefit = updates.expectedBenefit ?? oldBenefit;
  profiles[pidx].potentialRecovery += (newBenefit - oldBenefit);
  profiles[pidx].schemes[sidx] = { ...old, ...updates };
  saveProfiles(profiles);
}

export function fmt(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}
