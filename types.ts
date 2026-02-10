
export enum View {
  DASHBOARD = 'DASHBOARD',
  QURAN = 'QURAN',
  HADITH = 'HADITH',
  PRAYER = 'PRAYER',
  DUA = 'DUA',
  QIBLA = 'QIBLA',
  TASBIH = 'TASBIH',
  SETTINGS = 'SETTINGS'
}

export interface UserSettings {
  name: string;
  language: 'bn' | 'en';
  calculationMethod: number;
  location: {
    lat: number;
    lng: number;
    city: string;
  } | null;
  onboarded: boolean;
  darkMode: boolean;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

export interface HadithBook {
  id: string;
  name: string;
  nameArabic: string;
  totalHadith: number;
  slug: string;
}

export interface AudioState {
  playing: boolean;
  surah: number | null;
  ayah: number | null; // Global Ayah ID
  ayahInSurah?: number; // Local number in Surah (e.g., 1 to 7)
  surahName: string;
  totalAyahs?: number;
  playbackMode: 'SURAH' | 'AYAH';
}
