
import React from 'react';
import { 
  Home, 
  BookOpen, 
  Compass, 
  Clock, 
  Heart, 
  Hash, 
  Settings, 
  BookMarked 
} from 'lucide-react';
import { View, HadithBook } from './types';

export const NAV_ITEMS = [
  { id: View.DASHBOARD, label: 'হোম', icon: <Home size={22} /> },
  { id: View.QURAN, label: 'কুরআন', icon: <BookOpen size={22} /> },
  { id: View.PRAYER, label: 'নামাজ', icon: <Clock size={22} /> },
  { id: View.HADITH, label: 'হাদিস', icon: <BookMarked size={22} /> },
  { id: View.DUA, label: 'দোয়া', icon: <Heart size={22} /> },
  { id: View.QIBLA, label: 'কিবলা', icon: <Compass size={22} /> },
  { id: View.TASBIH, label: 'তাসবিহ', icon: <Hash size={22} /> },
  { id: View.SETTINGS, label: 'সেটিংস', icon: <Settings size={22} /> },
];

export const HADITH_BOOKS: HadithBook[] = [
  { id: 'bukhari', slug: 'bukhari', name: 'সহীহ বুখারী', nameArabic: 'صحيح البخاري', totalHadith: 7563 },
  { id: 'muslim', slug: 'muslim', name: 'সহীহ মুসলিম', nameArabic: 'صحيح مسلم', totalHadith: 7453 },
  { id: 'tirmidhi', slug: 'tirmidhi', name: 'জামি আত-তিরমিজি', nameArabic: 'جامع الترمذي', totalHadith: 3956 },
  { id: 'abudawud', slug: 'abudawud', name: 'সুনান আবু দাউদ', nameArabic: 'سنن أبي داود', totalHadith: 5274 },
  { id: 'nasai', slug: 'nasai', name: 'সুনান আন-নাসায়ী', nameArabic: 'سنن النسائي', totalHadith: 5758 },
  { id: 'ibnmajah', slug: 'ibnmajah', name: 'সুনান ইবনে মাজাহ', nameArabic: 'سنن ابن ماجه', totalHadith: 4341 },
];

export const CALCULATION_METHODS = [
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
];

export const STATIC_DUAS = [
  {
    id: '1',
    category: 'সকাল',
    title: 'ঘুম থেকে জাগার দোয়া',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
    translation: 'সকল প্রশংসা আল্লাহর জন্য যিনি আমাদেরকে মৃত্যু (ঘুম) প্রদানের পর পুনরায় জীবিত করলেন এবং তাঁর দিকেই প্রত্যাবর্তন করতে হবে।',
    reference: 'সহীহ বুখারী'
  }
];
