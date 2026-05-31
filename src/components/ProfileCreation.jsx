import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProfileCreation({ onNext }) {
  const [formData, setFormData] = useState({
    name: '', email: '', stage: '', ageRange: ''
  });
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    'Mathematics', 'Programming', 'Artificial Intelligence', 
    'Cyber Security', 'Engineering', 'Data Science'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ ...formData, interests: selectedInterests });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5, 5, 16, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
        overflowY: 'auto',
        padding: '2rem 0'
      }}
    >
      <div className="glass-panel" style={{
        padding: '3rem',
        maxWidth: '600px',
        width: '90%',
        marginTop: 'auto', marginBottom: 'auto'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#00f0ff' }}>
          Initialize Profile
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <input 
              type="text" className="futuristic-input" placeholder="Full Name" required
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" className="futuristic-input" placeholder="Email Address" required
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <input type="password" className="futuristic-input" placeholder="Password" required />
            <input type="password" className="futuristic-input" placeholder="Confirm Password" required />
          </div>

          {/* Stage Selection */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: '#a0a0b0' }}>Select Educational Stage:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {[
                { id: 'stage1', label: 'Stage 1', age: '10-12 Years', color: '#10b981' },
                { id: 'stage2', label: 'Stage 2', age: '13-15 Years', color: '#3b82f6' },
                { id: 'stage3', label: 'Stage 3', age: '16-18 Years', color: '#8b5cf6' }
              ].map(stage => (
                <div 
                  key={stage.id}
                  onClick={() => setFormData({...formData, stage: stage.id, ageRange: stage.age})}
                  style={{
                    padding: '1rem', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                    border: `2px solid ${formData.stage === stage.id ? stage.color : 'rgba(255,255,255,0.1)'}`,
                    background: formData.stage === stage.id ? `${stage.color}20` : 'transparent',
                    boxShadow: formData.stage === stage.id ? `0 4px 15px ${stage.color}40` : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ color: formData.stage === stage.id ? stage.color : '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{stage.label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#a0a0b0', marginTop: '5px' }}>{stage.age}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', color: '#a0a0b0' }}>Select Interests:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {interests.map(interest => (
                <div 
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${selectedInterests.includes(interest) ? '#00f0ff' : 'rgba(255,255,255,0.2)'}`,
                    background: selectedInterests.includes(interest) ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                    color: selectedInterests.includes(interest) ? '#00f0ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem'
                  }}
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="glowing-button" style={{ marginTop: '1rem' }}>
            Generate Avatar
          </button>
        </form>
      </div>
    </motion.div>
  );
}
