import React, { useState } from 'react';
import { Save, UserPlus, FileText, Search, GraduationCap } from 'lucide-react';

export const StudentLedgerModule = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        admissionId: '',
        studentName: '',
        dob: '',
        bloodGroup: '',
        classSection: '',
        parentNamePhone: '',
        homeAddress: '',
        emergencyContact: ''
    });

    const handleSave = () => {
        if (!form.admissionId || !form.studentName) return;
        setStudents([{ ...form, id: Date.now() }, ...students]);
        setForm({
            admissionId: '', studentName: '', dob: '', bloodGroup: '', classSection: '', parentNamePhone: '', homeAddress: '', emergencyContact: ''
        });
        setActiveTab('directory');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Student & Parent Ledger</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Comprehensive enrollment and guardian management</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto self-start md:self-auto">
                    <button onClick={() => setActiveTab('add')} className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === 'add' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Enroll Student</button>
                    <button onClick={() => setActiveTab('directory')} className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-black rounded-xl transition-all ${activeTab === 'directory' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>View Ledger ({students.length})</button>
                </div>
            </div>

            {/* Content Switch */}
            {activeTab === 'add' ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
                    {/* Student Data Section */}
                    <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <GraduationCap size={20} />
                            </div>
                            <h3 className="font-black text-xl text-slate-800 tracking-tight">Student Data</h3>
                        </div>
                        <div className="space-y-6 flex-1">
                            <InputGroup label="Admission ID (Unique)" placeholder="e.g. YKB-2024-001" value={form.admissionId} onChange={e => setForm({...form, admissionId: e.target.value})} />
                            <InputGroup label="Full Name" placeholder="Student's name" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} />
                            <InputGroup label="Date of Birth" type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                            <SelectGroup label="Blood Group" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} options={['Select...', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                            <SelectGroup label="Class / Section" value={form.classSection} onChange={e => setForm({...form, classSection: e.target.value})} options={['Select...', 'Grade 1 - A', 'Grade 2 - B', 'Grade 10 - A']} />
                        </div>
                    </div>

                    {/* Parent Data Section */}
                    <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-[#0BC48B]/10 flex items-center justify-center text-[#0BC48B]">
                                <UserPlus size={20} />
                            </div>
                            <h3 className="font-black text-xl text-slate-800 tracking-tight">Parent Data</h3>
                        </div>
                        <div className="space-y-6 flex-1">
                            <div>
                                <InputGroup label="Primary Parent Name & Phone" placeholder="e.g. John Doe 9876543210" value={form.parentNamePhone} onChange={e => setForm({...form, parentNamePhone: e.target.value})} />
                                <p className="text-[10px] font-bold text-amber-500 mt-2 px-2">Numeric component acts as Parent App Login</p>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Home Address</label>
                                <textarea value={form.homeAddress} onChange={e => setForm({...form, homeAddress: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm min-h-[120px]" placeholder="Full residential block/address" />
                            </div>
                            <InputGroup label="Emergency Contact (Numeric)" type="number" placeholder="Alternate phone" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} />
                        </div>
                        
                        <div className="mt-8">
                            <button onClick={handleSave} className="w-full bg-[#0BC48B] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0BC48B]/20 hover:-translate-y-0.5 active:scale-95 transition-all">
                                <Save size={16} /> Save Ledger Profile
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm animate-in slide-in-from-left-4">
                     <div className="flex items-center justify-between mb-8 overflow-hidden">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight">Active Ledger ({students.length})</h3>
                        <div className="flex bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-64 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0BC48B]/10 transition-all">
                            <Search size={16} className="text-slate-400 mr-2 mt-0.5" />
                            <input type="text" placeholder="Search admission ID..." className="bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 outline-none w-full" />
                        </div>
                    </div>
                    {students.length === 0 ? (
                         <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            <h4 className="font-black text-slate-800 text-lg">No Students Enrolled</h4>
                            <p className="text-xs font-bold text-slate-400 mt-2">Switch to the Enroll tab to register students & parents.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((st) => (
                                <div key={st.id} className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-[#0BC48B]/30 hover:shadow-lg transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-sm border border-indigo-100/50">
                                            {st.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-black text-slate-800 text-lg">{st.studentName}</h4>
                                                <span className="text-[9px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest">{st.admissionId}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">Class: <span className="text-slate-700">{st.classSection || 'N/A'}</span></span>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">DOB: <span className="text-slate-700">{st.dob || 'N/A'}</span></span>
                                                <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2.5 py-1 rounded-lg">{st.bloodGroup || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 md:items-end text-sm text-slate-400 bg-[#0BC48B]/5 p-4 rounded-2xl border border-[#0BC48B]/10 shrink-0">
                                        <span className="text-[9px] font-black text-[#0BC48B] uppercase tracking-widest mb-1 shadow-sm">Guardian</span>
                                        <span className="font-bold text-slate-700">{st.parentNamePhone || 'Not assigned'}</span>
                                        <span className="font-bold text-slate-500 text-xs">Emergency: {st.emergencyContact || 'N/A'}</span>
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
    <div className="w-full">
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

const SelectGroup = ({ label, value, onChange, options }) => (
    <div className="w-full">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select value={value} onChange={onChange} className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                {options.map((opt, i) => <option key={i} value={opt === 'Select...' ? '' : opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
        </div>
    </div>
);
