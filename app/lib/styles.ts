export type CardStyle = 'fancy' | 'executive' | 'minimal' | 'creative' | 'government' | 'academic';

export interface StyleColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface StyleDefinition {
  id: CardStyle;
  name: string;
  tagline: string;
  description: string;
  defaults: StyleColors;
}

export const STYLES: StyleDefinition[] = [
  {
    id: 'fancy',
    name: 'Fancy',
    tagline: 'Make a Statement',
    description: 'Luxurious and ornate. For VIP events, luxury brands, and social media.',
    defaults: {
      primary: '#1a0a2e',
      secondary: '#2d1b4e',
      accent: '#d4a574',
      text: '#f5f0eb',
      background: '#0d0221',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Command Authority',
    description: 'Dark and powerful. For corporate leadership and premium networking.',
    defaults: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#c9a227',
      text: '#f0e6d2',
      background: '#0f0f1a',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Less is More',
    description: 'Clean and modern. For tech, startups, and contemporary workplaces.',
    defaults: {
      primary: '#18181b',
      secondary: '#71717a',
      accent: '#6366f1',
      text: '#18181b',
      background: '#ffffff',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    tagline: 'Break the Mold',
    description: 'Bold and vibrant. For designers, artists, and creative professionals.',
    defaults: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#fbbf24',
      text: '#ffffff',
      background: '#1e1b4b',
    },
  },
  {
    id: 'government',
    name: 'Government',
    tagline: 'Official & Trusted',
    description: 'Structured and formal. For official IDs, agencies, and institutions.',
    defaults: {
      primary: '#1e3a5f',
      secondary: '#2563eb',
      accent: '#dc2626',
      text: '#ffffff',
      background: '#f0f4f8',
    },
  },
  {
    id: 'academic',
    name: 'Academic',
    tagline: 'Knowledge & Pride',
    description: 'Warm and distinguished. For universities, schools, and education.',
    defaults: {
      primary: '#7c2d12',
      secondary: '#b45309',
      accent: '#f59e0b',
      text: '#1c1917',
      background: '#fffbeb',
    },
  },
];

export function getStyleById(id: CardStyle): StyleDefinition {
  return STYLES.find((s) => s.id === id) ?? STYLES[0];
}