import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Download, Star } from 'lucide-react';
import { IntroProps } from '../types';

export const Intro: React.FC<IntroProps> = ({ name, onStart, onInstall }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center bg-deep overflow-hidden">
      
      {/* Cute Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-deep" />
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200/10"
            initial={{ top: Math.random() * 100 + "%", left: Math.random() * 100 + "%" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          >
            <Star size={Math.random() * 40 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative z-10 mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-script text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-purple-200 to-indigo-300 drop-shadow-lg leading-tight p-2">
          Happy Birthday,<br/>
          <span className="text-gold-light">{name}!</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 text-pink-100/80 text-lg mb-12 max-w-md font-medium"
      >
        We have a magical little surprise waiting just for you. <br/> Are you ready to see it? ✨
      </motion.p>

      <div className="relative z-10 flex flex-col gap-8 items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStart}
          className="group relative"
        >
          <div className="absolute inset-0 bg-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-3xl shadow-xl border-t border-white/20">
            <Gift size={64} className="text-white drop-shadow-md animate-bounce" />
          </div>
          
          <motion.div 
            className="absolute -right-2 -top-2 bg-white text-pink-600 rounded-full p-2 shadow-lg"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart size={20} fill="currentColor" />
          </motion.div>
          
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-pink-300 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
            Open Me!
          </span>
        </motion.button>

        {onInstall && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onInstall}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm border border-white/10 hover:border-white/30 px-4 py-2 rounded-full"
          >
            <Download size={14} />
            Keep this memory
          </motion.button>
        )}
      </div>
    </div>
  );
};