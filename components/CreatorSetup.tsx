import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Video, Check, Image as ImageIcon, X } from 'lucide-react';
import { CreatorSetupProps } from '../types';

export const CreatorSetup: React.FC<CreatorSetupProps> = ({ onComplete }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [collageFiles, setCollageFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setCollageFiles(prev => [...prev, ...newFiles].slice(0, 6)); // Limit to 6
    }
  };

  const removeImage = (index: number) => {
    setCollageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!videoFile) return;
    
    setIsSaving(true);
    // Artificial delay for better UX
    await new Promise(r => setTimeout(r, 800));
    onComplete(videoFile, audioFile, collageFiles);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-deep p-6 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl w-full bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl my-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl font-script text-gold">Creator Studio</h1>
        </div>
        
        <p className="text-gray-300 mb-8 text-sm">
          Upload the media for the birthday celebration below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Upload */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Video size={16} className="text-purple-400" /> Birthday Video (Required)
            </label>
            <label className={`
              flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all h-32
              ${videoFile ? 'border-green-500/50 bg-green-500/10' : 'border-white/20 hover:border-gold/50 hover:bg-white/5'}
            `}>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              {videoFile ? (
                <>
                  <Check size={24} className="text-green-400" />
                  <span className="text-green-100 text-xs truncate w-full text-center">{videoFile.name}</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Choose Video</span>
                </>
              )}
            </label>
          </div>

          {/* Audio Upload */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Music size={16} className="text-pink-400" /> Background Music (Optional)
            </label>
            <label className={`
              flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all h-32
              ${audioFile ? 'border-green-500/50 bg-green-500/10' : 'border-white/20 hover:border-gold/50 hover:bg-white/5'}
            `}>
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
              {audioFile ? (
                <>
                  <Check size={24} className="text-green-400" />
                  <span className="text-green-100 text-xs truncate w-full text-center">{audioFile.name}</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-400 text-sm">Choose Audio</span>
                </>
              )}
            </label>
          </div>

          {/* Collage Upload */}
          <div className="flex flex-col gap-2 text-left md:col-span-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <ImageIcon size={16} className="text-blue-400" /> Background Photos (Max 6)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <label className="flex flex-col items-center justify-center gap-1 p-2 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-gold/50 hover:bg-white/5 aspect-square">
                <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden" />
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-400 text-xs">Add</span>
              </label>
              
              {collageFiles.map((file, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!videoFile || isSaving}
          className={`
            w-full mt-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
            ${!videoFile 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]'}
          `}
        >
          {isSaving ? (
             <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={20} /> Save Configuration
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};