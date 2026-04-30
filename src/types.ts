import { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
}

export interface DownloadItem {
  id: string;
  filename: string;
  size: string;
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed';
  type: 'video' | 'image' | 'document' | 'other';
  date: string;
}

export interface BrowserHistory {
  id: string;
  title: string;
  url: string;
  time: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface SearchEngine {
  id: string;
  name: string;
  urlTemplate: string;
  isDefault: boolean;
}
