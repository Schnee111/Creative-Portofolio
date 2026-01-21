# 🚀 Creative Portfolio — Muhammad Daffa Maarif

> **An immersive 3D portfolio experience** showcasing the intersection of cutting-edge web technologies, artificial intelligence, and creative development.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 👨‍💻 About Me

**Muhammad Daffa Maarif** — Creative Developer & AI Engineer

I bridge complex **logic** with seamless **visuals** to create digital experiences that push the boundaries of web technology. Specializing in:

- 🧠 **AI & Computer Vision** — YOLOv8, NLP Transformers, Deep Learning
- 🌐 **Fullstack Development** — Next.js 15, React, Blockchain (Hyperledger Fabric)
- 🎨 **Immersive UI/UX** — Three.js, GSAP, Framer Motion
- 📊 **Data Science** — Big Data Analytics, Statistical Modeling

---

## ✨ Features

### 🎮 Interactive 3D Environment
- **Real-time 3D Room** with optimized GLTF models
- **Dynamic Monitor Displays** showing live system data
- **Cinematic Camera Animations** powered by GSAP ScrollTrigger
- **Performance-Adaptive Rendering** with automatic quality scaling

### 🖼️ Project Showcase
- **Lusion-Style Horizontal Scroll** with custom physics engine
- **Reverse-Scale Image Animations** for premium feel
- **Pull-to-Navigate** gesture for seamless project transitions
- **Responsive Gallery** with varied aspect ratios

### 🎯 Technical Highlights
- **Feature-Based Architecture** — Modular component organization
- **Custom React Hooks** — Reusable scroll physics and animations
- **Type-Safe Configuration** — TypeScript interfaces for all data
- **Smooth Scrolling** — Lenis integration with GSAP sync
- **Custom Cursor** — Desktop-only interactive cursor system

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.1.2** (App Router + Turbopack)
- **React 19** with Server Components
- **TypeScript 5.0** for type safety

### 3D & Animation
- **Three.js** + **React Three Fiber (R3F)**
- **@react-three/drei** for helpers
- **@react-three/postprocessing** for effects
- **GSAP 3** with ScrollTrigger plugin
- **Framer Motion** for UI animations

### Styling & UI
- **Tailwind CSS 4** (v4 alpha)
- **Custom CSS** for advanced effects
- **Google Fonts** (Space Grotesk, IBM Plex Mono, Geist)

### Performance
- **Lenis** for smooth scrolling
- **Dynamic Quality Scaling** based on FPS
- **GPU-Accelerated Transforms**
- **Optimized Material Rendering** (Backface Culling)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Main portfolio dashboard
│   ├── project/[id]/       # Dynamic project detail pages
│   ├── layout.tsx          # Root layout with fonts
│   └── page.tsx            # Homepage with 3D scene
│
├── components/
│   ├── ui/                 # Reusable UI primitives
│   ├── dashboard/          # Dashboard-specific components
│   ├── project/            # Project page components
│   ├── 3d/                 # Three.js components
│   ├── layout/             # Layout wrappers
│   ├── Loader.tsx          # Asset loading screen
│   ├── ProjectShowcase.tsx # Project list with hover effects
│   └── ExpertiseColumns.tsx # Expandable expertise cards
│
├── hooks/
│   └── useHorizontalScroll.ts  # Custom scroll physics hook
│
└── config/
    ├── projects.ts         # Project data with TypeScript types
    └── expertise.ts        # Expertise/skills configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** 
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-creative.git
cd portfolio-creative

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎨 Design Philosophy

This portfolio embodies the **Lusion Studio** aesthetic:

- **Cinematic Interactions** — Every scroll, hover, and transition is carefully choreographed
- **Premium Feel** — Subtle animations, smooth physics, and attention to micro-details
- **Performance First** — Adaptive quality ensures 60fps on all devices
- **Dark Mode Native** — Designed for modern, low-light environments
- **Minimal UI** — Let the work speak through immersive experiences

---

## 🧪 Key Technical Implementations

### 1. Custom Scroll Physics
```typescript
// Lusion-style smooth scrolling with lerp factor
currentScroll += (targetScroll - currentScroll) * 0.06
```

### 2. Performance Monitoring
```tsx
<PerformanceMonitor
  bounds={() => [40, 60]}
  onDecline={() => setQualityTier(prev => Math.max(0, prev - 1))}
  onIncline={() => setQualityTier(prev => Math.min(2, prev + 1))}
/>
```

### 3. Material Optimization
```typescript
// Backface culling for 50% GPU savings
material.side = THREE.FrontSide
material.needsUpdate = true
```

---

## 📊 Featured Projects

1. **Road Damage Detection** — AI-driven infrastructure monitoring (YOLOv8, 92% mAP)
2. **Coffee Supply Chain** — Blockchain transparency (Hyperledger Fabric)
3. **Banking Fraud Guard** — Real-time fraud detection (XGBoost, FastAPI)
4. **Transformer Chatbot** — NLP conversational AI (PyTorch)
5. **Sentiment Analyzer** — Big data mining (Orange, NLTK)
6. **Bio-Palm Auth** — Biometric security system (CNN, OpenCV)

---

## 🤝 Connect

- 📧 **Email**: daffam1357@gmail.com
- 💼 **LinkedIn**: 
- 🐙 **GitHub**: 
- 📸 **Instagram**: 

---

## 📄 License

This project is **proprietary** and showcases personal work. Please contact for usage permissions.

---

## 🙏 Acknowledgments

- **Lusion Studio** — Design inspiration
- **Vercel** — Hosting and deployment
- **Three.js Community** — 3D web graphics
- **GSAP** — Animation excellence

---

<div align="center">

**Built with ❤️ by Daffa Maarif**

*Bridging AI, Web3, and Immersive Experiences*

</div>
