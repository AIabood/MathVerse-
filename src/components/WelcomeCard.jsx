import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeCard({ userData, onEnter }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ type: 'spring', damping: 20 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        zIndex: 10,
        overflow: 'hidden'
      }}
    >

      <div style={{
        padding: '3rem',
        maxWidth: '500px',
        width: '90%',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(108, 92, 231, 0.05)',
        color: '#3a3a50',
        fontFamily: "'Inter', 'Tajawal', sans-serif",
        zIndex: 5
      }}>
        {/* Decorative Grid Background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'linear-gradient(rgba(108, 92, 231, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 92, 231, 0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5, zIndex: -1
        }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ color: '#6c5ce7', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>
            Mission Briefing
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3a3a50', marginTop: '0.5rem' }}>Welcome</h2>
        </div>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(108, 92, 231, 0.2)', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#7c8ba1', fontWeight: 700, fontSize: '0.9rem' }}>NAME:</span>
            <div style={{ fontSize: '1.2rem', color: '#3a3a50', fontWeight: 'bold' }}>{userData?.name || 'Guest'}</div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#7c8ba1', fontWeight: 700, fontSize: '0.9rem' }}>ROLE:</span>
            <div style={{ fontSize: '1.2rem', color: '#6c5ce7', fontWeight: 'bold' }}>Future Math Engineer</div>
          </div>
          
          <div>
            <span style={{ color: '#7c8ba1', fontWeight: 700, fontSize: '0.9rem' }}>MISSION:</span>
            <div style={{ fontSize: '1.1rem', color: '#3a3a50', lineHeight: '1.5', marginTop: '0.5rem' }}>
              Help Future Tech City solve mathematical and technological challenges to power up the core.
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          style={{ 
            width: '100%', 
            padding: '16px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #6c5ce7, #8e7bf3)',
            border: 'none', color: '#ffffff',
            fontSize: '1rem', fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(108, 92, 231, 0.25)',
            fontFamily: 'inherit'
          }}
        >
          Enter City
        </motion.button>
      </div>
    </motion.div>
  );
}
