import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 'stage1', label: 'المرحلة الأولى', age: '10-12 سنة', icon: '🌱', color: '#10b981', glow: '#10b98133' },
  { id: 'stage2', label: 'المرحلة الثانية', age: '13-15 سنة', icon: '⚡', color: '#6366f1', glow: '#6366f133' },
  { id: 'stage3', label: 'المرحلة الثالثة', age: '16-18 سنة', icon: '🔥', color: '#8b5cf6', glow: '#8b5cf633' },
];

const INTERESTS = [
  { label: 'الرياضيات', icon: '∑', color: '#6366f1' },
  { label: 'البرمجة', icon: '</>', color: '#06b6d4' },
  { label: 'الذكاء الاصطناعي', icon: '🤖', color: '#8b5cf6' },
  { label: 'الأمن السيبراني', icon: '🛡', color: '#f59e0b' },
  { label: 'الهندسة', icon: '⚙', color: '#10b981' },
  { label: 'علم البيانات', icon: '📊', color: '#ec4899' },
];

const STEPS = ['الحساب', 'المرحلة', 'الاهتمامات'];

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '12px 16px',
  color: '#fff', fontSize: 14, outline: 'none',
  transition: 'border 0.2s, background 0.2s',
  fontFamily: "'Tajawal','Cairo','Segoe UI',sans-serif",
  direction: 'rtl',
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
      background: '#08080f',
      fontFamily: "'Tajawal','Cairo','Segoe UI',sans-serif",
      direction: 'rtl', overflow: 'hidden', zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>

      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: -150, right: -100, background: 'radial-gradient(circle, #6366f144 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: -100, left: -80, background: 'radial-gradient(circle, #8b5cf633 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', top: '45%', left: '35%', background: 'radial-gradient(circle, #06b6d422 0%, transparent 70%)', filter: 'blur(50px)' }} />
        {/* Grid lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 5.5}%`} x2="100%" y2={`${i * 5.5}%`} stroke="white" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 3.5}%`} y1="0" x2={`${i * 3.5}%`} y2="100%" stroke="white" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 540,
          background: 'rgba(14,14,26,0.8)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          padding: '40px 44px',
          position: 'relative', zIndex: 5,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          margin: '0 20px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 6,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#fff', fontWeight: 900,
              boxShadow: '0 0 18px #6366f155',
            }}>M</div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>MathVerse</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>إنشاء حساب جديد</p>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i < step ? '#6366f1' : i === step ? 'transparent' : 'transparent',
                  border: i < step ? 'none' : i === step ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i < step ? '#fff' : i === step ? '#6366f1' : 'rgba(255,255,255,0.3)',
                  fontSize: i < step ? 14 : 13, fontWeight: 700,
                  transition: 'all 0.3s',
                  boxShadow: i === step ? '0 0 12px #6366f155' : 'none',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? '#a5b4fc' : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  height: 1, width: 60, margin: '0 4px', marginBottom: 18,
                  background: i < step ? '#6366f1' : 'rgba(255,255,255,0.1)',
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
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: '#fff',
              boxShadow: '0 0 24px #6366f166',
              border: '2px solid rgba(255,255,255,0.15)',
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
                  { field: 'name', placeholder: 'الاسم الكامل', type: 'text' },
                  { field: 'email', placeholder: 'البريد الإلكتروني', type: 'email' },
                ].map(({ field, placeholder, type }) => (
                  <input key={field} type={type} placeholder={placeholder}
                    value={formData[field]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle,
                      borderColor: focusedField === field ? '#6366f1' : 'rgba(255,255,255,0.1)',
                      background: focusedField === field ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
                    }}
                  />
                ))}
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="كلمة المرور"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('pass')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle,
                    borderColor: focusedField === 'pass' ? '#6366f1' : 'rgba(255,255,255,0.1)',
                    background: focusedField === 'pass' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
                    paddingLeft: 40,
                  }}
                />
                <span onClick={() => setShowPass(v => !v)} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 14,
                }}>{showPass ? '🙈' : '👁'}</span>
              </div>
              <input type={showPass ? 'text' : 'password'} placeholder="تأكيد كلمة المرور"
                value={formData.confirm}
                onChange={e => setFormData({ ...formData, confirm: e.target.value })}
                onFocus={() => setFocusedField('confirm')}
                onBlur={() => setFocusedField(null)}
                style={{
                  ...inputStyle,
                  borderColor: formData.confirm && formData.confirm !== formData.password
                    ? '#ef4444'
                    : focusedField === 'confirm' ? '#6366f1' : 'rgba(255,255,255,0.1)',
                  background: focusedField === 'confirm' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.05)',
                }}
              />
              {formData.confirm && formData.confirm !== formData.password && (
                <p style={{ color: '#f87171', fontSize: 12, margin: '-6px 0 0' }}>كلمتا المرور غير متطابقتين</p>
              )}
            </motion.div>
          )}

          {/* Step 1: Stage */}
          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 16px', textAlign: 'center' }}>
                اختر المرحلة الدراسية التي تناسبك
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
                        background: active ? `${stage.glow}` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? stage.color + '66' : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        boxShadow: active ? `0 6px 20px ${stage.color}22` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: active ? `${stage.color}22` : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${active ? stage.color + '44' : 'rgba(255,255,255,0.08)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}>{stage.icon}</div>
                        <div>
                          <p style={{ color: active ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 14, margin: 0 }}>{stage.label}</p>
                          <p style={{ color: active ? stage.color : 'rgba(255,255,255,0.3)', fontSize: 12, margin: '3px 0 0' }}>{stage.age}</p>
                        </div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: `2px solid ${active ? stage.color : 'rgba(255,255,255,0.2)'}`,
                        background: active ? stage.color : 'transparent',
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
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 18px', textAlign: 'center' }}>
                اختر المجالات التي تهمّك (واحد أو أكثر)
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
                        background: active ? `${color}18` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${active ? color + '55' : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex', alignItems: 'center', gap: 10,
                        transition: 'all 0.2s',
                        boxShadow: active ? `0 4px 14px ${color}22` : 'none',
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: active ? `${color}22` : 'rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, color: active ? color : 'rgba(255,255,255,0.3)',
                        fontFamily: 'serif', fontWeight: 900,
                        border: `1px solid ${active ? color + '33' : 'rgba(255,255,255,0.07)'}`,
                      }}>{icon}</div>
                      <span style={{
                        fontSize: 13, fontWeight: active ? 700 : 400,
                        color: active ? '#fff' : 'rgba(255,255,255,0.5)',
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
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 14 }}>
                  {interests.length} مجالات مختارة
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
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', fontSize: 14, transition: 'all 0.2s',
              fontFamily: "'Tajawal','Cairo',sans-serif",
            }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >← رجوع</button>
          )}
          <motion.button
            whileHover={canNext() ? { scale: 1.02 } : {}}
            whileTap={canNext() ? { scale: 0.97 } : {}}
            onClick={handleSubmit}
            style={{
              flex: 1, padding: '13px 20px', borderRadius: 12, cursor: canNext() ? 'pointer' : 'not-allowed',
              background: canNext() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
              border: 'none', color: canNext() ? '#fff' : 'rgba(255,255,255,0.25)',
              fontSize: 15, fontWeight: 700, transition: 'all 0.2s',
              boxShadow: canNext() ? '0 6px 20px #6366f144' : 'none',
              fontFamily: "'Tajawal','Cairo',sans-serif",
              letterSpacing: 0.3,
            }}
          >
            {step === 2 ? '🚀 إنشاء الحساب' : 'التالي ←'}
          </motion.button>
        </div>

        {/* Login link */}
        {step === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 20, margin: '20px 0 0' }}>
            لديك حساب؟{' '}
            <span style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>تسجيل الدخول</span>
          </p>
        )}
      </motion.div>
    </div>
  );
}