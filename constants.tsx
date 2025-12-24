
import { GameApp, StoreGame } from './types';

export const INITIAL_APPS: GameApp[] = [
  {
    id: 'store',
    title: 'Gemini Market',
    subtitle: 'Neural Acquisitions',
    icon: '🛍️',
    background: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070',
    description: 'Explore the latest AI-driven experiences, neural-linked games, and core station modules.',
    type: 'app',
    color: 'from-blue-700 to-indigo-950',
    isInstalled: true
  },
  {
    id: 'downloads',
    title: 'Neural Transfers',
    subtitle: 'Core Sync Tracking',
    icon: '⬇️',
    background: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070',
    description: 'Monitor active data streams and manage your neural package installations.',
    type: 'system',
    color: 'from-blue-600 to-indigo-900',
    isInstalled: true
  },
  {
    id: 'settings',
    title: 'Station Config',
    subtitle: 'Neural Parameters',
    icon: '⚙️',
    background: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070',
    description: 'Adjust language, neural link protocols, and visual output settings.',
    type: 'system',
    color: 'from-zinc-700 to-slate-900',
    isInstalled: true
  },
  {
    id: 'library',
    title: 'Station Archives',
    subtitle: 'Local Data Fragments',
    icon: '📚',
    background: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070',
    description: 'Organize your installations, localized archives, and personal neural signatures.',
    type: 'system',
    color: 'from-gray-700 to-slate-950',
    isInstalled: true
  },
  {
    id: 'gemini-assistant',
    title: 'Gemini Assist',
    subtitle: 'Kernel Interface',
    icon: '✨',
    background: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2070',
    description: 'Your intelligent core companion. Ask for help, neural sync recommendations, or system diagnostics.',
    type: 'system',
    color: 'from-purple-700 to-indigo-950',
    isInstalled: true
  },
  {
    id: 'cyberpunk-neon',
    title: 'Neon Drift 2088',
    subtitle: 'Kinetic Neural Pilot',
    icon: '🏎️',
    background: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070',
    description: 'High-speed kinetic racing in a neon-drenched metropolis. Pure neural adrenaline.',
    type: 'game',
    color: 'from-pink-700 to-red-950',
    isInstalled: true
  },
  {
    id: 'stellar-voyager',
    title: 'Stellar Voyager',
    subtitle: 'Void Core Explorer',
    icon: '🚀',
    background: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072',
    description: 'Venture into the deep unknown. Discover planets and survive the void using station logic.',
    type: 'game',
    color: 'from-cyan-700 to-blue-950',
    isInstalled: true
  }
];

export const STORE_GAMES: StoreGame[] = [
  {
    id: 'geministation-core',
    title: 'GeminiStation Kernel 5.0',
    price: 'FREE',
    cover: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974',
    description: 'Download the latest neural patches and core stability improvements for your station interface.',
    status: 'buy',
    progress: 0
  },
  {
    id: 'gta5',
    title: 'Grand Theft Auto V',
    price: '$29.99',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070',
    description: 'The classic urban experience, now fully simulated within the GeminiStation kernel.',
    status: 'buy',
    progress: 0
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077',
    price: '$59.99',
    cover: 'https://images.unsplash.com/photo-1605898960710-9aa6cc020d8d?q=80&w=1974',
    description: 'Full immersion mercenary simulation. Warning: Heavy neural load.',
    status: 'buy',
    progress: 0
  }
];
