
import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, userName }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Universal Stable Header */}
      <header className="sticky top-0 z-[60] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex justify-between items-center h-[60px]">
        <div className="flex items-center space-x-3">
          {/* 3-Line Menu Button */}
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <span className="text-white font-bold text-lg">ন</span>
            </div>
            <h1 className="text-lg font-black text-slate-800 dark:text-slate-100">নুরুল ইসলাম</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800/50">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[70] transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Side Navigation Drawer */}
      <aside className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 z-[80] shadow-2xl transition-transform duration-300 ease-out transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-600 dark:bg-emerald-900 text-white">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">মেনু</p>
              <h2 className="text-xl font-black">ফিচারসমূহ</h2>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                  activeView === item.id 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-black' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${activeView === item.id ? 'scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {activeView === item.id && <ChevronRight size={16} />}
              </button>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-emerald-600 shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">ইউজার প্রোফাইল</p>
                <p className="text-sm font-black text-slate-800 dark:text-white">{userName}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
              "নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে।" (৯৪:৫)
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Footer Disclaimer (Desktop Only) */}
      <footer className="hidden md:block py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-[10px] text-slate-400 dark:text-slate-500">
        কেবলমাত্র শিক্ষামূলক উদ্দেশ্যে। প্রতিটি বিষয়বস্তু নির্ভরযোগ্য উৎস থেকে সংগৃহীত।
      </footer>
    </div>
  );
};

export default Layout;
