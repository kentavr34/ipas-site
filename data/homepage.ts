// Контент главной страницы. Вынесен в отдельный файл,
// чтобы админка (позже) могла редактировать его через Sheet + GET action.

export interface FeaturedEvent {
  date: string;        // human-readable
  title: string;
  subtitle: string;
  speaker?: string;
  url: string;
  image: string;       // путь в /public
}

export interface LearningVideo {
  title: string;
  url: string;
}

export interface EbookStats {
  countries: number;
  saved_usd: number;
  downloads: number;
  url: string;
  image: string;
}

export interface DonateBlock {
  title: string;
  text: string;
  url: string;
}

export const HOMEPAGE = {
  featured_event: {
    date: 'April 2026',
    title: 'April 2026 Weekend Conference',
    subtitle:
      'Knowing What Psychoanalysts Do and Doing What Psychoanalysts Know',
    speaker: 'A Weekend with David Tuckett, PhD',
    url: 'https://theipi.org/event/april-2026-weekend-conference/',
    image: '/images/learning-programs.avif',
  } as FeaturedEvent,

  learning: {
    intro:
      'The International Psychotherapy Association presents national certificate training programmes that bring mental health professionals together for rigorous, clinically grounded learning.',
    image: '/images/learning-programs.avif',
    videos: [
      {
        title:
          'Experiences in Ethical Supervision of Child, Adolescent and Family Psychoanalytic Psychotherapy',
        url: 'https://theipi.org/',
      },
      {
        title: 'Ethical Challenges in Adolescent, Child and Family Therapy',
        url: 'https://theipi.org/',
      },
      {
        title:
          'Jack and Kerry Novick — Adolescence: An Underappreciated Developmental and Treatment Opportunity',
        url: 'https://theipi.org/',
      },
    ] as LearningVideo[],
  },

  donate: {
    title: 'Support the mission',
    text:
      'Your contribution sustains open-access learning, scholarships and the free psychotherapy e-book library that has reached readers in 200 countries.',
    url: 'https://theipi.org/about-ipi/donate-to-ipi/#!form/EbookDonation',
  } as DonateBlock,

  ebooks: {
    countries: 200,
    saved_usd: 135053441.48,
    downloads: 2303753,
    url: 'https://www.freepsychotherapybooks.org/',
    image: '/images/free-ebooks-library.avif',
  } as EbookStats,

  hero_image: '/images/conference-april-2026.avif',
};
