import React, { useState, useEffect } from 'react';
import {
    Wallet,
    Settings2,
    LayoutGrid,
    Plus,
    Trash2,
    ChevronRight,
    IndianRupee,
    Clock,
    Layers,
    CheckCircle2,
    Search,
    Filter,
    Calendar,
    ArrowRight,
    FileText,
    User,
    ChevronLeft
} from 'lucide-react';
import config from "@/config";

const ACADEMIC_MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

const QUARTERLY_PERIODS = [
    { value: 'Q1', label: 'Q1 (Jun - Aug)' },
    { value: 'Q2', label: 'Q2 (Sep - Nov)' },
    { value: 'Q3', label: 'Q3 (Dec - Feb)' },
    { value: 'Q4', label: 'Q4 (Mar - May)' }
];

const HALF_YEARLY_PERIODS = [
    { value: 'H1', label: 'H1 (Jun - Nov)' },
    { value: 'H2', label: 'H2 (Dec - May)' }
];

export const FinancialManagementModule = ({ initialTab = 'categories' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [categories, setCategories] = useState([]);
    const [frequencies, setFrequencies] = useState([
        { id: 'f1', name: 'Yearly' },
        { id: 'f2', name: 'Monthly' },
        { id: 'f3', name: 'Quarterly' },
        { id: 'f4', name: 'Half-Yearly' },
        { id: 'f5', name: 'One-Time' }
    ]);
    const [structures, setStructures] = useState([]);
    const [isFreqModalOpen, setIsFreqModalOpen] = useState(false);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        fetchCategories();
        fetchStructures();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/categories`);
            if (res.ok) setCategories(await res.json());
        } catch (e) { console.error("Failed to fetch categories", e); }
    };

    const fetchFrequencies = async () => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/frequencies`);
            if (res.ok) {
                const data = await res.json();
                // Merge DB frequencies with defaults, avoiding duplicates
                setFrequencies(prev => {
                    const existingNames = prev.map(f => f.name.toLowerCase());
                    const newData = data.filter(f => !existingNames.includes(f.name.toLowerCase()));
                    return [...prev, ...newData];
                });
            }
        } catch (e) { console.error("Failed to fetch frequencies", e); }
    };

    const fetchStructures = async () => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/structures`);
            if (res.ok) setStructures(await res.json());
        } catch (e) { console.error("Failed to fetch structures", e); }
    };

    const levelConfigs = {
        "KG": ["LKG", "UKG"],
        "LP": ["Class 1", "Class 2", "Class 3", "Class 4"],
        "UP": ["Class 5", "Class 6", "Class 7"],
        "HIGH SCHOOL": ["Class 8", "Class 9", "Class 10"],
        "HIGHERSECONDARY": ["Class 11", "Class 12"]
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto pb-10">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Financial Management</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Institutional Fiscal Structure & Fee Engines</p>
                </div>
            </div>

            {/* View Container */}
            <div className="translate-y-0 opacity-100 transition-all duration-500">
                {activeTab === 'categories' && (
                    <FeeCategories
                        categories={categories}
                        fetchCategories={fetchCategories}
                    />
                )}
                {activeTab === 'structure' && (
                    <StructureCreator
                        levelConfigs={levelConfigs}
                        categories={categories}
                        frequencies={frequencies}
                        structures={structures}
                        fetchStructures={fetchStructures}
                        onAddFreq={() => setIsFreqModalOpen(true)}
                    />
                )}
                {isFreqModalOpen && (
                    <QuickFrequencyModal
                        onClose={() => setIsFreqModalOpen(false)}
                        onSuccess={fetchFrequencies}
                    />
                )}
                {activeTab === 'collection' && (
                    <FeeCollection
                        levelConfigs={levelConfigs}
                        categories={categories}
                        structures={structures}
                    />
                )}
            </div>
        </div>
    );
};

// --- PAGE 1: FEE CATEGORIES ---
const FeeCategories = ({ categories, fetchCategories }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = async () => {
        if (!newCategory.trim()) return;
        if (categories.some(c => c.name.toLowerCase() === newCategory.trim().toLowerCase())) {
            alert("Category already exists");
            return;
        }
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategory.trim() })
            });
            if (res.ok) {
                setNewCategory('');
                fetchCategories();
            }
        } catch (e) { console.error(e); }
    };

    const handleRemove = async (id) => {
        try {
            await fetch(`${config.API_BASE_URL}/v1/finance/categories/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-5">
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <div className="w-14 h-14 bg-[#0BC48B]/10 rounded-2xl flex items-center justify-center text-[#0BC48B] mb-8">
                        <Plus size={24} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Create Category</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Define new financial entry types</p>

                    <div className="space-y-6">
                        <div className="group transition-all">
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Category Name</label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. Activity Fee"
                                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                        >
                            <Plus size={18} /> Add to Repository
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-7">
                <div className="bg-slate-50/50 rounded-[3.5rem] p-4 border border-slate-100 shadow-inner">
                    <div className="bg-white rounded-[3rem] p-10 min-h-[400px]">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Financial Categories</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <div key={cat.id} className="group flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] hover:bg-white hover:border-[#0BC48B] hover:shadow-xl hover:shadow-slate-200 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#0BC48B] transition-colors shadow-sm">
                                            <Wallet size={16} />
                                        </div>
                                        <span className="text-sm font-black text-slate-700">{cat.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(cat.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- QUICK FREQUENCY MODAL ---
const QuickFrequencyModal = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/frequencies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to add frequency");
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                    <Clock size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">New Frequency</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Define a new payment cycle</p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Frequency Name</label>
                        <input
                            type="text"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Monthly"
                            className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.5rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all"
                        />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button onClick={onClose} className="flex-1 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Frequency'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PAGE 2: STRUCTURE CREATOR ---
const StructureCreator = ({ levelConfigs, categories, frequencies, structures, fetchStructures, onAddFreq }) => {
    const [selectedLevel, setSelectedLevel] = useState('LP');
    const [selectedClass, setSelectedClass] = useState(null);
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    const [activeRowFrequencies, setActiveRowFrequencies] = useState({});
    const [form, setForm] = useState({
        category_name: '',
        amount: '',
        frequency: 'Yearly',
        due_date: '',
        invoice_date: '',
        due_day: '10',
        invoice_day: '1',
        month_from: 'Jun',
        month_to: 'Mar'
    });


    const handleAddStructure = async () => {
        if (!selectedClass || !form.category_name || !form.amount) {
            alert("Please select a class, category and enter an amount.");
            return;
        }

        const newEntry = {
            section: selectedLevel,
            class_name: selectedClass,
            category_name: form.category_name,
            amount: parseFloat(form.amount),
            frequency: form.frequency,
            due_date: form.frequency === 'One-Time' ? (form.due_date || null) : (['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? null : (form.due_date || null)),
            invoice_date: form.frequency === 'One-Time' ? (form.invoice_date || null) : null,
            due_day: ['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? (parseInt(form.due_day) || null) : null,
            invoice_day: ['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? (parseInt(form.invoice_day) || null) : null,
            month_from: ['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? form.month_from : null,
            month_to: form.frequency === 'Monthly' ? form.month_to : null
        };

        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/structures`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEntry)
            });

            if (res.ok) {
                const savedEntry = await res.json();
                fetchStructures();
                // Explicitly set the active frequency to the one just saved
                setActiveRowFrequencies(prev => ({ ...prev, [form.category_name]: form.frequency }));
                setForm({ ...form, category_name: '', amount: '', due_date: '' });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const removeStructure = async (id) => {
        try {
            await fetch(`${config.API_BASE_URL}/v1/finance/structures/${id}`, { method: "DELETE" });
            fetchStructures();
        } catch (e) { console.error(e); }
    };

    const classStructures = structures.filter(s => s.class_name === selectedClass);

    const groupedStructures = classStructures.reduce((acc, curr) => {
        if (!acc[curr.category_name]) acc[curr.category_name] = [];
        acc[curr.category_name].push(curr);
        return acc;
    }, {});

    return (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            {/* Level Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {Object.keys(levelConfigs).map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            setSelectedLevel(level);
                            setSelectedClass(null);
                        }}
                        className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-4 ${selectedLevel === level
                            ? "bg-[#0BC48B] text-white shadow-lg shadow-[#0BC48B]/30 scale-105"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${selectedLevel === level ? "bg-white animate-pulse" : "bg-slate-600"}`} />
                        {level}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Classes Column */}
                {!isSidebarHidden && (
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Available Classes</h4>
                        {levelConfigs[selectedLevel].map((cls) => (
                            <button
                                key={cls}
                                onClick={() => setSelectedClass(cls)}
                                className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${selectedClass === cls
                                    ? "bg-white border-[#0BC48B] shadow-xl shadow-slate-200"
                                    : "bg-white/50 border-transparent hover:border-slate-200"
                                    }`}
                            >
                                <span className={`font-black text-sm transition-colors ${selectedClass === cls ? "text-slate-900" : "text-slate-500"}`}>{cls}</span>
                                <div className={`p-2 rounded-xl transition-all ${selectedClass === cls ? "bg-[#0BC48B] text-white" : "bg-slate-100 text-slate-300 group-hover:text-slate-500"}`}>
                                    <ChevronRight size={16} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Configuration Panel */}
                {selectedClass && (
                    <div className={`${isSidebarHidden ? 'lg:col-span-12' : 'lg:col-span-9'} animate-in fade-in slide-in-from-left-4 duration-500`}>
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                                        className="w-12 h-12 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border border-slate-200"
                                        title={isSidebarHidden ? "Show Classes" : "Hide Classes"}
                                    >
                                        {isSidebarHidden ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                                    </button>
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Structure for {selectedClass}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Section: {selectedLevel}</p>
                                    </div>
                                </div>
                                <div className="px-5 py-2 bg-[#0BC48B]/10 rounded-full text-[#0BC48B] font-black text-[10px] uppercase tracking-widest">
                                    Active Config
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Fee Type</label>
                                    <div className="relative">
                                        <select
                                            value={form.category_name}
                                            onChange={(e) => setForm({ ...form, category_name: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Type...</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Filter size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <div className="flex justify-between items-center mb-3 ml-1">
                                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest">Frequency</label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={form.frequency}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                let mf = form.month_from;
                                                let mt = form.month_to;
                                                if (val === 'Monthly') { mf = 'Jun'; mt = 'Mar'; }
                                                else if (val === 'Quarterly') { mf = 'Q1'; mt = 'Q4'; }
                                                else if (val === 'Half-Yearly') { mf = 'H1'; mt = 'H2'; }
                                                else if (val === 'One-Time') { mf = 'Jun'; mt = 'Jun'; }
                                                setForm({ ...form, frequency: val, month_from: mf, month_to: mt });
                                            }}
                                            className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer"
                                        >
                                            {frequencies.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Clock size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Amount (₹)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={form.amount}
                                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                            placeholder="5000"
                                            className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#0BC48B]">
                                            <IndianRupee size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">
                                        {['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? 'Invoice Day' : 'Invoice Date'}
                                    </label>
                                    <div className="relative">
                                        {['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? (
                                            <select
                                                value={form.invoice_day}
                                                onChange={(e) => setForm({ ...form, invoice_day: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Day...</option>
                                                {[...Array(31)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="date"
                                                value={form.invoice_date}
                                                onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-sm cursor-pointer"
                                            />
                                        )}
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                            <Calendar size={16} />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Due Date</label>
                                    <div className="relative">
                                        {['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) ? (
                                            <select
                                                value={form.due_day}
                                                onChange={(e) => setForm({ ...form, due_day: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Day...</option>
                                                {[...Array(31)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="date"
                                                value={form.due_date}
                                                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all shadow-sm cursor-pointer"
                                            />
                                        )}
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#0BC48B]">
                                            <Calendar size={16} />
                                        </div>
                                    </div>
                                </div>

                                {!['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) && (
                                    <button
                                        onClick={handleAddStructure}
                                        className="h-[64px] bg-[#0BC48B] text-white px-8 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                                    >
                                        <Plus size={20} /> Add Fee
                                    </button>
                                )}
                            </div>

                            {['Monthly', 'Quarterly', 'Half-Yearly'].includes(form.frequency) && (
                                <div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap items-center gap-8 animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Fee Start Period</label>
                                        <div className="relative">
                                            <select
                                                value={form.month_from}
                                                onChange={(e) => setForm({ ...form, month_from: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                                            >
                                                {form.frequency === 'Monthly' && ACADEMIC_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                {form.frequency === 'Quarterly' && QUARTERLY_PERIODS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                                                {form.frequency === 'Half-Yearly' && HALF_YEARLY_PERIODS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                                <Calendar size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    {form.frequency === 'Monthly' && (
                                        <>
                                            <div className="flex items-center pt-8">
                                                <div className="w-10 h-1px bg-slate-200" />
                                                <ArrowRight className="text-slate-300 mx-2" size={16} />
                                                <div className="w-10 h-1px bg-slate-200" />
                                            </div>
                                            <div className="flex-1 min-w-[200px]">
                                                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Fee End Period</label>
                                                <div className="relative">
                                                    <select
                                                        value={form.month_to}
                                                        onChange={(e) => setForm({ ...form, month_to: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-black text-slate-800 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                                                    >
                                                        {ACADEMIC_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                                        <Calendar size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Billing Cycle</p>
                                            <p className="text-xs font-black text-indigo-900">{form.month_from} {form.frequency === 'Monthly' ? `— ${form.month_to}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex justify-end">
                                        <button
                                            onClick={handleAddStructure}
                                            className="h-[64px] bg-[#0BC48B] text-white px-8 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                                        >
                                            <Plus size={20} /> Add Fee
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned Fee Entries</h4>
                                <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100">
                                    <table className="w-full border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequency</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-rose-500 uppercase tracking-widest">Delete Entry</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {Object.entries(groupedStructures).map(([catName, feeEntries]) => {
                                                const currentFreq = activeRowFrequencies[catName] || feeEntries[0].frequency;
                                                const activeEntry = feeEntries.find(e => e.frequency === currentFreq) || feeEntries[0];

                                                return (
                                                    <tr key={catName} className="border-t border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                                        <td className="px-8 py-5">
                                                            <span className="text-sm font-black text-slate-800">{catName}</span>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="relative inline-block w-40">
                                                                <select
                                                                    value={activeEntry.frequency}
                                                                    onChange={(e) => setActiveRowFrequencies(prev => ({ ...prev, [catName]: e.target.value }))}
                                                                    className="w-full bg-indigo-50 text-indigo-600 border border-transparent px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/20 appearance-none cursor-pointer transition-all hover:bg-indigo-100"
                                                                >
                                                                    {feeEntries.map(e => <option key={e.id} value={e.frequency}>{e.frequency}</option>)}
                                                                </select>
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                                                    <Calendar size={12} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <span className="text-sm font-black text-[#0BC48B] transition-all">₹{activeEntry.amount.toLocaleString('en-IN')}</span>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                                                    Invoice: Day {activeEntry.invoice_day || activeEntry.due_day || 1}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                                    {activeEntry.frequency === 'Monthly'
                                                                        ? `Due: Day ${activeEntry.due_day || 10} (${activeEntry.month_from} - ${activeEntry.month_to})`
                                                                        : ['Quarterly', 'Half-Yearly'].includes(activeEntry.frequency)
                                                                            ? `Due: Day ${activeEntry.due_day || 10}`
                                                                            : (activeEntry.due_date ? new Date(activeEntry.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Date')}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm(`Are you sure you want to delete the ${activeEntry.frequency} entry for ${catName}?`)) {
                                                                        removeStructure(activeEntry.id);
                                                                    }
                                                                }}
                                                                className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                                                                title="Delete Entry"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {Object.keys(groupedStructures).length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-10 text-center">
                                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No fees assigned to this class yet</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!selectedClass && (
                    <div className={`${isSidebarHidden ? 'lg:col-span-12' : 'lg:col-span-9'} flex items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 relative min-h-[400px]`}>
                        <button
                            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                            className="absolute top-10 left-10 w-12 h-12 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border border-slate-200"
                            title={isSidebarHidden ? "Show Classes" : "Hide Classes"}
                        >
                            {isSidebarHidden ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm border border-slate-100">
                                <ArrowRight size={32} />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Select a class from the left to configure structure</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- PAGE 3: FEE COLLECTION ---
const FeeCollection = ({ levelConfigs, categories, structures }) => {
    const [selectedLevel, setSelectedLevel] = useState('LP');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedFeeType, setSelectedFeeType] = useState('All');
    const [studentsList, setStudentsList] = useState([]);
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    const divisions = ['A', 'B', 'C', 'D'];

    useEffect(() => {
        if (selectedClass) {
            if (selectedFeeType === 'All' || selectedDivision) {
                fetchStudents();
            } else {
                setStudentsList([]);
            }
        } else {
            setStudentsList([]);
        }
    }, [selectedClass, selectedDivision, selectedFeeType]);

    const fetchStudents = async () => {
        try {
            let url = `${config.API_BASE_URL}/students/?grade=${selectedClass}`;
            if (selectedFeeType !== 'All' && selectedDivision) {
                url += `&section=${selectedDivision}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                setStudentsList(await res.json());
            }
        } catch (e) {
            console.error("Failed to fetch real students", e);
        }
    };

    const handleInvoiceClick = (student) => {
        // Dispatch custom global event to trigger cross-module navigation
        window.dispatchEvent(new CustomEvent('navigateToStudentProfile', { detail: student }));
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            {/* Level Selector */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {Object.keys(levelConfigs).map((level) => (
                    <button
                        key={level}
                        onClick={() => {
                            setSelectedLevel(level);
                            setSelectedClass(null);
                            setSelectedDivision(null);
                        }}
                        className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-4 ${selectedLevel === level
                            ? "bg-[#0BC48B] text-white shadow-lg shadow-[#0BC48B]/30 scale-105"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                    >
                        <div className={`w-2 h-2 rounded-full ${selectedLevel === level ? "bg-white animate-pulse" : "bg-slate-600"}`} />
                        {level}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Classes Column */}
                {!isSidebarHidden && (
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Available Classes</h4>
                        {levelConfigs[selectedLevel].map((cls) => (
                            <button
                                key={cls}
                                onClick={() => {
                                    setSelectedClass(cls);
                                    setSelectedDivision(null);
                                }}
                                className={`w-full text-left p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${selectedClass === cls
                                    ? "bg-white border-[#0BC48B] shadow-xl shadow-slate-200"
                                    : "bg-white/50 border-transparent hover:border-slate-200"
                                    }`}
                            >
                                <span className={`font-black text-sm transition-colors ${selectedClass === cls ? "text-slate-900" : "text-slate-500"}`}>{cls}</span>
                                <div className={`p-2 rounded-xl transition-all ${selectedClass === cls ? "bg-[#0BC48B] text-white" : "bg-slate-100 text-slate-300 group-hover:text-slate-500"}`}>
                                    <ChevronRight size={16} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Main Workspace Column */}
                {selectedClass && (
                    <div className={`${isSidebarHidden ? 'lg:col-span-12' : 'lg:col-span-9'} animate-in fade-in slide-in-from-left-4 duration-500`}>
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">

                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                                        className="w-12 h-12 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border border-slate-200"
                                        title={isSidebarHidden ? "Show Classes" : "Hide Classes"}
                                    >
                                        {isSidebarHidden ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                                    </button>
                                    <div className="w-14 h-14 bg-[#0BC48B]/10 rounded-2xl flex items-center justify-center text-[#0BC48B] shadow-sm">
                                        <Layers size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Class Sections</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Filter by {selectedClass}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <select
                                            value={selectedFeeType}
                                            onChange={(e) => setSelectedFeeType(e.target.value)}
                                            className="bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#0BC48B] focus:ring-2 focus:ring-[#0BC48B]/20 appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="All">All Fee Types</option>
                                            {categories && categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Filter size={14} />
                                        </div>
                                    </div>
                                    <div className={`relative ${selectedFeeType === 'All' ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <select
                                            value={selectedDivision || ""}
                                            onChange={(e) => setSelectedDivision(e.target.value)}
                                            disabled={selectedFeeType === 'All'}
                                            className="bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#0BC48B] focus:ring-2 focus:ring-[#0BC48B]/20 appearance-none shadow-sm cursor-pointer disabled:bg-slate-50"
                                        >
                                            <option value="" disabled>Select Section</option>
                                            {divisions.map((div) => (
                                                <option key={div} value={div}>Section {div}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <Layers size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedDivision || selectedFeeType === 'All' ? (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest pl-2 mb-4">
                                        Enrolled Students ({selectedClass}{selectedFeeType !== 'All' ? ` - Sec ${selectedDivision}` : ' - All Sections'})
                                    </h4>
                                    <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100 shadow-inner bg-slate-50/50">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-slate-100 bg-white shadow-sm">
                                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll</th>
                                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                                                    {selectedFeeType !== 'All' ? (
                                                        <>
                                                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid</th>
                                                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</th>
                                                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Address</th>
                                                        </>
                                                    )}
                                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ledger</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {studentsList.length > 0 ? studentsList.map((st, idx) => {
                                                    const globalMockPayments = JSON.parse(localStorage.getItem('globalMockPayments') || '{}');
                                                    const studentPayments = globalMockPayments[st.id] || {};

                                                    let status = "Pending";
                                                    let paid = 0;
                                                    let pending = 0;

                                                    if (selectedFeeType !== 'All') {
                                                        const duesData = structures.find(s => s.class_name === selectedClass && s.category_name === selectedFeeType);
                                                        const baseAmount = duesData ? duesData.amount : 0;

                                                        let duesAmount = baseAmount;
                                                        if (duesData && duesData.frequency === 'Monthly') {
                                                            const startIdx = ACADEMIC_MONTHS.indexOf(duesData.month_from || 'Jun');
                                                            const endIdx = ACADEMIC_MONTHS.indexOf(duesData.month_to || 'May');
                                                            const monthsCount = startIdx <= endIdx
                                                                ? (endIdx - startIdx + 1)
                                                                : (12 - startIdx + endIdx + 1);
                                                            duesAmount = baseAmount * monthsCount;
                                                        }

                                                        paid = studentPayments[selectedFeeType] || 0;
                                                        pending = duesAmount - paid;
                                                        status = pending <= 0 ? "Paid" : "Pending";
                                                    }

                                                    return (
                                                        <tr key={st.id} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 py-5 font-black text-slate-900 text-sm">{(idx + 1).toString().padStart(2, '0')}</td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                                                        {st.full_name.charAt(0)}
                                                                    </div>
                                                                    <span className="font-black text-slate-900 text-sm">{st.full_name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-slate-500 font-bold text-xs">
                                                                {st.guardian?.full_name || 'N/A'}
                                                            </td>
                                                            {selectedFeeType !== 'All' ? (
                                                                <>
                                                                    <td className="px-6 py-5">
                                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Paid' ? 'bg-[#0BC48B]/10 text-[#0BC48B]' : 'bg-rose-500/10 text-rose-500'}`}>
                                                                            {status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-5 text-slate-900 font-black text-xs">
                                                                        ₹{paid.toLocaleString('en-IN')}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-slate-900 font-black text-xs">
                                                                        ₹{pending.toLocaleString('en-IN')}
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td className="px-6 py-5 text-slate-500 font-bold text-xs">
                                                                        {st.guardian?.emergency_contact || 'N/A'}
                                                                    </td>
                                                                    <td className="px-6 py-5 text-slate-500 font-bold text-xs truncate max-w-[150px]">
                                                                        {st.guardian?.home_address || 'No address provided'}
                                                                    </td>
                                                                </>
                                                            )}
                                                            <td className="px-6 py-5 text-right">
                                                                <button
                                                                    onClick={() => handleInvoiceClick(st)}
                                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-lg transition-all"
                                                                >
                                                                    <FileText size={14} /> Invoice Profile
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) : (
                                                    <tr>
                                                        <td colSpan={selectedFeeType === 'All' ? "4" : "7"} className="px-6 py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No students enrolled in this division</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                                        <User size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Select a section division above to see students</p>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                {!selectedClass && (
                    <div className={`${isSidebarHidden ? 'lg:col-span-12' : 'lg:col-span-9'} flex items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 relative min-h-[400px]`}>
                        <button
                            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                            className="absolute top-10 left-10 w-12 h-12 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm border border-slate-200"
                            title={isSidebarHidden ? "Show Classes" : "Hide Classes"}
                        >
                            {isSidebarHidden ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                        <div className="text-center py-24">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm border border-slate-100">
                                <ArrowRight size={32} />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Select a class from the left to load subdivisions</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
