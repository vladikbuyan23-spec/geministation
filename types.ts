
export type Language = 'RU' | 'EN';

export interface GameApp {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  background: string;
  description: string;
  type: 'game' | 'app' | 'system';
  color: string;
  isInstalled?: boolean;
}

export interface StoreGame {
  id: string;
  title: string;
  price: string;
  cover: string;
  description: string;
  status: 'buy' | 'purchasing' | 'downloading' | 'installed';
  progress: number;
}

export interface DownloadTask {
  id: string;
  title: string;
  progress: number;
  status: 'active' | 'completed';
  icon: string;
}

export interface User {
  name: string;
  avatar: string;
  level: number;
}
