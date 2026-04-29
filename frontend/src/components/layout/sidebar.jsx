import React from 'react';
import {
    Users,
    LayoutDashboard,
    Settings,
    GraduationCap,
    ShieldCheck,
    School,
    MapPin,
    UserPlus,
    Wallet,
    Clock,
    Megaphone,
    ChevronRight,
    HelpCircle,
    Shield,
    BookMarked
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
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
                <SideItem icon={<BookMarked size={18} />} label="Subject Management" active={activeTab === "Subject"} onClick={() => setActiveTab("Subject")} />
                <SideItem icon={<Users size={18} />} label="Faculty Management" active={activeTab === "Faculty"} onClick={() => setActiveTab("Faculty")} />
                <SideItem icon={<MapPin size={18} />} label="School Structure" active={activeTab === "Structure"} onClick={() => setActiveTab("Structure")} />
                <SideItem icon={<Clock size={18} />} label="Timetable Builder" active={activeTab === "Reports"} onClick={() => setActiveTab("Reports")} />
                <SideItem icon={<GraduationCap size={18} />} label="Student & Parent Ledger" active={activeTab === "Ledger"} onClick={() => setActiveTab("Ledger")} />

                {/* Financial Management with Sub-menu */}
                <div>
                    <SideItem
                        icon={<Wallet size={18} />}
                        label="Financial Management"
                        active={activeTab.startsWith("Finance")}
                        onClick={() => setActiveTab(activeTab.startsWith("Finance") ? "Dashboard" : "Finance-Categories")}
                        hasSubmenu
                        isOpen={activeTab.startsWith("Finance")}
                    />
                    {activeTab.startsWith("Finance") && (
                        <div className="ml-10 mt-2 space-y-1 border-l-2 border-slate-100 pl-4 animate-in slide-in-from-top-2 duration-300">
                            <SubItem label="Fee Category" active={activeTab === "Finance-Categories"} onClick={() => setActiveTab("Finance-Categories")} />
                            <SubItem label="Create Structure" active={activeTab === "Finance-Structure"} onClick={() => setActiveTab("Finance-Structure")} />
                            <SubItem label="Fee Collection" active={activeTab === "Finance-Collection"} onClick={() => setActiveTab("Finance-Collection")} />
                        </div>
                    )}
                </div>

                <SideItem icon={<Megaphone size={18} />} label="Noticeboard & Broadcast" active={activeTab === "Broadcast"} onClick={() => setActiveTab("Broadcast")} />
                <SideItem icon={<Shield size={18} />} label="Roles Management" active={activeTab === "Roles"} onClick={() => setActiveTab("Roles")} />
                <SideItem icon={<UserPlus size={18} />} label="User Management & RBAC" active={activeTab === "RBAC"} onClick={() => setActiveTab("RBAC")} />
                {/* <SideItem icon={<Settings size={18} />} label="Settings & Security" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} /> */}
            </nav>

            {/* Support Card */}
            <div className="p-6 mt-auto mb-8">
                <div className="bg-[#0BC48B] rounded-[2rem] p-6 text-white text-center shadow-2xl shadow-[#0BC48B]/30 relative overflow-hidden group transition-all hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 w-full h-full bg-white/5 opacity-20 pointer-events-none transform -skew-x-12 translate-x-12"></div>
                    <HelpCircle className="mx-auto mb-3 opacity-90" size={32} />
                    <h4 className="font-bold text-sm mb-1 tracking-tight">Need help?</h4>
                    <p className="text-[10px] opacity-70 mb-5 font-semibold">Explore Documentation</p>
                    <button className="w-full bg-white text-[#0BC48B] py-3 rounded-2xl text-[11px] font-black shadow-sm mb-2 uppercase tracking-widest hover:bg-slate-50 transition-colors">Support</button>
                </div>
            </div>
        </div>
    );
};

const SideItem = ({ icon, label, active, onClick, hasSubmenu, isOpen }) => (
    <div onClick={onClick} className={`flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group hover:-translate-y-0.5 ${active ? "bg-[#0BC48B] text-white shadow-[0_20px_40px_-5px_rgba(11,196,139,0.3)]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-800"
        }`}>
        <div className="flex items-center gap-4">
            <div className={`${active ? "text-white" : "group-hover:text-[#0BC48B] transition-colors"}`}>{icon}</div>
            <span className="text-sm font-black tracking-tight">{label}</span>
        </div>
        <ChevronRight size={14} className={`transition-all ${active ? "opacity-100" : "opacity-0 group-hover:opacity-30"} ${hasSubmenu && isOpen ? "rotate-90" : ""}`} />
    </div>
);

const SubItem = ({ label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`px-4 py-2 rounded-xl cursor-pointer text-xs font-bold tracking-tight transition-all ${active
                ? "text-[#0BC48B] bg-[#0BC48B]/5 shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
    >
        {label}
    </div>
);

export default Sidebar;
