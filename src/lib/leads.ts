/**
 * Lead data model — the contract between the website and whatever receives
 * leads (CRM webhook today; CRM → QuickBooks customer after approval later).
 *
 * Keep field names stable: downstream mappings depend on them.
 */

export type LeadType = 'account_application' | 'contact' | 'brand_inquiry';

export interface Lead {
  type: LeadType;
  submittedAt: string; // ISO 8601
  page: string; // path the form was submitted from
  utm?: Partial<Record<'source' | 'medium' | 'campaign' | 'term' | 'content', string>>;
  contact: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  company?: {
    name: string;
    website?: string;
    address?: { street?: string; city?: string; region?: string; postalCode?: string; country?: string };
    businessType?: string;
  };
  purchasing?: {
    channels?: string[];
    categories?: string[];
    monthlyVolume?: string;
    resaleCertificate?: string;
  };
  topic?: string;
  message?: string;
  referral?: string;
}

/* Option lists shared by the forms and (later) CRM picklists. */

export const businessTypes = [
  'Independent retailer',
  'Regional or multi-store chain',
  'Pharmacy',
  'Grocery / supermarket',
  'Convenience store',
  'Beauty supply',
  'Discount / dollar store',
  'Ecommerce or marketplace seller',
  'Wholesaler / distributor',
  'Exporter',
  'Other',
] as const;

export const salesChannels = [
  'Physical store(s)',
  'Own website',
  'Amazon',
  'Walmart Marketplace',
  'Other marketplaces',
  'Wholesale to other businesses',
  'Export',
] as const;

export const monthlyVolumes = [
  'Under $5,000',
  '$5,000 – $25,000',
  '$25,000 – $100,000',
  '$100,000 – $500,000',
  'Over $500,000',
  'Not sure yet',
] as const;

export const resaleStatuses = [
  'Yes — I have a valid resale certificate',
  'Applying for one',
  'No / not sure',
  'Buying for export',
] as const;

export const referralSources = [
  'Search engine',
  'AI assistant (ChatGPT, Perplexity, etc.)',
  'Referral from a business',
  'Trade show or event',
  'LinkedIn',
  'Existing 1Sources contact',
  'Other',
] as const;

export const contactTopics = [
  { value: 'buying', label: 'Buying from 1Sources' },
  { value: 'account', label: 'An existing account or order' },
  { value: 'brand', label: 'Brand / manufacturer distribution' },
  { value: 'inventory', label: 'Selling excess or closeout inventory' },
  { value: 'other', label: 'Something else' },
] as const;
