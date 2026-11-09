import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 'stage1', label: 'Stage 1', age: '10-12 Years', icon: '🌱', color: '#10b981', glow: '#10b98133' },
  { id: 'stage2', label: 'Stage 2', age: '13-15 Years', icon: '⚡', color: '#6366f1', glow: '#6366f133' },
  { id: 'stage3', label: 'Stage 3', age: '16-18 Years', icon: '🔥', color: '#8b5cf6', glow: '#8b5cf633' },
];

const INTERESTS = [
  { label: 'Mathematics', icon: '∑', color: '#6366f1' },
  { label: 'Programming', icon: '</>', color: '#06b6d4' },
  { label: 'AI & Logic', icon: '🤖', color: '#8b5cf6' },
  { label: 'Cyber Security', icon: '🛡', color: '#f59e0b' },
  { label: 'Engineering', icon: '⚙', color: '#10b981' },
  { label: 'Data Science', icon: '📊', color: '#ec4899' },
];

const STEPS = ['Account', 'Stage', 'Interests'];

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255, 255, 255, 0.55)',
  border: '1px solid rgba(108, 92, 231, 0.18)',
  borderRadius: 12, padding: '12px 16px',
  color: '#3a3a50', fontSize: 14, outline: 'none',
  transition: 'all 0.2s ease',
  fontFamily: "'Inter', sans-serif",
  direction: 'ltr',
};

export default function ProfileCreation({ onNext }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', stage: '', ageRange: '' });
  const [interests, setInterests] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const toggleInterest = (label) =>
    setInterests(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);

  const canNext = () => {
    if (step === 0) return formData.name && formData.email && formData.password && formData.password === formData.confirm;
    if (step === 1) return !!formData.stage;
    return interests.length > 0;
  };

  const handleSubmit = () => {
    if (!canNext()) return;
    if (step < 2) { setStep(s => s + 1); return; }
    onNext && onNext({ ...formData, interests });
  };

  const avatarLetters = formData.name ? formData.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';
  const selectedStage = STAGES.find(s => s.id === formData.stage);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'transparent',
      fontFamily: "'Inter', 'Tajawal', sans-serif",
      direction: 'ltr', overflow: 'hidden', zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 540,
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: 24,
          padding: '40px 44px',
          position: 'relative', zIndex: 5,
          boxShadow: '0 20px 60px rgba(108, 92, 231, 0.05)',
          margin: '0 20px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 6,
          }}>
            <div style={{ position: 'relative', width: '28px', height: '28px' }}>
              <div style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: '#e85d75', top: 0, left: 0 }} />
              <div style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: '#6c5ce7', bottom: 0, right: 0, opacity: 0.85, mixBlendMode: 'multiply' }} />
            </div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '1px',
              color: '#3a3a50',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              MATH<span style={{ color: '#6c5ce7' }}>VERSE</span>
            </span>
          </div>
          <p style={{ color: '#5a627a', fontSize: 13, fontWeight: 700, margin: 0 }}>Create New Account</p>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i < step ? '#6c5ce7' : i === step ? 'transparent' : 'transparent',
                  border: i < step ? 'none' : i === step ? '2px solid #6c5ce7' : '1px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i < step ? '#fff' : i === step ? '#6c5ce7' : 'rgba(0, 0, 0, 0.3)',
                  fontSize: i < step ? 14 : 13, fontWeight: 700,
                  transition: 'all 0.3s',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? '#6c5ce7' : 'rgba(0, 0, 0, 0.35)', fontWeight: 700, whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  height: 2, width: 60, margin: '0 4px', marginBottom: 18,
                  background: i < step ? '#6c5ce7' : 'rgba(0, 0, 0, 0.06)',
                  transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Avatar preview (shown when name exists) */}
        {formData.name && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #8e7bf3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 14px rgba(108, 92, 231, 0.25)',
              border: '2px solid rgba(255,255,255,0.85)',
              letterSpacing: 1,
            }}>
              {avatarLetters}
            </div>
          </motion.div>
        )}

        {/* Step 0: Account info */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { field: 'name', placeholder: 'Full Name', type: 'text' },
                  { field: 'email', placeholder: 'Email Address', type: 'email' },
                ].map(({ field, placeholder, type }) => (
                  <input key={field} type={type} placeholder={placeholder}
                    value={formData[field]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle,
                      borderColor: focusedField === field ? '#6c5ce7' : 'rgba(108, 92, 231, 0.18)',
                      background: focusedField === field ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.55)',
                    }}
                  />
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('pass')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'pass' ? '#6c5ce7' : 'rgba(108, 92, 231, 0.18)',
                    background: focusedField === 'pass' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.55)',
                    paddingLeft: 40,
                  }}
                />
                <span onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(58, 58, 80, 0.4)', cursor: 'pointer', fontSize: 14,
                }}>{showPass ? '🙈' : '👁'}</span>
              </div>
              <input type={showPass ? 'text' : 'password'} placeholder="Confirm Password"
                value={formData.confirm}
                onChange={e => setFormData({ ...formData, confirm: e.target.value })}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  borderColor: formData.confirm && formData.confirm !== formData.password
                    ? '#ef4444'
                    : focusedField === 'confirm' ? '#6c5ce7' : 'rgba(108, 92, 231, 0.18)',
                  background: focusedField === 'confirm' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.55)',
                }}
              />
              {formData.confirm && formData.confirm !== formData.password && (
                <p style={{ color: '#ef4444', fontSize: 12, margin: '-6px 0 0' }}>Passwords do not match</p>
              )}
            </motion.div>
          )}

          {/* Step 1: Stage */}
          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <p style={{ color: '#5a627a', fontSize: 13, fontWeight: 700, margin: '0 0 16px', textAlign: 'center' }}>
                Choose the stage that suits you best
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {STAGES.map(stage => {
                  const active = formData.stage === stage.id;
                  return (
                    <motion.div key={stage.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, stage: stage.id, ageRange: stage.age })}
                      style={{
                        padding: '16px 20px', borderRadius: 14, cursor: 'pointer',
                        background: active ? 'rgba(108, 92, 231, 0.08)' : 'rgba(255, 255, 255, 0.45)',
                        border: `1px solid ${active ? '#6c5ce7' : 'rgba(255, 255, 255, 0.75)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: active ? 'rgba(108, 92, 231, 0.15)' : 'rgba(255, 255, 255, 0.65)',
                          border: `1px solid ${active ? '#6c5ce7' : 'rgba(0, 0, 0, 0.06)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}>{stage.icon}</div>
                        <div>
                          <p style={{ color: active ? '#1f1a3a' : '#5a627a', fontWeight: 800, fontSize: 14, margin: 0 }}>{stage.label}</p>
                          <p style={{ color: active ? '#6c5ce7' : 'rgba(0, 0, 0, 0.35)', fontSize: 12, fontWeight: 600, margin: '3px 0 0' }}>{stage.age}</p>
                        </div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: `2px solid ${active ? '#6c5ce7' : 'rgba(0, 0, 0, 0.15)'}`,
                        background: active ? '#6c5ce7' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0,
                      }}>
                        {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <p style={{ color: '#5a627a', fontSize: 13, fontWeight: 700, margin: '0 0 18px', textAlign: 'center' }}>
                Choose topics that interest you (one or more)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {INTERESTS.map(({ label, icon, color }) => {
                  const active = interests.includes(label);
                  return (
                    <motion.div key={label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleInterest(label)}
                      style={{
                        padding: '13px 16px', borderRadius: 12, cursor: 'pointer',
                        background: active ? `${color}12` : 'rgba(255, 255, 255, 0.45)',
                        border: `1px solid ${active ? color : 'rgba(255, 255, 255, 0.75)'}`,
                        display: 'flex', alignItems: 'center', gap: 10,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: active ? `${color}18` : 'rgba(0, 0, 0, 0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, color: active ? color : 'rgba(0, 0, 0, 0.35)',
                        fontFamily: 'serif', fontWeight: 900,
                        border: `1px solid ${active ? color + '22' : 'rgba(0, 0, 0, 0.05)'}`,
                      }}>{icon}</div>
                      <span style={{
                        fontSize: 13, fontWeight: active ? 800 : 600,
                        color: active ? '#1f1a3a' : '#5a627a',
                        transition: 'all 0.2s',
                      }}>{label}</span>
                      {active && (
                        <div style={{
                          marginRight: 'auto', marginLeft: 0, width: 16, height: 16, borderRadius: '50%',
                          background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: '#fff', flexShrink: 0,
                        }}>✓</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              {interests.length > 0 && (
                <p style={{ color: '#6c5ce7', fontSize: 12, fontWeight: 700, textAlign: 'center', marginTop: 14 }}>
                  {interests.length} topics selected
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: '0 0 auto', padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
              background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)',
              color: '#5a627a', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.95)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
            >← Back</button>
          )}
          <motion.button
            whileHover={canNext() ? { scale: 1.02 } : {}}
            whileTap={canNext() ? { scale: 0.97 } : {}}
            onClick={handleSubmit}
            style={{
              flex: 1, padding: '13px 20px', borderRadius: 12, cursor: canNext() ? 'pointer' : 'not-allowed',
              background: canNext() ? 'linear-gradient(135deg, #6c5ce7, #8e7bf3)' : 'rgba(0,0,0,0.04)',
              border: 'none', color: canNext() ? '#fff' : 'rgba(0,0,0,0.25)',
              fontSize: 15, fontWeight: 700, transition: 'all 0.2s',
              boxShadow: canNext() ? '0 6px 20px rgba(108, 92, 231, 0.25)' : 'none',
              fontFamily: 'inherit',
              letterSpacing: 0.3,
            }}
          >
            {step === 2 ? '🚀 Create Account' : 'Next →'}
          </motion.button>
        </div>

        {/* Login link */}
        {step === 0 && (
          <p style={{ textAlign: 'center', color: '#5a627a', fontWeight: 600, fontSize: 13, marginTop: 20, margin: '20px 0 0' }}>
            Already have an account?{' '}
            <span style={{ color: '#6c5ce7', cursor: 'pointer', fontWeight: 700 }}>Log In</span>
          </p>
        )}
      </motion.div>
    </div>
  );
}