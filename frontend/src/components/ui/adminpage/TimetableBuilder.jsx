import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock, BookOpen, Settings, ChevronRight, ChevronLeft, Save, Play, CheckCircle2, AlertOctagon, ChevronDown, Plus, Trash2 } from 'lucide-react';
import config from "@/config";

export const TimetableBuilderModule = () => {
    const [step, setStep] = useState(1);
    
    // States for the wizard
    const [globalTime, setGlobalTime] = useState({
        level: 'LP',
        stream: '',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        periods: 8,
        duration: 45,
        startTime: "08:30 AM",
        endTime: "03:30 PM",
        breaks: [
            { id: 1, start: "10:30 AM", end: "10:45 AM" },
            { id: 2, start: "01:00 PM", end: "01:45 PM" }
        ],
        drillPeriods: []
    });

    const [savedTimes, setSavedTimes] = useState([
        { id: 1, level: 'HIGH SCHOOL', stream: '', periods: 8, duration: 40, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], breaks: [
            { id: 1, start: "10:30 AM", end: "10:45 AM" },
            { id: 2, start: "01:00 PM", end: "01:45 PM" }
        ], breaksCount: 2, drillPeriods: [] }
    ]);
    const [subTab, setSubTab] = useState('config');

    const [workloads, setWorkloads] = useState([]);
    const [constraints, setConstraints] = useState([]);
    const [editingConfigId, setEditingConfigId] = useState(null);

    const API_BASE_SCHOOL = `${config.API_BASE_URL}/v1/school`;
    const API_BASE_ACADEMICS = `${config.API_BASE_URL}/v1/academics`;
    const API_BASE_TIMETABLE = `${config.API_BASE_URL}/v1/timetable`;

    useEffect(() => {
        fetchConfigs();
    }, []);

    // Check for existing config when level/stream changes
    useEffect(() => {
        if (!globalTime.level || subTab !== 'config') return;
        
        const existing = savedTimes.find(c => 
            c.level === globalTime.level && 
            (globalTime.level === "HIGHERSECONDARY" ? c.stream === globalTime.stream : true)
        );

        if (existing) {
            setEditingConfigId(existing.id);
            // Auto-fill form with existing data
            setGlobalTime({
                ...existing,
                startTime: existing.start_time || "08:30 AM",
                endTime: existing.end_time || "03:30 PM",
                drillPeriods: existing.drill_periods || [],
                fixed_slots: existing.fixed_slots || []
            });
        } else {
            setEditingConfigId(null);
            // Optional: reset to defaults if needed, but usually we leave current values
        }
    }, [globalTime.level, globalTime.stream, savedTimes, subTab]);

    const fetchConfigs = async () => {
        try {
            const res = await fetch(`${API_BASE_TIMETABLE}/config`);
            const data = await res.json();
            // Map backend drill_periods to frontend drillPeriods
            const adapted = data.map(t => ({
                ...t,
                startTime: t.start_time || "08:30 AM",
                endTime: t.end_time || "03:30 PM",
                drillPeriods: t.drill_periods || [],
                breaksCount: t.breaks ? t.breaks.length : 0
            }));
            setSavedTimes(adapted);
        } catch (err) {
            console.error("Error fetching configs:", err);
        }
    };

    const steps = [
        { id: 1, title: 'Global Time', subtitle: 'Step A', icon: <Clock size={16} /> },
        { id: 2, title: 'Workload Mapping', subtitle: 'Step B', icon: <BookOpen size={16} /> },
        { id: 3, title: 'Constraints', subtitle: 'Step C', icon: <Settings size={16} /> },
        { id: 4, title: 'Output Grid', subtitle: 'Step D', icon: <CalendarDays size={16} /> }
    ];

    const handleDeleteSaved = async (id) => {
        if (!window.confirm("Are you sure you want to delete this configuration? This cannot be undone.")) return;
        
        try {
            const res = await fetch(`${API_BASE_TIMETABLE}/config/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await fetchConfigs();
            } else {
                alert("Failed to delete configuration.");
            }
        } catch (err) {
            console.error("Error deleting configuration:", err);
        }
    };

    const handleSaveConfig = async () => {
        const payload = {
            level: globalTime.level,
            stream: globalTime.stream || null,
            days: globalTime.days,
            periods: parseInt(globalTime.periods),
            duration: parseInt(globalTime.duration),
            start_time: globalTime.startTime,
            end_time: globalTime.endTime,
            breaks: globalTime.breaks,
            drill_periods: globalTime.drillPeriods || [],
            fixed_slots: globalTime.fixed_slots || []
        };

        try {
            const url = editingConfigId 
                ? `${API_BASE_TIMETABLE}/config/${editingConfigId}` 
                : `${API_BASE_TIMETABLE}/config`;
            const method = editingConfigId ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(editingConfigId ? "Configuration updated successfully!" : "Configuration saved successfully!");
                await fetchConfigs();
                setEditingConfigId(null);
                handleNewConfig(); // Reset form to defaults
                setSubTab('saved'); 
            }
        } catch (err) {
            console.error("Error saving configuration:", err);
        }
    };

    const handleNewConfig = () => {
        setGlobalTime({
            level: 'LP',
            stream: '',
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            periods: 8,
            duration: 45,
            startTime: "08:30 AM",
            endTime: "03:30 PM",
            breaks: [
                { id: 1, start: "10:30 AM", end: "10:45 AM" },
                { id: 2, start: "01:00 PM", end: "01:45 PM" }
            ],
            drillPeriods: []
        });
        setEditingConfigId(null);
        setSubTab('config');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Automated Timetable Builder</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.2em]">AI-powered scheduling and conflict resolution</p>
                </div>
            </div>

            {/* Stepper Navigation */}
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
                {steps.map(s => (
                    <div key={s.id} onClick={() => setStep(s.id)} className={`flex-1 min-w-[200px] flex items-center gap-4 p-5 rounded-3xl cursor-pointer transition-all ${step === s.id ? 'bg-[#0BC48B] text-white shadow-xl shadow-[#0BC48B]/20' : step > s.id ? 'bg-slate-50 text-slate-800' : 'text-slate-400 hover:bg-slate-50'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${step === s.id ? 'bg-white/20' : 'bg-white shadow-sm border border-slate-100'}`}>
                            {step > s.id ? <CheckCircle2 size={24} className={step > s.id ? "text-[#0BC48B]" : ""} /> : s.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{s.subtitle}</p>
                            <h4 className="font-black text-sm tracking-tight">{s.title}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] w-fit shadow-inner">
                        <button onClick={handleNewConfig} className={`px-8 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${subTab === 'config' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Configure New</button>
                        <button onClick={() => setSubTab('saved')} className={`px-8 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${subTab === 'saved' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Saved Definitions ({savedTimes.length})</button>
                    </div>

                    {subTab === 'config' ? (
                        <StepAGlobalTime 
                            data={globalTime} 
                            setData={setGlobalTime} 
                            onNext={() => setStep(2)} 
                            onSave={handleSaveConfig}
                            isExisting={!!editingConfigId}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-left-4 duration-500">
                             {savedTimes.map(t => (
                                 <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative group">
                                     <button onClick={() => handleDeleteSaved(t.id)} className="absolute top-6 right-6 p-2 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                         <Trash2 size={16} />
                                     </button>
                                     <div className="flex items-center gap-3 mb-6">
                                         <span className="text-[10px] font-black bg-[#0BC48B] text-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#0BC48B]/20">{t.level}</span>
                                         {t.stream && <span className="text-[10px] font-black bg-indigo-50 text-indigo-500 px-3 py-1.5 rounded-full uppercase tracking-widest">{t.stream}</span>}
                                     </div>
                                     <div className="space-y-4">
                                         <div className="flex items-center justify-between">
                                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Load Factor</span>
                                             <span className="text-sm font-black text-slate-800">{t.periods} Periods @ {t.duration}m</span>
                                         </div>
                                         <div className="flex items-center justify-between">
                                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Days</span>
                                             <span className="text-sm font-black text-slate-800">{t.days.length} Days</span>
                                         </div>
                                     </div>
                                     <div className="mt-8 flex gap-3">
                                         <button onClick={() => { setGlobalTime(t); setSubTab('config'); }} className="flex-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-2xl hover:bg-slate-800 transition-colors">Edit Settings</button>
                                         <button onClick={() => setStep(2)} className="flex-1 bg-[#0BC48B]/10 text-[#0BC48B] text-[10px] font-black uppercase tracking-widest py-3.5 rounded-2xl hover:bg-[#0BC48B] hover:text-white transition-all">Build Mapping</button>
                                     </div>
                                 </div>
                             ))}
                             {savedTimes.length === 0 && (
                                 <div className="col-span-full py-24 bg-slate-50 rounded-[4rem] border border-slate-100 border-dashed text-center">
                                     <Clock className="mx-auto text-slate-200 mb-6" size={64} />
                                     <h4 className="font-black text-slate-400 text-lg uppercase tracking-widest">No Saved Configs</h4>
                                     <button onClick={() => setSubTab('config')} className="mt-6 text-[10px] font-black text-[#0BC48B] uppercase tracking-widest flex items-center gap-2 mx-auto"><Plus size={16} /> Create First Definition</button>
                                 </div>
                             )}
                        </div>
                    )}
                </div>
            )}
            {step === 2 && <StepBWorkload 
                                onNext={() => setStep(3)} 
                                onPrev={() => setStep(1)} 
                                workloads={workloads} 
                                setWorkloads={setWorkloads} 
                                apiSchool={API_BASE_SCHOOL}
                                apiAcademics={API_BASE_ACADEMICS}
                                apiTimetable={API_BASE_TIMETABLE}
                                currentConfig={globalTime}
                            />}
            {step === 3 && <StepCConstraints onNext={() => setStep(4)} onPrev={() => setStep(2)} constraints={constraints} setConstraints={setConstraints} />}
            {step === 4 && <StepDOutputGrid 
                                onPrev={() => setStep(3)} 
                                level={globalTime.level}
                                stream={globalTime.stream}
                                apiTimetable={API_BASE_TIMETABLE}
                                apiSchool={API_BASE_SCHOOL}
                                workloads={workloads}
                            />}

            
        </div>
    );
};

const StepAGlobalTime = ({ data, setData, onNext, onSave, isExisting }) => {
    const toggleDay = (day) => {
        if (data.days.includes(day)) {
            setData({ ...data, days: data.days.filter(d => d !== day) });
        } else {
            setData({ ...data, days: [...data.days, day] });
        }
    };

    const updateBreak = (id, field, value) => {
        const newBreaks = data.breaks.map(b => b.id === id ? { ...b, [field]: value } : b);
        setData({ ...data, breaks: newBreaks });
    };

    const addBreak = () => {
        setData({ ...data, breaks: [...data.breaks, { id: Date.now(), start: "12:00 PM", end: "12:15 PM" }] });
    };

    const removeBreak = (id) => {
        setData({ ...data, breaks: data.breaks.filter(b => b.id !== id) });
    };

    const addDrill = () => {
        setData({ ...data, drillPeriods: [...(data.drillPeriods || []), { id: Date.now(), day: 'Mon', period: 1 }] });
    };

    const updateDrill = (id, field, value) => {
        setData({ ...data, drillPeriods: (data.drillPeriods || []).map(d => d.id === id ? { ...d, [field]: value } : d) });
    };

    const removeDrill = (id) => {
        setData({ ...data, drillPeriods: (data.drillPeriods || []).filter(d => d.id !== id) });
    };

    const levels = ["LP", "UP", "HIGH SCHOOL", "HIGHERSECONDARY"];
    const streams = ["Science", "Commerce", "Humanities"];

    return (
        <div className="bg-white rounded-[4rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in slide-in-from-right-4 duration-500">
            {/* Level & Stream Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 pb-14 border-b border-slate-100">
                <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 ml-1">Target Academic Levels</label>
                    <div className="flex flex-wrap gap-4">
                        {levels.map((lvl) => (
                            <label 
                                key={lvl} 
                                className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] cursor-pointer transition-all border-2 ${
                                    data.level === lvl 
                                    ? "bg-[#0BC48B]/5 border-[#0BC48B] text-slate-900 shadow-sm" 
                                    : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-200"
                                }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <input 
                                        type="checkbox" 
                                        checked={data.level === lvl} 
                                        onChange={() => setData({ ...data, level: lvl, drillPeriods: lvl === "HIGHERSECONDARY" ? [] : data.drillPeriods })}
                                        className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-[#0BC48B] checked:border-[#0BC48B] transition-all cursor-pointer"
                                    />
                                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest">{lvl === 'HIGHERSECONDARY' ? 'Higher Secondary' : lvl}</span>
                            </label>
                        ))}
                    </div>

                </div>

                {data.level === "HIGHERSECONDARY" && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 ml-1">Academic Stream</label>
                        <div className="relative group">
                            <select 
                                value={data.stream} 
                                onChange={(e) => setData({ ...data, stream: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[2rem] text-sm font-black text-slate-900 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">General (Standard)</option>
                                {streams.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#0BC48B] transition-colors">
                                <ChevronDown size={22} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                <div className="space-y-8">
                    <div>
                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 ml-1">Working Days</label>
                        <div className="flex flex-wrap gap-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                <label key={i} className={`flex items-center gap-2 px-4 py-3 rounded-2xl cursor-pointer transition-colors border ${data.days.includes(day) ? 'bg-[#0BC48B]/10 border-[#0BC48B]/20 text-[#0BC48B]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                                    <input type="checkbox" checked={data.days.includes(day)} onChange={() => toggleDay(day)} className="w-4 h-4 accent-[#0BC48B] rounded cursor-pointer" />
                                    <span className="text-sm font-bold">{day}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <InputGroup label="Total Periods/Day" type="number" value={data.periods} onChange={(e) => setData({ ...data, periods: e.target.value })} />
                        <InputGroup label="Period Duration (mins)" type="number" value={data.duration} onChange={(e) => setData({ ...data, duration: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                        <TimeSelectGroup label="School Opening Time" value={data.startTime} onChange={(val) => setData({ ...data, startTime: val })} />
                        <TimeSelectGroup label="School Closing Time" value={data.endTime} onChange={(val) => setData({ ...data, endTime: val })} />
                    </div>

                    {/* Fixed Events (Assembly, Lunch, etc) Configuration */}
                    <div className="pt-6 border-t border-slate-50 animate-in fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1 text-indigo-500">Fixed Events (Assembly, Lunch, etc)</label>
                            <button onClick={() => setData({ ...data, fixed_slots: [...(data.fixed_slots || []), { id: Date.now(), day: 'All', period: 1, subject: 'Lunch' }] })} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-600 transition-colors"><Plus size={12} /> Add Event</button>
                        </div>
                        <div className="space-y-3">
                            {(data.fixed_slots || []).map((fs) => (
                                <div key={fs.id} className="grid grid-cols-3 gap-3 bg-indigo-50/30 p-4 rounded-3xl border border-indigo-50/50 relative group">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Activity</span>
                                        <input 
                                            value={fs.subject} 
                                            onChange={(e) => setData({ ...data, fixed_slots: data.fixed_slots.map(s => s.id === fs.id ? { ...s, subject: e.target.value } : s) })}
                                            className="w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                                            placeholder="e.g. Assembly"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Day</span>
                                        <select 
                                            value={fs.day} 
                                            onChange={(e) => setData({ ...data, fixed_slots: data.fixed_slots.map(s => s.id === fs.id ? { ...s, day: e.target.value } : s) })}
                                            className="w-full bg-transparent text-sm font-black text-slate-800 outline-none cursor-pointer"
                                        >
                                            <option value="All">All Days</option>
                                            {data.days.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Period</span>
                                        <select 
                                            value={fs.period} 
                                            onChange={(e) => setData({ ...data, fixed_slots: data.fixed_slots.map(s => s.id === fs.id ? { ...s, period: parseInt(e.target.value) } : s) })}
                                            className="w-full bg-transparent text-sm font-black text-slate-800 outline-none cursor-pointer"
                                        >
                                            {Array.from({length: data.periods}, (_, i) => (
                                                <option key={i+1} value={i+1}>Period {i+1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button onClick={() => setData({ ...data, fixed_slots: data.fixed_slots.filter(s => s.id !== fs.id) })} className="absolute -right-2 -top-2 bg-white border border-slate-100 text-rose-500 w-7 h-7 flex items-center justify-center rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {(!data.fixed_slots || data.fixed_slots.length === 0) && <p className="text-[10px] font-bold text-slate-400 italic">No fixed events set.</p>}
                        </div>
                    </div>

                </div>
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Daily Breaks</label>
                            <button onClick={addBreak} className="text-[10px] font-black text-[#0BC48B] uppercase tracking-widest flex items-center gap-1 hover:text-[#09A173] transition-colors"><Plus size={12} /> Add Break</button>
                        </div>
                        <div className="space-y-4">
                            {data.breaks.map((b) => (
                                <div key={b.id} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-50 relative group">
                                    <TimeSelectGroup label="Start Time" value={b.start} onChange={(val) => updateBreak(b.id, 'start', val)} />
                                    <TimeSelectGroup label="End Time" value={b.end} onChange={(val) => updateBreak(b.id, 'end', val)} />
                                    <button onClick={() => removeBreak(b.id)} className="absolute -right-3 -top-3 bg-white border border-slate-100 text-rose-500 w-8 h-8 flex items-center justify-center rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:border-rose-100">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {data.breaks.length === 0 && <p className="text-sm font-bold text-slate-400 italic">No breaks configured.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved configurations can be reused for parallel grade sections</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button onClick={onSave} className={`flex-1 sm:flex-none border-2 px-10 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all ${isExisting ? 'border-[#0BC48B] text-[#0BC48B] hover:bg-[#0BC48B] hover:text-white' : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}>
                        {isExisting ? 'Update Configuration' : 'Save Configuration'}
                    </button>
                    <button onClick={onNext} className="flex-1 sm:flex-none bg-[#0BC48B] text-white px-10 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#0BC48B]/20 hover:-translate-y-1 active:scale-95 transition-all">
                        Continue to Workload <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

 const StepBWorkload = ({ onNext, onPrev, workloads, setWorkloads, apiSchool, apiAcademics, apiTimetable, currentConfig }) => {
    const [selectedLevel, setSelectedLevel] = useState(currentConfig?.level || '');
    const [selectedStream, setSelectedStream] = useState(currentConfig?.stream || '');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [periods, setPeriods] = useState('');
    const [isDouble, setIsDouble] = useState(false);


    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const levels = ["LP", "UP", "HIGH SCHOOL", "HIGHERSECONDARY"];
    const streams = ["Science", "Commerce", "Humanities"];

    const [availableSubjects, setAvailableSubjects] = useState([]);

    const [filteredTeachers, setFilteredTeachers] = useState([]);

    // Fetch master data
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch(`${apiSchool}/teachers`);
                const data = await res.json();
                setTeachers(data);
            } catch (err) { console.error("Error fetching teachers:", err); }
        };
        fetchTeachers();
    }, []);

    // Filter teachers based on selected subject
    useEffect(() => {
        if (selectedSubjectId) {
            // Teacher has a 'subjects' field which is an array of subject names
            // Use case-insensitive matching to ensure reliability
            const filtered = teachers.filter(t => 
                t.subjects && t.subjects.some(s => s.toLowerCase().trim() === selectedSubjectId.toLowerCase().trim())
            );
            setFilteredTeachers(filtered);
        } else {
            setFilteredTeachers([]);
        }
    }, [selectedSubjectId, teachers]);

    // Fetch level-specific data
    useEffect(() => {
        if (!selectedLevel) {
            setClasses([]);
            setSubjects([]);
            return;
        }

        const fetchLevelData = async () => {
            setIsLoading(true);
            try {
                // Fetch Classes
                const cRes = await fetch(`${apiSchool}/sections/${selectedLevel}/classes`);
                const cData = await cRes.json();
                setClasses(cData);

                // Fetch Subjects (these are configurations)
                const sRes = await fetch(`${apiAcademics}/subjects/${selectedLevel}`);
                const sData = await sRes.json();
                setSubjects(sData);
            } catch (err) {
                console.error("Error fetching level data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLevelData();
    }, [selectedLevel]);

    // Update available subjects when class changes and FETCH existing workloads
    useEffect(() => {
        if (selectedClassId) {
            const fetchExistingWorkloads = async () => {
                try {
                    const res = await fetch(`${apiTimetable}/workload/${selectedClassId}`);
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ detail: res.statusText }));
                        throw new Error(errorData.detail || `Server error: ${res.status}`);
                    }
                    const data = await res.json();
                    
                    // Map API response to frontend structure
                    // Ensure type safety when finding teachers
                    const mapped = data.map(item => {
                        const teacherObj = teachers.find(t => String(t.id) === String(item.teacher_id));
                        const classObj = classes.find(c => String(c.id) === String(item.class_id));
                        return {
                            ...item,
                            id: item.id,
                            class_id: item.class_id,
                            class_name: classObj ? `${classObj.class_name} ${classObj.section_identifier}` : 'Unknown Class',
                            subject: item.subject_name,
                            teacher: teacherObj ? teacherObj.full_name : 'Teacher Name',
                            teacher_id: item.teacher_id,
                            periods: item.periods_per_week
                        };
                    });
                    setWorkloads(mapped);
                } catch (err) { 
                    console.error("Error fetching workloads:", err); 
                }
            };

            fetchExistingWorkloads();

            if (subjects.length > 0) {
                const selectedCls = classes.find(c => c.id === parseInt(selectedClassId));
                if (selectedCls) {
                    const config = subjects.find(s => 
                        s.target_class && s.target_class.toLowerCase().trim() === selectedCls.class_name.toLowerCase().trim()
                    );
                    if (config) setAvailableSubjects(config.subjects);
                    else setAvailableSubjects([]);
                }
            }
        } else {
            setAvailableSubjects([]);
            setWorkloads([]);
        }
    }, [selectedClassId, subjects, classes, teachers]);

    const handleLevelChange = (lvl) => {
        setSelectedLevel(selectedLevel === lvl ? '' : lvl);
        setSelectedStream('');
        setSelectedClassId('');
        setSelectedSubjectId('');
        setSelectedTeacherId('');
    };

    const handleMapWorkload = async () => {
        if (!selectedClassId || !selectedSubjectId || !selectedTeacherId || !periods) return;
        
        const payload = {
            class_id: parseInt(selectedClassId),
            subject_name: selectedSubjectId,
            teacher_id: parseInt(selectedTeacherId),
            periods_per_week: parseInt(periods),
            is_double: isDouble, // New field
            config_id: currentConfig?.id || null
        };

        try {
            const res = await fetch(`${apiTimetable}/workload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                const newItem = await res.json();
                const teacherObj = teachers.find(t => t.id === parseInt(selectedTeacherId));
                
                const newMapping = {
                    id: newItem.id,
                    subject: selectedSubjectId,
                    teacher: teacherObj?.full_name,
                    periods: parseInt(periods),
                    is_double: isDouble
                };
                
                setWorkloads([...workloads, newMapping]);
                setSelectedSubjectId('');
                setSelectedTeacherId('');
                setPeriods('');
                setIsDouble(false);
            }
        } catch (err) {
            console.error("Error saving workload:", err);
        }

    };

    const isFormValid = selectedClassId && selectedSubjectId && selectedTeacherId && periods;

    return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
        {/* Level & Stream Filter Bar */}
        <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 ml-1">Select Academic Level</label>
                    <div className="flex flex-wrap gap-4">
                        {levels.map((lvl) => (
                            <label 
                                key={lvl} 
                                className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] cursor-pointer transition-all border-2 ${
                                    selectedLevel === lvl 
                                    ? "bg-[#0BC48B]/5 border-[#0BC48B] text-slate-900 shadow-sm" 
                                    : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-200"
                                }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedLevel === lvl} 
                                        onChange={() => handleLevelChange(lvl)}
                                        className="peer appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg checked:bg-[#0BC48B] checked:border-[#0BC48B] transition-all cursor-pointer"
                                    />
                                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest">{lvl === 'HIGHERSECONDARY' ? 'Higher Secondary' : lvl}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {selectedLevel === "HIGHERSECONDARY" && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 ml-1">Academic Stream</label>
                        <div className="relative group">
                            <select 
                                value={selectedStream} 
                                onChange={(e) => { setSelectedStream(e.target.value); setSelectedClassId(''); }}
                                className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[2rem] text-sm font-black text-slate-900 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="">Select Stream...</option>
                                {streams.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-[#0BC48B] transition-colors">
                                <ChevronDown size={22} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Mapping Form + Mapped List */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
                <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Add Workload Mapping</h3>
                
                {!selectedLevel && (
                    <div className="mb-6 bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 shrink-0 animate-pulse" />
                        <p className="text-xs font-bold text-amber-600">Please select an academic level above to enable class selection.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Dynamic Class Dropdown */}
                    <div className="w-full">
                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Target Class</label>
                        <div className="relative">
                            <select 
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                disabled={!selectedLevel || (selectedLevel === 'HIGHERSECONDARY' && !selectedStream) || isLoading}
                                className={`w-full border px-6 py-4 rounded-[1.5rem] text-sm font-semibold outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer shadow-sm ${
                                    !selectedLevel || (selectedLevel === 'HIGHERSECONDARY' && !selectedStream) || isLoading
                                    ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-50/50 border-slate-100 text-slate-800 focus:bg-white'
                                }`}
                            >
                                <option value="">{
                                    isLoading 
                                        ? 'Loading classes...'
                                        : !selectedLevel 
                                            ? 'Select a level first...' 
                                            : selectedLevel === 'HIGHERSECONDARY' && !selectedStream 
                                                ? 'Select a stream first...'
                                                : 'Select Class...'
                                }</option>
                                {classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.class_name} - {cls.section_identifier}</option>)}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Subject</label>
                        <div className="relative">
                            <select 
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                disabled={!selectedClassId || isLoading}
                                className={`w-full border px-6 py-4 rounded-[1.5rem] text-sm font-semibold outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer shadow-sm ${
                                    !selectedClassId || isLoading
                                    ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-50/50 border-slate-100 text-slate-800 focus:bg-white'
                                }`}
                            >
                                <option value="">{
                                    isLoading 
                                        ? "Loading subjects..." 
                                        : !selectedClassId 
                                            ? "Select class first..." 
                                            : availableSubjects.length === 0 
                                                ? "No subjects configured for this class" 
                                                : "Select Subject..."
                                }</option>
                                {availableSubjects.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Assigned Teacher</label>
                        <div className="relative">
                            <select 
                                value={selectedTeacherId}
                                onChange={(e) => setSelectedTeacherId(e.target.value)}
                                disabled={!selectedSubjectId || isLoading}
                                className={`w-full border px-6 py-4 rounded-[1.5rem] text-sm font-semibold outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer shadow-sm ${
                                    !selectedSubjectId || isLoading
                                    ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-50/50 border-slate-100 text-slate-800 focus:bg-white'
                                }`}
                            >
                                <option value="">{
                                    isLoading 
                                        ? "Loading teachers..." 
                                        : !selectedSubjectId 
                                            ? "Select subject first..." 
                                            : filteredTeachers.length === 0 
                                                ? "No qualified teachers found" 
                                                : "Select Teacher..."
                                }</option>
                                {filteredTeachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 items-end">
                        <InputGroup 
                            label="Periods Needed" 
                            type="number" 
                            value={periods}
                            onChange={(e) => setPeriods(e.target.value)}
                            placeholder="e.g., 5" 
                        />
                        <label className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-white transition-all shadow-sm">
                            <input 
                                type="checkbox" 
                                checked={isDouble} 
                                onChange={(e) => setIsDouble(e.target.checked)}
                                className="w-5 h-5 accent-[#0BC48B] rounded cursor-pointer" 
                            />
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest leading-none">Double Period (Lab)</span>
                        </label>
                    </div>

                    
                    <button 
                        onClick={handleMapWorkload} 
                        disabled={!isFormValid}
                        className={`w-full px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all mt-4 ${
                            isFormValid 
                            ? 'bg-slate-900 text-white hover:-translate-y-0.5 active:scale-95' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        Map Workload
                    </button>
                </div>
                <div className="mt-8 flex justify-between">
                    <button onClick={onPrev} className="text-slate-400 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2">
                        <ChevronLeft size={16} /> Back
                    </button>
                    <button onClick={onNext} className="bg-[#0BC48B] text-white px-8 py-3.5 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                        Next Step <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-10 border border-slate-100 shadow-inner overflow-y-auto max-h-[600px]">
                <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Mapped Workloads ({workloads.length})</h3>
                <div className="space-y-4">
                    {workloads.map((w) => (
                        <MappingCard key={w.id} cls={w.class_name || 'Mapped Class'} sub={w.subject} tr={w.teacher} n={w.periods} />
                    ))}
                    {workloads.length === 0 && (
                        <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-sm font-bold text-slate-400">No workloads mapped yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};

const StepCConstraints = ({ onNext, onPrev, apiSchool }) => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [constraints, setConstraints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState({ day: 'Mon', period: 1 });

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await fetch(`${apiSchool}/teachers`);
                const data = await res.json();
                setTeachers(data);
            } catch (err) { console.error("Error fetching teachers:", err); }
        };
        fetchTeachers();
    }, []);

    const selectedTeacher = teachers.find(t => String(t.id) === String(selectedTeacherId));

    useEffect(() => {
        if (selectedTeacher) {
            setConstraints(selectedTeacher.constraints || []);
        } else {
            setConstraints([]);
        }
    }, [selectedTeacher]);

    const addConstraint = async () => {
        if (!selectedTeacherId) return;
        const exists = constraints.find(c => c.day === selectedSlot.day && c.period === selectedSlot.period);
        if (exists) return;

        const newConstraints = [...constraints, selectedSlot];
        
        try {
            const res = await fetch(`${apiSchool}/teachers/${selectedTeacherId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ constraints: newConstraints })
            });
            if (res.ok) {
                setConstraints(newConstraints);
                // Update local list
                setTeachers(teachers.map(t => String(t.id) === String(selectedTeacherId) ? { ...t, constraints: newConstraints } : t));
            }
        } catch (err) { console.error("Error saving constraint:", err); }
    };

    const removeConstraint = async (day, period) => {
        const newConstraints = constraints.filter(c => !(c.day === day && c.period === period));
        try {
            const res = await fetch(`${apiSchool}/teachers/${selectedTeacherId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ constraints: newConstraints })
            });
            if (res.ok) {
                setConstraints(newConstraints);
                setTeachers(teachers.map(t => String(t.id) === String(selectedTeacherId) ? { ...t, constraints: newConstraints } : t));
            }
        } catch (err) { console.error("Error removing constraint:", err); }
    };

    return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
        <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Teacher Unavailability</h3>
            <div className="space-y-6">
                <div className="w-full">
                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Select Teacher</label>
                    <select 
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none"
                    >
                        <option value="">Select a teacher...</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                    </select>
                </div>

                {selectedTeacherId && (
                    <div className="p-6 bg-[#0BC48B]/5 border border-[#0BC48B]/10 rounded-3xl space-y-4">
                        <p className="text-[10px] font-black uppercase text-[#0BC48B] tracking-widest">Mark Slot as Unavailable</p>
                        <div className="grid grid-cols-2 gap-4">
                             <select value={selectedSlot.day} onChange={e => setSelectedSlot({...selectedSlot, day: e.target.value})} className="bg-white border-slate-100 px-4 py-3 rounded-2xl text-sm font-bold outline-none border">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                             <input type="number" min="1" max="8" value={selectedSlot.period} onChange={e => setSelectedSlot({...selectedSlot, period: parseInt(e.target.value)})} className="bg-white border-slate-100 px-4 py-3 rounded-2xl text-sm font-bold outline-none border" placeholder="Period No." />
                        </div>
                        <button onClick={addConstraint} className="w-full bg-[#0BC48B] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Add Constraint</button>
                    </div>
                )}
            </div>
            <div className="mt-8 flex justify-between">
                 <button onClick={onPrev} className="text-slate-400 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2">
                    <ChevronLeft size={16} /> Back
                </button>
                <button onClick={onNext} className="bg-slate-900 text-white px-8 py-3.5 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                    Next to Generation <ChevronRight size={16} />
                </button>
            </div>
        </div>
        <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-10 border border-slate-100 shadow-inner overflow-y-auto max-h-[600px]">
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Active Unavailability Slots</h3>
            {!selectedTeacherId ? (
                <div className="text-center py-20">
                    <p className="text-sm font-bold text-slate-400">Select a teacher to view their constraints.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {constraints.map((c, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-between group">
                            <div>
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">Unavailable</span>
                                <h4 className="font-black text-slate-800">{c.day} - Period {c.period}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Constraint ID: {selectedTeacher?.full_name}</p>
                            </div>
                            <button onClick={() => removeConstraint(c.day, c.period)} className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {constraints.length === 0 && <p className="text-sm font-bold text-slate-400 text-center py-10 italic">No unavailability markers for this teacher.</p>}
                </div>
            )}
        </div>
    </div>
)};

const StepDOutputGrid = ({ onPrev, level, stream, apiTimetable, apiSchool, workloads }) => {
    const [timetableData, setTimetableData] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [viewMode, setViewMode] = useState('class'); // class, teacher
    const [status, setStatus] = useState('idle'); // idle, generating, success, error
    const [error, setError] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!level || !apiSchool) return;
            try {
                const cRes = await fetch(`http://127.0.0.1:8000/api/v1/school/sections/${level}/classes`);
                const cData = await cRes.json();
                setClasses(cData);
                setSelectedClasses(cData.map(c => c.id)); // Default: all in level

                const tRes = await fetch(`${apiSchool}/teachers`);
                const tData = await tRes.json();
                setTeachers(tData);
            } catch (err) { console.error("Fetch error in StepD:", err); }
        };
        fetchData();
    }, [level, apiSchool]);

    const generateTimetable = async () => {
        setStatus('generating');
        setError(null);
        try {
            const res = await fetch(`${apiTimetable}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    level, 
                    stream: stream || null,
                    class_ids: selectedClasses.length > 0 ? selectedClasses : null,
                    term_id: null 
                })
            });
            const result = await res.json();
            
            if (res.ok && result.status === 'success') {
                setTimetableData(result.timetable);
                const firstClass = Object.keys(result.timetable)[0];
                setSelectedClass(firstClass);
                setStatus('success');
            } else {
                throw new Error(result.detail || result.message || "Failed to generate timetable");
            }
        } catch (err) {
            setError(err.message);
            setStatus('error');
        }
    };

    const getTeacherTimetable = () => {
        if (!timetableData) return null;
        const teacherSched = {};
        
        Object.keys(timetableData).forEach(clsName => {
            const solution = timetableData[clsName];
            if (!solution || !solution.grid) return;
            const grid = solution.grid;
            
            Object.keys(grid).forEach(day => {
                const slots = grid[day];
                if (!Array.isArray(slots)) return;
                
                slots.forEach((slot, pIdx) => {
                    if (slot && slot.teacher_id !== -1) {
                        const tName = slot.teacher_name;
                        if (!teacherSched[tName]) teacherSched[tName] = {};
                        if (!teacherSched[tName][day]) teacherSched[tName][day] = [];
                        
                        teacherSched[tName][day].push({ p: pIdx + 1, cls: clsName, sub: slot.subject });
                    }
                });
            });
        });
        return teacherSched;
    };

    const currentSolution = selectedClass ? timetableData[selectedClass] : null;
    const currentSchedule = currentSolution?.grid;
    const days = currentSchedule ? Object.keys(currentSchedule) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    const downloadCSV = () => {
        if (!timetableData || !selectedClass) return;
        const solution = timetableData[selectedClass];
        if (!solution || !solution.grid) return;

        const schedule = solution.grid;
        const days = Object.keys(schedule);
        const periodsCount = schedule[days[0]].length;
        
        let csvContent = `Timetable for ${selectedClass}\n\n`;
        csvContent += "Period," + days.join(",") + "\n";

        for (let p = 0; p < periodsCount; p++) {
            let row = `Period ${p + 1}`;
            days.forEach(day => {
                const slot = schedule[day][p];
                if (slot) {
                    row += `,"${slot.subject} (${slot.teacher_name === 'N/A' ? 'Fixed' : slot.teacher_name})"`;
                } else {
                    row += ',"Free"';
                }
            });
            csvContent += row + "\n";
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Timetable_${selectedClass.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleClassSelection = (id) => {
        if (selectedClasses.includes(id)) setSelectedClasses(selectedClasses.filter(c => c !== id));
        else setSelectedClasses([...selectedClasses, id]);
    };

    return (
        <div className="bg-white rounded-[3rem] p-8 lg:p-14 border border-slate-50 shadow-2xl animate-in slide-in-from-right-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
                <div>
                    <h3 className="font-black text-3xl text-slate-800 tracking-tight leading-none">Timetable Engine</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3">Level: {level} {stream && `| Stream: ${stream}`}</p>
                </div>
                
                <div className="flex gap-4 w-full lg:w-auto">
                    <button onClick={onPrev} className="flex-1 lg:flex-none bg-slate-50 text-slate-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">Settings</button>
                    <button 
                        onClick={generateTimetable} 
                        disabled={status === 'generating'}
                        className="flex-1 lg:flex-none bg-[#0BC48B] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#0BC48B]/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {status === 'generating' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={16} fill="currentColor" />}
                        {status === 'idle' ? 'Generate' : 'Re-Generate'}
                    </button>
                </div>
            </div>

            {/* Class Selection for Generation */}
            {status !== 'success' && (
                <div className="mb-10 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Classes to Generate For:</label>
                    <div className="flex flex-wrap gap-3">
                        {classes.map(c => (
                            <button 
                                key={c.id} 
                                onClick={() => toggleClassSelection(c.id)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedClasses.includes(c.id) ? 'bg-[#0BC48B] text-white shadow-lg shadow-[#0BC48B]/20' : 'bg-white text-slate-400 border border-slate-100'}`}
                            >
                                {c.class_name} {c.section_identifier}
                            </button>
                        ))}
                        {(!classes || classes.length === 0) && (
                            <p className="text-[10px] font-bold text-slate-400 italic py-2 px-1">No classes found in this section. Go to School Structure to add them.</p>
                        )}
                    </div>

                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col gap-8">
                    {/* View Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-6 bg-slate-900 p-6 rounded-[2.5rem] shadow-xl">
                        <div className="flex bg-white/10 p-1.5 rounded-2xl">
                            <button onClick={() => setViewMode('class')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'class' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'}`}>Class-Wise</button>
                            <button onClick={() => setViewMode('teacher')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'teacher' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'}`}>Teacher-Wise</button>
                        </div>

                        {viewMode === 'class' ? (
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(timetableData).map(cls => (
                                    <button 
                                       key={cls}
                                       onClick={() => setSelectedClass(cls)}
                                       className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedClass === cls ? 'bg-[#0BC48B] text-white' : 'text-white/40 hover:text-white/80'}`}
                                    >
                                       {cls}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <select 
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border-none outline-none px-4 py-2.5 rounded-xl cursor-pointer"
                            >
                                <option value="" className="text-slate-900">Select Teacher...</option>
                                {Object.keys(getTeacherTimetable() || {}).sort().map(t => (
                                    <option key={t} value={t} className="text-slate-900">{t}</option>
                                ))}
                            </select>
                        )}

                        <div className="flex gap-2">
                            <button onClick={downloadCSV} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                                <Save size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest px-2">Export CSV</span>
                            </button>
                        </div>
                    </div>

                    {viewMode === 'class' ? (
                        <ClassTimetableGrid 
                            scheduleData={timetableData[selectedClass]} 
                            days={days} 
                            apiTimetable={apiTimetable}
                            onUpdate={(newGrid) => {
                                setTimetableData({
                                    ...timetableData,
                                    [selectedClass]: { ...timetableData[selectedClass], grid: newGrid }
                                });
                            }}
                            classWorkloads={workloads.filter(w => w.class_name === selectedClass)}
                        />
                    ) : (
                        <TeacherTimetableList teacherName={selectedTeacher} fullSchedule={getTeacherTimetable()} />
                    )}
                </div>
            )}


        </div>
    );
};

const ClassTimetableGrid = ({ scheduleData, days, apiTimetable, onUpdate, classWorkloads }) => {
    if (!scheduleData) return null;
    const { id: solutionId, grid: schedule } = scheduleData;
    const periodsCount = Object.values(schedule)[0].length;
    
    const [dragged, setDragged] = React.useState(null);

    const handleDragStart = (day, pIdx, slot) => {
        if (!slot) return;
        setDragged({ day, pIdx, slot });
    };

    const handleDrop = async (toDay, toPIdx) => {
        if (!dragged) return;
        const newGrid = JSON.parse(JSON.stringify(schedule));
        
        const sourceSlot = newGrid[dragged.day][dragged.pIdx];
        const targetSlot = newGrid[toDay][toPIdx];

        // Swap
        newGrid[toDay][toPIdx] = sourceSlot;
        newGrid[dragged.day][dragged.pIdx] = targetSlot;

        setDragged(null);
        onUpdate(newGrid);

        // Save to backend
        try {
            await fetch(`${apiTimetable}/solution/${solutionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGrid)
            });
        } catch (err) { console.error("Error updating manual timetable:", err); }
    };

    const handleManualSubject = async (day, pIdx, workload) => {
        const newGrid = JSON.parse(JSON.stringify(schedule));
        newGrid[day][pIdx] = {
            subject: workload.subject,
            teacher_id: workload.teacher_id,
            teacher_name: workload.teacher
        };
        onUpdate(newGrid);
        try {
            await fetch(`${apiTimetable}/solution/${solutionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGrid)
            });
        } catch (err) { console.error("Error updating manual timetable:", err); }
    };

    return (
        <div className="overflow-x-auto pb-6 animate-in fade-in duration-500">
            <div className="min-w-[1000px]">
                <div className="grid grid-cols-[140px_repeat(6,1fr)] gap-4 mb-6">
                    <div className="p-4">
                         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full text-center">Interactive Mode</p>
                    </div>
                    {days.map(day => (
                        <div key={day} className="p-5 bg-slate-900 rounded-[1.5rem] text-center font-black text-white text-xs tracking-widest uppercase shadow-xl shadow-slate-900/10">{day}</div>
                    ))}
                </div>
                
                {Array.from({length: periodsCount}).map((_, pIdx) => (
                    <div key={pIdx} className="grid grid-cols-[140px_repeat(6,1fr)] gap-4 mb-4">
                        <div className="p-5 bg-slate-50 rounded-[1.5rem] flex flex-col items-center justify-center border border-slate-100 text-center shadow-sm font-black text-xs text-slate-600">
                            Period {pIdx + 1}
                        </div>
                        {days.map(day => {
                            const slot = schedule[day][pIdx];
                            const isSpecial = slot?.teacher_id === -1;
                            const isSelfStudy = slot?.subject === 'Self Study' || slot?.subject?.includes('Free');
                            
                            return (
                                <div 
                                    key={day} 
                                    draggable={!!slot}
                                    onDragStart={() => handleDragStart(day, pIdx, slot)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(day, pIdx)}
                                    className={`p-5 rounded-[1.8rem] border flex flex-col justify-center items-center text-center transition-all cursor-move ${
                                        isSpecial && !isSelfStudy ? 'bg-indigo-50 border-indigo-100' : isSelfStudy ? 'bg-amber-50/10 border-amber-100/30' : 'bg-white border-slate-100 hover:shadow-lg hover:border-[#0BC48B]/30'
                                    } ${dragged?.day === day && dragged?.pIdx === pIdx ? 'opacity-30 scale-95' : ''}`}
                                >
                                    {slot ? (
                                        <>
                                            <span className={`font-black text-xs tracking-tight ${isSpecial && !isSelfStudy ? 'text-indigo-600' : isSelfStudy ? 'text-amber-600' : 'text-slate-800'}`}>{slot.subject}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">{slot.teacher_name === 'N/A' || !slot.teacher_name ? 'Auto-Filled' : slot.teacher_name}</span>
                                        </>
                                    ) : (
                                        <div className="group relative w-full h-full flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-slate-200 group-hover:hidden">Empty</span>
                                            <div className="hidden group-hover:flex items-center gap-1 scale-90">
                                                <select 
                                                    onChange={(e) => {
                                                        const w = classWorkloads.find(x => x.subject === e.target.value);
                                                        if (w) handleManualSubject(day, pIdx, w);
                                                    }}
                                                    className="bg-slate-50 text-[9px] font-black uppercase border border-slate-100 rounded-lg px-2 py-1 outline-none"
                                                >
                                                    <option value="">Fill...</option>
                                                    {classWorkloads.map((w, idx) => <option key={idx} value={w.subject}>{w.subject}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="mt-6 flex items-center gap-2 px-6">
                <div className="w-2 h-2 bg-[#0BC48B] rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Drag and drop subjects to reorder. Changes save automatically.</p>
            </div>
        </div>
    );
};

const TeacherTimetableList = ({ teacherName, fullSchedule }) => {
    if (!teacherName || !fullSchedule || !fullSchedule[teacherName]) {
        return (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-400">Please select a teacher to view their personal schedule.</p>
            </div>
        );
    }

    const sched = fullSchedule[teacherName];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
            {days.map(day => (
                <div key={day} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-6 border-b border-slate-50 pb-4 flex justify-between">
                        {day} 
                        <span className="text-slate-400">{sched[day]?.length || 0} Periods</span>
                    </h4>
                    <div className="space-y-4">
                        {sched[day] ? sched[day].sort((a,b) => a.p - b.p).map((slot, i) => (
                            <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group hover:bg-[#0BC48B]/5 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-xs text-slate-400 group-hover:text-[#0BC48B] group-hover:border-[#0BC48B]/20 shadow-sm">
                                    P{slot.p}
                                </div>
                                <div>
                                    <h5 className="font-black text-slate-800 text-sm">{slot.sub}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class {slot.cls}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[10px] font-bold text-slate-300 italic">No assigned classes</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};


const MappingCard = ({ cls, sub, tr, n }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#0BC48B] hover:shadow-md transition-all">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest leading-none">{cls}</span>
                <span className="text-[10px] font-black bg-[#0BC48B]/10 text-[#0BC48B] px-2 py-0.5 rounded uppercase tracking-widest leading-none">{n} Periods/Wk</span>
            </div>
            <h4 className="font-black text-slate-800 tracking-tight">{sub}</h4>
            <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{tr}</p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            <Trash2 size={16} />
        </button>
    </div>
);

const InputGroup = ({ label, placeholder, type, value, onChange, defaultValue }) => {
    return (
        <div className="w-full">
            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
            <input 
                type={type} 
                placeholder={placeholder} 
                {...(value !== undefined ? { value, onChange } : { defaultValue })}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm" 
            />
        </div>
    );
};

const SelectGroup = ({ label, options, value, onChange, disabled }) => (
    <div className="w-full">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative group">
            <select 
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full border px-6 py-4 rounded-[1.5rem] text-sm font-semibold outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer shadow-sm ${
                    disabled ? 'bg-slate-100 border-slate-100 text-slate-400' : 'bg-slate-50/50 border-slate-100 text-slate-800 focus:bg-white'
                }`}
            >
                {options.map((opt, i) => <option key={i} value={opt.includes('Select') ? '' : opt}>{opt}</option>)}
            </select>
            <div className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-[#0BC48B]'}`}>
                <ChevronDown size={18} />
            </div>
        </div>
    </div>
);

const TimeSelectGroup = ({ label, value, onChange }) => {
    // Parse existing "10:30 AM" or fallback
    let currentH = "12", currentM = "00", currentP = "AM";
    if (value) {
        if (value.includes("AM") || value.includes("PM")) {
             const [t, p] = value.split(' ');
             const [h, m] = t.split(':');
             currentH = h; currentM = m; currentP = p;
        } else {
             // 24hr to 12hr
             let [h, m] = value.split(':');
             h = parseInt(h, 10);
             currentP = h >= 12 ? 'PM' : 'AM';
             h = h % 12 || 12;
             currentH = h.toString().padStart(2, '0');
             currentM = m;
        }
    }

    const handleH = (e) => onChange(`${e.target.value}:${currentM} ${currentP}`);
    const handleM = (e) => onChange(`${currentH}:${e.target.value} ${currentP}`);
    const handleP = (e) => onChange(`${currentH}:${currentM} ${e.target.value}`);

    const hours = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ["00", "05", "10", "15", "20", "30", "40", "45", "50", "55"];

    return (
        <div className="w-full">
            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
            <div className="flex items-center w-full bg-white border border-slate-100 rounded-[1.5rem] shadow-sm px-2 focus-within:ring-4 focus-within:ring-[#0BC48B]/10 focus-within:border-[#0BC48B] transition-all">
                <select value={currentH} onChange={handleH} className="bg-transparent py-4 pl-4 pr-1 text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer flex-1 text-center">
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="font-black text-slate-300">:</span>
                <select value={currentM} onChange={handleM} className="bg-transparent py-4 px-1 text-sm font-black text-slate-800 outline-none appearance-none cursor-pointer flex-1 text-center">
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="w-px h-6 bg-slate-100 mx-1"></div>
                <select value={currentP} onChange={handleP} className="bg-transparent py-4 pr-4 pl-1 text-sm font-black text-[#0BC48B] outline-none appearance-none cursor-pointer flex-1 text-center">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );
};
