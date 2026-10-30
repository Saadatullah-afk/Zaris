'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, XCircle } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !isApproved }),
      });
      if (res.ok) fetchReviews();
    } catch (e) {
      console.error('Toggle failed', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchReviews();
    } catch (e) {
      console.error('Delete review failed', e);
    }
  };

  return (
    <div className="space-y-6 text-zinc-100">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
            Reputation Management
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold">Customer Reviews</h1>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-xs text-zinc-500 text-center py-10">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-10">No customer reviews found.</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#101117] border border-[#D4AF37]/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-zinc-200">{rev.customerName}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                    Product: {rev.product?.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 italic">&ldquo;{rev.comment}&rdquo;</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    rev.isApproved
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  }`}
                >
                  {rev.isApproved ? 'Approved' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="p-2 text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
