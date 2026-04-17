import React, { useState, useEffect } from 'react';
import { Save, UserPlus, GraduationCap, BookOpen, Layers, CheckCircle2, Search, Pencil, X, ChevronDown, Trash2 } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1/school";

export const TeacherManagementModule = () => {
    const [teachers, setTeachers] = useState([]);
    const [dynamicSubjects, setDynamicSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        full_name: "",
        subjects: [],
        qualification: "",
        categories: []
    });

    const categories = [
        "Kindergarten", "LP", "UP", "High School", "Higher Secondary"
    ];

    const API_ACADEMICS = "http://localhost:8000/api/v1/academics";

    useEffect(() => {
        fetchTeachers();
        fetchSubjects();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/teachers`);
            const data = await response.json();
            // Map backend sections to frontend categories
            const mapped = data.map(t => ({
                ...t,
                categories: t.sections.map(s => s.name)
            }));
            setTeachers(mapped);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await fetch(`${API_ACADEMICS}/all-subjects`);
            const data = await response.json();
            setDynamicSubjects(data);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleItem = (field, item) => {
        setFormData(prev => {
            const isSelected = prev[field].includes(item);
            if (isSelected) {
                return { ...prev, [field]: prev[field].filter(i => i !== item) };
            } else {
                return { ...prev, [field]: [...prev[field], item] };
            }
        });
    };

    const addSubject = (val) => {
        if (val && !formData.subjects.includes(val)) {
            setFormData(prev => ({ ...prev, subjects: [...prev.subjects, val] }));
        }
    };

    const removeSubject = (val) => {
        setFormData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s !== val) }));
    };

    const handleSave = async () => {
        if (!formData.full_name || formData.subjects.length === 0 || formData.categories.length === 0) {
            alert("Please fill name, subjects and select at least one category.");
            return;
        }

        const payload = {
            full_name: formData.full_name,
            qualification: formData.qualification,
            subjects: formData.subjects,
            section_names: formData.categories
        };

        try {
            const url = editingId ? `${API_BASE_URL}/teachers/${editingId}` : `${API_BASE_URL}/teachers`;
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                await fetchTeachers();
                setEditingId(null);
                setFormData({ full_name: "", subjects: [], qualification: "", categories: [] });
            }
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this teacher?")) return;
        try {
            await fetch(`${API_BASE_URL}/teachers/${id}`, { method: "DELETE" });
            fetchTeachers();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleEdit = (teacher) => {
        setFormData({
            full_name: teacher.full_name,
            subjects: teacher.subjects || [],
            qualification: teacher.qualification,
            categories: teacher.categories
        });
        setEditingId(teacher.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ full_name: "", subjects: [], qualification: "", categories: [] });
    };

    const filteredTeachers = teachers.filter(t =>
        t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.subjects || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Teacher Management</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Register and manage faculty members across sections</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="px-4 py-2 bg-[#0BC48B]/10 text-[#0BC48B] rounded-xl text-[10px] font-black uppercase tracking-widest">Active Staff: {teachers.length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Card */}
                <div className="xl:col-span-1 border-2 border-slate-900/5 bg-white rounded-[3rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 relative h-max">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-xl tracking-tight leading-none">
                                    {editingId ? "Edit Profile" : "Registration"}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                                    {editingId ? "Modify Authority" : "New Faculty Profile"}
                                </p>
                            </div>
                        </div>
                        {editingId && (
                            <button onClick={cancelEdit} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-7">
                        <InputGroup
                            label="Full Name"
                            placeholder="e.g. Dr. Robert Wilson"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange("full_name", e.target.value)}
                        />

                        <div>
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Subjects Taught</label>

                            {/* Tags display */}
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                                {formData.subjects.map(s => (
                                    <span key={s} className="bg-[#0BC48B]/10 text-[#0BC48B] px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-[#0BC48B]/20 animate-in zoom-in duration-300">
                                        {s}
                                        <X size={12} className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => removeSubject(s)} />
                                    </span>
                                ))}
                                {formData.subjects.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic py-1.5 ml-1">No subjects selected...</span>}
                            </div>

                            <div className="relative group">
                                <select
                                    onChange={(e) => {
                                        addSubject(e.target.value);
                                        e.target.value = ""; // Reset select
                                    }}
                                    value=""
                                    className="w-full bg-slate-50/50 border-2 border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>{dynamicSubjects.length > 0 ? "Click to select subjects..." : "No subjects defined in Repository"}</option>
                                    {dynamicSubjects.filter(s => !formData.subjects.includes(s)).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-[#0BC48B] transition-colors" size={16} />
                            </div>
                        </div>

                        <InputGroup
                            label="Qualification"
                            placeholder="PhD, M.Ed"
                            value={formData.qualification}
                            onChange={(e) => handleInputChange("qualification", e.target.value)}
                        />

                        {/* Section Categories Checkboxes */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 ml-1">Teaching Sections</label>
                            <div className="grid grid-cols-1 gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleItem("categories", cat)}
                                        className={`flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${formData.categories.includes(cat)
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20"
                                            : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                                            }`}
                                    >
                                        {cat}
                                        {formData.categories.includes(cat) && <CheckCircle2 size={16} className="text-[#0BC48B]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className={`w-full ${editingId ? "bg-slate-900" : "bg-[#0BC48B]"} text-white px-8 py-5 rounded-[2rem] font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all mt-6`}
                        >
                            <Save size={18} />
                            {editingId ? "Update Profile" : "Save Teacher Profile"}
                        </button>
                    </div>
                </div>

                {/* Teacher List */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden h-full flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0BC48B]/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-4">
                            <div>
                                <h3 className="font-black text-slate-800 text-xl tracking-tight leading-none">Faculty Directory</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Directory search & management</p>
                            </div>

                            <div className="relative w-full md:max-w-xs group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0BC48B] transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search name or subject..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-3 rounded-2xl text-xs font-semibold outline-none focus:ring-4 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                            {filteredTeachers.map(teacher => (
                                <TeacherCard
                                    key={teacher.id}
                                    teacher={teacher}
                                    onEdit={() => handleEdit(teacher)}
                                    onDelete={() => handleDelete(teacher.id)}
                                />
                            ))}
                            {filteredTeachers.length === 0 && (
                                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No faculty members found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeacherCard = ({ teacher, onEdit, onDelete }) => {
    return (
        <div className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-[#0BC48B]/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-[#0BC48B] transition-colors relative">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 text-lg tracking-tight mb-1">{teacher.full_name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {teacher.subjects.map(s => (
                                <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-md text-[9px] font-black uppercase tracking-tight">{s}</span>
                            ))}
                            <span className="w-1 h-1 rounded-full bg-slate-200 mx-1"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{teacher.qualification}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div className="flex flex-wrap gap-2 md:justify-end">
                        {teacher.categories.map(cat => (
                            <div key={cat} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0BC48B]"></span>
                                {cat}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <button
                            onClick={onEdit}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-[#0BC48B] hover:text-white transition-all border border-slate-100"
                        >
                            <Pencil size={12} />
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center justify-center p-2 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, placeholder, type = "text", value, onChange }) => (
    <div className="group">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-[#0BC48B] transition-colors">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50/50 border-2 border-slate-100 px-6 py-4 rounded-3xl text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm"
        />
    </div>
);
