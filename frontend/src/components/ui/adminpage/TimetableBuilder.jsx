import React, { useState } from 'react';
import { CalendarDays, Clock, BookOpen, Settings, ChevronRight, ChevronLeft, Save, Play, CheckCircle2, AlertOctagon, ChevronDown, Plus, Trash2 } from 'lucide-react';

export const TimetableBuilderModule = () => {
    const [step, setStep] = useState(1);
    
    // States for the wizard
    const [globalTime, setGlobalTime] = useState({
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        periods: 8,
        duration: 45,
        breaks: [
            { id: 1, start: "10:30 AM", end: "10:45 AM" },
            { id: 2, start: "01:00 PM", end: "01:45 PM" }
        ]
    });
    const [workloads, setWorkloads] = useState([]);
    const [constraints, setConstraints] = useState([]);

    const steps = [
        { id: 1, title: 'Global Time', subtitle: 'Step A', icon: <Clock size={16} /> },
        { id: 2, title: 'Workload Mapping', subtitle: 'Step B', icon: <BookOpen size={16} /> },
        { id: 3, title: 'Constraints', subtitle: 'Step C', icon: <Settings size={16} /> },
        { id: 4, title: 'Output Grid', subtitle: 'Step D', icon: <CalendarDays size={16} /> }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Automated Timetable Builder</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI-powered scheduling and conflict resolution</p>
                </div>
            </div>

            {/* Stepper Navigation */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-50 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
                {steps.map(s => (
                    <div key={s.id} onClick={() => setStep(s.id)} className={`flex-1 min-w-[200px] flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${step === s.id ? 'bg-[#0BC48B] text-white shadow-lg shadow-[#0BC48B]/20' : step > s.id ? 'bg-slate-50 text-slate-800' : 'text-slate-400 hover:bg-slate-50'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${step === s.id ? 'bg-white/20' : 'bg-white shadow-sm border border-slate-100'}`}>
                            {step > s.id ? <CheckCircle2 size={20} className={step > s.id ? "text-[#0BC48B]" : ""} /> : s.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{s.subtitle}</p>
                            <h4 className="font-black text-sm tracking-tight">{s.title}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            {step === 1 && <StepAGlobalTime data={globalTime} setData={setGlobalTime} onNext={() => setStep(2)} />}
            {step === 2 && <StepBWorkload onNext={() => setStep(3)} onPrev={() => setStep(1)} workloads={workloads} setWorkloads={setWorkloads} />}
            {step === 3 && <StepCConstraints onNext={() => setStep(4)} onPrev={() => setStep(2)} constraints={constraints} setConstraints={setConstraints} />}
            {step === 4 && <StepDOutputGrid onPrev={() => setStep(3)} />}
            
        </div>
    );
};

const StepAGlobalTime = ({ data, setData, onNext }) => {
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

    return (
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-50 shadow-sm animate-in slide-in-from-right-4">
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Global Time Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
            <div className="mt-12 flex justify-end">
                <button onClick={onNext} className="bg-[#0BC48B] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                    Continue to Workload Mapping <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const StepBWorkload = ({ onNext, onPrev, workloads, setWorkloads }) => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
        <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Add Workload Mapping</h3>
            <div className="space-y-6">
                <SelectGroup label="Target Class" options={['Select Class...', 'Grade 10 - A', 'Grade 10 - B', 'Grade 9 - A']} />
                <SelectGroup label="Subject" options={['Select Subject...', 'Mathematics', 'Physics', 'Biology', 'English Literature']} />
                <SelectGroup label="Assigned Teacher" options={['Select Teacher...', 'Sarah Jenkins', 'Michael Davis', 'Emily Roberts']} />
                <InputGroup label="Periods Needed Per Week" type="number" placeholder="e.g., 5" />
                
                <button onClick={() => setWorkloads([...workloads, { id: Date.now() }])} className="w-full bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all mt-4">
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
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Mapped Workloads ({workloads.length + 2})</h3>
            <div className="space-y-4">
                <MappingCard cls="Grade 10 - A" sub="Mathematics" tr="Sarah Jenkins" n="5" />
                <MappingCard cls="Grade 10 - B" sub="Physics" tr="Michael Davis" n="4" />
                {workloads.map((_, i) => (
                    <MappingCard key={i} cls="Grade 9 - A" sub="Biology" tr="Emily Roberts" n="3" />
                ))}
            </div>
        </div>
    </div>
);

const StepCConstraints = ({ onNext, onPrev, constraints, setConstraints }) => {
    // Local state for Step C constraint forms
    const [cTime, setCTime] = useState("02:00 PM");
    
    return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
        <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm">
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Set Constraints</h3>
            <div className="space-y-6">
                <SelectGroup label="Teacher" options={['Select Teacher...', 'Sarah Jenkins', 'Michael Davis', 'Global (All Teachers)']} />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Teacher Unavailability Time (Date)" type="date" />
                    <TimeSelectGroup label="Time" value={cTime} onChange={setCTime} />
                </div>
                <InputGroup label="Max Periods/Day per Teacher" type="number" defaultValue="6" />
                
                <button onClick={() => setConstraints([...constraints, { id: Date.now() }])} className="w-full bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all mt-4">
                    Add Constraint
                </button>
            </div>
            <div className="mt-8 flex justify-between">
                 <button onClick={onPrev} className="text-slate-400 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2">
                    <ChevronLeft size={16} /> Back
                </button>
                <button onClick={onNext} className="bg-[#0BC48B] text-white px-8 py-3.5 rounded-[1.5rem] font-black text-sm flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                    Generate Timetable <Play size={16} fill="currentColor" />
                </button>
            </div>
        </div>
        <div className="bg-slate-50 rounded-[3rem] p-8 lg:p-10 border border-slate-100 shadow-inner overflow-y-auto max-h-[600px]">
            <h3 className="font-black text-xl text-slate-800 tracking-tight mb-8">Active Constraints</h3>
            <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest bg-[#F97316]/10 px-3 py-1 rounded-full mb-3 inline-block">Global</span>
                    <h4 className="font-black text-slate-800">Max 5 periods per day</h4>
                </div>
                <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">Sarah Jenkins</span>
                    <h4 className="font-black text-slate-800">Unavailable Fridays after 13:00</h4>
                </div>
                {constraints.map((_, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100 animate-in fade-in zoom-in">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full mb-3 inline-block">Custom</span>
                        <h4 className="font-black text-slate-800">New constraint applied</h4>
                    </div>
                ))}
            </div>
        </div>
    </div>
)};

const StepDOutputGrid = ({ onPrev }) => {
    const [schedule, setSchedule] = useState([
        { time: '08:00 - 08:45', row: ['Maths (SJ)', 'Physics (MD)', 'English (ER)', 'History', 'Maths (SJ)'] },
        { time: '08:45 - 09:30', row: ['Physics (MD)', 'Maths (SJ)', 'History', 'English (ER)', 'Biology'] },
        { time: '09:30 - 10:15', row: ['Biology', 'English (ER)', 'Maths (SJ)', 'Physics (MD)', 'History'] },
        { type: 'break', label: 'MORNING BREAK' },
        { time: '10:30 - 11:15', row: ['English (ER)', 'History', 'Physics (MD)', 'Biology', 'Maths (SJ)'] },
    ]);
    const [error, setError] = useState(null);

    const handleDragStart = (e, rIndex, cIndex) => {
        e.dataTransfer.setData("rIndex", rIndex);
        e.dataTransfer.setData("cIndex", cIndex);
    };

    const handleDrop = (e, destRIndex, destCIndex) => {
        e.preventDefault();
        const rIndex = parseInt(e.dataTransfer.getData("rIndex"));
        const cIndex = parseInt(e.dataTransfer.getData("cIndex"));

        if (rIndex === destRIndex && cIndex === destCIndex) return;

        const sourceItem = schedule[rIndex].row[cIndex];
        const destItem = schedule[destRIndex].row[destCIndex];

        // Conflict Mockup: prevent moving 'Maths (SJ)' to Friday (index 4)
        if (destCIndex === 4 && sourceItem.includes('(SJ)')) {
            setError("Manual adjustment to Friday violates Sarah Jenkins' unavailability constraint.");
            return;
        }

        setError(null);
        const newSched = [...schedule];
        newSched[rIndex] = { ...newSched[rIndex], row: [...newSched[rIndex].row] };
        newSched[destRIndex] = { ...newSched[destRIndex], row: [...newSched[destRIndex].row] };

        newSched[rIndex].row[cIndex] = destItem;
        newSched[destRIndex].row[destCIndex] = sourceItem;
        setSchedule(newSched);
    };

    return (
        <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-black text-2xl text-slate-800 tracking-tight">Generated Timetable</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Grade 10 - A (Drag to manually adjust)</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={onPrev} className="bg-slate-50 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-slate-100 transition-colors">Edit Settings</button>
                    <button className="bg-[#0BC48B] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg flex items-center gap-2"><Save size={14} /> Publish Timetable</button>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in">
                    <AlertOctagon className="text-rose-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-black text-rose-700 text-sm">Conflict Detected</h4>
                        <p className="text-xs font-bold text-rose-500/80 mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto pb-4">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-6 gap-2 mb-2">
                        <div className="p-4"></div>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                            <div key={day} className="p-4 bg-slate-50 rounded-2xl text-center font-black text-slate-700 text-sm tracking-tight border border-slate-100">{day}</div>
                        ))}
                    </div>
                    {schedule.map((slot, i) => (
                        slot.type === 'break' ? (
                            <div key={i} className="grid grid-cols-6 gap-2 mb-2">
                                <div className="p-2"></div>
                                <div className="col-span-5 bg-amber-50 border border-amber-100/50 rounded-2xl py-2 flex items-center justify-center font-black text-[10px] text-amber-500 tracking-[0.2em] uppercase">
                                    {slot.label}
                                </div>
                            </div>
                        ) : (
                            <div key={i} className="grid grid-cols-6 gap-2 mb-2">
                                <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Period {i+1 > 3 ? i : i+1}</span>
                                    <span className="text-xs font-bold text-slate-600">{slot.time}</span>
                                </div>
                                {slot.row.map((sub, j) => (
                                    <div 
                                        key={j} 
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, i, j)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, i, j)}
                                        className={`p-4 rounded-2xl border flex flex-col justify-center items-center text-center cursor-move transition-transform hover:scale-105 shadow-sm active:cursor-grabbing ${
                                        sub.includes('(SJ)') ? 'bg-[#0BC48B]/10 border-[#0BC48B]/20' : 
                                        sub.includes('(MD)') ? 'bg-indigo-50 border-indigo-100' :
                                        i === 0 && j === 4 && error ? 'bg-rose-100 border-rose-200 ring-2 ring-rose-500/30' : 
                                        'bg-white border-slate-100 hover:border-slate-200'
                                    }`}>
                                        <span className={`font-black text-sm tracking-tight ${sub.includes('(SJ)') ? 'text-[#0BC48B]' : sub.includes('(MD)') ? 'text-indigo-600' : 'text-slate-700'}`}>{sub.split(' ')[0]}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub.split(' ')[1] || 'TBD'}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

const MappingCard = ({ cls, sub, tr, n }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#0BC48B] transition-colors">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest">{cls}</span>
                <span className="text-[10px] font-black bg-[#0BC48B]/10 text-[#0BC48B] px-2 py-0.5 rounded uppercase tracking-widest">{n} Periods/Wk</span>
            </div>
            <h4 className="font-black text-slate-800">{sub}</h4>
            <p className="text-xs font-bold text-slate-400 mt-0.5">{tr}</p>
        </div>
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

const SelectGroup = ({ label, options }) => (
    <div className="w-full">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-sm">
                {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
