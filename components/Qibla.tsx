
import React, { useState, useEffect } from 'react';
import { Compass, Info, RefreshCw, AlertTriangle } from 'lucide-react';

const QiblaView: React.FC = () => {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaBearing, setQiblaBearing] = useState<number>(291); // Default
  const [error, setError] = useState<string | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Kaaba coordinates
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  useEffect(() => {
    // 1. Calculate bearing based on GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          const φ1 = lat * Math.PI / 180;
          const φ2 = KAABA_LAT * Math.PI / 180;
          const Δλ = (KAABA_LNG - lng) * Math.PI / 180;

          const y = Math.sin(Δλ) * Math.cos(φ2);
          const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
          let bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
          
          setQiblaBearing(bearing);
        },
        () => setError("অবস্থান পাওয়া যায়নি। কিবলা কোণ আনুমানিক দেখানো হচ্ছে।")
      );
    }

    // 2. Compass Sensor
    const handleOrientation = (event: any) => {
      // webkitCompassHeading is for iOS
      const h = event.webkitCompassHeading !== undefined ? event.webkitCompassHeading : (360 - event.alpha);
      if (h !== null && h !== undefined) {
        setHeading(h);
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission().then((res: string) => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        });
      } else {
        window.addEventListener('deviceorientationabsolute', handleOrientation);
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      setError("আপনার ডিভাইসে কম্পাস সেন্সর পাওয়া যায়নি।");
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, []);

  const calibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => setIsCalibrating(false), 2000);
  };

  return (
    <div className="space-y-8 flex flex-col items-center animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">কিবলা কম্পাস</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">সঠিক দিক পেতে ফোনটি সমান্তরাল রাখুন</p>
      </div>

      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        {/* Decorative Rings */}
        <div className="absolute inset-0 border-[12px] border-slate-200 dark:border-slate-800 rounded-full shadow-2xl"></div>
        <div className="absolute inset-6 border border-emerald-500/20 rounded-full"></div>
        
        {/* Compass Rotating Part */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          {/* Cardinal Directions */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-black text-slate-400">N</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-black text-slate-400">S</div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">W</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">E</div>

          {/* Qibla Needle */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-start"
            style={{ transform: `rotate(${qiblaBearing}deg)` }}
          >
            <div className="mt-8 flex flex-col items-center">
              <div className="w-10 h-10 bg-emerald-600 rounded-full shadow-xl flex items-center justify-center text-xl z-20 border-2 border-white dark:border-slate-900">
                🕋
              </div>
              <div className="w-1.5 h-28 bg-gradient-to-t from-transparent via-emerald-500 to-emerald-600 rounded-full -mt-2 shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Static Center Point */}
        <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full border-4 border-emerald-600 shadow-md z-30"></div>
      </div>

      {error && (
        <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl flex items-start space-x-3 text-amber-700 dark:text-amber-400">
          <AlertTriangle className="flex-shrink-0" size={18} />
          <p className="text-xs font-bold leading-relaxed">{error}</p>
        </div>
      )}

      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 text-sm font-bold">কিবলার কোণ</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">{Math.round(qiblaBearing)}°</span>
        </div>
        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
        <div className="flex items-start space-x-3 text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <p>কম্পাস কাজ না করলে ফোনটি '8' আকৃতিতে ঘুরিয়ে ক্যালিব্রেট করুন। ওয়েব ব্রাউজারে এটি নির্ভুল নাও হতে পারে।</p>
        </div>
        <button 
          onClick={calibrate}
          className="w-full flex items-center justify-center space-x-2 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 transition-all"
        >
          <RefreshCw size={18} className={isCalibrating ? 'animate-spin' : ''} />
          <span>{isCalibrating ? 'ক্যালিব্রেট হচ্ছে...' : 'ক্যালিব্রেট করুন'}</span>
        </button>
      </div>
    </div>
  );
};

export default QiblaView;
