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
        background: 'rgba(5, 5, 16, 0.9)',
        zIndex: 10
      }}
    >
      <div className="glass-panel" style={{
        padding: '3rem',
        maxWidth: '500px',
        width: '90%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Grid Background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5, zIndex: -1
        }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ color: '#00f0ff', fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
            Mission Briefing
          </div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>Welcome</h2>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(112, 0, 255, 0.3)', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>NAME:</span>
            <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{userData?.name || 'Guest'}</div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>ROLE:</span>
            <div style={{ fontSize: '1.2rem', color: '#00f0ff', fontWeight: 'bold' }}>Future Math Engineer</div>
          </div>
          
          <div>
            <span style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>MISSION:</span>
            <div style={{ fontSize: '1.1rem', color: '#fff', lineHeight: '1.5', marginTop: '0.5rem' }}>
              Help Future Tech City solve mathematical and technological challenges to power up the core.
            </div>
          </div>
        </div>
        
        <button className="glowing-button" style={{ width: '100%', padding: '16px' }} onClick={onEnter}>
          Enter City
        </button>
      </div>
    </motion.div>
  );
}
