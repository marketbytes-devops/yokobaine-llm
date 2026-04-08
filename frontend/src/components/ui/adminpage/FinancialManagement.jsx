import React, { useState } from 'react';
import { Wallet, Settings2, FileText, Plus, Save, IndianRupee, CreditCard, CheckCircle2, Clock, AlertCircle, Search } from 'lucide-react';

export const FinancialManagementModule = () => {
    const [activeTab, setActiveTab] = useState('setup');
    const [structures, setStructures] = useState([
        { id: 1, category: 'Tuition Fee - Q1', amount: '15000', applicableTo: 'Grade 10', dueDate: '2024-04-15' },
        { id: 2, category: 'Transport Fee', amount: '3500', applicableTo: 'All Students', dueDate: '2024-04-10' }
    ]);
    const [invoices, setInvoices] = useState([
        { id: 'INV-2024-001', category: 'Tuition Fee - Q1', status: 'Paid', method: 'Bank Transfer', txnId: 'TXN892374982', amount: '15000' },
        { id: 'INV-2024-002', category: 'Transport Fee', status: 'Pending', method: '-', txnId: '-', amount: '3500' },
        { id: 'INV-2024-003', category: 'Tuition Fee - Q1', status: 'Overdue', method: '-', txnId: '-', amount: '15000' }
    ]);

    // Format Indian Rupee
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Fee Management Engine</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Financial structures and invoice ledger</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto self-start md:self-auto">
                    <button onClick={() => setActiveTab('setup')} className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'setup' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Settings2 size={14} /> Structure Setup
                    </button>
                    <button onClick={() => setActiveTab('ledger')} className={`flex-1 md:flex-none px-6 py-2.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'ledger' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                        <FileText size={14} /> Invoice Ledger
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'setup' && <StructureSetupTab structures={structures} setStructures={setStructures} formatCurrency={formatCurrency} />}
            {activeTab === 'ledger' && <InvoiceLedgerTab invoices={invoices} setInvoices={setInvoices} formatCurrency={formatCurrency} />}
        </div>
    );
};

// --- TAB 1: STRUCTURE SETUP ---
const StructureSetupTab = ({ structures, setStructures, formatCurrency }) => {
    const [form, setForm] = useState({ category: '', amount: '', applicableTo: 'All Students', dueDate: '' });

    const handleSave = () => {
        if (!form.category || !form.amount) return;
        setStructures([{ ...form, id: Date.now() }, ...structures]);
        setForm({ category: '', amount: '', applicableTo: 'All Students', dueDate: '' });
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-right-4">
            <div className="xl:col-span-4 space-y-6">
                <div className="bg-white rounded-[3rem] p-8 border border-slate-50 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-[#0BC48B]/10 flex items-center justify-center text-[#0BC48B] mb-6">
                        <Wallet size={24} />
                    </div>
                    <h3 className="font-black text-xl text-slate-800 tracking-tight mb-6">Create Structure</h3>
                    
                    <div className="space-y-5">
                        <InputGroup label="Fee Category" placeholder="e.g. Annual Sports Fee" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                        
                        <div>
                            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Amount (₹)</label>
                            <div className="relative">
                                <IndianRupee size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm" />
                            </div>
                        </div>

                        <SelectGroup label="Applicable To (Multi-Select)" value={form.applicableTo} onChange={e => setForm({...form, applicableTo: e.target.value})} options={['All Students', 'Grade 10', 'Grade 9', 'Primary section', 'Opt-in Only']} />
                        
                        <InputGroup label="Due Date" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                        
                        <button onClick={handleSave} className="w-full bg-slate-900 text-white mt-4 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                            <Plus size={16} /> Add to Structures
                        </button>
                    </div>
                </div>
            </div>

            <div className="xl:col-span-8 bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner overflow-hidden flex flex-col">
                <h3 className="font-black text-xl text-slate-800 tracking-tight mb-6">Active Fee Structures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
                    {structures.map((st) => (
                        <div key={st.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#0BC48B]/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0BC48B]/5 rounded-bl-full -z-10 group-hover:bg-[#0BC48B]/10 transition-colors"></div>
                            <h4 className="font-black text-slate-800 text-lg mb-1 pr-10">{st.category}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-2 py-1 rounded-md mb-4">{st.applicableTo}</p>
                            
                            <div className="flex items-end justify-between mt-2">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Due Date</p>
                                    <p className="text-sm font-bold text-slate-700">{st.dueDate || 'Immediate'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-[#0BC48B] uppercase tracking-widest mb-0.5">Amount</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">{formatCurrency(st.amount)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- TAB 2: INVOICE LEDGER ---
const InvoiceLedgerTab = ({ invoices, setInvoices, formatCurrency }) => {
    const [form, setForm] = useState({ invoiceId: `INV-${Date.now().toString().slice(-6)}`, status: 'Paid', method: '', txnId: '', amount: '5000' });

    const handleRecord = () => {
        if (!form.txnId && form.status === 'Paid') return;
        setInvoices([{ ...form, id: form.invoiceId, category: 'Manual Entry' }, ...invoices]);
        setForm({ invoiceId: `INV-${Date.now().toString().slice(-6)}`, status: 'Paid', method: 'Cash', txnId: '', amount: '' });
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-right-4">
             <div className="xl:col-span-8 bg-white rounded-[3rem] p-8 border border-slate-50 shadow-sm flex flex-col min-h-[600px]">
                 <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <h3 className="font-black text-xl text-slate-800 tracking-tight">Invoice Ledger</h3>
                    <div className="flex bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-full md:w-64 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0BC48B]/10 transition-all">
                        <Search size={16} className="text-slate-400 mr-2 mt-0.5" />
                        <input type="text" placeholder="Search invoices..." className="bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 outline-none w-full" />
                    </div>
                </div>
                <div className="overflow-x-auto flex-1 pb-4">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 w-32">Invoice ID</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Txn ID / Method</th>
                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 pr-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="align-middle">
                            {invoices.map((inv, idx) => (
                                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 pl-4">
                                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">{inv.id}</span>
                                    </td>
                                    <td className="py-4">
                                        <p className="text-sm font-bold text-slate-700">{inv.category}</p>
                                    </td>
                                    <td className="py-4 text-sm font-black text-slate-800">{inv.amount ? formatCurrency(inv.amount) : '-'}</td>
                                    <td className="py-4">
                                        <p className="text-xs font-bold text-slate-600">{inv.txnId}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.method}</p>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            inv.status === 'Paid' ? 'bg-[#0BC48B]/10 text-[#0BC48B]' : 
                                            inv.status === 'Overdue' ? 'bg-rose-100 text-rose-600' : 
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {inv.status === 'Paid' && <CheckCircle2 size={12} />}
                                            {inv.status === 'Pending' && <Clock size={12} />}
                                            {inv.status === 'Overdue' && <AlertCircle size={12} />}
                                            {inv.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>

             {/* Ledger Entry Form */}
             <div className="xl:col-span-4 bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner h-fit">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-6">
                    <CreditCard size={24} />
                </div>
                <h3 className="font-black text-xl text-slate-800 tracking-tight mb-6">Record Payment</h3>
                
                <div className="space-y-5">
                    <InputGroup label="Invoice ID (Auto-generated)" value={form.invoiceId} readOnly className="opacity-70 bg-slate-100" />
                    
                    <SelectGroup label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} options={['Paid', 'Pending', 'Overdue']} />
                    
                    {form.status === 'Paid' && (
                        <>
                            <SelectGroup label="Payment Method" value={form.method} onChange={e => setForm({...form, method: e.target.value})} options={['Select...', 'Cash', 'Bank Transfer', 'Credit Card', 'UPI']} />
                            <InputGroup label="Transaction ID" placeholder="e.g. TXN123456789" value={form.txnId} onChange={e => setForm({...form, txnId: e.target.value})} />
                        </>
                    )}

                    <button onClick={handleRecord} className="w-full bg-[#0BC48B] text-white mt-4 py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
                        <Save size={16} /> Record in Ledger
                    </button>
                </div>
             </div>
        </div>
    );
};

// -- Reusable Inputs --
const InputGroup = ({ label, placeholder, type = "text", value, onChange, readOnly, className = "" }) => (
    <div className="w-full">
        <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] transition-all shadow-sm ${readOnly ? 'cursor-not-allowed bg-slate-100/50' : 'focus:bg-white'} ${className}`} 
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
