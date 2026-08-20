export const EVENT = {
  title: 'Siavonga Independence Run 2026',
  tagline: 'Run. Celebrate. Unite.',
  date: 'Saturday, 24 October 2026',
  // Independence Day itself is confirmed; the 05:30 flag-off is a sensible
  // placeholder (matches the run start time published on siavongarun2026.com)
  // pending official confirmation from the organisers.
  isoDate: '2026-10-24T05:30:00',
  venue: 'Lakeshore, Siavonga, Lake Kariba',
  // No confirmed contact channel yet — leave blank rather than invent one.
  // The UI falls back to "Contact details coming soon" wherever these are empty.
  phone: '',
  email: '',
};

export const DISTANCES = [
  { code: '10KM', categoryCode: '10k', label: 'Competitive Run', start: '05:30' },
  { code: '5KM', categoryCode: '5k-fun-run', label: 'Fun Run & Walk', start: '05:30' },
];

export const SCHEDULE = [
  { time: '05:00', label: 'Race village opens', note: 'Bib collection' },
  { time: '05:30', label: '10KM Competitive Run', note: 'Gun start' },
  { time: '05:30', label: '5KM Fun Run & Walk', note: 'Gun start' },
];

export const WHY_SIAVONGA = [
  { icon: '🇿🇲', title: 'Celebrate Independence', desc: "Run on Zambia's Independence Day and celebrate freedom, unity and national pride." },
  { icon: '🌊', title: 'Experience Lake Kariba', desc: "Enjoy the beauty and atmosphere of one of Zambia's most iconic lakeside destinations — spectacular views, boating and more." },
  { icon: '🏃‍♀️', title: 'Run With Everyone', desc: 'From competitive athletes to first-time runners and families — there is a race for you.' },
  { icon: '🤝', title: 'Make It a Weekend', desc: 'Come for the run. Stay for Siavonga. Explore the destination and create unforgettable memories.' },
];

export const PACKAGE_ITEMS = [
  'Official event T-shirt',
  'Finisher medal',
  'Race bib number',
  'Timed results (10KM)',
  'Hydration support',
  'Finisher certificate',
];

export const SPONSORS: { name: string; file: string; tier: string; logoClass?: string }[] = [
  { name: 'FIT Sports Drink', file: 'fit.png', tier: 'Presenting sponsor' },
  { name: 'Vatra Mineral Water', file: 'vatra.png', tier: 'Hydration partner' },
  { name: 'Zambia Athletics', file: 'za.png', tier: 'Governing body' },
  { name: 'Kwendura Infinity Corporation', file: 'kwendura.jpg', tier: 'Official partner' },
  { name: 'Enax Technology Limited', file: 'enax-logo.png', tier: 'Technology partner', logoClass: 'sponsor-logo-lg' },
  { name: 'Limitless Consultancy and Research Limited', file: 'limitless-logo.png', tier: 'Official partner' },
];
