import React, { useState, useEffect } from 'react';
import { Save, UserPlus, FileText, Search, GraduationCap, Users } from 'lucide-react';

export const StudentLedgerModule = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [students, setStudents] = useState([
        { id: 1, admissionId: "YKB-2024-001", studentName: "Arjun Sharma", dob: "2010-05-15", bloodGroup: "O+", grade: "Class 10", level: "HIGH SCHOOL", stream: "", parentNamePhone: "Rajesh Sharma 9876543210", homeAddress: "Block A, New Delhi", emergencyContact: "9998887770" }
    ]);

    const [selectedLevel, setSelectedLevel] = useState("LP");

    const levelConfigs = {
        "KG": ["LKG", "UKG"],
        "LP": ["Class 1", "Class 2", "Class 3", "Class 4"],
        "UP": ["Class 5", "Class 6", "Class 7"],
        "HIGH SCHOOL": ["Class 8", "Class 9", "Class 10"],
        "HIGHERSECONDARY": ["Class 11", "Class 12"]
    };

    const streamOptions = ["Science", "Commerce", "Humanities"];

    const [form, setForm] = useState({
        admissionId: '',
        studentName: '',
        dob: '',
        bloodGroup: '',
        grade: 'Class 1',
        stream: '',
        parentNamePhone: '',
        homeAddress: '',
        emergencyContact: ''
    });

    useEffect(() => {
        setForm(prev => ({ 
            ...prev, 
            grade: levelConfigs[selectedLevel][0],
            stream: selectedLevel === "HIGHERSECONDARY" ? "Science" : ""
        }));
    }, [selectedLevel]);

    const handleSave = () => {
        if (!form.admissionId || !form.studentName) {
            alert("Admission ID and Student Name are required.");
            return;
        }
        
        const newStudent = { 
            ...form, 
            id: Date.now(),
            level: selectedLevel 
        };
        
        setStudents([newStudent, ...students]);
        setForm({
            admissionId: '', studentName: '', dob: '', bloodGroup: '', 
            grade: levelConfigs[selectedLevel][0],
            stream: selectedLevel === "HIGHERSECONDARY" ? "Science" : "",
            parentNamePhone: '', homeAddress: '', emergencyContact: ''
        });
        setActiveTab('directory');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Student & Parent Ledger</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Comprehensive enrollment and guardian management</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] self-start md:self-auto shadow-inner">
                    <button onClick={() => setActiveTab('add')} className={`px-8 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Enroll Student</button>
                    <button onClick={() => setActiveTab('directory')} className={`px-8 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>View Ledger ({students.length})</button>
                </div>
            </div>

            {/* Content Switch */}
            {activeTab === 'add' ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    {/* Level Selection Bar */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-4 flex flex-wrap items-center justify-center gap-2 shadow-xl shadow-slate-900/20">
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
                                <div className={`w-3 h-3 rounded-full border-2 ${selectedLevel === level ? "border-white" : "border-slate-600"} flex items-center justify-center`}>
                                    {selectedLevel === level && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                {level}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Student Data Section */}
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">Student Identity</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Information & Classification</p>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Admission ID" placeholder="YKB-2024-001" value={form.admissionId} onChange={e => setForm({...form, admissionId: e.target.value})} />
                                    <InputGroup label="Full Name" placeholder="Student name" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Date of Birth" type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                                    <SelectGroup label="Blood Group" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} options={['Select...', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                    <SelectGroup label="Grade / Class" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} options={levelConfigs[selectedLevel]} />
                                    {selectedLevel === "HIGHERSECONDARY" && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <SelectGroup label="Academic Stream" value={form.stream} onChange={e => setForm({...form, stream: e.target.value})} options={streamOptions} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Parent Data Section */}
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0BC48B]/5 rounded-bl-[10rem] pointer-events-none" />
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-[#0BC48B]/10 flex items-center justify-center text-[#0BC48B] shadow-sm">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">Guardian Link</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Contact & Security Verification</p>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div>
                                    <InputGroup label="Primary Guardian & Phone" placeholder="John Doe 9876543210" value={form.parentNamePhone} onChange={e => setForm({...form, parentNamePhone: e.target.value})} />
                                    <div className="flex items-center gap-2 mt-3 px-2">
                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Phone number used for Parent App Login</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Home Address</label>
                                    <textarea value={form.homeAddress} onChange={e => setForm({...form, homeAddress: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[2rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all min-h-[140px] resize-none" placeholder="Provide full residential details..." />
                                </div>
                                <InputGroup label="Emergency Contact" type="number" placeholder="Alternate phone" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} />
                            </div>
                            
                            <div className="mt-10">
                                <button onClick={handleSave} className="w-full bg-[#0BC48B] text-white px-8 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl shadow-[#0BC48B]/20 hover:-translate-y-1 hover:bg-[#0BA676] active:scale-95 transition-all">
                                    <Save size={20} /> Register Student Ledger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[4rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 animate-in slide-in-from-left-4 duration-500">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none">Active Ledger Repository</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Verified institution members</p>
                        </div>
                        <div className="flex bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 w-full md:w-80 focus-within:bg-white focus-within:ring-8 focus-within:ring-[#0BC48B]/5 transition-all shadow-inner">
                            <Search size={18} className="text-slate-400 mr-3 mt-0.5" />
                            <input type="text" placeholder="Search admission ID..." className="bg-transparent text-sm font-bold text-slate-900 placeholder-slate-400 outline-none w-full" />
                        </div>
                    </div>

                    {students.length === 0 ? (
                         <div className="text-center py-28 bg-slate-50/50 rounded-[3.5rem] border border-slate-100 border-dashed">
                            <FileText className="mx-auto text-slate-200 mb-6" size={64} />
                            <h4 className="font-black text-slate-400 text-lg uppercase tracking-widest">Repository Empty</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">Switch to enroll tab to start operations</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {students.map((st) => (
                                <div key={st.id} className="p-8 rounded-[3rem] border border-slate-100 bg-white hover:border-[#0BC48B]/40 hover:shadow-2xl hover:shadow-[#0BC48B]/5 transition-all group flex flex-col justify-between gap-8 h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-[#0BC48B]/10 hover:text-[#0BC48B] transition-all cursor-pointer shadow-sm">
                                            <Search size={16} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white font-black text-3xl shadow-xl ring-8 ring-slate-50">
                                            {st.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h4 className="font-black text-slate-900 text-xl tracking-tight leading-tight">{st.studentName}</h4>
                                            </div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-[9px] font-black bg-[#0BC48B] px-3 py-1 rounded-full text-white uppercase tracking-widest shadow-sm">{st.admissionId}</span>
                                                <span className="text-[9px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase tracking-widest">{st.level}</span>
                                            </div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                                                    <Users size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-700 uppercase">{st.grade}</span>
                                                </div>
                                                {st.stream && (
                                                    <div className="px-3 py-1.5 bg-indigo-50 rounded-xl">
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase">{st.stream}</span>
                                                    </div>
                                                )}
                                                <div className="px-3 py-1.5 bg-rose-50 rounded-xl">
                                                    <span className="text-[10px] font-black text-rose-500 uppercase">{st.bloodGroup}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 transition-colors group-hover:bg-[#0BC48B]/5 group-hover:border-[#0BC48B]/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[9px] font-black text-[#0BC48B] uppercase tracking-[0.2em]">Registered Guardian</span>
                                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">verified contact</span>
                                        </div>
                                        <span className="font-black text-slate-900 text-lg tracking-tight">{st.parentNamePhone || 'Not assigned'}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                            <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Emergency: {st.emergencyContact || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const InputGroup = ({ label, placeholder, type = "text", value, onChange }) => (
    <div className="w-full group/input">
        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm" 
        />
    </div>
);

const SelectGroup = ({ label, value, onChange, options }) => (
    <div className="w-full group/select">
        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select 
                value={value} 
                onChange={onChange} 
                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-900 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
            >
                {options.map((opt, i) => <option key={i} value={opt === 'Select...' ? '' : opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/select:text-[#0BC48B] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
    </div>
);

