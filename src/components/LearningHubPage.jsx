import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Award, Flame, Zap, BookOpen, TrendingUp, User,
  CheckCircle2, Clock, Lock, Play, ArrowLeft, Sparkles, Trophy,
  ChevronDown, ChevronUp, Menu, HelpCircle, FileText, ChevronRight,
  Compass, Bell, Search, LogOut, ArrowRight, PlayCircle,
  ShieldAlert, Cpu, Binary, Dices
} from 'lucide-react';
import educationData from '../data/educationData.json';
import { staticFallbackData } from '../data/staticFallbackData';
import './LearningHub.css';
import Sidebar from './Sidebar';

// Coordinates overlay mapping for up to 6 stations on 1000x520 virtual SVG canvas
const MAP_COORDINATES = [
  { x: 160, y: 360, left: '16%', top: '69%' },
  { x: 340, y: 170, left: '34%', top: '32%' },
  { x: 280, y: 430, left: '28%', top: '82%' },
  { x: 620, y: 260, left: '62%', top: '50%' },
  { x: 840, y: 400, left: '84%', top: '76%' },
  { x: 780, y: 150, left: '78%', top: '28%' }
];

// Frosted Canvas Avatar drawing (same helper function as other screens)
const MiniAvatar = ({ color = "#6c5ce7", size = 42 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const w = c.width, h = c.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    const safeColor = color || "#6c5ce7";
    const g = ctx.createRadialGradient(cx * 0.7, cy * 0.6, 5, cx, cy, cx);
    g.addColorStop(0, safeColor + "55"); g.addColorStop(1, safeColor + "aa");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f5c8a0"; ctx.beginPath(); ctx.ellipse(cx, cy - 4, 18 * (size / 90), 20 * (size / 90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(cx, cy - 16 * (size / 90), 18 * (size / 90), Math.PI, 0); ctx.fill();
    ctx.fillRect(cx - 18 * (size / 90), cy - 26 * (size / 90), 36 * (size / 90), 12 * (size / 90));
    ctx.fillStyle = "#5c3d11";
    ctx.beginPath(); ctx.ellipse(cx - 6 * (size / 90), cy - 7 * (size / 90), 2.5 * (size / 90), 2 * (size / 90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6 * (size / 90), cy - 7 * (size / 90), 2.5 * (size / 90), 2 * (size / 90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d4956a"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy + 2 * (size / 90), 4 * (size / 90), 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = safeColor; ctx.beginPath();
    ctx.moveTo(cx - 22 * (size / 90), h); ctx.quadraticCurveTo(cx - 18 * (size / 90), cy + 18 * (size / 90), cx - 12 * (size / 90), cy + 10 * (size / 90));
    ctx.lineTo(cx + 12 * (size / 90), cy + 10 * (size / 90)); ctx.quadraticCurveTo(cx + 18 * (size / 90), cy + 18 * (size / 90), cx + 22 * (size / 90), h); ctx.fill();
  }, [color, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: "50%", width: size, height: size, border: "2px solid rgba(255,255,255,0.85)" }} />;
};

// Dynamic Path Icon Component
const PathIcon = ({ name, size = 20, className = "" }) => {
  const icons = {
    Binary,
    BookOpen,
    Compass,
    Cpu,
    Dices,
    Lock,
    Search,
    ShieldAlert,
    Sparkles,
    Trophy,
    Zap
  };
  const Component = icons[name] || Compass;
  return <Component size={size} className={className} />;
};

export default function LearningHubPage({
  userData,
  selectedBuilding,
  onBackToCity,
  onNavigateToDashboardTab,
  onLogout,
  onSelectCourse,
  onNavigateToLearning,
  activeCourse
}) {
  // Gracefully load data, fallback to staticFallbackData if JSON fails
  let data = staticFallbackData;
  try {
    if (educationData && Object.keys(educationData).length > 0) {
      data = educationData;
    }
  } catch (e) {
    console.error("Failed to load education data from JSON in LearningHubPage:", e);
  }

  // Map three.js city building types to JSON subjects IDs
  const mapBuildingTypeToSubjectId = (type) => {
    const mapping = {
      code: 'algorithms',
      chemistry: 'probability',
      music: 'patterns',
      physics: 'physics'
    };
    return mapping[type] || type;
  };

  const subjectId = mapBuildingTypeToSubjectId(selectedBuilding?.type || 'algebra');
  const subjects = data.subjects || [];
  const activeSubject = subjects.find(sub => sub.id === subjectId) || subjects[0] || {};
  const paths = activeSubject.paths || [];

  // Active path campaign state
  const [activePathId, setActivePathId] = useState('');

  // Reset active path when entering a new building
  useEffect(() => {
    if (paths.length > 0) {
      setActivePathId(paths[0].id);
      setSelectedCourseState(null); // Reset detail panel on building/path swap
    }
  }, [selectedBuilding?.type, activeSubject.id]);

  const activePath = paths.find(p => p.id === activePathId) || paths[0];
  const activePathCourses = activePath?.courses || [];

  // Enforce progressive lock logic dynamically
  const getProgressiveCourses = () => {
    const result = [];
    let previousCompleted = true; // First course is available by default

    for (let idx = 0; idx < activePathCourses.length; idx++) {
      const courseItem = activePathCourses[idx];
      let computedStatus = courseItem.status || 'locked';

      if (!previousCompleted) {
        computedStatus = 'locked';
      } else if (computedStatus === 'locked') {
        computedStatus = 'available'; // promote to available if preceding was completed
      }

      result.push({
        ...courseItem,
        computedStatus
      });

      previousCompleted = (computedStatus === 'completed');
    }
    return result;
  };

  const filteredCourses = getProgressiveCourses();

  // Bottom Details Section references
  const [selectedCourseState, setSelectedCourseState] = useState(null);
  const detailsRef = useRef(null);

  // Auto-scroll logic when course node is clicked
  useEffect(() => {
    if (selectedCourseState && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedCourseState]);

  // Build SVG path coordinate connector line dynamically
  const buildSvgPath = () => {
    const pointsCount = Math.min(filteredCourses.length, MAP_COORDINATES.length);
    if (pointsCount === 0) return '';
    if (pointsCount === 1 && MAP_COORDINATES[0]) {
      return `M ${MAP_COORDINATES[0].x} ${MAP_COORDINATES[0].y}`;
    }
    return filteredCourses.slice(0, pointsCount).map((_, idx) => {
      const prefix = idx === 0 ? 'M' : 'L';
      const pt = MAP_COORDINATES[idx] || { x: 0, y: 0 };
      return `${prefix} ${pt.x} ${pt.y}`;
    }).join(' ');
  };

  const handleStationClick = (courseItem) => {
    if (courseItem.computedStatus === 'locked') {
      alert("⚠️ Locked Checkpoint! Complete preceding courses to unlock this simulation.");
      return;
    }
    setSelectedCourseState({
      ...courseItem,
      subjectName: activeSubject.name,
      subjectColor: activeSubject.color,
      mentor: activeSubject.mentor || "Nova Agent"
    });
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return '#4eca8b';
      case 'medium': return '#f5a623';
      case 'hard': return '#e85d75';
      case 'boss': return '#9b7bea';
      default: return '#7c8ba1';
    }
  };

  const handleSidebarNavigate = (item) => {
    if (item === 'pathways') {
      // already here
    } else if (item === 'learning') {
      if (selectedCourseState) {
        onSelectCourse(selectedCourseState);
      } else {
        onNavigateToLearning();
      }
    } else {
      onNavigateToDashboardTab(item);
    }
  };

  // Path metrics calculations
  const getPathCompletionPct = (p) => {
    if (!p.courses || p.courses.length === 0) return 0;
    const completed = p.courses.filter(c => c.status === 'completed').length;
    return Math.round((completed / p.courses.length) * 100);
  };

  const getPathTotalXp = (p) => {
    if (!p.courses) return 0;
    return p.courses.reduce((sum, c) => sum + c.xp, 0);
  };

  // Framer motion variants
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const nodeAnimation = {
    hidden: { opacity: 0, scale: 0.6, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 140, damping: 16 }
    }
  };

  return (
    <div className="learning-hub pathways-map-view">
      {/* Decorative Bubbles */}
      <div className="hub-decor-bubbles">
        <div className="hub-bubble hub-bubble--1" />
        <div className="hub-bubble hub-bubble--2" />
        <div className="hub-bubble hub-bubble--3" />
        <div className="hub-bubble hub-bubble--4" />
        <div className="hub-bubble hub-bubble--5" />
      </div>

      {/* Main Grid Layout - Right sidebar removed to allow full-width hero map */}
      <div className="hub-layout-grid right-collapsed">

        {/* ============================================================
           COLUMN 1: SIDEBAR
           ============================================================ */}
        <Sidebar activeItem="pathways" onNavigate={handleSidebarNavigate} onBack={onBackToCity} />

        {/* ============================================================
           COLUMN 2: MAIN PANEL
           ============================================================ */}
        <main className="hub-main-panel">
          {/* Header Panel */}
          <header className="hub-panel-header">
            <div className="hub-search-box">
              <Search size={18} className="search-box-icon" />
              <input type="text" placeholder="Search paths..." className="search-box-input" />
            </div>

            <div className="hub-header-meta">
              <button className="hub-back-btn" onClick={onBackToCity} title="Return to Tech City">
                <ArrowLeft size={16} /> <span>Back to City</span>
              </button>

              <div className="hub-profile-pill" onClick={() => alert("Open Profile Menu")}>
                <MiniAvatar color={userData?.avatarColor} size={32} />
                <div className="hub-profile-info">
                  <span className="hub-profile-name">{userData?.name || "Guest"}</span>
                  <span className="hub-profile-role">{userData?.ageRange || "Junior Engineer"}</span>
                </div>
              </div>

              <button className="hub-logout-btn" onClick={onLogout} title="Log Out">
                <LogOut size={16} /> <span>Logout</span>
              </button>
            </div>
          </header>

          <div className="hub-section">
            <div className="hub-section-title-wrap">
              <div>
                <h2 className="hub-section-heading">Campaign Operations Map</h2>
                <p style={{ fontSize: '0.82rem', color: '#7a829a', marginTop: '2px' }}>
                  Select an operation path card below to calibrate the constellation map grid nodes.
                </p>
              </div>
              <span className="map-environment-badge" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6c5ce7', background: 'rgba(108, 92, 231, 0.1)', padding: '4px 12px', borderRadius: '99px', border: '1px solid rgba(108, 92, 231, 0.18)' }}>
                Building: {activeSubject.name || "MathVerse Center"}
              </span>
            </div>

            {/* Path Selection Cards Row */}
            <div className="path-cards-container">
              {paths.map((p) => {
                const isActive = p.id === activePathId;
                const completion = getPathCompletionPct(p);
                const totalXp = getPathTotalXp(p);

                return (
                  <div
                    key={p.id}
                    className={`path-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActivePathId(p.id);
                      setSelectedCourseState(null);
                    }}
                  >
                    <div className="path-card-header">
                      <div className="path-card-icon-box">
                        <PathIcon name={p.icon || 'Compass'} size={20} />
                      </div>
                      <h3 className="path-card-title">{p.name}</h3>
                      <span className={`path-card-difficulty ${p.courses[p.courses.length - 1]?.difficulty?.toLowerCase() || 'easy'}`}>
                        {p.courses[p.courses.length - 1]?.difficulty || 'Easy'}
                      </span>
                    </div>

                    <p className="path-card-desc">{p.description}</p>

                    {/* Progress Track */}
                    <div className="path-card-progress-bar-wrap">
                      <div className="progress-header">
                        <span>Progression</span>
                        <span>{completion}%</span>
                      </div>
                      <div className="path-card-progress-track">
                        <div className="path-card-progress-fill" style={{ width: `${completion}%` }} />
                      </div>
                    </div>

                    <div className="path-card-stats-row">
                      <span>{p.courses.length} Missions</span>
                      <span className="path-card-xp">+{totalXp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Constellation Map Scroll Wrapper */}
            <div className="map-board-scroll-wrapper">
              <div className="mathverse-map-board">
                {/* SVG Constellation Trails */}
                <svg className="map-svg-trail" viewBox="0 0 1000 520" preserveAspectRatio="none">
                  <defs>
                    <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="blur-large">
                      <feGaussianBlur stdDeviation="40" />
                    </filter>
                  </defs>

                  <circle cx="280" cy="300" r="150" fill={activeSubject.color || "#6c5ce7"} opacity="0.03" filter="url(#blur-large)" />
                  <circle cx="720" cy="200" r="170" fill="#00b894" opacity="0.03" filter="url(#blur-large)" />

                  {/* Dynamic Glowing Pathway line with Framer Motion pathLength draw */}
                  {filteredCourses.length > 0 && (
                    <g key={activePathId}>
                      <path
                        d={buildSvgPath()}
                        fill="none"
                        stroke="rgba(108, 92, 231, 0.1)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <motion.path
                        d={buildSvgPath()}
                        fill="none"
                        stroke="rgba(108, 92, 231, 0.45)"
                        strokeWidth="3.5"
                        strokeDasharray="10, 10"
                        strokeLinecap="round"
                        className="glowing-map-path"
                        filter="url(#glow-heavy)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3.5, ease: "easeInOut" }}
                      />
                    </g>
                  )}
                </svg>

                {/* Progressive entrance stagger layout for Node cards */}
                <motion.div
                  key={activePathId}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                >
                  {filteredCourses.slice(0, MAP_COORDINATES.length).map((courseItem, idx) => {
                    const coord = MAP_COORDINATES[idx] || { left: '0%', top: '0%' };
                    const isSelected = selectedCourseState && selectedCourseState.id === courseItem.id;
                    const isCompleted = courseItem.computedStatus === 'completed';
                    const isLocked = courseItem.computedStatus === 'locked';
                    const isCurrent = courseItem.computedStatus === 'current';
                    const isBoss = courseItem.isBoss || courseItem.difficulty?.toLowerCase() === 'boss';

                    return (
                      <motion.div
                        key={courseItem.id}
                        className={`map-station-container ${isSelected ? 'selected' : ''}`}
                        style={{ left: coord.left, top: coord.top }}
                        variants={nodeAnimation}
                      >
                        {/* Anchor rings */}
                        <div className="map-station-anchor">
                          <div className={`pulsing-ring ${isBoss ? 'ring-boss' :
                              isCompleted ? 'ring-green' :
                                isCurrent ? 'ring-active' :
                                  isLocked ? 'ring-locked' : 'ring-available'
                            }`} />
                          <div className={`anchor-center-dot ${isBoss ? 'dot-boss' :
                              isCompleted ? 'dot-green' :
                                isCurrent ? 'dot-active' :
                                  isLocked ? 'dot-locked' : 'dot-available'
                            }`} />
                        </div>

                        {/* Node Card */}
                        <motion.div
                          className={`map-station-card ${isLocked ? 'locked' : ''} ${isCurrent ? 'active-current' : ''} ${isBoss ? 'boss-station' : ''}`}
                          onClick={() => handleStationClick(courseItem)}
                          whileHover={{ y: -5, scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                          style={{
                            borderColor: isSelected ? (activeSubject.color || '#6c5ce7') : isBoss ? '#e85d75' : 'rgba(255, 255, 255, 0.55)',
                            background: isSelected ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.75)',
                            boxShadow: isSelected ? `0 10px 24px rgba(108, 92, 231, 0.15)` : '0 6px 18px rgba(0, 0, 0, 0.03)'
                          }}
                        >
                          {/* Bouncing Player Avatar figure sitting on top border of card */}
                          {isCurrent && (
                            <div className="map-avatar-stand">
                              <div className="avatar-capsule">
                                <MiniAvatar color={userData?.avatarColor} size={30} />
                                <span className="avatar-lbl">YOU</span>
                              </div>
                              <div className="avatar-stand-base" />
                            </div>
                          )}

                          <div className="station-card-top">
                            <span className="station-number" style={{ color: isSelected ? (activeSubject.color || '#6c5ce7') : '#a0a8b8' }}>
                              {isBoss ? 'BOSS' : `0${idx + 1}`}
                            </span>
                            <span className="station-difficulty" style={{ color: getDifficultyColor(courseItem.difficulty) }}>
                              {courseItem.difficulty}
                            </span>
                          </div>
                          <h4 style={{ color: '#3a3a50', fontWeight: 800 }}>{courseItem.title}</h4>
                          <div className="station-card-bottom">
                            <span className="station-xp" style={{ color: activeSubject.color || '#6c5ce7' }}>+{courseItem.xp} XP</span>
                            <span className={`station-status ${courseItem.computedStatus}`}>
                              {isCompleted && <CheckCircle2 size={11} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                              {isCurrent && <Play size={10} fill="currentColor" style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                              {isLocked && <Lock size={10} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                              {!isCompleted && !isCurrent && !isLocked && <Sparkles size={10} style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }} />}
                              <span style={{ verticalAlign: 'middle' }}>{courseItem.computedStatus}</span>
                            </span>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>

            {/* Course Details section below map */}
            <AnimatePresence>
              {selectedCourseState && (
                <motion.section
                  ref={detailsRef}
                  className="course-details-section"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <div className="course-details-container">

                    {/* Left details/intel column */}
                    <div className="details-briefing-box">
                      <div className="details-briefing-title-row">
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6c5ce7', letterSpacing: '1px' }}>MISSION PARAMETERS BRIEFING</span>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#3a3a50' }}>{selectedCourseState.title}</h2>
                      </div>

                      <div className="details-badge-row">
                        <span className="details-badge details-badge-xp">+{selectedCourseState.xp} XP Reward</span>
                        <span className="details-badge details-badge-duration">{selectedCourseState.duration} Duration</span>
                        <span className={`details-badge details-badge-difficulty ${selectedCourseState.difficulty?.toLowerCase() === 'boss' ? 'boss' : ''}`}>
                          {selectedCourseState.difficulty} Level
                        </span>
                      </div>

                      <p className="details-briefing-desc">
                        {selectedCourseState.description || "Deploy to the sandbox matrix and resolve standard operational queries. Evaluate calculation systems, verify modular parameters, and obtain real-time feedback."}
                      </p>

                      <div className="details-action-bar">
                        <button className="details-btn-start" onClick={() => handleStartLearning(selectedCourseState)}>
                          <PlayCircle size={16} fill="currentColor" />
                          <span>Start Learning Workspace</span>
                        </button>
                        <button className="details-btn-close" onClick={() => setSelectedCourseState(null)}>
                          Close Intelligence Briefing
                        </button>
                      </div>
                    </div>

                    {/* Right lessons checklist column */}
                    <div className="details-lessons-box">
                      <div className="details-lessons-header">
                        <h3>Operations Syllabus ({selectedCourseState.lessons?.length || 0} Modules)</h3>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7a829a' }}>Calibrated</span>
                      </div>

                      <div className="details-lessons-list">
                        {(selectedCourseState.lessons || []).map((lesson, index) => {
                          const isL = lesson.status === 'locked';
                          const isC = lesson.status === 'completed';
                          const isCur = lesson.status === 'current';

                          return (
                            <div key={lesson.id} className={`details-lesson-item ${isL ? 'locked' : ''}`}>
                              <div className="details-lesson-left">
                                <div className="details-lesson-icon">
                                  <PathIcon name={lesson.icon || 'BookOpen'} size={14} />
                                </div>
                                <span className="details-lesson-title">Module 0{index + 1}: {lesson.title}</span>
                              </div>
                              <div className="details-lesson-right">
                                <Clock size={12} />
                                <span>{lesson.duration}</span>
                                <span className={`details-lesson-badge ${isC ? 'completed' : isCur ? 'current' : 'locked'}`}>
                                  {lesson.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </motion.section>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
