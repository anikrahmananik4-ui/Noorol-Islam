
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { AudioState } from '../types';

interface GlobalAudioPlayerProps {
  state: AudioState;
  onClose: () => void;
  onStateChange: (state: AudioState) => void;
}

const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({ state, onClose, onStateChange }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Switch to more stable CDN (Al-Alafasy is highly reliable on this network)
  const getAudioUrl = (surah: number, ayahId: number | null, mode: 'SURAH' | 'AYAH') => {
    if (mode === 'SURAH') {
      // Surah-level audio - Islamic Network CDN
      return `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah}.mp3`;
    } else {
      // Ayah-level audio - Islamic Network CDN
      return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahId}.mp3`;
    }
  };

  const playNext = () => {
    if (state.playbackMode === 'AYAH' && state.surah && state.ayahInSurah && state.ayah && state.totalAyahs) {
      if (state.ayahInSurah < state.totalAyahs) {
        onStateChange({ 
          ...state, 
          ayah: state.ayah + 1, 
          ayahInSurah: state.ayahInSurah + 1, 
          playing: true 
        });
      } else {
        onStateChange({ ...state, playing: false });
      }
    } else if (state.playbackMode === 'SURAH' && state.surah) {
      if (state.surah < 114) {
        onStateChange({ ...state, surah: state.surah + 1, ayahInSurah: undefined, playing: true });
      }
    }
  };

  const playPrev = () => {
    if (state.playbackMode === 'AYAH' && state.surah && state.ayahInSurah && state.ayah && state.ayahInSurah > 1) {
      onStateChange({ 
        ...state, 
        ayah: state.ayah - 1, 
        ayahInSurah: state.ayahInSurah - 1, 
        playing: true 
      });
    } else if (state.playbackMode === 'SURAH' && state.surah && state.surah > 1) {
      onStateChange({ ...state, surah: state.surah - 1, ayahInSurah: undefined, playing: true });
    }
  };

  useEffect(() => {
    if (state.surah) {
      setError(null);
      const audioUrl = getAudioUrl(state.surah, state.ayah || null, state.playbackMode);
      
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else {
        if (audioRef.current.src !== audioUrl) {
          audioRef.current.pause();
          audioRef.current.src = audioUrl;
          audioRef.current.load();
        }
      }

      if (state.playing) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio playback error:", e);
            setError("অডিও লোড করা যাচ্ছে না, দয়া করে ইন্টারনেট কানেকশন চেক করুন।");
            onStateChange({ ...state, playing: false });
          });
        }
      } else {
        audioRef.current.pause();
      }

      const updateProgress = () => {
        if (audioRef.current && audioRef.current.duration) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      const handleEnded = () => {
        if (state.playbackMode === 'AYAH') {
          playNext();
        } else {
          onStateChange({ ...state, playing: false });
        }
      };

      const handleError = () => {
        setError("সোর্স পাওয়া যায়নি অথবা প্লে করতে সমস্যা হচ্ছে।");
        onStateChange({ ...state, playing: false });
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);

      return () => {
        audioRef.current?.removeEventListener('timeupdate', updateProgress);
        audioRef.current?.removeEventListener('ended', handleEnded);
        audioRef.current?.removeEventListener('error', handleError);
      };
    }
  }, [state.surah, state.ayah, state.ayahInSurah, state.playing, state.playbackMode]);

  if (!state.surah) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:w-[360px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-4 overflow-hidden">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/20">
            <Volume2 size={24} />
          </div>
          <div className="truncate">
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 truncate">
              {state.surahName}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {state.playbackMode === 'SURAH' ? 'পূর্ণ সূরা (আল-আফাসি)' : `আয়াত: ${state.ayahInSurah} / ${state.totalAyahs}`}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 text-[10px] font-black rounded-xl text-center border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-6 relative">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-center space-x-8">
        <button 
          onClick={playPrev}
          className="p-2 text-slate-400 hover:text-emerald-500 transition-all active:scale-90"
        >
          <SkipBack size={24} />
        </button>
        <button 
          onClick={() => onStateChange({ ...state, playing: !state.playing })}
          className="w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-emerald-600/30 transition-all active:scale-90"
        >
          {state.playing ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button 
          onClick={playNext}
          className="p-2 text-slate-400 hover:text-emerald-500 transition-all active:scale-90"
        >
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default GlobalAudioPlayer;
