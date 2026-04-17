import React, { useState, useEffect } from 'react';
import { Save, Plus, BookText, ChevronDown, Edit, Trash2, CheckCircle2, ArrowLeft, XCircle } from 'lucide-react';

export const SubjectManagementModule = ({ onBack }) => {
    const [classSubjects, setClassSubjects] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedLevel, setSelectedLevel] = useState("HIGH SCHOOL");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        grade: "",
        stream: "Science",
        subjectList: [""]
    });

    const API_ACADEMICS = "http://127.0.0.1:8000/api/v1/academics";
    const API_SCHOOL = "http://127.0.0.1:8000/api/v1/school";

    const levelConfigs = {
        "KG": ["LKG", "UKG"],
        "LP": ["Class 1", "Class 2", "Class 3", "Class 4"],
        "UP": ["Class 5", "Class 6", "Class 7"],
        "HIGH SCHOOL": ["Class 8", "Class 9", "Class 10"],
        "HIGHERSECONDARY": ["Class 11", "Class 12"]
    };

    const fetchLevelData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch available classes for this level (from SCHOOL app)
            const cRes = await fetch(`${API_SCHOOL}/sections/${selectedLevel}/classes`);
            const cData = await cRes.json();
            setAvailableClasses(cData);

            // 2. Fetch existing subjects for this level (from ACADEMICS app)
            const curRes = await fetch(`${API_ACADEMICS}/subjects/${selectedLevel}`);
            const curData = await curRes.json();
            setClassSubjects(curData);

            // Auto-select first available class based on what is not yet configured
            const remaining = levelConfigs[selectedLevel].filter(cls => !curData.some(sub => sub.target_class === cls));
            if (!isEditing) {
                setFormData(prev => ({ ...prev, grade: remaining.length > 0 ? remaining[0] : "" }));
            }
        } catch (error) {
            console.error("Error fetching level data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLevelData();
        if (!isEditing) {
            setFormData(prev => ({
                ...prev,
                stream: "",
                subjectList: [""]
            }));
        }
    }, [selectedLevel]);

    const addSubjectField = () => {
        setFormData(prev => ({ ...prev, subjectList: [...prev.subjectList, ""] }));
    };

    const removeSubjectField = (index) => {
        if (formData.subjectList.length > 1) {
            const newList = [...formData.subjectList];
            newList.splice(index, 1);
            setFormData(prev => ({ ...prev, subjectList: newList }));
        }
    };

    const handleSubjectChange = (index, value) => {
        const newList = [...formData.subjectList];
        newList[index] = value;
        setFormData(prev => ({ ...prev, subjectList: newList }));
    };

    const handleSave = async () => {
        const validSubjects = formData.subjectList.filter(s => s.trim() !== "");
        if (!formData.grade || validSubjects.length === 0) {
            alert("Please select a Class and add at least one Subject.");
            return;
        }

        const payload = {
            target_class: formData.grade,
            segment: selectedLevel,
            subjects: validSubjects
        };

        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `${API_ACADEMICS}/subjects/${editId}` : `${API_ACADEMICS}/subjects`;

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Subject configuration saved!");
                setIsEditing(false);
                setEditId(null);
                fetchLevelData();
                setFormData(prev => ({
                    ...prev,
                    stream: "",
                    subjectList: [""]
                }));
            }
        } catch (error) {
            console.error("Error saving curriculum:", error);
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setEditId(item.id);
        setFormData({
            grade: item.target_class,
            stream: "",
            subjectList: [...item.subjects]
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this subject configuration?")) return;
        try {
            const response = await fetch(`${API_ACADEMICS}/subjects/${id}`, { method: "DELETE" });
            if (response.ok) {
                setClassSubjects(classSubjects.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Error deleting curriculum:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 w-full max-w-5xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Subject Repository</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Curriculum assignment per grade level</p>
                    </div>
                </div>
            </div>

            {/* Level Selection */}
            <div className="bg-slate-900 rounded-[2.5rem] p-4 flex flex-wrap items-center justify-center gap-2 shadow-xl shadow-slate-900/20">
                {Object.keys(levelConfigs).map((level) => (
                    <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${selectedLevel === level
                            ? "bg-[#0BC48B] text-white shadow-lg shadow-[#0BC48B]/30"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                    >
                        <div className={`w-3 h-3 rounded-full border-2 ${selectedLevel === level ? "border-white" : "border-slate-600"} flex items-center justify-center`}>
                            {selectedLevel === level && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        {level}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Entry Form */}
                <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 h-max">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-[#0BC48B]/10 rounded-2xl flex items-center justify-center text-[#0BC48B]">
                            <BookText size={20} />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl tracking-tight">{isEditing ? "Edit Config" : "New Config"}</h3>
                    </div>

                    <div className="space-y-6">
                        <SelectGroup
                            label="Target Class"
                            options={levelConfigs[selectedLevel].filter(cls => 
                                isEditing 
                                    ? cls === formData.grade 
                                    : !classSubjects.some(sub => sub.target_class === cls)
                            )}
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        />

                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Subjects List</label>
                            {formData.subjectList.map((sub, idx) => (
                                <div key={idx} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                                    <input
                                        type="text"
                                        placeholder={`Subject ${idx + 1}`}
                                        value={sub}
                                        onChange={(e) => handleSubjectChange(idx, e.target.value)}
                                        className="flex-1 bg-slate-50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all"
                                    />
                                    {formData.subjectList.length > 1 && (
                                        <button
                                            onClick={() => removeSubjectField(idx)}
                                            className="text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addSubjectField}
                                className="flex items-center gap-2 text-[10px] font-black text-[#0BC48B] uppercase tracking-widest hover:translate-x-1 transition-all"
                            >
                                <Plus size={16} />
                                Add More Subject
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-slate-900 text-white px-8 py-5 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all mt-4"
                        >
                            {isEditing ? <CheckCircle2 size={20} /> : <Save size={20} />}
                            {isEditing ? "Update Configuration" : "Save All Subjects"}
                        </button>
                    </div>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Stored Configurations ({classSubjects.length})</h4>
                    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 no-scrollbar pb-10">
                        {classSubjects.map(item => (
                            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 relative group hover:shadow-2xl transition-all">
                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-[#0BC48B]/10 hover:text-[#0BC48B] transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center mb-4">
                                    <h5 className="font-black text-slate-900 text-3xl tracking-tighter">{item.target_class}</h5>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                    {item.subjects.map((n, i) => (
                                        <span key={i} className="px-4 py-2 bg-[#0BC48B]/10 text-[#0BC48B] rounded-xl text-xs font-black uppercase tracking-tight">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SelectGroup = ({ label, options, value, onChange }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] appearance-none cursor-pointer"
            >
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);

