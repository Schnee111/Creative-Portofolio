'use client'

export default function DirectoryHeader() {
    return (
        <header className="container mx-auto px-6 md:px-12 pt-64 pb-32 border-b border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                <div>
                    <span className="text-blue-500 font-mono text-[9px] tracking-[0.4em] mb-4 block">
                        MAIN_DIRECTORY
                    </span>
                    <h1 className="text-6xl md:text-[8vw] font-black leading-[0.8] tracking-tighter text-white opacity-90">
                        SELECTED<br />
                        <span className="text-white/20 italic">ARCHIVES</span>
                    </h1>
                </div>

                <div className="max-w-sm text-right md:text-left mb-2">
                    <p className="text-white/40 text-xs md:text-sm leading-relaxed font-light">
                        A collection of digital experiments, commercial projects,
                        and interactive experiences. Scroll to explore the node.
                    </p>
                </div>
            </div>
        </header>
    )
}
