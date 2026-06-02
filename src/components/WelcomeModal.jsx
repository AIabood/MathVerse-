import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeModal({ onCreateProfile, onGuest }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(112, 0, 255, 0.15) 0%, rgba(5, 5, 16, 0.9) 70%)',
        backdropFilter: 'blur(15px)',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      {/* Decorative floating elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['0%', '-30%', '0%'],
            x: i % 2 === 0 ? ['0%', '15%', '0%'] : ['0%', '-15%', '0%'],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: `${20 + i * 15}px`,
            height: `${20 + i * 15}px`,
            border: `1px solid rgba(0, 240, 255, ${0.05 + i * 0.02})`,
            borderRadius: i % 2 === 0 ? '50%' : '15%',
            top: `${15 + i * 12}%`,
            left: `${10 + i * 15}%`,
            zIndex: 1
          }}
        />
      ))}

      <motion.div 
        className="glass-panel" 
        initial={{ y: 50, scale: 0.9, rotateX: 15 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.02, boxShadow: '0 20px 50px 0 rgba(0, 240, 255, 0.2)' }}
        style={{
          position: 'relative',
          padding: '4rem 3rem',
          textAlign: 'center',
          maxWidth: '480px',
          width: '90%',
          zIndex: 2,
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          background: 'linear-gradient(145deg, rgba(10, 10, 30, 0.8) 0%, rgba(5, 5, 15, 0.95) 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0, 240, 255, 0.05)'
        }}
      >
        {/* Animated top glow */}
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
            background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)'
          }}
        />

        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: '90px', height: '90px', margin: '0 auto 2.5rem auto',
            background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
            borderRadius: '24px',
            transform: 'rotate(45deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(112, 0, 255, 0.6), inset 0 0 10px rgba(255,255,255,0.5)'
          }}
        >
          <div style={{ transform: 'rotate(-45deg)' }}>
            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            fontSize: '3rem', 
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #ffffff, #b0b0d0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            letterSpacing: '3px',
            textShadow: '0 0 20px rgba(255,255,255,0.1)'
          }}
        >
          MATHVERSE
        </motion.h2>
        
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ 
            fontSize: '1.1rem', 
            color: '#00f0ff', 
            marginBottom: '3.5rem',
            fontWeight: 500,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            opacity: 0.9
          }}
        >
          Future Academy
        </motion.h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <motion.button 
            className="glowing-button" 
            onClick={onCreateProfile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '16px 24px'
            }}
          >
            Start Journey
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.button>
          
          <motion.button 
            className="glowing-button outline" 
            onClick={onGuest}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ 
              borderColor: 'rgba(0, 240, 255, 0.3)', 
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              padding: '16px 24px',
              backdropFilter: 'blur(5px)'
            }}
          >
            Explore as Guest
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
