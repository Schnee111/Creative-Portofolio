export interface ExpertiseItem {
    id: string
    title: string
    subtitle: string
    skills: string[]
    desc: string
    img: string
    color: string
}

export const expertiseData: ExpertiseItem[] = [
    {
        id: '01',
        title: 'Neural Link',
        subtitle: 'AI & VISION',
        skills: ['NLP Transformer', 'YOLOv8', 'Deep Learning'],
        desc: 'Developing intelligent systems specializing in Natural Language Processing and Computer Vision.',
        img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200',
        color: 'from-blue-600/20'
    },
    {
        id: '02',
        title: 'System Arch',
        subtitle: 'WEB & CHAIN',
        skills: ['Next.js 15', 'Blockchain', 'Supabase'],
        desc: 'Building robust architectures for modern web and decentralized export supply chains.',
        img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200',
        color: 'from-indigo-600/20'
    },
    {
        id: '03',
        title: 'Data Logic',
        subtitle: 'ANALYTICS',
        skills: ['Big Data', 'Statistics', 'Orange Mining'],
        desc: 'Extracting meaningful insights from complex datasets to drive data-driven decision making.',
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
        color: 'from-cyan-600/20'
    },
    {
        id: '04',
        title: 'Human Side',
        subtitle: 'PERSONAL',
        skills: ['Piano', 'Manhwa Reader', 'E-Business'],
        desc: 'Exploring creative depths through music, storytelling, and digital business strategies.',
        img: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1200',
        color: 'from-slate-600/20'
    }
]
