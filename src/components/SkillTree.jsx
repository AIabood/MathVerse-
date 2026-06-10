import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const ROADMAP_LESSONS = [
  { id: 1, title: 'Variables', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 min' },
  { id: 2, title: 'Expressions', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 min' },
  { id: 3, title: 'Equations', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 min' },
  { id: 4, title: 'Functions', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 min' },
  { id: 5, title: 'Graph Analysis', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 min' },
  { id: 6, title: 'Final Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 min' },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Explorer', icon: '🌍' },
  { id: 2, title: 'Equation Master', icon: '⚡' },
  { id: 3, title: 'Logic Champ', icon: '🧠' },
];

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const glowAnim = {
  animate: {
    boxShadow: ['0 0 10px #00D9FF', '0 0 20px #00FFFF', '0 0 10px #00D9FF'],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function SkillTree({ building, onBack, onStartLevel }) {
  const [hoveredMission, setHoveredMission] = useState(null);

  const primaryColor = '#00D9FF';
  const secondaryColor = '#00FFFF';
  const accentColor = '#8B5CF6';
  const bgColor = '#0A0F1F';

  if (!building) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      background: bgColor,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: '#fff',
      overflow: 'hidden',
      zIndex: 50,
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Dynamic Background Effects */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%',
          backgroundImage: `linear-gradient(rgba(0, 217, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)',
          animation: 'gridMove 20s linear infinite'
        }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 500, height: 500, background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`, filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 600, height: 600, background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`, filter: 'blur(60px)' }} />
        <style>{`
          @keyframes gridMove {
            0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
            100% { transform: perspective(500px) rotateX(60deg) translateY(40px); }
          }
        `}</style>
      </div>

      {/* --- Top Navigation Bar --- */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          height: '70px', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(10, 15, 31, 0.8)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${primaryColor}44`,
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#fff', textShadow: `0 0 10px ${primaryColor}` }}>
            MATH<span style={{ color: primaryColor }}>VERSE</span>
          </h1>
          <div style={{ height: '30px', width: '2px', background: `${primaryColor}44` }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: secondaryColor, fontWeight: 500, letterSpacing: '1px' }}>
            {building.title.toUpperCase()}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem' }}>
            <div><span style={{ color: '#8892b0' }}>Level:</span> <strong style={{ color: '#fff' }}>5 Engineer</strong></div>
            <div><span style={{ color: '#8892b0' }}>XP:</span> <strong style={{ color: primaryColor }}>450</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#8892b0' }}>Progress:</span>
              <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: primaryColor, boxShadow: `0 0 8px ${primaryColor}` }} />
              </div>
              <strong style={{ color: '#fff' }}>45%</strong>
            </div>
          </div>
          
          <button onClick={onBack} style={{
            background: `rgba(0, 217, 255, 0.1)`, border: `1px solid ${primaryColor}`, color: primaryColor,
            padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px',
            textTransform: 'uppercase', transition: 'all 0.2s', boxShadow: `0 0 10px ${primaryColor}44`
          }}
          onMouseOver={e => { e.currentTarget.style.background = primaryColor; e.currentTarget.style.color = '#000'; }}
          onMouseOut={e => { e.currentTarget.style.background = `rgba(0, 217, 255, 0.1)`; e.currentTarget.style.color = primaryColor; }}
          >
            [ Return To City ]
          </button>
        </div>
      </motion.div>

      {/* --- Main Dashboard Content --- */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', zIndex: 10, display: 'flex', gap: '30px' }}>
        
        {/* Left Column (Hero & Roadmap) */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Hero Section */}
          <motion.div variants={itemVar} initial="hidden" animate="show" style={{
            background: 'rgba(10, 15, 31, 0.6)', border: `1px solid ${primaryColor}55`, borderRadius: '16px',
            padding: '40px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)',
            boxShadow: `inset 0 0 40px ${primaryColor}22, 0 8px 32px rgba(0,0,0,0.5)`
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: primaryColor, boxShadow: `0 0 15px ${primaryColor}` }} />
            
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', textShadow: `0 0 10px ${primaryColor}88` }}>
              {building.title}
            </h1>
            <p style={{ color: '#a8b2d1', fontSize: '1.1rem', maxWidth: '600px', margin: '0 0 30px 0', lineHeight: 1.6 }}>
              Master equations, functions, and mathematical thinking in this advanced holographic simulation.
            </p>

            <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
              <div>
                <div style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '5px' }}>Progress</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: primaryColor }}>45%</div>
              </div>
              <div>
                <div style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '5px' }}>Completed Lessons</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>8 <span style={{ color: '#8892b0', fontSize: '1.2rem' }}>/ 20</span></div>
              </div>
              <div>
                <div style={{ color: '#8892b0', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '5px' }}>Current Streak</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f39c12' }}>5 Days 🔥</div>
              </div>
            </div>

            <motion.button 
              variants={glowAnim} animate="animate"
              onClick={() => onStartLevel && onStartLevel(ROADMAP_LESSONS[2])}
              style={{
                background: primaryColor, color: '#000', border: 'none', padding: '15px 40px',
                fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px',
                cursor: 'pointer', borderRadius: '4px', position: 'relative', overflow: 'hidden'
              }}
            >
              [ Continue Learning ]
            </motion.button>
          </motion.div>

          {/* Mission Cards Section */}
          <motion.div variants={containerVar} initial="hidden" animate="show">
            <h3 style={{ color: secondaryColor, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '10px', height: '10px', background: secondaryColor, borderRadius: '50%', boxShadow: `0 0 10px ${secondaryColor}` }} />
              Available Missions
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {ROADMAP_LESSONS.map((lesson) => {
                const isLocked = lesson.status === 'locked';
                const isCurrent = lesson.status === 'current';
                const isCompleted = lesson.status === 'completed';
                
                let cardColor = isLocked ? '#4b5563' : (isCurrent ? primaryColor : '#10b981');
                
                return (
                  <motion.div 
                    key={lesson.id} variants={itemVar}
                    onMouseEnter={() => setHoveredMission(lesson.id)}
                    onMouseLeave={() => setHoveredMission(null)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)', border: `1px solid ${cardColor}55`,
                      borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden',
                      backdropFilter: 'blur(8px)', opacity: isLocked ? 0.6 : 1,
                      transform: hoveredMission === lesson.id && !isLocked ? 'translateY(-5px) scale(1.02)' : 'none',
                      transition: 'all 0.3s ease', cursor: isLocked ? 'not-allowed' : 'pointer',
                      boxShadow: hoveredMission === lesson.id && !isLocked ? `0 10px 30px ${cardColor}33` : 'none'
                    }}
                    onClick={() => !isLocked && onStartLevel && onStartLevel(lesson)}
                  >
                    {isCurrent && <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: `radial-gradient(circle, ${primaryColor}55 0%, transparent 70%)` }} />}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: isLocked ? '#9ca3af' : '#fff' }}>{lesson.title}</h4>
                      {isCompleted && <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>}
                      {isLocked && <span style={{ color: '#9ca3af', fontSize: '1.2rem' }}>🔒</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8892b0' }}>Difficulty:</span>
                        <span style={{ color: lesson.difficulty === 'Easy' ? '#10b981' : (lesson.difficulty === 'Medium' ? '#f59e0b' : '#ef4444') }}>{lesson.difficulty}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8892b0' }}>XP Reward:</span>
                        <span style={{ color: accentColor, fontWeight: 'bold' }}>+{lesson.xp} XP</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8892b0' }}>Duration:</span>
                        <span style={{ color: '#e2e8f0' }}>{lesson.duration}</span>
                      </div>
                    </div>

                    {!isLocked && (
                      <div style={{
                        width: '100%', padding: '10px 0', textAlign: 'center', border: `1px solid ${cardColor}`,
                        color: cardColor, borderRadius: '4px', fontSize: '0.9rem', textTransform: 'uppercase',
                        letterSpacing: '1px', background: isCurrent ? `${cardColor}11` : 'transparent',
                        boxShadow: hoveredMission === lesson.id ? `inset 0 0 10px ${cardColor}44` : 'none',
                        transition: 'all 0.3s'
                      }}>
                        {isCompleted ? '[ Review Mission ]' : '[ Start Mission ]'}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Roadmap, Stats, Challenges) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Daily Challenge */}
          <motion.div variants={itemVar} initial="hidden" animate="show" style={{
            background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(10, 15, 31, 0.8) 100%)`,
            border: `1px solid ${accentColor}88`, borderRadius: '16px', padding: '25px', position: 'relative',
            boxShadow: `0 0 20px ${accentColor}33`, backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: accentColor, margin: '0 0 15px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', justifyContent: 'space-between' }}>
              Daily Challenge <span>⏱ 14:22:05</span>
            </h3>
            <h4 style={{ color: '#fff', fontSize: '1.3rem', margin: '0 0 10px 0' }}>Solve 5 Algebra Problems</h4>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ color: '#8892b0', fontSize: '0.85rem', marginBottom: '5px' }}>Reward:</div>
              <div style={{ color: primaryColor, fontWeight: 'bold', fontSize: '1.1rem' }}>+100 XP</div>
              <div style={{ color: '#f1c40f', fontWeight: 'bold', fontSize: '1.1rem' }}>+25 Coins</div>
            </div>

            <button style={{
              width: '100%', padding: '12px', background: `rgba(139, 92, 246, 0.2)`, border: `1px solid ${accentColor}`,
              color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '4px', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = accentColor; }}
            onMouseOut={e => { e.currentTarget.style.background = `rgba(139, 92, 246, 0.2)`; }}
            >
              [ Start Challenge ]
            </button>
          </motion.div>

          {/* Learning Roadmap (Vertical) */}
          <motion.div variants={itemVar} initial="hidden" animate="show" style={{
            background: 'rgba(10, 15, 31, 0.6)', border: `1px solid #1e293b`, borderRadius: '16px',
            padding: '25px', backdropFilter: 'blur(10px)', flex: 1, display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 25px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Module Roadmap
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '20px' }}>
              {/* Vertical Line */}
              <div style={{ position: 'absolute', left: '26px', top: '20px', bottom: '30px', width: '2px', background: '#1e293b' }} />
              
              {ROADMAP_LESSONS.map((lesson, idx) => {
                const isCompleted = lesson.status === 'completed';
                const isCurrent = lesson.status === 'current';
                const color = isCompleted ? '#10b981' : (isCurrent ? primaryColor : '#4b5563');
                
                return (
                  <div key={lesson.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative', paddingBottom: idx !== ROADMAP_LESSONS.length - 1 ? '30px' : '0' }}>
                    {/* Node Dot */}
                    <div style={{ 
                      width: '14px', height: '14px', borderRadius: '50%', background: isCurrent ? '#000' : color, 
                      border: `3px solid ${color}`, zIndex: 2, marginTop: '5px',
                      boxShadow: isCurrent || isCompleted ? `0 0 15px ${color}` : 'none'
                    }} />
                    
                    <div style={{ opacity: lesson.status === 'locked' ? 0.5 : 1 }}>
                      <div style={{ color: color, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px', fontWeight: 'bold' }}>
                        {isCompleted ? 'COMPLETED' : (isCurrent ? 'IN PROGRESS' : 'LOCKED')}
                      </div>
                      <div style={{ color: '#fff', fontSize: '1.1rem' }}>
                        {lesson.title}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVar} initial="hidden" animate="show" style={{
            background: 'rgba(10, 15, 31, 0.6)', border: `1px solid #1e293b`, borderRadius: '16px',
            padding: '25px', backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: '#fff', margin: '0 0 20px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Achievements
            </h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {ACHIEVEMENTS.map(ach => (
                <div key={ach.id} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '10px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))' }}>{ach.icon}</div>
                  <span style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 'bold' }}>{ach.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}