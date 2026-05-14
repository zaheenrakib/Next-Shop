"use client";
import React, { useState, useEffect } from 'react';

const statusColors: any = {
    pending: "bg-amber-50 text-amber-700 border border-amber-200/60",
    resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    rejected: "bg-rose-50 text-rose-600 border border-rose-100",
};

const FeedbackTable = () => {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchFeedbacks();
    }, [currentPage, statusFilter, search]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const query = `?page=${currentPage}&status=${statusFilter}&search=${encodeURIComponent(search)}&limit=10`;
            const res = await fetch(`/api/feedback${query}`);
            const data = await res.json();

            if (data && data.feedbacks) {
                setFeedbacks(data.feedbacks);
                setTotalPages(data.meta.totalPages || 1);
                setTotalCount(data.meta.totalCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/feedback/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) fetchFeedbacks();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };


    const getPaginationRange = () => {
        const delta = 1;
        const range: any[] = [];
        const rangeWithDots: any[] = [];
        let l: number | undefined;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l > 2) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    return (
        <div className=" max-w-7xl mx-auto space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">User Feedbacks & Complaints</h2>
                    <p className="text-xs md:text-sm text-zinc-500 mt-1">Directly manage status from the table or view full details.</p>
                </div>
                <div className="bg-zinc-900 px-4 py-2 rounded-xl text-center shadow-sm w-full sm:w-auto">
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Feedback</span>
                    <span className="text-lg md:text-xl font-bold text-white">{totalCount}</span>
                </div>
            </div>


            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">

                <div className="w-full lg:w-80 relative">
                    <input
                        type="text"
                        placeholder="Search name, phone or subject..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-4 pr-10 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-800"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 text-sm">✕</button>
                    )}
                </div>


                <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                    {['all', 'pending', 'resolved', 'rejected'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setStatusFilter(tab); setCurrentPage(1); }}
                            className={`flex-1 lg:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${statusFilter === tab
                                ? 'bg-zinc-900 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/70 border-b border-zinc-100 text-zinc-600 uppercase text-xs font-bold tracking-wider">
                                <th className="px-6 py-4">Sender</th>
                                <th className="px-6 py-4">Subject & Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-center">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-5"><div className="h-5 bg-zinc-100 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
                            ) : feedbacks.length > 0 ? (
                                feedbacks.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-zinc-50/40 transition-colors text-sm">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-zinc-900">{item.fullName}</div>
                                            <div className="text-xs text-zinc-400 mt-0.5">{item.phoneNo}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="font-medium text-zinc-800 truncate">{item.subject}</div>
                                            <button
                                                onClick={() => { setSelectedFeedback(item); setIsModalOpen(true); }}
                                                className="text-xs text-zinc-400 hover:text-zinc-900 underline mt-0.5 block text-left"
                                            >
                                                Read Full Story
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusColors[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-500 text-xs">
                                            {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center items-center gap-1.5">
                                                {item.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(item.id, 'resolved')}
                                                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
                                                        >
                                                            Resolve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(item.id, 'rejected')}
                                                            className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all border border-zinc-200"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-zinc-400 italic font-medium">No action needed</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-zinc-400 font-medium">No complaints found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                <div className="block md:hidden divide-y divide-zinc-100">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="p-4 space-y-3 animate-pulse">
                                <div className="h-4 bg-zinc-100 rounded w-1/3"></div>
                                <div className="h-4 bg-zinc-100 rounded w-full"></div>
                                <div className="h-8 bg-zinc-100 rounded w-full"></div>
                            </div>
                        ))
                    ) : feedbacks.length > 0 ? (
                        feedbacks.map((item: any) => (
                            <div key={item.id} className="p-4 space-y-3 hover:bg-zinc-50/30 transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-zinc-900 text-sm">{item.fullName}</h4>
                                        <p className="text-xs text-zinc-400">{item.phoneNo}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[item.status]}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div className="bg-zinc-50/80 p-3 rounded-lg border border-zinc-100/50">
                                    <h5 className="font-semibold text-zinc-800 text-xs truncate">{item.subject}</h5>
                                    <button
                                        onClick={() => { setSelectedFeedback(item); setIsModalOpen(true); }}
                                        className="text-[11px] text-zinc-500 hover:text-zinc-900 underline mt-1 block"
                                    >
                                        View Details & Description
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-zinc-400">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>

                                    <div className="flex gap-1.5">
                                        {item.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(item.id, 'resolved')}
                                                    className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm"
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(item.id, 'rejected')}
                                                    className="px-3 py-1 rounded-lg text-xs font-bold bg-white border border-zinc-200 text-zinc-700"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-zinc-400 text-sm">No complaints found.</div>
                    )}
                </div>


                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-zinc-50 border-t border-zinc-100">
                        <span className="text-xs text-zinc-500 font-medium order-2 sm:order-1">
                            Showing Page {currentPage} of {totalPages}
                        </span>

                        <div className="flex items-center gap-1.5 order-1 sm:order-2 w-full sm:w-auto justify-center">

                            <button
                                disabled={currentPage === 1 || loading}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="p-2 px-3 text-xs font-semibold rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white transition-all"
                            >
                                ← Prev
                            </button>


                            {getPaginationRange().map((page, index) => {
                                if (page === '...') {
                                    return <span key={index} className="px-1 text-sm text-zinc-400 select-none">...</span>;
                                }
                                return (
                                    <button
                                        key={index}
                                        disabled={loading}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${currentPage === page
                                            ? 'bg-zinc-900 text-white shadow-sm shadow-zinc-950/20'
                                            : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}


                            <button
                                disabled={currentPage === totalPages || loading}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="p-2 px-3 text-xs font-semibold rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-white transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {isModalOpen && selectedFeedback && (
                <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-zinc-100 animate-in fade-in zoom-in duration-150">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-slate-600 border border-zinc-200/60 transition-all"
                        >
                            ✕
                        </button>

                        <h3 className="text-lg font-bold text-zinc-900 pr-8 leading-snug">{selectedFeedback.subject}</h3>
                        <p className="text-[11px] font-medium text-zinc-400 mt-1 uppercase tracking-wider">Received: {new Date(selectedFeedback.createdAt).toLocaleString()}</p>

                        <div className="space-y-4 my-6">
                            <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100/80">
                                <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">User Info</span>
                                <p className="text-sm font-semibold text-zinc-800">{selectedFeedback.fullName}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{selectedFeedback.phoneNo} {selectedFeedback.email ? `• ${selectedFeedback.email}` : ''}</p>
                            </div>

                            <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100/80">
                                <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1.5">Complaint Details</span>
                                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{selectedFeedback.details}</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackTable;