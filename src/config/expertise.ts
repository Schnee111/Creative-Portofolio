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
        title: 'Neural Core',
        subtitle: 'AI & DATA SCIENCE',
        skills: ['TensorFlow', 'Deep Learning', 'Computer Vision'],
        desc: 'Building intelligent systems with Transfer Learning, Deep RL agents, and NLP architectures for computer vision and predictive modeling.',
        img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200',
        color: 'from-blue-600/20'
    },
    {
        id: '02',
        title: 'System Forge',
        subtitle: 'BACKEND & CLOUD',
        skills: ['Node.js', 'FastAPI', 'Docker'],
        desc: 'Architecting scalable backend systems with Express.js, Spring Boot, and cloud services including AWS, MongoDB, and PostgreSQL.',
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200',
        color: 'from-emerald-600/20'
    },
    {
        id: '03',
        title: 'Pixel Matrix',
        subtitle: 'FRONTEND & CREATIVE',
        skills: ['React', 'Next.js', 'Three.js'],
        desc: 'Crafting immersive web experiences with Framer Motion, GSAP animations, and R3F for visually stunning data-driven interfaces.',
        img: 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200',
        color: 'from-violet-600/20'
    },
    {
        id: '04',
        title: 'Chain Link',
        subtitle: 'BLOCKCHAIN & IoT',
        skills: ['Hyperledger', 'Go', 'Cassandra'],
        desc: 'Developing decentralized networks with Hyperledger Fabric chaincode and distributed systems for IoT sensor data pipelines.',
        img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200',
        color: 'from-amber-600/20'
    }
]
