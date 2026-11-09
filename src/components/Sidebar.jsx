import React from 'react';
import { BookOpen, Compass, Play, Target, Trophy, Award } from 'lucide-react';

export default function Sidebar({ activeItem, onNavigate, onBack }) {
  return (
    <aside className="hub-sidebar">
      {/* Logo */}
      <div className="hub-sidebar-logo" onClick={onBack}>
        <div className="hub-logo-dots">
          <span className="dot dot--rose" />
          <span className="dot dot--purple" />
        </div>
        <span className="hub-logo-text">MATH<span className="hub-logo-accent">VERSE</span></span>
      </div>

      {/* Navigation Links */}
      <nav className="hub-sidebar-nav">
        <button
          className={`hub-nav-link ${activeItem === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <BookOpen size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`hub-nav-link ${activeItem === 'pathways' ? 'active' : ''}`}
          onClick={() => onNavigate('pathways')}
        >
          <Compass size={18} />
          <span>Pathways Map</span>
        </button>
        <button
          className={`hub-nav-link ${activeItem === 'learning' ? 'active' : ''}`}
          onClick={() => onNavigate('learning')}
        >
          <Play size={18} />
          <span>Learning Workspace</span>
        </button>
        <button
          className={`hub-nav-link ${activeItem === 'quests' ? 'active' : ''}`}
          onClick={() => onNavigate('quests')}
        >
          <Target size={18} />
          <span>Missions & Quests</span>
        </button>
        <button
          className={`hub-nav-link ${activeItem === 'leaderboard' ? 'active' : ''}`}
          onClick={() => onNavigate('leaderboard')}
        >
          <Trophy size={18} />
          <span>Leaderboard</span>
        </button>
        <button
          className={`hub-nav-link ${activeItem === 'achievements' ? 'active' : ''}`}
          onClick={() => onNavigate('achievements')}
        >
          <Award size={18} />
          <span>Achievements</span>
        </button>
      </nav>

      {/* Need Help Card */}
      <div className="hub-sidebar-help-card">
        <div className="help-card-badge">24/7</div>
        <h4 className="help-card-title">Need help?</h4>
        <p className="help-card-desc">MathVerse Explorer Support is available at any coordinate.</p>
        <button className="help-card-btn" onClick={() => alert('Support module initiated! Open standard documentation.')}>Open Guide</button>
      </div>
    </aside>
  );
}
