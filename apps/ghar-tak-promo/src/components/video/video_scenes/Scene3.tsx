import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.div
        className="absolute top-20 text-center z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-[5vw] font-black text-gray-900 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
          Shop Local Stores
        </h2>
        <p className="text-[2vw] text-gray-500 mt-2 font-medium">Groceries, Electronics, Medicine & More</p>
      </motion.div>

      <div className="relative w-full h-full flex items-center justify-center mt-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-white p-6 rounded-3xl shadow-xl w-[25vw]"
            initial={{ y: 200, opacity: 0, scale: 0.8 }}
            animate={phase >= 1 ? { 
              y: 0, 
              opacity: 1, 
              scale: i === 1 ? 1.1 : 0.9,
              x: i === 0 ? '-30vw' : i === 2 ? '30vw' : 0,
              rotateZ: i === 0 ? -10 : i === 2 ? 10 : 0,
              zIndex: i === 1 ? 10 : 1
            } : { y: 200, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }}
          >
            <div className="w-full h-32 bg-gray-100 rounded-xl mb-4"></div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            
            <motion.div 
              className="mt-6 bg-[var(--color-primary)] text-white text-center py-3 rounded-xl font-bold"
              animate={phase >= 2 && i === 1 ? { scale: [1, 1.05, 1], backgroundColor: ["var(--color-primary)", "var(--color-secondary)", "var(--color-primary)"] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Order Now
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
