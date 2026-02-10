
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { CALCULATION_METHODS } from '../constants';
import { User, Globe, Moon, Shield, Info, Trash2, Sun } from 'lucide-react';

interface SettingsProps {
  settings: UserSettings;
  onUpdate: (newSettings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [name, setName] = useState(settings.name);

  const handleSaveName = () => {
    onUpdate({ ...settings, name });
    alert("নাম সফলভাবে পরিবর্তন করা হয়েছে।");
  };

  const toggleDarkMode = () => {
    onUpdate({ ...settings, darkMode: !settings.darkMode });
  };

  const handleReset = () => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি সব ডাটা মুছে ফেলতে চান?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">সেটিংস</h2>

        <div className="space-y-8">
          {/* Profile */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <User size={18} />
              <span>প্রোফাইল তথ্য</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400">আপনার নাম</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <button 
                  onClick={handleSaveName}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <Globe size={18} />
              <span>পছন্দসমূহ</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={toggleDarkMode}
                className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex justify-between items-center group transition-all active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3">
                  {settings.darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-500" />}
                  <span className="font-bold text-slate-700 dark:text-slate-200">ডার্ক মোড</span>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`}></div>
                </div>
              </button>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-500 dark:text-slate-400">BN</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">ভাষা</span>
                </div>
                <select 
                  value={settings.language}
                  onChange={(e) => onUpdate({...settings, language: e.target.value as any})}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="bn">বাংলা</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </section>

          {/* Methods */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <Shield size={18} />
              <span>নামাজ গণনার পদ্ধতি</span>
            </div>
            <select 
              value={settings.calculationMethod}
              onChange={(e) => onUpdate({...settings, calculationMethod: parseInt(e.target.value)})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {CALCULATION_METHODS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </section>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
             <button 
               onClick={handleReset}
               className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors font-bold"
             >
               <Trash2 size={18} />
               <span>সব ডাটা মুছে পুনরায় শুরু করুন</span>
             </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="text-slate-400" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100">নুরুল ইসলাম সম্পর্কে</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
          নুরুল ইসলাম বিশ্বজুড়ে মুসলিমদের জন্য একটি নির্ভরযোগ্য অ্যাপ, যা সঠিকতা এবং আধুনিক অভিজ্ঞতার ওপর ভিত্তি করে তৈরি। আমাদের সব তথ্য বিশ্বস্ত ইসলামিক উৎস থেকে যাচাইকৃত।
        </p>
        <div className="text-xs text-slate-400 dark:text-slate-500 space-y-1">
          <p>© ২০২৪ নুরুল ইসলাম প্রজেক্ট</p>
          <p>ভার্সন ১.০.০ (প্রডাকশন রেডি)</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
