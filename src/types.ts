export type ViewState = 'desk' | 'monitor' | 'usb' | 'folder' | 'phone' | 'chair' | 'sofa';

export interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  details: string[];
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'Network' | 'Security' | 'Languages' | 'Tools';
  details?: string;
}
