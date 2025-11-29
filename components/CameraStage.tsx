import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, Check, X } from 'lucide-react';

interface CameraStageProps {
  onCapture: (image: string) => void;
  onSkip: () => void;
}

export const CameraStage: React.FC<CameraStageProps> = ({ onCapture, onSkip }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPermissionError(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermissionError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Square crop logic
        const video = videoRef.current;
        const size = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        canvasRef.current.width = size;
        canvasRef.current.height = size;

        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
        // Stop stream to save battery/resources
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Let's put you on the cake!
      </h2>

      <div className="relative w-full max-w-md aspect-square rounded-full overflow-hidden border-4 border-gold shadow-2xl bg-gray-900 mb-8">
        {!capturedImage ? (
          <>
            {permissionError ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-gray-400 mb-4">Camera access denied or unavailable.</p>
                <button onClick={onSkip} className="text-gold underline">
                  Continue without photo
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        )}
        
        {/* Helper Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4">
        {!capturedImage ? (
          <>
            {!permissionError && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
              >
                <div className="w-14 h-14 rounded-full border-2 border-black" />
              </motion.button>
            )}
             {permissionError && (
                 <button onClick={onSkip} className="bg-gray-800 px-6 py-2 rounded-full">Skip</button>
             )}
          </>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRetake}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full text-white font-semibold"
            >
              <RefreshCw size={20} /> Retake
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-full font-bold shadow-[0_0_20px_rgba(255,215,0,0.5)]"
            >
              <Check size={20} /> Confirm
            </motion.button>
          </>
        )}
      </div>
      
      {!capturedImage && !permissionError && (
          <button onClick={onSkip} className="mt-8 text-gray-500 text-sm hover:text-white transition-colors">
              Skip photo
          </button>
      )}
    </div>
  );
};