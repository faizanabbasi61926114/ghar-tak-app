import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-dark)] overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="w-1/2 h-full flex flex-col justify-center pl-20 relative z-10">
        <motion.h2 
          className="text-[5vw] font-black text-white leading-tight mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Book Expert<br/>Services
        </motion.h2>
        <motion.p
          className="text-[2vw] text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Plumbers, Cleaners, Electricians
        </motion.p>
      </div>

      <div className="w-1/2 h-full relative flex items-center justify-center">
        {/* Service grid */}
        <div className="grid grid-cols-2 gap-6 p-10">
          {[
            { icon: "🔧", name: "Plumbing", color: "bg-blue-500" },
            { icon: "🧹", name: "Cleaning", color: "bg-teal-500" },
            { icon: "⚡", name: "Electrical", color: "bg-yellow-500" },
            { icon: "🔨", name: "Repair", color: "bg-purple-500" },
          ].map((service, i) => (
            <motion.div
              key={i}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl flex flex-col items-center justify-center border border-white/5"
              initial={{ scale: 0, opacity: 0 }}
              animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 15, delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-20 h-20 ${service.color} rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                {service.icon}
              </div>
              <p className="text-white text-xl font-medium">{service.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative circles */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-[var(--color-primary)] rounded-full blur-[100px] opacity-30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </motion.div>
  );
}
