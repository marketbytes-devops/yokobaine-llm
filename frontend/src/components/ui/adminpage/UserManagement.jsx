import React, { useState, useEffect } from 'react';
import { Save, UserPlus, Shield, Mail, Phone, Lock, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

export const UserManagementModule = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Nithya Pradeep", role: "SuperAdmin", email: "nithya@yokobaine.com", phone: "+1 555-0100", status: "Active" },
        { id: 2, name: "Sarah Jenkins", role: "Teacher", email: "s.jenkins@yokobaine.com", phone: "+1 555-0102", status: "Active" },
        { id: 3, name: "Michael Davis", role: "Office Staff", email: "m.davis@yokobaine.com", phone: "+1 555-0103", status: "Suspended" }
    ]);

    const generatePassword = () => Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10) + "!";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        roleType: "Select Role...",
        email: "",
        phone: "",
        password: "",
        status: "Active"
    });

    useEffect(() => {
        // Auto-generate password on mount
        setFormData(prev => ({ ...prev, password: generatePassword() }));
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.lastName || formData.roleType === "Select Role..." || !formData.email) {
            alert("Please fill out First Name, Last Name, Role Type, and Email.");
            return;
        }

        const newUser = {
            id: Date.now(),
            name: `${formData.firstName} ${formData.lastName}`,
            role: formData.roleType,
            email: formData.email,
            phone: formData.phone || "N/A",
            status: formData.status
        };

        setUsers([newUser, ...users]);
        
        setFormData({
            firstName: "",
            lastName: "",
            roleType: "Select Role...",
            email: "",
            phone: "",
            password: generatePassword(),
            status: "Active"
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">User Management & RBAC</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Control access and assign system roles</p>
                </div>
                <button className="bg-[#0BC48B] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-lg shadow-[#0BC48B]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all w-full md:w-auto justify-center">
                    <UserPlus size={18} />
                    Invite User
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Card */}
                <div className="xl:col-span-1 bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm relative h-max">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#0BC48B]/10 rounded-2xl flex items-center justify-center text-[#0BC48B]">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg tracking-tight leading-none">New Account</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Provision Access</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="First Name" placeholder="Jane" type="text" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                            <InputGroup label="Last Name" placeholder="Doe" type="text" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                        </div>
                        
                        <SelectGroup 
                            label="Role Type" 
                            options={['Select Role...', 'SuperAdmin', 'Office Staff', 'Teacher', 'Transport Manager']} 
                            value={formData.roleType}
                            onChange={(e) => handleInputChange("roleType", e.target.value)}
                        />
                        
                        <InputGroup label="Email Address (Login ID)" placeholder="jane.doe@yokobaine.com" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                        <InputGroup label="Phone Number" placeholder="+1 555-0000" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                        
                        <div>
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Temporary Password</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={16} /></span>
                                <input readOnly value={formData.password} className="w-full bg-slate-50 border border-slate-100 pl-12 pr-6 py-4 rounded-[1.5rem] text-sm font-black text-slate-600 outline-none shadow-inner" />
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 mt-2 ml-1">Auto-generated string. User will be forced to change this.</p>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Account Status</label>
                            <div className="flex bg-slate-50/50 p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm relative">
                                <button
                                    onClick={() => handleInputChange("status", "Active")}
                                    className={`flex-1 py-3 text-xs font-black rounded-2xl flex justify-center items-center gap-2 transition-all ${formData.status === "Active" ? "bg-white text-[#0BC48B] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    <CheckCircle2 size={14} /> Active
                                </button>
                                <button
                                    onClick={() => handleInputChange("status", "Suspended")}
                                    className={`flex-1 py-3 text-xs font-black rounded-2xl flex justify-center items-center gap-2 transition-all ${formData.status === "Suspended" ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    <XCircle size={14} /> Suspended
                                </button>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleSave}
                            className="w-full bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all mt-4"
                        >
                            <Save size={18} />
                            Provision User
                        </button>
                    </div>
                </div>

                {/* Existing Users List */}
                <div className="xl:col-span-2 bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-slate-800 text-lg tracking-tight leading-none">System Users</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Directory & Permissions ({users.length} total)</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {users.map(user => (
                            <UserCard key={user.id} {...user} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserCard = ({ name, role, email, phone, status }) => {
    return (
        <div className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm text-[#0BC48B] overflow-hidden shrink-0">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt="avatar" />
                </div>
                <div>
                    <h4 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                        {name}
                        {status === "Active" ? (
                            <span className="w-2 h-2 rounded-full bg-[#0BC48B] shadow-[0_0_8px_rgba(11,196,139,0.5)]"></span>
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                        )}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {role}
                    </p>
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 mb-1">
                    <Mail size={12} className="text-slate-400" />
                    {email}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Phone size={12} className="text-slate-300" />
                    {phone}
                </div>
            </div>
            
            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                role === "SuperAdmin" ? "bg-slate-900 border-slate-800 text-white" :
                role === "Teacher" ? "bg-[#0BC48B]/10 border-[#0BC48B]/20 text-[#0BC48B]" :
                "bg-indigo-50 border-indigo-100 text-indigo-500"
            }`}>
                {role}
            </div>
        </div>
    );
};

const InputGroup = ({ label, placeholder, type, value, onChange }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm" 
        />
    </div>
);

const SelectGroup = ({ label, options, value, onChange }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select 
                value={value}
                onChange={onChange}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
            >
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);
