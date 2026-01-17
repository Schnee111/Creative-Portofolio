export interface GalleryItem {
  url: string;
  type: 'full' | 'tall' | 'card';
}

export interface ProjectSection {
  title: string;
  content: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tech: string;
  desc: string;
  mainImage: string;
  gallery: GalleryItem[];
  sections: ProjectSection[];
}

export const projects: Project[] = [
  {
    id: '01',
    title: 'Road Damage Detection',
    subtitle: 'COMPUTER VISION',
    tech: 'YOLOv8 / ByteTrack / Python',
    desc: 'An AI-driven infrastructure monitoring system designed to identify asphalt defects and potholes in real-time with mAP 92% accuracy.',
    mainImage: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1541696490-8744a5db7f34?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1584462224748-41cc5aa51a7b?auto=format&fit=crop&q=80&w=2000', type: 'card' }
    ],
    sections: [
      { title: 'The Problem', content: 'Manual road inspections are labor-intensive, costly, and often overlook critical safety hazards in urban environments.' },
      { title: 'AI Implementation', content: 'Leveraging YOLOv8 models optimized for edge devices to provide instantaneous damage classification and geolocating.' }
    ]
  },
  {
    id: '02',
    title: 'Coffee Supply Chain',
    subtitle: 'BLOCKCHAIN',
    tech: 'Hyperledger Fabric / Go / Docker',
    desc: 'An enterprise blockchain solution providing end-to-end transparency for coffee exports, securing the journey from farm to cup.',
    mainImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=2000', type: 'card' }
    ],
    sections: [
      { title: 'Immutable Logs', content: 'Every batch movement is recorded in a cryptographic ledger, eliminating data tampering and ensuring fair-trade verification.' },
      { title: 'Smart Contracts', content: 'Automating quality audits and payment releases based on real-time sensor data and logistics confirmation.' }
    ]
  },
  {
    id: '03',
    title: 'Banking Fraud Guard',
    subtitle: 'FINTECH / AI',
    tech: 'XGBoost / Scikit-learn / FastAPI',
    desc: 'A high-performance fraud detection engine analyzing transaction patterns to mitigate financial risks through behavioral AI.',
    mainImage: 'https://images.unsplash.com/photo-1563013544-824ae1d95710?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2000', type: 'card' }
    ],
    sections: [
      { title: 'Anomaly Detection', content: 'Monitoring transaction velocity and user spending geolocation to flag suspicious activity within milliseconds.' },
      { title: 'Class Imbalance', content: 'Addressing skewed datasets using advanced SMOTE techniques to maintain high precision in fraud labeling.' }
    ]
  },
  {
    id: '04',
    title: 'Transformer Chatbot',
    subtitle: 'NLP / DEEP LEARNING',
    tech: 'PyTorch / Transformers / Flask',
    desc: 'A pure Transformer-based conversational AI designed for natural language understanding and multi-turn dialogue coherence.',
    mainImage: 'https://images.unsplash.com/photo-1675557009875-436f09789f50?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1555255707-c07966488bd7?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1527430253228-e9032488bc58?auto=format&fit=crop&q=80&w=2000', type: 'card' }
    ],
    sections: [
      { title: 'Attention Mechanism', content: 'Implementing multi-head self-attention to capture long-range linguistic dependencies across complex user queries.' },
      { title: 'Contextual Tuning', content: 'Fine-tuning models on massive dialogue datasets to reduce hallucinations and improve response relevance.' }
    ]
  },
  {
    id: '05',
    title: 'Sentiment Analyser',
    subtitle: 'BIG DATA / MINING',
    tech: 'Orange / Python / NLTK',
    desc: 'A systematic analysis of digital banking user reviews to categorize customer sentiment and identify key pain points.',
    mainImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1504868584819-f8e90526354c?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1454165833767-02a6e3066b61?auto=format&fit=crop&q=80&w=2000', type: 'card' }
    ],
    sections: [
      { title: 'Customer Insights', content: 'Mapping high-frequency complaints to specific app features using automated K-Means clustering.' },
      { title: 'Impact Mapping', content: 'Visualizing sentiment trends over time to correlate app updates with changes in user satisfaction.' }
    ]
  },
  {
    id: '06',
    title: 'Bio-Palm Auth System',
    subtitle: 'BIOMETRICS',
    tech: 'CNN / OpenCV / React',
    desc: 'An advanced biometric security system utilizing hand-palm vein patterns for secure, contactless financial authentication.',
    mainImage: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1633265485768-30698f1d11bc?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=2000', type: 'card' }
    ],
    sections: [
      { title: 'Biometric Mapping', content: 'Extracting palm vein features using infrared imagery to create a non-transferable biological key.' },
      { title: 'Model Accuracy', content: 'Training a custom CNN to achieve a near-zero False Acceptance Rate (FAR) for sensitive transaction authorization.' }
    ]
  }
];