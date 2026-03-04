import type { Nation, Pillar, CommunityRole, Stat } from './types.ts';

export const nations: Nation[] = [
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    greeting: 'Welcome',
    greetingLang: 'English',
    demonym: 'British',
    capital: 'London',
    tagline: 'The Mother of Parliaments',
    description: 'From the rolling hills of the Cotswolds to the highlands of Scotland, the birthplace of common law, parliamentary democracy, and the language that binds us. Eight hundred years since Magna Carta, and the principles endure.',
    color: '#012169',
    highlights: ['Westminster', 'Common Law', 'The City', 'NHS', 'BBC', 'Premier League'],
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    greeting: 'Bienvenue',
    greetingLang: 'French',
    demonym: 'Canadian',
    capital: 'Ottawa',
    tagline: 'True North Strong & Free',
    description: 'From the Rockies to the Maritimes, from the Arctic to the Great Lakes. A bilingual nation that proves you can honour multiple heritages while building something new. The world\'s second-largest country with a heart to match.',
    color: '#FF0000',
    highlights: ['Bilingualism', 'NATO Founding', 'Peacekeeping', 'Natural Resources', 'Multiculturalism', 'Hockey'],
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    greeting: 'G\'day',
    greetingLang: 'Australian English',
    demonym: 'Australian',
    capital: 'Canberra',
    tagline: 'Advance Australia Fair',
    description: 'An island continent where the outback meets the reef, where mateship isn\'t just a word — it\'s a way of life. From Gallipoli to the tech hubs of Melbourne and Sydney, Australians have always punched above their weight.',
    color: '#00008B',
    highlights: ['AUKUS', 'Five Eyes', 'Mining & Tech', 'Mateship', 'Cricket', 'Innovation'],
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    flag: '🇳🇿',
    greeting: 'Haere mai',
    greetingLang: 'Te Reo Māori',
    demonym: 'Kiwi',
    capital: 'Wellington',
    tagline: 'Aotearoa — Land of the Long White Cloud',
    description: 'Where the mountains meet the sea, where the haka meets the hymn. New Zealand shows the world what it means to blend indigenous heritage with Westminster tradition. Small in size, mighty in spirit.',
    color: '#000000',
    highlights: ['Te Reo Māori', 'Clean & Green', 'Rugby', 'Film Industry', 'Adventure Tourism', 'Progressive Policy'],
  },
];

export const greetings = [
  { text: 'Welcome', lang: 'English', nation: '🇬🇧' },
  { text: 'Bienvenue', lang: 'French', nation: '🇨🇦' },
  { text: 'G\'day', lang: 'Australian', nation: '🇦🇺' },
  { text: 'Haere mai', lang: 'Te Reo Māori', nation: '🇳🇿' },
  { text: 'Croeso', lang: 'Welsh', nation: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { text: 'Fàilte', lang: 'Scots Gaelic', nation: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
];

export const pillars: Pillar[] = [
  {
    id: 'free-movement',
    title: 'Free Movement',
    subtitle: 'Come & Go as Family',
    description: 'The right to live, work, and study freely across all four nations. Not as immigrants, but as family coming home. Your degree recognised, your profession portable, your children welcome in any school.',
    icon: 'plane',
    stats: [
      { label: 'Combined Population', value: '136M' },
      { label: 'Shared Language', value: 'English' },
      { label: 'Public Support (avg)', value: '73%' },
    ],
    points: [
      'Automatic work & residency rights across all four nations',
      'Mutual recognition of qualifications and professional certifications',
      'Portable pensions and social security agreements',
      'Student exchange programmes with domestic fee status',
    ],
  },
  {
    id: 'free-trade',
    title: 'Free Trade',
    subtitle: 'Prosperity Without Barriers',
    description: 'A comprehensive free trade zone spanning four continents. Zero tariffs, harmonised standards, integrated supply chains. Together, the fifth-largest economic bloc on earth.',
    icon: 'trending-up',
    stats: [
      { label: 'Combined GDP', value: '$6.5T' },
      { label: 'Trade Volume', value: '$250B+' },
      { label: 'Economic Rank', value: '5th Bloc' },
    ],
    points: [
      'Zero tariffs on goods and services between member nations',
      'Harmonised product standards and regulatory alignment',
      'Integrated financial services and investment frameworks',
      'Joint infrastructure and technology development programmes',
    ],
  },
  {
    id: 'shared-defence',
    title: 'Shared Defence',
    subtitle: 'Stronger Together',
    description: 'Four nations that have stood shoulder to shoulder in every major conflict of the last century. From the Somme to Kandahar, we\'ve never let each other down. AUKUS and Five Eyes are just the beginning.',
    icon: 'shield',
    stats: [
      { label: 'Defence Spend', value: '$120B+' },
      { label: 'Active Personnel', value: '350K+' },
      { label: 'Intelligence', value: 'Five Eyes' },
    ],
    points: [
      'Integrated defence procurement and technology sharing',
      'Joint military exercises and rapid deployment capabilities',
      'Five Eyes intelligence sharing — the world\'s premier alliance',
      'AUKUS submarine programme and Indo-Pacific security',
    ],
  },
  {
    id: 'common-values',
    title: 'Common Law & Values',
    subtitle: 'The Thread That Binds',
    description: 'Parliamentary democracy, the rule of law, individual liberty, free speech, free press. These aren\'t just words — they\'re the inheritance we share. From Magna Carta to the Charter of Rights.',
    icon: 'scale',
    stats: [
      { label: 'Legal Heritage', value: '800+ yrs' },
      { label: 'Democracy Index', value: 'Top 20' },
      { label: 'Press Freedom', value: 'Top 25' },
    ],
    points: [
      'Common law tradition stretching back to Magna Carta (1215)',
      'Parliamentary sovereignty and constitutional monarchy',
      'Independent judiciary and habeas corpus protections',
      'Shared commitment to human rights and individual liberty',
    ],
  },
];

export const communityRoles: CommunityRole[] = [
  {
    id: 'students',
    title: 'Students',
    description: 'Study anywhere across four nations. Exchange semesters in Sydney, summers in Vancouver, postgrad in London, gap year in Queenstown.',
    icon: 'graduation-cap',
    benefits: [
      'University exchange networks across all four nations',
      'Domestic fee status for CANZUK citizens',
      'Post-study work visas with pathways to residency',
      'Academic credit transfer and qualification recognition',
    ],
  },
  {
    id: 'professionals',
    title: 'Professionals',
    description: 'Your skills are needed everywhere. Seamless credential recognition means your career doesn\'t stop at the border.',
    icon: 'briefcase',
    benefits: [
      'Professional qualification mutual recognition',
      'Cross-border remote work frameworks',
      'Employer-sponsored mobility programmes',
      'Portable retirement and pension schemes',
    ],
  },
  {
    id: 'travellers',
    title: 'Gap Yearers & Travellers',
    description: 'Not tourists — explorers coming home to a different corner of the family. Working holidays that feel like belonging.',
    icon: 'compass',
    benefits: [
      'Extended working holiday visas (up to 3 years)',
      'Hostel and housing networks for CANZUK travellers',
      'Adventure and cultural exchange programmes',
      'Travel safety networks and consular cooperation',
    ],
  },
  {
    id: 'expats',
    title: 'Citizens Abroad',
    description: 'Not expats — family. Whether you\'ve settled in Perth or picked up a flat in London, you\'re never far from home.',
    icon: 'home',
    benefits: [
      'Full residency and voting rights pathways',
      'Access to public healthcare systems',
      'Property ownership without foreign buyer restrictions',
      'Family reunification and spousal work rights',
    ],
  },
];

export const heroStats: Stat[] = [
  { value: '136', suffix: 'M', label: 'People' },
  { value: '6.5', prefix: '$', suffix: 'T', label: 'GDP' },
  { value: '4', label: 'Nations' },
  { value: '1', label: 'Family' },
];

export const timelineEvents = [
  { year: '1215', event: 'Magna Carta signed — the foundation of common law and individual rights' },
  { year: '1607', event: 'Jamestown & the expansion of English common law traditions worldwide' },
  { year: '1867', event: 'Canadian Confederation — the Dominion is born' },
  { year: '1901', event: 'Australian Federation — six colonies become one nation' },
  { year: '1907', event: 'New Zealand becomes a Dominion of the British Empire' },
  { year: '1915', event: 'Gallipoli — ANZAC and British forces forge bonds in blood' },
  { year: '1931', event: 'Statute of Westminster — Dominions gain legislative independence' },
  { year: '1941', event: 'Atlantic Charter — the free world stands together' },
  { year: '1946', event: 'Five Eyes intelligence alliance established' },
  { year: '1949', event: 'NATO founded — Canada and the UK as founding members' },
  { year: '2018', event: 'CANZUK International founded — the movement goes mainstream' },
  { year: '2021', event: 'AUKUS — Australia, UK, US defence technology pact' },
  { year: '2023', event: 'CPTPP — UK accedes, joining Canada, Australia, and New Zealand' },
  { year: 'Now', event: 'Your turn. Back CANZUK.' },
];

export const manifestoLines = [
  "We didn't drift apart because we stopped caring. We drifted apart because nobody built the bridge.",
  "A Brit in Brisbane shouldn't need a visa to feel at home. A Kiwi in Kent shouldn't be treated like a stranger.",
  "We share a Queen — well, a King now. We share a language, a legal system, a way of seeing the world. We share Anzac biscuits and Bonfire Night and maple syrup on pancakes and pavlova arguments that will never be settled.",
  "We don't need Brussels. We don't need Washington. We need each other.",
  "This isn't nostalgia. This isn't empire. This is four modern democracies choosing to be more than the sum of their parts.",
  "It's about the graduate in Glasgow who could be saving lives in Christchurch. The coder in Calgary who could be building the future in Canberra. The teacher in Toowoomba who could be shaping minds in Toronto.",
  "We've always shown up for each other. The Somme. Tobruk. Korea. Afghanistan. We've never once left each other hanging.",
  "Now it's time to show up in peacetime too.",
];

export const additionalPillars = [
  {
    id: 'environment',
    icon: 'leaf',
    title: 'Environment & Climate',
    tagline: 'Kaitiakitanga Meets Innovation',
    description: "Between us we've got the Great Barrier Reef, the Canadian Boreal, the Lake District, and Fiordland. We're not just custodians of extraordinary landscapes — we're four nations with the scientific talent, the political will, and the sheer bloody-mindedness to lead on climate.",
    points: [
      'Joint renewable energy research — tidal, wind, solar, hydrogen',
      'Shared carbon trading frameworks and net-zero commitments',
      'Coordinated marine conservation across three oceans',
      'Clean tech transfer and green skills mobility',
      'Indigenous land management knowledge sharing — from Aboriginal fire management to Māori kaitiakitanga',
    ],
  },
  {
    id: 'tech',
    icon: 'cpu',
    title: 'Technology & Innovation',
    tagline: 'From Bletchley Park to the Blockchain',
    description: "We cracked Enigma. We invented the World Wide Web. We built WiFi (cheers, Australia). We pioneered nuclear physics (ta, New Zealand). Between London's fintech corridor, Toronto's AI cluster, Sydney's startup scene, and Wellington's creative tech — the talent pool is frankly ridiculous.",
    points: [
      'CANZUK tech visa — fast-track mobility for developers, engineers, and researchers',
      'Joint AI governance and ethical tech frameworks',
      'Shared cybersecurity infrastructure and threat intelligence',
      'Cross-border startup programmes and venture capital networks',
      'Quantum computing, biotech, and space technology collaboration',
    ],
  },
  {
    id: 'culture',
    icon: 'music',
    title: 'Culture & Heritage',
    tagline: 'Same Biscuit Tin, Different Biscuits',
    description: "We argue about whether it's a biscuit or a cookie, a boot or a trunk, a flat white or — actually, no, we all agree on the flat white. From the Ashes to the All Blacks, from Neighbours to Coronation Street, from Drake to Adele to Crowded House — our cultures are distinct, but they rhyme.",
    points: [
      'Cultural exchange programmes and artist residencies',
      'Shared broadcasting and film co-production treaties',
      'Heritage preservation and museum collaboration',
      'Indigenous language and culture recognition across all four nations',
      "Sport — because nothing says family like arguing about cricket over a barbecue (that's right, it's a barbecue, not a 'barbie'... actually, it is a barbie)",
    ],
  },
];

export const culturalQuotes = [
  { quote: "The price of greatness is responsibility.", author: "Winston Churchill", nation: "🇬🇧" },
  { quote: "A country can be judged by the quality of its proverbs.", author: "German proverb, but we'll claim it", nation: "🇬🇧" },
  { quote: "We are not combatants but comrades.", author: "Sir Robert Borden", nation: "🇨🇦" },
  { quote: "In this world you've just got to hope for the best and prepare for the worst and take whatever God sends.", author: "L.M. Montgomery", nation: "🇨🇦" },
  { quote: "We are all visitors to this time, this place. We are just passing through.", author: "Aboriginal Proverb", nation: "🇦🇺" },
  { quote: "She'll be right, mate.", author: "Every Australian, ever", nation: "🇦🇺" },
  { quote: "Ehara taku toa i te toa takitahi, engari he toa takitini. My strength is not that of a single warrior but that of many.", author: "Māori Whakataukī", nation: "🇳🇿" },
  { quote: "Good as gold.", author: "Every Kiwi, ever", nation: "🇳🇿" },
];
