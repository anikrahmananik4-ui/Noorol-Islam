
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Hash, 
  Heart,
  BookMarked,
  LayoutGrid,
  Sun,
  Moon,
  CloudSun,
  Sparkles
} from 'lucide-react';
import { PrayerTimes, UserSettings, View, Surah } from '../types';
import { getHijriDate } from '../services/api';

interface DashboardProps {
  prayerTimes: PrayerTimes | null;
  settings: UserSettings;
  onViewChange: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ prayerTimes, settings, onViewChange }) => {
  const [hijriDate, setHijriDate] = useState<string>('লোড হচ্ছে...');
  const [greeting, setGreeting] = useState('');
  const [lastRead, setLastRead] = useState<{number: number, name: string} | null>(null);

  useEffect(() => {
    getHijriDate().then(setHijriDate).catch(() => setHijriDate('হিযরী তারিখ পাওয়া যায়নি'));
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('শুভ সকাল');
    else if (hour >= 12 && hour < 17) setGreeting('শুভ দুপুর');
    else if (hour >= 17 && hour < 20) setGreeting('শুভ সন্ধ্যা');
    else setGreeting('শুভ রাত্রি');

    // Load last read surah from local storage
    const saved = localStorage.getItem('nurul_islam_last_read');
    if (saved) setLastRead(JSON.parse(saved));
  }, []);

  const prayerInfo = useMemo(() => {
    if (!prayerTimes) return null;
    const now = new Date();
    
    const timeToMinutes = (t: string) => {
      const [time, period] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = [
      { id: 'Fajr', name: 'ফজর', time: prayerTimes.Fajr },
      { id: 'Dhuhr', name: 'যোহর', time: prayerTimes.Dhuhr },
      { id: 'Asr', name: 'আসর', time: prayerTimes.Asr },
      { id: 'Maghrib', name: 'মাগরিব', time: prayerTimes.Maghrib },
      { id: 'Isha', name: 'এশা', time: prayerTimes.Isha }
    ].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    let next = prayers.find(p => timeToMinutes(p.time) > currentMinutes);
    let prev = [...prayers].reverse().find(p => timeToMinutes(p.time) <= currentMinutes) || prayers[prayers.length - 1];

    if (!next) next = prayers[0];

    const start = timeToMinutes(prev.time);
    let end = timeToMinutes(next.time);
    if (end < start) end += 24 * 60; 
    
    const total = end - start;
    const elapsed = (currentMinutes < start ? currentMinutes + 24 * 60 : currentMinutes) - start;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

    return { next, progress };
  }, [prayerTimes]);

  const QUICK_LINKS = [
    { id: View.QURAN, label: 'কুরআন', icon: <BookOpen size={24} className="text-emerald-500" />, color: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: View.HADITH, label: 'হাদিস', icon: <BookMarked size={24} className="text-indigo-500" />, color: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: View.QIBLA, label: 'কিবলা', icon: <Compass size={24} className="text-amber-500" />, color: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: View.TASBIH, label: 'তাসবিহ', icon: <Hash size={24} className="text-rose-500" />, color: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return <Sun className="text-amber-400 animate-spin-slow" size={40} />;
    return <Moon className="text-indigo-300" size={40} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-16">
      {/* Premium Dynamic Hero Card */}
      <div className={`relative overflow-hidden rounded-[48px] p-8 sm:p-12 text-white shadow-2xl transition-all duration-700 ${
        new Date().getHours() >= 6 && new Date().getHours() < 18 
        ? 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800' 
        : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950'
      }`}>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <p className="text-white/70 font-black uppercase tracking-[0.2em] text-[10px]">{greeting}</p>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black leading-tight">
                {settings.name}
              </h2>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-[32px] border border-white/20">
              {getGreetingIcon()}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-10">
            <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
              <Calendar size={20} className="text-emerald-300" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">হিযরী তারিখ</span>
                <span className="text-sm font-black">{hijriDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
              <MapPin size={20} className="text-emerald-300" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">অবস্থান</span>
                <span className="text-sm font-black">{settings.location?.city || 'ঢাকা'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px]"></div>
      </div>

      {/* Smart Feature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {QUICK_LINKS.map(link => (
          <button
            key={link.id}
            onClick={() => onViewChange(link.id)}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 shadow-sm hover:shadow-xl transition-all active:scale-95 group"
          >
            <div className={`w-16 h-16 ${link.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
              {link.icon}
            </div>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">{link.label}</span>
          </button>
        ))}
      </div>

      {/* Prayer Tracker & Last Read Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Next Prayer Card */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-[48px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-2xl transition-all">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">পরবর্তী নামাজ</p>
              <h3 className="text-4xl font-black text-slate-800 dark:text-white">
                {prayerInfo?.next.name || '--'}
              </h3>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-5 rounded-[28px] text-emerald-600 dark:text-emerald-400 animate-pulse">
              <Clock size={36} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-baseline">
              <span className="text-6xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tighter">
                {prayerInfo?.next.time || '--:--'}
              </span>
              <div className="flex items-center space-x-2 text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">লাইভ ট্র্যাকার</span>
              </div>
            </div>
            
            <div className="relative h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                style={{ width: `${prayerInfo?.progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Last Read Card */}
        <div className="md:col-span-2 bg-indigo-600 dark:bg-indigo-900 rounded-[48px] p-8 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-8 flex items-center">
              <Sparkles size={14} className="mr-2" />
              পড়া চালিয়ে যান
            </h4>
            <h3 className="text-3xl font-black leading-tight">
              {lastRead ? lastRead.name : 'সূরা আল-বাকারা'}
            </h3>
            <p className="text-indigo-100 text-sm opacity-80 mt-2 font-bold">
              {lastRead ? `সূরা নং ${lastRead.number}` : 'শুরু থেকে পড়ুন'}
            </p>
          </div>
          
          <button 
             onClick={() => onViewChange(View.QURAN)}
             className="relative z-10 mt-10 w-full bg-white text-indigo-700 font-black py-4.5 rounded-[24px] flex items-center justify-center space-x-2 hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
          >
            <span>পড়া শুরু করুন</span>
            <ChevronRight size={18} />
          </button>

          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-transform">
             <BookOpen size={200} />
          </div>
        </div>
      </div>

      {/* Sunnah of the Day Section */}
      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-[48px] p-10 relative overflow-hidden group">
        <div className="flex items-center space-x-4 mb-8">
           <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
             <Heart size={24} fill="currentColor" />
           </div>
           <div>
             <h4 className="font-black text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-[0.2em]">আজকের আমল</h4>
             <p className="text-sm font-bold text-slate-500">ছোট আমল, বড় সওয়াব</p>
           </div>
        </div>
        <blockquote className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-relaxed italic relative z-10">
          "প্রতিদিন সকালে ৩ বার সূরা ইখলাস পাঠ করুন, এটি এক খতম কুরআনের সমান সওয়াব দেয়।"
        </blockquote>
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-emerald-900 dark:text-white pointer-events-none">
          <Heart size={220} />
        </div>
      </div>

      {/* Featured Hadith Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl group">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs uppercase tracking-[0.2em]">নির্বাচিত হাদিস</h4>
          </div>
          <button 
            onClick={() => onViewChange(View.HADITH)}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
          <p className="text-slate-700 dark:text-slate-200 text-xl leading-relaxed font-bold italic relative z-10">
            "প্রকৃত মুসলিম সে-ই, যার জিহ্বা ও হাত থেকে অন্য মুসলিম নিরাপদ থাকে।"
          </p>
          <div className="mt-8 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <BookMarked size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">সহীহ আল-বুখারী</span>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-10 opacity-[0.02] text-indigo-900 dark:text-white pointer-events-none">
            <BookMarked size={180} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
