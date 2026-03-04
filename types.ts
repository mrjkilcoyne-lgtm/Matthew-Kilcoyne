export interface Nation {
  name: string;
  code: string;
  flag: string;
  greeting: string;
  greetingLang: string;
  demonym: string;
  capital: string;
  tagline: string;
  description: string;
  color: string;
  highlights: string[];
}

export interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  stats: { label: string; value: string }[];
  points: string[];
}

export interface CommunityRole {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

export interface Stat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}
