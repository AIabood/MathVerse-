import React from 'react';
import { motion } from 'framer-motion';

export default function WelcomeModal({ onCreateProfile, onGuest }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5, 5, 16, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}
    >
      <div className="glass-panel" style={{
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{
          width: '80px', height: '80px', margin: '0 auto 1.5rem auto',
          background: 'linear-gradient(45deg, #00f0ff, #7000ff)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h4l3-9 5 18 3-9h5"/>
          </svg>
        </div>
        
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome</h2>
        <h3 style={{ fontSize: '1.5rem', color: '#00f0ff', marginBottom: '2.5rem' }}>Future Engineer</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="glowing-button" onClick={onCreateProfile}>
            Create Profile
          </button>
          <button className="glowing-button outline" onClick={onGuest}>
            Continue as Guest
          </button>
        </div>
      </div>
    </motion.div>
  );
}
