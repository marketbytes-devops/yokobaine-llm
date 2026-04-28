import React from 'react';
import { Users, MoreHorizontal, Grid, School, Building2, Calendar } from "lucide-react";
import config from "@/config";

export const DashboardModule = ({ setActiveTab }) => {
    const [greeting, setGreeting] = React.useState("");
    const [stats, setStats] = React.useState(null);
    const adminName = "Admin";

    const API_BASE = `${config.API_BASE_URL}/v1/school`;

    React.useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) setGreeting("Good morning");
            else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
            else if (hour >= 17 && hour < 22) setGreeting("Good evening");
            else setGreeting("Good night");
        };

        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE}/dashboard/stats`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        updateGreeting();
        fetchStats();
        
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    // Helper for Term Progress
    const calculateTermProgress = () => {
        if (!stats?.term?.start || !stats?.term?.end) return 0;
        const start = new Date(stats.term.start);
        const end = new Date(stats.term.end);
        const now = new Date();
        if (now < start) return 0;
        if (now > end) return 100;
        return Math.round(((now - start) / (end - start)) * 100);
    };

    const progress = calculateTermProgress();

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Greeting Banner */}
            <div className="relative rounded-[3rem] bg-gradient-to-br from-[#0BC48B] via-[#0BC48B] to-[#2ECC91] p-12 text-white shadow-2xl shadow-[#0BC48B]/20 overflow-hidden min-h-[220px] flex items-center">
                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black mb-3 drop-shadow-sm">👋 {greeting}, {adminName}! Great to see you again!</h1>
                        <p className="text-white/90 text-lg font-bold tracking-tight opacity-80">Managing {stats?.stats?.total_schools || 0} Institutions and {stats?.stats?.total_teachers || 0} Faculty members.</p>
                    </div>
                    <button 
                        onClick={() => setActiveTab("School Profile")}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 hover:bg-white/20 transition-all shadow-lg active:scale-95 shrink-0"
                    >
                        <Grid size={22} />
                        View All Schools
                    </button>
                </div>
                {/* Design Flourishes */}
                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <StatWidget label="Total Schools" amount={stats?.stats?.total_schools || 0} sub="Registered Profiles" icon={<School size={22} />} theme="teal" onClick={() => setActiveTab("School Profile")} />
                <StatWidget label="Total Faculty" amount={stats?.stats?.total_teachers || 0} sub="Academic Staff" icon={<Users size={22} />} theme="teal" onClick={() => setActiveTab("Faculty")} />
                <StatWidget label="Total Classes" amount={stats?.stats?.total_classes || 0} sub="Across All Sections" icon={<Building2 size={22} />} theme="rose" onClick={() => setActiveTab("Structure")} />
            </div>

            {/* Chart Widgets Row */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Section Distribution */}
                <div className="xl:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-black text-slate-800 text-lg tracking-tight">Institutional Scope</h3>
                        <MoreHorizontal size={20} className="text-slate-300 group-hover:text-[#0BC48B] transition-colors cursor-pointer" />
                    </div>
                    <div className="flex flex-col items-center justify-center py-6 relative">
                        <div className="w-52 h-52 rounded-full border-[22px] border-slate-50 relative flex items-center justify-center">
                            <div className="absolute inset-0 border-[22px] border-transparent border-t-[#0BC48B] border-l-[#0BC48B] border-r-[#F97316] rounded-full rotate-[65deg]" style={{ transition: 'transform 1s ease' }}></div>
                            <div className="text-center px-4">
                                <p className="text-4xl font-black text-slate-800 tracking-tighter">{stats?.stats?.total_sections || 0}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Levels Active</p>
                            </div>
                        </div>
                        <div className="w-full mt-12 grid grid-cols-1 gap-2.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {stats?.sections?.map((s, i) => (
                                <ChartLabel key={i} status={s.name} count={s.count} color={i % 2 === 0 ? "bg-[#0BC48B]" : "bg-[#F97316]"} />
                            ))}
                            {(!stats?.sections || stats.sections.length === 0) && (
                                <p className="text-[10px] text-slate-400 font-bold text-center italic uppercase">No sections configured</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Term Progress */}
                <div className="xl:col-span-3 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm grow relative">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="font-black text-slate-800 text-lg tracking-tight">Academic Year Progress</h3>
                        <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-baseline mb-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Year:</span>
                            <span className="text-[#F97316] font-black text-2xl tracking-tighter">{stats?.term?.year}</span>
                        </div>
                        <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest leading-none">
                            {stats?.term?.start} - {stats?.term?.end}
                        </span>
                    </div>
                    <div className="h-64 mt-4 relative bg-slate-50/30 rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-50 overflow-hidden">
                        <div className="relative w-full max-w-md h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                             <div className="absolute inset-0 bg-gradient-to-r from-[#0BC48B] to-[#2ECC91] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-6xl font-black text-slate-800 tracking-tighter">{progress}%</p>
                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-2">Term Completion Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                {/* Recent School Profiles */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-800 text-lg tracking-tight">Recent School Profiles</h3>
                        <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
                    </div>
                    <p className="text-xs text-slate-400 font-bold mb-10">Latest institutional identities synced with the <span className="text-[#0BC48B] underline decoration-2 underline-offset-4">Cloud</span></p>
                    <div className="space-y-2">
                        {stats?.recent_schools?.map((school, i) => (
                            <ClassRow key={i} rank={i+1} name={school.name} val={school.reg} active={i === 0} logo={school.logo} sub={school.principal} />
                        ))}
                        {(!stats?.recent_schools || stats.recent_schools.length === 0) && (
                            <div className="py-10 text-center">
                                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">No schools registered yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Class Capacity Monitor */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-800 text-lg tracking-tight">Class Capacity Monitor</h3>
                        <MoreHorizontal size={20} className="text-slate-300 cursor-pointer" />
                    </div>
                    <p className="text-xs text-slate-400 font-bold mb-10">Real-time occupancy tracking for <span className="text-[#F43F5E] tracking-widest">Active Divisions</span></p>

                    <div className="space-y-8">
                         <RiskStudent name="Class 10-A" risk="92" status="Full" />
                         <RiskStudent name="Class 8-B" risk="45" status="Stable" />
                         <RiskStudent name="Class 12-C" risk="78" status="Stable" />
                         <RiskStudent name="KG-Jupiter" risk="15" status="Stable" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatWidget = ({ label, amount, sub, icon, theme, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative group transition-all hover:shadow-xl hover:shadow-[#0BC48B]/5 hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
    >
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
            {count} Classes
        </div>
    </div>
);

const ClassRow = ({ rank, name, val, active, logo, sub }) => (
    <div className={`flex items-center justify-between p-4 rounded-3xl transition-all border ${active ? 'bg-slate-50 border-slate-100 shadow-sm' : 'border-transparent hover:bg-slate-50/50'}`}>
        <div className="flex items-center gap-5">
            <span className={`text-sm font-black w-6 text-center ${active ? 'text-[#0BC48B]' : 'text-slate-300'}`}>#{rank}</span>
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-[#0BC48B] overflow-hidden">
                {logo ? (
                    <img src={logo} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt="avatar" />
                )}
            </div>
            <div>
                <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub || "Principal Name"}</p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-lg font-black text-[#0BC48B] tracking-tighter leading-none">{val}</span>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Reg Number</p>
        </div>
    </div>
);

const RiskStudent = ({ name, risk, status }) => (
    <div className="flex items-center gap-6 group">
        <div className="w-14 h-14 rounded-full border-4 border-white shadow-xl shadow-slate-200 overflow-hidden shrink-0 group-hover:scale-110 transition-transform bg-slate-50 flex items-center justify-center">
            <Building2 className="text-slate-200" size={24} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-700 truncate">{name}</span>
                <span className={status === 'Full' ? 'text-rose-500' : 'text-[#0BC48B]'}>{status} • {risk}% Occupied</span>
            </div>
            <div className="w-full h-2.5 bg-slate-50 rounded-full border border-slate-100 p-[1px]">
                <div className={`h-full rounded-full transition-all duration-1000 ${status === 'Full' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-[#0BC48B] shadow-[0_0_10px_rgba(11,196,139,0.3)]'}`} style={{ width: `${risk}%` }}></div>
            </div>
        </div>
    </div>
);
