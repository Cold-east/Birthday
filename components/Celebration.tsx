import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { launchFireworks, shootConfetti } from '../utils/confetti';
import { Play, X, Wind, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { CelebrationProps } from '../types';

const COMPLIMENTS = [
  "I love you in every form... even when you decide to grow a beard! You're still the cutest though. 😂❤️",
  "Every moment with you is a precious memory I want to hold onto forever. You make life beautiful.",
  "You possess a beauty that radiates from within, touching everyone around you with grace.",
  "I fall in love with you all over again, every single day. You are my everything.",
  "Your kindness, strength, and love inspire me to be a better person. I adore you.",
  "Here's to you, my love, and to all the beautiful moments yet to come. Happy Birthday."
];

export const Celebration: React.FC<CelebrationProps> = ({ photoDataUrl, videoUrl, audioUrl, collageUrls, name }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [micAllowed, setMicAllowed] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Background Audio Management
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.loop = true;
      audio.volume = 0.4;
      backgroundAudioRef.current = audio;
      
      const playAudio = async () => {
        try {
          await audio.play();
          setIsAudioPlaying(true);
        } catch (e) {
          console.log("Autoplay blocked, waiting for interaction", e);
          setIsAudioPlaying(false);
        }
      };
      playAudio();

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl]);

  // Slideshow Logic
  useEffect(() => {
    if (collageUrls && collageUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % collageUrls.length);
      }, 6000); // Change slide every 6 seconds
      return () => clearInterval(interval);
    }
  }, [collageUrls]);

  // Toggle audio manually
  const toggleAudio = () => {
    if (backgroundAudioRef.current) {
      if (isAudioPlaying) {
        backgroundAudioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        backgroundAudioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  // Initial Fireworks & Mic Setup
  useEffect(() => {
    launchFireworks();
    
    const setupMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicAllowed(true);
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        detectBlow();
      } catch (err) {
        console.log("Microphone access denied or error:", err);
      }
    };

    setupMic();

    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
      if (sourceRef.current) sourceRef.current.disconnect();
    };
  }, []);

  const detectBlow = () => {
    if (!analyserRef.current || !candlesLit) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;

    if (average > 40) { 
        extinguishCandles();
    } else {
        requestAnimationFrame(detectBlow);
    }
  };

  const extinguishCandles = () => {
      if (!candlesLit) return;
      setCandlesLit(false);
      shootConfetti();
      launchFireworks();
  };

  return (
    <div className="h-screen w-full bg-black overflow-y-auto overflow-x-hidden relative scroll-smooth">
      
      {/* Fixed Background Slideshow */}
      {collageUrls && collageUrls.length > 0 && (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">
          <AnimatePresence>
            <motion.img 
              key={currentSlideIndex}
              src={collageUrls[currentSlideIndex]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              alt="memory" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        </div>
      )}

      {/* Audio Control */}
      {audioUrl && (
        <button 
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
        >
          {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {/* --- SECTION 1: THE CAKE --- */}
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4">
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                scale: Math.random() * 0.5 + 0.5,
                backgroundColor: ['#FFD700', '#FF69B4', '#00FFFF'][Math.floor(Math.random() * 3)],
              }}
              animate={{
                y: -100,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
              style={{
                width: Math.random() * 50 + 20,
                height: Math.random() * 50 + 20,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 flex flex-col items-center w-full max-w-4xl"
        >
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-script text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-4 text-center px-4 leading-tight"
          >
            Happy Birthday<br/>{name}!
          </motion.h1>

          <p className="text-white mb-8 h-6 text-center px-4 drop-shadow-md font-medium text-lg">
              {candlesLit && (micAllowed ? "Blow into the mic to make a wish!" : "Tap the cake to make a wish!")}
          </p>

          {/* The Cake */}
          <div className="relative mt-8 transform scale-75 md:scale-100 cursor-pointer" onClick={extinguishCandles}>
            <motion.div 
              className="flex flex-col items-center relative"
              initial={{ y: -500, opacity: 0 }}
              animate={{ y: 0, opacity: 1, translateY: [0, -10, 0] }}
              transition={{ 
                  y: { type: "spring", stiffness: 100, damping: 15 },
                  opacity: { duration: 0.5 },
                  translateY: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              {/* Candles */}
              <div className="absolute -top-16 flex gap-4 z-10">
                  {[1, 2, 3].map((k) => (
                      <motion.div 
                          key={k} 
                          className="flex flex-col items-center relative top-4"
                          animate={{ rotate: [-2, 2, -2] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: k * 0.3 }}
                      >
                           <AnimatePresence>
                               {candlesLit && (
                                  <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1, opacity: 0.9 }}
                                      exit={{ scale: 0, opacity: 0, y: -20 }}
                                      className="w-4 h-6 bg-orange-400 rounded-full blur-[1px] candle-flame shadow-[0_0_10px_orange]"
                                  >
                                      <div className="absolute inset-0 bg-yellow-200 rounded-full blur-[2px] scale-50 animate-pulse" />
                                  </motion.div>
                               )}
                           </AnimatePresence>
                           <AnimatePresence>
                               {!candlesLit && (
                                   <motion.div
                                      initial={{ opacity: 0, y: 0 }}
                                      animate={{ opacity: [0.5, 0], y: -40, x: (k % 2 === 0 ? 10 : -10) }}
                                      transition={{ duration: 1.5 }}
                                      className="absolute -top-4 text-gray-400"
                                   >
                                       <Wind size={24} />
                                   </motion.div>
                               )}
                           </AnimatePresence>
                           <div className="w-1 h-3 bg-black/50" />
                           <div className="w-3 h-12 bg-gradient-to-r from-red-200 to-pink-200 rounded-sm" />
                      </motion.div>
                  ))}
              </div>

              {/* Photo Topper */}
              {photoDataUrl && (
                  <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, y: [0, -5, 0] }}
                      transition={{ 
                          scale: { type: "spring", bounce: 0.5, delay: 0.8 },
                          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="absolute -top-32 z-20"
                  >
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] overflow-hidden bg-white relative">
                          <img src={photoDataUrl} alt="Birthday Person" className="w-full h-full object-cover" />
                      </div>
                      
                      {/* CROWN - Centered */}
                      <motion.div 
                          className="absolute -top-14 left-1/2 -translate-x-1/2 text-5xl filter drop-shadow-lg z-30"
                          style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: [0, 5, 0, -5, 0] }}
                          transition={{ 
                              scale: { type: "spring", stiffness: 260, damping: 20, delay: 1.2 },
                              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                          }}
                      >
                          👑
                      </motion.div>
                  </motion.div>
              )}

              {/* Cake Layers */}
              <motion.div 
                  className="w-48 h-24 bg-pink-400 rounded-t-full relative shadow-inner z-10"
                  animate={{ scaleX: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                   <div className="absolute top-0 w-full h-8 bg-white/30 rounded-full skew-y-0" />
                   <div className="absolute -bottom-2 w-full flex justify-between px-2">
                       {[...Array(6)].map((_, i) => (
                           <div key={i} className="w-6 h-8 bg-pink-400 rounded-full" />
                       ))}
                   </div>
              </motion.div>
              <motion.div 
                  className="w-64 h-28 bg-purple-500 rounded-t-2xl -mt-4 relative shadow-lg z-0"
                  animate={{ scaleX: [1, 1.01, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                  <div className="absolute top-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 rounded-t-2xl" />
                  <div className="w-full h-full flex items-center justify-around">
                       <motion.div animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }} transition={{duration: 2, repeat: Infinity}} className="w-4 h-4 rounded-full bg-yellow-300 shadow-[0_0_5px_yellow]" />
                       <motion.div animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }} transition={{duration: 2, repeat: Infinity, delay: 0.5}} className="w-4 h-4 rounded-full bg-blue-300 shadow-[0_0_5px_blue]" />
                       <motion.div animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }} transition={{duration: 2, repeat: Infinity, delay: 1}} className="w-4 h-4 rounded-full bg-green-300 shadow-[0_0_5px_green]" />
                  </div>
              </motion.div>
              <motion.div 
                  className="w-80 h-32 bg-indigo-600 rounded-t-3xl -mt-4 relative shadow-2xl"
                  animate={{ scaleX: [1, 1.005, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                   <div className="w-full h-4 bg-indigo-800/30 absolute top-10" />
              </motion.div>
              <div className="w-96 h-8 bg-gray-200 rounded-[50%] -mt-4 shadow-xl border-b-4 border-gray-300" />
            </motion.div>
          </div>

          <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-12 text-center text-xl text-purple-200 max-w-lg px-6 font-light drop-shadow-md"
          >
              Wishing you a day filled with happiness and a year filled with joy.
          </motion.p>
          
          <AnimatePresence>
              {!candlesLit && videoUrl && (
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-8 mb-8"
                  >
                      <button 
                          onClick={() => {
                              if (backgroundAudioRef.current) backgroundAudioRef.current.pause();
                              setIsAudioPlaying(false);
                              setShowVideo(true);
                          }}
                          className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:scale-105"
                      >
                          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black">
                              <Play fill="currentColor" size={20} className="ml-1" />
                          </div>
                          Watch Birthday Memory
                      </button>
                  </motion.div>
              )}
          </AnimatePresence>

          {collageUrls && collageUrls.length > 0 && (
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce"
             >
               <span className="text-sm uppercase tracking-widest">Scroll Down</span>
               <ChevronDown size={24} />
             </motion.div>
          )}
        </motion.div>
      </div>

      {/* --- SECTION 2: MEMORY LANE --- */}
      {collageUrls && collageUrls.length > 0 && (
        <div className="relative z-10 w-full pb-32">
          <div className="flex flex-col gap-32 md:gap-48 px-6 max-w-6xl mx-auto pt-20">
            {collageUrls.map((url, index) => (
              <MemoryItem 
                key={index} 
                url={url} 
                index={index} 
                text={COMPLIMENTS[index] || "You are amazing."} 
              />
            ))}
          </div>
          
          <div className="text-center mt-32 mb-10">
            <h2 className="text-4xl font-script text-gold">I Love You ❤️</h2>
          </div>
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
          {showVideo && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              >
                  <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center">
                      <button 
                        onClick={() => {
                            setShowVideo(false);
                            if (backgroundAudioRef.current) {
                                backgroundAudioRef.current.play().catch(() => {});
                                setIsAudioPlaying(true);
                            }
                        }}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
                      >
                          <X size={24} />
                      </button>
                      <div className="w-full h-auto max-h-[80vh]">
                          <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            className="w-full h-full object-contain"
                          >
                              Your browser does not support the video tag.
                          </video>
                      </div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for Memory Item
const MemoryItem: React.FC<{ url: string; index: number; text: string }> = ({ url, index, text }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col md:items-center gap-8 md:gap-16 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Text Section - Always first on mobile as requested, swaps on desktop */}
      <div className="flex-1 text-center md:text-left">
        <div className={`p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] transform transition-transform hover:scale-105 duration-300 ${isEven ? 'md:mr-8' : 'md:ml-8'}`}>
          <p className="text-2xl md:text-3xl font-script text-gold-light leading-relaxed">
            "{text}"
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1">
        <div className="relative group">
          <div className="absolute inset-0 bg-gold rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <img 
            src={url} 
            alt={`Memory ${index + 1}`} 
            className="relative w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl border-2 border-white/10 transform transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </motion.div>
  );
};