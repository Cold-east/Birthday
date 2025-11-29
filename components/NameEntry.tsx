import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';
import { NameEntryProps } from '../types';

export const NameEntry: React.FC<NameEntryProps> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-deep overflow-hidden p-6">
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360
            }}
            animate={{
              y: -50,
              rotate: Math.random() * 360 + 360
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            {i % 2 === 0 ? <Heart fill="currentColor" size={Math.random() * 30 + 20} /> : <Star fill="currentColor" size={Math.random() * 20 + 10} />}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="relative z-10 text-center w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(236,72,153,0.2)]"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Sparkles size={40} className="text-white" />
          </motion.div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-script text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-2">
          Hello there!
        </h1>
        <p className="text-pink-100/80 mb-8 font-medium">Who is the cutie we are celebrating today?</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <div className="relative w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name here..."
              className="w-full px-6 py-4 rounded-2xl bg-black/20 border-2 border-pink-500/30 text-white text-center text-xl placeholder-pink-200/30 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all"
              autoFocus
            />
            <motion.div 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400"
              animate={{ opacity: name ? 1 : 0, scale: name ? 1 : 0.5 }}
            >
              <Heart fill="currentColor" size={20} />
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!name.trim()}
            className="group w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-pink-500/40 transition-all"
          >
            <span>Continue ✨</span> 
            <Heart fill="currentColor" size={20} className="group-hover:animate-ping" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};