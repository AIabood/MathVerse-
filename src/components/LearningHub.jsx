import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Award, Flame, Zap, BookOpen, ChevronRight,
  Play, ArrowLeft, Compass, Lock, Unlock, Calendar,
  TrendingUp, User, CheckCircle2, Target, Clock, Trophy,
  ChevronLeft, Sparkles, MapPin, Code, Cpu, ShieldAlert, BrainCircuit, Binary,
  Scale, Triangle, Ruler, RefreshCw, Map, Puzzle, Globe, Cable, Lightbulb,
  Repeat, Settings, ClipboardList, Dices, Link, Shuffle
} from 'lucide-react';
import './LearningHub.css';
import EducationOverview from './EducationOverview';
import Sidebar from './Sidebar';

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

// Frosted Canvas Avatar (matches UserProfile.jsx avatar drawing)
const Avatar = ({ color = "#9b7bea", size = 64 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(cx * 0.7, cy * 0.6, 5, cx, cy, cx);
    g.addColorStop(0, color + "55"); g.addColorStop(1, color + "aa");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f5c8a0"; ctx.beginPath(); ctx.ellipse(cx, cy - 4, 18 * (size / 90), 20 * (size / 90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(cx, cy - 16 * (size / 90), 18 * (size / 90), Math.PI, 0); ctx.fill();
    ctx.fillRect(cx - 18 * (size / 90), cy - 26 * (size / 90), 36 * (size / 90), 12 * (size / 90));
    ctx.fillStyle = "#5c3d11";
    ctx.beginPath(); ctx.ellipse(cx - 6 * (size / 90), cy - 7 * (size / 90), 2.5 * (size / 90), 2 * (size / 90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6 * (size / 90), cy - 7 * (size / 90), 2.5 * (size / 90), 2 * (size / 90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d4956a"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy + 2 * (size / 90), 4 * (size / 90), 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(cx - 22 * (size / 90), h); ctx.quadraticCurveTo(cx - 18 * (size / 90), cy + 18 * (size / 90), cx - 12 * (size / 90), cy + 10 * (size / 90));
    ctx.lineTo(cx + 12 * (size / 90), cy + 10 * (size / 90)); ctx.quadraticCurveTo(cx + 18 * (size / 90), cy + 18 * (size / 90), cx + 22 * (size / 90), h); ctx.fill();
  }, [color, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: "50%", width: size, height: size, border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }} />;
};

// Isometric SVG stack of books and flat tablet (with pastel colors)
const IsometricBookStack = () => (
  <svg width="180" height="160" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
    {/* Bottom Book (Soft Lavender Purple) */}
    <g transform="translate(10, 100)">
      <path d="M70 10 L130 30 L70 50 L10 30 Z" fill="#b09be8" />
      <path d="M130 30 L130 45 L70 65 L70 50 Z" fill="#9b7bea" />
      <path d="M70 50 L70 65 L10 45 L10 30 Z" fill="#8464d6" />
      <path d="M130 33 L130 42 L73 62 L73 53 Z" fill="#f1f3f9" />
    </g>

    {/* Middle Book (Soft Rose) */}
    <g transform="translate(20, 75)">
      <path d="M70 10 L130 30 L70 50 L10 30 Z" fill="#f09ca8" />
      <path d="M130 30 L130 45 L70 65 L70 50 Z" fill="#e85d75" />
      <path d="M70 50 L70 65 L10 45 L10 30 Z" fill="#d63f59" />
      <path d="M130 33 L130 42 L73 62 L73 53 Z" fill="#fafbfd" />
    </g>

    {/* Top Book (Soft Cyan/Teal) */}
    <g transform="translate(15, 50)">
      <path d="M70 10 L130 30 L70 50 L10 30 Z" fill="#8de0e8" />
      <path d="M130 30 L130 45 L70 65 L70 50 Z" fill="#5dc4d6" />
      <path d="M70 50 L70 65 L10 45 L10 30 Z" fill="#3fb2c5" />
      <path d="M130 33 L130 42 L73 62 L73 53 Z" fill="#fafbfd" />
    </g>

    {/* Flat Tablet on top (Dark slate frame, white screen, pastel checklists) */}
    <g transform="translate(25, 28)">
      <path d="M60 10 L115 30 L60 52 L5 32 Z" fill="#4a5568" />
      <path d="M57 12 L108 31 L57 49 L9 32 Z" fill="#f8fafc" />
      <path d="M57 15 L90 28 L57 39 L24 28 Z" fill="#e2e8f0" />
      <line x1="45" y1="23" x2="65" y2="31" stroke="#9b7bea" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="27" x2="52" y2="33" stroke="#4eca8b" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="19" x2="72" y2="26" stroke="#5dc4d6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M35 21 L85 40 L65 32 L15 13 Z" fill="#ffffff" opacity="0.35" />
    </g>
  </svg>
);

// Dynamic Lessons Database to match SkillTree.jsx
const BUILDING_LESSONS = {
  algebra: [
    { id: 1, title: 'Basic Variables', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Binary', guide: 'Nova Agent' },
    { id: 2, title: 'Algebraic Expressions', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'BookOpen', guide: 'Nova Agent' },
    { id: 3, title: 'Linear Equations', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Scale', guide: 'Nova Agent' },
    { id: 4, title: 'Math Functions', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'TrendingUp', guide: 'Nova Agent' },
    { id: 5, title: 'Graph Analysis', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'TrendingUp', guide: 'Nova Agent' },
    { id: 6, title: 'Final Algebra Challenge', status: 'locked', difficulty: 'Boss', xp: 500, duration: '60 Min', icon: 'Trophy', guide: 'Nova Agent' },
  ],
  geometry: [
    { id: 1, title: 'Shapes & Perimeters', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Triangle', guide: 'Archimedes' },
    { id: 2, title: 'Areas & Volumes', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Ruler', guide: 'Archimedes' },
    { id: 3, title: 'Trigonometry Basics', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Ruler', guide: 'Archimedes' },
    { id: 4, title: 'Spatial Symmetry', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'RefreshCw', guide: 'Archimedes' },
    { id: 5, title: 'Cartesian Coordinates', status: 'locked', difficulty: 'Hard', xp: 200, duration: '40 Min', icon: 'Map', guide: 'Archimedes' },
  ],
  ai: [
    { id: 1, title: 'Pattern Recognition', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Puzzle', guide: 'AI Prime' },
    { id: 2, title: 'Prediction Algorithms', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Zap', guide: 'AI Prime' },
    { id: 3, title: 'Mathematical Logic', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'BrainCircuit', guide: 'AI Prime' },
    { id: 4, title: 'Neural Networks Basics', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Globe', guide: 'AI Prime' },
  ],
  cyber: [
    { id: 1, title: 'Digital Logic Gates', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Cable', guide: 'Cyber Sentinel' },
    { id: 2, title: 'Modular Cryptography', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Lock', guide: 'Cyber Sentinel' },
    { id: 3, title: 'Prime Numbers & Security', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Binary', guide: 'Cyber Sentinel' },
  ],
  code: [
    { id: 1, title: 'Logical Thinking', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Lightbulb', guide: 'Code Knight' },
    { id: 2, title: 'Loops & Iteration', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Repeat', guide: 'Code Knight' },
    { id: 3, title: 'Basic Algorithms', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Settings', guide: 'Code Knight' },
    { id: 4, title: 'Search & Sorting', status: 'locked', difficulty: 'Hard', xp: 150, duration: '30 Min', icon: 'Search', guide: 'Code Knight' },
  ],
  data: [
    { id: 1, title: 'Data Collection', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'ClipboardList', guide: 'Data Guru' },
    { id: 2, title: 'Central Tendency', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'TrendingUp', guide: 'Data Guru' },
    { id: 3, title: 'Reading Charts', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'TrendingUp', guide: 'Data Guru' },
  ],
  physics: [
    { id: 1, title: 'Linear Functions', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Ruler', guide: 'Newton Agent' },
    { id: 2, title: 'Quadratic Functions', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Scale', guide: 'Newton Agent' },
    { id: 3, title: 'Polynomials', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Binary', guide: 'Newton Agent' },
  ],
  chemistry: [
    { id: 1, title: 'Probability Principles', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Dices', guide: 'Chem Chemist' },
    { id: 2, title: 'Conditional Probability', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Link', guide: 'Chem Chemist' },
    { id: 3, title: 'Permutations & Combinations', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'Shuffle', guide: 'Chem Chemist' },
  ],
  music: [
    { id: 1, title: 'Number Sequences', status: 'completed', difficulty: 'Easy', xp: 50, duration: '15 Min', icon: 'Binary', guide: 'Cadence Guide' },
    { id: 2, title: 'Geometric Patterns', status: 'completed', difficulty: 'Medium', xp: 75, duration: '20 Min', icon: 'Sparkles', guide: 'Cadence Guide' },
    { id: 3, title: 'Symmetry & Reflection', status: 'current', difficulty: 'Medium', xp: 100, duration: '25 Min', icon: 'RefreshCw', guide: 'Cadence Guide' },
  ],
};

const DIFFICULTY_COLORS = {
  'Easy': '#4eca8b',
  'Medium': '#f5a623',
  'Hard': '#e85d75',
  'Boss': '#9b7bea',
};

const WORLD_COLORS = {
  algebra: '#3b82f6',
  geometry: '#10b981',
  data: '#f59e0b',
  ai: '#8b5cf6',
  cyber: '#ef4444',
  physics: '#e67e22',
  code: '#00b894',
  chemistry: '#6c5ce7',
  music: '#fd79a8',
};

const ALL_WORLDS = [
  {
    id: 'algebra',
    name: 'Algebra Tower',
    desc: 'Master equations, functions, and variables.',
    icon: 'Binary',
    progress: 80,
    missions: 6,
    mentor: 'Nova Agent',
    gradientClass: 'algebra-world',
    unlocked: true
  },
  {
    id: 'geometry',
    name: 'Geometry Center',
    desc: 'Explore areas, volumes, and spatial symmetry principles.',
    icon: 'Triangle',
    progress: 60,
    missions: 5,
    mentor: 'Archimedes',
    gradientClass: 'geometry-world',
    unlocked: true
  },
  {
    id: 'data',
    name: 'Data Center',
    desc: 'Analyze statistical data, central tendency, and charts.',
    icon: 'TrendingUp',
    progress: 40,
    missions: 3,
    mentor: 'Data Guru',
    gradientClass: 'data-world',
    unlocked: true
  },
  {
    id: 'ai',
    name: 'AI Lab',
    desc: 'Decode pattern recognition and neural networks basics.',
    icon: 'BrainCircuit',
    progress: 25,
    missions: 4,
    mentor: 'AI Prime',
    gradientClass: 'ai-world',
    unlocked: true
  },
  {
    id: 'cyber',
    name: 'Cyber Security Center',
    desc: 'Learn digital logic gates, modular cryptography, and security.',
    icon: 'Lock',
    progress: 10,
    missions: 3,
    mentor: 'Cyber Sentinel',
    gradientClass: 'cyber-world',
    unlocked: true
  },
  {
    id: 'physics',
    name: 'Function Observatory',
    desc: 'Study linear, quadratic, and polynomial functions.',
    icon: 'Scale',
    progress: 50,
    missions: 3,
    mentor: 'Newton Agent',
    gradientClass: 'physics-world',
    unlocked: true
  },
  {
    id: 'code',
    name: 'Algorithm Arena',
    desc: 'Master loops, basic algorithms, and computational search.',
    icon: 'Code',
    progress: 70,
    missions: 4,
    mentor: 'Code Knight',
    gradientClass: 'code-world',
    unlocked: true
  },
  {
    id: 'chemistry',
    name: 'Probability Lab',
    desc: 'Learn permutations, combinations, and chance values.',
    icon: 'Dices',
    progress: 10,
    missions: 3,
    mentor: 'Chem Chemist',
    gradientClass: 'chemistry-world',
    unlocked: true
  },
  {
    id: 'music',
    name: 'Pattern Academy',
    desc: 'Discover number sequences, geometric symmetry, and cadence.',
    icon: 'Sparkles',
    progress: 15,
    missions: 3,
    mentor: 'Cadence Guide',
    gradientClass: 'music-world',
    unlocked: true
  }
];

export default function LearningHub({ userData, onBack, onStartLevel, selectedBuilding, onChangeBuilding, onOpenProfile, activeMenu, setActiveMenu }) {
  console.log('[LearningHub] MOUNTED! selectedBuilding:', selectedBuilding?.type, selectedBuilding?.title);
  const [searchQuery, setSearchQuery] = useState('');
  const [localActiveMenu, setLocalActiveMenu] = useState('dashboard');
  const currentActiveMenu = activeMenu !== undefined ? activeMenu : localActiveMenu;
  const currentSetActiveMenu = setActiveMenu !== undefined ? setActiveMenu : setLocalActiveMenu;

  const handleSidebarNavigate = (item) => {
    if (item === 'pathways') {
      window.location.hash = '#/learning-hub';
    } else if (item === 'learning') {
      window.location.hash = '#/learning-screen';
    } else {
      currentSetActiveMenu(item);
    }
  };
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [showEducationOverview, setShowEducationOverview] = useState(false);

  const [activeBuilding, setActiveBuilding] = useState(() => {
    return selectedBuilding || { type: 'algebra', title: 'Algebra Tower', color: '#3b82f6' };
  });

  useEffect(() => {
    if (selectedBuilding) {
      setActiveBuilding(selectedBuilding);
    }
  }, [selectedBuilding]);

  // Find the correct lessons list based on active building
  const buildingType = activeBuilding?.type || 'algebra';
  const currentLessons = BUILDING_LESSONS[buildingType] || BUILDING_LESSONS.algebra;

  const handleSelectWorld = (world) => {
    const newBuilding = {
      type: world.id,
      title: world.name,
      color: WORLD_COLORS[world.id] || '#3b82f6'
    };
    setActiveBuilding(newBuilding);
    if (onChangeBuilding) {
      onChangeBuilding(newBuilding);
    }
    currentSetActiveMenu('dashboard');
  };

  const activeWorldObj = ALL_WORLDS.find(w => w.id === activeBuilding?.type);
  const otherWorlds = ALL_WORLDS.filter(w => w.id !== activeBuilding?.type);
  const worlds = activeWorldObj 
    ? [activeWorldObj, ...otherWorlds.slice(0, 2)] 
    : ALL_WORLDS.slice(0, 3);

  const challenges = [
    { id: 1, title: 'Solve 3 Algebra Equations', xp: 100, completed: true },
    { id: 2, title: 'Write a Nested Loop in JavaScript', xp: 150, completed: false },
    { id: 3, title: 'Complete 1 Geometry Quiz', xp: 100, completed: false }
  ];

  const activities = [
    { id: 1, text: 'Earned "Equation Master" badge', time: '2 hours ago', icon: '🏆' },
    { id: 2, text: 'Completed "Variables Intro" in Algebra Tower', time: 'Yesterday', icon: '📝' },
    { id: 3, text: 'Started "Logic Gates" module', time: '3 days ago', icon: '💡' }
  ];

  // Calendar dates representation: June 2026 starts on Monday. 14th is a Sunday.
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Quick handler to resume the current active level
  const handleResumeActive = () => {
    const activeLevel = currentLessons.find(l => l.status === 'current') || currentLessons[0];
    if (onStartLevel) {
      onStartLevel(activeLevel);
    }
  };

  return (
    <div className="learning-hub">
      {/* Soft Decorative Bubbles (Matches UserProfile) */}
      <div className="hub-decor-bubbles">
        <div className="hub-bubble hub-bubble--1" />
        <div className="hub-bubble hub-bubble--2" />
        <div className="hub-bubble hub-bubble--3" />
        <div className="hub-bubble hub-bubble--4" />
        <div className="hub-bubble hub-bubble--5" />
      </div>

      <div className="hub-layout-grid">

        {/* ============================================================
           COLUMN 1: LEFT SIDEBAR
           ============================================================ */}
        <Sidebar activeItem={currentActiveMenu} onNavigate={handleSidebarNavigate} onBack={onBack} />

        {/* ============================================================
           COLUMN 2: CENTER PANEL (MAIN CONTENT)
           ============================================================ */}
        <main className="hub-main-panel">

          {/* Header Panel */}
          <header className="hub-panel-header">
            <div className="hub-search-box">
              <Search size={18} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search subjects, levels, guides..."
                className="search-box-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="hub-header-meta">
              <span className="hub-date-str">14 June 2026, Sunday</span>
              <button className="hub-back-btn" onClick={onBack} title="Return to Tech City">
                <ArrowLeft size={16} /> <span>Back to City</span>
              </button>
            </div>
          </header>

          {currentActiveMenu === 'dashboard' && (
            <>
              {/* Welcome / Hero Banner Card */}
              <section className="hub-hero-banner">
                <div className="banner-content">
                  <span className="banner-greeting">Welcome back, Stella Walton!</span>
                  <h1 className="banner-title">
                    Manage your academic <span>MathVerse</span> journey
                  </h1>
                  <p className="banner-desc">
                    You are currently exploring the <strong>{activeBuilding?.title || 'Future Academy'}</strong>. Access your current lessons matrix, view interactive worlds, and build your digital credentials.
                  </p>

                  <div className="banner-stats">
                    <div className="b-stat">
                      <span className="b-stat-emoji" style={{ display: 'inline-flex', alignItems: 'center' }}><Flame size={16} style={{ color: '#e85d75' }} /></span>
                      <span className="b-stat-num">{userData?.streak || 7}</span>
                      <span className="b-stat-txt">Day Streak</span>
                    </div>
                    <div className="b-stat">
                      <span className="b-stat-emoji" style={{ display: 'inline-flex', alignItems: 'center' }}><Sparkles size={16} style={{ color: '#f5a623' }} /></span>
                      <span className="b-stat-num">{userData?.xp || 650}</span>
                      <span className="b-stat-txt">Total XP</span>
                    </div>
                    <div className="b-stat">
                      <span className="b-stat-emoji" style={{ display: 'inline-flex', alignItems: 'center' }}><Trophy size={16} style={{ color: '#9b7bea' }} /></span>
                      <span className="b-stat-num">#8</span>
                      <span className="b-stat-txt">Rank</span>
                    </div>
                  </div>

                  <button className="banner-cta-btn" onClick={() => window.location.hash = '#/learning-hub'}>
                    <Play size={14} fill="currentColor" /> Continue Learning
                  </button>
                </div>

                <div className="banner-graphic">
                  <IsometricBookStack />
                </div>
              </section>

              {/* Classes Section: Interactive Learning Worlds */}
              <section className="hub-section">
                <div className="hub-section-title-wrap">
                  <h2 className="hub-section-heading">Interactive Worlds</h2>
                  <span className="hub-section-view-all" onClick={() => currentSetActiveMenu('worlds')}>Explore All &gt;</span>
                </div>

                <div className="hub-worlds-row">
                  {worlds.map(world => {
                    const isActive = world.id === activeBuilding.type;
                    return (
                      <div
                        key={world.id}
                        className={`world-card-item ${world.gradientClass} ${isActive ? 'world-card-active' : ''}`}
                        onClick={() => handleSelectWorld(world)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="world-card-header">
                          <div className="world-card-icon-box">
                            <LessonIcon name={world.icon} size={22} />
                          </div>
                          <span className={`world-card-status ${isActive ? 'status-active-glow' : ''}`}>
                            {isActive ? 'Active' : 'Explore'}
                          </span>
                        </div>

                        <div className="world-card-body">
                          <h3 className="world-card-title">{world.name}</h3>
                          <span className="world-card-mentor">Guide: {world.mentor}</span>
                        </div>

                        <div className="world-card-footer">
                          <div className="avatar-pile">
                            <span className="pile-av av-color-1"><User size={12} /></span>
                            <span className="pile-av av-color-2"><User size={12} /></span>
                            <span className="pile-av av-color-3"><User size={12} /></span>
                            <span className="pile-more">+4</span>
                          </div>
                          <span className="world-card-progress">{world.progress}% Done</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Lessons Section: Curriculum Matrix Table */}
              <section className="hub-section">
                <div className="hub-section-title-wrap">
                  <h2 className="hub-section-heading">
                    Curriculum Matrix: <span className="highlight-text">{activeBuilding?.title || 'Algebra Tower'}</span>
                  </h2>
                  <span className="hub-section-view-all" onClick={handleResumeActive}>Resume Current &gt;</span>
                </div>

                <div className="hub-lessons-table-wrap">
                  <table className="hub-lessons-table">
                    <thead>
                      <tr>
                        <th>Class / Level</th>
                        <th>Section Guide</th>
                        <th>Active Students</th>
                        <th>Est. Duration</th>
                        <th>XP Reward</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLessons.map((lesson) => {
                        const isLocked = lesson.status === 'locked';
                        const isCompleted = lesson.status === 'completed';
                        const isCurrent = lesson.status === 'current';

                        return (
                          <tr key={lesson.id} className={`lesson-row ${isLocked ? 'row-locked' : ''} ${isCurrent ? 'row-current' : ''}`}>
                            <td className="col-topic">
                              <span className="lesson-emoji-icon">
                                <LessonIcon name={lesson.icon} size={16} />
                              </span>
                              <div>
                                <div className="lesson-title-en">{lesson.title}</div>
                              </div>
                            </td>

                            <td className="col-guide">{lesson.guide || 'Nova Agent'}</td>

                            <td>
                              <div className="avatar-pile">
                                <span className="pile-av av-color-1"><User size={12} /></span>
                                <span className="pile-av av-color-2"><User size={12} /></span>
                                <span className="pile-av av-color-3"><User size={12} /></span>
                              </div>
                            </td>

                            <td className="col-duration">{lesson.duration}</td>

                            <td className="col-xp">
                              <span className="xp-badge">+{lesson.xp} XP</span>
                            </td>

                            <td>
                              <span className={`status-square-badge ${isCompleted ? 'status-done' : isCurrent ? 'status-pending' : 'status-locked'}`}>
                                {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Locked'}
                              </span>
                            </td>

                            <td>
                              {isLocked ? (
                                <Lock size={14} className="action-lock-icon" style={{ display: 'inline-block' }} />
                              ) : (
                                <button
                                  className={`action-start-btn ${isCompleted ? 'btn-review' : 'btn-start'}`}
                                  onClick={() => onStartLevel && onStartLevel(lesson)}
                                >
                                  {isCompleted ? 'Review' : 'Start'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {currentActiveMenu === 'worlds' && (
            <section className="hub-section">
              <div className="hub-section-title-wrap">
                <h2 className="hub-section-heading">Interactive Learning Worlds</h2>
                <span className="hub-section-subtitle">Select a world to load its curriculum tree</span>
              </div>

              <div className="hub-worlds-grid">
                {ALL_WORLDS.map(world => {
                  const isActive = world.id === activeBuilding.type;
                  return (
                    <div
                      key={world.id}
                      className={`world-card-item ${world.gradientClass} ${isActive ? 'world-card-active' : ''}`}
                      onClick={() => handleSelectWorld(world)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="world-card-header">
                        <div className="world-card-icon-box">
                          <LessonIcon name={world.icon} size={22} />
                        </div>
                        <span className={`world-card-status ${isActive ? 'status-active-glow' : ''}`}>
                          {isActive ? 'Active' : 'Explore'}
                        </span>
                      </div>

                      <div className="world-card-body">
                        <h3 className="world-card-title">{world.name}</h3>
                        <p className="world-card-description">{world.desc}</p>
                        <span className="world-card-mentor">Guide: {world.mentor}</span>
                      </div>

                      <div className="world-card-footer">
                        <div className="avatar-pile">
                          <span className="pile-av av-color-1"><User size={12} /></span>
                          <span className="pile-av av-color-2"><User size={12} /></span>
                          <span className="pile-av av-color-3"><User size={12} /></span>
                        </div>
                        <span className="world-card-progress">{world.progress}% Done</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {currentActiveMenu === 'quests' && (
            <section className="hub-section quests-detail-page">
              <div className="hub-section-title-wrap">
                <h2 className="hub-section-heading">Missions &amp; Quests</h2>
                <span className="hub-section-subtitle">Earn bonus experience points by completing targets</span>
              </div>

              <div className="premium-glass-card quests-progress-card">
                <div className="quests-progress-info">
                  <div>
                    <h3>Daily Explorer Progress</h3>
                    <p>Complete all daily quests to earn a bonus mystery box.</p>
                  </div>
                  <div className="quests-progress-ratio">
                    <span className="ratio-num">1/3</span>
                    <span className="ratio-label">Completed</span>
                  </div>
                </div>
                <div className="xp-track-bar">
                  <div className="xp-fill-bar" style={{ width: '33.3%' }} />
                </div>
              </div>

              <div className="quests-grids-container">
                <div className="quest-column-panel">
                  <h3 className="column-panel-title">Daily Quests</h3>
                  <div className="quests-list-vertical">
                    {challenges.map(quest => (
                      <div key={quest.id} className={`quest-item-card-large ${quest.completed ? 'completed' : ''}`}>
                        <div className="quest-check-icon">
                          {quest.completed ? <CheckCircle2 size={20} className="check-done" /> : <Clock size={20} className="check-pending" />}
                        </div>
                        <div className="quest-large-details">
                          <h4>{quest.title}</h4>
                          <p>Objective: Solve in any corresponding building tower.</p>
                        </div>
                        <div className="quest-large-reward">
                          <span className="xp-badge">+{quest.xp} XP</span>
                          <span className="quest-status-text">{quest.completed ? 'Claimed' : 'Active'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="quest-column-panel">
                  <h3 className="column-panel-title">Weekly Campaigns</h3>
                  <div className="quests-list-vertical">
                    <div className="quest-item-card-large">
                      <div className="quest-check-icon">
                        <Target size={20} className="check-pending" />
                      </div>
                      <div className="quest-large-details">
                        <h4>Master the Geometry Center</h4>
                        <p>Complete all modules in Geometry to 100% progress.</p>
                      </div>
                      <div className="quest-large-reward">
                        <span className="xp-badge bonus-badge">+500 XP</span>
                        <span className="quest-status-text">Active</span>
                      </div>
                    </div>
                    <div className="quest-item-card-large">
                      <div className="quest-check-icon">
                        <Target size={20} className="check-pending" />
                      </div>
                      <div className="quest-large-details">
                        <h4>Speedrun AI Logic Gate</h4>
                        <p>Submit 3 consecutive perfect scores in AI quizzes.</p>
                      </div>
                      <div className="quest-large-reward">
                        <span className="xp-badge bonus-badge">+300 XP</span>
                        <span className="quest-status-text">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentActiveMenu === 'leaderboard' && (
            <section className="hub-section leaderboard-page">
              <div className="hub-section-title-wrap">
                <h2 className="hub-section-heading">Explorer Leaderboard</h2>
                <span className="hub-section-subtitle">Top mathematical minds in the Tech City network</span>
              </div>

              {/* Podium */}
              <div className="leaderboard-podium">
                <div className="podium-col podium-2">
                  <div className="podium-avatar av-color-2"><User size={24} /></div>
                  <div className="podium-rank-badge rank-2">2</div>
                  <span className="podium-name">Alex Rivera</span>
                  <span className="podium-xp">950 XP</span>
                </div>
                <div className="podium-col podium-1">
                  <div className="podium-avatar av-color-1"><User size={30} /></div>
                  <div className="podium-rank-badge rank-1">1</div>
                  <span className="podium-name">Elena Rostova</span>
                  <span className="podium-xp">1,200 XP</span>
                </div>
                <div className="podium-col podium-3">
                  <div className="podium-avatar av-color-3"><User size={24} /></div>
                  <div className="podium-rank-badge rank-3">3</div>
                  <span className="podium-name">Marcus Vance</span>
                  <span className="podium-xp">890 XP</span>
                </div>
              </div>

              {/* Ranking Table */}
              <div className="hub-lessons-table-wrap">
                <table className="hub-lessons-table leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Explorer</th>
                      <th>Specialty</th>
                      <th>Current Station</th>
                      <th>Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 4, name: 'Clara Oswald', specialty: 'Algorithms', station: 'Algorithm Arena', xp: 820 },
                      { rank: 5, name: 'Danny Pink', specialty: 'Security', station: 'Cyber Security Center', xp: 790 },
                      { rank: 6, name: 'River Song', specialty: 'Quantum Math', station: 'Function Observatory', xp: 750 },
                      { rank: 7, name: 'Rory Williams', specialty: 'Data Structures', station: 'Data Center', xp: 710 },
                      { rank: 8, name: 'Stella Walton (You)', specialty: 'Junior Engineer', station: activeBuilding.title, xp: userData?.xp || 650, isUser: true },
                      { rank: 9, name: 'Amy Pond', specialty: 'Pattern Analysis', station: 'Pattern Academy', xp: 620 },
                      { rank: 10, name: 'Jack Harkness', specialty: 'Probability', station: 'Probability Lab', xp: 580 },
                    ].map(player => (
                      <tr key={player.rank} className={`leaderboard-row ${player.isUser ? 'row-current-user' : ''}`}>
                        <td className="col-rank">#{player.rank}</td>
                        <td className="col-explorer">
                          <div className="explorer-profile-cell">
                            <span className={`explorer-avatar-bullet ${player.isUser ? 'av-user-bullet' : 'av-other-bullet'}`} />
                            <span>{player.name}</span>
                          </div>
                        </td>
                        <td>{player.specialty}</td>
                        <td>{player.station}</td>
                        <td className="col-xp-val">{player.xp} XP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {currentActiveMenu === 'achievements' && (
            <section className="hub-section achievements-page">
              <div className="hub-section-title-wrap">
                <h2 className="hub-section-heading">Explorer Credentials</h2>
                <span className="hub-section-subtitle">View your unlocked academic badges and milestones</span>
              </div>

              <div className="achievements-grid">
                {[
                  { id: 1, title: 'Equation Master', desc: 'Solved 15 linear equations successfully.', icon: 'Trophy', unlocked: true, color: '#f1c40f' },
                  { id: 2, title: 'Loop Specialist', desc: 'Nested three loops without errors.', icon: 'Zap', unlocked: true, color: '#00b894' },
                  { id: 3, title: 'Logic Gatekeeper', desc: 'Decoded Prime Numbers encryption logic.', icon: 'Award', unlocked: false, color: '#e74c3c' },
                  { id: 4, title: 'Data Visualizer', desc: 'Read 20 statistical charts on Data Center.', icon: 'TrendingUp', unlocked: true, color: '#f59e0b' },
                  { id: 5, title: 'Quantum Theorist', desc: 'Complete Polynomials Observatory course.', icon: 'Sparkles', unlocked: false, color: '#8b5cf6' },
                  { id: 6, title: 'Cyber Defender', desc: 'Unlock Modular Cryptography credentials.', icon: 'Lock', unlocked: false, color: '#bdc3c7' },
                ].map(ach => (
                  <div key={ach.id} className={`achievement-badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="badge-icon-wrap" style={{ '--badge-theme-color': ach.unlocked ? ach.color : '#7f8c8d' }}>
                      <LessonIcon name={ach.icon} size={28} />
                    </div>
                    <div className="badge-details">
                      <h4>{ach.title}</h4>
                      <p>{ach.desc}</p>
                      <span className="badge-status-tag">
                        {ach.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Table Footer Credits */}
          <footer className="hub-content-footer">
            <p>© 2026 MathVerse Academy. Guided by Antigravity Design System.</p>
          </footer>
        </main>

        {/* ============================================================
           COLUMN 3: RIGHT SIDEBAR
           ============================================================ */}
        <aside className="hub-right-sidebar">

          {/* Profile Widget */}
          <div className="hub-profile-panel">
            <div className="profile-panel-top">
              <Avatar color={userData?.avatarColor || "#9b7bea"} size={64} />
              <div className="profile-panel-details">
                <h3 className="profile-name">{userData?.name || 'Stella Walton'}</h3>
                <span className="profile-role">Math Explorer • {userData?.ageRange || 'Junior Engineer'}</span>
              </div>
            </div>

            <div className="profile-panel-xp">
              <div className="xp-label-row">
                <span>XP PROGRESS</span>
                <span>{userData?.xp || 650} / 1000 XP</span>
              </div>
              <div className="xp-track-bar">
                <div className="xp-fill-bar" style={{ width: `${(userData?.xp || 650) / 10}%` }} />
              </div>
            </div>

            <button className="profile-action-btn" onClick={onOpenProfile}>
              Explorer Profile
            </button>
          </div>

          {/* Calendar Widget (June 2026 starting on Monday) */}
          <div className="hub-calendar-panel">
            <div className="calendar-header">
              <h4 className="calendar-month-title">June 2026</h4>
              <div className="calendar-nav-arrows">
                <button className="cal-arrow-btn"><ChevronLeft size={14} /></button>
                <button className="cal-arrow-btn"><ChevronRight size={14} /></button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="calendar-weekdays-row">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Calendar Days */}
            <div className="calendar-days-grid">
              {calendarDays.map((day) => {
                const isCurrentDay = day === 14;
                return (
                  <span
                    key={day}
                    className={`calendar-day-cell ${isCurrentDay ? 'active-day' : ''}`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Daily Quests List */}
          <div className="hub-quests-panel">
            <div className="quests-panel-header">
              <h4 className="quests-panel-title">Daily Quests</h4>
              <span className="quests-panel-reset">Resets in 12h</span>
            </div>

            <div className="quests-list">
              {challenges.map(quest => (
                <div key={quest.id} className="quest-item-card">
                  <div className="quest-bell-box">
                    <Bell size={14} className={quest.completed ? 'bell-dimmed' : 'bell-alert'} />
                  </div>
                  <div className="quest-item-details">
                    <h5 className={`quest-item-title ${quest.completed ? 'quest-completed' : ''}`}>
                      {quest.title}
                    </h5>
                    <span className="quest-item-xp">+{quest.xp} XP</span>
                  </div>
                  <span className={`quest-item-status-tag ${quest.completed ? 'claimed' : 'active'}`}>
                    {quest.completed ? 'Claimed' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
      {showEducationOverview && (
        <EducationOverview onClose={() => setShowEducationOverview(false)} />
      )}
    </div>
  );
}
