import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HeroScene from './components/HeroScene';
import WelcomeModal from './components/WelcomeModal';
import ProfileCreation from './components/ProfileCreation';
import AvatarBuilder from './components/AvatarBuilder';
import WelcomeCard from './components/WelcomeCard';
import FutureTechCity from './components/FutureTechCity';
import SkillTree from './components/SkillTree';
import QuizInterface from './components/QuizInterface';

function App() {
  const [currentStage, setCurrentStage] = useState('welcome');
  const [userData, setUserData] = useState({ name: 'Future Engineer' });
  const [selectedBuildingData, setSelectedBuildingData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Background City - Always Visible */}
      <FutureTechCity onEnterBuilding={(data) => {
        setSelectedBuildingData(data);
        setCurrentStage('skillTree');
      }} />

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
            onSave={() => setCurrentStage('card')} 
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
      </AnimatePresence>

      {/* Persistent Player HUD */}
      {currentStage === 'none' && userData && (
        <div style={{
          position: 'absolute', top: '2rem', right: '2rem',
          background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
          padding: '1.2rem', display: 'flex', gap: '1.5rem', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 10
        }}>
          {/* Avatar Thumbnail */}
          <div style={{ width: '50px', height: '50px', background: '#00f0ff20', borderRadius: '50%', border: '2px solid #00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🧑‍🚀
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>{userData.name || 'Guest Explorer'}</h3>
            <div style={{ color: '#00f0ff', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '4px', letterSpacing: '1px' }}>
              {userData.stage ? `STAGE: ${userData.ageRange}` : 'EXPLORER'}
            </div>
          </div>
          {/* XP Bar */}
          <div style={{ marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: '#a0a0b0', fontWeight: 'bold', letterSpacing: '1px' }}>XP</span>
              <span style={{ color: '#2ed573', fontWeight: 'bold' }}>{userData.xp || 150} <span style={{ color: '#fff' }}>/ 1000</span></span>
            </div>
            <div style={{ width: '140px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${((userData.xp || 150) / 1000) * 100}%`, height: '100%', background: '#2ed573', boxShadow: '0 0 10px #2ed573' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
