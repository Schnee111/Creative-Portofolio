'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/config/projects'

export default function ProjectShowcase() {
  return (
    <div className="relative bg-[#050505] selection:bg-blue-500/30">
      
      {/* LIST VIEW - NAVIGASI UTAMA */}
      <section className="min-h-screen flex flex-col justify-center p-10 md:p-24 pt-24 md:pt-32">
        <motion.span 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 0.4, x: 0 }}
          viewport={{ once: true }}
          className="text-blue-500 font-mono text-[10px] tracking-[0.6em] mb-12 uppercase font-bold italic font-ibm"
        >
          // Featured_Archives
        </motion.span>

        <div className="space-y-4 md:space-y-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              // ANIMASI HOVER: Geser kanan + sedikit bounce
              whileHover={{ x: 25 }} 
              // Konfigurasi 'spring' untuk efek memantul yang halus
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <Link 
                href={`/project/${project.id}`} 
                className="group cursor-pointer block w-fit"
              >
                {/* Judul Proyek */}
                <h2 className="text-[9vw] font-display font-black uppercase tracking-tighter italic leading-[0.85] text-white/5 group-hover:text-blue-500 transition-colors duration-300 will-change-transform">
                  {project.title}
                </h2>

                {/* Indikator Samping (Muncul saat hover) */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-1/2 left-full ml-10 -translate-y-1/2 hidden md:block whitespace-nowrap pointer-events-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-12 bg-blue-500" />
                    <span className="text-blue-500 font-mono text-[10px] font-bold tracking-widest uppercase font-ibm">
                      {project.subtitle} — Initialize_Node
                    </span>
                  </div>
                </motion.div>

                {/* Nomor Urut (Muncul samar saat hover) */}
                <div className="absolute top-2 -left-10 opacity-0 group-hover:opacity-30 transition-all duration-500 font-mono text-blue-500 text-lg font-black italic pointer-events-none">
                  {project.id}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer dihapus sesuai permintaan */}

    </div>
  )
}