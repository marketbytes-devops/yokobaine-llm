import React, { useState, useRef } from 'react';
import { Megaphone, Send, Paperclip, CheckSquare, Square, Trash2, CalendarDays } from 'lucide-react';

export const NoticeboardModule = () => {
    const fileInputRef = useRef(null);
    const [notices, setNotices] = useState([
        { id: 1, title: 'Annual Sports Day 2024', body: 'Please be informed that the Annual Sports Day will be held on the 10th of next month. All students must wear their house uniforms.', audience: ['All Students', 'Teachers Only'], date: '2024-04-08', attachment: 'sports_circular.pdf' },
        { id: 2, title: 'Staff Meeting Revision', body: 'The weekly staff meeting has been moved from Tuesday to Wednesday 4:00 PM.', audience: ['Teachers Only'], date: '2024-04-07', attachment: null }
    ]);
    
    const [form, setForm] = useState({
        title: '',
        body: '',
        audience: [],
        attachment: null
    });

    const toggleAudience = (target) => {
        if (form.audience.includes(target)) {
            setForm({ ...form, audience: form.audience.filter(a => a !== target) });
        } else {
            setForm({ ...form, audience: [...form.audience, target] });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check size (Max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File exceeds 5MB limit.");
                return;
            }
            setForm({ ...form, attachment: file.name });
        }
    };

    const handleBroadcast = () => {
        if (!form.title || !form.body || form.audience.length === 0) return;
        setNotices([{ 
            id: Date.now(), 
            title: form.title, 
            body: form.body, 
            audience: form.audience, 
            date: new Date().toISOString().split('T')[0],
            attachment: form.attachment 
        }, ...notices]);
        setForm({ title: '', body: '', audience: [], attachment: null });
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const deleteNotice = (id) => {
        setNotices(notices.filter(n => n.id !== id));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Noticeboard & Broadcast</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Publish and manage campus-wide communications</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-slate-50 shadow-sm flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-[#0BC48B]/10 flex items-center justify-center text-[#0BC48B]">
                                <Megaphone size={24} />
                            </div>
                            <h3 className="font-black text-xl text-slate-800 tracking-tight">Compose Notice</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            <InputGroup label="Notice Title" placeholder="e.g. Holiday Announcement" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                            
                            <div>
                                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Message Body</label>
                                <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] focus:bg-white transition-all shadow-sm min-h-[160px]" placeholder="Enter announcement details..." />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Target Audience</label>
                                <div className="space-y-3 p-1">
                                    {['All Students', 'Specific Class', 'Teachers Only'].map((aud) => (
                                        <label key={aud} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${form.audience.includes(aud) ? 'bg-[#0BC48B] text-white' : 'bg-slate-100 text-transparent group-hover:bg-slate-200'}`}>
                                                <CheckSquare size={14} className={form.audience.includes(aud) ? 'opacity-100' : 'opacity-0'} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{aud}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-800 uppercase tracking-widest mb-3 ml-1">Attachment (Max 5MB PDF/Image)</label>
                                <div className="relative">
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,image/*" className="hidden" id="file-upload" />
                                    <label htmlFor="file-upload" className="flex items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-[1.5rem] p-6 cursor-pointer hover:border-[#0BC48B] hover:bg-[#0BC48B]/5 transition-all text-slate-500 group">
                                        {form.attachment ? (
                                            <div className="flex items-center gap-2">
                                                <Paperclip size={18} className="text-[#0BC48B]" />
                                                <span className="text-sm font-bold text-[#0BC48B]">{form.attachment}</span>
                                                <button onClick={(e) => { e.preventDefault(); setForm({...form, attachment: null}); if(fileInputRef.current) fileInputRef.current.value=""; }} className="ml-2 text-rose-500 bg-rose-50 rounded-full w-6 h-6 flex items-center justify-center"><Trash2 size={12}/></button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                                    <Paperclip size={18} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest">Click to upload file</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleBroadcast} className={`w-full text-white py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${!form.title || !form.body || form.audience.length === 0 ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-[#0BC48B] shadow-[#0BC48B]/20 hover:-translate-y-0.5 active:scale-95'}`}>
                                <Send size={16} /> Broadcast Notice
                            </button>
                        </div>
                    </div>
                </div>

                {/* Published Notices Feed */}
                <div className="xl:col-span-7 bg-slate-50 rounded-[3rem] p-8 lg:p-10 border border-slate-100 shadow-inner flex flex-col min-h-[700px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight">Active Broadcasts</h3>
                        <span className="bg-slate-200 text-slate-600 font-black text-xs px-3 py-1 rounded-full">{notices.length} Published</span>
                    </div>

                    <div className="space-y-6 overflow-y-auto flex-1 pr-2 no-scrollbar">
                        {notices.map((notice) => (
                            <div key={notice.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <button onClick={() => deleteNotice(notice.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 mb-4 flex-wrap">
                                    {notice.audience.map((a, i) => (
                                        <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-[#0BC48B]/10 text-[#0BC48B] px-3 py-1 rounded-full">
                                            {a}
                                        </span>
                                    ))}
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 ml-auto">
                                        <CalendarDays size={12} /> {notice.date}
                                    </span>
                                </div>
                                <h4 className="font-black text-slate-800 text-lg mb-2 pr-8">{notice.title}</h4>
                                <p className="text-sm font-semibold text-slate-500 leading-relaxed min-h-[60px] whitespace-pre-wrap">{notice.body}</p>
                                
                                {notice.attachment && (
                                    <div className="mt-6 flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 text-indigo-700 w-fit px-4 py-2 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors">
                                        <Paperclip size={14} />
                                        <span className="text-xs font-black">{notice.attachment}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {notices.length === 0 && (
                            <div className="flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                    <Megaphone size={32} />
                                </div>
                                <h4 className="font-black text-slate-400">No active broadcasts</h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
