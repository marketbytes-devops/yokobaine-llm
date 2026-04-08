import React from "react";
import { UploadCloud, Save, ChevronDown } from "lucide-react";

export const SchoolProfileModule = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">School Profile Settings</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Manage your institution's core identity</p>
                </div>
                <button className="bg-[#0BC48B] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-lg shadow-[#0BC48B]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all w-full md:w-auto justify-center">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-50 shadow-sm relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <InputGroup label="School Name" placeholder="Enter full school name" type="text" />
                        <InputGroup label="Registration/Affiliation Number" placeholder="e.g., CBSE/State Board ID" type="text" />
                        <InputGroup label="Principal Name" placeholder="Name of the Principal" type="text" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputGroup label="Contact Email" placeholder="school@email.com" type="email" />
                            <InputGroup label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <SelectGroup label="Academic Year" options={['2025-2026', '2026-2027', '2027-2028']} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputGroup label="Term Start Date" type="date" />
                            <InputGroup label="Term End Date" type="date" />
                        </div>

                        {/* File Upload */}
                        <div className="pt-2">
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">School Logo</label>
                            <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-[#0BC48B] transition-colors cursor-pointer group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#0BC48B]/10 group-hover:text-[#0BC48B] transition-colors mb-4 shadow-sm border border-slate-100">
                                    <UploadCloud size={24} />
                                </div>
                                <h4 className="font-black text-sm text-slate-800 mb-1 tracking-tight">Click to upload logo</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPEG, PNG up to 5MB</p>
                                <input type="file" className="hidden" accept="image/jpeg, image/png" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, placeholder, type }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm" 
        />
    </div>
);

const SelectGroup = ({ label, options }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);
