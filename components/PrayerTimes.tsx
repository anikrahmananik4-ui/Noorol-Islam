
import React from 'react';
import { PrayerTimes, UserSettings } from '../types';
import { Bell, Info } from 'lucide-react';

interface PrayerTimesProps {
  times: PrayerTimes | null;
  settings: UserSettings;
}

const PrayerTimesView: React.FC<PrayerTimesProps> = ({ times, settings }) => {
  if (!times) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
    </div>
  );

  const PRAYERS = [
    { name: 'Fajr', bn: 'ফজর', icon: '🌅' },
    { name: 'Sunrise', bn: 'সূর্যোদয়', icon: '☀️' },
    { name: 'Dhuhr', bn: 'যোহর', icon: '🌞' },
    { name: 'Asr', bn: 'আসর', icon: '🌇' },
    { name: 'Maghrib', bn: 'মাগরিব', icon: '🌙' },
    { name: 'Isha', bn: 'এশা', icon: '🌃' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-emerald-600 dark:bg-emerald-900 rounded-[32px] p-8 text-white text-center shadow-xl relative overflow-hidden">
        <h2 className="text-2xl font-black mb-2 relative z-10">নামাজের সময়সূচী</h2>
        <p className="text-emerald-100 opacity-80 text-sm font-bold relative z-10">{settings.location?.city || 'নির্ধারিত স্থান'}</p>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-20 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PRAYERS.map((prayer) => {
          const time = times[prayer.name as keyof PrayerTimes];
          const isSunrise = prayer.name === 'Sunrise';
          return (
            <div 
              key={prayer.name} 
              className={`flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm transition-all ${
                isSunrise 
                  ? 'border-slate-100 dark:border-slate-800 opacity-70 scale-[0.98]' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center space-x-5">
                <span className="text-3xl">{prayer.icon}</span>
                <div>
                  <h4 className={`font-black text-lg ${isSunrise ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                    {prayer.bn}
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-black tabular-nums ${isSunrise ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {time}
                </span>
                {!isSunrise && (
                  <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                    <Bell size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-[32px] flex items-start space-x-4 text-blue-700 dark:text-blue-400">
        <Info className="flex-shrink-0 mt-1" size={20} />
        <p className="text-xs font-bold leading-relaxed">
          নামাজের সময় আপনার বর্তমান অবস্থান এবং নির্বাচিত গণনা পদ্ধতির ওপর ভিত্তি করে দেওয়া হয়েছে। দয়া করে আপনার ডিভাইসের সময় সঠিক রাখুন।
        </p>
      </div>
    </div>
  );
};

export default PrayerTimesView;
