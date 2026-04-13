import React, { useState, useEffect } from 'react';
import { Save, Plus, BookOpen, Users, MapPin, ChevronDown, Edit, Trash2, CheckCircle2, BookMarked } from 'lucide-react';
import { SubjectManagementModule } from './SubjectManagement';

export const SchoolStructureModule = () => {
    const [view, setView] = useState("Classroom"); // "Classroom" or "Subject"
    const [classes, setClasses] = useState([
        { id: 1, grade: "Class 10", section: "A", teacher: "Sarah Jenkins", capacity: "40", enrolled: "38", room: "101", level: "HIGH SCHOOL" },
        { id: 2, grade: "Class 10", section: "B", teacher: "Michael Davis", capacity: "40", enrolled: "40", room: "102", level: "HIGH SCHOOL" },
        { id: 3, grade: "Class 3", section: "A", teacher: "Emily Roberts", capacity: "35", enrolled: "32", room: "204", level: "LP" },
        { id: 4, grade: "Class 6", section: "C", teacher: "Robert Chen", capacity: "35", enrolled: "28", room: "305", level: "UP" }
    ]);

    const [selectedLevel, setSelectedLevel] = useState("HIGH SCHOOL");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        grade: "",
        section: "",
        stream: "", // New field for Higher Secondary
        teacher: "",
        capacity: "",
        room: ""
    });

    // Level-based class options
    const levelConfigs = {
        "KG": ["LKG", "UKG"],
        "LP": ["Class 1", "Class 2", "Class 3", "Class 4"],
        "UP": ["Class 5", "Class 6", "Class 7"],
        "HIGH SCHOOL": ["Class 8", "Class 9", "Class 10"],
        "HIGHERSECONDARY": ["Class 11", "Class 12"]
    };

    // Auto-select first class when level changes
    useEffect(() => {
        if (!isEditing) {
            setFormData(prev => ({ 
                ...prev, 
                grade: levelConfigs[selectedLevel][0],
                stream: "" // Clear stream when changing level
            }));
        }
    }, [selectedLevel]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.grade || !formData.section || !formData.capacity) {
            alert("Please fill out Grade, Section, and Capacity.");
            return;
        }

        if (isEditing) {
            setClasses(classes.map(cls => cls.id === editId ? { ...cls, ...formData, level: selectedLevel } : cls));
            setIsEditing(false);
            setEditId(null);
        } else {
            const newClass = {
                id: Date.now(),
                grade: formData.grade,
                section: formData.section,
                stream: selectedLevel === "HIGHERSECONDARY" ? formData.stream : "",
                teacher: formData.teacher === "" || formData.teacher === "Select Teacher..." ? "Unassigned" : formData.teacher,
                capacity: formData.capacity,
                enrolled: "0",
                room: formData.room || "TBD",
                level: selectedLevel
            };
            setClasses([newClass, ...classes]);
        }
        
        setFormData({
            grade: levelConfigs[selectedLevel][0],
            section: "",
            stream: "",
            teacher: "",
            capacity: "",
            room: ""
        });
    };

    const handleEdit = (cls) => {
        setIsEditing(true);
        setEditId(cls.id);
        setSelectedLevel(cls.level);
        setFormData({
            grade: cls.grade,
            section: cls.section,
            stream: cls.stream || "",
            teacher: cls.teacher,
            capacity: cls.capacity,
            room: cls.room
        });
    };


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this class configuration?")) {
            setClasses(classes.filter(cls => cls.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">School Structure</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Define academic levels and classroom mapping</p>
                </div>
                
                {view === "Classroom" && (
                    <button 
                        onClick={() => setView("Subject")}
                        className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-4 hover:shadow-2xl hover:bg-[#0BC48B] transition-all group"
                    >
                        <BookMarked size={18} className="text-[#0BC48B] group-hover:text-white" />
                        Subject Repository
                    </button>
                )}
            </div>

            {view === "Subject" ? (
                <SubjectManagementModule onBack={() => setView("Classroom")} />
            ) : (
                <>
                {/* Level Selection Checkboxes */}
            <div className=" flex flex-wrap items-center justify-center gap-2">
                {Object.keys(levelConfigs).map((level) => (
                    <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                            selectedLevel === level 
                            ? "bg-[#0BC48B] text-white shadow-lg shadow-[#0BC48B]/30 scale-105" 
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedLevel === level ? "border-white" : "border-slate-600"}`}>
                            {selectedLevel === level && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        {level}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Card */}
                <div className="xl:col-span-1 bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 relative h-max">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-[#0BC48B]/10 rounded-[1.5rem] flex items-center justify-center text-[#0BC48B] shadow-sm">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none">{isEditing ? "Update Class" : "New Classroom"}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{selectedLevel} Config</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SelectGroup 
                            label="Class / Grade" 
                            options={levelConfigs[selectedLevel]} 
                            value={formData.grade}
                            onChange={(e) => handleInputChange("grade", e.target.value)}
                        />
                        
                        {selectedLevel === "HIGHERSECONDARY" && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <InputGroup 
                                    label="Academic Stream" 
                                    placeholder="e.g., Science, Commerce" 
                                    type="text" 
                                    value={formData.stream}
                                    onChange={(e) => handleInputChange("stream", e.target.value)}
                                />
                            </div>
                        )}

                        <InputGroup 
                            label="Section Identifier" 
                            placeholder="e.g., A or Jupiter" 
                            type="text" 
                            value={formData.section}
                            onChange={(e) => handleInputChange("section", e.target.value)}
                        />
                        
                        <SelectGroup 
                            label="Class Teacher" 
                            options={['Select Teacher...', 'Sarah Jenkins', 'Michael Davis', 'Emily Roberts', 'Robert Chen']} 
                            value={formData.teacher}
                            onChange={(e) => handleInputChange("teacher", e.target.value)}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup 
                                label="Capacity" 
                                placeholder="40" 
                                type="number" 
                                value={formData.capacity}
                                onChange={(e) => handleInputChange("capacity", e.target.value)}
                            />
                            <InputGroup 
                                label="Room No" 
                                placeholder="101" 
                                type="text" 
                                value={formData.room}
                                onChange={(e) => handleInputChange("room", e.target.value)}
                            />
                        </div>
                        
                        <button 
                            onClick={handleSave}
                            className={`w-full ${isEditing ? 'bg-[#0BC48B]' : 'bg-slate-900'} text-white px-8 py-5 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all mt-6`}
                        >
                            {isEditing ? <CheckCircle2 size={20} /> : <Save size={20} />}
                            {isEditing ? "Update Configuration" : "Save & Create Class"}
                        </button>
                        
                        {isEditing && (
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditId(null);
                                    setFormData({ grade: levelConfigs[selectedLevel][0], section: "", teacher: "", capacity: "", room: "" });
                                }}
                                className="w-full text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 hover:text-rose-500 transition-colors"
                            >
                                Cancel Selection
                            </button>
                        )}
                    </div>
                </div>

                {/* Existing Classes List */}
                <div className="xl:col-span-2 bg-slate-50/50 rounded-[3.5rem] p-1 border border-slate-100/50 shadow-inner">
                    <div className="bg-white rounded-[3.2rem] p-10 h-full">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none">Configured Classrooms</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active institution segments</p>
                            </div>
                            <div className="px-5 py-2 bg-slate-100 rounded-full text-slate-900 font-black text-[10px] uppercase tracking-widest">
                                {classes.length} Segments
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {classes.map(cls => (
                                <ClassCard 
                                    key={cls.id}
                                    data={cls}
                                    onEdit={() => handleEdit(cls)}
                                    onDelete={() => handleDelete(cls.id)}
                                />
                            ))}
                        </div>

                        {classes.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-slate-300 font-black text-xs uppercase tracking-[0.3em]">No classes configured yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
                </>
            )}
        </div>
    );
};

const ClassCard = ({ data, onEdit, onDelete }) => {
    const { grade, section, teacher, capacity, enrolled, room, level } = data;
    const fillPercentage = (parseInt(enrolled) / parseInt(capacity)) * 100;
    const isFull = fillPercentage >= 100;

    return (
        <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-[#0BC48B] hover:shadow-2xl hover:shadow-[#0BC48B]/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="w-8 h-8 rounded-lg bg-[#0BC48B]/10 text-[#0BC48B] flex items-center justify-center hover:bg-[#0BC48B] hover:text-white transition-all">
                    <Edit size={14} />
                </button>
                <button onClick={onDelete} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-2xl shadow-lg ring-4 ring-slate-100">
                    {section}
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{grade}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {level}
                        </span>
                        {data.stream && (
                            <span className="inline-block px-3 py-1 bg-[#0BC48B]/10 rounded-full text-[8px] font-black text-[#0BC48B] uppercase tracking-widest">
                                {data.stream}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#0BC48B] uppercase tracking-widest mt-4">
                        <Users size={12} strokeWidth={3} />
                        <span>{teacher}</span>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Room</p>
                        <p className="text-xs font-black text-slate-900 uppercase">#{room}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Capacity</p>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-900">{capacity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, placeholder, type, value, onChange }) => (
    <div className="group/input transition-all duration-300">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm" 
        />
    </div>
);

const SelectGroup = ({ label, options, value, onChange }) => (
    <div className="group/select transition-all duration-300">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select 
                value={value}
                onChange={onChange}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
            >
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/select:text-[#0BC48B] transition-colors">
                <ChevronDown size={20} />
            </div>
        </div>
    </div>
);

