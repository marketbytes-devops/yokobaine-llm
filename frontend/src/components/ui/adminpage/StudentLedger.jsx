import React, { useState, useEffect } from 'react';
import { Save, UserPlus, FileText, Search, GraduationCap, Users, ChevronRight, ArrowLeft, ChevronLeft, Eye, Edit, User, Mail, Phone, Calendar, MapPin, Droplet, Hash, LogOut, Plus, Trash2, Wallet, CheckCircle2, RefreshCcw } from 'lucide-react';
import config from "@/config";

// Mock DB for frontend simulation with localStorage persistence
const getStoredMockData = (key) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
};

let globalMockPayments = getStoredMockData('globalMockPayments');
let globalMockReceipts = getStoredMockData('globalMockReceipts');

const updateGlobalMock = (type, studentId, data) => {
    if (type === 'payments') {
        globalMockPayments[studentId] = data;
        localStorage.setItem('globalMockPayments', JSON.stringify(globalMockPayments));
    } else {
        globalMockReceipts[studentId] = data;
        localStorage.setItem('globalMockReceipts', JSON.stringify(globalMockReceipts));
    }
};

export const StudentLedgerModule = ({ targetStudent }) => {
    const [activeTab, setActiveTab] = useState('add');
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'roster', 'profile'
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [students, setStudents] = useState([]);
    const [classSummaries, setClassSummaries] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [allStructures, setAllStructures] = useState([]);
    const [feeFilter, setFeeFilter] = useState('');

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(null); // Stores the student ID being edited
    const [totalStudentsInClass, setTotalStudentsInClass] = useState(0);
    const [extraSections, setExtraSections] = useState([]); // Manually added sections
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [newSectionValue, setNewSectionValue] = useState("");
    const itemsPerPage = 25;

    const API_BASE_URL = `${config.API_BASE_URL}/students`;
    const SCHOOL_API_URL = `${config.API_BASE_URL}/v1/school`;

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
        section: '',
        stream: '',
        guardianName: '',
        emergencyContact: '',
        homeAddress: '',
        emergencyContact: '',
        classTeacherId: '',
        photoUrl: ''
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, photoUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const segmentMap = {
        "KG": "Kindergarten",
        "LP": "LP",
        "UP": "UP",
        "HIGH SCHOOL": "High School",
        "HIGHERSECONDARY": "Higher Secondary"
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`${SCHOOL_API_URL}/teachers`);
            if (res.ok) {
                const data = await res.json();
                setTeachers(data);
            }
        } catch (err) {
            console.error("Failed to fetch teachers:", err);
        }
    };

    const fetchClassSummaries = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${SCHOOL_API_URL}/class-summaries?section_name=${selectedLevel}`);
            if (res.ok) {
                const data = await res.json();
                setClassSummaries(data);
            }
        } catch (err) {
            console.error("Failed to fetch class summaries:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentsForClass = async (grade, section, page = 1) => {
        setLoading(true);
        const skip = (page - 1) * itemsPerPage;
        try {
            const res = await fetch(`${API_BASE_URL}/?grade=${grade}&section=${section || ''}&skip=${skip}&limit=${itemsPerPage}`);
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownClasses = async () => {
        try {
            const res = await fetch(`${SCHOOL_API_URL}/sections/${selectedLevel}/classes`);
            if (res.ok) {
                const data = await res.json();
                setAvailableClasses(data);

                // Fallback to hardcoded defaults if DB is empty
                const defaultGrade = data.length > 0
                    ? data[0].class_name
                    : (levelConfigs[selectedLevel] ? levelConfigs[selectedLevel][0] : '');
                const defaultSection = data.length > 0
                    ? (data[0].section_identifier || '')
                    : 'A';

                setForm(prev => ({
                    ...prev,
                    grade: defaultGrade,
                    section: defaultSection
                }));
            }
        } catch (err) {
            console.error("Failed to fetch dropdown classes:", err);
        }
    };

    useEffect(() => {
        if (activeTab === 'directory') {
            if (viewMode === 'grid') {
                fetchClassSummaries();
            } else if (viewMode === 'roster' && selectedClass) {
                fetchStudentsForClass(selectedClass.class_name, selectedClass.section_identifier, currentPage);
            }
        } else {
            fetchDropdownClasses();
            fetchTeachers();
        }
    }, [activeTab, selectedLevel, viewMode, currentPage]);

    useEffect(() => {
        fetch(`${config.API_BASE_URL}/v1/finance/structures`)
            .then(res => res.json())
            .then(data => setAllStructures(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (targetStudent) {
            setSelectedStudent(targetStudent);
            setViewMode('profile');
            setActiveTab('directory');
        }
    }, [targetStudent]);

    const handleSave = async () => {
        if (!form.admissionId || !form.studentName || !form.emergencyContact || !form.section) {
            alert("Please provide Admission ID, Student Name, Emergency Contact, and ensure a Section is selected.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                admission_id: form.admissionId,
                full_name: form.studentName,
                date_of_birth: form.dob || null,
                blood_group: form.bloodGroup,
                academic_level: selectedLevel,
                current_grade: form.grade,
                section_identifier: form.section || null,
                academic_stream: form.stream || null,
                photo_url: form.photoUrl || null,
                class_teacher_id: form.classTeacherId ? parseInt(form.classTeacherId) : null,
                guardian: {
                    full_name: form.guardianName || "N/A",
                    phone_number: form.emergencyContact || "0000000000",
                    emergency_contact: form.emergencyContact || "0000000000",
                    home_address: form.homeAddress
                }
            };
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `${API_BASE_URL}/${isEditing}` : API_BASE_URL + "/";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert(isEditing ? "Student updated successfully!" : "Student enrolled successfully!");
                setIsEditing(null);
                setForm({
                    admissionId: '', studentName: '', dob: '', bloodGroup: '',
                    grade: '', section: '', stream: '', guardianName: '',
                    homeAddress: '', emergencyContact: '', classTeacherId: '', photoUrl: ''
                });
                setActiveTab('directory');
                setViewMode('grid');
            } else {
                const err = await res.json();
                alert(err.detail || "Action failed");
            }
        } catch (err) {
            alert("Connection error.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm("Are you sure you want to remove this student record permanently?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/${studentId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert("Student record removed successfully.");
                // Refresh data
                if (selectedClass) {
                    fetchStudentsForClass(selectedClass.class_name, selectedClass.section_identifier, currentPage);
                }
            }
        } catch (err) {
            alert("Delete failed.");
        }
    };

    // Transitions
    const goToRoster = (cls) => {
        setSelectedClass(cls);
        setTotalStudentsInClass(cls.student_count);
        setCurrentPage(1);
        setViewMode('roster');
    };

    const goToProfile = (student) => {
        setSelectedStudent(student);
        setViewMode('profile');
    };

    const backToGrid = () => {
        setViewMode('grid');
        setSelectedClass(null);
    };

    const backToRoster = () => {
        if (!selectedClass) {
            setViewMode('grid');
        } else {
            setViewMode('roster');
        }
        setSelectedStudent(null);
    };

    const handleEditStart = (student) => {
        setIsEditing(student.id);
        const guardianInfo = student.guardian ? `${student.guardian.full_name} ${student.guardian.phone_number}` : '';
        setForm({
            admissionId: student.admission_id,
            studentName: student.full_name,
            dob: student.date_of_birth || '',
            bloodGroup: student.blood_group || '',
            grade: student.current_grade,
            section: student.section_identifier,
            stream: student.academic_stream || '',
            parentNamePhone: guardianInfo,
            homeAddress: student.guardian?.home_address || '',
            emergencyContact: student.guardian?.emergency_contact || '',
            classTeacherId: '', // You can add logic to detect current teacher
            photoUrl: student.photo_url || ''
        });
        setActiveTab('add');
    };

    const filteredSections = [...new Set([
        "A", "B", "C", // Baseline divisions
        ...availableClasses.filter(c => c.class_name === form.grade).map(c => c.section_identifier || 'None'),
        ...extraSections
    ])];

    const handleAddExtraSection = (e) => {
        e.preventDefault();
        setShowSectionModal(true);
    };

    const handleConfirmSection = () => {
        if (newSectionValue) {
            const formatted = newSectionValue.trim().toUpperCase();
            if (formatted && !extraSections.includes(formatted)) {
                setExtraSections(prev => [...prev, formatted]);
                setForm(prev => ({ ...prev, section: formatted }));
            }
            setShowSectionModal(false);
            setNewSectionValue("");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-7xl mx-auto pb-10">
            {/* Header */}
            {viewMode !== 'profile' && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Student & Parent Ledger</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Comprehensive enrollment and guardian management</p>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] self-start md:self-auto shadow-inner">
                        <button onClick={() => {
                            setIsEditing(null);
                            setForm({
                                admissionId: '', studentName: '', dob: '', bloodGroup: '',
                                grade: '', section: '', stream: '', guardianName: '',
                                homeAddress: '', emergencyContact: '', classTeacherId: '', photoUrl: ''
                            });
                            setActiveTab('add');
                            setViewMode('grid');
                        }} className={`px-8 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Enroll Student</button>
                        <button onClick={() => { setIsEditing(null); setActiveTab('directory'); setViewMode('grid'); }} className={`px-8 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>View Ledger</button>
                    </div>
                </div>
            )}

            {/* Content Switch */}
            {activeTab === 'add' ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    {/* Level Selection Bar */}
                    <LevelFilter selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} setViewMode={setViewMode} />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Enrollment Form (Same as before) */}
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                                        {form.photoUrl ? (
                                            <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-indigo-200" size={32} />
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full border-4 border-white text-white flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
                                        <Plus size={16} />
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                    </label>
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">
                                        {isEditing ? 'Update Student Identity' : 'Student Identity'}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Information & Classification</p>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <InputGroup label="Admission ID" placeholder="YKB-2024-001" value={form.admissionId} onChange={e => setForm({ ...form, admissionId: e.target.value })} />
                                <InputGroup label="Full Name" placeholder="Student name" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Date of Birth" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                                    <SelectGroup label="Blood Group" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                    <SelectGroup label="Grade" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} options={levelConfigs[selectedLevel] || []} />
                                    <div className="relative">
                                        <SelectGroup
                                            label="Section"
                                            value={form.section}
                                            onChange={e => setForm({ ...form, section: e.target.value })}
                                            options={filteredSections}
                                        />
                                        <button
                                            onClick={handleAddExtraSection}
                                            className="absolute right-12 top-[44px] w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-sm border border-indigo-100 z-10"
                                            title="Add new section"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-50">
                                    <SelectGroup
                                        label="Class Teacher"
                                        value={form.classTeacherId}
                                        onChange={e => setForm({ ...form, classTeacherId: e.target.value })}
                                        options={teachers
                                            .filter(t => t.sections && t.sections.some(s => s.name === segmentMap[selectedLevel]))
                                            .map(t => ({ label: t.full_name, value: t.id }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-[#0BC48B]/10 flex items-center justify-center text-[#0BC48B] shadow-sm"><UserPlus size={24} /></div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">Guardian Link</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Contact Details</p>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <InputGroup label="Primary Guardian Name" placeholder="Full name of guardian" value={form.guardianName} onChange={e => setForm({ ...form, guardianName: e.target.value })} />
                                <InputGroup label="Emergency Contact Number" placeholder="Primary contact for emergency" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                                <textarea value={form.homeAddress} onChange={e => setForm({ ...form, homeAddress: e.target.value })} className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[2rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all min-h-[140px] resize-none" placeholder="Provide full residential details..." />
                                <InputGroup label="Emergency Contact" type="text" placeholder="Alternate phone" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                            </div>
                            <button onClick={handleSave} disabled={loading} className={`mt-10 w-full text-white px-8 py-5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 shadow-xl shadow-[#0BC48B]/20 hover:-translate-y-1 active:scale-95 transition-all ${loading ? 'bg-slate-400' : 'bg-[#0BC48B] hover:bg-[#0BA676]'}`}>
                                <Save size={20} /> {loading ? (isEditing ? 'Updating...' : 'Enrolling...') : (isEditing ? 'Save Changes' : 'Register Student Ledger')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in transition-all duration-500">
                    {/* View Modes Switch */}
                    {viewMode === 'grid' && (
                        <>
                            <LevelFilter selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} setViewMode={setViewMode} />
                            <div className="bg-white rounded-[4rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40 mt-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                    <h3 className="font-black text-3xl text-slate-900 tracking-tight leading-none">School Population Overview</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {classSummaries.map((cls) => (
                                        <ClassCard key={`${cls.class_name}-${cls.section_identifier}`} cls={cls} onClick={() => goToRoster(cls)} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {viewMode === 'roster' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                                <div className="flex items-center gap-6">
                                    <button onClick={backToGrid} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0BC48B] hover:text-white transition-all shadow-sm">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedClass?.class_name || 'N/A'} - {selectedClass?.section_identifier || 'A'}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Class Roster | {totalStudentsInClass} Active Students</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">

                                    <div className="flex bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 w-full md:w-60 shadow-inner">
                                        <Search size={18} className="text-slate-400 mr-3 mt-0.5" />
                                        <input type="text" placeholder="Search in class..." className="bg-transparent text-sm font-bold text-slate-900 outline-none w-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-6 lg:p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Roll</th>
                                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                                                {feeFilter ? (
                                                    <>
                                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Paid</th>
                                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pending</th>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</th>
                                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Address</th>
                                                    </>
                                                )}
                                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((st, idx) => {
                                                const classStructures = allStructures.filter(s => s.class_name === selectedClass?.class_name);

                                                let duesAmount = 0;
                                                let paidAmount = 0;

                                                if (feeFilter) {
                                                    const duesData = classStructures.find(s => s.category_name === feeFilter);
                                                    duesAmount = duesData ? duesData.amount : 0;
                                                    paidAmount = (globalMockPayments[st.id] && globalMockPayments[st.id][feeFilter]) || 0;
                                                } else {
                                                    // Show totals if no filter
                                                    duesAmount = classStructures.reduce((sum, s) => sum + s.amount, 0);
                                                    const studentPayments = globalMockPayments[st.id] || {};
                                                    paidAmount = Object.values(studentPayments).reduce((sum, val) => sum + val, 0);
                                                }

                                                const pendingAmount = duesAmount - paidAmount;
                                                const status = duesAmount > 0 ? (pendingAmount <= 0 ? 'PAID' : 'PENDING') : 'N/A';

                                                return (
                                                    <tr key={st.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => goToProfile(st)}>
                                                        <td className="px-6 py-5 font-black text-slate-900 text-sm">{(idx + 1).toString().padStart(2, '0')}</td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-105 transition-transform">
                                                                    {st.full_name.charAt(0).toLowerCase()}
                                                                </div>
                                                                <span className="font-black text-slate-900 text-sm group-hover:text-[#0BC48B] transition-colors">
                                                                    {st.full_name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-slate-500 font-black text-xs tracking-wide">
                                                            {st.guardian?.full_name || 'N/A'}
                                                        </td>
                                                        {feeFilter ? (
                                                            <>
                                                                <td className="px-6 py-5">
                                                                    <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-[0.2em] ${status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : status === 'N/A' ? 'bg-slate-50 text-slate-400' : 'bg-rose-100/50 text-rose-500'}`}>{status}</span>
                                                                </td>
                                                                <td className="px-6 py-5 font-black text-slate-900 text-sm text-right">₹{paidAmount}</td>
                                                                <td className="px-6 py-5 font-black text-slate-900 text-sm text-right">₹{pendingAmount}</td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-6 py-5 text-slate-500 font-black text-xs tracking-wide">{st.guardian?.emergency_contact || 'N/A'}</td>
                                                                <td className="px-6 py-5 text-slate-500 font-black text-xs tracking-wide truncate max-w-[150px]">{st.guardian?.home_address || 'No address provided'}</td>
                                                            </>
                                                        )}
                                                        <td className="px-6 py-5 text-right">
                                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteStudent(st.id); }} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500/30 hover:shadow-lg transition-all">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {totalStudentsInClass > itemsPerPage && (
                                    <div className="flex justify-center mt-10">
                                        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} total={totalStudentsInClass} perPage={itemsPerPage} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {viewMode === 'profile' && selectedStudent && (
                        <StudentProfileView
                            student={selectedStudent}
                            backAction={backToRoster}
                            onEdit={() => handleEditStart(selectedStudent)}
                        />
                    )}
                </div>
            )}

            {/* Custom Section Modal */}
            {showSectionModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowSectionModal(false)} />
                    <div className="relative bg-white rounded-[3.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">New Division</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Add custom section identifier</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <InputGroup
                                label="Section Name"
                                placeholder="e.g. D, F, "
                                value={newSectionValue}
                                onChange={(e) => setNewSectionValue(e.target.value)}
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowSectionModal(false)}
                                    className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmSection}
                                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                                >
                                    Add Section
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LevelFilter = ({ selectedLevel, setSelectedLevel, setViewMode }) => (
    <div className="bg-slate-900 rounded-[2.5rem] p-4 flex flex-wrap items-center justify-center gap-2 shadow-xl shadow-slate-900/20">
        {["KG", "LP", "UP", "HIGH SCHOOL", "HIGHERSECONDARY"].map((level) => (
            <button
                key={level}
                onClick={() => { setSelectedLevel(level); setViewMode('grid'); }}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${selectedLevel === level
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
);

const ClassCard = ({ cls, onClick }) => (
    <div
        onClick={onClick}
        className="group bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:border-[#0BC48B] hover:shadow-2xl hover:shadow-[#0BC48B]/10 transition-all cursor-pointer relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl group-hover:bg-[#0BC48B] transition-colors shadow-lg">
                {cls.class_name.split(' ')[1] || cls.class_name.charAt(0)}{cls.section_identifier && `-${cls.section_identifier}`}
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-[#0BC48B] uppercase tracking-widest mb-1">Total Strength</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{cls.student_count} <span className="text-xs text-slate-400 font-bold ml-1 uppercase">Students</span></p>
            </div>
        </div>
        <div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-4">{cls.class_name} {cls.section_identifier ? `Section ${cls.section_identifier}` : ''}</h4>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl group-hover:bg-[#0BC48B]/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden"><User size={14} className="text-slate-300" /></div>
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Class Teacher</p>
                    <p className="text-[11px] font-black text-slate-800">{cls.teacher_name || 'Unassigned'}</p>
                </div>
            </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[#0BC48B]">
            <span className="text-[10px] font-black uppercase tracking-widest">View Roster</span>
            <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
        </div>
    </div>
);

const StudentProfileView = ({ student, backAction, onEdit }) => {
    const [invoices, setInvoices] = useState([]);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [remarks, setRemarks] = useState('');
    const [structures, setStructures] = useState([]);
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [paidAmounts, setPaidAmounts] = useState(student ? (globalMockPayments[student.id] || {}) : {});
    const [receipts, setReceipts] = useState(student ? (globalMockReceipts[student.id] || []) : []);
    const [expandedStructures, setExpandedStructures] = useState([]);

    const ACADEMIC_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

    const totalDuesOverall = expandedStructures.reduce((sum, s) => sum + s.amount, 0);
    const totalPaidOverall = expandedStructures.reduce((sum, s) => {
        const key = s.frequency === 'Monthly' ? `${s.category_name}_${s.month}` : s.category_name;
        return sum + (paidAmounts[key] || 0);
    }, 0);
    const totalRemainingOverall = totalDuesOverall - totalPaidOverall;

    useEffect(() => {
        if (student) {
            fetchInvoices(student.id);
            fetchStructures();
        }
    }, [student]);

    const startPayment = (prefillStruct = null) => {
        const initialAmounts = {};
        structures.forEach(s => {
            if (prefillStruct && s.category_name === prefillStruct.category_name) {
                const remaining = s.amount - (paidAmounts[s.category_name] || 0);
                initialAmounts[s.category_name] = remaining > 0 ? remaining : '';
            } else {
                initialAmounts[s.category_name] = '';
            }
        });
        setPaymentAmounts(initialAmounts);
        setRemarks('');
        setPaymentMethod('Cash');
        setIsPaying(true);
    };

    const fetchInvoices = async (studentId) => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/invoices/${studentId}`);
            if (res.ok) {
                setInvoices(await res.json());
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchStructures = async () => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/v1/finance/structures`);
            if (res.ok) {
                const data = await res.json();
                const studentStructures = data.filter(s => s.class_name === student.current_grade);
                setStructures(studentStructures);

                // Visibility Logic: Check if a month has been invoiced yet
                const now = new Date();
                const currentMonth = now.toLocaleString('en-US', { month: 'short' });
                const currentDay = now.getDate();
                const currentAcademicIdx = ACADEMIC_MONTHS.indexOf(currentMonth);

                const isInvoiced = (month, day) => {
                    const targetIdx = ACADEMIC_MONTHS.indexOf(month);
                    if (targetIdx < currentAcademicIdx) return true;
                    if (targetIdx === currentAcademicIdx && currentDay >= (day || 1)) return true;
                    return false;
                };

                // Expand structures based on frequency
                let expanded = [];
                studentStructures.forEach(s => {
                    if (s.frequency === 'Monthly') {
                        const startIdx = ACADEMIC_MONTHS.indexOf(s.month_from || 'Jun');
                        const endIdx = ACADEMIC_MONTHS.indexOf(s.month_to || 'May');
                        let monthsToGenerate = [];
                        if (startIdx <= endIdx) {
                            monthsToGenerate = ACADEMIC_MONTHS.slice(startIdx, endIdx + 1);
                        } else {
                            monthsToGenerate = [...ACADEMIC_MONTHS.slice(startIdx), ...ACADEMIC_MONTHS.slice(0, endIdx + 1)];
                        }

                        let generated = [];
                        monthsToGenerate.forEach(m => {
                            if (isInvoiced(m, s.invoice_day || s.due_day)) {
                                generated.push({ ...s, month: m, uniqueKey: `${s.category_name}_${m}` });
                            }
                        });
                        if (generated.length > 0) expanded.push(generated[generated.length - 1]);
                    } else if (s.frequency === 'Quarterly') {
                        const qMonthsAll = ['Jun', 'Sep', 'Dec', 'Mar'];
                        const qNames = ['Q1', 'Q2', 'Q3', 'Q4'];
                        const startIdx = qNames.indexOf(s.month_from || 'Q1');
                        const endIdx = qNames.indexOf(s.month_to || 'Q4');
                        let qIndices = [];
                        if (startIdx !== -1 && endIdx !== -1) {
                            if (startIdx <= endIdx) {
                                for(let i=startIdx; i<=endIdx; i++) qIndices.push(i);
                            } else {
                                for(let i=startIdx; i<4; i++) qIndices.push(i);
                                for(let i=0; i<=endIdx; i++) qIndices.push(i);
                            }
                        } else {
                            qIndices = [0, 1, 2, 3];
                        }
                        
                        let generated = [];
                        qIndices.forEach((idx) => {
                            const m = qMonthsAll[idx];
                            if (isInvoiced(m, s.invoice_day || s.due_day)) {
                                generated.push({ ...s, month: `Q${idx+1} (${m})`, uniqueKey: `${s.category_name}_Q${idx+1}` });
                            }
                        });
                        if (generated.length > 0) expanded.push(generated[generated.length - 1]);
                    } else if (s.frequency === 'Half-Yearly') {
                        const hMonthsAll = ['Jun', 'Dec'];
                        const hNames = ['H1', 'H2'];
                        const startIdx = hNames.indexOf(s.month_from || 'H1');
                        const endIdx = hNames.indexOf(s.month_to || 'H2');
                        let hIndices = [];
                        if (startIdx !== -1 && endIdx !== -1) {
                            if (startIdx <= endIdx) {
                                for(let i=startIdx; i<=endIdx; i++) hIndices.push(i);
                            } else {
                                for(let i=startIdx; i<2; i++) hIndices.push(i);
                                for(let i=0; i<=endIdx; i++) hIndices.push(i);
                            }
                        } else {
                            hIndices = [0, 1];
                        }

                        let generated = [];
                        hIndices.forEach((idx) => {
                            const m = hMonthsAll[idx];
                            if (isInvoiced(m, s.invoice_day || s.due_day)) {
                                generated.push({ ...s, month: `H${idx+1} (${m})`, uniqueKey: `${s.category_name}_H${idx+1}` });
                            }
                        });
                        if (generated.length > 0) expanded.push(generated[generated.length - 1]);
                    } else {
                        // Yearly or other
                        if (s.due_date) {
                            const d = new Date(s.due_date);
                            if (now >= d) expanded.push({ ...s, uniqueKey: s.category_name });
                        } else {
                            // If no due date, assume invoiced at start of year (June)
                            if (isInvoiced('Jun', 1)) expanded.push({ ...s, uniqueKey: s.category_name });
                        }
                    }
                });
                setExpandedStructures(expanded);

                const initialAmounts = {};
                expanded.forEach(s => {
                    initialAmounts[s.uniqueKey] = '';
                });
                setPaymentAmounts(initialAmounts);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAmountChange = (key, val, maxAmount) => {
        let numVal = Number(val);
        const remainingDues = maxAmount - (paidAmounts[key] || 0);
        if (numVal > remainingDues) numVal = remainingDues;
        if (numVal < 0) numVal = 0;
        setPaymentAmounts(prev => ({ ...prev, [key]: val === '' ? '' : numVal }));
    };

    const totalPaying = expandedStructures.reduce((sum, s) => sum + Number(paymentAmounts[s.uniqueKey] || 0), 0);
    const totalDues = expandedStructures.reduce((sum, s) => sum + s.amount, 0);

    const handleProcessPayment = () => {
        if (totalPaying === 0) return;

        // Simulate payment success and update local ledger state
        const newPaidAmounts = { ...paidAmounts };
        Object.keys(paymentAmounts).forEach(cat => {
            if (paymentAmounts[cat]) {
                newPaidAmounts[cat] = (newPaidAmounts[cat] || 0) + Number(paymentAmounts[cat]);
            }
        });

        const newReceipt = {
            id: Math.floor(Math.random() * 10000),
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
            month: new Date().toLocaleString('default', { month: 'short' }),
            method: paymentMethod,
            total: totalPaying,
            breakdown: { ...paymentAmounts }
        };

        setTimeout(() => {
            updateGlobalMock('payments', student.id, newPaidAmounts);
            updateGlobalMock('receipts', student.id, [...receipts, newReceipt]);

            setPaidAmounts(newPaidAmounts);
            setReceipts([...receipts, newReceipt]);
            setPaymentSuccess(true);
        }, 800);
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
            {/* Header Profile Card */}
            <div className="bg-indigo-600 rounded-[3.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <button onClick={backAction} className="md:absolute md:-top-12 md:left-4 bg-white/10 hover:bg-white text-white hover:text-indigo-600 px-2 py-3 rounded-2xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to List
                    </button>

                    <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-2xl overflow-hidden mt-8 md:mt-0">
                        <div className="w-full h-full bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 overflow-hidden">
                            {student.photo_url ? (
                                <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={80} />
                            )}
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h2 className="text-5xl font-black tracking-tighter">{student.full_name}</h2>
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20">
                                    Active Student
                                </div>
                                <button 
                                    onClick={fetchStructures}
                                    className="p-2 bg-white/10 hover:bg-white/30 text-white rounded-xl transition-all"
                                    title="Refresh Fee Data"
                                >
                                    <RefreshCcw size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 opacity-80">
                            <p className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                                <span className="bg-white/20 p-2 rounded-xl"><Hash size={14} /></span>
                                {student.admission_id}
                            </p>
                            <p className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                                <span className="bg-white/20 p-2 rounded-xl"><GraduationCap size={14} /></span>
                                {student.current_grade}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
                        <button onClick={onEdit} className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">Change Details</button>
                    </div>
                </div>
            </div>

            {isPaying && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => !paymentSuccess && setIsPaying(false)} />

                    <div className="relative bg-white rounded-[4rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 p-10 lg:p-14">
                        {paymentSuccess ? (
                            <div className="text-center print:shadow-none print:border-none print:p-0">
                                <div className="w-24 h-24 bg-[#0BC48B]/10 text-[#0BC48B] rounded-full flex items-center justify-center mx-auto mb-8 print:hidden">
                                    <Droplet size={40} />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Payment Successful!</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-10 print:hidden">Receipt generated for {student.full_name}</p>

                                {/* Invoice Receipt Format */}
                                <div className="bg-slate-50 p-10 rounded-[2rem] text-left mb-10 print:bg-transparent print:p-0">
                                    <div className="flex justify-between items-end border-b border-slate-200 pb-8 mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900">FEE RECEIPT</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: YKB-PAY-{Math.floor(Math.random() * 10000)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-sm font-black text-slate-800">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Student</p>
                                            <p className="text-lg font-black text-slate-900">{student.full_name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{student.current_grade} - {student.section_identifier || 'A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Amount Received</p>
                                            <p className="text-3xl font-black text-[#0BC48B]">₹{Number(totalPaying).toLocaleString('en-IN')}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Via {paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 print:hidden">
                                    <button onClick={handlePrintReceipt} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl">
                                        Print Receipt
                                    </button>
                                    <button onClick={() => { setPaymentSuccess(false); setIsPaying(false); }} className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Fee Collection</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Process new payment for {student.full_name}</p>
                                    </div>
                                    <button onClick={() => setIsPaying(false)} className="px-6 py-3 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel</button>
                                </div>

                                <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-[2rem] border border-slate-100">
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
                                        {expandedStructures.map((s, idx) => {
                                            const remainingDues = s.amount - (paidAmounts[s.uniqueKey] || 0);
                                            if (remainingDues <= 0) return null;
                                            return (
                                                <div key={idx} className="w-full">
                                                    <div className="flex justify-between items-end mb-1">
                                                        <label className="block text-xs font-black text-slate-800 capitalize truncate pr-2">
                                                            {s.category_name} {s.month ? `(${s.month})` : ''}
                                                        </label>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Dues : {remainingDues}</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        value={paymentAmounts[s.uniqueKey] !== undefined ? paymentAmounts[s.uniqueKey] : ''}
                                                        onChange={(e) => handleAmountChange(s.uniqueKey, e.target.value, s.amount)}
                                                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-end mb-1">
                                                <label className="block text-xs font-black text-slate-800">Total Paying</label>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-emerald-600">Total Dues : {totalDues}</span>
                                            </div>
                                            <div className="w-full bg-[#0BC48B]/10 border border-[#0BC48B]/20 px-4 py-2 rounded-lg text-xl font-black text-[#0BA676]">
                                                {totalPaying}
                                            </div>
                                        </div>

                                        <div className="flex-[2]">
                                            <label className="block text-xs font-black text-slate-800 mb-1">Remark</label>
                                            <input
                                                type="text"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                                                placeholder="Enter payment remarks..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                                        <div className="w-full md:w-auto">
                                            <label className="block text-xs font-black text-slate-800 mb-2">Payment Method</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Cash', 'Card', 'UPI', 'Bank'].map((method) => (
                                                    <button key={method} onClick={() => setPaymentMethod(method)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${paymentMethod === method ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                                                        {method}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button onClick={handleProcessPayment} className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-amber-400/20 active:scale-95 transition-all whitespace-nowrap">
                                            Collect Fee
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Academic Information */}
                <InfoCard title="Academic Information" icon={<GraduationCap className="text-indigo-500" />}>
                    <div className="grid grid-cols-2 gap-y-10">
                        <InfoItem label="Registration No." value={student.admission_id} />
                        <InfoItem label="Session" value="Fall 2024" />
                        <InfoItem label="Academic Level" value={student.academic_level} />
                        <InfoItem label="Admission Date" value={new Date(student.created_at).toLocaleDateString()} />
                        <InfoItem label="Academic Stream" value={student.academic_stream || 'General'} />
                        <InfoItem label="Grade / Section" value={`${student.current_grade} - ${student.section_identifier || 'A'}`} />
                    </div>
                </InfoCard>

                {/* Personal Information */}
                <InfoCard title="Personal Information" icon={<User className="text-[#0BC48B]" />}>
                    <div className="grid grid-cols-2 gap-y-10">
                        <InfoItem label="Full Name" value={student.full_name} />
                        <InfoItem label="Guardian Name" value={student.guardian?.full_name} />
                        <InfoItem label="Date of Birth" value={student.date_of_birth || 'N/A'} />
                        <InfoItem label="Blood Group" value={student.blood_group} />
                        <InfoItem label="Emergency Contact" value={student.guardian?.emergency_contact || 'N/A'} />
                        <div className="col-span-2">
                            <InfoItem label="Home Address" value={student.guardian?.home_address || 'Address not registered'} />
                        </div>
                    </div>
                </InfoCard>
            </div>

            {/* Financial & Payment Ledger Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Class Dues Structure */}
                <InfoCard
                    title="Generated fees for this student"
                    icon={<Wallet className="text-indigo-500" size={24} />}
                    action={
                        <button onClick={() => startPayment()} className="bg-[#0BC48B] hover:bg-[#0BA676] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-[#0BC48B]/30 active:scale-95 whitespace-nowrap">
                            Collect Fee
                        </button>
                    }
                >
                    <div className="space-y-4 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 max-h-[500px] overflow-y-auto no-scrollbar">
                        {expandedStructures.filter(struct => (paidAmounts[struct.uniqueKey] || 0) < struct.amount).length > 0 ? expandedStructures.filter(struct => (paidAmounts[struct.uniqueKey] || 0) < struct.amount).map((struct, idx) => {
                            const dueDate = struct.due_date ? new Date(struct.due_date) : null;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            let isUrgent = false;
                            if (dueDate) {
                                const diffTime = dueDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                isUrgent = diffDays <= 7;
                            } else if (struct.frequency === 'Monthly' && struct.due_day) {
                                // For monthly, check if the current month's due day is near
                                const currentMonthIdx = new Date().getMonth();
                                const academicMonthIdx = ACADEMIC_MONTHS.indexOf(new Date().toLocaleString('default', { month: 'short' }));
                                if (struct.month === ACADEMIC_MONTHS[academicMonthIdx]) {
                                    const dayOfMonth = new Date().getDate();
                                    isUrgent = struct.due_day - dayOfMonth <= 7 && struct.due_day >= dayOfMonth;
                                }
                            }

                            const isPaid = (paidAmounts[struct.uniqueKey] || 0) >= struct.amount;

                            return (
                                <div key={idx} className={`flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border ${isUrgent && !isPaid ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100'}`}>
                                    <div>
                                        <span className={`block text-sm font-bold capitalize ${isUrgent && !isPaid ? 'text-rose-600' : 'text-slate-700'}`}>
                                            {struct.category_name} {struct.month ? `(${struct.month})` : ''}
                                        </span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{struct.frequency}</span>
                                            {struct.due_date && (
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isUrgent && !isPaid ? 'bg-rose-500 text-white animate-blink' : 'bg-slate-100 text-slate-500'}`}>
                                                    Due: {new Date(struct.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </span>
                                            )}
                                            {struct.frequency !== 'Yearly' && struct.frequency !== 'One-Time' && struct.due_day && (
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isUrgent && !isPaid ? 'bg-rose-500 text-white animate-blink' : 'bg-indigo-50 text-indigo-500'}`}>
                                                    Due: {struct.month?.replace(/\(.*\)/, '')?.trim()} {struct.due_day}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className={`block text-lg font-black ${isUrgent && !isPaid ? 'text-rose-600' : 'text-slate-900'}`}>
                                                ₹{struct.amount.toLocaleString('en-IN')}
                                            </span>
                                            {isPaid ? (
                                                <span className="text-[9px] font-black text-[#0BC48B] uppercase tracking-widest flex items-center justify-end gap-1">
                                                    <CheckCircle2 size={10} /> Paid
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => startPayment(struct)}
                                                    className="mt-1 text-[9px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest underline underline-offset-4 decoration-2 decoration-indigo-200 hover:decoration-indigo-600 transition-all"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-8">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No pending fees to collect</p>
                            </div>
                        )}
                    </div>
                </InfoCard>
            </div>

            <div className="col-span-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <Wallet className="text-[#0BC48B]" />
                        Student Fees & Payment Status
                    </h3>
                </div>

                <div className="space-y-2 mb-8">
                    <div className="flex justify-between items-center bg-[#2f9c73] text-white px-6 py-4 font-black tracking-widest uppercase text-sm rounded-t-xl">
                        <span>Total Payable Amount</span>
                        <span>₹ {totalDuesOverall}/-</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#0d84a3] text-white px-6 py-4 font-black tracking-widest uppercase text-sm">
                        <span>Total Paid Amount</span>
                        <span>₹ {totalPaidOverall}/-</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#a65622] text-white px-6 py-4 font-black tracking-widest uppercase text-sm rounded-b-xl">
                        <span>Remaining Amount</span>
                        <span>₹ {totalRemainingOverall}/-</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg mb-8">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-center border-collapse min-w-[800px]">
                            <tbody>
                                <tr className="bg-slate-50">
                                    <td className="p-3 font-bold text-right border-r border-b border-slate-200">Due Date</td>
                                    {structures.map(s => {
                                        const dueDate = s.due_date ? new Date(s.due_date) : null;
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const isUrgent = dueDate && ((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 7) && (paidAmounts[s.category_name] || 0) < s.amount;
                                        return (
                                            <td key={`${s.category_name}-${s.frequency}`} className={`p-3 border-r border-b border-slate-200 text-[10px] font-black uppercase tracking-tighter ${isUrgent ? 'text-rose-600 animate-blink bg-rose-50' : 'text-slate-500'}`}>
                                                {s.due_date ? new Date(s.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                                            </td>
                                        );
                                    })}
                                    <td className="p-3 font-bold border-b border-slate-200">-</td>
                                </tr>
                                <tr className="bg-blue-100/50">
                                    <td className="p-3 font-bold text-right border-r border-b border-slate-200">Generated Amount</td>
                                    {structures.map(s => <td key={`${s.category_name}-${s.frequency}`} className="p-3 border-r border-b border-slate-200">{s.amount}</td>)}
                                    <td className="p-3 font-bold border-b border-slate-200">{totalDuesOverall}</td>
                                </tr>
                                <tr className="bg-red-50/50">
                                    <td className="p-3 font-bold text-red-500 text-right border-r border-b border-slate-200">Discount Amt.</td>
                                    {structures.map(s => <td key={`${s.category_name}-${s.frequency}`} className="p-3 border-r border-b border-slate-200 text-red-500">0</td>)}
                                    <td className="p-3 font-bold text-red-500 border-b border-slate-200">0</td>
                                </tr>
                                <tr className="bg-green-50/50">
                                    <td className="p-3 font-bold text-green-600 text-right border-r border-b border-slate-200">Payable Amt.</td>
                                    {structures.map(s => <td key={`${s.category_name}-${s.frequency}`} className="p-3 border-r border-b border-slate-200 text-green-600">{s.amount}</td>)}
                                    <td className="p-3 font-bold text-green-600 border-b border-slate-200">{totalDuesOverall}</td>
                                </tr>
                                <tr className="bg-blue-50">
                                    <td className="p-3 font-bold text-blue-600 text-right border-r border-b border-slate-200">Total Paid Amt.</td>
                                    {structures.map(s => <td key={`${s.category_name}-${s.frequency}`} className="p-3 border-r border-b border-slate-200 text-blue-600">{paidAmounts[s.category_name] || 0}</td>)}
                                    <td className="p-3 font-bold text-blue-600 border-b border-slate-200">{totalPaidOverall}</td>
                                </tr>
                                <tr className="bg-red-50/50">
                                    <td className="p-3 font-bold text-slate-800 text-right border-r border-b border-slate-200">Dues / Remaining Amt.</td>
                                    {structures.map(s => <td key={`${s.category_name}-${s.frequency}`} className="p-3 border-r border-b border-slate-200">{s.amount - (paidAmounts[s.category_name] || 0)}</td>)}
                                    <td className="p-3 font-bold border-b border-slate-200">{totalRemainingOverall}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-sm text-center border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#1a2b2f] text-white">
                                    <th className="p-4 border-r border-slate-700 font-bold text-xs">Action</th>
                                    <th className="p-4 border-r border-slate-700 font-bold text-xs">Receipt No.</th>
                                    <th className="p-4 border-r border-slate-700 font-bold text-xs">Payment Date</th>
                                    <th className="p-4 border-r border-slate-700 font-bold text-xs">Paid for Month</th>
                                    {structures.map(s => <th key={`${s.category_name}-${s.frequency}`} className="p-4 border-r border-slate-700 font-bold text-xs break-words max-w-[100px]">{s.category_name}</th>)}
                                    <th className="p-4 border-r border-slate-700 font-bold text-xs">Total</th>
                                    <th className="p-4 font-bold text-xs">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receipts.length > 0 ? receipts.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3 border-r border-b border-slate-200">
                                            <button className="text-blue-500 font-bold hover:underline flex flex-col items-center justify-center w-full">
                                                <FileText size={16} className="mb-1" />
                                                <span className="text-[10px]">Print</span>
                                            </button>
                                        </td>
                                        <td className="p-3 border-r border-b border-slate-200">{r.id}</td>
                                        <td className="p-3 border-r border-b border-slate-200 whitespace-nowrap">{r.date}</td>
                                        <td className="p-3 border-r border-b border-slate-200">{r.month}</td>
                                        {structures.map(s => <td key={`${s.category_name}-${s.frequency}`} className="p-3 border-r border-b border-slate-200">{r.breakdown[s.category_name] || ''}</td>)}
                                        <td className="p-3 border-r border-b border-slate-200 font-black">₹{r.total}</td>
                                        <td className="p-3 border-b border-slate-200">
                                            <button className="text-red-500 font-bold hover:underline flex flex-col items-center justify-center w-full">
                                                <Trash2 size={16} className="mb-1" />
                                                <span className="text-[10px]">Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={structures.length + 6} className="p-10 text-slate-400 font-bold text-xs uppercase tracking-widest text-center">
                                            No payments recorded
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ title, icon, action, children }) => (
    <div className="bg-white rounded-[4rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 mb-14">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner shrink-0">
                    {icon}
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h4>
            </div>
            {action && <div>{action}</div>}
        </div>
        {children}
    </div>
);

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-sm font-black text-slate-800">{value || 'N/A'}</p>
    </div>
);

const Pagination = ({ currentPage, setCurrentPage, total, perPage }) => {
    const pages = Math.ceil(total / perPage);
    return (
        <div className="flex items-center gap-3 bg-white p-3 rounded-[2rem] shadow-2xl border border-slate-100">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-3 rounded-xl hover:bg-slate-50 disabled:opacity-20 transition-all"><ChevronLeft size={20} /></button>
            {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === pages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-3 rounded-xl hover:bg-slate-50 disabled:opacity-20 transition-all"><ChevronRight size={20} /></button>
        </div>
    );
};

const InputGroup = ({ label, placeholder, type = "text", value, onChange }) => (
    <div className="w-full group/input">
        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-800 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all shadow-inner placeholder:text-slate-300" />
    </div>
);

const SelectGroup = ({ label, value, onChange, options }) => (
    <div className="w-full group/select">
        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">{label}</label>
        <div className="relative">
            <select value={value} onChange={onChange} className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[1.8rem] text-sm font-semibold text-slate-900 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] focus:bg-white transition-all appearance-none cursor-pointer shadow-inner">
                <option value="">Select {label}...</option>
                {options.map((opt, i) => {
                    const labelText = typeof opt === 'object' ? opt.label : opt;
                    const val = typeof opt === 'object' ? opt.value : opt;
                    return <option key={i} value={val}>{labelText}</option>;
                })}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><ChevronRight size={18} className="rotate-90" /></div>
        </div>
    </div>
);
