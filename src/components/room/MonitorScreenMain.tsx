'use client'

export default function MonitorScreenMain() {
    return (
        <div className="monitor-screen fui-grid w-[1055px] h-[455px] bg-[#030303] flex flex-col overflow-hidden">

            <div className="w-full h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-8">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="text-[10px] text-white/40 font-mono tracking-[0.4em] uppercase">
                    Daffa_Workspace_v1.0.4
                </div>
                <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="flex-1 p-10 flex gap-10 relative">
                <div className="absolute inset-0 fui-grid opacity-20 pointer-events-none" />

                <div className="flex-1 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md">
                            <span className="text-blue-500 font-mono text-xs font-bold tracking-widest animate-pulse">LIVE_ENV</span>
                        </div>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/50 to-transparent" />
                    </div>

                    <h1 className="text-white font-display font-black text-[90px] leading-none tracking-tighter italic mb-2">
                        katsukare<span className="text-blue-500">.</span>OS
                    </h1>
                    <p className="text-white/40 font-mono text-sm tracking-[0.8em] uppercase pl-2">
                        Daffa's Personal Workspace
                    </p>
                </div>

                <div className="w-[300px] flex flex-col justify-center gap-4 relative z-10">

                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 -blur-md">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest">Active Project</span>
                            <span className="text-blue-500 font-bold text-xs">84%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="w-[84%] h-full bg-gradient-to-r from-blue-600 to-blue-400" />
                        </div>
                        <p className="text-white/60 text-[9px] font-mono italic">Syncing Room_Assets...</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                            <p className="text-[8px] text-white/30 uppercase mb-2">Core Temp</p>
                            <div className="text-xl text-white font-bold">42<span className="text-blue-500">°C</span></div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
                            <p className="text-[8px] text-white/30 uppercase mb-2">Memory</p>
                            <div className="text-xl text-white font-bold">24<span className="text-blue-500">GB</span></div>
                        </div>
                    </div>

                    <div className="h-20 flex items-center justify-around gap-1 px-2">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="w-full bg-blue-500/20 rounded-full"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    animation: `pulse 2s infinite ${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        </div>
    )
}
