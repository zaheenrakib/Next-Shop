"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  History,
  Lock,
  Edit2,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const initialCustomers = [
  { id: "C-4410", name: "Mahmudul Hasan Ratul", email: "ratul@example.com", phone: "017XXXXXXXX", orders: 12, spent: "$4,500", joined: "2025-10-09" },
  { id: "C-4411", name: "Md. Rasel Mahmud", email: "rasel@banker.com", phone: "018XXXXXXXX", orders: 5, spent: "$1,200", joined: "2026-04-01" },
  { id: "C-4412", name: "Sumo Khan", email: "sumo@crochet.com", phone: "019XXXXXXXX", orders: 8, spent: "$850", joined: "2026-03-15" },
  { id: "C-4413", name: "Ahsan Habib", email: "ahsan@tech.com", phone: "015XXXXXXXX", orders: 2, spent: "$210", joined: "2026-04-20" },
];

const staffMembers = [
  { id: "S-101", name: "Ariful Islam", role: "Super Admin", access: "Full Access", status: "Active", email: "arif@nextshop.com" },
  { id: "S-102", name: "Tanvir Ahmed", role: "Order Manager", access: "Sales Only", status: "Active", email: "tanvir@nextshop.com" },
  { id: "S-103", name: "Sabbir Rahman", role: "Editor", access: "Catalog Only", status: "Inactive", email: "sabbir@nextshop.com" },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("Customers"); // Customers or Staff
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#262B3B] flex items-center gap-2">
            <Users className="text-[#FF5722]" size={28} />
            User Management
          </h1>
          <p className="text-gray-500 text-sm">Control customer database and define administrative roles.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#262B3B] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#1a1e29] transition-all">
          <UserPlus size={18} /> Add New {activeTab === "Customers" ? "Customer" : "Staff"}
        </button>
      </div>


      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab("Customers")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "Customers" ? "bg-white text-[#FF5722] shadow-sm" : "text-gray-500"}`}
        >
          <Users size={18} /> Customers
        </button>
        <button
          onClick={() => setActiveTab("Staff")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "Staff" ? "bg-white text-[#FF5722] shadow-sm" : "text-gray-500"}`}
        >
          <ShieldCheck size={18} /> Staff Roles
        </button>
      </div>


      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/10 outline-none shadow-sm transition-all"
        />
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                {activeTab === "Customers" ? (
                  <>
                    <th className="px-6 py-4">Customer Info</th>
                    <th className="px-6 py-4">Total Orders</th>
                    <th className="px-6 py-4">Total Spent</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4">Staff Member</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Access Level</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="wait">
                {activeTab === "Customers" ? (
                  filteredCustomers.map((user) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center font-bold text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#262B3B]">{user.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-600 text-sm">{user.orders} Orders</td>
                      <td className="px-6 py-4 font-black text-[#262B3B] text-sm">{user.spent}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{user.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-orange-50 text-[#FF5722] rounded-lg" title="Order History">
                            <History size={16} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  staffMembers.map((staff) => (
                    <motion.tr key={staff.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#262B3B] text-white flex items-center justify-center">
                            <Lock size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#262B3B]">{staff.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{staff.role}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-medium">{staff.access}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-lg w-fit ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {staff.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>


      {activeTab === "Customers" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Customers</p>
              <h4 className="text-xl font-black text-[#262B3B] mt-1">+128</h4>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
              <CheckCircle2 size={24} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}