const STORAGE_URL = process.env.NEXT_PUBLIC_AZURE_STORAGE_URL || 'https://projectmedia1.blob.core.windows.net/portfolio-assets';
export const getImg = (path: string) => `${STORAGE_URL}${path}`;

export type SectionType =
  | 'intro'
  | 'image-full'
  | 'image-wide'
  | 'image-tall'
  | 'text'
  | 'text-quote'
  | 'video'
  | 'bridge'
  | 'separator';

export interface SectionBase {
  type: SectionType;
  id: string;
}

export interface IntroSection extends SectionBase {
  type: 'intro';
}

export interface ImageSection extends SectionBase {
  type: 'image-full' | 'image-wide' | 'image-tall';
  src: string;
  alt?: string;
}

export interface TextSection extends SectionBase {
  type: 'text' | 'text-quote';
  title?: string;
  content: string;
}

export interface VideoSection extends SectionBase {
  type: 'video';
  src: string;
  poster?: string;
}

export interface SeparatorSection extends SectionBase {
  type: 'separator';
  label?: string;
}

export interface BridgeSection extends SectionBase {
  type: 'bridge';
}

export type ProjectSection = IntroSection | ImageSection | TextSection | VideoSection | BridgeSection | SeparatorSection;

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  desc: string;
  bgcolor?: string;
  overlay?: 'leaf' | 'tech';
  github?: string;
  demo?: string;
  sections: ProjectSection[];
}

// Import from JSON and transform image paths
import projectsData from './projects.json';

// Transform sections to add Azure URL prefix to image paths
const transformSections = (sections: ProjectSection[]): ProjectSection[] => {
  return sections.map(section => {
    if ('src' in section && section.src) {
      return { ...section, src: getImg(section.src) };
    }
    return section;
  });
};

export const projects: Project[] = (projectsData as Project[]).map(project => ({
  ...project,
  sections: transformSections(project.sections),
}));