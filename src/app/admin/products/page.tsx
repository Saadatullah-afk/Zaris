'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, Package, Sparkles, X, Check, Star } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    costPrice: '',
    price: '',
    discountPrice: '',
    stock: '',
    categoryId: '',
    description: '',
    imageUrl: '',
    tags: '',
    careInfo: '',
    featured: false,
    bestSeller: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/products?search=${encodeURIComponent(search)}`),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      if (catData.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catData[0].id }));
      }
    } catch (e) {
      console.error('Failed to fetch product data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      costPrice: '',
      price: '',
      discountPrice: '',
      stock: '10',
      categoryId: categories[0]?.id || '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      tags: 'jewellery, trending',
      careInfo: 'Keep away from perfumes and water.',
      featured: false,
      bestSeller: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProduct(prod);
    const imgs = JSON.parse(prod.images || '[]');
    setFormData({
      name: prod.name,
      sku: prod.sku,
      costPrice: prod.costPrice.toString(),
      price: prod.price.toString(),
      discountPrice: prod.discountPrice ? prod.discountPrice.toString() : '',
      stock: prod.stock.toString(),
      categoryId: prod.categoryId,
      description: prod.description,
      imageUrl: imgs[0] || '',
      tags: typeof prod.tags === 'string' ? JSON.parse(prod.tags || '[]').join(', ') : '',
      careInfo: prod.careInfo || '',
      featured: prod.featured,
      bestSeller: prod.bestSeller,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      images: [formData.imageUrl],
      tags: formData.tags.split(',').map((t) => t.trim()),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Catalog Management
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Product Catalog</h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product title, SKU, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            className="w-full bg-[#101117] border border-zinc-800 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#101117] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161822] text-[#D4AF37] uppercase tracking-wider font-bold border-b border-zinc-800">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Cost Price (৳)</th>
                <th className="p-4">Selling Price (৳)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const img = JSON.parse(prod.images || '[]')[0];
                  return (
                    <tr key={prod.id} className="hover:bg-[#14151F] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg border border-zinc-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-zinc-100 block">{prod.name}</span>
                            <span className="text-[10px] text-zinc-500">SKU: {prod.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-zinc-300 font-medium">{prod.category?.name}</span>
                      </td>

                      <td className="p-4">
                        <span className="text-zinc-400">৳{prod.costPrice}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-[#D4AF37]">
                          ৳{prod.discountPrice || prod.price}
                        </span>
                        {prod.discountPrice && (
                          <span className="text-[10px] text-zinc-500 line-through block">
                            ৳{prod.price}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-bold ${
                            prod.stock <= 0
                              ? 'text-red-400'
                              : prod.stock <= 5
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.featured && (
                            <span className="bg-[#1A1813] text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Featured
                            </span>
                          )}
                          {prod.bestSeller && (
                            <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 bg-[#161822] hover:bg-[#D4AF37] text-zinc-300 hover:text-black rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 bg-[#161822] hover:bg-red-600 text-zinc-300 hover:text-white rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101117] border border-[#D4AF37]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 text-zinc-100 max-h-[90vh] overflow-y-auto gold-border-glow">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif-luxury text-2xl font-bold border-b border-zinc-800 pb-3">
              {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none uppercase text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Cost Price (৳)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Selling Price (৳)</label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Discount Price (৳ Optional)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Main Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full gold-gradient-bg text-black font-extrabold text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition-opacity mt-4"
              >
                {editingProduct ? 'Update Product' : 'Save & Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
