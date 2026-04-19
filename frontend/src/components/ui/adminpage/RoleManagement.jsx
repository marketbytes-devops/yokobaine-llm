"use client";
import React, { useState, useEffect } from "react";
import { Shield, Plus, List, CheckCircle, XCircle, Trash2 } from "lucide-react";
import config from "@/config";

export const RoleManagementModule = () => {
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDesc, setNewRoleDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Fetch existing roles
    const fetchRoles = async () => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/auth/roles`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setRoles(data);
            }
        } catch (err) {
            console.error("Failed to fetch roles", err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleCreateRole = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("http://localhost:8000/api/auth/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newRoleName,
                    description: newRoleDesc
                })
            });

            if (res.ok) {
                setMessage({ type: "success", text: `Role "${newRoleName}" created successfully!` });
                setNewRoleName("");
                setNewRoleDesc("");
                fetchRoles();
            } else {
                const error = await res.json();
                setMessage({ type: "error", text: error.detail || "Failed to create role" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Connection error. Is the backend running?" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;
        
        try {
            const res = await fetch(`http://localhost:8000/api/auth/roles/${roleId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchRoles();
            } else {
                const error = await res.json();
                alert(error.detail || "Failed to delete role");
            }
        } catch (err) {
            alert("Connection error. Could not delete role.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Role Management</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Create and organize administrative roles for your school staff</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Role Form */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 h-fit">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-[#0BC48B]/10 text-[#0BC48B] rounded-2xl">
                            <Plus size={20} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Add New Role</h3>
                    </div>

                    <form onSubmit={handleCreateRole} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role Name</label>
                            <input 
                                type="text" 
                                required
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder="e.g. Vice Principal"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] text-sm font-bold transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                            <textarea 
                                value={newRoleDesc}
                                onChange={(e) => setNewRoleDesc(e.target.value)}
                                placeholder="What can this role do?"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#0BC48B]/10 focus:border-[#0BC48B] text-sm font-bold transition-all min-h-[120px]"
                            />
                        </div>

                        {message.text && (
                            <div className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold ${
                                message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            }`}>
                                {message.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                {message.text}
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            className="w-full py-5 bg-[#0BC48B] text-white rounded-[1.5rem] font-black shadow-lg shadow-[#0BC48B]/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 text-xs uppercase tracking-widest"
                        >
                            {loading ? "Saving..." : "Create Role"}
                        </button>
                    </form>
                </div>

                {/* Existing Roles List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-6 ml-2">
                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                            <List size={20} strokeWidth={3} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">System Roles</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roles.map((role) => (
                            <div key={role.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-[#0BC48B]/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-[#0BC48B]/10 group-hover:text-[#0BC48B] rounded-2xl transition-colors">
                                        <Shield size={20} />
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteRole(role.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Delete Role"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight">{role.name}</h4>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">{role.description || "No description provided"}</p>
                            </div>
                        ))}

                        {roles.length === 0 && (
                            <div className="col-span-2 py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                                <Shield size={40} className="text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">No roles defined yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
