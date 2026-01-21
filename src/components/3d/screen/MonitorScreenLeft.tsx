'use client'

interface MonitorScreenLeftProps {
    timeString: string
}

export default function MonitorScreenLeft({ timeString }: MonitorScreenLeftProps) {
    return (
        <div className="monitor-screen fui-grid w-[450px] h-[750px] bg-[#050505]/95 p-6 font-mono shadow-[inset_0_0_60px_rgba(0,0,0,1)] text-[10px]">
            <div className="flex flex-col h-full relative z-20 overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-blue-500/20 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <h3 className="text-white font-bold tracking-[0.2em]">SCHNEE_NUCLEUS_V5</h3>
                    </div>
                    <div className="bg-blue-500/10 px-2 py-0.5 rounded text-blue-400 text-[8px] border border-blue-500/30">
                        Uptime: 284:12:09
                    </div>
                </div>

                <div className="bg-white/[0.03] rounded-xl p-3 mb-6 border border-white/5">
                    <div className="flex justify-between text-[8px] text-white/30 mb-2 uppercase tracking-widest">
                        <span>Live Process Log</span>
                        <span>Buffer: 100%</span>
                    </div>
                    <div className="space-y-1.5 opacity-80 h-24 overflow-hidden">
                        <p className="text-blue-400">05:44:01 {">"} Initializing_Neural_Link...</p>
                        <p className="text-green-400">05:44:02 {">"} Auth_Token_Verified [OK]</p>
                        <p className="text-white/60">05:44:03 {">"} Establishing_Handshake_Jakarta_ID</p>
                        <p className="text-yellow-400 animate-pulse">05:44:04 {">"} SYNCING_REMOTE_ASSETS...</p>
                        <p className="text-white/20">05:44:05 {">"} Garbage_Collection_Running</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-blue-500/5 p-3 border border-blue-500/10 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-20"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg></div>
                        <p className="text-blue-500 mb-2 font-bold">CPU_INTENSITY</p>
                        <div className="flex items-end gap-1 h-10">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="w-full bg-blue-500/40" style={{ height: `${Math.random() * 100}%` }} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-purple-500/5 p-3 border border-purple-500/10 rounded-xl">
                        <p className="text-purple-500 mb-2 font-bold">GPU_RENDER</p>
                        <div className="space-y-1.5">
                            {[75, 42, 90].map((val, i) => (
                                <div key={i} className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500/50" style={{ width: `${val}%` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr_120px] gap-4 mb-6">
                    <div className="relative h-32 border border-white/10 rounded-2xl bg-white/[0.02] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 fui-grid opacity-20" />
                        <div className="w-20 h-20 border border-blue-500/20 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 border-t-2 border-blue-400/60 rounded-full animate-spin [animation-duration:2s]" />
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-ping" />
                        </div>
                        <div className="absolute top-2 left-2 text-[6px] text-white/40">LOC_SCAN: ACTIVE</div>
                    </div>
                    <div className="flex flex-col justify-between py-1 text-[8px] text-white/40 font-bold border-l border-white/10 pl-4">
                        <div>
                            <p className="text-blue-500/60 mb-1">LATITUDE</p>
                            <p className="text-white">-6.2088° S</p>
                        </div>
                        <div>
                            <p className="text-blue-500/60 mb-1">LONGITUDE</p>
                            <p className="text-white">106.8456° E</p>
                        </div>
                        <div>
                            <p className="text-blue-500/60 mb-1">ALTITUDE</p>
                            <p className="text-white">12.4M</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-2 mb-6 opacity-60">
                    <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] mb-2">Active_Project_Nodes</p>
                    {["Deploying_ThreeJS_Engine", "Optimizing_GSAP_Timeline", "Configuring_Environment", "Finalizing_Asset_Loader"].map((text, i) => (
                        <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-1">
                            <div className="w-1.5 h-1.5 border border-blue-500/50 rounded-sm flex items-center justify-center">
                                {i < 2 && <div className="w-full h-full bg-blue-500/80" />}
                            </div>
                            <span className="text-[9px] truncate">{text}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto border-t border-white/10 pt-4 bg-gradient-to-t from-blue-500/5 to-transparent">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400 font-bold">NODE_04</span>
                                <span className="text-white/20">|</span>
                                <span className="text-white/40 tracking-tighter tracking-widest">TLS_1.3_ENCRYPTED</span>
                            </div>
                            <p className="text-[7px] text-white/10">AUTHENTICATED_SESSION_DAFFA_MAARIF_2026</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] text-blue-500/50 block mb-1 font-bold">JAKARTA_TIME</span>
                            <span className="text-white font-black text-2xl tabular-nums tracking-wider leading-none">
                                {timeString}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
