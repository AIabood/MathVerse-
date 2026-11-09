import React from 'react';
import { X, Award, Flame, BookOpen, CheckCircle2, Clock, Lock } from 'lucide-react';
import educationData from '../data/educationData.json';
import { staticFallbackData } from '../data/staticFallbackData';

export default function EducationOverview({ onClose }) {
  // Load data, fallback to static if JSON fails
  let data = staticFallbackData;
  try {
    if (educationData && Object.keys(educationData).length > 0) {
      data = educationData;
    }
  } catch (e) {
    console.error("Failed to load education data from JSON, falling back to static data:", e);
  }

  const stats = data.statistics || {};
  const subjects = data.subjects || [];
  const challenges = data.dailyChallenges || [];
  const achievements = data.achievements || [];
  const feed = data.activityFeed || [];

  return (
    <div className="education-modal-overlay">
      <div className="education-modal-content">
        {/* Header */}
        <div className="edu-modal-header">
          <div className="edu-header-title">
            <BookOpen size={20} className="edu-title-icon" />
            <h2>Explorer Education Overview</h2>
          </div>
          <button className="edu-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="edu-modal-body">
          {/* Statistics & Progress */}
          <div className="edu-section edu-stats-section">
            <h3>Overview &amp; Statistics</h3>
            <div className="edu-stats-grid">
              <div className="edu-stat-box">
                <span className="edu-stat-num">{stats.xpEarned || 0}</span>
                <span className="edu-stat-label">XP Earned</span>
              </div>
              <div className="edu-stat-box">
                <span className="edu-stat-num">{stats.learningStreak || 0} Days</span>
                <span className="edu-stat-label">Streak</span>
              </div>
              <div className="edu-stat-box">
                <span className="edu-stat-num">{stats.completedLessons || 0} / {stats.totalLessons || 0}</span>
                <span className="edu-stat-label">Lessons Completed</span>
              </div>
              <div className="edu-stat-box">
                <span className="edu-stat-num">{stats.averageScore || 0}%</span>
                <span className="edu-stat-label">Average Score</span>
              </div>
            </div>
            <div className="edu-progress-bar-wrap">
              <div className="edu-progress-label">
                <span>Overall Completion</span>
                <span>{Math.round(((stats.completedLessons || 0) / (stats.totalLessons || 1)) * 100)}%</span>
              </div>
              <div className="xp-track-bar">
                <div className="xp-fill-bar" style={{ width: `${((stats.completedLessons || 0) / (stats.totalLessons || 1)) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Learning Categories */}
          <div className="edu-section">
            <h3>Learning Categories</h3>
            <div className="edu-categories-grid">
              {subjects.map(sub => (
                <div key={sub.id} className={`edu-category-card ${sub.gradient || 'algebra-world'}`}>
                  <div className="edu-cat-header">
                    <span className="edu-cat-name">{sub.name}</span>
                    <span className="edu-cat-pct">{sub.progress}%</span>
                  </div>
                  <div className="xp-track-bar">
                    <div className="xp-fill-bar" style={{ width: `${sub.progress}%` }} />
                  </div>
                  <span className="edu-cat-lessons">{sub.completedLessons} / {sub.totalLessons} Lessons Done</span>
                </div>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div className="edu-section">
            <h3>Active Courses</h3>
            <div className="edu-courses-list">
              {subjects.flatMap(sub => 
                (sub.courses || []).filter(c => c.status === 'current' || c.status === 'completed').map(course => (
                  <div key={`${sub.id}-${course.id}`} className="edu-course-item">
                    <div className="edu-course-details">
                      <span className="edu-course-subj">{sub.name}</span>
                      <h4>{course.title}</h4>
                      <span className="edu-course-meta">{course.duration} • {course.difficulty} • +{course.xp} XP</span>
                    </div>
                    <div className="edu-course-action">
                      <span className={`status-square-badge ${course.status === 'completed' ? 'status-done' : 'status-pending'}`}>
                        {course.status === 'completed' ? 'Done' : 'Active'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Challenges */}
          <div className="edu-section">
            <h3>Daily Challenges</h3>
            <div className="edu-challenges-list">
              {challenges.map(chal => (
                <div key={chal.id} className={`edu-challenge-item ${chal.completed ? 'completed' : ''}`}>
                  <div className="edu-chal-icon">
                    {chal.completed ? <CheckCircle2 size={16} style={{ color: '#4eca8b' }} /> : <Clock size={16} style={{ color: '#9b7bea' }} />}
                  </div>
                  <div className="edu-chal-info">
                    <h4>{chal.title}</h4>
                    <p>{chal.description}</p>
                  </div>
                  <div className="edu-chal-xp">
                    <span>+{chal.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="edu-section">
            <h3>Achievements</h3>
            <div className="edu-achievements-list">
              {achievements.map(ach => (
                <div key={ach.id} className={`edu-ach-item ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="edu-ach-icon-circle" style={{ borderColor: ach.unlocked ? ach.color : '#a0a8b8', color: ach.unlocked ? ach.color : '#a0a8b8' }}>
                    {ach.unlocked ? <Award size={18} /> : <Lock size={16} />}
                  </div>
                  <div className="edu-ach-details">
                    <h4>{ach.title}</h4>
                    <p>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="edu-section">
            <h3>Recent Activity Feed</h3>
            <div className="edu-timeline">
              {feed.slice(0, 4).map(act => (
                <div key={act.id} className="edu-timeline-item">
                  <div className="edu-time-badge">
                    <Flame size={12} />
                  </div>
                  <div className="edu-time-content">
                    <p>{act.text}</p>
                    <span>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
