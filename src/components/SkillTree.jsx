import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, BookOpen, Binary, Scale, TrendingUp, Trophy, Triangle, Ruler, 
  RefreshCw, Map, Puzzle, Zap, BrainCircuit, Globe, Cable, Lightbulb, 
  Repeat, Settings, Search, ClipboardList, Dices, Link, Shuffle, Sparkles, User, Box, Cpu, Flame
} from 'lucide-react';

// Dynamic lesson icon component
const LessonIcon = ({ name, size = 16, className = "" }) => {
  const icons = {
    Binary,
    BookOpen,
    Scale,
    TrendingUp,
    Trophy,
    Triangle,
    Ruler,
    RefreshCw,
    Map,
    Puzzle,
    Zap,
    BrainCircuit,
    Globe,
    Cable,
    Lock,
    Lightbulb,
    Repeat,
    Settings,
    Search,
    ClipboardList,
    Dices,
    Link,
    Shuffle,
    Sparkles,
  };
  const Component = icons[name] || BookOpen;
  return <Component size={size} className={className} />;
};

// Dynamic achievement icon component
const AchievementIcon = ({ name, size = 18, className = "" }) => {
  const icons = {
    Binary,
    Scale,
    TrendingUp,
    Ruler,
    Triangle,
    Box,
    Puzzle,
    Cpu,
    BrainCircuit,
    Globe,
    Zap,
    Trophy,
  };
  const Component = icons[name] || Trophy;
  return <Component size={size} className={className} />;
};

// ─────────────────────────────────────────
// DYNAMIC LESSONS DATABASE PER BUILDING
// ─────────────────────────────────────────

const BUILDING_LESSONS = {
  algebra: [
    { id: 1, title: 'Basic Variables', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Binary' },
    { id: 2, title: 'Algebraic Expressions', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'BookOpen' },
    { id: 3, title: 'Linear Equations', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Scale' },
    { id: 4, title: 'Math Functions', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'TrendingUp' },
    { id: 5, title: 'Graph Analysis', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'TrendingUp' },
    { id: 6, title: 'Final Algebra Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  geometry: [
    { id: 1, title: 'Shapes & Perimeters', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Triangle' },
    { id: 2, title: 'Areas & Volumes', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Ruler' },
    { id: 3, title: 'Trigonometry Basics', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Ruler' },
    { id: 4, title: 'Spatial Symmetry', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'RefreshCw' },
    { id: 5, title: 'Cartesian Coordinates', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Map' },
    { id: 6, title: 'Engineering Design Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  ai: [
    { id: 1, title: 'Pattern Recognition', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Puzzle' },
    { id: 2, title: 'Prediction Algorithms', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Zap' },
    { id: 3, title: 'Mathematical Logic', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'BrainCircuit' },
    { id: 4, title: 'Neural Networks Basics', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Globe' },
    { id: 5, title: 'Automated Decision Making', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Cpu' },
    { id: 6, title: 'AI Final Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  cyber: [
    { id: 1, title: 'Digital Logic Gates', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Cable' },
    { id: 2, title: 'Modular Cryptography', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Lock' },
    { id: 3, title: 'Prime Numbers & Security', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Binary' },
    { id: 4, title: 'Defense Algorithms', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Lock' },
    { id: 5, title: 'Vulnerability Analysis', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Search' },
    { id: 6, title: 'Ethical Hacking Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  data: [
    { id: 1, title: 'Data Collection', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'ClipboardList' },
    { id: 2, title: 'Central Tendency', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'TrendingUp' },
    { id: 3, title: 'Reading Charts', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'TrendingUp' },
    { id: 4, title: 'Simple Probabilities', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Dices' },
    { id: 5, title: 'Statistical Distributions', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'TrendingUp' },
    { id: 6, title: 'Data Science Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  physics: [
    { id: 1, title: 'Linear Functions', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Ruler' },
    { id: 2, title: 'Quadratic Functions', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Scale' },
    { id: 3, title: 'Polynomials', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Binary' },
    { id: 4, title: 'Exponential & Logarithmic Functions', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'TrendingUp' },
    { id: 5, title: 'Basic Derivatives', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Sparkles' },
    { id: 6, title: 'Observatory Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  code: [
    { id: 1, title: 'Logical Thinking', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Lightbulb' },
    { id: 2, title: 'Loops & Iteration', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Repeat' },
    { id: 3, title: 'Basic Algorithms', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Settings' },
    { id: 4, title: 'Search & Sorting', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Search' },
    { id: 5, title: 'Data Structures', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Globe' },
    { id: 6, title: 'Algorithms Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  chemistry: [
    { id: 1, title: 'Probability Principles', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Dices' },
    { id: 2, title: 'Conditional Probability', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Link' },
    { id: 3, title: 'Permutations & Combinations', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Shuffle' },
    { id: 4, title: 'Probability Distributions', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'TrendingUp' },
    { id: 5, title: 'Statistical Inference', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Settings' },
    { id: 6, title: 'Probability Lab Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
  music: [
    { id: 1, title: 'Number Sequences', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Binary' },
    { id: 2, title: 'Geometric Patterns', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Sparkles' },
    { id: 3, title: 'Symmetry & Reflection', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'RefreshCw' },
    { id: 4, title: 'Fractals & Chaos', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Sparkles' },
    { id: 5, title: 'Golden Ratio', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Sparkles' },
    { id: 6, title: 'Patterns World Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy' },
  ],
};

const DEFAULT_LESSONS = BUILDING_LESSONS.algebra;

const BUILDING_DESCRIPTIONS = {
  algebra: 'Master equations, functions, and algebraic thinking in an advanced interactive environment. Start your journey to mastering algebra!',
  geometry: 'Discover the world of shapes, dimensions, and spatial relations. Learn geometry in a fun and visual way!',
  ai: 'Enter the world of artificial intelligence and explore how machines learn to think and predict!',
  cyber: 'Learn the basics of data protection and mathematical cryptography to become a cyber warrior!',
  data: 'Analyze data, discover hidden patterns, and learn to read charts like a pro!',
  physics: 'Explore the world of mathematical functions from linear to differential in an interactive observatory!',
  code: 'Learn algorithmic thinking and solve programming problems step-by-step!',
  chemistry: 'Discover the world of probability and statistics, and learn how to predict the future mathematically!',
  music: 'Explore the beauty of patterns, sequences, and symmetry in nature and art!',
};

const ACHIEVEMENTS_BY_BUILDING = {
  algebra: [
    { id: 1, icon: 'Binary', title: 'Variable Analyzer', desc: 'Mastered handling variables', earned: true },
    { id: 2, icon: 'Scale', title: 'Equation Balancer', desc: 'Successfully solved 10 equations', earned: true },
    { id: 3, icon: 'TrendingUp', title: 'Function Plotter', desc: 'Mastered plotting mathematical functions', earned: false },
  ],
  geometry: [
    { id: 1, icon: 'Ruler', title: 'Shape Engineer', desc: 'Recognized all basic shapes', earned: true },
    { id: 2, icon: 'Triangle', title: 'Trigonometry Expert', desc: 'Mastered trigonometry calculations', earned: true },
    { id: 3, icon: 'Box', title: '3D Designer', desc: 'Mastered 3D spatial shapes', earned: false },
  ],
  ai: [
    { id: 1, icon: 'Puzzle', title: 'Pattern Detector', desc: 'Recognized mathematical patterns', earned: true },
    { id: 2, icon: 'Cpu', title: 'Smart Programmer', desc: 'Built your first AI model', earned: false },
    { id: 3, icon: 'BrainCircuit', title: 'Logic Genius', desc: 'Mastered mathematical logic', earned: false },
  ],
};

const DEFAULT_ACHIEVEMENTS = [
  { id: 1, icon: 'Globe', title: 'Explorer', desc: 'Explored 10 lessons', earned: true },
  { id: 2, icon: 'Zap', title: 'Fast Learner', desc: 'Completed 3 lessons in a single day', earned: true },
  { id: 3, icon: 'BrainCircuit', title: 'Logic Champion', desc: 'Mastered logical thinking', earned: false },
];

// ─────────────────────────────────────────
// DIFFICULTY COLORS (soft pastels)
// ─────────────────────────────────────────
const DIFFICULTY_COLORS = {
  'Easy': '#4eca8b',
  'Medium': '#f5a623',
  'Hard': '#e85d75',
  'Boss': '#9b7bea',
};

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// ─────────────────────────────────────────
// GLASS CONTAINER
// ─────────────────────────────────────────
const Glass = ({ children, style, variants }) => (
  <motion.div
    variants={variants || fadeUp}
    style={{
      background: 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(16px) saturate(120%)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      borderRadius: 24,
      padding: '24px 28px',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.04)',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

// ─────────────────────────────────────────
// BG BUBBLES
// ─────────────────────────────────────────
const BgBubbles = ({ accentColor }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
    <div className="bubble-1" style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: `${accentColor}12`, filter: 'blur(80px)', top: '-10%', left: '-10%' }} />
    <div className="bubble-2" style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(245, 166, 35, 0.06)', filter: 'blur(70px)', bottom: '5%', right: '-5%' }} />
  </div>
);

// ─────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────
const Topbar = ({ building, onBack, accentColor }) => {
  const [backHov, setBackHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.4)',
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: accentColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${accentColor}40`,
        }}>
          <User size={18} style={{ color: '#fff' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 900, color: '#3a3a50', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
            {building?.title || 'Academic Tree'}
          </h1>
          <span style={{ fontSize: 11, color: '#9b7bea', fontWeight: 600 }}>Active Explorer Space</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#999' }}>Level</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#3a3a50' }}>5 Engineer</span>
        </div>
        {/* XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#999' }}>XP</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: accentColor }}>450</span>
        </div>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#999' }}>Progress</span>
          <div style={{ width: 80, height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '45%', height: '100%', background: accentColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#999' }}>45%</span>
        </div>
        {/* Back Button */}
        <button
          onClick={onBack}
          onMouseEnter={() => setBackHov(true)}
          onMouseLeave={() => setBackHov(false)}
          style={{
            height: 36,
            padding: '0 18px',
            borderRadius: 12,
            border: `1.5px solid ${backHov ? accentColor : 'rgba(0,0,0,0.1)'}`,
            background: backHov ? accentColor : 'rgba(255,255,255,0.4)',
            color: backHov ? '#fff' : '#3a3a50',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.25s ease',
            backdropFilter: 'blur(8px)',
            boxShadow: backHov ? `0 4px 16px ${accentColor}44` : 'none',
            fontFamily: "'Segoe UI',sans-serif",
          }}
        >
          ← Back
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────
// HERO CARD
// ─────────────────────────────────────────
const HeroCard = ({ building, accentColor, onContinue, lessons }) => {
  const [btnHov, setBtnHov] = useState(false);
  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const progressPct = Math.round((completedCount / lessons.length) * 100) || 0;

  return (
    <Glass style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Shiny edge reflection effect */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ display: 'flex', width: 24, height: 24, borderRadius: '50%', background: `${accentColor}15`, alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} style={{ color: accentColor }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: accentColor, letterSpacing: 2 }}>
            Roadmap Missions
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#3a3a50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              {building?.title || 'Academic Hub'}
            </h2>
            <span style={{ fontSize: 12, color: accentColor, fontWeight: 700 }}>Curriculum Roadmap</span>
          </div>
        </div>

        <p style={{ color: '#888', fontSize: 13, lineHeight: 1.8, maxWidth: 560, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
          {BUILDING_DESCRIPTIONS[building?.type] || BUILDING_DESCRIPTIONS.algebra}
        </p>

        <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
          <HeroStat label="Total Progress" value={`${progressPct}%`} valueColor={accentColor} />
          <HeroStat
            label="Lessons Completed"
            value={<>{completedCount} <span style={{ color: '#bbb', fontSize: 14 }}>/ {lessons.length}</span></>}
            valueColor="#3a3a50"
          />
          <HeroStat 
            label="Current Streak" 
            value={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>5 Days</span>
                <Flame size={18} style={{ color: '#f5a623', fill: '#f5a623' }} />
              </div>
            } 
            valueColor="#f5a623" 
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          onClick={onContinue}
          style={{
            height: 46,
            padding: '0 30px',
            borderRadius: 14,
            border: 'none',
            background: accentColor,
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            cursor: 'pointer',
            boxShadow: btnHov ? `0 12px 32px ${accentColor}55` : `0 6px 20px ${accentColor}30`,
            transition: 'box-shadow 0.3s ease',
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          Continue Learning →
        </motion.button>
      </div>
    </Glass>
  );
};

const HeroStat = ({ label, value, valueColor }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontSize: 20, fontWeight: 900, color: valueColor, letterSpacing: -0.5 }}>{value}</span>
  </div>
);

// ─────────────────────────────────────────
// MISSION CARD
// ─────────────────────────────────────────
const MissionCard = ({ lesson, accentColor, onStart }) => {
  const [hov, setHov] = useState(false);
  const locked = lesson.status === 'locked';
  const cur = lesson.status === 'current';
  const done = lesson.status === 'completed';

  const diffColor = DIFFICULTY_COLORS[lesson.difficulty] || '#999';

  return (
    <motion.div
      variants={fadeUp}
      whileHover={locked ? {} : { y: -5, boxShadow: '0 12px 28px rgba(31,38,135,0.06)' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => !locked && onStart?.(lesson)}
      style={{
        background: locked ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(14px)',
        border: cur ? `2px solid ${accentColor}` : '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: 20,
        padding: 18,
        opacity: locked ? 0.6 : 1,
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'border 0.25s, box-shadow 0.25s',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Card Gloss Reflection */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)', pointerEvents: 'none' }} />

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: locked ? 'rgba(0,0,0,0.04)' : `${accentColor}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: locked ? '#bbb' : accentColor,
          }}>
            <LessonIcon name={lesson.icon} size={16} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: locked ? '#bbb' : '#3a3a50', fontFamily: "'DM Sans', sans-serif" }}>
            {lesson.title}
          </span>
        </div>
        <StatusBadge done={done} cur={cur} locked={locked} accentColor={accentColor} />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <MetaRow label="Difficulty" value={lesson.difficulty} valueColor={diffColor} />
        <MetaRow label="XP Reward" value={`+${lesson.xp} XP`} valueColor={accentColor} />
        <MetaRow label="Duration" value={lesson.duration} valueColor="#999" />
      </div>

      {/* Action */}
      {!locked && (
        <div style={{
          width: '100%',
          padding: '9px 0',
          textAlign: 'center',
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          background: cur ? accentColor : `${accentColor}10`,
          color: cur ? '#fff' : accentColor,
          transition: 'all 0.2s',
          fontFamily: "'Segoe UI', sans-serif",
        }}>
          {done ? 'Review Mission' : 'Start Mission'}
        </div>
      )}
    </motion.div>
  );
};

const StatusBadge = ({ done, cur, locked, accentColor }) => {
  const base = {
    width: 28, height: 28, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 800, flexShrink: 0,
  };

  if (done) return <div style={{ ...base, background: '#4eca8b15', color: '#4eca8b' }}>✓</div>;
  if (cur) return <div style={{ ...base, background: `${accentColor}15`, color: accentColor }}>▶</div>;
  return <div style={{ ...base, background: 'rgba(0,0,0,0.03)', color: '#bbb' }}><Lock size={12} /></div>;
};

const MetaRow = ({ label, value, valueColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
    <span style={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
    <span style={{ fontWeight: 700, color: valueColor || '#3a3a50' }}>{value}</span>
  </div>
);

// ─────────────────────────────────────────
// DAILY CHALLENGE WIDGET
// ─────────────────────────────────────────
const DailyChallenge = ({ accentColor, onStart }) => {
  const [btnHov, setBtnHov] = useState(false);
  const [secs, setSecs] = useState(43200); // 12 hours countdown

  useEffect(() => {
    const t = setInterval(() => setSecs(prev => (prev > 0 ? prev - 1 : 43200)), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(Math.floor(n)).padStart(2, '0');
  const h = pad(secs / 3600);
  const m = pad((secs % 3600) / 60);
  const s = pad(secs % 60);

  return (
    <Glass variants={fadeUp} style={{
      background: `linear-gradient(145deg, ${accentColor}0a, rgba(255,255,255,0.3))`,
      border: `1px solid ${accentColor}20`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accentColor }}>
          Daily Challenge
        </span>
        <span style={{
          background: `${accentColor}10`,
          border: `1px solid ${accentColor}20`,
          padding: '3px 10px',
          borderRadius: 99,
          fontSize: 11,
          fontWeight: 700,
          color: accentColor,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {h}:{m}:{s}
        </span>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#3a3a50', marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>
        Solve 5 diverse problems
      </h3>

      {/* Rewards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <RewardChip value="+100" unit="XP Points" color={accentColor} />
        <RewardChip value="+25" unit="Coins" color="#f5a623" />
      </div>

      <button
        onClick={onStart}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: '100%',
          height: 42,
          borderRadius: 12,
          border: 'none',
          background: accentColor,
          color: '#fff',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 1,
          cursor: 'pointer',
          boxShadow: btnHov ? `0 8px 24px ${accentColor}50` : `0 4px 16px ${accentColor}30`,
          transform: btnHov ? 'translateY(-2px)' : 'none',
          transition: 'all 0.25s ease',
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        Start Challenge
      </button>
    </Glass>
  );
};

const RewardChip = ({ value, unit, color }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 2,
    background: 'rgba(255,255,255,0.35)',
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: '7px 14px',
    backdropFilter: 'blur(8px)',
  }}>
    <span style={{ fontSize: 14, fontWeight: 800, color }}>{value}</span>
    <span style={{ fontSize: 10, color: '#999', fontFamily: "'DM Sans', sans-serif" }}>{unit}</span>
  </div>
);

// ─────────────────────────────────────────
// ROADMAP
// ─────────────────────────────────────────
const Roadmap = ({ lessons, accentColor }) => {
  const statusMeta = {
    completed: { label: 'Completed', labelColor: '#4eca8b', nodeClass: 'done' },
    current: { label: 'In Progress', labelColor: accentColor, nodeClass: 'current' },
    locked: { label: 'Locked', labelColor: '#ccc', nodeClass: 'locked' },
  };

  return (
    <Glass variants={fadeUp}>
      <SectionHeader color={accentColor} title="Learning Path" />
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 4 }}>
        {lessons.map((lesson, idx) => {
          const meta = statusMeta[lesson.status];
          const isLast = idx === lessons.length - 1;
          const locked = lesson.status === 'locked';

          const nodeBg = lesson.status === 'completed' ? '#4eca8b'
            : lesson.status === 'current' ? 'transparent'
            : 'rgba(0,0,0,0.06)';
          const nodeBorder = lesson.status === 'completed' ? '#4eca8b'
            : lesson.status === 'current' ? accentColor
            : 'rgba(0,0,0,0.1)';
          const nodeInner = lesson.status === 'current';
          const nodeGlow = lesson.status === 'current'
            ? `0 0 10px ${accentColor}40` : 'none';

          return (
            <div
              key={lesson.id}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative', paddingBottom: isLast ? 0 : 22 }}
            >
              {/* Connecting line */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  left: 7,
                  top: 20,
                  bottom: 0,
                  width: 2,
                  background: lesson.status === 'completed' ? '#4eca8b55' : 'rgba(0,0,0,0.06)',
                  borderRadius: 99,
                }} />
              )}

              {/* Node */}
              <div style={{
                width: 16, height: 16,
                borderRadius: '50%',
                background: nodeBg,
                border: `${lesson.status === 'current' ? 3 : 2}px solid ${nodeBorder}`,
                boxShadow: nodeGlow,
                flexShrink: 0,
                marginTop: 3,
                zIndex: 1,
                position: 'relative',
              }}>
                {nodeInner && (
                  <div style={{ position: 'absolute', inset: 3, background: accentColor, borderRadius: '50%' }} />
                )}
              </div>

              {/* Text */}
              <div style={{ opacity: locked ? 0.5 : 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: meta.labelColor, marginBottom: 3 }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: locked ? '#bbb' : '#3a3a50', fontFamily: "'DM Sans', sans-serif" }}>
                  {lesson.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Glass>
  );
};

// ─────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────
const Achievements = ({ achievements, accentColor }) => (
  <Glass variants={fadeUp}>
    <SectionHeader color="#f5a623" title="Achievements" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {achievements.map(ach => (
        <motion.div
          key={ach.id}
          whileHover={ach.earned ? { scale: 1.02, y: -2 } : {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: ach.earned ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.02)',
            border: ach.earned ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(0,0,0,0.04)',
            borderRadius: 14,
            padding: '10px 14px',
            opacity: ach.earned ? 1 : 0.45,
            filter: ach.earned ? 'none' : 'grayscale(0.8)',
            cursor: ach.earned ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: ach.earned ? `${accentColor}12` : 'rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}>
            <AchievementIcon name={ach.icon} size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#3a3a50' }}>{ach.title}</div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{ach.desc}</div>
          </div>
          {ach.earned && (
            <div style={{
              marginLeft: 'auto', marginRight: 0,
              width: 20, height: 20, borderRadius: '50%',
              background: '#4eca8b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#fff', flexShrink: 0,
            }}>✓</div>
          )}
        </motion.div>
      ))}
    </div>
  </Glass>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function SkillTree({ building, onBack, onStartLevel }) {
  if (!building) return null;

  const accentColor = building.color || '#9b7bea';
  const lessons = BUILDING_LESSONS[building.type] || DEFAULT_LESSONS;
  const achievements = ACHIEVEMENTS_BY_BUILDING[building.type] || DEFAULT_ACHIEVEMENTS;

  const handleContinue = () => onStartLevel?.(lessons.find(l => l.status === 'current') ?? lessons[0]);
  const handleChallenge = () => onStartLevel?.({ id: 'daily', title: 'Daily Challenge', type: 'challenge' });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(160deg, #e6dff5 0%, #d8eaf556 25%, #f2e4ef 50%, #ddf0ec 75%, #ede5f5 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: '#3a3a50',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      direction: 'ltr',
    }}>
      <BgBubbles accentColor={accentColor} />

      <Topbar building={building} onBack={onBack} accentColor={accentColor} />

      {/* Main layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 18,
        padding: 22,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
      }}>

        {/* ── Left column (main content) ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            overflowY: 'auto',
            paddingRight: 4,
          }}
        >
          <HeroCard building={building} accentColor={accentColor} onContinue={handleContinue} lessons={lessons} />

          <div>
            <SectionHeader color={accentColor} title="Available Quests" />
            <motion.div
              variants={stagger}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 14,
              }}
            >
              {lessons.map(lesson => (
                <MissionCard key={lesson.id} lesson={lesson} accentColor={accentColor} onStart={onStartLevel} />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Right column (sidebar) ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            width: 280,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            overflowY: 'auto',
          }}
        >
          <DailyChallenge accentColor={accentColor} onStart={handleChallenge} />
          <Roadmap lessons={lessons} accentColor={accentColor} />
          <Achievements achievements={achievements} accentColor={accentColor} />
        </motion.div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────
const SectionHeader = ({ color, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
    <div style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
    <h3 style={{ fontSize: 14, fontWeight: 900, color: '#3a3a50', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
      {title}
    </h3>
  </div>
);