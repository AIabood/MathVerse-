import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, Maximize, RotateCcw,
  Search, Bell, ArrowRight, User, BookOpen, Compass,
  Trophy, Award, Target, Settings, HelpCircle, LogOut,
  ChevronRight, CheckCircle2, Lock, Sparkles, FileText,
  Clock, Star, PlayCircle, ShieldAlert, Cpu, ArrowLeft
} from 'lucide-react';
import educationData from '../data/educationData.json';
import { staticFallbackData } from '../data/staticFallbackData';
import './LearningHub.css';
import './LearningScreen.css';
import Sidebar from './Sidebar';

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

export default function LearningScreen({ userData, onBack, onNavigateToDashboardTab, onBackToMap, onLogout, onStartLevel, activeCourseData, selectedBuilding }) {
  // Load education data
  let data = staticFallbackData;
  try {
    if (educationData && Object.keys(educationData).length > 0) {
      data = educationData;
    }
  } catch (e) {
    console.error("Failed to load education data in LearningScreen:", e);
  }

  // Find a fallback active course if none is provided
  const getFallbackCourse = () => {
    const subjectsList = data.subjects || [];
    for (let sub of subjectsList) {
      const currentCourse = (sub.courses || []).find(c => c.status === 'current');
      if (currentCourse) {
        return { ...currentCourse, subjectName: sub.name, subjectColor: sub.color, mentor: sub.mentor || "Nova Agent" };
      }
    }
    // Deep fallback
    if (subjectsList.length > 0 && subjectsList[0].courses.length > 0) {
      return { ...subjectsList[0].courses[0], subjectName: subjectsList[0].name, subjectColor: subjectsList[0].color, mentor: subjectsList[0].mentor || "Nova Agent" };
    }
    return null;
  };

  const [course, setCourse] = useState(() => {
    return activeCourseData || getFallbackCourse();
  });

  useEffect(() => {
    if (activeCourseData) {
      setCourse(activeCourseData);
    }
  }, [activeCourseData]);

  // Playlist Tabs state
  const [activeTab, setActiveTab] = useState('videos'); // Keep for safety if references exist, but our new UI uses activeSubTab
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'author', 'faq', 'announcements', 'reviews'
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Accordion state
  const [expandedSections, setExpandedSections] = useState({ 0: true, 1: false, 2: false });
  const toggleSection = (idx) => {
    setExpandedSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Video player controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(15);
  const [videoDuration, setVideoDuration] = useState(300); // 5 mins in seconds
  const [volume, setVolume] = useState(80);
  const playIntervalRef = useRef(null);

  // Generate dynamic, realistic sub-lessons based on course details
  const getCourseLessons = (activeC) => {
    if (!activeC) return [];
    if (Array.isArray(activeC.lessons)) {
      return activeC.lessons.map((lesson, idx) => ({
        id: lesson.id || (idx + 1),
        title: lesson.title,
        status: lesson.status || 'locked',
        xp: lesson.xp || Math.round(activeC.xp / activeC.lessons.length),
        duration: lesson.duration || '5 Min',
        icon: lesson.icon || 'BookOpen'
      }));
    }
    const count = typeof activeC.lessons === 'number' ? activeC.lessons : 3;
    const lessonTitles = [
      "Foundational Principles & Core Systems",
      "Interactive Operational Sandbox",
      "Mathematical Synthesis & Logic Gates",
      "Advanced Algorithmic Modeling",
      "Practice Verification Assessment",
      "Final Capstone Review Challenge",
      "System Verification Project"
    ];
    
    return Array.from({ length: count }, (_, idx) => {
      const isCompleted = idx < (activeC.completedLessons || 0);
      const isCurrent = idx === (activeC.completedLessons || 0) && activeC.status === 'current';
      const isLocked = idx > (activeC.completedLessons || 0) && activeC.status !== 'completed';
      
      return {
        id: idx + 1,
        title: `${activeC.title} - Module 0${idx + 1}: ${lessonTitles[idx] || 'Specialized Topic'}`,
        status: isCompleted ? 'completed' : isCurrent ? 'current' : isLocked ? 'locked' : 'unlocked',
        xp: Math.round(activeC.xp / count),
        duration: `${Math.round(parseInt(activeC.duration) / count) || 5} Min`
      };
    });
  };

  const activeLessons = getCourseLessons(course);
  const activeLesson = activeLessons[selectedLessonIndex] || activeLessons[0] || null;

  // Group lessons into 3 accordion sections
  const groupLessonsToSections = (lessonsList) => {
    if (!lessonsList || lessonsList.length === 0) return [];
    
    const parseDuration = (dStr) => {
      const num = parseInt(dStr) || 5;
      return num;
    };

    if (lessonsList.length <= 3) {
      return [
        {
          title: "01: Intro & Foundations",
          duration: `${lessonsList.reduce((acc, curr) => acc + parseDuration(curr.duration), 0)} min`,
          lessons: lessonsList.map((l, idx) => ({ ...l, globalIndex: idx }))
        },
        {
          title: "02: Intermediate Sandbox Operations",
          duration: "0 min",
          lessons: []
        },
        {
          title: "03: Final Capstone Assessment",
          duration: "0 min",
          lessons: []
        }
      ];
    }

    const firstCount = Math.max(1, Math.floor(lessonsList.length / 3));
    const secondCount = Math.max(1, Math.floor((lessonsList.length - firstCount) / 2));
    
    const sec1Lessons = lessonsList.slice(0, firstCount).map((l, idx) => ({ ...l, globalIndex: idx }));
    const sec2Lessons = lessonsList.slice(firstCount, firstCount + secondCount).map((l, idx) => ({ ...l, globalIndex: firstCount + idx }));
    const sec3Lessons = lessonsList.slice(firstCount + secondCount).map((l, idx) => ({ ...l, globalIndex: firstCount + secondCount + idx }));

    const sec1Duration = sec1Lessons.reduce((acc, curr) => acc + parseDuration(curr.duration), 0);
    const sec2Duration = sec2Lessons.reduce((acc, curr) => acc + parseDuration(curr.duration), 0);
    const sec3Duration = sec3Lessons.reduce((acc, curr) => acc + parseDuration(curr.duration), 0);

    return [
      {
        title: "01: Intro & Foundations",
        duration: `${sec1Duration} min`,
        lessons: sec1Lessons
      },
      {
        title: "02: Practical Sandbox Operations",
        duration: `${sec2Duration} min`,
        lessons: sec2Lessons
      },
      {
        title: "03: Final Capstone Assessment",
        duration: `${sec3Duration} min`,
        lessons: sec3Lessons
      }
    ];
  };

  const sectionsData = groupLessonsToSections(activeLessons);

  // Video play simulation
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(playIntervalRef.current);
            return 100;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
  }, [isPlaying]);

  // Reset video player state when switching lessons
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(10 + selectedLessonIndex * 15);
  }, [selectedLessonIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentSeconds = (videoProgress / 100) * videoDuration;

  const handleSidebarNavigate = (item) => {
    if (item === 'learning') {
      // already here
    } else if (item === 'pathways') {
      onBackToMap();
    } else {
      onNavigateToDashboardTab(item);
    }
  };

  return (
    <div className="learning-hub learning-workspace-view">
      {/* Soft Decorative Bubbles */}
      <div className="hub-decor-bubbles">
        <div className="hub-bubble hub-bubble--1" />
        <div className="hub-bubble hub-bubble--2" />
        <div className="hub-bubble hub-bubble--3" />
        <div className="hub-bubble hub-bubble--4" />
        <div className="hub-bubble hub-bubble--5" />
      </div>

      {/* Main Grid Layout */}
      <div className="hub-layout-grid">
        
        {/* ============================================================
           COLUMN 1: SIDEBAR (Reusable component)
           ============================================================ */}
        <Sidebar activeItem="learning" onNavigate={handleSidebarNavigate} onBack={onBack} />

        {/* ============================================================
           COLUMN 2: MAIN PANEL (VIDEO PLAYER & SUB-TABS)
           ============================================================ */}
        <main className="hub-main-panel ls-workspace-left">
          {/* Header Panel (Navbar) */}
          <header className="hub-panel-header">
            <div className="hub-search-box">
              <Search size={18} className="search-box-icon" />
              <input type="text" placeholder="Search subjects, levels..." className="search-box-input" />
            </div>

            <div className="hub-header-meta">
              <button className="hub-back-btn" onClick={onBack} title="Return to Tech City">
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

          {/* Breadcrumbs */}
          <div className="ls-breadcrumbs" style={{ marginTop: '8px' }}>
            <span className="ls-breadcrumb-item" onClick={() => onNavigateToDashboardTab('dashboard')}>Courses</span>
            <ChevronRight size={12} />
            <span className="ls-breadcrumb-item" onClick={onBackToMap}>{course?.subjectName || "Subject"}</span>
            <ChevronRight size={12} />
            <span className="ls-breadcrumb-active">{course?.title || "Active Course"}</span>
          </div>

          {/* Redesigned Course Title / Badge Header Section */}
          <div className="ls-course-header-row">
            <div className="ls-course-header-left">
              <button className="hub-back-btn" onClick={onBackToMap} title="Back to Roadmap" style={{ marginRight: '8px', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <ArrowLeft size={16} />
              </button>
              <h2 className="ls-course-title">{course?.title || "Active Course"}</h2>
              <span className="ls-course-category-badge">{course?.subjectName || "Subject"}</span>
            </div>
            
            <div className="ls-course-header-right">
              <button className="ls-share-btn" onClick={() => alert("Shared course link!")}>Share</button>
              <button className="ls-enroll-btn" onClick={() => {
                if (onStartLevel && activeLesson) {
                  onStartLevel(activeLesson);
                }
              }}>
                <Play size={12} fill="currentColor" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                <span>Enroll Now</span>
              </button>
            </div>
          </div>

          {/* Meta Strip */}
          <div className="ls-course-meta-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlayCircle size={14} style={{ color: '#6c5ce7' }} />
              <span>{activeLessons.length} lessons</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} />
              <span>{course?.duration || "4h 30min"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} fill="#f5a623" color="#f5a623" />
              <span>4.5 (126 reviews)</span>
            </div>
          </div>

          {/* Interactive Video Player */}
          <div className="ls-video-container">
            {isPlaying ? (
              <div className="ls-video-playing-screen">
                <div className="ls-video-poster-math-art">
                  <svg className="ls-math-graph-animation" viewBox="0 0 400 200">
                    <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <line x1="200" y1="0" x2="200" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <path 
                      d={`M 0 ${100 + Math.sin(videoProgress / 5) * 30} L 50 ${100 + Math.sin((videoProgress + 10) / 5) * 30} L 100 ${100 + Math.sin((videoProgress + 20) / 5) * 30} L 150 ${100 + Math.sin((videoProgress + 30) / 5) * 30} L 200 ${100 + Math.sin((videoProgress + 40) / 5) * 30} L 250 ${100 + Math.sin((videoProgress + 50) / 5) * 30} L 300 ${100 + Math.sin((videoProgress + 60) / 5) * 30} L 350 ${100 + Math.sin((videoProgress + 70) / 5) * 30} L 400 ${100 + Math.sin((videoProgress + 80) / 5) * 30}`}
                      fill="none" 
                      stroke="#6c5ce7" 
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="100" r={40 + Math.sin(videoProgress/10) * 10} fill="none" stroke="#e85d75" strokeWidth="1.5" strokeDasharray="5,5" />
                    <text x="20" y="30" fill="rgba(255,255,255,0.4)" fontSize="10">f(x) = sin(x) + cos(x)</text>
                    <text x="320" y="180" fill="rgba(255,255,255,0.4)" fontSize="10">θ = {Math.round(videoProgress * 3.6)}°</text>
                  </svg>
                </div>
                <div className="ls-video-overlay-tint" />
              </div>
            ) : (
              <div 
                className="ls-video-poster"
                style={{
                  background: `linear-gradient(135deg, ${course?.subjectColor || '#6c5ce7'}aa, #09090f)`
                }}
              >
                <div className="ls-video-overlay-tint" />
                
                <div className="ls-video-poster-math-art">
                  <div className="ls-math-formula-grid">
                    <div>f(x) = dx/dy</div>
                    <div>A = πr²</div>
                    <div>a² + b² = c²</div>
                    <div>∑(x_i - μ)²</div>
                    <div>log(ab)</div>
                    <div>x = -b ± √D</div>
                  </div>
                </div>

                <div className="ls-video-play-btn" onClick={() => setIsPlaying(true)}>
                  <Play size={32} fill="currentColor" />
                </div>
              </div>
            )}

            {/* Custom Video Controls */}
            <div className="ls-video-controls">
              <div className="ls-video-seekbar-container" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                setVideoProgress(pct);
              }}>
                <div className="ls-video-seekbar-fill" style={{ width: `${videoProgress}%` }}>
                  <div className="ls-video-seekbar-handle" />
                </div>
              </div>

              <div className="ls-video-buttons-row">
                <div className="ls-video-buttons-left">
                  <button className="ls-video-icon-btn" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                  <button className="ls-video-icon-btn" onClick={() => setVideoProgress(0)}>
                    <RotateCcw size={16} />
                  </button>
                  <span className="ls-video-time-str">
                    {formatTime(currentSeconds)} / {formatTime(videoDuration)}
                  </span>
                </div>

                <div className="ls-video-buttons-right">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Volume2 size={16} />
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={volume} 
                      onChange={(e) => setVolume(e.target.value)}
                      style={{ width: '60px', height: '3px', accentColor: '#6c5ce7', cursor: 'pointer' }}
                    />
                  </div>
                  <button className="ls-video-icon-btn" onClick={() => alert("Fullscreen video mode enabled")}>
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tabs row below video player */}
          <div className="ls-tabs-container">
            <button 
              className={`ls-tab-nav-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`ls-tab-nav-btn ${activeSubTab === 'author' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('author')}
            >
              Author
            </button>
            <button 
              className={`ls-tab-nav-btn ${activeSubTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('faq')}
            >
              FAQ
            </button>
            <button 
              className={`ls-tab-nav-btn ${activeSubTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('announcements')}
            >
              Announcements
            </button>
            <button 
              className={`ls-tab-nav-btn ${activeSubTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Active Tab Content Box */}
          <div className="ls-tab-content-box">
            {activeSubTab === 'overview' && (
              <div>
                <h3 className="ls-about-header">About Course</h3>
                <p className="ls-about-desc">
                  {course?.description || "Unlock the full potential of MathVerse structures with our comprehensive learning path modules. Perfect for junior explorers and senior systems architects, this level guides you through mathematical logic patterns, formula configurations, and verification sandboxes to boost your academic and procedural engineering capabilities."}
                </p>
                
                <h3 className="ls-about-header">What You'll Learn</h3>
                <div className="ls-learn-grid">
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Setting up the environment</span>
                  </div>
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Understand formula programming</span>
                  </div>
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Advanced procedural practices</span>
                  </div>
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Code and evaluate expressions</span>
                  </div>
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Build functional models & projects</span>
                  </div>
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Start solving complex logical equations</span>
                  </div>
                  <div className="ls-learn-item">
                    <CheckCircle2 className="ls-check-icon" size={16} />
                    <span>Responsive system configurations</span>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'author' && (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div className="ls-author-photo" style={{ width: '60px', height: '60px', borderRadius: '16px', fontSize: '1.8rem', flexShrink: 0 }}>
                  {course?.subjectName?.toLowerCase().includes('algebra') ? '🤖' :
                   course?.subjectName?.toLowerCase().includes('geometry') ? '🧙‍♂️' :
                   course?.subjectName?.toLowerCase().includes('data') ? '👩‍💻' :
                   course?.subjectName?.toLowerCase().includes('ai') ? '🤖' :
                   course?.subjectName?.toLowerCase().includes('security') || course?.subjectName?.toLowerCase().includes('cyber') ? '🛡️' : '🧠'}
                </div>
                <div>
                  <h3 className="ls-about-header" style={{ marginBottom: '4px' }}>{course?.mentor || "Crystal Lucas"}</h3>
                  <span className="ls-author-specialty" style={{ fontSize: '0.78rem', color: '#6c5ce7', fontWeight: 800 }}>Lead Academic Guide & System Architect</span>
                  <p className="ls-about-desc" style={{ marginTop: '12px', fontSize: '0.88rem' }}>
                    Dedicated expert in mathematical sciences and structural algorithm logic. Guides network calculations across multiple galaxies of MathVerse.
                  </p>
                </div>
              </div>
            )}

            {activeSubTab === 'faq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontWeight: 800, color: '#3a3a50', fontSize: '0.9rem', marginBottom: '4px' }}>Are there prerequisites for this level?</h4>
                  <p style={{ fontSize: '0.82rem', color: '#5c6275', lineHeight: 1.5 }}>No prerequisites are required; we start with the foundations of the subject and scale up.</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, color: '#3a3a50', fontSize: '0.9rem', marginBottom: '4px' }}>How can I earn maximum XP?</h4>
                  <p style={{ fontSize: '0.82rem', color: '#5c6275', lineHeight: 1.5 }}>Complete all practice quizzes with 100% accuracy to earn double bonus XP!</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 800, color: '#3a3a50', fontSize: '0.9rem', marginBottom: '4px' }}>Where can I use these mathematical concepts?</h4>
                  <p style={{ fontSize: '0.82rem', color: '#5c6275', lineHeight: 1.5 }}>These logic gates and algebraic formulations are utilized in building and securing systems across the Tech City.</p>
                </div>
              </div>
            )}

            {activeSubTab === 'announcements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(108, 92, 231, 0.05)', border: '1px solid rgba(108, 92, 231, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#6c5ce7' }}>SYSTEM UPGRADE</span>
                    <span style={{ fontSize: '0.72rem', color: '#7a829a', fontWeight: 700 }}>2 days ago</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#5c6275', lineHeight: 1.5, margin: 0 }}>New interactive sandbox tools have been added to this course! You can now verify equations in real-time.</p>
                </div>
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#3a3a50' }}>WELCOME TO MATHVERSE</span>
                    <span style={{ fontSize: '0.72rem', color: '#7a829a', fontWeight: 700 }}>1 week ago</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#5c6275', lineHeight: 1.5, margin: 0 }}>Share your progress on the global leaderboards. Connect with other explorers to solve logic gates.</p>
                </div>
              </div>
            )}

            {activeSubTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ff7675', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>JD</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#3a3a50' }}>Jane Doe</span>
                      <div style={{ display: 'flex', gap: '2px' }}><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /></div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#5c6275', margin: '4px 0 0 0', lineHeight: 1.4 }}>Extremely clear explanation! The visual models made the variables feel very intuitive.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#55efc4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00b894', fontWeight: 800, fontSize: '0.8rem' }}>AS</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#3a3a50' }}>Alex Smith</span>
                      <div style={{ display: 'flex', gap: '2px' }}><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#f5a623" color="#f5a623" /><Star size={10} fill="#d1d8e0" color="#d1d8e0" /></div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#5c6275', margin: '4px 0 0 0', lineHeight: 1.4 }}>Loved the interactive sandbox and quick quizzes. Recommending this to all explorers.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ============================================================
           COLUMN 3: RIGHT PANEL (Syllabus Accordion & Author Card)
           ============================================================ */}
        <aside className="hub-right-sidebar ls-workspace-right" style={{ padding: '24px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <h3 className="ls-syllabus-section-header">Course content</h3>
          
          <div className="ls-accordion-container">
            {sectionsData.map((section, sIdx) => {
              const isOpen = expandedSections[sIdx];
              return (
                <div key={sIdx} className="ls-accordion-item">
                  <div className="ls-accordion-header" onClick={() => toggleSection(sIdx)}>
                    <div className="ls-accordion-title-box">
                      <span className="ls-accordion-title">{section.title}</span>
                    </div>
                    <div className="ls-accordion-meta-box">
                      <span>{section.duration}</span>
                      <ChevronRight 
                        size={16} 
                        className={`ls-accordion-chevron ${isOpen ? 'open' : ''}`} 
                        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="ls-accordion-body">
                      {section.lessons.length === 0 ? (
                        <div style={{ padding: '12px', fontSize: '0.8rem', color: '#7a829a', fontStyle: 'italic', textAlign: 'center' }}>
                          No modules available
                        </div>
                      ) : (
                        section.lessons.map((lesson) => {
                          const isCompleted = lesson.status === 'completed';
                          const isLocked = lesson.status === 'locked';
                          const isCurrent = lesson.status === 'current' || (!isCompleted && !isLocked);
                          const globalIdx = lesson.globalIndex;
                          const isActive = globalIdx === selectedLessonIndex;

                          return (
                            <div 
                              key={lesson.id} 
                              className={`ls-accordion-lesson ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                              onClick={() => !isLocked && setSelectedLessonIndex(globalIdx)}
                            >
                              <div className="ls-accordion-lesson-left">
                                {isCompleted ? (
                                  <CheckCircle2 size={16} className="ls-check-icon" />
                                ) : isLocked ? (
                                  <Lock size={14} className="ls-accordion-lesson-icon" />
                                ) : (
                                  <Play size={14} className="ls-accordion-lesson-icon" fill="currentColor" />
                                )}
                                <span className="ls-accordion-lesson-title">{lesson.title.split(': ')[1] || lesson.title}</span>
                              </div>
                              <div className="ls-accordion-lesson-right">
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Author Card at bottom of sidebar */}
          <div className="ls-author-card">
            <h4 className="ls-author-card-header">Author</h4>
            <div className="ls-author-profile">
              <div className="ls-author-photo">
                {course?.subjectName?.toLowerCase().includes('algebra') ? '🤖' :
                 course?.subjectName?.toLowerCase().includes('geometry') ? '🧙‍♂️' :
                 course?.subjectName?.toLowerCase().includes('data') ? '👩‍💻' :
                 course?.subjectName?.toLowerCase().includes('ai') ? '🤖' :
                 course?.subjectName?.toLowerCase().includes('security') || course?.subjectName?.toLowerCase().includes('cyber') ? '🛡️' : '🧠'}
              </div>
              <div className="ls-author-name-box">
                <div className="ls-author-name-row">
                  <span className="ls-author-name">{course?.mentor || "Crystal Lucas"}</span>
                  <span style={{ color: '#3b82f6', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>✓</span>
                </div>
                <span className="ls-author-specialty">UI/UX Specialist</span>
              </div>
              <div className="ls-author-rating">
                <Star size={13} fill="#f5a623" color="#f5a623" />
                <span style={{ marginLeft: '4px' }}>4.8</span>
              </div>
            </div>
            <p className="ls-author-bio">
              {course?.mentor === "Nova Agent" 
                ? "Nova is an advanced AI educational guide specialized in procedural geometry, algorithmic networks, and spatial design." 
                : `${course?.mentor || "Crystal"} is a seasoned instructor with over 8 years of experience guiding explorers across digital systems.`
              }
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
