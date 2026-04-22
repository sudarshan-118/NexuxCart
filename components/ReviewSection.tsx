'use client';
import { Review } from '@/lib/types';
import { Star, Sparkles, MessageCircle } from 'lucide-react';
import { analyzeProductReviews } from '@/lib/ai';
import { addReview } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/state';

export default function ReviewSection({ productId, initialReviews }: { productId: string, initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [analysis, setAnalysis] = useState<{score?: number, summary?: string} | null>(null);
  const { currentUser } = useStore();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyzeProductReviews(productId).then(res => setAnalysis(res));
  }, [productId, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert('Please login (mock) to review');
    setLoading(true);
    const newRev = await addReview({
      productId,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      text
    });
    setReviews([newRev, ...reviews]);
    setText('');
    setLoading(false);
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold tracking-tight mb-8 text-[#202124]">Customer Reviews</h2>
      
      {analysis && analysis.summary && (
        <div className="bg-green-50 p-4 rounded-xl mb-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-green-100/50 shadow-sm">
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">AI Review Insight</span>
                 <span className="text-xs font-bold text-green-700 bg-white px-2 py-0.5 rounded-full border border-green-100">{analysis.score}/10</span>
             </div>
             <p className="text-sm text-green-800 italic leading-tight">&quot;{analysis.summary}&quot;</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
               <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
          {reviews.map(r => (
            <div key={r.id} className="border-b border-gray-100 pb-6">
              <div className="flex gap-1 mb-3 text-[#202124]">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current text-[#202124]' : 'text-gray-200'}`} />)}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{r.text}</p>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{r.userName} &bull; {new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 h-fit">
          <h3 className="text-lg font-bold mb-6 text-[#202124]">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating</label>
              <select value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full border-transparent rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 border text-sm text-[#202124]">
                 <option value="5">5 Stars</option>
                 <option value="4">4 Stars</option>
                 <option value="3">3 Stars</option>
                 <option value="2">2 Stars</option>
                 <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comment</label>
              <textarea value={text} onChange={e => setText(e.target.value)} required rows={4} className="w-full border-transparent rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 border text-sm text-[#202124]" placeholder="What did you like or dislike?" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
