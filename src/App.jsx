import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroScene from './components/HeroScene';
import WelcomeModal from './components/WelcomeModal';
import ProfileCreation from './components/ProfileCreation';
import AvatarBuilder from './components/AvatarBuilder';
import WelcomeCard from './components/WelcomeCard';
import FutureTechCity from './components/FutureTechCity';
import SkillTree from './components/SkillTree';
import QuizInterface from './components/QuizInterface';
import UserProfile from './components/UserProfile';

function App() {
  const [cameraMode, setCameraMode] = useState('follow');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(() => {
    const savedStage = localStorage.getItem('mathverse_stage');
    // If user was previously in a transient state, reset to 'none' to show the city
    if (savedStage === 'none' || savedStage === 'skillTree' || savedStage === 'quiz') {
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

  const [selectedBuildingData, setSelectedBuildingData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('mathverse_user');
    localStorage.removeItem('mathverse_stage');
    setUserData({ name: 'Guest Explorer' });
    setCurrentStage('welcome');
  };

  useEffect(() => {
    localStorage.setItem('mathverse_stage', currentStage);
  }, [currentStage]);

  useEffect(() => {
    localStorage.setItem('mathverse_user', JSON.stringify(userData));
  }, [userData]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Background City - Always Visible */}
      <FutureTechCity
        avatarColor={userData?.avatarColor}
        avatarGender={userData?.avatarGender}
        accessories={userData?.accessories}
        cameraMode={cameraMode}
        onEnterBuilding={(data) => {
          setSelectedBuildingData(data);
          setCurrentStage('skillTree');
        }}
      />

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
          <AvatarBuilder key="avatar"
            onSave={(avatarData) => {
              setUserData(prev => ({ ...prev, ...avatarData }));
              setCurrentStage('card');
            }}
          />
        )}

        {currentStage === 'card' && (
          <WelcomeCard key="card"
            userData={userData}
            onEnter={() => setCurrentStage('none')}
          />
        )}

        {currentStage === 'skillTree' && (
          <SkillTree key="skillTree"
            building={selectedBuildingData}
            onBack={() => setCurrentStage('none')}
            onStartLevel={(level) => {
              setSelectedLevel(level);
              setCurrentStage('quiz');
            }}
          />
        )}

        {currentStage === 'quiz' && (
          <QuizInterface key="quiz"
            building={selectedBuildingData}
            level={selectedLevel}
            onComplete={() => setCurrentStage('skillTree')}
            onExit={() => setCurrentStage('skillTree')}
          />
        )}

        {currentStage === 'userProfile' && (
          <UserProfile key="userProfile"
            userData={userData}
            onClose={() => setCurrentStage('none')}
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
              background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(10px)',
              borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)', color: '#fff'
            }}
            onClick={() => setSettingsOpen(!settingsOpen)}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 15px #00f0ff'; e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = '#00f0ff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
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
                  background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                  padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)', minWidth: '250px'
                }}
              >
                {/* Player Profile Section */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', padding: '0.5rem', borderRadius: '12px', transition: 'background 0.2s' }}
                     onClick={() => { setCurrentStage('userProfile'); setSettingsOpen(false); }}
                     onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                     onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '45px', height: '45px', background: '#00f0ff20', borderRadius: '50%', border: '2px solid #00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🧑‍🚀
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{userData.name || 'Guest Explorer'}</h3>
                    <div style={{ color: '#00f0ff', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '2px', letterSpacing: '1px' }}>
                      {userData.stage ? `STAGE: ${userData.ageRange}` : 'EXPLORER'}
                    </div>
                  </div>
                </div>

                {/* XP Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#a0a0b0', fontWeight: 'bold', letterSpacing: '1px' }}>XP Progress</span>
                    <span style={{ color: '#2ed573', fontWeight: 'bold' }}>{userData.xp || 150} <span style={{ color: '#fff' }}>/ 1000</span></span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${((userData.xp || 150) / 1000) * 100}%`, height: '100%', background: '#2ed573', boxShadow: '0 0 10px #2ed573' }}></div>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                {/* Camera Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>Camera View</span>
                  <button
                    onClick={() => setCameraMode(cameraMode === 'follow' ? 'topdown' : 'follow')}
                    style={{
                      background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff',
                      color: '#00f0ff', padding: '6px 12px', borderRadius: '8px',
                      cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold'
                    }}
                  >
                    {cameraMode === 'follow' ? '🔭 Follow' : '🚁 Top-Down'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default App;
