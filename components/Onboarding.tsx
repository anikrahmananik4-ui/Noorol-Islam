
import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 rounded-[32px] mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-emerald-600/20 rotate-12 hover:rotate-0 transition-transform duration-500">
            <span className="text-white font-black text-4xl">ন</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">নুরুল ইসলাম</h1>
          <p className="text-slate-400 font-bold leading-relaxed px-6">
            আপনার আধ্যাত্মিক যাত্রার প্রতিদিনের সাথী। নির্ভুল, নির্ভরযোগ্য এবং আধুনিক।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-2xl p-8 sm:p-10 rounded-[48px] border border-white/10 shadow-3xl space-y-8">
          <div className="flex items-center space-x-2 text-emerald-400 font-black text-sm uppercase tracking-widest">
            <Sparkles size={18} />
            <span>নতুন সফর শুরু করুন</span>
          </div>
          
          <div className="space-y-4">
            <label className="text-white font-bold block text-sm ml-1">আপনাকে আমরা কী নামে ডাকব?</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-lg font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
          >
            <span className="text-lg">যাত্রা শুরু করুন</span>
            <ArrowRight size={22} />
          </button>

          <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            আপনার নাম শুধুমাত্র আপনার এই ডিভাইসে সংরক্ষিত থাকবে
          </p>
        </form>

        <div className="mt-12 flex justify-center space-x-8 text-slate-700">
          <div className="flex flex-col items-center">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mb-2"></div>
             <span className="text-[10px] uppercase font-black tracking-[0.2em]">কুরআন</span>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mb-2"></div>
             <span className="text-[10px] uppercase font-black tracking-[0.2em]">নামাজ</span>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mb-2"></div>
             <span className="text-[10px] uppercase font-black tracking-[0.2em]">হাদিস</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
