import React, { useState, useEffect } from 'react';
import { AppStage } from './types';
import { NameEntry } from './components/NameEntry';
import { Intro } from './components/Intro';
import { CameraStage } from './components/CameraStage';
import { Celebration } from './components/Celebration';
import { Loader2 } from 'lucide-react';

// ==========================================
// 👇 PASTE YOUR LINKS INSIDE THE QUOTES BELOW 👇
// ==========================================

const HARDCODED_MEDIA = {
  // 1. Your Birthday Video URL (must be .mp4 or direct video link)
  videoUrl: "https://res.cloudinary.com/dvbhqaqad/video/upload/v1764408883/lv_0_20251129085500_fuxj6z.mp4", 
  
  // 2. Your Background Music URL (must be .mp3)
  audioUrl: "https://res.cloudinary.com/dvbhqaqad/video/upload/v1764410061/James_Arthur_-_Say_You_Won_t_Let_Go_q5wnkd.mp3",

  // 3. Your 6 Background Photos (must be direct image links)
  collagePhotos: [
    "https://res.cloudinary.com/dvbhqaqad/image/upload/v1764410208/WhatsApp_Image_2025-11-29_at_10.21.15_3_qyaebm.jpg",
    "https://res.cloudinary.com/dvbhqaqad/image/upload/v1764410208/WhatsApp_Image_2025-11-29_at_10.21.41_rarg1k.jpg",
    "https://res.cloudinary.com/dvbhqaqad/image/upload/v1764410208/WhatsApp_Image_2025-11-29_at_10.21.39_zkulnu.jpg",
    "https://res.cloudinary.com/dvbhqaqad/image/upload/v1764410207/WhatsApp_Image_2025-11-29_at_10.21.15_2_ynjyoo.jpg",
    "https://res.cloudinary.com/dvbhqaqad/image/upload/v1764410208/WhatsApp_Image_2025-11-29_at_10.21.18_vw9u5k.jpg",
    "https://res.cloudinary.com/dvbhqaqad/image/upload/v1764410206/WhatsApp_Image_2025-11-29_at_10.21.15_1_xrrys6.jpg"
  ]
};

// ==========================================

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage | null>(null);
  const [name, setName] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // State for media
  const [videoUrl, setVideoUrl] = useState<string>(HARDCODED_MEDIA.videoUrl);
  const [audioUrl, setAudioUrl] = useState<string>(HARDCODED_MEDIA.audioUrl);
  const [collageUrls, setCollageUrls] = useState<string[]>(HARDCODED_MEDIA.collagePhotos);

  useEffect(() => {
    // 1. Service Worker Prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // 2. Load Config - DIRECTLY LOAD HARDCODED MEDIA
    // We skip the DB check and Creator Setup entirely.
    const loadConfig = async () => {
      // Simulate a small loading delay for smooth feel
      setTimeout(() => {
        setStage(AppStage.NAME_INPUT);
      }, 1000);
    };

    loadConfig();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleNameSubmit = (enteredName: string) => {
    setName(enteredName);
    setStage(AppStage.INTRO);
  };

  const handleStart = () => {
    setStage(AppStage.CAMERA_PERMISSION);
  };

  const handleCapture = (photoData: string) => {
    setPhoto(photoData);
    setStage(AppStage.CELEBRATION);
  };

  const handleSkip = () => {
    setStage(AppStage.CELEBRATION);
  };

  if (stage === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gold">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {stage === AppStage.NAME_INPUT && (
        <NameEntry onNameSubmit={handleNameSubmit} />
      )}
      {stage === AppStage.INTRO && (
        <Intro 
          name={name}
          onStart={handleStart} 
          onInstall={deferredPrompt ? handleInstall : undefined} 
        />
      )}
      {stage === AppStage.CAMERA_PERMISSION && (
        <CameraStage onCapture={handleCapture} onSkip={handleSkip} />
      )}
      {stage === AppStage.CELEBRATION && (
        <Celebration 
          name={name}
          photoDataUrl={photo} 
          videoUrl={videoUrl} 
          audioUrl={audioUrl}
          collageUrls={collageUrls}
        />
      )}
    </div>
  );
};

export default App;