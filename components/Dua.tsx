
import React, { useState, useEffect } from 'react';
import { Search, Heart, Share2, Copy, Check, RefreshCw } from 'lucide-react';
import { fetchRandomDua } from '../services/api';

const DuaView: React.FC = () => {
  const [currentDua, setCurrentDua] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadNewDua = async () => {
    setLoading(true);
    const dua = await fetchRandomDua();
    setCurrentDua(dua);
    setLoading(false);
  };

  useEffect(() => {
    loadNewDua();
  }, []);

  const copyToClipboard = () => {
    if (!currentDua) return;
    navigator.clipboard.writeText(`${currentDua.arabic}\n\n${currentDua.translation}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">প্রতিদিনের দোয়া</h2>
        <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-2xl text-rose-600 dark:text-rose-400 shadow-sm">
           <Heart size={22} fill="currentColor" />
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={loadNewDua}
          disabled={loading}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          <span>নতুন দোয়া দেখুন</span>
        </button>
      </div>

      {currentDua && (
        <div className={`bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-all ${loading ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                {currentDua.category}
              </span>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-3">{currentDua.title}</h3>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={copyToClipboard}
                className="p-3 text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-2xl transition-all"
              >
                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
              </button>
              <button className="p-3 text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-2xl transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="text-right">
             <p className="quran-arabic text-3xl leading-[2.5] text-slate-800 dark:text-slate-100 tracking-wide font-arabic">
               {currentDua.arabic}
             </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-slate-800">
            <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed text-lg">
              {currentDua.translation}
            </p>
          </div>

          <div className="text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl inline-block uppercase tracking-widest border border-slate-100 dark:border-slate-800">
             উৎস: {currentDua.reference}
          </div>
        </div>
      )}
    </div>
  );
};

export default DuaView;
