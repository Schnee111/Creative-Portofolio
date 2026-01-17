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
    mainImage: 'https://plus.unsplash.com/premium_photo-1664547606209-fb31ec979c85?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000', type: 'card' }
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
    mainImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000',
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
    // GAMBAR UTAMA BARU (STABIL)
    mainImage: 'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=2000', type: 'full' },
      { url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=2000', type: 'tall' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000', type: 'card' }
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
    // GAMBAR UTAMA BARU (STABIL & MODERN)
    mainImage: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { 
        // Gambar 1 (Full): Visual modern workspace & dashboard data
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000', 
        type: 'full' 
      },
      { 
        // PENGGANTI GAMBAR 2 (TALL): Visual sirkuit & data stream yang stabil
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000', 
        type: 'tall' 
      },
      { 
        // Gambar 3 (Card): Grafik Pertumbuhan & Sentimen
        url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2000', 
        type: 'card' 
      }
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
    mainImage: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=2000',
    gallery: [
      { 
        // Gambar 1 (Full): Visual keamanan siber dan perlindungan data
        url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=2000', 
        type: 'full' 
      },
      { 
        // Gambar 2 (Tall): Detail sirkuit hardware autentikasi
        url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=2000', 
        type: 'tall' 
      },
      { 
        // Gambar 3 (Card): Visualisasi pemindaian biometrik digital
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000', 
        type: 'card' 
      }
    ],
    sections: [
      { title: 'Biometric Mapping', content: 'Extracting palm vein features using infrared imagery to create a non-transferable biological key.' },
      { title: 'Model Accuracy', content: 'Training a custom CNN to achieve a near-zero False Acceptance Rate (FAR) for sensitive transaction authorization.' }
    ]
  }
];