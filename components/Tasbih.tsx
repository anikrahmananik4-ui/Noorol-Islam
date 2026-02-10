
import React, { useState, useEffect } from 'react';
import { RotateCcw, Hash } from 'lucide-react';

const Tasbih: React.FC = () => {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem('nurul_islam_tasbih_total');
    if (savedTotal) setTotal(parseInt(savedTotal));
  }, []);

  useEffect(() => {
    localStorage.setItem('nurul_islam_tasbih_total', total.toString());
  }, [total]);

  const increment = () => {
    setCount(prev => prev + 1);
    setTotal(prev => prev + 1);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const reset = () => {
    if (confirm('বর্তমান গণনা কি রিসেট করতে চান?')) {
      setCount(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">ডিজিটাল তাসবিহ</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold">আল্লাহর জিকিরে সময় কাটুক</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 group-active:opacity-40 transition-opacity rounded-full"></div>
        <button 
          onClick={increment}
          className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white dark:bg-slate-900 border-[12px] border-emerald-50 dark:border-emerald-950/30 shadow-2xl flex flex-col items-center justify-center hover:border-emerald-100 dark:hover:border-emerald-900/30 active:scale-95 transition-all outline-none focus:ring-8 focus:ring-emerald-200 dark:focus:ring-emerald-900/20"
        >
          <span className="text-7xl sm:text-8xl font-black text-slate-800 dark:text-slate-100 tabular-nums">{count}</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm mt-4 tracking-[0.3em]">গণনা করুন</span>
        </button>
      </div>

      <div className="flex space-x-4 w-full max-w-sm">
        <button 
          onClick={reset}
          className="flex-1 flex items-center justify-center space-x-2 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-600 dark:text-slate-300 font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <RotateCcw size={20} />
          <span>রিসেট</span>
        </button>
        <div className="flex-1 flex flex-col items-center justify-center bg-emerald-600 dark:bg-emerald-700 rounded-3xl text-white shadow-lg shadow-emerald-600/20 py-5">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">মোট জিকির</span>
          <div className="flex items-center space-x-2">
            <Hash size={16} className="opacity-50" />
            <span className="text-2xl font-black tabular-nums">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasbih;
