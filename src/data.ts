// ─── Mock Data & Storage ───────────────────────────────────────────
export const DEMO_PASSWORD = 'hermious123';

export interface LedgerEntry {
  label: string;
  amount: number;
  highlight?: boolean; // red for shortfall
}

export interface SchemeDocument {
  id: string;
  name: string;
  date: string;
  type: 'invoice' | 'statement' | 'terms' | 'other';
}

export interface Scheme {
  id: string;
  name: string;
  brand: string;          // "Parle"
  brandColor: string;     // "#D62828"
  brandInitials: string;  // "P"
  dateRange: string;      // "01 Oct – 31 Oct 2024"
  status: 'active' | 'at_risk' | 'completed';
  dueDate: string;
  // Target & Achievement
  target: number;
  targetUnit: string;     // "cases" | "assortment" | "stores"
  targetLabel: string;    // formatted e.g. "400 cases"
  achieved: number;
  achievedPct: number;
  // Offer
  offer: string;          // "4.5% special rebate + 1 case free per 20 cases"
  // Financial
  expectedBenefit: number;
  atRiskAmount: number;
  // Ledger
  ledger: {
    expected: number;
    credited: number;
    gap: number;
    breakdown: LedgerEntry[];
    gapReason: string;
    shortfall: string;
  };
  // Documents
  documents: SchemeDocument[];
  // Claim dossier
  claimDossier: {
    totalClaimable: number;
    alreadyCredited: number;
    balanceClaim: number;
    includes: string[];
  };
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
  matchedSchemes: number;
  recoveredAmount: number;
  potentialRecovery: number;
  avatar: string;
  subscription: string;  // "Pro Plan"
  brands: number;        // 14
}

// ─── Mock Schemes ──────────────────────────────────────────────────
const MOCK_SCHEMES_RAJESH: Scheme[] = [
  {
    id: 's1',
    name: 'Parle Hide & Seek Scheme',
    brand: 'Parle',
    brandColor: '#D62828',
    brandInitials: 'P',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'at_risk',
    dueDate: '2024-10-31',
    target: 400, targetUnit: 'cases', targetLabel: '400 cases',
    achieved: 396, achievedPct: 94,
    offer: '4.5% special rebate + 1 case free per 20 cases',
    expectedBenefit: 42000, atRiskAmount: 42000,
    ledger: {
      expected: 42000, credited: 0, gap: 42000,
      breakdown: [
        { label: 'Invoiced Value', amount: 933333 },
        { label: 'Scheme Entitlement (4.5%)', amount: 42000 },
        { label: 'Credit Notes Received', amount: 0 },
        { label: 'Unmatched / Pending', amount: 42000, highlight: true },
      ],
      gapReason: 'Your achieved volume is 396 cases. Scheme requires 400 cases to qualify for full benefit.',
      shortfall: 'Shortfall: 4 cases',
    },
    documents: [
      { id: 'd1', name: 'Scheme T&C', date: 'Oct 01, 2024', type: 'terms' },
      { id: 'd2', name: 'Oct Invoice', date: 'Oct 01, 2024', type: 'invoice' },
      { id: 'd3', name: 'Terms Copy', date: 'Oct 01, 2024', type: 'terms' },
      { id: 'd4', name: 'Statement', date: 'Oct 01, 2024', type: 'statement' },
    ],
    claimDossier: {
      totalClaimable: 42000, alreadyCredited: 0, balanceClaim: 42000,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 's2',
    name: 'Dabur Secondary Slab',
    brand: 'Dabur',
    brandColor: '#2D8653',
    brandInitials: 'D',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'at_risk',
    dueDate: '2024-10-31',
    target: 8000, targetUnit: 'assortment', targetLabel: '₹8,000 assortment',
    achieved: 7200, achievedPct: 90,
    offer: '3% secondary slab + ₹500 display bonus',
    expectedBenefit: 68000, atRiskAmount: 68000,
    ledger: {
      expected: 68000, credited: 0, gap: 68000,
      breakdown: [
        { label: 'Invoiced Value', amount: 2266666 },
        { label: 'Scheme Entitlement (3%)', amount: 68000 },
        { label: 'Credit Notes Received', amount: 0 },
        { label: 'Unmatched / Pending', amount: 68000, highlight: true },
      ],
      gapReason: 'Your secondary sales of ₹7,200 assortment fall short of the ₹8,000 target required to unlock the 3% slab.',
      shortfall: 'Shortfall: ₹800 assortment',
    },
    documents: [
      { id: 'd5', name: 'Scheme T&C', date: 'Oct 01, 2024', type: 'terms' },
      { id: 'd6', name: 'Oct Invoice', date: 'Oct 01, 2024', type: 'invoice' },
    ],
    claimDossier: {
      totalClaimable: 68000, alreadyCredited: 0, balanceClaim: 68000,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 's3',
    name: 'Nestlé Display Window',
    brand: 'Nestlé',
    brandColor: '#003DA5',
    brandInitials: 'N',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'at_risk',
    dueDate: '2024-10-31',
    target: 35, targetUnit: 'stores', targetLabel: '35 stores',
    achieved: 30, achievedPct: 86,
    offer: '₹1,500 per display store per month',
    expectedBenefit: 45000, atRiskAmount: 45000,
    ledger: {
      expected: 45000, credited: 0, gap: 45000,
      breakdown: [
        { label: 'Stores Enrolled', amount: 30 },
        { label: 'Scheme Entitlement', amount: 45000 },
        { label: 'Credit Notes Received', amount: 0 },
        { label: 'Unmatched / Pending', amount: 45000, highlight: true },
      ],
      gapReason: '30 of 35 target stores activated. Need 5 more store activations to unlock the full display bonus.',
      shortfall: 'Shortfall: 5 stores',
    },
    documents: [
      { id: 'd7', name: 'Display Proof', date: 'Oct 01, 2024', type: 'invoice' },
      { id: 'd8', name: 'Store List', date: 'Oct 01, 2024', type: 'statement' },
    ],
    claimDossier: {
      totalClaimable: 45000, alreadyCredited: 0, balanceClaim: 45000,
      includes: ['Scheme Terms & Conditions', 'Display Photographs', 'Store Activation List', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 's4',
    name: 'Britannia Super Stockist',
    brand: 'Britannia',
    brandColor: '#C41E3A',
    brandInitials: 'Br',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'active',
    dueDate: '2024-10-31',
    target: 500, targetUnit: 'cases', targetLabel: '500 cases',
    achieved: 510, achievedPct: 102,
    offer: '2% super stockist bonus on monthly target achievement',
    expectedBenefit: 38000, atRiskAmount: 0,
    ledger: {
      expected: 38000, credited: 38000, gap: 0,
      breakdown: [
        { label: 'Invoiced Value', amount: 1900000 },
        { label: 'Scheme Entitlement (2%)', amount: 38000 },
        { label: 'Credit Notes Received', amount: 38000 },
        { label: 'Unmatched / Pending', amount: 0 },
      ],
      gapReason: 'Target achieved. Full benefit credited.',
      shortfall: '',
    },
    documents: [
      { id: 'd9', name: 'Credit Note', date: 'Oct 31, 2024', type: 'statement' },
    ],
    claimDossier: {
      totalClaimable: 38000, alreadyCredited: 38000, balanceClaim: 0,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet'],
    },
  },
  {
    id: 's5',
    name: 'ITC Gold Flake Promo',
    brand: 'ITC',
    brandColor: '#8B6914',
    brandInitials: 'ITC',
    dateRange: '01 Sep – 30 Sep 2024',
    status: 'completed',
    dueDate: '2024-09-30',
    target: 300, targetUnit: 'cases', targetLabel: '300 cases',
    achieved: 312, achievedPct: 104,
    offer: '1.5% promotional rebate',
    expectedBenefit: 22000, atRiskAmount: 0,
    ledger: {
      expected: 22000, credited: 22000, gap: 0,
      breakdown: [
        { label: 'Invoiced Value', amount: 1466666 },
        { label: 'Scheme Entitlement (1.5%)', amount: 22000 },
        { label: 'Credit Notes Received', amount: 22000 },
        { label: 'Unmatched / Pending', amount: 0 },
      ],
      gapReason: 'Target achieved and benefit fully credited.',
      shortfall: '',
    },
    documents: [
      { id: 'd10', name: 'Credit Note', date: 'Sep 30, 2024', type: 'statement' },
    ],
    claimDossier: {
      totalClaimable: 22000, alreadyCredited: 22000, balanceClaim: 0,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Calculation Sheet'],
    },
  },
];

const MOCK_SCHEMES_PRIYA: Scheme[] = [
  {
    id: 'p1',
    name: 'HUL Surf Excel Boost',
    brand: 'HUL',
    brandColor: '#003DA5',
    brandInitials: 'HUL',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'active',
    dueDate: '2024-10-31',
    target: 200, targetUnit: 'cases', targetLabel: '200 cases',
    achieved: 185, achievedPct: 92,
    offer: '3.5% volume rebate on monthly target',
    expectedBenefit: 55000, atRiskAmount: 0,
    ledger: {
      expected: 55000, credited: 0, gap: 0,
      breakdown: [
        { label: 'Invoiced Value', amount: 1571428 },
        { label: 'Scheme Entitlement (3.5%)', amount: 55000 },
        { label: 'Credit Notes Received', amount: 0 },
        { label: 'Unmatched / Pending', amount: 0 },
      ],
      gapReason: 'On track. Scheme closes Oct 31.',
      shortfall: '',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 55000, alreadyCredited: 0, balanceClaim: 55000,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 'p2',
    name: 'P&G Ariel Challenge',
    brand: 'P&G',
    brandColor: '#003DA5',
    brandInitials: 'P&G',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'at_risk',
    dueDate: '2024-10-31',
    target: 150, targetUnit: 'cases', targetLabel: '150 cases',
    achieved: 110, achievedPct: 73,
    offer: '4% accelerated rebate on full target',
    expectedBenefit: 48000, atRiskAmount: 48000,
    ledger: {
      expected: 48000, credited: 0, gap: 48000,
      breakdown: [
        { label: 'Invoiced Value', amount: 1200000 },
        { label: 'Scheme Entitlement (4%)', amount: 48000 },
        { label: 'Credit Notes Received', amount: 0 },
        { label: 'Unmatched / Pending', amount: 48000, highlight: true },
      ],
      gapReason: 'You need 40 more cases before Oct 31 to qualify for the accelerated rebate.',
      shortfall: 'Shortfall: 40 cases',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 48000, alreadyCredited: 0, balanceClaim: 48000,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 'p3',
    name: 'Colgate Palmolive Q4',
    brand: 'Colgate',
    brandColor: '#E31837',
    brandInitials: 'CG',
    dateRange: '01 Sep – 30 Sep 2024',
    status: 'completed',
    dueDate: '2024-09-30',
    target: 250, targetUnit: 'cases', targetLabel: '250 cases',
    achieved: 265, achievedPct: 106,
    offer: '2.5% quarterly growth incentive',
    expectedBenefit: 32000, atRiskAmount: 0,
    ledger: {
      expected: 32000, credited: 32000, gap: 0,
      breakdown: [
        { label: 'Invoiced Value', amount: 1280000 },
        { label: 'Scheme Entitlement (2.5%)', amount: 32000 },
        { label: 'Credit Notes Received', amount: 32000 },
        { label: 'Unmatched / Pending', amount: 0 },
      ],
      gapReason: 'Fully achieved and credited.',
      shortfall: '',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 32000, alreadyCredited: 32000, balanceClaim: 0,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Calculation Sheet'],
    },
  },
];

const MOCK_SCHEMES_AMIT: Scheme[] = [
  {
    id: 'a1',
    name: 'Marico Parachute Slab',
    brand: 'Marico',
    brandColor: '#F7941D',
    brandInitials: 'M',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'active',
    dueDate: '2024-10-31',
    target: 350, targetUnit: 'cases', targetLabel: '350 cases',
    achieved: 320, achievedPct: 91,
    offer: '3% slab + ₹1,000 display bonus per outlet',
    expectedBenefit: 62000, atRiskAmount: 0,
    ledger: {
      expected: 62000, credited: 0, gap: 0,
      breakdown: [],
      gapReason: 'On track to hit target.',
      shortfall: '',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 62000, alreadyCredited: 0, balanceClaim: 62000,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 'a2',
    name: 'Godrej Expert Rich',
    brand: 'Godrej',
    brandColor: '#006838',
    brandInitials: 'GCP',
    dateRange: '01 Oct – 31 Oct 2024',
    status: 'at_risk',
    dueDate: '2024-10-31',
    target: 100, targetUnit: 'cases', targetLabel: '100 cases',
    achieved: 72, achievedPct: 72,
    offer: '5% premium achiever bonus',
    expectedBenefit: 30000, atRiskAmount: 30000,
    ledger: {
      expected: 30000, credited: 0, gap: 30000,
      breakdown: [
        { label: 'Invoiced Value', amount: 600000 },
        { label: 'Scheme Entitlement (5%)', amount: 30000 },
        { label: 'Credit Notes Received', amount: 0 },
        { label: 'Unmatched / Pending', amount: 30000, highlight: true },
      ],
      gapReason: '28 more cases needed before end of month to qualify.',
      shortfall: 'Shortfall: 28 cases',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 30000, alreadyCredited: 0, balanceClaim: 30000,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Sales to Retailers', 'Calculation Sheet', 'Gap Analysis Report'],
    },
  },
  {
    id: 'a3',
    name: 'Emami BoroPlus Winter',
    brand: 'Emami',
    brandColor: '#B5121B',
    brandInitials: 'EM',
    dateRange: '01 Sep – 30 Sep 2024',
    status: 'completed',
    dueDate: '2024-09-30',
    target: 120, targetUnit: 'cases', targetLabel: '120 cases',
    achieved: 130, achievedPct: 108,
    offer: '2% winter season incentive',
    expectedBenefit: 18000, atRiskAmount: 0,
    ledger: {
      expected: 18000, credited: 18000, gap: 0,
      breakdown: [],
      gapReason: 'Fully credited.',
      shortfall: '',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 18000, alreadyCredited: 18000, balanceClaim: 0,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Calculation Sheet'],
    },
  },
  {
    id: 'a4',
    name: 'Tata Consumer Q4 Push',
    brand: 'Tata',
    brandColor: '#003B78',
    brandInitials: 'TC',
    dateRange: '01 Sep – 30 Sep 2024',
    status: 'completed',
    dueDate: '2024-09-30',
    target: 180, targetUnit: 'cases', targetLabel: '180 cases',
    achieved: 190, achievedPct: 106,
    offer: '3.2% achiever incentive on tea + salt combo',
    expectedBenefit: 28000, atRiskAmount: 0,
    ledger: {
      expected: 28000, credited: 28000, gap: 0,
      breakdown: [],
      gapReason: 'Fully credited.',
      shortfall: '',
    },
    documents: [],
    claimDossier: {
      totalClaimable: 28000, alreadyCredited: 28000, balanceClaim: 0,
      includes: ['Scheme Terms & Conditions', 'Your Purchase Invoices', 'Calculation Sheet'],
    },
  },
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'raj001',
    name: 'Rajesh Gupta',
    company: 'Shree Ganesh Trading Co.',
    phone: '+91 98765 43210',
    gst: '27AABCS1429B1Z1',
    schemes: MOCK_SCHEMES_RAJESH,
    totalSchemes: 90,
    atRiskSchemes: 18,
    matchedSchemes: 56,
    recoveredAmount: 85000,
    potentialRecovery: 155000,
    avatar: 'RG',
    subscription: 'Pro Plan',
    brands: 14,
  },
  {
    id: 'pri002',
    name: 'Priya Sharma',
    company: 'Lakshmi Distributors Pvt. Ltd.',
    phone: '+91 87654 32109',
    gst: '07AAACL1234A1Z3',
    schemes: MOCK_SCHEMES_PRIYA,
    totalSchemes: 62,
    atRiskSchemes: 12,
    matchedSchemes: 38,
    recoveredAmount: 62000,
    potentialRecovery: 103000,
    avatar: 'PS',
    subscription: 'Pro Plan',
    brands: 8,
  },
  {
    id: 'ami003',
    name: 'Amit Patel',
    company: 'Om Traders & Co.',
    phone: '+91 76543 21098',
    gst: '24AAAPA5678C1Z9',
    schemes: MOCK_SCHEMES_AMIT,
    totalSchemes: 45,
    atRiskSchemes: 8,
    matchedSchemes: 28,
    recoveredAmount: 46000,
    potentialRecovery: 92000,
    avatar: 'AP',
    subscription: 'Basic Plan',
    brands: 6,
  },
];

// ─── Local Storage CRUD ─────────────────────────────────────────────
const KEY = 'hermious_profiles_v2';

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
    profiles[idx].potentialRecovery = Math.max(0, profiles[idx].potentialRecovery - scheme.expectedBenefit);
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
