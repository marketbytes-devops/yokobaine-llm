import React, { useState, useEffect } from "react";
import { UploadCloud, Save, ChevronDown, CheckCircle2, Building2, User, Mail, Phone, Calendar, Info, School } from "lucide-react";

export const SchoolProfileModule = () => {
    const [subTab, setSubTab] = useState("Settings"); // "Settings" or "School's Profile"
    const [loading, setLoading] = useState(false);
    const [profileExists, setProfileExists] = useState(false);
    const [formData, setFormData] = useState({
        school_name: "",
        reg_number: "",
        principal_name: "",
        contact_email: "",
        phone_number: "",
        logo_url: "",
        academic_year: "2025-2026",
        term_start_date: "",
        term_end_date: ""
    });

    // Dedicated state for the preview tab so that formData can be cleared
    const [savedViewData, setSavedViewData] = useState(null);

    const API_BASE = "http://localhost:8000/api/v1/school";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            let consolidatedData = {};
            // Fetch Profile
            const profileRes = await fetch(`${API_BASE}/profile`);
            if (profileRes.ok) {
                const data = await profileRes.json();
                consolidatedData = { ...consolidatedData, ...data };
                setProfileExists(true);
            }

            // Fetch Term
            const termRes = await fetch(`${API_BASE}/term`);
            if (termRes.ok) {
                const data = await termRes.json();
                consolidatedData = {
                    ...consolidatedData,
                    academic_year: data.academic_year,
                    term_start_date: data.term_start_date,
                    term_end_date: data.term_end_date
                };
            }

            if (Object.keys(consolidatedData).length > 0) {
                setSavedViewData(consolidatedData);
                // We keep formData sync'd initially so user can edit existing data
                setFormData(prev => ({ ...prev, ...consolidatedData }));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // 1. Save Profile
            const profileData = {
                school_name: formData.school_name,
                reg_number: formData.reg_number || null,
                principal_name: formData.principal_name || null,
                contact_email: formData.contact_email || null,
                phone_number: formData.phone_number || null,
                logo_url: formData.logo_url || null
            };

            const profileMethod = profileExists ? "PUT" : "POST";
            await fetch(`${API_BASE}/profile`, {
                method: profileMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData)
            });

            // 2. Save Term
            const termData = {
                academic_year: formData.academic_year,
                term_start_date: formData.term_start_date || null,
                term_end_date: formData.term_end_date || null
            };
            
            await fetch(`${API_BASE}/term`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(termData)
            });

            // Update the display view with current form data before clearing
            setSavedViewData({ ...formData });
            setProfileExists(true);

            // Switch to the View Tab
            setSubTab("School's Profile");

            // CLEAR FORM: Make settings page clean
            setFormData({
                school_name: "",
                reg_number: "",
                principal_name: "",
                contact_email: "",
                phone_number: "",
                logo_url: "",
                academic_year: "2025-2026",
                term_start_date: "",
                term_end_date: ""
            });

        } catch (error) {
            console.error("Error saving data:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-6xl mx-auto pb-12">
            {/* Header and Custom Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Institutional Identity</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manage and view your school's core profile</p>
                </div>
                
                <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] backdrop-blur-sm border border-slate-200/50">
                    {["Settings", "School's Profile"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSubTab(tab)}
                            className={`px-8 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${
                                subTab === tab 
                                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {subTab === "Settings" ? (
                <div className="space-y-8">
                    {/* Form Card */}
                    <div className="bg-white rounded-[3.5rem] p-8 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
                        
                        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-10">
                                <section>
                                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                                            <Building2 size={16} />
                                        </div>
                                        Basic Information
                                    </h3>
                                    <div className="space-y-6">
                                        <InputGroup label="School Name" name="school_name" value={formData.school_name} onChange={handleInputChange} placeholder="Enter full school name" type="text" icon={<School size={18} />} />
                                        <InputGroup label="Affiliation Number" name="reg_number" value={formData.reg_number} onChange={handleInputChange} placeholder="e.g., CBSE/State Board ID" type="text" icon={<CheckCircle2 size={18} />} />
                                        <InputGroup label="Principal Name" name="principal_name" value={formData.principal_name} onChange={handleInputChange} placeholder="Name of the Principal" type="text" icon={<User size={18} />} />
                                    </div>
                                </section>
                                
                                <section>
                                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                                        <div className="w-8 h-8 rounded-xl bg-[#0BC48B] text-white flex items-center justify-center shadow-lg">
                                            <Phone size={16} />
                                        </div>
                                        Communication
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputGroup label="Contact Email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} placeholder="school@email.com" type="email" icon={<Mail size={18} />} />
                                        <InputGroup label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="+1 (555) 000-0000" type="tel" icon={<Phone size={18} />} />
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Academic & Media */}
                            <div className="space-y-10">
                                <section>
                                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                                        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg">
                                            <Calendar size={16} />
                                        </div>
                                        Academic Configuration
                                    </h3>
                                    <div className="space-y-6">
                                        <SelectGroup label="Academic Year" name="academic_year" value={formData.academic_year} onChange={handleInputChange} options={['2025-2026', '2026-2027', '2027-2028']} />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <InputGroup label="Term Start Date" name="term_start_date" value={formData.term_start_date} onChange={handleInputChange} type="date" />
                                            <InputGroup label="Term End Date" name="term_end_date" value={formData.term_end_date} onChange={handleInputChange} type="date" />
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest mb-8">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg">
                                            <UploadCloud size={16} />
                                        </div>
                                        Visual Identity
                                    </h3>
                                    <label className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-[#0BC48B] transition-all cursor-pointer group/upload bg-slate-50/50">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-400 group-hover/upload:bg-[#0BC48B]/10 group-hover/upload:text-[#0BC48B] transition-all mb-4 shadow-sm border border-slate-100 ring-4 ring-slate-100/50">
                                            <UploadCloud size={28} />
                                        </div>
                                        <h4 className="font-black text-sm text-slate-800 mb-1 tracking-tight group-hover/upload:text-[#0BC48B]">Click to upload logo</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPEG, PNG up to 5MB</p>
                                        <input type="file" className="hidden" accept="image/jpeg, image/png" />
                                    </label>
                                </section>
                            </div>
                        </div>

                        {/* Save Trigger */}
                        <div className="mt-16 pt-10 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-[#0BC48B] text-white px-12 py-5 rounded-[2rem] font-black text-sm flex items-center gap-4 shadow-2xl shadow-[#0BC48B]/30 hover:shadow-[#0BC48B]/50 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Processing..." : (
                                    <>
                                        <Save size={20} />
                                        Save & Sync Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-slate-900 rounded-[4rem] p-1 lg:p-2 shadow-2xl overflow-hidden shadow-slate-900/20">
                        <div className="bg-white rounded-[3.5rem] p-10 lg:p-20">
                            {!savedViewData ? (
                                <div className="max-w-4xl mx-auto flex flex-col items-center py-20">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                                        <Info size={40} className="text-slate-200" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">No Profile Found</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Please complete the settings tab to sync your profile</p>
                                </div>
                            ) : (
                                <div className="max-w-4xl mx-auto flex flex-col items-center">
                                    {/* School Hero */}
                                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center mb-8 shadow-inner ring-8 ring-slate-50/50">
                                        <School size={60} className="text-slate-200" />
                                    </div>
                                    
                                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter text-center mb-4">{savedViewData.school_name || "School Name Not Set"}</h1>
                                    <div className="flex items-center gap-3 px-6 py-2 bg-[#0BC48B]/10 rounded-full text-[#0BC48B] font-black text-[10px] uppercase tracking-widest mb-12">
                                        <CheckCircle2 size={14} />
                                        Verified Institution Profile
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                        <PreviewCard icon={<Info size={20} />} title="Registration Detail" value={savedViewData.reg_number || "Not provided"} />
                                        <PreviewCard icon={<User size={20} />} title="Leadership" value={savedViewData.principal_name || "Not provided"} />
                                        <PreviewCard icon={<Mail size={20} />} title="Email Address" value={savedViewData.contact_email || "Not provided"} />
                                        <PreviewCard icon={<Phone size={20} />} title="Phone Support" value={savedViewData.phone_number || "Not provided"} />
                                        <div className="col-span-1 md:col-span-2 mt-4 p-8 bg-slate-50 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-slate-100">
                                                    <Calendar size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Academic Year</p>
                                                    <h4 className="text-xl font-black text-slate-900">{savedViewData.academic_year}</h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12 text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                                                <div className="text-center sm:text-right">
                                                    <span className="block mb-1 opacity-50">Start Date</span>
                                                    <span className="text-slate-800 font-black">{savedViewData.term_start_date || "---"}</span>
                                                </div>
                                                <div className="w-[1px] h-8 bg-slate-200"></div>
                                                <div className="text-center sm:text-left">
                                                    <span className="block mb-1 opacity-50">End Date</span>
                                                    <span className="text-slate-800 font-black">{savedViewData.term_end_date || "---"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            setFormData({ ...savedViewData }); // Repopulate form when editing
                                            setSubTab("Settings");
                                        }}
                                        className="mt-16 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-8"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InputGroup = ({ label, placeholder, type, name, value, onChange, icon }) => (
    <div className="group/input transition-all duration-300">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            {icon && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-[#0BC48B] transition-colors duration-300">
                    {icon}
                </div>
            )}
            <input 
                name={name}
                value={value}
                onChange={onChange}
                type={type} 
                placeholder={placeholder} 
                className={`w-full bg-slate-50/50 border border-slate-100 ${icon ? 'pl-16' : 'px-6'} py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm`} 
            />
        </div>
    </div>
);

const SelectGroup = ({ label, options, name, value, onChange }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select 
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
            >
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);

const PreviewCard = ({ icon, title, value }) => (
    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6 hover:bg-slate-900 group/card transition-colors duration-500">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover/card:bg-[#0BC48B] group-hover/card:text-white transition-all group-hover/card:-translate-y-1">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1 group-hover/card:text-slate-400 transition-colors">{title}</p>
            <h4 className="text-base font-black text-slate-900 tracking-tight group-hover/card:text-white transition-colors">{value}</h4>
        </div>
    </div>
);

