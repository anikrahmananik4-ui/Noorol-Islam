
import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookMarked, ArrowLeft, ChevronRight, Star, Plus } from 'lucide-react';
import { HADITH_BOOKS } from '../constants';
import { HadithBook } from '../types';
import { fetchHadithsByBook, fetchArabicHadithsByBook } from '../services/api';

interface CombinedHadith {
  hadithnumber: number;
  text: string;
  arabicText: string;
}

const Hadith: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<HadithBook | null>(null);
  const [combinedHadiths, setCombinedHadiths] = useState<CombinedHadith[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    if (selectedBook) {
      setLoading(true);
      setCombinedHadiths([]);
      setDisplayCount(20);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      Promise.all([
        fetchHadithsByBook(selectedBook.slug),
        fetchArabicHadithsByBook(selectedBook.slug)
      ]).then(([bnData, araData]) => {
        const paired: CombinedHadith[] = bnData.map((h: any, idx: number) => ({
          hadithnumber: h.hadithnumber || idx + 1,
          text: h.text,
          arabicText: araData[idx]?.text || ''
        }));
        setCombinedHadiths(paired);
        setLoading(false);
      }).catch(err => {
        console.error("Hadith Fetch Error:", err);
        setLoading(false);
      });
    }
  }, [selectedBook]);

  const filteredBooks = HADITH_BOOKS.filter(b => b.name.includes(searchTerm));
  
  const filteredHadiths = useMemo(() => {
    if (!searchTerm.trim()) return combinedHadiths;
    const lowerSearch = searchTerm.toLowerCase();
    return combinedHadiths.filter(h => 
      h.text.toLowerCase().includes(lowerSearch) || 
      h.hadithnumber.toString().includes(lowerSearch)
    );
  }, [combinedHadiths, searchTerm]);

  const displayedHadiths = filteredHadiths.slice(0, displayCount);

  if (selectedBook) {
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-10">
        {/* Detail Header - Sticky at Header bottom */}
        <div className="sticky top-[60px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl z-30 border-b border-slate-200/50 dark:border-slate-800/50 -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
          <div className="max-w-4xl mx-auto py-3 space-y-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <button 
                onClick={() => setSelectedBook(null)}
                className="p-2.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl shadow-sm text-indigo-600 dark:text-indigo-400 transition-all active:scale-90 border border-slate-100 dark:border-slate-700 shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="truncate">
                <h2 className="text-lg font-black text-slate-800 dark:text-white truncate">{selectedBook.name}</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{selectedBook.nameArabic}</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="হাদিসের বিষয় বা নম্বর দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDisplayCount(20);
                }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm text-slate-800 dark:text-slate-100 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-500 font-bold">হাদিসগুলো লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2 px-1">
            {displayedHadiths.length > 0 ? (
              <>
                {displayedHadiths.map((h) => (
                  <div key={h.hadithnumber} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors hover:shadow-md">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100/30">
                        হাদিস নং {h.hadithnumber}
                      </span>
                      <div className="flex items-center space-x-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-black">সহীহ</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="quran-arabic text-2xl leading-[2.2] text-slate-800 dark:text-slate-100 font-arabic select-none">
                        {h.arabicText}
                      </p>
                    </div>

                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {h.text}
                    </p>

                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 font-bold flex justify-between uppercase tracking-wider">
                      <span>গ্রন্থ: {selectedBook.name}</span>
                      <span className="italic">উৎস: {selectedBook.slug.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
                
                {displayCount < filteredHadiths.length && (
                  <button 
                    onClick={() => setDisplayCount(prev => prev + 30)}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-indigo-600 dark:text-indigo-400 font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98] shadow-sm"
                  >
                    <Plus size={18} />
                    <span>আরও হাদিস দেখুন</span>
                  </button>
                ) : filteredHadiths.length > 0 && (
                  <p className="text-center text-slate-400 text-xs font-bold py-4">সব হাদিস দেখানো হয়েছে</p>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 font-bold">কোনো হাদিস পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 dark:bg-indigo-900 rounded-[32px] p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black">সহীহ হাদিস গ্রন্থসমূহ</h2>
          <p className="text-indigo-100 opacity-80 mt-1 font-bold">যাচাইকৃত এবং নির্ভরযোগ্য হাদিস সংগ্রহ</p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <BookMarked size={140} />
        </div>
      </div>

      {/* List Header - Sticky at Header bottom */}
      <div className="sticky top-[60px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl py-3 z-30 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="relative max-w-4xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="গ্রন্থের নাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm text-slate-800 dark:text-slate-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
        {filteredBooks.map((book) => (
          <button
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all text-left group overflow-hidden relative"
          >
            <div className="flex items-center space-x-4 z-10">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <span className="text-xl">{book.name.charAt(5)}</span>
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{book.name}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{book.totalHadith} হাদিস</p>
              </div>
            </div>
            <div className="z-10 bg-slate-50 dark:bg-slate-800 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronRight size={18} />
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-[0.02] text-slate-900 dark:text-white">
              <BookMarked size={80} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hadith;
