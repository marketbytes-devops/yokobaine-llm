import React, { useState } from 'react';
import { Save, Plus, BookOpen, Users, MapPin, ChevronDown } from 'lucide-react';

export const SchoolStructureModule = () => {
    const [classes, setClasses] = useState([
        { id: 1, grade: "Grade 10", section: "A", teacher: "Sarah Jenkins", capacity: "40", enrolled: "38", room: "101" },
        { id: 2, grade: "Grade 10", section: "B", teacher: "Michael Davis", capacity: "40", enrolled: "40", room: "102" },
        { id: 3, grade: "Grade 9", section: "A", teacher: "Emily Roberts", capacity: "35", enrolled: "32", room: "204" },
        { id: 4, grade: "Grade 8", section: "C", teacher: "Robert Chen", capacity: "35", enrolled: "28", room: "305" }
    ]);

    const [formData, setFormData] = useState({
        grade: "",
        section: "",
        teacher: "",
        capacity: "",
        room: ""
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.grade || !formData.section || !formData.capacity) {
            alert("Please fill out Grade, Section, and Capacity.");
            return;
        }

        const newClass = {
            id: Date.now(),
            grade: formData.grade,
            section: formData.section,
            teacher: formData.teacher === "" || formData.teacher === "Select Teacher..." ? "Unassigned" : formData.teacher,
            capacity: formData.capacity,
            enrolled: "0",
            room: formData.room || "TBD"
        };

        setClasses([newClass, ...classes]);
        
        setFormData({
            grade: "",
            section: "",
            teacher: "",
            capacity: "",
            room: ""
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Classes & Sections</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Define the academic structure of your institution</p>
                </div>
                <button className="bg-[#0BC48B] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-3 shadow-lg shadow-[#0BC48B]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all w-full md:w-auto justify-center">
                    <Plus size={18} />
                    Add Classroom
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Card */}
                <div className="xl:col-span-1 bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm relative h-max">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#0BC48B]/10 rounded-2xl flex items-center justify-center text-[#0BC48B]">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg tracking-tight leading-none">New Setup</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Class Configuration</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <InputGroup 
                            label="Grade / Class Level" 
                            placeholder="e.g., Grade 8" 
                            type="text" 
                            value={formData.grade}
                            onChange={(e) => handleInputChange("grade", e.target.value)}
                        />
                        <InputGroup 
                            label="Section Name" 
                            placeholder="e.g., A, B, C" 
                            type="text" 
                            value={formData.section}
                            onChange={(e) => handleInputChange("section", e.target.value)}
                        />
                        
                        <SelectGroup 
                            label="Class Teacher Assigned" 
                            options={['Select Teacher...', 'Sarah Jenkins', 'Michael Davis', 'Emily Roberts', 'Robert Chen']} 
                            value={formData.teacher}
                            onChange={(e) => handleInputChange("teacher", e.target.value)}
                        />
                        
                        <InputGroup 
                            label="Maximum Capacity" 
                            placeholder="e.g., 40" 
                            type="number" 
                            value={formData.capacity}
                            onChange={(e) => handleInputChange("capacity", e.target.value)}
                        />
                        <InputGroup 
                            label="Room Number (Optional)" 
                            placeholder="e.g., Wing B - 104" 
                            type="text" 
                            value={formData.room}
                            onChange={(e) => handleInputChange("room", e.target.value)}
                        />
                        
                        <button 
                            onClick={handleSave}
                            className="w-full bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all mt-4"
                        >
                            <Save size={18} />
                            Save Configuration
                        </button>
                    </div>
                </div>

                {/* Existing Classes List */}
                <div className="xl:col-span-2 bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-black text-slate-800 text-lg tracking-tight leading-none">Configured Classrooms</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active class segments ({classes.length} total)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {classes.map(cls => (
                            <ClassCard 
                                key={cls.id}
                                grade={cls.grade} 
                                section={cls.section} 
                                teacher={cls.teacher} 
                                capacity={cls.capacity} 
                                enrolled={cls.enrolled} 
                                room={cls.room} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClassCard = ({ grade, section, teacher, capacity, enrolled, room }) => {
    const fillPercentage = (parseInt(enrolled) / parseInt(capacity)) * 100;
    const isFull = fillPercentage >= 100;

    return (
        <div className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-[#0BC48B] text-lg shadow-sm">
                        {section}
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 tracking-tight">{grade}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            <Users size={12} />
                            <span>{teacher}</span>
                        </div>
                    </div>
                </div>
                <div className={`px-3 py-1 flex items-center gap-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isFull ? 'bg-rose-100 text-rose-500' : 'bg-[#0BC48B]/10 text-[#0BC48B]'}`}>
                    <MapPin size={10} />
                    Room {room}
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-400">Capacity</span>
                    <span className="text-slate-700">{enrolled} / {capacity}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-rose-500' : 'bg-[#0BC48B]'}`} style={{ width: `${Math.min(fillPercentage, 100)}%` }}></div>
                </div>
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
