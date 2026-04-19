"use client";
import React, { useState, useEffect } from 'react';
import { Save, Plus, BookOpen, Users, MapPin, ChevronDown, Edit, Trash2, CheckCircle2, BookMarked } from 'lucide-react';
import { SubjectManagementModule } from './SubjectManagement';
import config from "@/config";

export const SchoolStructureModule = () => {
    const [view, setView] = useState("Classroom"); 
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedLevel, setSelectedLevel] = useState("HIGH SCHOOL");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        grade: "",
        section: "",
        stream: "",
        teacherId: "",
        capacity: "40",
        room: ""
    });

    const API_BASE = `${config.API_BASE_URL}/v1/school`;

    
    const levelConfigs = {
        "KG": ["LKG", "UKG"],
        "LP": ["Class 1", "Class 2", "Class 3", "Class 4"],
        "UP": ["Class 5", "Class 6", "Class 7"],
        "HIGH SCHOOL": ["Class 8", "Class 9", "Class 10"],
        "HIGHERSECONDARY": ["Class 11", "Class 12"]
    };

    // Fetch teachers and existing classes for the selected level
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch teachers for this segment
            const tRes = await fetch(`${API_BASE}/teachers`);
            const tData = await tRes.json();
            setTeachers(tData);

            // Fetch classes for this segment
            const cRes = await fetch(`${API_BASE}/sections/${selectedLevel}/classes`);
            const cData = await cRes.json();
            setClasses(cData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Map to translate SchoolStructure segments to TeacherManagement categories
    const segmentMap = {
        "KG": "Kindergarten",
        "LP": "LP",
        "UP": "UP",
        "HIGH SCHOOL": "High School",
        "HIGHERSECONDARY": "Higher Secondary"
    };

    // Derived teachers list based on selectedLevel
    const filteredTeachersForLevel = teachers.filter(t => 
        t.sections && t.sections.some(s => s.name === segmentMap[selectedLevel])
    );

    useEffect(() => {
        fetchData();
        if (!isEditing) {
            setFormData(prev => ({ 
                ...prev, 
                grade: levelConfigs[selectedLevel][0],
                stream: "",
                teacherId: ""
            }));
        }
    }, [selectedLevel]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.grade || !formData.section || !formData.capacity) {
            alert("Please fill out Grade, Section identifier, and Capacity.");
            return;
        }

        const payload = {
            class_name: formData.grade,
            section_identifier: formData.section,
            stream: selectedLevel === "HIGHERSECONDARY" ? formData.stream : null,
            room_number: formData.room || "TBD",
            capacity: parseInt(formData.capacity),
            section_name: selectedLevel,
            class_teacher_id: formData.teacherId ? parseInt(formData.teacherId) : null
        };

        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `${API_BASE}/classes/${editId}` : `${API_BASE}/classes`;
            
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(isEditing ? "Configuration updated!" : "Class created!");
                await fetchData(); // Refresh list
                
                // Reset form and state
                setIsEditing(false);
                setEditId(null);
                setFormData({
                    grade: levelConfigs[selectedLevel][0],
                    section: "",
                    stream: "",
                    teacherId: "",
                    capacity: "40",
                    room: ""
                });
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "Failed to save class configuration.");
            }
        } catch (error) {
            console.error("Error saving class:", error);
            alert("An error occurred while connecting to the server.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;
        
        try {
            const response = await fetch(`${API_BASE}/classes/${id}`, { method: "DELETE" });
            if (response.ok) {
                setClasses(classes.filter(cls => cls.id !== id));
            }
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };

    const handleEdit = (cls) => {
        // Translation from backend model to frontend form
        setIsEditing(true);
        setEditId(cls.id);
        setFormData({
            grade: cls.class_name,
            section: cls.section_identifier,
            stream: cls.stream || "",
            teacherId: cls.class_teacher_id || "",
            capacity: cls.capacity.toString(),
            room: cls.room_number
        });
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
                        
                        <div className="group/select transition-all duration-300">
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Class Teacher</label>
                            <div className="relative">
                                <select 
                                    value={formData.teacherId}
                                    onChange={(e) => handleInputChange("teacherId", e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">{filteredTeachersForLevel.length > 0 ? "Select Teacher..." : "No teachers in this segment"}</option>
                                    {filteredTeachersForLevel.map(t => (
                                        <option key={t.id} value={t.id}>{t.full_name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>
                        
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
                            disabled={isLoading}
                            className={`w-full ${isEditing ? 'bg-[#0BC48B]' : 'bg-slate-900'} text-white px-8 py-5 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all mt-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isEditing ? <CheckCircle2 size={20} /> : <Save size={20} />}
                            {isEditing ? "Update Configuration" : "Save & Create Class"}
                        </button>
                        
                        {isEditing && (
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditId(null);
                                    setFormData({ grade: levelConfigs[selectedLevel][0], section: "", teacherId: "", capacity: "40", room: "" });
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

                        {isLoading ? (
                            <div className="py-20 text-center animate-pulse">
                                <p className="text-slate-300 font-black text-xs uppercase tracking-[0.3em]">Loading Classes...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {classes.map(cls => (
                                    <ClassCard 
                                        key={cls.id}
                                        data={cls}
                                        selectedLevel={selectedLevel}
                                        onEdit={() => handleEdit(cls)}
                                        onDelete={() => handleDelete(cls.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && classes.length === 0 && (
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

const ClassCard = ({ data, onEdit, onDelete, selectedLevel }) => {
    // Map from backend fields
    const { class_name, section_identifier, class_teacher, capacity, room_number, stream } = data;

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
                    {section_identifier || "?"}
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-lg tracking-tight leading-tight">{class_name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            {selectedLevel}
                        </span>
                        {stream && (
                            <span className="inline-block px-3 py-1 bg-[#0BC48B]/10 rounded-full text-[8px] font-black text-[#0BC48B] uppercase tracking-widest">
                                {stream}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#0BC48B] uppercase tracking-widest mt-4">
                        <Users size={12} strokeWidth={3} />
                        <span>{class_teacher ? class_teacher.full_name : "Unassigned"}</span>
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
                        <p className="text-xs font-black text-slate-900 uppercase">#{room_number}</p>
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

