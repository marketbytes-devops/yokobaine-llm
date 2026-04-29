const fs = require("fs");
const file = "frontend/src/components/ui/adminpage/FinancialManagement.jsx";
let code = fs.readFileSync(file, "utf8");

const target1 = `                                {form.frequency !== `"Monthly`" && (
                                    <button
                                        onClick={handleAddStructure}
                                        className="h-[64px] bg-[#0BC48B] text-white px-8 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                                    >
                                        <Plus size={20} /> Add Fee
                                    </button>
                                )}`;

const replace1 = `                                {form.frequency !== `"Monthly`" && (
                                    <button
                                        onClick={handleAddStructure}
                                        className="h-[64px] bg-[#0BC48B] text-white px-8 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                                    >
                                        <Plus size={20} /> Add Fee
                                    </button>
                                )}`;

const target2 = `                                    <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Billing Cycle</p>
                                            <p className="text-xs font-black text-indigo-900">{form.month_from} — {form.month_to}</p>
                                        </div>
                                    </div>
                                </div>`;

const replace2 = `                                    <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Billing Cycle</p>
                                            <p className="text-xs font-black text-indigo-900">{form.month_from} — {form.month_to}</p>
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
                                </div>`;

if (code.includes(target2)) {
    code = code.replace(target2, replace2);
    fs.writeFileSync(file, code);
    console.log("Success");
} else {
    console.log("Target not found");
}
