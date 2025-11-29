import React, { useState, useEffect } from 'react';
import { AppStage } from './types';
import { NameEntry } from './components/NameEntry';
import { Intro } from './components/Intro';
import { CameraStage } from './components/CameraStage';
import { Celebration } from './components/Celebration';
import { CreatorSetup } from './components/CreatorSetup';
import { initDB, saveMedia, getMedia } from './utils/db';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage | null>(null);
  const [name, setName] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Custom Media State
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [collageUrls, setCollageUrls] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    // Service Worker Prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Initialize DB and Check for Config
    const loadConfig = async () => {
      try {
        await initDB();
        const storedVideo = await getMedia('video');
        const storedAudio = await getMedia('audio');
        const storedCollage = await getMedia('collage');

        if (storedVideo && !Array.isArray(storedVideo)) {
          setVideoUrl(URL.createObjectURL(storedVideo));
          
          if (storedAudio && !Array.isArray(storedAudio)) {
            setAudioUrl(URL.createObjectURL(storedAudio));
          }

          if (storedCollage && Array.isArray(storedCollage)) {
            const urls = storedCollage.map(blob => URL.createObjectURL(blob));
            setCollageUrls(urls);
          }

          setStage(AppStage.NAME_INPUT);
        } else {
          setStage(AppStage.CREATOR_SETUP);
        }
      } catch (e) {
        console.error("Failed to load DB", e);
        // Fallback or error state
        setStage(AppStage.CREATOR_SETUP);
      }
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

  const handleCreatorComplete = async (videoBlob: Blob, audioBlob: Blob | null, collageBlobs: Blob[]) => {
    try {
      await saveMedia('video', videoBlob);
      setVideoUrl(URL.createObjectURL(videoBlob));
      
      if (audioBlob) {
        await saveMedia('audio', audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
      }

      if (collageBlobs.length > 0) {
        await saveMedia('collage', collageBlobs);
        const urls = collageBlobs.map(blob => URL.createObjectURL(blob));
        setCollageUrls(urls);
      }

      setStage(AppStage.NAME_INPUT);
    } catch (e) {
      console.error("Failed to save media", e);
      alert("Failed to save media. Storage might be full.");
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
      {stage === AppStage.CREATOR_SETUP && (
        <CreatorSetup onComplete={handleCreatorComplete} />
      )}
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