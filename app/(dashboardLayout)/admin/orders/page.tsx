"use client";

import React, { useEffect, useState } from "react";
import {
  Search, Eye, Download, Clock, X, Printer, Package, User, CreditCard, MapPin, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");


  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder) setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "ALL" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "PROCESSING": return "bg-blue-50 text-blue-600 border-blue-100";
      case "SHIPPED": return "bg-purple-50 text-purple-600 border-purple-100";
      case "DELIVERED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">{filteredOrders.length} orders found</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>


        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search order ID or customer..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterStatus === status
                  ? "bg-orange-600 text-white shadow-md shadow-orange-100"
                  : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase text-gray-400 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-5">Order</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Items</th>
                  <th className="px-6 py-5">Total</th>
                  <th className="px-6 py-5">Payment</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-6 py-5 font-bold text-orange-600">#{order.orderId}</td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900 leading-none mb-1">{order.customerName}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{order.phone}</div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-gray-700 truncate max-w-[200px]">
                        {order.items?.map((item: any) => item.name).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-900">৳{order.totalAmount}</td>
                    <td className="px-6 py-5">
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] px-3 py-1.5 rounded-full border font-bold ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[11px] font-medium text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 transition-opacity">
                        <div className="relative">
                          <select
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100">
                            Update <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                          className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium">No orders found</div>
          )}
        </div>
      </div>


      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order <span className="text-orange-600">#{selectedOrder.orderId}</span></h2>
                <p className="text-xs text-gray-400 mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100">
                  <Printer className="w-4 h-4" /> Invoice
                </button>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusStyle(selectedOrder.status)}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Current Status</p>
                    <p className="font-bold text-gray-900">{selectedOrder.status}</p>
                  </div>
                </div>
                <div>
                  <select
                    className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold"
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <User className="w-3.5 h-3.5" /> Customer
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{selectedOrder.customerName}</h4>
                  <p className="text-gray-600 text-sm mt-1 font-medium">{selectedOrder.phone}</p>
                  <p className="text-gray-600 text-sm font-medium">{selectedOrder.email}</p>
                  <div className="flex gap-2 mt-3 text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
                    <p className="text-sm font-medium leading-relaxed">{selectedOrder.address}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <CreditCard className="w-3.5 h-3.5" /> Payment Info
                  </div>
                  <p className="text-gray-900 font-bold text-lg uppercase tracking-tight">
                    {selectedOrder.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Payment'}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2 font-bold uppercase">Transaction ID</p>
                  <p className="text-sm text-gray-600 font-mono">N/A</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</div>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                          <Package className="w-6 h-6 text-gray-200" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900 text-sm">{item.name}</h5>
                          <p className="text-xs text-gray-400 font-bold">৳{item.price} × {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 font-mono">৳{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/80 border-t border-gray-100">
              <div className="space-y-2 max-w-[280px] ml-auto">
                <div className="flex justify-between text-sm text-gray-500 font-bold uppercase tracking-tighter">
                  <span>Subtotal</span>
                  <span className="font-mono">৳{selectedOrder.totalAmount - (selectedOrder.shippingFee || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-bold uppercase tracking-tighter">
                  <span>Shipping Fee</span>
                  <span className="font-mono">৳{selectedOrder.shippingFee || 0}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                  <span className="font-bold text-gray-900 uppercase tracking-tight text-base">Total Payable</span>
                  <span className="text-2xl font-extrabold text-orange-600 font-mono">৳{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}