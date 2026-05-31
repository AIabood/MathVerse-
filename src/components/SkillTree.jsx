import React from 'react';
import { motion } from 'framer-motion';

export default function SkillTree({ building, onBack, onStartLevel }) {
  // Define levels based on building title
  const levels = [
    { id: 1, title: 'Basics & Foundations', status: 'unlocked', icon: '🟢' },
    { id: 2, title: 'Intermediate Concepts', status: 'locked', icon: '🔒' },
    { id: 3, title: 'Advanced Applications', status: 'locked', icon: '🔒' },
    { id: 4, title: 'Master Challenge', status: 'locked', icon: '🏆' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(12px)',
        zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ color: building.color, fontSize: '3.5rem', margin: '0 0 10px 0', textShadow: `0 0 20px ${building.color}80` }}>
          {building.title}
        </h1>
        <p style={{ color: '#a0a0b0', fontSize: '1.2rem', marginBottom: '3rem', letterSpacing: '2px' }}>LEARNING PATH</p>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          {/* Vertical connecting line */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: 'rgba(255,255,255,0.1)', transform: 'translateX(-50%)', zIndex: 0 }}></div>

          {levels.map((level) => {
            const isUnlocked = level.status === 'unlocked';
            return (
              <motion.div 
                key={level.id}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                style={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  background: isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isUnlocked ? building.color : 'rgba(255,255,255,0.1)'}`,
                  padding: '1.5rem 2.5rem', borderRadius: '20px', width: '100%', maxWidth: '500px',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  boxShadow: isUnlocked ? `0 10px 30px ${building.color}40` : 'none',
                  opacity: isUnlocked ? 1 : 0.6
                }}
              >
                <div style={{ fontSize: '2rem' }}>{level.icon}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>Level {level.id}</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#a0a0b0' }}>{level.title}</p>
                </div>
                {isUnlocked && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(onStartLevel) onStartLevel(level);
                    }}
                    style={{ 
                      background: building.color, color: '#fff', padding: '10px 24px', 
                      borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                      fontSize: '1rem', boxShadow: `0 4px 15px ${building.color}60`,
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    START
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <button 
          onClick={onBack}
          style={{
            marginTop: '3rem', background: 'transparent', border: '2px solid rgba(255,255,255,0.2)',
            color: '#fff', padding: '12px 30px', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Back to City
        </button>
      </div>
    </motion.div>
  );
}
