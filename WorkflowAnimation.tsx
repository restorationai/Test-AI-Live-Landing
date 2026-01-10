
import React from 'react';

const WorkflowAnimation: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto p-0 select-none pointer-events-none mb-12">
            {/* Dashboard Frame */}
            <div className="relative rounded-2xl bg-slate-900 border-2 border-[#0ea5e9]/40 shadow-[0_0_40px_rgba(14,165,233,0.2)] overflow-hidden aspect-[4/3] md:aspect-[16/8]">
                
                {/* Dashboard Background */}
                <div className="absolute inset-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#020617_100%)]"></div>
                {/* Subtle Grid Background */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(51, 65, 85, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(51, 65, 85, 0.15) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>

                {/* Animation Canvas */}
                <svg 
                    className="w-full h-full relative z-0" 
                    viewBox="0 0 1000 600" 
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <clipPath id="avatar-clip-final-v3">
                            <circle cx="0" cy="0" r="48" />
                        </clipPath>

                        <filter id="glow-center-final-v3" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="12" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        
                        <symbol id="icon-phone-final-v3" viewBox="0 0 384 512">
                            <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM192 400a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                        </symbol>
                    </defs>

                    <style>{`
                        @keyframes inboundFillFinalV3 {
                            0% { stroke-dashoffset: 800; opacity: 1; }
                            10% { stroke-dashoffset: 0; opacity: 1; }
                            90% { stroke-dashoffset: 0; opacity: 1; }
                            95%, 100% { stroke-dashoffset: 0; opacity: 0; }
                        }
                        @keyframes centerActivateFinalV3 {
                            0%, 9% { fill: #1e293b; stroke: #334155; transform: scale(1); }
                            10% { fill: #1e293b; stroke: #0ea5e9; filter: url(#glow-center-final-v3); transform: scale(1.1); } 
                            15% { transform: scale(1); }
                            90% { fill: #1e293b; stroke: #0ea5e9; opacity: 1; }
                            95%, 100% { fill: #1e293b; stroke: #334155; opacity: 1; }
                        }

                        .node-reveal-v3 { 
                            opacity: 0; 
                            transform-box: fill-box; 
                            transform-origin: center; 
                            animation: revealNodeFinalV3 10s infinite linear; 
                        }
                        .line-reveal-v3 { 
                            opacity: 0; 
                            animation: revealLineFinalV3 10s infinite linear; 
                        }
                        
                        @keyframes revealNodeFinalV3 {
                            0%, var(--start) { opacity: 0; transform: scale(0.6); }
                            var(--end) { opacity: 1; transform: scale(1); }
                            90% { opacity: 1; transform: scale(1); }
                            95%, 100% { opacity: 0; transform: scale(0.8); }
                        }
                        @keyframes revealLineFinalV3 {
                            0%, var(--start) { opacity: 0; stroke-dashoffset: 500; }
                            var(--end) { opacity: 1; stroke-dashoffset: 0; }
                            90% { opacity: 1; stroke-dashoffset: 0; }
                            95%, 100% { opacity: 0; }
                        }
                    `}</style>

                    {/* Left Side: Incoming Calls */}
                    <g transform="translate(180, 0)">
                        {[100, 225, 300, 375, 500].map(y => (
                            <g key={y}>
                                <path d={`M0 ${y} C70 ${y}, 140 300, 215 300`} fill="none" stroke="#334155" strokeWidth="2" strokeOpacity="0.15" />
                                <path d={`M0 ${y} C70 ${y}, 140 300, 215 300`} fill="none" stroke="#ffffff" strokeWidth="4" strokeDasharray="800" strokeDashoffset="800" style={{animation: 'inboundFillFinalV3 10s infinite linear'}} />
                                <g transform={`translate(0, ${y})`}>
                                    <circle r="24" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                                    <use href="#icon-phone-final-v3" x="-12" y="-12" width="24" height="24" fill="#64748b" />
                                    <text x="-35" y="6" textAnchor="end" fill="#94a3b8" fontSize="14" fontWeight="900" style={{textTransform: 'uppercase'}}>Incoming</text>
                                </g>
                            </g>
                        ))}
                    </g>

                    {/* Center Node: AI Agent */}
                    <g transform="translate(450, 300)">
                        <circle r="65" fill="#1e293b" stroke="#334155" strokeWidth="4" style={{animation: 'centerActivateFinalV3 10s infinite linear'}} />
                        <image 
                            href="https://storage.googleapis.com/msgsndr/Tx5eKisj3Xluq1SeZKe3/media/693c75ba9caf9aea42d79079.png"
                            x="-65" y="-65" width="130" height="130"
                            clipPath="url(#avatar-clip-final-v3)"
                        />
                        <text y="-90" textAnchor="middle" fill="#00D2FF" fontSize="24" fontWeight="900" style={{textTransform: 'uppercase'}}>AI SECURED</text>
                    </g>

                    {/* Right Side: Automated Steps - 5 Consolidated Steps */}
                    <g transform="translate(720, 0)">
                        {[
                            { y: 80, text: "Qualified", color: "#10b981", s: "15%", e: "20%" },
                            { y: 190, text: "Emergency Auth", color: "#ef4444", s: "22%", e: "27%" },
                            { y: 300, text: "CRM Sync", color: "#a855f7", s: "30%", e: "35%" },
                            { y: 410, text: "Work Recovery", color: "#00D2FF", s: "38%", e: "43%" },
                            { y: 520, text: "Reviews Collected", color: "#f59e0b", s: "46%", e: "51%" }
                        ].map((node) => (
                            <g key={node.y}>
                                <path className="line-reveal-v3" d={`M-205 ${300 - node.y} C-100 ${300 - node.y}, -100 0, -26 0`} fill="none" stroke={node.color} strokeWidth="5" strokeDasharray="500" style={{"--start": node.s, "--end": node.e} as any} />
                                <g transform={`translate(0, ${node.y})`} className="node-reveal-v3" style={{"--start": node.s, "--end": node.e} as any}>
                                    <rect x="-24" y="-24" width="48" height="48" rx="12" fill="#1e293b" stroke={node.color} strokeWidth="4" />
                                    <text x="36" y="8" fill="#ffffff" fontSize="18" fontWeight="900" style={{textTransform: 'uppercase'}}>{node.text}</text>
                                </g>
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default WorkflowAnimation;
