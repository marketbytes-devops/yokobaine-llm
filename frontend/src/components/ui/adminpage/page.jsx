"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Moon, Bell, School, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { TeacherManagementModule } from "./TeacherManagement";
import { SubjectManagementModule } from "./SubjectManagement";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [globalTargetStudent, setGlobalTargetStudent] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Welcome to Yokobaine', time: 'Just now', type: 'system' }
    ]);
    const [ringBell, setRingBell] = useState(false);
    const profileMenuRef = useRef(null);
    const notificationsRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleNavigation = (e) => {
            setGlobalTargetStudent(e.detail);
            setActiveTab("Ledger");
        };
        const handleNotice = (e) => {
            setNotifications(prev => [
                { id: Date.now(), title: `New Notice: ${e.detail.title}`, time: 'Just now', type: 'notice' },
                ...prev
            ]);
            setRingBell(true);
            setTimeout(() => setRingBell(false), 1500);
        };
        window.addEventListener('navigateToStudentProfile', handleNavigation);
        window.addEventListener('noticePublished', handleNotice);
        return () => {
            window.removeEventListener('navigateToStudentProfile', handleNavigation);
            window.removeEventListener('noticePublished', handleNotice);
        };
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Dashboard":
                return <DashboardModule setActiveTab={setActiveTab} />;
            case "School Profile":
                return <SchoolProfileModule />;
            case "Structure":
                return <SchoolStructureModule />;
            case "RBAC":
                return <UserManagementModule />;
            case "Faculty":
                return <TeacherManagementModule />;
            case "Subject":
                return <SubjectManagementModule />;
            case "Reports":
                return <TimetableBuilderModule />;
            case "Ledger":
                return <StudentLedgerModule targetStudent={globalTargetStudent} />;
            case "Broadcast":
                return <NoticeboardModule />;
            case "Finance-Categories":
            case "Finance-Structure":
            case "Finance-Collection":
                return <FinancialManagementModule initialTab={activeTab === "Finance-Categories" ? "categories" : activeTab === "Finance-Structure" ? "structure" : "collection"} />;
            case "Roles":
                return <RoleManagementModule />;
            default:
                return <ModulePlaceholder title={activeTab} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden">
            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes bell-ring {
                    0% { transform: rotate(0); }
                    10% { transform: rotate(15deg); }
                    20% { transform: rotate(-15deg); }
                    30% { transform: rotate(12deg); }
                    40% { transform: rotate(-12deg); }
                    50% { transform: rotate(10deg); }
                    60% { transform: rotate(-10deg); }
                    70% { transform: rotate(5deg); }
                    80% { transform: rotate(-5deg); }
                    90% { transform: rotate(2deg); }
                    100% { transform: rotate(0); }
                }
                .animate-ring {
                    animation: bell-ring 0.8s ease-in-out infinite;
                }
            `}</style>

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
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl shadow-sm border border-slate-100 relative">
                            <IconBtn icon={<Moon size={18} />} />
                            
                            <div ref={notificationsRef}>
                                <IconBtn 
                                    icon={<Bell size={18} className={ringBell ? "animate-ring" : ""} />} 
                                    dot={notifications.length > 0} 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                />
                                
                                {showNotifications && (
                                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in duration-200">
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Notifications</h4>
                                            <span className="text-[10px] font-bold text-[#0BC48B] bg-[#0BC48B]/10 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                                        </div>
                                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
                                            {notifications.map((n) => (
                                                <div key={n.id} className="p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'notice' ? 'bg-[#0BC48B]/10 text-[#0BC48B]' : 'bg-indigo-50 text-indigo-500'}`}>
                                                            {n.type === 'notice' ? <Bell size={14} /> : <School size={14} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800 leading-tight mb-1 group-hover:text-[#0BC48B] transition-colors">{n.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-medium">{n.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {notifications.length === 0 && (
                                                <div className="py-12 text-center">
                                                    <p className="text-xs font-bold text-slate-300">No new notifications</p>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => setNotifications([])}
                                            className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#0BC48B] transition-colors border-t border-slate-50"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Section with Dropdown */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-4 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">Admin</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admin Profile</p>
                                </div>
                                <div className="w-11 h-11 rounded-2xl bg-slate-100 border-2 border-white shadow-xl overflow-hidden ring-4 ring-slate-50 relative">
                                    <div className="w-full h-full bg-[#0BC48B] flex items-center justify-center text-white font-black text-sm">NP</div>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-50 animate-in fade-in zoom-in duration-200">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                                    >
                                        <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-lg transition-colors">
                                            <LogOut size={16} />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
                                    </button>
                                </div>
                            )}
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

const IconBtn = ({ icon, dot, onClick }) => (
    <button onClick={onClick} className="p-3 rounded-xl text-slate-400 hover:bg-[#0BC48B]/5 hover:text-[#0BC48B] transition-all relative">
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
