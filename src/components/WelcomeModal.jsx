import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WelcomeModal({ onCreateProfile, onGuest }) {
  const [startHov, setStartHov] = useState(false);
  const [guestHov, setGuestHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(to right, rgba(10, 10, 25, 0.6) 0%, rgba(10, 10, 25, 0.25) 50%, rgba(10, 10, 25, 0) 100%)',
        zIndex: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 4rem',
        color: '#ffffff',
        fontFamily: "'Outfit', 'Tajawal', sans-serif"
      }}
    >
      {/* ================= HEADER ================= */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 12 }}>
        {/* Logo and Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '28px', height: '28px' }}>
            <div style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: '#e85d75', top: 0, left: 0 }} />
            <div style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: '#6c5ce7', bottom: 0, right: 0, opacity: 0.85, mixBlendMode: 'multiply' }} />
          </div>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            letterSpacing: '1px',
            color: '#ffffff',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            MATH<span style={{ color: '#a29bfe' }}>VERSE</span>
          </span>
        </div>


      </header>

      {/* ================= MAIN CONTENT (Left Aligned) ================= */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.5rem', maxWidth: '560px', zIndex: 12, margin: 'auto 0' }}>
        


        {/* Floating Large Title */}
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 300,
          lineHeight: '1.1',
          color: '#ffffff',
          fontFamily: "'Inter', 'Tajawal', sans-serif",
          textShadow: '0 2px 15px rgba(0,0,0,0.25)',
          textAlign: 'left',
          letterSpacing: '-1.5px'
        }}>
          Future Academy
        </h1>

        {/* Sub-description */}
        <p style={{
          fontSize: '1.15rem',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: '1.65',
          maxWidth: '520px',
          fontFamily: "'Inter', 'Tajawal', sans-serif",
          fontWeight: 300,
          textShadow: '0 1px 8px rgba(0,0,0,0.2)',
          textAlign: 'left'
        }}>
          Enter a thriving 3D city filled with interactive learning experiences. Master mathematics through engaging quests and unlock your full potential in the Future Academy.
        </p>

        {/* Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '1.5rem' }}>
          <motion.button
            onClick={onCreateProfile}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setStartHov(true)}
            onMouseLeave={() => setStartHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              background: startHov ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: startHov ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '30px',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          >
            <span>Start Journey</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.button>

          <motion.button
            onClick={onGuest}
            whileTap={{ scale: 0.96 }}
            onMouseEnter={() => setGuestHov(true)}
            onMouseLeave={() => setGuestHov(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              color: guestHov ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontSize: '0.92rem',
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Explore as Guest</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: guestHov ? 1 : 0.75 }}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </motion.button>
        </div>

      </div>


    </motion.div>
  );
}
