import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-white overflow-hidden"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%", opacity: 0.5 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="w-1/2 h-full flex flex-col justify-center pl-20 z-10">
        <motion.h2 
          className="text-[5vw] font-black text-gradient-dark leading-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Find Anything<br/>With AI
        </motion.h2>
        
        <div className="space-y-6">
          <motion.div 
            className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl w-[80%]"
            initial={{ x: -30, opacity: 0 }}
            animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <p className="text-xl text-gray-700 font-medium">"I need a plumber right now"</p>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4 bg-[var(--color-primary)]/10 p-4 rounded-2xl w-[90%] ml-auto"
            initial={{ x: 30, opacity: 0 }}
            animate={phase >= 2 ? { x: 0, opacity: 1 } : { x: 30, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
             <p className="text-xl text-[var(--color-primary)] font-medium">Found 3 plumbers nearby. Book one?</p>
          </motion.div>
        </div>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center relative">
        <motion.div 
          className="w-[28vw] h-[55vw] bg-gray-100 rounded-[3rem] border-8 border-gray-800 shadow-2xl relative overflow-hidden"
          initial={{ y: 100, opacity: 0, rotateZ: 5 }}
          animate={{ y: 0, opacity: 1, rotateZ: -2 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
        >
           {/* Phone screen content placeholder */}
           <div className="absolute top-0 w-full h-16 bg-gray-800 rounded-b-3xl"></div>
           <div className="p-6 pt-24 space-y-4">
              <div className="w-3/4 h-12 bg-gray-200 rounded-2xl"></div>
              <div className="w-full h-32 bg-[var(--color-primary)]/20 rounded-2xl"></div>
              <div className="w-5/6 h-24 bg-gray-200 rounded-2xl"></div>
           </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
