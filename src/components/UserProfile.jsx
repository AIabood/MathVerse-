import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── Frosted Glass Panel ── */
const Glass = ({ children, style = {}, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    style={{
      background: "rgba(255,255,255,0.25)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: 28,
      border: "1px solid rgba(255,255,255,0.45)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
      padding: 22,
      ...style,
    }}
  >{children}</motion.div>
);

/* ── Soft Bubble Decoration ── */
const BgBubbles = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
    {[
      { s: 260, x: "5%", y: "-5%", c: "rgba(200,160,240,0.25)" },
      { s: 320, x: "70%", y: "55%", c: "rgba(240,180,200,0.2)" },
      { s: 200, x: "80%", y: "-8%", c: "rgba(160,210,240,0.2)" },
      { s: 180, x: "25%", y: "65%", c: "rgba(180,230,220,0.18)" },
      { s: 120, x: "55%", y: "10%", c: "rgba(220,190,255,0.15)" },
    ].map((b, i) => (
      <motion.div key={i}
        animate={{ y: [0, -20, 0, 15, 0], x: [0, 10, -8, 0] }}
        transition={{ duration: 16 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", left: b.x, top: b.y, width: b.s, height: b.s, borderRadius: "50%", background: b.c, filter: "blur(8px)" }}
      />
    ))}
  </div>
);

/* ── Mini Avatar ── */
const Avatar = ({ color = "#9b7bea", size = 90 }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width, h = c.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(cx * 0.7, cy * 0.6, 5, cx, cy, cx);
    g.addColorStop(0, color + "55"); g.addColorStop(1, color + "aa");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f5c8a0"; ctx.beginPath(); ctx.ellipse(cx, cy - 4, 18, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3b2a1a"; ctx.beginPath(); ctx.arc(cx, cy - 16, 18, Math.PI, 0); ctx.fill();
    ctx.fillRect(cx - 18, cy - 26, 36, 12);
    ctx.fillStyle = "#5c3d11";
    ctx.beginPath(); ctx.ellipse(cx - 6, cy - 7, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6, cy - 7, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d4956a"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy + 2, 4, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(cx - 22, h); ctx.quadraticCurveTo(cx - 18, cy + 18, cx - 12, cy + 10);
    ctx.lineTo(cx + 12, cy + 10); ctx.quadraticCurveTo(cx + 18, cy + 18, cx + 22, h); ctx.fill();
  }, [color]);
  return <canvas ref={ref} width={size} height={size} style={{ borderRadius: "50%", width: size, height: size, border: "3px solid rgba(255,255,255,0.6)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />;
};

/* ── Radar Chart ── */
const Radar = ({ data }) => {
  const s = 190, cx = s / 2, cy = s / 2, r = 65;
  const ax = ["Algebra", "Geometry", "Logic", "Coding", "Speed"];
  const cl = ["#9b7bea", "#5dc4d6", "#4eca8b", "#f5a623", "#e85d75"];
  const pt = (v, i, e = 0) => { const a = 2 * Math.PI * i / 5 - Math.PI / 2; const d = v / 100 * r + e; return { x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) }; };
  const pp = data.map((v, i) => { const p = pt(v, i); return `${p.x},${p.y}`; }).join(" ");
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ overflow: "visible" }}>
      {[.25, .5, .75, 1].map((sc, si) => <polygon key={si} points={ax.map((_, i) => { const p = pt(100 * sc, i); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="rgba(155,123,234,0.1)" strokeWidth="1" />)}
      {ax.map((_, i) => { const p = pt(100, i); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(155,123,234,0.08)" />; })}
      <motion.polygon initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, type: "spring", delay: 0.4 }} style={{ transformOrigin: `${cx}px ${cy}px` }} points={pp} fill="rgba(155,123,234,0.15)" stroke="#9b7bea" strokeWidth="2" />
      {data.map((v, i) => { const p = pt(v, i); return <motion.circle key={i} initial={{ r: 0 }} animate={{ r: 4 }} transition={{ delay: 0.8 + i * 0.1 }} cx={p.x} cy={p.y} fill={cl[i]} stroke="#fff" strokeWidth="2" />; })}
      {ax.map((l, i) => { const p = pt(100, i, 16); return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="600" fill="#888" fontFamily="inherit">{l}</text>; })}
    </svg>
  );
};

/* ── Circular Progress ── */
const CircleProgress = ({ value, max, label, color = "#9b7bea", size = 100 }) => {
  const r = (size - 12) / 2, circ = 2 * Math.PI * r, pct = value / max;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
        />
      </svg>
      <div style={{ position: "relative", marginTop: -size - 6, width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: size * 0.24, fontWeight: 800, color: "#3a3a50" }}>{Math.round(pct * 100)}%</span>
      </div>
      <span style={{ fontSize: 11, color: "#999", fontWeight: 500, marginTop: -2 }}>{label}</span>
    </div>
  );
};

/* ── Stat Bubble ── */
const StatBubble = ({ icon, value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 180, damping: 14 }}
    whileHover={{ scale: 1.08, y: -4 }}
    style={{
      width: 80, height: 80, borderRadius: "50%",
      background: "rgba(255,255,255,0.35)", backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.5)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
    }}
  >
    <span style={{ fontSize: 18 }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: 800, color: "#3a3a50" }}>{value}</span>
    <span style={{ fontSize: 8, color: "#aaa", fontWeight: 600 }}>{label}</span>
  </motion.div>
);

/* ── Activity Row ── */
const Activity = ({ icon, title, meta, xp, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 4, borderRadius: 16, background: "rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.35)" }}>
    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(155,123,234,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#3a3a50" }}>{title}</div>
      <div style={{ fontSize: 10, color: "#aaa" }}>{meta}</div>
    </div>
    <span style={{ fontSize: 10, fontWeight: 700, color: "#9b7bea", background: "rgba(155,123,234,0.1)", padding: "3px 8px", borderRadius: 12 }}>+{xp}</span>
  </motion.div>
);

/* ── Badge ── */
const Badge = ({ icon, label, earned, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: earned ? 1 : 0.3, scale: 1 }} transition={{ delay, type: "spring" }}
    whileHover={earned ? { scale: 1.12 } : {}}
    style={{
      width: 56, height: 56, borderRadius: "50%",
      background: earned ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.03)",
      backdropFilter: "blur(8px)", border: earned ? "2px solid rgba(155,123,234,0.3)" : "2px solid rgba(0,0,0,0.05)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      filter: earned ? "none" : "grayscale(1)", cursor: earned ? "pointer" : "default",
    }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <span style={{ fontSize: 7, color: "#999", fontWeight: 600 }}>{label}</span>
  </motion.div>
);

/* ════════════════════════════════════
   MAIN PROFILE
   ════════════════════════════════════ */
export default function UserProfile({ userData, onClose, onLogout }) {
  const name = userData?.name || "Explorer";
  const email = userData?.email || "";
  const xp = userData?.xp || 650;
  const interests = userData?.interests || ["Algebra", "Robotics", "Logic"];
  const sd = userData?.skills || [80, 65, 90, 70, 55];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "absolute", inset: 0, zIndex: 20, overflowY: "auto",
        background: "linear-gradient(160deg, #e6dff5 0%, #d8eaf556 25%, #f2e4ef 50%, #ddf0ec 75%, #ede5f5 100%)",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}>
      <BgBubbles />

      {/* Top bar */}
      <div style={{ position: "fixed", top: 16, right: 20, display: "flex", gap: 8, zIndex: 30 }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLogout}
          style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid rgba(230,100,100,0.2)", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", color: "#d44", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          Log out
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(12px)", fontSize: 15, cursor: "pointer", color: "#888" }}>
          ✕
        </motion.button>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 20px 48px", position: "relative", zIndex: 1 }}>

        {/* ═══ ROW 1 ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 18, marginBottom: 18 }}>

          {/* Profile Card */}
          <Glass delay={0.1} style={{
            background: "linear-gradient(145deg, rgba(155,123,234,0.7), rgba(120,140,220,0.6), rgba(200,160,220,0.5))",
            color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.35)",
          }}>
            <Avatar color={userData?.avatarColor || "#9b7bea"} size={88} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{name}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Math Explorer · {userData?.ageRange || "Stage 3"}</div>
              {email && <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{email}</div>}
            </div>
            {/* XP */}
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4, opacity: 0.8 }}>
                <span>EXPERIENCE</span><span>{xp} / 1000 XP</span>
              </div>
              <div style={{ height: 7, background: "rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${xp / 10}%` }} transition={{ duration: 1.3, delay: 0.5 }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#fff,#e0d0ff)", borderRadius: 4 }} />
              </div>
            </div>
            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
              {interests.map((t, i) => (
                <span key={i} style={{ fontSize: 9, padding: "2px 9px", borderRadius: 14, background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </Glass>

          {/* Right: Circles + Bubbles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Circles Row */}
            <Glass delay={0.15} style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <CircleProgress value={xp} max={1000} label="XP Progress" color="#9b7bea" size={90} />
              <CircleProgress value={84} max={100} label="Accuracy" color="#5dc4d6" size={90} />
              <CircleProgress value={70} max={100} label="Completion" color="#4eca8b" size={90} />
            </Glass>
            {/* Stat Bubbles */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
              <StatBubble icon="🔥" value="7" label="STREAK" delay={0.25} />
              <StatBubble icon="📚" value="24" label="MODULES" delay={0.3} />
              <StatBubble icon="⏱️" value="18h" label="LEARNED" delay={0.35} />
              <StatBubble icon="🏅" value="#8" label="RANK" delay={0.4} />
              <StatBubble icon="⚡" value="1.4k" label="TOTAL XP" delay={0.45} />
            </div>
          </div>
        </div>

        {/* ═══ ROW 2 ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>

          {/* Skills */}
          <Glass delay={0.35}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, marginBottom: 14 }}>SKILL RADAR</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <Radar data={sd} />
            </div>
            {[{ l: "Algebra", v: sd[0], c: "#9b7bea" }, { l: "Geometry", v: sd[1], c: "#5dc4d6" }, { l: "Logic", v: sd[2], c: "#4eca8b" }, { l: "Coding", v: sd[3], c: "#f5a623" }, { l: "Speed", v: sd[4], c: "#e85d75" }].map((s, i) => (
              <div key={s.l} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: "#666" }}>{s.l}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.c }}>{s.v}%</span>
                </div>
                <div style={{ height: 5, background: "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.v}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    style={{ height: "100%", background: s.c, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </Glass>

          {/* Activity */}
          <Glass delay={0.4}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, marginBottom: 12 }}>RECENT ACTIVITY</div>
            <Activity icon="📐" title="Quadratic equations" meta="20 min ago" xp={45} delay={0.5} />
            <Activity icon="🔌" title="Logic gates" meta="Yesterday" xp={60} delay={0.55} />
            <Activity icon="🧊" title="3D geometry" meta="2 days ago" xp={30} delay={0.6} />
            <Activity icon="💡" title="Variables & loops" meta="3 days ago" xp={50} delay={0.65} />
            <Activity icon="🌐" title="Coordinates" meta="4 days ago" xp={40} delay={0.7} />
          </Glass>

          {/* Achievements */}
          <Glass delay={0.45}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, marginBottom: 12 }}>ACHIEVEMENTS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {[
                { icon: "🌟", label: "Pioneer", earned: true }, { icon: "🔥", label: "On Fire", earned: true },
                { icon: "🧠", label: "Thinker", earned: true }, { icon: "🚀", label: "Launcher", earned: false },
                { icon: "💎", label: "Diamond", earned: false }, { icon: "⚡", label: "Speed", earned: false },
                { icon: "🏆", label: "Champ", earned: false }, { icon: "🌍", label: "Explorer", earned: false },
              ].map((b, i) => <Badge key={i} {...b} delay={0.55 + i * 0.05} />)}
            </div>
            {/* Milestone */}
            <div style={{ padding: 14, borderRadius: 18, background: "rgba(155,123,234,0.08)", backdropFilter: "blur(6px)", border: "1px solid rgba(155,123,234,0.12)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#9b7bea", letterSpacing: 1, marginBottom: 6 }}>NEXT MILESTONE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#3a3a50", marginBottom: 4 }}>🚀 Launcher Badge</div>
              <div style={{ fontSize: 10, color: "#aaa", marginBottom: 8 }}>Complete 5 more coding modules</div>
              <div style={{ height: 5, background: "rgba(155,123,234,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 1.2, delay: 0.9 }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#9b7bea,#c4a8f5)", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: "#bbb", marginTop: 4, textAlign: "right" }}>2 / 5 done</div>
            </div>
          </Glass>
        </div>
      </div>
    </motion.div>
  );
}