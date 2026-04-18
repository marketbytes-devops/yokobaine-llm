import React, { useState, useEffect } from 'react';
import { Save, UserPlus, FileText, Search, GraduationCap, Users, ChevronRight, ArrowLeft, ChevronLeft, Eye, Edit, User, Mail, Phone, Calendar, MapPin, Droplet, Hash, LogOut, Plus, Trash2 } from 'lucide-react';

export const StudentLedgerModule = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'roster', 'profile'
    const [selectedClass, setSelectedClass] = useState(null); 
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    const [students, setStudents] = useState([]);
    const [classSummaries, setClassSummaries] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]); 
    const [teachers, setTeachers] = useState([]); 
    
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(null); // Stores the student ID being edited
    const [totalStudentsInClass, setTotalStudentsInClass] = useState(0);
    const [extraSections, setExtraSections] = useState([]); // Manually added sections
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [newSectionValue, setNewSectionValue] = useState("");
    const itemsPerPage = 25;

    const API_BASE_URL = "http://127.0.0.1:8000/api/students";
    const SCHOOL_API_URL = "http://127.0.0.1:8000/api/v1/school";

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
        parentNamePhone: '',
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

    const handleSave = async () => {
        if (!form.admissionId || !form.studentName || !form.parentNamePhone || !form.section) {
            alert("Please provide Admission ID, Student Name, Guardian details, and ensure a Section is selected.");
            return;
        }
        setLoading(true);
        try {
            const parts = form.parentNamePhone.trim().split(/\s+/);
            const phoneNumber = parts.length > 1 ? parts.pop() : "";
            const guardianName = parts.join(" ");
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
                    full_name: guardianName || form.parentNamePhone,
                    phone_number: phoneNumber || "0000000000",
                    home_address: form.homeAddress,
                    emergency_contact: form.emergencyContact
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
                    grade: '', section: '', stream: '', parentNamePhone: '', 
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
        setViewMode('roster');
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
                                grade: '', section: '', stream: '', parentNamePhone: '', 
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
                                <InputGroup label="Admission ID" placeholder="YKB-2024-001" value={form.admissionId} onChange={e => setForm({...form, admissionId: e.target.value})} />
                                <InputGroup label="Full Name" placeholder="Student name" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Date of Birth" type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                                    <SelectGroup label="Blood Group" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                    <SelectGroup label="Grade" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} options={levelConfigs[selectedLevel] || []} />
                                    <div className="relative">
                                        <SelectGroup 
                                            label="Section" 
                                            value={form.section} 
                                            onChange={e => setForm({...form, section: e.target.value})} 
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
                                        onChange={e => setForm({...form, classTeacherId: e.target.value})} 
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
                                <InputGroup label="Primary Guardian & Phone" placeholder="John Doe 9876543210" value={form.parentNamePhone} onChange={e => setForm({...form, parentNamePhone: e.target.value})} />
                                <textarea value={form.homeAddress} onChange={e => setForm({...form, homeAddress: e.target.value})} className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-[2rem] text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:ring-8 focus:ring-[#0BC48B]/5 focus:border-[#0BC48B] transition-all min-h-[140px] resize-none" placeholder="Provide full residential details..." />
                                <InputGroup label="Emergency Contact" type="text" placeholder="Alternate phone" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} />
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
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedClass.class_name} - {selectedClass.section_identifier || 'A'}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Class Roster | {totalStudentsInClass} Active Students</p>
                                    </div>
                                </div>
                                <div className="flex bg-slate-50 border border-slate-100 rounded-[1.8rem] px-6 py-4 w-full md:w-80 shadow-inner">
                                    <Search size={18} className="text-slate-400 mr-3 mt-0.5" />
                                    <input type="text" placeholder="Search in class..." className="bg-transparent text-sm font-bold text-slate-900 outline-none w-full" />
                                </div>
                            </div>

                            <div className="bg-white rounded-[4rem] p-6 lg:p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-50">
                                                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll No</th>
                                                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Photo</th>
                                                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                                                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent Contact</th>
                                                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Group</th>
                                                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {students.map((st, idx) => (
                                                <tr key={st.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-6 font-black text-slate-900 text-sm">{(idx + 1).toString().padStart(2, '0')}</td>
                                                    <td className="px-6 py-6">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg ring-4 ring-slate-50">
                                                            {st.full_name.charAt(0)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 font-black text-slate-900 text-sm hover:text-[#0BC48B] transition-colors">
                                                        <button onClick={() => goToProfile(st)} className="text-left font-black">{st.full_name}</button>
                                                    </td>
                                                    <td className="px-6 py-6 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                                                        {st.guardian?.phone_number}
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-black rounded-lg uppercase">{st.blood_group}</span>
                                                    </td>
                                                    <td className="px-6 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => goToProfile(st)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#0BC48B] hover:border-[#0BC48B]/30 hover:shadow-lg transition-all">
                                                                <Eye size={16} />
                                                            </button>
                                                            <button onClick={() => handleEditStart(st)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-500 hover:border-indigo-500/30 hover:shadow-lg transition-all">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button onClick={() => handleDeleteStudent(st.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500/30 hover:shadow-lg transition-all">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
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
                            <div className="bg-white/20 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20 self-center md:self-auto">
                                Active Student
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
                    
                    <div className="flex gap-4">
                        <button onClick={onEdit} className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">Change Details</button>
                    </div>
                </div>
            </div>

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
                        <InfoItem label="Contact Number" value={student.guardian?.phone_number} />
                        <InfoItem label="Emergency Contact" value={student.guardian?.emergency_contact || 'N/A'} />
                        <div className="col-span-2">
                            <InfoItem label="Home Address" value={student.guardian?.home_address || 'Address not registered'} />
                        </div>
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};

const InfoCard = ({ title, icon, children }) => (
    <div className="bg-white rounded-[4rem] p-10 lg:p-14 border border-slate-100 shadow-2xl shadow-slate-200/40">
        <div className="flex items-center gap-4 mb-14">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h4>
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
