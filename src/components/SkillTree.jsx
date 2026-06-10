import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────

const COLORS = {
  purple:     '#7c5cbf',
  purpleGlow: 'rgba(124,92,191,0.22)',
  purpleDim:  'rgba(124,92,191,0.10)',
  teal:       '#2aa3b8',
  tealDim:    'rgba(42,163,184,0.10)',
  green:      '#2db87a',
  greenDim:   'rgba(45,184,122,0.10)',
  orange:     '#e08c1a',
  orangeDim:  'rgba(224,140,26,0.10)',
  red:        '#d94f6a',
  bg:         'linear-gradient(140deg, #f0edff 0%, #e8f6fb 50%, #edfaf3 100%)',
  surface:    'rgba(255,255,255,0.55)',
  surfaceHov: 'rgba(255,255,255,0.75)',
  border:     'rgba(255,255,255,0.70)',
  borderStr:  'rgba(200,190,230,0.50)',
  text:       '#2a2440',
  textMuted:  'rgba(42,36,64,0.52)',
  textDim:    'rgba(42,36,64,0.30)',
};

const LESSONS = [
  { id: 1, title: 'المتغيرات',    status: 'completed', difficulty: 'Easy',   xp: 50,  duration: '15 دق' },
  { id: 2, title: 'التعابير',     status: 'completed', difficulty: 'Medium', xp: 75,  duration: '20 دق' },
  { id: 3, title: 'المعادلات',    status: 'current',   difficulty: 'Medium', xp: 100, duration: '25 دق' },
  { id: 4, title: 'الدوال',       status: 'locked',    difficulty: 'Hard',   xp: 150, duration: '30 دق' },
  { id: 5, title: 'تحليل الرسوم', status: 'locked',    difficulty: 'Hard',   xp: 200, duration: '40 دق' },
  { id: 6, title: 'التحدي النهائي', status: 'locked',  difficulty: 'Boss',   xp: 500, duration: '60 دق' },
];

const ACHIEVEMENTS = [
  { id: 1, icon: '🌍', title: 'Explorer',        desc: 'استكشفت 10 دروس' },
  { id: 2, icon: '⚡', title: 'Equation Master', desc: 'أتقنت المعادلات' },
  { id: 3, icon: '🧠', title: 'Logic Champ',     desc: 'بطل المنطق الرياضي' },
];

const DIFFICULTY_COLOR = {
  Easy:   COLORS.green,
  Medium: COLORS.orange,
  Hard:   COLORS.red,
  Boss:   COLORS.red,
};

// ─────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};

// ─────────────────────────────────────────
// TINY REUSABLE PIECES
// ─────────────────────────────────────────

const Card = ({ children, style = {}, variants, initial, animate }) => (
  <motion.div
    variants={variants}
    initial={initial}
    animate={animate}
    style={{
      background:          'rgba(255,255,255,0.50)',
      backdropFilter:      'blur(22px)',
      WebkitBackdropFilter:'blur(22px)',
      border:              '1px solid rgba(255,255,255,0.70)',
      borderRadius:        20,
      boxShadow:           '0 8px 32px rgba(100,80,180,0.07)',
      padding:             24,
      position:            'relative',
      overflow:            'hidden',
      ...style,
    }}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ dot = COLORS.teal, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, display: 'block', flexShrink: 0 }} />
    <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{title}</span>
  </div>
);

// ─────────────────────────────────────────
// AMBIENT BACKGROUND
// ─────────────────────────────────────────

const AmbientBg = () => {
  const bubbles = [
    { w: 420, h: 420, left: '-8%',  top: '-12%', color: 'rgba(180,150,255,0.28)' },
    { w: 360, h: 360, right: '-6%', bottom: '8%', color: 'rgba(100,210,230,0.22)' },
    { w: 280, h: 280, left: '38%',  top: '55%',   color: 'rgba(120,230,180,0.20)' },
    { w: 200, h: 200, left: '60%',  top: '5%',    color: 'rgba(255,190,200,0.18)' },
    { w: 160, h: 160, left: '20%',  top: '70%',   color: 'rgba(200,170,255,0.15)' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -18, 0, 14, 0], x: [0, 8, -6, 0] }}
          transition={{ duration: 18 + i * 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position:     'absolute',
            width:        b.w,
            height:       b.h,
            left:         b.left,
            right:        b.right,
            top:          b.top,
            bottom:       b.bottom,
            borderRadius: '50%',
            background:   b.color,
            filter:       'blur(55px)',
          }}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────

const Topbar = ({ building, onBack }) => (
  <motion.div
    initial={{ y: -64, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
    style={{
      height:       64,
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'space-between',
      padding:      '0 28px',
      background:   'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid rgba(255,255,255,0.70)`,
      boxShadow:    '0 4px 20px rgba(100,80,180,0.06)',
      position:     'relative',
      zIndex:       10,
    }}
  >
    {/* Left */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 1, color: COLORS.text }}>
        MATH<span style={{ color: COLORS.purple }}>VERSE</span>
      </span>
      <div style={{ width: 1, height: 28, background: COLORS.borderStr }} />
      <span style={{ color: COLORS.teal, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
        {building?.title ?? 'Algebra Lab'}
      </span>
    </div>

    {/* Right */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
      <Stat label="المستوى" value="5 Engineer" valueColor={COLORS.text} />
      <Stat label="XP"      value="450"        valueColor={COLORS.purple} />
      <ProgressStat />
      <BackButton onClick={onBack} />
    </div>
  </motion.div>
);

const Stat = ({ label, value, valueColor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <span style={{ fontSize: 12, color: COLORS.textMuted }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 700, color: valueColor }}>{value}</span>
  </div>
);

const ProgressStat = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontSize: 12, color: COLORS.textMuted }}>التقدم</span>
    <div style={{ width: 80, height: 5, background: COLORS.surfaceHov, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: '45%', height: '100%', background: COLORS.purple, borderRadius: 99 }} />
    </div>
    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted }}>45%</span>
  </div>
);

const BackButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height:       36,
        padding:      '0 18px',
        borderRadius: 8,
        border:       `1px solid rgba(155,123,234,0.3)`,
        background:   hovered ? COLORS.purple : 'transparent',
        color:        hovered ? '#fff' : COLORS.purple,
        fontSize:     12,
        fontWeight:   700,
        letterSpacing: 1,
        cursor:       'pointer',
        textTransform: 'uppercase',
        transition:   'all 0.2s',
      }}
    >
      ← العودة
    </button>
  );
};

// ─────────────────────────────────────────
// HERO CARD
// ─────────────────────────────────────────

const HeroCard = ({ building, onContinue }) => (
  <Card
    variants={fadeUp}
    style={{
      background: 'rgba(255,255,255,0.60)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: `1px solid rgba(124,92,191,0.18)`,
      boxShadow: '0 8px 32px rgba(124,92,191,0.08)',
    }}
  >
    {/* Left accent bar */}
    <div style={{
      position:     'absolute',
      left:         0, top: 0, bottom: 0,
      width:        4,
      background:   `linear-gradient(to bottom, ${COLORS.purple}, ${COLORS.teal})`,
      borderRadius: '20px 0 0 20px',
    }} />

    <div style={{ paddingLeft: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, marginBottom: 8 }}>
        {building?.title ?? 'Algebra Lab'}
      </h1>
      <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.7, maxWidth: 560, marginBottom: 28 }}>
        أتقن المعادلات والدوال والتفكير الرياضي في هذه البيئة التفاعلية المتقدمة. ابدأ رحلتك نحو إتقان الجبر.
      </p>

      <div style={{ display: 'flex', gap: 36, marginBottom: 28 }}>
        <HeroStat label="إجمالي التقدم"    value="45%"    valueColor={COLORS.purple} />
        <HeroStat label="الدروس المكتملة"  value={<>8 <span style={{ color: COLORS.textMuted, fontSize: 15 }}>/ 20</span></>} valueColor={COLORS.text} />
        <HeroStat label="السلسلة الحالية"  value="5 أيام 🔥" valueColor={COLORS.orange} />
      </div>

      <motion.button
        whileHover={{ scale: 1.02, boxShadow: `0 12px 32px rgba(155,123,234,0.5)` }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        style={{
          height:       48,
          padding:      '0 32px',
          borderRadius: 12,
          border:       'none',
          background:   COLORS.purple,
          color:        '#fff',
          fontSize:     14,
          fontWeight:   800,
          letterSpacing: 1,
          textTransform: 'uppercase',
          cursor:       'pointer',
          boxShadow:    `0 8px 24px ${COLORS.purpleGlow}`,
        }}
      >
        متابعة التعلم →
      </motion.button>
    </div>
  </Card>
);

const HeroStat = ({ label, value, valueColor }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: COLORS.textDim, marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontSize: 26, fontWeight: 900, color: valueColor }}>{value}</div>
  </div>
);

// ─────────────────────────────────────────
// MISSION CARD
// ─────────────────────────────────────────

const MissionCard = ({ lesson, onStart }) => {
  const [hovered, setHovered] = useState(false);
  const done   = lesson.status === 'completed';
  const cur    = lesson.status === 'current';
  const locked = lesson.status === 'locked';

  const diffColor = DIFFICULTY_COLOR[lesson.difficulty] ?? COLORS.text;

  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !locked && onStart?.(lesson)}
      style={{
        background:   cur
          ? `rgba(124,92,191,0.08)`
          : hovered && !locked ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.50)',
        border:       `1px solid ${cur ? 'rgba(124,92,191,0.30)' : hovered && !locked ? 'rgba(124,92,191,0.22)' : 'rgba(255,255,255,0.70)'}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow:    hovered && !locked ? '0 8px 24px rgba(100,80,180,0.12)' : '0 4px 16px rgba(100,80,180,0.05)',
        borderRadius: 16,
        padding:      20,
        position:     'relative',
        overflow:     'hidden',
        cursor:       locked ? 'not-allowed' : 'pointer',
        opacity:      locked ? 0.55 : 1,
        transform:    hovered && !locked ? 'translateY(-3px)' : 'none',
        transition:   'all 0.25s ease',
      }}
    >
      {/* Glow on current */}
      {cur && (
        <div style={{
          position:   'absolute', top: 0, right: 0,
          width: 80, height: 80,
          background: `radial-gradient(circle, rgba(155,123,234,0.2) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: locked ? COLORS.textMuted : COLORS.text }}>
          {lesson.title}
        </span>
        <StatusBadge done={done} cur={cur} locked={locked} />
      </div>

      {/* Meta rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        <MetaRow label="الصعوبة"   value={lesson.difficulty} valueColor={diffColor} />
        <MetaRow label="مكافأة XP" value={`+${lesson.xp} XP`} valueColor={COLORS.purple} />
        <MetaRow label="المدة"     value={lesson.duration}    valueColor={COLORS.textMuted} />
      </div>

      {/* Action button */}
      {!locked && (
        <div style={{
          width:       '100%',
          padding:     '10px 0',
          textAlign:   'center',
          borderRadius: 8,
          fontSize:    13,
          fontWeight:  700,
          letterSpacing: 0.5,
          background:  cur ? COLORS.purple : COLORS.greenDim,
          color:       cur ? '#fff' : COLORS.green,
          transition:  'all 0.2s',
        }}>
          {done ? 'مراجعة المهمة' : 'ابدأ المهمة'}
        </div>
      )}
    </motion.div>
  );
};

const StatusBadge = ({ done, cur, locked }) => {
  const style = {
    width: 28, height: 28, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 800, flexShrink: 0,
  };
  if (done)   return <div style={{ ...style, background: COLORS.greenDim, color: COLORS.green, border: `1px solid rgba(78,202,139,0.25)` }}>✓</div>;
  if (cur)    return <div style={{ ...style, background: COLORS.purpleDim, color: COLORS.purple, border: `1px solid rgba(155,123,234,0.3)` }}>▶</div>;
  if (locked) return <div style={{ ...style, background: 'rgba(42,36,64,0.06)', color: COLORS.textDim }}>🔒</div>;
  return null;
};

const MetaRow = ({ label, value, valueColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
    <span style={{ color: COLORS.textMuted }}>{label}</span>
    <span style={{ fontWeight: 700, color: valueColor }}>{value}</span>
  </div>
);

// ─────────────────────────────────────────
// DAILY CHALLENGE
// ─────────────────────────────────────────

const DailyChallenge = ({ onStart }) => {
  const [secs, setSecs] = useState(14 * 3600 + 22 * 60 + 5);

  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const pad  = n => String(n).padStart(2, '0');
  const h    = pad(Math.floor(secs / 3600));
  const m    = pad(Math.floor((secs % 3600) / 60));
  const s    = pad(secs % 60);

  const [btnHov, setBtnHov] = useState(false);

  return (
    <Card
      variants={fadeUp}
      style={{
        background:   'rgba(255,255,255,0.60)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border:       `1px solid rgba(124,92,191,0.22)`,
        boxShadow:    '0 6px 24px rgba(124,92,191,0.09)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.purple }}>
          التحدي اليومي
        </span>
        <span style={{
          background:   COLORS.purpleDim,
          border:       `1px solid rgba(155,123,234,0.2)`,
          padding:      '4px 12px',
          borderRadius: 99,
          fontSize:     12,
          fontWeight:   700,
          color:        COLORS.purple,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {h}:{m}:{s}
        </span>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, marginBottom: 16 }}>
        حل 5 مسائل جبرية
      </h3>

      {/* Rewards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <RewardChip value="+100" unit="نقاط XP" valueColor={COLORS.purple} />
        <RewardChip value="+25"  unit="عملة"    valueColor={COLORS.orange} />
      </div>

      <button
        onClick={onStart}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width:        '100%',
          height:       44,
          borderRadius: 10,
          border:       'none',
          background:   COLORS.purple,
          color:        '#fff',
          fontSize:     13,
          fontWeight:   800,
          letterSpacing: 1,
          textTransform: 'uppercase',
          cursor:       'pointer',
          boxShadow:    btnHov ? `0 8px 24px rgba(155,123,234,0.45)` : `0 6px 20px rgba(155,123,234,0.3)`,
          transform:    btnHov ? 'translateY(-2px)' : 'none',
          transition:   'all 0.2s',
        }}
      >
        ابدأ التحدي
      </button>
    </Card>
  );
};

const RewardChip = ({ value, unit, valueColor }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', gap: 2,
    background: 'rgba(255,255,255,0.55)',
    border:    `1px solid rgba(255,255,255,0.70)`,
    borderRadius: 10,
    padding:   '8px 14px',
  }}>
    <span style={{ fontSize: 15, fontWeight: 800, color: valueColor }}>{value}</span>
    <span style={{ fontSize: 11, color: COLORS.textMuted }}>{unit}</span>
  </div>
);

// ─────────────────────────────────────────
// ROADMAP
// ─────────────────────────────────────────

const Roadmap = () => {
  const statusMeta = {
    completed: { label: 'مكتمل',     labelColor: COLORS.green,  nodeClass: 'done' },
    current:   { label: 'قيد التنفيذ', labelColor: COLORS.purple, nodeClass: 'current' },
    locked:    { label: 'مقفل',      labelColor: COLORS.textDim, nodeClass: 'locked' },
  };

  return (
    <Card variants={fadeUp}>
      <SectionHeader dot={COLORS.purple} title="مسار التعلم" />
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 4 }}>
        {LESSONS.map((lesson, idx) => {
          const meta    = statusMeta[lesson.status];
          const isLast  = idx === LESSONS.length - 1;
          const locked  = lesson.status === 'locked';

          const nodeBg = lesson.status === 'completed' ? COLORS.green
            : lesson.status === 'current' ? 'transparent'
            : COLORS.border;
          const nodeBorder = lesson.status === 'completed' ? COLORS.green
            : lesson.status === 'current' ? COLORS.purple
            : COLORS.borderStr;
          const nodeInner = lesson.status === 'current';
          const nodeGlow  = lesson.status === 'current'
            ? `0 0 12px ${COLORS.purpleGlow}` : 'none';

          return (
            <div
              key={lesson.id}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative', paddingBottom: isLast ? 0 : 26 }}
            >
              {/* Connecting line */}
              {!isLast && (
                <div style={{
                  position:   'absolute',
                  left:       7,
                  top:        20,
                  bottom:     0,
                  width:      2,
                  background: COLORS.border,
                  borderRadius: 99,
                }} />
              )}

              {/* Node */}
              <div style={{
                width:        16, height: 16,
                borderRadius: '50%',
                background:   nodeBg,
                border:       `${lesson.status === 'current' ? 3 : 2}px solid ${nodeBorder}`,
                boxShadow:    nodeGlow,
                flexShrink:   0,
                marginTop:    3,
                zIndex:       1,
                position:     'relative',
              }}>
                {nodeInner && (
                  <div style={{ position: 'absolute', inset: 3, background: COLORS.purple, borderRadius: '50%' }} />
                )}
              </div>

              {/* Text */}
              <div style={{ opacity: locked ? 0.55 : 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: meta.labelColor, marginBottom: 3 }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: locked ? COLORS.textMuted : COLORS.text }}>
                  {lesson.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────

const Achievements = () => (
  <Card variants={fadeUp}>
    <SectionHeader dot={COLORS.orange} title="الإنجازات" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {ACHIEVEMENTS.map(ach => (
        <div
          key={ach.id}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          14,
            background:   'rgba(255,255,255,0.45)',
            border:       `1px solid rgba(255,255,255,0.70)`,
            borderRadius: 10,
            padding:      '12px 16px',
          }}
        >
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background:   'rgba(124,92,191,0.08)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     20,
            flexShrink:   0,
          }}>
            {ach.icon}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{ach.title}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{ach.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────

export default function SkillTree({ building, onBack, onStartLevel }) {
  if (!building) return null;

  const handleContinue = () => onStartLevel?.(LESSONS.find(l => l.status === 'current') ?? LESSONS[0]);
  const handleChallenge = () => onStartLevel?.({ id: 'daily', title: 'التحدي اليومي', type: 'challenge' });

  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      background: 'linear-gradient(140deg, #f0edff 0%, #e8f6fb 50%, #edfaf3 100%)',
      fontFamily: "'Tajawal', 'Cairo', 'Inter', sans-serif",
      color:      COLORS.text,
      overflow:   'hidden',
      display:    'flex',
      flexDirection: 'column',
      zIndex:     50,
    }}>
      <AmbientBg />

      <Topbar building={building} onBack={onBack} />

      {/* Main layout */}
      <div style={{
        flex:      1,
        display:   'flex',
        gap:       20,
        padding:   24,
        overflow:  'hidden',
        position:  'relative',
        zIndex:    5,
      }}>

        {/* ── Left column ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            flex:          2,
            display:       'flex',
            flexDirection: 'column',
            gap:           20,
            overflowY:     'auto',
            paddingRight:  4,
          }}
        >
          <HeroCard building={building} onContinue={handleContinue} />

          <div>
            <SectionHeader dot={COLORS.teal} title="المهام المتاحة" />
            <motion.div
              variants={stagger}
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap:                 16,
              }}
            >
              {LESSONS.map(lesson => (
                <MissionCard key={lesson.id} lesson={lesson} onStart={onStartLevel} />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Right column ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            width:         280,
            flexShrink:    0,
            display:       'flex',
            flexDirection: 'column',
            gap:           20,
            overflowY:     'auto',
          }}
        >
          <DailyChallenge onStart={handleChallenge} />
          <Roadmap />
          <Achievements />
        </motion.div>

      </div>
    </div>
  );
}