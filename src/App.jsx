import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeModal from './components/WelcomeModal';
import ProfileCreation from './components/ProfileCreation';
import WelcomeCard from './components/WelcomeCard';
import UserProfile from './components/UserProfile';

// Lazy-load heavy / 3D components to reduce initial bundle and improve startup
const AvatarBuilder = React.lazy(() => import('./components/AvatarBuilder'));
const FutureTechCity = React.lazy(() => import('./components/FutureTechCity'));
const SkyIsland = React.lazy(() => import('./components/SkyIsland'));
const SkillTree = React.lazy(() => import('./components/SkillTree'));
const QuizInterface = React.lazy(() => import('./components/QuizInterface'));
const LearningHub = React.lazy(() => import('./components/LearningHub'));
const LearningHubPage = React.lazy(() => import('./components/LearningHubPage'));
const LearningScreen = React.lazy(() => import('./components/LearningScreen'));

/* ── Mini Avatar Helper for Settings Box ── */
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
    ctx.fillStyle = "#f5c8a0"; ctx.beginPath(); ctx.ellipse(cx, cy - 4 * (size/90), 18 * (size/90), 20 * (size/90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(cx, cy - 16 * (size/90), 18 * (size/90), Math.PI, 0); ctx.fill();
    ctx.fillRect(cx - 18 * (size/90), cy - 26 * (size/90), 36 * (size/90), 12 * (size/90));
    ctx.fillStyle = "#5c3d11";
    ctx.beginPath(); ctx.ellipse(cx - 6 * (size/90), cy - 7 * (size/90), 2.5 * (size/90), 2 * (size/90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6 * (size/90), cy - 7 * (size/90), 2.5 * (size/90), 2 * (size/90), 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d4956a"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy + 2 * (size/90), 4 * (size/90), 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = safeColor; ctx.beginPath();
    ctx.moveTo(cx - 22 * (size/90), h); ctx.quadraticCurveTo(cx - 18 * (size/90), cy + 18 * (size/90), cx - 12 * (size/90), cy + 10 * (size/90));
    ctx.lineTo(cx + 12 * (size/90), cy + 10 * (size/90)); ctx.quadraticCurveTo(cx + 18 * (size/90), cy + 18 * (size/90), cx + 22 * (size/90), h); ctx.fill();
  }, [color, size]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: "50%", width: size, height: size, border: "2px solid rgba(255,255,255,0.85)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />;
};



function App() {
  const [cameraMode, setCameraMode] = useState('follow');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [currentStage, setCurrentStage] = useState(() => {
    const savedStage = localStorage.getItem('mathverse_stage');
    if (window.location.hash === '#/learning-hub' || window.location.pathname === '/learning-hub') {
      return 'learningHubPage';
    }
    // If user was previously in a transient state, reset to 'none' to show the city
    if (savedStage === 'none' || savedStage === 'skillTree' || savedStage === 'learningHub' || savedStage === 'quiz' || savedStage === 'learningHubPage') {
      return savedStage;
    }
    // If they already completed setup, default to none instead of showing cards again
    if (savedStage === 'card' || savedStage === 'profile' || savedStage === 'avatar') {
      return savedStage;
    }
    return savedStage || 'welcome';
  });

  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('mathverse_user');
    return savedData ? JSON.parse(savedData) : { name: 'Future Engineer' };
  });

  const [selectedBuildingData, setSelectedBuildingData] = useState(() => {
    const savedStage = localStorage.getItem('mathverse_stage');
    if (savedStage === 'skyIsland') {
      return { type: 'skyport', title: 'Explorer Gateway', color: '#00c8ff' };
    }
    return null;
  });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizBackStage, setQuizBackStage] = useState('learningHub');
  const [playerSpawn, setPlayerSpawn] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [profileBackStage, setProfileBackStage] = useState('none');
  const [activeHubTab, setActiveHubTab] = useState('dashboard');

  // Deterministic fade transition: black overlay fades to 1, scene switches, overlay fades to 0
  const handleTransition = useCallback((toStage, preSwitch) => {
    console.log('[Transition] START -> target:', toStage);
    setOverlayOpacity(1);
    setTimeout(() => {
      console.log('[Transition] SWITCHING to:', toStage);
      if (preSwitch) preSwitch();
      setCurrentStage(toStage);
      setTimeout(() => {
        console.log('[Transition] FADE-IN (opacity -> 0)');
        setOverlayOpacity(0);
      }, 100); // small tick so the new scene mounts before fade-in
    }, 600);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mathverse_user');
    localStorage.removeItem('mathverse_stage');
    setUserData({ name: 'Guest Explorer' });
    setCurrentStage('welcome');
  };

  const handleResetToWelcome = () => {
    localStorage.removeItem('mathverse_user');
    localStorage.removeItem('mathverse_stage');
    setUserData({ name: 'Future Engineer' });
    setSettingsOpen(false);
    setCurrentStage('welcome');
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/learning-hub' || window.location.pathname === '/learning-hub') {
        setCurrentStage('learningHubPage');
      } else if (hash === '#/learning-hub-dashboard') {
        setCurrentStage('learningHub');
      } else if (hash === '#/learning-screen') {
        setCurrentStage('learningScreen');
      } else if (hash === '#/skill-tree') {
        setCurrentStage('skillTree');
      } else if (hash === '#/sky-island') {
        setCurrentStage('skyIsland');
      } else if (hash === '#/quiz') {
        setCurrentStage('quiz');
      } else if (hash === '#/user-profile') {
        setCurrentStage('userProfile');
      } else if (hash === '' || hash === '#/') {
        const savedStage = localStorage.getItem('mathverse_stage');
        if (savedStage && savedStage !== 'welcome' && savedStage !== 'profile' && savedStage !== 'avatar' && savedStage !== 'card') {
          setCurrentStage('none');
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('mathverse_stage', currentStage);
    if (currentStage === 'learningHubPage') {
      window.location.hash = '#/learning-hub';
    } else if (currentStage === 'learningHub') {
      window.location.hash = '#/learning-hub-dashboard';
    } else if (currentStage === 'learningScreen') {
      window.location.hash = '#/learning-screen';
    } else if (currentStage === 'skillTree') {
      window.location.hash = '#/skill-tree';
    } else if (currentStage === 'skyIsland') {
      window.location.hash = '#/sky-island';
    } else if (currentStage === 'quiz') {
      window.location.hash = '#/quiz';
    } else if (currentStage === 'userProfile') {
      window.location.hash = '#/user-profile';
    } else if (currentStage === 'none') {
      window.location.hash = '#/';
    }
  }, [currentStage]);

  useEffect(() => {
    localStorage.setItem('mathverse_user', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    // If the page is refreshed, building data is lost. Reset back to the city.
    if ((currentStage === 'skillTree' || currentStage === 'learningHub' || currentStage === 'quiz' || currentStage === 'skyIsland' || currentStage === 'learningHubPage' || currentStage === 'learningScreen') && !selectedBuildingData) {
      console.log('[Safety] RESETTING from', currentStage, 'to none (selectedBuildingData is null)');
      setCurrentStage('none');
    }
  }, [currentStage, selectedBuildingData]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Background City - Visible only when not in a full-screen course/quiz */}
      {currentStage !== 'skillTree' && currentStage !== 'learningHub' && currentStage !== 'quiz' && currentStage !== 'skyIsland' && currentStage !== 'learningHubPage' && currentStage !== 'learningScreen' && (
        <Suspense fallback={null}>
          <FutureTechCity
          avatarColor={userData?.avatarColor}
          avatarGender={userData?.avatarGender}
          accessories={userData?.accessories}
          cameraMode={cameraMode}
          isNight={isNight}
          spawnPosition={playerSpawn}
          currentStage={currentStage}
          onEnterBuilding={(data) => {
            console.log('[Enter] Building data:', data?.type, data?.title);
            console.log('[Enter] Setting selectedBuildingData...');
            setSelectedBuildingData(data);
            if (data.type === 'skyport') {
              handleTransition('skyIsland');
            } else {
              console.log('[Enter] Calling handleTransition(learningHub)');
              handleTransition('learningHub', () => setPlayerSpawn(null));
            }
          }}
          />
        </Suspense>
      )}

      {/* Modals Overlay */}
      <AnimatePresence mode="wait">
        {currentStage === 'welcome' && (
          <WelcomeModal key="welcome"
            onCreateProfile={() => setCurrentStage('profile')}
            onGuest={() => setCurrentStage('none')}
          />
        )}

        {currentStage === 'profile' && (
          <ProfileCreation key="profile"
            onNext={(data) => {
              setUserData(data);
              setCurrentStage('avatar');
            }}
          />
        )}

        {currentStage === 'avatar' && (
          <Suspense fallback={null}>
            <AvatarBuilder key="avatar"
              onSave={(avatarData) => {
                setUserData(prev => ({ ...prev, ...avatarData }));
                setCurrentStage('card');
              }}
            />
          </Suspense>
        )}

        {currentStage === 'card' && (
          <WelcomeCard key="card"
            userData={userData}
            onEnter={() => setCurrentStage('none')}
          />
        )}

        {currentStage === 'learningHub' && (
          <Suspense fallback={null}>
            <LearningHub key="learningHub"
              userData={userData}
              selectedBuilding={selectedBuildingData}
              onChangeBuilding={setSelectedBuildingData}
              onBack={() => setCurrentStage('none')}
              activeMenu={activeHubTab}
              setActiveMenu={setActiveHubTab}
              onStartLevel={(level) => {
                setSelectedLevel(level);
                setQuizBackStage('learningHub');
                setCurrentStage('quiz');
              }}
              onOpenProfile={() => {
                setProfileBackStage('learningHub');
                setCurrentStage('userProfile');
              }}
            />
          </Suspense>
        )}

        {currentStage === 'learningHubPage' && (
          <Suspense fallback={null}>
            <LearningHubPage key="learningHubPage"
              userData={userData}
              selectedBuilding={selectedBuildingData}
              onBackToCity={() => setCurrentStage('none')}
              onNavigateToDashboardTab={(tab) => {
                setActiveHubTab(tab);
                setCurrentStage('learningHub');
              }}
              onLogout={handleLogout}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
                setCurrentStage('learningScreen');
              }}
              onNavigateToLearning={() => setCurrentStage('learningScreen')}
              activeCourse={selectedCourse}
            />
          </Suspense>
        )}

        {currentStage === 'learningScreen' && (
          <Suspense fallback={null}>
            <LearningScreen key="learningScreen"
              userData={userData}
              selectedBuilding={selectedBuildingData}
              onBack={() => setCurrentStage('none')}
              onNavigateToDashboardTab={(tab) => {
                setActiveHubTab(tab);
                setCurrentStage('learningHub');
              }}
              onBackToMap={() => setCurrentStage('learningHubPage')}
              onLogout={handleLogout}
              onStartLevel={(level) => {
                setSelectedLevel(level);
                setQuizBackStage('learningScreen');
                setCurrentStage('quiz');
              }}
              activeCourseData={selectedCourse}
            />
          </Suspense>
        )}

        {currentStage === 'skillTree' && (
          <Suspense fallback={null}>
            <SkillTree key="skillTree"
              building={selectedBuildingData}
              onBack={() => setCurrentStage('none')}
              onStartLevel={(level) => {
                setSelectedLevel(level);
                setCurrentStage('quiz');
              }}
            />
          </Suspense>
        )}

        {currentStage === 'skyIsland' && (
          <Suspense fallback={null}>
            <SkyIsland key="skyIsland"
              avatarColor={userData?.avatarColor}
              avatarGender={userData?.avatarGender}
              onBack={() => {
                handleTransition('none', () => setPlayerSpawn([-45, 0.82, 38]));
              }}
            />
          </Suspense>
        )}

        {currentStage === 'quiz' && (
          <Suspense fallback={null}>
            <QuizInterface key="quiz"
              building={selectedBuildingData}
              level={selectedLevel}
              onComplete={() => setCurrentStage(quizBackStage)}
              onExit={() => setCurrentStage(quizBackStage)}
            />
          </Suspense>
        )}

        {currentStage === 'userProfile' && (
          <UserProfile key="userProfile"
            userData={userData}
            onClose={() => setCurrentStage(profileBackStage)}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Settings / Persistent Player HUD */}
      {currentStage === 'none' && userData && (
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          {/* Main Settings Button */}
          <div
            style={{
              width: '50px', height: '50px',
              background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(12px)',
              borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(108, 92, 231, 0.08)', color: '#3a3a50'
            }}
            onClick={() => setSettingsOpen(!settingsOpen)}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 15px rgba(108, 92, 231, 0.25)'; e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = 'rgba(108, 92, 231, 0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(108, 92, 231, 0.08)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; }}
          >
            ⚙️
          </div>

          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '20px',
                  padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem',
                  boxShadow: '0 10px 30px rgba(108, 92, 231, 0.08), 0 1px 8px rgba(0,0,0,0.04)',
                  minWidth: '260px',
                  color: '#3a3a50',
                  fontFamily: "'Inter', 'Tajawal', sans-serif"
                }}
              >
                {/* Player Profile Section */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', padding: '0.6rem', borderRadius: '14px', transition: 'background 0.2s' }}
                  onClick={() => {
                    setProfileBackStage('none');
                    setCurrentStage('userProfile');
                    setSettingsOpen(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MiniAvatar color={userData?.avatarColor} size={42} />
                  <div>
                    <h3 style={{ margin: 0, color: '#3a3a50', fontSize: '1.05rem', fontWeight: 800 }}>{userData.name || 'Guest Explorer'}</h3>
                    <div style={{ color: '#6c5ce7', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '2px', letterSpacing: '1px' }}>
                      {userData.stage ? `STAGE: ${userData.ageRange}` : 'EXPLORER'}
                    </div>
                  </div>
                </div>

                {/* XP Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                    <span style={{ color: '#7c8ba1', fontWeight: 'bold', letterSpacing: '0.5px' }}>XP Progress</span>
                    <span style={{ color: '#6c5ce7', fontWeight: 'bold' }}>{userData.xp || 150} <span style={{ color: '#7c8ba1', fontWeight: 500 }}>/ 1000</span></span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${((userData.xp || 150) / 1000) * 100}%`, height: '100%', background: '#6c5ce7', boxShadow: '0 0 8px rgba(108, 92, 231, 0.4)' }}></div>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }}></div>

                {/* Camera Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#3a3a50', fontSize: '0.88rem', fontWeight: 700 }}>Camera View</span>
                  <button
                    onClick={() => setCameraMode(cameraMode === 'follow' ? 'topdown' : 'follow')}
                    style={{
                      background: 'rgba(108, 92, 231, 0.06)', border: '1px solid rgba(108, 92, 231, 0.3)',
                      color: '#6c5ce7', padding: '6px 14px', borderRadius: '18px',
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(108, 92, 231, 0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(108, 92, 231, 0.06)'; }}
                  >
                    {cameraMode === 'follow' ? '🔭 Follow' : '🚁 Top-Down'}
                  </button>
                </div>

                {/* Day / Night Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#3a3a50', fontSize: '0.88rem', fontWeight: 700 }}>Time of Day</span>
                  <button
                    onClick={() => setIsNight(n => !n)}
                    style={{
                      background: isNight ? 'rgba(108, 92, 231, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      border: isNight ? '1px solid rgba(108, 92, 231, 0.35)' : '1px solid rgba(245, 158, 11, 0.4)',
                      color: isNight ? '#6c5ce7' : '#d97706',
                      padding: '6px 14px', borderRadius: '18px',
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isNight ? 'rgba(108, 92, 231, 0.15)' : 'rgba(245, 158, 11, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isNight ? 'rgba(108, 92, 231, 0.08)' : 'rgba(245, 158, 11, 0.08)';
                    }}
                  >
                    {isNight ? '🌙 Night' : '☀️ Day'}
                  </button>
                </div>

                <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }}></div>

                {/* Logout Button */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <button
                    onClick={() => {
                      handleLogout();
                      setSettingsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444', padding: '10px 14px', borderRadius: '18px',
                      cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700,
                      fontFamily: "'Inter', 'Tajawal', sans-serif",
                      transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Fade Transition Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        opacity: overlayOpacity,
        transition: 'opacity 0.6s ease-in-out',
        pointerEvents: overlayOpacity > 0 ? 'all' : 'none',
        zIndex: 99999,
      }} />
    </div>
  );
}

export default App;
