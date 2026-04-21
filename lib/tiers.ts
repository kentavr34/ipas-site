import type { MemberTierInfo } from './types';

// Шесть уровней членства IPAS с ценами согласованными с Кенаном.
// `perks` и `required_docs` отображаются на странице членства и в форме.
// Эти же данные читает админка — при необходимости редактируются там,
// но исходные дефолты живут здесь.
export const MEMBER_TIERS: MemberTierInfo[] = [
  {
    key: 'community',
    title: 'Community Member',
    price_usd: 49,
    tagline: 'For students and early-career professionals exploring the field.',
    perks: [
      'Access to the open resource library',
      'Weekly educational newsletter',
      '15% discount on all IPAS programs',
      'Listed in the Members Community',
    ],
    required_docs: [
      'Any ID or student card (PDF or image)',
    ],
  },
  {
    key: 'professional',
    title: 'Professional Member',
    price_usd: 149,
    tagline: 'For practicing psychologists and psychotherapists.',
    perks: [
      'Everything in Community',
      'Access to members-only video lessons',
      '30% discount on all programs',
      'Profile in the public Members Directory',
      'Annual Membership Certificate',
    ],
    required_docs: [
      'Diploma or professional qualification',
      'Proof of clinical practice (letter, contract or registration)',
    ],
  },
  {
    key: 'faculty',
    title: 'Faculty Member',
    price_usd: 349,
    tagline: 'For educators, supervisors and course leaders.',
    perks: [
      'Everything in Professional',
      'Right to lead IPAS training programs',
      'Co-signature on issued certificates',
      'Monthly consultation hours with the Council',
      '50% discount on all programs',
    ],
    required_docs: [
      'Teaching or supervision credentials',
      'CV with academic record',
    ],
  },
  {
    key: 'verified_professional',
    title: 'Verified Professional',
    price_usd: 1259,
    tagline: 'Verified status with enhanced visibility and direct referrals.',
    perks: [
      'Everything in Faculty',
      'Verified Professional badge on your profile',
      'Priority listing in Directory searches',
      'Direct client referrals through IPAS channels',
      'Dedicated verification page at intpas.com/verified/{your-id}',
    ],
    required_docs: [
      'Diploma and license',
      'Two professional references',
      'Summary of recent practice and clients served',
    ],
  },
  {
    key: 'society_ambassador',
    title: 'Society Ambassador',
    price_usd: 2365,
    tagline: 'Represent IPAS within a professional society or institution.',
    perks: [
      'Everything in Verified Professional',
      'Permission to represent IPAS at local events',
      'Right to organize IPAS-accredited workshops',
      'Revenue share on signed program graduates',
      'Featured on Ambassadors page',
    ],
    required_docs: [
      'Letter of intent',
      'Proof of professional society affiliation',
      'CV with ambassadorial record',
    ],
  },
  {
    key: 'country_ambassador',
    title: 'Country Ambassador',
    price_usd: 5690,
    tagline: 'Exclusive representation of IPAS in a country.',
    perks: [
      'Everything in Society Ambassador',
      'Exclusive country representation (one per country)',
      'Right to accredit national training programs',
      'Listed as Country Chapter on the main site',
      'Direct collaboration with the President of the Council',
    ],
    required_docs: [
      'Letter of intent with country and strategy',
      'Two letters of recommendation',
      'Full CV and ID',
    ],
  },
];

export function tierByKey(key: string): MemberTierInfo | undefined {
  return MEMBER_TIERS.find(t => t.key === key);
}
