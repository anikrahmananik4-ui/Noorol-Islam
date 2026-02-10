
import { PrayerTimes, Surah, Ayah } from '../types';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';
const PRAYER_API_BASE = 'https://api.aladhan.com/v1';
const HADITH_API_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

// Production-ready 12-hour formatter
export const format12Hour = (time: string) => {
  if (!time) return '--:--';
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  } catch (e) {
    return time;
  }
};

export const fetchPrayerTimes = async (lat: number, lng: number, method: number): Promise<PrayerTimes> => {
  const response = await fetch(`${PRAYER_API_BASE}/timings?latitude=${lat}&longitude=${lng}&method=${method}`);
  const data = await response.json();
  if (data.code === 200) {
    const t = data.data.timings;
    return {
      Fajr: format12Hour(t.Fajr),
      Sunrise: format12Hour(t.Sunrise),
      Dhuhr: format12Hour(t.Dhuhr),
      Asr: format12Hour(t.Asr),
      Maghrib: format12Hour(t.Maghrib),
      Isha: format12Hour(t.Isha)
    };
  }
  throw new Error('Prayer API failure');
};

export const fetchSurahs = async (): Promise<Surah[]> => {
  const response = await fetch(`${QURAN_API_BASE}/surah`);
  const data = await response.json();
  return data.data;
};

export const fetchSurahDetail = async (surahNumber: number, edition: string = 'quran-uthmani'): Promise<Ayah[]> => {
  const response = await fetch(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`);
  const data = await response.json();
  return data.data.ayahs;
};

export const fetchTranslation = async (surahNumber: number, lang: 'en' | 'bn'): Promise<Ayah[]> => {
  const edition = lang === 'en' ? 'en.sahih' : 'bn.bengali';
  const response = await fetch(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`);
  const data = await response.json();
  return data.data.ayahs;
};

export const fetchHadithsByBook = async (bookSlug: string) => {
  const response = await fetch(`${HADITH_API_BASE}/ben-${bookSlug}.min.json`);
  const data = await response.json();
  return data.hadiths;
};

export const fetchArabicHadithsByBook = async (bookSlug: string) => {
  const response = await fetch(`${HADITH_API_BASE}/ara-${bookSlug}.min.json`);
  const data = await response.json();
  return data.hadiths;
};

export const getHijriDate = async (): Promise<string> => {
  const today = new Date();
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const response = await fetch(`${PRAYER_API_BASE}/gToH?date=${dateStr}`);
  const data = await response.json();
  const hijri = data.data.hijri;
  return `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
};

export const fetchRandomDua = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const duas = [
        {
          id: '1',
          category: 'দৈনন্দিন',
          title: 'বিপদ থেকে মুক্তির দোয়া',
          arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
          translation: 'আপনি ছাড়া কোনো ইলাহ নেই, আপনি পবিত্র। নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।',
          reference: 'সুরা আল-আম্বিয়া, ৮৭'
        }
      ];
      resolve(duas[0]);
    }, 500);
  });
};
