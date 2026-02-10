
import React, { useState, useEffect } from 'react';
import { fetchSurahs, fetchSurahDetail, fetchTranslation } from '../services/api';
import { Surah, Ayah, AudioState } from '../types';
import { Search, ArrowLeft, Play, Pause, BookOpen, Volume2 } from 'lucide-react';

interface QuranProps {
  onPlayAudio: (state: AudioState) => void;
  currentAudioState: AudioState;
}

const Quran: React.FC<QuranProps> = ({ onPlayAudio, currentAudioState }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [translations, setTranslations] = useState<Ayah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSurahs().then(setSurahs);
  }, []);

  const handleSurahClick = async (surah: Surah) => {
    setLoading(true);
    setSelectedSurah(surah);
    
    // Save last read to local storage for Dashboard
    localStorage.setItem('nurul_islam_last_read', JSON.stringify({
      number: surah.number,
      name: surah.englishName
    }));

    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const [ayahData, transData] = await Promise.all([
        fetchSurahDetail(surah.number),
        fetchTranslation(surah.number, 'bn')
      ]);
      setAyahs(ayahData);
      setTranslations(transData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const playSurah = () => {
    if (!selectedSurah) return;
    
    const isPlayingThisSurah = currentAudioState.surah === selectedSurah.number && 
                               currentAudioState.playbackMode === 'SURAH' && 
                               currentAudioState.playing;

    onPlayAudio({
      playing: !isPlayingThisSurah,
      surah: selectedSurah.number,
      ayah: null,
      ayahInSurah: undefined,
      surahName: selectedSurah.englishName,
      totalAyahs: selectedSurah.numberOfAyahs,
      playbackMode: 'SURAH'
    });
  };

  const playAyah = (globalAyahNum: number, ayahNumInSurah: number) => {
    if (!selectedSurah) return;
    
    const isPlayingThisAyah = currentAudioState.surah === selectedSurah.number && 
                              currentAudioState.ayahInSurah === ayahNumInSurah && 
                              currentAudioState.playbackMode === 'AYAH' &&
                              currentAudioState.playing;

    onPlayAudio({
      playing: !isPlayingThisAyah,
      surah: selectedSurah.number,
      ayah: globalAyahNum,
      ayahInSurah: ayahNumInSurah,
      surahName: selectedSurah.englishName,
      totalAyahs: selectedSurah.numberOfAyahs,
      playbackMode: 'AYAH'
    });
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.number.toString().includes(searchQuery)
  );

  if (selectedSurah) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        {/* Detail Header - Sticky at Header bottom */}
        <div className="sticky top-[60px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl z-30 border-b border-slate-200/50 dark:border-slate-800/50 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto py-3">
            <div className="flex items-center space-x-3 overflow-hidden">
              <button 
                onClick={() => setSelectedSurah(null)}
                className="p-2.5 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl shadow-sm text-emerald-600 dark:text-emerald-400 transition-all active:scale-90 border border-slate-100 dark:border-slate-700 shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="truncate">
                <h2 className="text-lg font-black text-slate-800 dark:text-white truncate">{selectedSurah.englishName}</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase truncate">{selectedSurah.name} • {selectedSurah.numberOfAyahs} আয়াত</p>
              </div>
            </div>
            
            <button 
              onClick={playSurah}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-black transition-all shadow-sm shrink-0 ${
                currentAudioState.surah === selectedSurah.number && currentAudioState.playbackMode === 'SURAH' && currentAudioState.playing
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-700 hover:bg-emerald-50'
              }`}
            >
              <Volume2 size={18} />
              <span className="text-xs hidden sm:inline">পূর্ণ সূরা</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="text-slate-400 font-bold">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="space-y-4 px-1">
            {ayahs.map((ayah, idx) => (
              <div key={ayah.number} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xs border border-emerald-100 dark:border-emerald-800/30">
                      {ayah.numberInSurah}
                    </div>
                    <button 
                      onClick={() => playAyah(ayah.number, ayah.numberInSurah)}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${
                        currentAudioState.surah === selectedSurah.number && currentAudioState.ayahInSurah === ayah.numberInSurah && currentAudioState.playbackMode === 'AYAH' && currentAudioState.playing
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                      }`}
                    >
                      {currentAudioState.surah === selectedSurah.number && currentAudioState.ayahInSurah === ayah.numberInSurah && currentAudioState.playbackMode === 'AYAH' && currentAudioState.playing
                        ? <Pause size={18} /> 
                        : <Play size={18} />}
                    </button>
                  </div>
                </div>
                <div className="text-right mb-6">
                  <p className="quran-arabic text-3xl leading-[2.8] text-slate-800 dark:text-slate-100 tracking-wide font-arabic select-none">
                    {ayah.text}
                  </p>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-6 font-medium">
                  {translations[idx]?.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header - Sticky at Header bottom */}
      <div className="sticky top-[60px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl py-3 z-30 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="relative max-w-4xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="সূরার নাম বা নাম্বার লিখুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm text-slate-800 dark:text-slate-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => handleSurahClick(surah)}
            className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xl transition-all text-left group overflow-hidden relative"
          >
            <div className="flex items-center space-x-4 z-10">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black rotate-12 group-hover:rotate-0 transition-transform">
                <span className="-rotate-12 group-hover:rotate-0 transition-transform">{surah.number}</span>
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{surah.englishName}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">{surah.revelationType} • {surah.numberOfAyahs} আয়াত</p>
              </div>
            </div>
            <div className="text-right z-10">
              <p className="quran-arabic text-xl text-slate-400 dark:text-slate-600 font-arabic">{surah.name}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 dark:text-white transition-transform group-hover:scale-110">
              <BookOpen size={100} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quran;
