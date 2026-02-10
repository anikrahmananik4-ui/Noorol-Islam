
import React, { useState, useEffect } from 'react';
import { View, UserSettings, PrayerTimes, AudioState } from './types';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Quran from './components/Quran';
import Hadith from './components/Hadith';
import PrayerTimesView from './components/PrayerTimes';
import DuaView from './components/Dua';
import QiblaView from './components/Qibla';
import Tasbih from './components/Tasbih';
import Settings from './components/Settings';
import GlobalAudioPlayer from './components/AudioPlayer';
import { fetchPrayerTimes } from './services/api';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [audioState, setAudioState] = useState<AudioState>({
    playing: false,
    surah: null,
    ayah: null,
    surahName: '',
    playbackMode: 'SURAH'
  });

  useEffect(() => {
    const saved = localStorage.getItem('nurul_islam_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (settings) {
      localStorage.setItem('nurul_islam_settings', JSON.stringify(settings));
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings]);

  useEffect(() => {
    if (settings && settings.onboarded) {
      if (!settings.location) {
        const mockLocation = { lat: 23.8103, lng: 90.4125, city: 'ঢাকা, বাংলাদেশ' };
        setSettings(prev => prev ? ({ ...prev, location: mockLocation }) : null);
      } else {
        fetchPrayerTimes(settings.location.lat, settings.location.lng, settings.calculationMethod)
          .then(setPrayerTimes)
          .catch(err => console.error("API Error:", err));
      }
    }
  }, [settings?.onboarded, settings?.calculationMethod, settings?.location]);

  const handleOnboardingComplete = (name: string) => {
    setSettings({
      name,
      language: 'bn',
      calculationMethod: 1,
      location: null,
      onboarded: true,
      darkMode: false
    });
  };

  const handleSettingsUpdate = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleAudioClose = () => {
    setAudioState({ ...audioState, playing: false, surah: null, ayah: null });
  };

  if (isInitializing) return null;

  if (!settings || !settings.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard prayerTimes={prayerTimes} settings={settings} onViewChange={setActiveView} />;
      case View.QURAN:
        return <Quran onPlayAudio={setAudioState} currentAudioState={audioState} />;
      case View.PRAYER:
        return <PrayerTimesView times={prayerTimes} settings={settings} />;
      case View.HADITH:
        return <Hadith />;
      case View.DUA:
        return <DuaView />;
      case View.QIBLA:
        return <QiblaView />;
      case View.TASBIH:
        return <Tasbih />;
      case View.SETTINGS:
        return <Settings settings={settings} onUpdate={handleSettingsUpdate} />;
      default:
        return <Dashboard prayerTimes={prayerTimes} settings={settings} onViewChange={setActiveView} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView} 
      userName={settings.name}
    >
      {renderView()}
      <GlobalAudioPlayer 
        state={audioState} 
        onClose={handleAudioClose} 
        onStateChange={setAudioState} 
      />
    </Layout>
  );
};

export default App;
