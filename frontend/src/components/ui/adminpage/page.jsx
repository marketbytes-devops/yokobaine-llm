"use client";
import React, { useState } from "react";
import { Search, Moon, Bell, School } from "lucide-react";
import Sidebar from "../../layout/sidebar";
import { SchoolProfileModule } from "./SchoolProfile";
import { SchoolStructureModule } from "./SchoolStructure";
import { UserManagementModule } from "./UserManagement";
import { TimetableBuilderModule } from "./TimetableBuilder";
import { StudentLedgerModule } from "./StudentLedger";
import { FinancialManagementModule } from "./FinancialManagement";
import { NoticeboardModule } from "./Noticeboard";
import { DashboardModule } from "./Dashboard";
import { RoleManagementModule } from "./RoleManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return <DashboardModule />;
            case "School Profile":
                return <SchoolProfileModule />;
            case "Structure":
                return <SchoolStructureModule />;
            case "RBAC":
                return <UserManagementModule />;
            case "Reports":
                return <TimetableBuilderModule />;
            case "Ledger":
                return <StudentLedgerModule />;
            case "Broadcast":
                return <NoticeboardModule />;
            case "Finance":
                return <FinancialManagementModule />;
            case "Roles":
                return <RoleManagementModule />;
            default:
                return <ModulePlaceholder title={activeTab} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden">
            {/* SIDEBAR */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const IconBtn = ({ icon, dot }) => (
    <button className="p-3 rounded-xl text-slate-400 hover:bg-[#0BC48B]/5 hover:text-[#0BC48B] transition-all relative">
        {icon}
        {dot && <span className="absolute top-2 right-2 w-2 h-2 bg-[#0BC48B] rounded-full border-2 border-white ring-2 ring-[#0BC48B]/10"></span>}
    </button>
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
