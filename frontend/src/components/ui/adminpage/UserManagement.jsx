import React, { useState, useEffect } from 'react';
import { Save, UserPlus, Shield, Mail, Phone, Lock, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';

export const UserManagementModule = () => {
    const [users, setUsers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [loading, setLoading] = useState(false);

    const generatePassword = () => Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 10) + "!";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        roleId: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        status: "Active"
    });

    const sectionsList = ["Kindergarten", "LP", "UP", "High School", "Higher Secondary"];

    const fetchData = async () => {
        try {
            const roleRes = await fetch("http://localhost:8000/api/auth/roles");
            const roleData = await roleRes.json();
            setAvailableRoles(roleData);

            const userRes = await fetch("http://localhost:8000/api/auth/users");
            const userData = await userRes.json();
            setUsers(userData);

            const teacherRes = await fetch("http://localhost:8000/api/v1/school/teachers");
            const teacherData = await teacherRes.json();
            // Map backend structure for easier filtering
            setTeachers(teacherData.map(t => ({
                ...t,
                sectionNames: t.sections.map(s => s.name)
            })));
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    useEffect(() => {
        fetchData();
        setFormData(prev => ({ ...prev, password: generatePassword() }));
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newState = { ...prev, [field]: value };
            if (field === "email" && !prev.username) {
                newState.username = value.split('@')[0];
            }
            return newState;
        });
    };

    const handleSectionToggle = (section) => {
        setSelectedSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleTeacherSelect = (teacherId) => {
        const teacher = teachers.find(t => t.id === parseInt(teacherId));
        if (teacher) {
            const [first, ...last] = teacher.full_name.split(" ");
            setFormData(prev => ({
                ...prev,
                firstName: first || "",
                lastName: last.join(" ") || "",
                // Note: If you want to use the teacher's registered email, we can add it later
                // For now we'll keep the name sync
            }));
        }
    };

    const currentRoleName = availableRoles.find(r => r.id.toString() === formData.roleId.toString())?.name;
    const isAdministrativeRole = currentRoleName === "SuperAdmin" || currentRoleName === "Admin";
    const isTeacherRole = currentRoleName === "Teacher";
    const needsProfileLinking = formData.roleId && !isAdministrativeRole;

    const filteredTeachersList = teachers.filter(t =>
        selectedSections.length === 0 || t.sectionNames.some(s => selectedSections.includes(s))
    );

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName || !formData.roleId || !formData.email) {
            alert("Please fill out First Name, Last Name, Role Type, and Email.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username || formData.email.split('@')[0],
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone_number: formData.phone,
                    role_id: parseInt(formData.roleId)
                })
            });

            if (res.ok) {
                alert("User provisioned successfully!");
                fetchData(); // Refresh list
                setFormData({
                    firstName: "",
                    lastName: "",
                    roleId: "",
                    email: "",
                    phone: "",
                    username: "",
                    password: generatePassword(),
                    status: "Active"
                });
            } else {
                const error = await res.json();
                alert(error.detail || "Failed to create user");
            }
        } catch (err) {
            alert("Connection error. Is the backend running?");
        } finally {
            setLoading(false);
        }
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
                        <div>
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Role Type</label>
                            <div className="relative">
                                <select
                                    value={formData.roleId}
                                    onChange={(e) => handleInputChange("roleId", e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">Select Role...</option>
                                    {availableRoles.map(role => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </div>
                        {/* Conditional Section Filtering for Teachers / Non-Admins */}
                        {needsProfileLinking && (
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top duration-500">
                                {isTeacherRole && (
                                    <>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Filter by School Section</label>
                                        <div className="space-y-3 mb-8">
                                            {sectionsList.map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleSectionToggle(s)}
                                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-xs transition-all border-2 ${selectedSections.includes(s)
                                                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20"
                                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                                        }`}
                                                >
                                                    {s}
                                                    {selectedSections.includes(s) && (
                                                        <CheckCircle2 size={16} className="text-[#0BC48B] animate-in zoom-in duration-300" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Select Profile</label>
                                <div className="relative">
                                    <select
                                        onChange={(e) => handleTeacherSelect(e.target.value)}
                                        className="w-full bg-white border border-slate-200 px-6 py-4 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option value="">Select Name</option>
                                        {filteredTeachersList.map(t => (
                                            <option key={t.id} value={t.id}>{t.full_name} ({t.sectionNames.join(", ")})</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {!needsProfileLinking && (
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="First Name" placeholder="Jane" type="text" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                                <InputGroup label="Last Name" placeholder="Doe" type="text" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                            </div>
                        )}


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

                        <button
                            disabled={loading}
                            onClick={handleSave}
                            className="w-full bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all mt-4 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? "Registering..." : "Provision User"}
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

const UserCard = ({ first_name, last_name, role, email, phone_number, is_active }) => {
    const fullName = `${first_name} ${last_name}`;
    const roleName = role ? role.name : "No Role";

    return (
        <div className="p-5 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors group flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm text-[#0BC48B] overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`} alt="avatar" />
                </div>
                <div>
                    <h4 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                        {fullName}
                        {is_active ? (
                            <span className="w-2 h-2 rounded-full bg-[#0BC48B] shadow-[0_0_8px_rgba(11,196,139,0.5)]"></span>
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                        )}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {roleName}
                    </p>
                </div>
            </div>

            <div className="hidden lg:block text-right pr-6">
                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-slate-600 mb-1">
                    <Mail size={12} className="text-slate-400" />
                    {email}
                </div>
                <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-slate-400">
                    <Phone size={12} className="text-slate-300" />
                    {phone_number || "No Phone"}
                </div>
            </div>

            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${roleName === "SuperAdmin" ? "bg-slate-900 border-slate-800 text-white" :
                roleName === "Teacher" ? "bg-[#0BC48B]/10 border-[#0BC48B]/20 text-[#0BC48B]" :
                    "bg-indigo-50 border-indigo-100 text-indigo-500"
                }`}>
                {roleName}
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
