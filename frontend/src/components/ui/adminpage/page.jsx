"use client";
import React, { useState } from "react";
import {
    Users,
    LayoutDashboard,
    Settings,
    LogOut,
    GraduationCap,
    ShieldCheck,
    Bell,
    Search,
    Moon,
    Grid,
    TrendingDown,
    Clock,
    School,
    MapPin,
    UserPlus,
    Wallet,
    MessageSquare,
    ChevronRight,
    HelpCircle,
    MoreHorizontal
} from "lucide-react";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    return (
        <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden">
            {/* SIDEBAR - Styled like Figma */}
            <div className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0 z-30 overflow-y-auto no-scrollbar">
                <div className="p-8 pb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0BC48B] rounded-[14px] flex items-center justify-center text-white shadow-xl shadow-[#0BC48B]/20">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                    <span className="tracking-tight font-black text-xl text-slate-800">Yokobaine</span>
                </div>

                <nav className="px-4 space-y-1.5 mt-8">
                    <SideItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
                    <SideItem icon={<School size={18} />} label="School Profile" active={activeTab === "School Profile"} onClick={() => setActiveTab("School Profile")} />
                    <SideItem icon={<MapPin size={18} />} label="School Structure" active={activeTab === "Structure"} onClick={() => setActiveTab("Structure")} />
                    <SideItem icon={<Users size={18} />} label="Staff Management" active={activeTab === "Staff"} onClick={() => setActiveTab("Staff")} />
                    <SideItem icon={<UserPlus size={18} />} label="Admission System" active={activeTab === "Admission"} onClick={() => setActiveTab("Admission")} />
                    <SideItem icon={<GraduationCap size={18} />} label="Student Ledger" active={activeTab === "Ledger"} onClick={() => setActiveTab("Ledger")} />
                    <SideItem icon={<Wallet size={18} />} label="Financial Management" active={activeTab === "Finance"} onClick={() => setActiveTab("Finance")} />
                    <SideItem icon={<MessageSquare size={18} />} label="Reports & Analytics" active={activeTab === "Reports"} onClick={() => setActiveTab("Reports")} />
                    <SideItem icon={<Settings size={18} />} label="Settings & Security" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
                </nav>

                {/* Support Card */}
                <div className="p-6 mt-12">
                    <div className="bg-[#0BC48B] rounded-[2rem] p-6 text-white text-center shadow-2xl shadow-[#0BC48B]/30 relative overflow-hidden group transition-all hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-full h-full bg-white/5 opacity-20 pointer-events-none transform -skew-x-12 translate-x-12"></div>
                        <HelpCircle className="mx-auto mb-3 opacity-90" size={32} />
                        <h4 className="font-bold text-sm mb-1 tracking-tight">Need help?</h4>
                        <p className="text-[10px] opacity-70 mb-5 font-semibold">Explore Documentation</p>
                        <button className="w-full bg-white text-[#0BC48B] py-3 rounded-2xl text-[11px] font-black shadow-sm mb-2 uppercase tracking-widest hover:bg-slate-50 transition-colors">Support</button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                {/* Top Navigation Overlay */}
                <header className="h-20 px-10 flex items-center justify-between z-20 backdrop-blur-md bg-white/60 shrink-0">
                    <div className="relative w-full max-w-md group pr-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0BC48B] transition-colors" size={16} />
                        <input type="text" placeholder="Search modules..." className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] text-sm transition-all border-dashed" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl shadow-sm border border-slate-100">
                            <IconBtn icon={<Moon size={18} />} />
                            <IconBtn icon={<Bell size={18} />} dot />
                        </div>
                        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">Nithya Pradeep</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admin Profile</p>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-slate-100 border-2 border-white shadow-xl overflow-hidden ring-4 ring-slate-50">
                                <div className="w-full h-full bg-[#0BC48B] flex items-center justify-center text-white font-black text-sm">NP</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard/Module Body */}
                <main className="flex-1 overflow-y-auto px-10 pb-12 space-y-8 scroll-smooth no-scrollbar">
                    {activeTab === "Dashboard" ? (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            {/* Greeting Banner */}
                            <div className="relative rounded-[3rem] bg-gradient-to-br from-[#0BC48B] via-[#0BC48B] to-[#2ECC91] p-12 text-white shadow-2xl shadow-[#0BC48B]/20 overflow-hidden min-h-[220px] flex items-center">
                                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div>
                                        <h1 className="text-4xl font-black mb-3 drop-shadow-sm">👋 Hi Nithya Pradeep, Great to see you again!</h1>
                                        <p className="text-white/90 text-lg font-bold tracking-tight opacity-80">Hope your day is going great at Yokobaine LLM.</p>
                                    </div>
                                    <button className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 hover:bg-white/20 transition-all shadow-lg active:scale-95 shrink-0">
                                        <Grid size={22} />
                                        Customize Widgets
                                    </button>
                                </div>
                                {/* Design Flourishes */}
                                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                            </div>

                            {/* Stat Cards - Three major ones like Figma */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <StatWidget label="Monthly Fee Collected" amount="$53,000" sub="90% Achieved" icon={<Wallet size={22} />} theme="teal" />
                                <StatWidget label="Total Pending Fees" amount="$12,420" sub="Critical Attention" icon={<TrendingDown size={22} />} theme="rose" />
                                <StatWidget label="Pending Leave Requests" amount="8" sub="Staff Management" icon={<Users size={22} />} theme="teal" />
                            </div>

                            {/* Chart Widgets Row */}
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                                {/* RAG Knowledge Status */}
                                <div className="xl:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm relative group overflow-hidden">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="font-black text-slate-800 text-lg tracking-tight">RAG Knowledge Base Status</h3>
                                        <MoreHorizontal size={20} className="text-slate-300 group-hover:text-[#0BC48B] transition-colors cursor-pointer" />
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-6 relative">
                                        {/* Donut Chart Simulation */}
                                        <div className="w-52 h-52 rounded-full border-[22px] border-slate-50 relative flex items-center justify-center">
                                            <div className="absolute inset-0 border-[22px] border-transparent border-t-[#0BC48B] border-l-[#0BC48B] border-r-[#F97316] rounded-full rotate-[65deg]" style={{ transition: 'transform 1s ease' }}></div>
                                            <div className="text-center">
                                                <p className="text-4xl font-black text-slate-800 tracking-tighter">75%</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Health Rate</p>
                                            </div>
                                        </div>
                                        <div className="w-full mt-12 grid grid-cols-1 gap-2.5">
                                            <ChartLabel status="Failed" count="5" color="bg-[#F97316]" />
                                            <ChartLabel status="Queued" count="2" color="bg-[#FACC15]" />
                                            <ChartLabel status="Indexed" count="500" color="bg-[#0BC48B]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Latency Monitor Chart */}
                                <div className="xl:col-span-3 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm grow relative">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="font-black text-slate-800 text-lg tracking-tight">Model Latency Monitor</h3>
                                        <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
                                    </div>
                                    <div className="flex justify-between items-baseline mb-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Response:</span>
                                            <span className="text-[#F97316] font-black text-2xl tracking-tighter">1.2s</span>
                                        </div>
                                        <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest leading-none">JAN 12 - 13</span>
                                    </div>
                                    {/* SVG Area Chart Mockup */}
                                    <div className="h-64 mt-4 relative bg-slate-50/30 rounded-3xl p-6 border border-slate-50 overflow-hidden">
                                        <svg className="w-full h-full opacity-40 drop-shadow-2xl" viewBox="0 0 400 150" style={{ filter: 'drop-shadow(0 10px 15px rgba(11, 196, 139, 0.15))' }}>
                                            <path d="M0,150 Q40,40 80,100 T160,80 T240,40 T320,100 T400,60 V150 H0 Z" fill="url(#grad)" />
                                            <path d="M0,150 Q40,40 80,100 T160,80 T240,40 T320,100 T400,60" fill="none" stroke="#0BC48B" strokeWidth="4" strokeLinecap="round" />
                                            <defs>
                                                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#0BC48B" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#0BC48B" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        {/* Axis Marks */}
                                        <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 text-[9px] font-black text-slate-300 border-l border-slate-100 uppercase tracking-tighter">
                                            <span>500 ms</span><span>400 ms</span><span>300 ms</span><span>200 ms</span><span>100 ms</span><span>0 ms</span>
                                        </div>
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-10 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            <span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span><span>16:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Watchlists List View */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                                {/* Top Classes GPA Table */}
                                <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-black text-slate-800 text-lg tracking-tight">Top Performing Classes</h3>
                                        <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold mb-10">Leaderboard of classes based on highest average <span className="text-[#F97316] underline decoration-2 underline-offset-4">GPA</span></p>

                                    <div className="space-y-2">
                                        <ClassRow rank="1" name="Advanced Math" val="3.94" active />
                                        <ClassRow rank="2" name="History" val="3.85" />
                                        <ClassRow rank="3" name="Chemistry" val="3.80" />
                                        <ClassRow rank="4" name="English Literature" val="3.72" />
                                    </div>
                                </div>

                                {/* At-Risk List */}
                                <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-black text-slate-800 text-lg tracking-tight">The "At-Risk" Watchlist</h3>
                                        <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold mb-10">Students with a dropout risk score higher than <span className="text-[#F43F5E] tracking-widest">80%</span></p>

                                    <div className="space-y-8">
                                        <RiskStudent name="Esthera Jackson" risk="85" status="High" />
                                        <RiskStudent name="Alexa Linder" risk="42" status="Low" />
                                        <RiskStudent name="Milo Venton" risk="92" status="High" />
                                        <RiskStudent name="Sarah Gane" risk="31" status="Low" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ModulePlaceholder title={activeTab} />
                    )}
                </main>
            </div>
        </div>
    );
};

// UI COMPONENTS

const SideItem = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-0.5 ${active ? "bg-[#0BC48B] text-white shadow-[0_20px_40px_-5px_rgba(11,196,139,0.3)]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-800"
        }`}>
        <div className="flex items-center gap-4">
            <div className={`${active ? "text-white" : "group-hover:text-[#0BC48B] transition-colors"}`}>{icon}</div>
            <span className="text-sm font-black tracking-tight">{label}</span>
        </div>
        <ChevronRight size={14} className={`transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`} />
    </div>
);

const IconBtn = ({ icon, dot }) => (
    <button className="p-3 rounded-xl text-slate-400 hover:bg-[#0BC48B]/5 hover:text-[#0BC48B] transition-all relative">
        {icon}
        {dot && <span className="absolute top-2 right-2 w-2 h-2 bg-[#0BC48B] rounded-full border-2 border-white ring-2 ring-[#0BC48B]/10"></span>}
    </button>
);

const StatWidget = ({ label, amount, sub, icon, theme }) => (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative group transition-all hover:shadow-xl hover:shadow-[#0BC48B]/5 hover:-translate-y-1">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">{label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{amount}</h3>
                <span className={`text-[11px] font-black ${theme === 'teal' ? 'text-[#0BC48B]' : 'text-[#F43F5E]'} tracking-wide`}>{sub}</span>
            </div>
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${theme === 'teal' ? 'bg-[#0BC48B]/10 text-[#0BC48B] group-hover:bg-[#0BC48B] group-hover:text-white' : 'bg-[#F43F5E]/10 text-[#F43F5E] group-hover:bg-[#F43F5E] group-hover:text-white'
                } shadow-inner`}>
                {icon}
            </div>
        </div>
    </div>
);

const ChartLabel = ({ status, count, color }) => (
    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-default border border-transparent hover:border-slate-100">
        <div className="flex items-center gap-4 px-2">
            <div className={`w-4 h-4 ${color} rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">{status}</span>
        </div>
        <div className={`px-5 py-2 font-black text-[10px] rounded-xl text-white shadow-md ${color} min-w-[100px] text-center`}>
            {count} {status}
        </div>
    </div>
);

const ClassRow = ({ rank, name, val, active }) => (
    <div className={`flex items-center justify-between p-4 rounded-3xl transition-all border ${active ? 'bg-slate-50 border-slate-100 shadow-sm' : 'border-transparent hover:bg-slate-50/50'}`}>
        <div className="flex items-center gap-5">
            <span className={`text-sm font-black w-6 text-center ${active ? 'text-[#0BC48B]' : 'text-slate-300'}`}>#{rank}</span>
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-[#0BC48B] overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt="avatar" />
            </div>
            <div>
                <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Core Subject</p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-2xl font-black text-[#0BC48B] tracking-tighter leading-none">{val}</span>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Avg Score</p>
        </div>
    </div>
);

const RiskStudent = ({ name, risk, status }) => (
    <div className="flex items-center gap-6 group">
        <div className="w-14 h-14 rounded-full border-4 border-white shadow-xl shadow-slate-200 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="avatar" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-700 truncate">{name}</span>
                <span className={status === 'High' ? 'text-rose-500' : 'text-[#0BC48B]'}>{status} Risk • {risk}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-50 rounded-full border border-slate-100 p-[1px]">
                <div className={`h-full rounded-full transition-all duration-1000 ${status === 'High' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-[#0BC48B] shadow-[0_0_10px_rgba(11,196,139,0.3)]'}`} style={{ width: `${risk}%` }}></div>
            </div>
        </div>
    </div>
);

const ModulePlaceholder = ({ title }) => (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-[#0BC48B]/10 text-[#0BC48B] rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12">
            <School size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Initializing {title}...</h1>
        <p className="max-w-md text-slate-400 font-bold uppercase tracking-widest text-[11px] leading-relaxed">This departmental architecture from your school admin flow is ready to be linked with backend database records.</p>
    </div>
);

export default AdminDashboard;
