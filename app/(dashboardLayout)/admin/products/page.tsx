"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Grid3x3,
  Table2,
  Star,
  ChevronDown,
} from "lucide-react";
import ProductModal from "@/components/admin/ProductModal";
import { toast } from "react-hot-toast";


interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  thumbnail: string;
  category?: { name: string; id: string };
  brand?: { name: string; id: string };
  rating?: number;
  reviewCount?: number;
  status: "active" | "draft" | "archived";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const itemsPerPage = 10;


  const categories = [
    { id: "mobile", name: "Mobile" },
    { id: "laptop", name: "Laptop" },
    { id: "tablet", name: "Tablet" },
    { id: "accessory", name: "Accessory" },
  ];
  const brands = [
    { id: "apple", name: "Apple" },
    { id: "samsung", name: "Samsung" },
    { id: "asus", name: "Asus" },
    { id: "xiaomi", name: "Xiaomi" },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(categoryFilter && { category: categoryFilter }),
        ...(brandFilter && { brand: brandFilter }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage, categoryFilter, brandFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setBrandFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || categoryFilter || brandFilter || statusFilter;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">Active</span>;
      case "draft":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Draft</span>;
      case "archived":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Archived</span>;
      default:
        return null;
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">Out of Stock</span>;
    }
    if (stock < 5) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">Low Stock ({stock})</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">In Stock ({stock})</span>;
  };

  const renderRating = (rating: number = 0, count: number = 0) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={12}
              className={star <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">({count})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your product catalog, inventory, and pricing</p>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF4D30] hover:bg-[#d62f15] text-white text-sm font-medium rounded-xl shadow-sm shadow-blue-200 transition-all duration-200"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>


        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by product name, SKU, or brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>


              <div className="relative min-w-[140px]">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer pr-8"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>


              <div className="relative min-w-[140px]">
                <select
                  value={brandFilter}
                  onChange={(e) => {
                    setBrandFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer pr-8"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>


              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Table2 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Grid3x3 size={16} />
                </button>
              </div>


              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-all"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>


        {viewMode === "table" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category/Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                        <p className="text-gray-500 text-sm mt-2">Loading products...</p>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                              <img src={product.thumbnail} className="w-full h-full object-cover" alt={product.name} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                              <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-700">{product.category?.name || "-"}</div>
                          <div className="text-xs text-gray-400">{product.brand?.name || "-"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">${product.price?.toLocaleString() || "0"}</div>
                          {product.salePrice && (
                            <div className="text-xs text-gray-400 line-through">${product.salePrice?.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">{getStockBadge(product.stock)}</td>
                        <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
                        <td className="px-4 py-3">{renderRating(product.rating, product.reviewCount)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No products found</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative">
                    <img src={product.thumbnail} className="w-full h-full object-cover" alt={product.name} />
                    <div className="absolute top-2 right-2">{getStatusBadge(product.status)}</div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-bold text-gray-900">${product.price?.toLocaleString() || "0"}</span>
                        {product.salePrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">${product.salePrice?.toLocaleString()}</span>
                        )}
                      </div>
                      {getStockBadge(product.stock)}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        {product.category?.name} / {product.brand?.name}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600 rounded"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-gray-500 hover:text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}


        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500 hidden sm:block">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>


      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          refresh={fetchProducts}
        />
      )}
    </div>
  );
}