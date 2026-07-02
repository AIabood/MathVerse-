import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
<<<<<<< HEAD
import { KeyboardControls, useKeyboardControls, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ─── Slow-moving Cloud ──────────────────────────────────────────────
function SkyCloud({ position, speed, scale = 1 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 80) ref.current.position.x = -80;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh><sphereGeometry args={[2.2, 6, 6]} /><meshStandardMaterial color="#ffffff" flatShading roughness={1} /></mesh>
      <mesh position={[1.6, -0.2, 0]}><sphereGeometry args={[1.5, 6, 6]} /><meshStandardMaterial color="#ffffff" flatShading roughness={1} /></mesh>
      <mesh position={[-1.6, -0.3, 0.5]}><sphereGeometry args={[1.6, 6, 6]} /><meshStandardMaterial color="#ffffff" flatShading roughness={1} /></mesh>
=======
import { KeyboardControls, useKeyboardControls, Float, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import MathArena from './MathArena';

// Simple WebAudio-based synth for short UI cues (falls back silently if unavailable)
let __audioCtx = null;
function playSynthesizedSound(name) {
  try {
    if (!window || !window.AudioContext) return;
    if (!__audioCtx) __audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = __audioCtx;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);

    const osc = ctx.createOscillator();
    osc.connect(gain);
    osc.type = 'sine';

    let duration = 0.12;
    switch ((name || '').toLowerCase()) {
      case 'whistle':
        osc.frequency.setValueAtTime(1100, now);
        duration = 0.18;
        break;
      case 'countdown':
        osc.frequency.setValueAtTime(700, now);
        duration = 0.12;
        break;
      case 'go':
        osc.frequency.setValueAtTime(1500, now);
        duration = 0.18;
        break;
      case 'correct':
        osc.frequency.setValueAtTime(900, now);
        duration = 0.26;
        break;
      case 'siren':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        duration = 0.9;
        break;
      case 'fail':
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        duration = 0.32;
        break;
      default:
        osc.frequency.setValueAtTime(800, now);
        duration = 0.12;
    }

    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.stop(now + duration + 0.02);
  } catch (err) {
    // ignore audio errors in constrained environments
    // console.warn('playSynthesizedSound error', err);
  }
}

// ─── Stars Background (Night Mode) ──────────────────────────────────
function StarsField({ visible }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800; i++) {
      const r = 120 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);
  useFrame(s => { if (ref.current && visible) ref.current.rotation.y = s.clock.elapsedTime * 0.002; });
  if (!visible) return null;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.28} sizeAttenuation transparent opacity={0.95} />
    </points>
  );
}

// ─── Moon & Nebula (Night Mode) ──────────────────────────────────────
function NightExtras({ visible }) {
  if (!visible) return null;
  return (
    <group>
      {/* Giant Moon */}
      <mesh position={[-50, 55, -130]}>
        <sphereGeometry args={[9, 20, 20]} />
        <meshBasicMaterial color="#f0f9ff" />
      </mesh>
      <mesh position={[-50, 55, -129.5]}>
        <ringGeometry args={[9.2, 11.5, 32]} />
        <meshBasicMaterial color="#c7d2fe" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      {/* Cyan Nebula */}
      <mesh position={[70, 35, -100]}>
        <sphereGeometry args={[22, 8, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.055} side={THREE.BackSide} />
      </mesh>
      {/* Purple Nebula */}
      <mesh position={[-70, 28, -115]}>
        <sphereGeometry args={[28, 8, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
    </group>
  );
}

<<<<<<< HEAD
=======
// ─── Slow Drifting Cloud ─────────────────────────────────────────────
function SkyCloud({ position, speed, scale = 1, color = '#ffffff' }) {
  const ref = useRef();
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.position.x += speed * d;
    if (ref.current.position.x > 90) ref.current.position.x = -90;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh><sphereGeometry args={[2.5, 7, 7]} /><meshStandardMaterial color={color} flatShading roughness={1} /></mesh>
      <mesh position={[2.2, -0.3, 0]}><sphereGeometry args={[1.8, 7, 7]} /><meshStandardMaterial color={color} flatShading roughness={1} /></mesh>
      <mesh position={[-2.0, -0.4, 0.5]}><sphereGeometry args={[2.0, 7, 7]} /><meshStandardMaterial color={color} flatShading roughness={1} /></mesh>
      <mesh position={[0.5, 1.2, 0]}><sphereGeometry args={[1.5, 7, 7]} /><meshStandardMaterial color={color} flatShading roughness={1} /></mesh>
    </group>
  );
}

// ─── Animated Waterfall ──────────────────────────────────────────────
function Waterfall({ position, rotation = [0, 0, 0] }) {
  const sheetRef = useRef();
  const mistRef = useRef();
  useFrame(s => {
    if (sheetRef.current) {
      sheetRef.current.position.y = position[1] - 12 + Math.sin(s.clock.elapsedTime * 5) * 0.15;
    }
    if (mistRef.current) {
      mistRef.current.material.opacity = 0.22 + Math.sin(s.clock.elapsedTime * 3) * 0.06;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      {/* Main water sheet */}
      <mesh ref={sheetRef} position={[0, -12, 0]}>
        <planeGeometry args={[10, 26, 1, 8]} />
        <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={0.9}
          transparent opacity={0.72} roughness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {/* Mist at base */}
      <mesh ref={mistRef} position={[0, -25.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7, 10, 1.5, 16, 1, true]} />
        <meshStandardMaterial color="#a5f3fc" emissive="#22d3ee" emissiveIntensity={0.5}
          transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      {/* Rock edges */}
      <mesh position={[-5.8, -0.5, 0]}><dodecahedronGeometry args={[2.8, 0]} /><meshStandardMaterial color="#334155" roughness={0.9} flatShading /></mesh>
      <mesh position={[5.8, -0.5, 0]}><dodecahedronGeometry args={[3.0, 0]} /><meshStandardMaterial color="#334155" roughness={0.9} flatShading /></mesh>
      {/* Glow at top */}
      <mesh position={[0, 0, 0.5]}>
        <planeGeometry args={[10, 1.5]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={2.0}
          transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Crystal Lake ─────────────────────────────────────────────────────
function CrystalLake({ position = [0, 0, 0] }) {
  const waterRef = useRef();
  useFrame(s => {
    if (waterRef.current) {
      waterRef.current.material.emissiveIntensity = 0.6 + Math.sin(s.clock.elapsedTime * 2) * 0.2;
    }
  });

  const rimStones = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      arr.push({
        x: Math.cos(a) * 20.0 + (Math.random() - 0.5) * 1.5,
        z: Math.sin(a) * 20.0 + (Math.random() - 0.5) * 1.5,
        s: 0.8 + Math.random() * 0.9,
      });
    }
    return arr;
  }, []);

  const lilyPads = useMemo(() => [
    { p: [-5, 0.08, -6], r: 0.9 },
    { p: [-7, 0.08, -4], r: 0.75 },
    { p: [6, 0.08, 8], r: 1.1 },
    { p: [8, 0.08, 5], r: 0.8 },
    { p: [-10, 0.08, 4], r: 0.95 },
    { p: [12, 0.08, -8], r: 1.0 },
  ], []);

  return (
    <group position={position}>
      {/* Turquoise water */}
      <mesh ref={waterRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[20, 40]} />
        <meshStandardMaterial color="#0891b2" emissive="#06b6d4" emissiveIntensity={0.6}
          roughness={0.02} metalness={0.95} transparent opacity={0.8} />
      </mesh>
      {/* Sky reflection plane */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[19.6, 40]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.18} roughness={0} metalness={1} />
      </mesh>

      {/* Rim stones */}
      {rimStones.map((st, i) => (
        <mesh key={i} position={[st.x, 0.1, st.z]} scale={st.s} castShadow>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
        </mesh>
      ))}

      {/* Lily pads */}
      {lilyPads.map((lp, i) => (
        <mesh key={`lp-${i}`} position={lp.p} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[lp.r, lp.r, 0.02, 8]} />
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </mesh>
      ))}

      {/* Small wooden docks */}
      <group position={[0, 0.12, -18.5]} rotation={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.15, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        {/* Support pillars */}
        <mesh position={[-1.8, -0.6, 2.5]}><cylinderGeometry args={[0.15, 0.15, 1.2]} /><meshStandardMaterial color="#451a03" /></mesh>
        <mesh position={[1.8, -0.6, 2.5]}><cylinderGeometry args={[0.15, 0.15, 1.2]} /><meshStandardMaterial color="#451a03" /></mesh>
      </group>

      {/* Glowing crystals around lake */}
      {[
        { p: [13, 0.8, -6], c: '#22d3ee', s: 0.95 },
        { p: [-14, 0.9, 8], c: '#a855f7', s: 1.1 },
        { p: [8, 1.0, 15], c: '#f472b6', s: 0.9 },
        { p: [-10, 0.8, -12], c: '#22d3ee', s: 1.0 },
        { p: [15, 0.9, 10], c: '#a855f7', s: 0.8 },
      ].map((c, i) => (
        <Float key={i} speed={2} floatIntensity={0.4} rotationIntensity={0.6}>
          <mesh position={c.p} scale={c.s}>
            <coneGeometry args={[0.65, 2.8, 4]} />
            <meshStandardMaterial color={c.c} emissive={c.c} emissiveIntensity={2.0}
              roughness={0.1} metalness={0.8} transparent opacity={0.9} />
          </mesh>
        </Float>
      ))}

      {/* Wooden bridge crossing side of the lake */}
      <group position={[11, 0.45, -5]} rotation={[0, 0.4, 0]}>
        {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((z, i) => {
          const arc = Math.cos((z / 9) * (Math.PI / 2.2)) * 0.75;
          return (
            <mesh key={i} position={[0, arc, z]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.16, 1.4]} />
              <meshStandardMaterial color="#92400e" roughness={0.95} />
            </mesh>
          );
        })}
        {/* Side rails */}
        <mesh position={[-2.0, 1.0, 0]}><boxGeometry args={[0.12, 0.12, 17.5]} /><meshStandardMaterial color="#78350f" /></mesh>
        <mesh position={[2.0, 1.0, 0]}><boxGeometry args={[0.12, 0.12, 17.5]} /><meshStandardMaterial color="#78350f" /></mesh>
        {[-8, -4, 0, 4, 8].map((z, i) => (
          <group key={i}>
            <mesh position={[-2.0, 0.5, z]}><cylinderGeometry args={[0.12, 0.12, 1.2]} /><meshStandardMaterial color="#57220a" /></mesh>
            <mesh position={[2.0, 0.5, z]}><cylinderGeometry args={[0.12, 0.12, 1.2]} /><meshStandardMaterial color="#57220a" /></mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ─── Single Bioluminescent Flower ────────────────────────────────────
function GlowFlower({ pos, color }) {
  const petRef = useRef();
  useFrame(s => {
    if (petRef.current) {
      petRef.current.material.emissiveIntensity = 1.2 + Math.sin(s.clock.elapsedTime * 3 + pos[0]) * 0.5;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      <mesh ref={petRef} position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.22, 0.68, Math.sin(a) * 0.22]} rotation={[0, 0, Math.cos(a) * 0.3]}>
            <sphereGeometry args={[0.1, 5, 5]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} transparent opacity={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Glowing Mushroom ────────────────────────────────────────────────
function GlowMushroom({ pos, color, height = 1.5, capScale = 1.0 }) {
  const capRef = useRef();
  useFrame(s => {
    if (capRef.current) {
      capRef.current.material.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 2 + pos[2]) * 0.5;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.13, 0.2, height]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
      <mesh ref={capRef} position={[0, height, 0]} scale={[capScale, capScale * 0.7, capScale]}>
        <sphereGeometry args={[1.1, 14, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} roughness={0.1} />
      </mesh>
      {/* Dots on cap */}
      {[0, 1, 2, 3].map(i => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.55 * capScale, height + 0.25, Math.sin(a) * 0.55 * capScale]}>
            <sphereGeometry args={[0.07, 5, 5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Fantasy Neon Tree ───────────────────────────────────────────────
function FantasyTree({ position, trunkH, trunkHeight, color, foliageColor, scale = 1 }) {
  const actualTrunkH = trunkH ?? trunkHeight ?? 3.5;
  const actualColor = color ?? foliageColor ?? '#a855f7';
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, actualTrunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.42, actualTrunkH, 6]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} flatShading />
      </mesh>
      <Float speed={1.5} floatIntensity={0.15} rotationIntensity={0.1}>
        <group position={[0, actualTrunkH, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <dodecahedronGeometry args={[2.2, 0]} />
            <meshStandardMaterial color={actualColor} roughness={0.45} flatShading emissive={actualColor} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[1.6, 0.3, 0.8]} castShadow>
            <dodecahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color={actualColor} roughness={0.45} flatShading emissive={actualColor} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[-1.5, 0.3, -0.8]} castShadow>
            <dodecahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial color={actualColor} roughness={0.45} flatShading emissive={actualColor} emissiveIntensity={0.15} />
          </mesh>
          {/* Floating leaf particles */}
          {[0, 1, 2, 3, 4].map(i => {
            const a = (i / 5) * Math.PI * 2; const r = 1.2 + Math.random();
            return (
              <Float key={i} speed={2 + i * 0.4} floatIntensity={0.5} rotationIntensity={1.5}>
                <mesh position={[Math.cos(a) * r, 0.5 + Math.random(), Math.sin(a) * r]}>
                  <circleGeometry args={[0.1 + Math.random() * 0.08, 4]} />
                  <meshStandardMaterial color={actualColor} emissive={actualColor} emissiveIntensity={1.0} transparent opacity={0.7} side={THREE.DoubleSide} />
                </mesh>
              </Float>
            );
          })}
        </group>
      </Float>
    </group>
  );
}

// ─── Firefly ─────────────────────────────────────────────────────────
function Firefly({ idx, cx, cz }) {
  const ref = useRef();
  const speed = 0.7 + idx * 0.14;
  const radius = 4 + Math.sin(idx * 1.7) * 2.5;
  useFrame(s => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    const a = t * speed + (idx * Math.PI) / 2.5;
    ref.current.position.x = cx + Math.cos(a) * radius;
    ref.current.position.z = cz + Math.sin(a) * radius * 0.8;
    ref.current.position.y = 1.8 + Math.sin(t * 2.2 + idx) * 1.4;
    ref.current.material.opacity = 0.5 + Math.sin(t * 4 + idx * 2) * 0.5;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 5, 5]} />
      <meshBasicMaterial color="#bbf7d0" transparent opacity={0.8} />
    </mesh>
  );
}

// ─── Magic Dust Particle ─────────────────────────────────────────────
function MagicDust({ count = 60 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = Math.random() * 8 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return arr;
  }, [count]);
  useFrame(s => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += Math.sin(s.clock.elapsedTime * 0.8 + i) * 0.003;
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e9d5ff" size={0.18} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

// ─── Glowing Garden ──────────────────────────────────────────────────
function GlowingGarden({ position = [0, 0, 0] }) {
  const cx = position[0];
  const cy = position[1];
  const cz = position[2];

  const flowers = useMemo(() => [
    { pos: [cx + 2, cy, cz - 6], color: '#f472b6' },
    { pos: [cx - 6, cy, cz + 6], color: '#22d3ee' },
    { pos: [cx + 6, cy, cz + 2], color: '#a855f7' },
    { pos: [cx - 10, cy, cz - 4], color: '#f472b6' },
    { pos: [cx - 2, cy, cz + 10], color: '#22d3ee' },
    { pos: [cx + 4, cy, cz - 10], color: '#a855f7' },
    { pos: [cx - 14, cy, cz + 4], color: '#f472b6' },
    { pos: [cx - 4, cy, cz - 10], color: '#22d3ee' },
    { pos: [cx + 8, cy, cz + 8], color: '#a855f7' },
  ], [cx, cy, cz]);

  const mushrooms = useMemo(() => [
    { pos: [cx - 6, cy, cz], color: '#f472b6', height: 1.6, capScale: 0.855 },
    { pos: [cx + 2, cy, cz - 2], color: '#22d3ee', height: 1.1, capScale: 0.655 },
    { pos: [-10 + cx, cy, cz + 8], color: '#a855f7', height: 1.9, capScale: 0.955 },
    { pos: [cx + 6, cy, cz + 12], color: '#f472b6', height: 1.3, capScale: 0.705 },
  ], [cx, cy, cz]);

  return (
    <group>
      {flowers.map((f, i) => <GlowFlower key={`fl-${i}`} pos={f.pos} color={f.color} />)}
      {mushrooms.map((m, i) => <GlowMushroom key={`mu-${i}`} pos={m.pos} color={m.color} height={m.height} capScale={m.capScale} />)}
      <FantasyTree position={[cx + 8, cy, cz + 18]} trunkH={4.2} color="#a855f7" scale={1.15} />
      <FantasyTree position={[cx - 16, cy, cz - 8]} trunkH={3.5} color="#f472b6" scale={0.9} />
      <FantasyTree position={[cx + 12, cy, cz - 12]} trunkH={3.8} color="#22d3ee" scale={1.0} />

      {/* Stone benches */}
      {[-6, 6].map((offset, i) => (
        <mesh key={i} position={[cx + offset, cy + 0.25, cz + offset]} rotation={[0, Math.PI / 4 * offset, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.45, 1.2]} />
          <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
        </mesh>
      ))}

      {/* Mini Garden Waterfall structure */}
      <group position={[cx - 15, cy, cz - 15]} rotation={[0, Math.PI / 4, 0]}>
        {/* Stone wall backing */}
        <mesh castShadow position={[0, 3, 0]}>
          <boxGeometry args={[8, 6, 2.5]} />
          <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
        </mesh>
        {/* Waterfall sheet */}
        <mesh position={[0, 1.6, 1.3]}>
          <planeGeometry args={[5, 3.2]} />
          <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={1.5} transparent opacity={0.7} />
        </mesh>
        {/* Water basin */}
        <mesh position={[0, 0.1, 2.5]}>
          <boxGeometry args={[6.5, 0.25, 3]} />
          <meshStandardMaterial color="#0891b2" roughness={0.1} />
        </mesh>
      </group>

      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <Firefly key={`ff-${i}`} idx={i} cx={cx} cz={cz} />
      ))}
    </group>
  );
}

// ─── Floating Crystal ────────────────────────────────────────────────
function FloatingCrystal({ position, color, scale = 1.0 }) {
  const ref = useRef();
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += 0.7 * d;
      ref.current.rotation.x += 0.25 * d;
    }
  });
  return (
    <Float speed={2.5} floatIntensity={0.9} rotationIntensity={0.1}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0}
          metalness={0.9} roughness={0.08} transparent opacity={0.92} />
      </mesh>
    </Float>
  );
}

// ─── Magic Portal ────────────────────────────────────────────────────
function MagicPortal({ position }) {
  const core = useRef(), ring1 = useRef(), ring2 = useRef(), ring3 = useRef();
  useFrame((s, d) => {
    if (core.current) {
      core.current.rotation.z += 0.6 * d;
      const p = 1 + Math.sin(s.clock.elapsedTime * 7) * 0.04;
      core.current.scale.set(p, p, 1);
    }
    if (ring1.current) { ring1.current.rotation.z -= 0.5 * d; ring1.current.rotation.y += 0.2 * d; }
    if (ring2.current) { ring2.current.rotation.z += 0.8 * d; ring2.current.rotation.x -= 0.3 * d; }
    if (ring3.current) { ring3.current.rotation.y += 0.4 * d; ring3.current.rotation.x += 0.5 * d; }
  });
  return (
    <group position={position}>
      {/* Portal pillars */}
      <mesh position={[-4.5, 3, 0]} castShadow><boxGeometry args={[1.4, 6, 1.4]} /><meshStandardMaterial color="#1e293b" roughness={0.9} flatShading /></mesh>
      <mesh position={[4.5, 3, 0]} castShadow><boxGeometry args={[1.4, 6, 1.4]} /><meshStandardMaterial color="#1e293b" roughness={0.9} flatShading /></mesh>
      <mesh position={[0, 6.2, 0]} castShadow><boxGeometry args={[11, 1.4, 1.4]} /><meshStandardMaterial color="#1e293b" roughness={0.9} flatShading /></mesh>
      {/* Outer ring */}
      <mesh position={[0, 6, 0]} castShadow>
        <torusGeometry args={[4.0, 0.45, 8, 36]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Spinning rings */}
      <mesh ref={ring1} position={[0, 6, 0.15]}>
        <torusGeometry args={[4.3, 0.12, 4, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.8} />
      </mesh>
      <mesh ref={ring2} position={[0, 6, -0.15]}>
        <torusGeometry args={[3.6, 0.1, 4, 32]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.8} />
      </mesh>
      <mesh ref={ring3} position={[0, 6, 0]}>
        <torusGeometry args={[2.8, 0.08, 4, 28]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2.5} />
      </mesh>
      {/* Animated core */}
      <mesh ref={core} position={[0, 6, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial color="#818cf8" emissive="#6d28d9" emissiveIntensity={3.5}
          transparent opacity={0.82} side={THREE.DoubleSide} />
      </mesh>
      {/* Floating particles around portal */}
      {[-2, -1, 0, 1, 2].map((v, i) => (
        <Float key={i} speed={2 + i * 0.4} floatIntensity={1.0} rotationIntensity={2.0}>
          <mesh position={[v * 1.4, 6 + v * 0.6, 1.5]} scale={0.22}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// ─── Sub-Island: Content variants ────────────────────────────────────
function SubIslandGiantTree() {
  return (
    <group>
      <FantasyTree position={[0, 1.5, 0]} trunkH={6} color="#f472b6" scale={1.8} />
      <FloatingCrystal position={[5, 5, 3]} color="#22d3ee" scale={0.7} />
      <FloatingCrystal position={[-5, 4, -3]} color="#a855f7" scale={0.6} />
    </group>
  );
}

function SubIslandRuins() {
  return (
    <group>
      {/* Two pillars with lintel */}
      <mesh position={[-3.8, 2.2, 0]} castShadow><cylinderGeometry args={[0.85, 0.95, 4.5, 6]} /><meshStandardMaterial color="#94a3b8" roughness={0.95} flatShading /></mesh>
      <mesh position={[3.8, 2.2, 0]} castShadow><cylinderGeometry args={[0.85, 0.95, 4.5, 6]} /><meshStandardMaterial color="#94a3b8" roughness={0.95} flatShading /></mesh>
      <mesh position={[0, 4.8, 0]} castShadow><boxGeometry args={[10, 0.9, 2.0]} /><meshStandardMaterial color="#94a3b8" roughness={0.95} flatShading /></mesh>
      {/* Fallen blocks */}
      <mesh position={[-2, 0.8, 3]} rotation={[0.4, 0.8, 0.2]} castShadow><boxGeometry args={[2, 1.2, 1.6]} /><meshStandardMaterial color="#cbd5e1" roughness={0.9} flatShading /></mesh>
      <mesh position={[3, 0.7, -2.5]} rotation={[-0.3, 0.3, 0.5]} castShadow><dodecahedronGeometry args={[1.5, 0]} /><meshStandardMaterial color="#cbd5e1" roughness={0.9} flatShading /></mesh>
      {/* Glowing rune crystal */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh position={[0, 3.5, -1]}><octahedronGeometry args={[0.6, 0]} /><meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.2} /></mesh>
      </Float>
    </group>
  );
}

function SubIslandPortal() {
  return <MagicPortal position={[0, 1.5, 0]} />;
}

function SubIslandCrystals() {
  return (
    <group>
      <FloatingCrystal position={[0, 3, 0]} color="#22d3ee" scale={2.2} />
      <FloatingCrystal position={[-3.5, 2, 2.5]} color="#f472b6" scale={1.4} />
      <FloatingCrystal position={[3.5, 2, -2.5]} color="#a855f7" scale={1.6} />
    </group>
  );
}

// ─── Floating Sub Island ─────────────────────────────────────────────
function SubIsland({ position, scale = 1, floatSpeed = 1, floatIntensity = 0.5, children }) {
  return (
    <Float speed={floatSpeed} floatIntensity={floatIntensity} rotationIntensity={0.08}>
      <group position={position} scale={scale}>
        {/* Rocky base */}
        <mesh position={[0, -3, 0]} castShadow>
          <coneGeometry args={[9, 9, 5]} />
          <meshStandardMaterial color="#44372e" roughness={0.95} flatShading />
        </mesh>
        {/* Grass top */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[9, 9.5, 1.6, 7]} />
          <meshStandardMaterial color="#4ade80" roughness={0.85} flatShading />
        </mesh>
        {/* Hanging rocks */}
        {[-4, 4, 0].map((x, i) => (
          <Float key={i} speed={0.8 + i * 0.3} floatIntensity={0.4} rotationIntensity={0.2}>
            <mesh position={[x, -6 - i, x * 0.4]}>
              <dodecahedronGeometry args={[1.2 + i * 0.3, 0]} />
              <meshStandardMaterial color="#3d3028" roughness={0.95} flatShading />
            </mesh>
          </Float>
        ))}
        {children}
      </group>
    </Float>
  );
}

// ─── Stone Path with Lanterns ────────────────────────────────────────
function StonePath() {
  const tiles = useMemo(() => {
    const arr = [];
    // Inner circular ring path around the central plaza
    const pathPoints = 36;
    for (let i = 0; i < pathPoints; i++) {
      const a = (i / pathPoints) * Math.PI * 2;
      const r = 26 + (Math.random() - 0.5) * 2;
      arr.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        ry: a,
        s: 1.4 + Math.random() * 0.5,
      });
    }

    // Mid circular ring path
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const r = 65 + (Math.random() - 0.5) * 3;
      arr.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        ry: a,
        s: 1.3 + Math.random() * 0.6,
      });
    }

    // 8 Radial Spokes extending to the 8 different zones
    for (let s = 0; s < 8; s++) {
      const angle = (s / 8) * Math.PI * 2 + 0.1;
      for (let d = 28; d < 135; d += 3.5) {
        arr.push({
          x: Math.cos(angle) * d + (Math.random() - 0.5) * 1.2,
          z: Math.sin(angle) * d + (Math.random() - 0.5) * 1.2,
          ry: angle,
          s: 1.3 + Math.random() * 0.7,
        });
      }
    }
    return arr;
  }, []);

  const lanternPositions = useMemo(() => {
    const arr = [];
    // Lanterns placed along the radial spokes at specific intervals
    for (let s = 0; s < 8; s++) {
      const angle = (s / 8) * Math.PI * 2 + 0.1;
      arr.push([Math.cos(angle) * 45, 0.25, Math.sin(angle) * 45]);
      arr.push([Math.cos(angle) * 90, 0.25, Math.sin(angle) * 90]);
      arr.push([Math.cos(angle) * 130, 0.25, Math.sin(angle) * 130]);
    }
    return arr;
  }, []);

  return (
    <group>
      {tiles.map((t, i) => (
        <mesh key={i} position={[t.x, 0.12, t.z]} rotation={[0, t.ry, 0]} scale={[t.s, 0.08, t.s]} receiveShadow>
          <boxGeometry args={[1.6, 1, 1.6]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#94a3b8' : i % 3 === 1 ? '#64748b' : '#cbd5e1'} roughness={0.9} flatShading />
        </mesh>
      ))}
      {/* Lanterns */}
      {lanternPositions.map(([lx, ly, lz], i) => (
        <group key={i} position={[lx, ly + 0.8, lz]}>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.35]} />
            <meshStandardMaterial color="#1e293b" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.8} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <coneGeometry args={[0.25, 0.25, 4]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Grand Portal Plaza Component ─────────────────────────────────────
function GrandPortalPlaza() {
  return (
    <group position={[0, 0.15, 0]}>
      {/* Outer Plaza ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[20, 24, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Multi-layered circular stone platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[20, 20.5, 0.3, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[16, 16.5, 0.3, 32]} />
        <meshStandardMaterial color="#64748b" roughness={0.95} flatShading />
      </mesh>
      {/* Glowing neon paths leading to the center */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 10, 0.46, Math.sin(a) * 10]} rotation={[0, -a, 0]}>
            <boxGeometry args={[12, 0.05, 0.8]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1.5} />
          </mesh>
        );
      })}
      {/* Elevated Portal Core */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8.5, 0.4, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <MagicPortal position={[0, 0.6, 0]} />
    </group>
  );
}

// ─── Cyberpunk Racing Zone Component ──────────────────────────────────
function RacingZone() {
  const checkpoints = useMemo(() => [
    { pos: [165, 3, 0], rot: [0, 0, 0] },
    { pos: [116, 3, 116], rot: [0, -Math.PI / 4, 0] },
    { pos: [0, 3, 165], rot: [0, Math.PI / 2, 0] },
    { pos: [-116, 3, 116], rot: [0, Math.PI / 4, 0] },
    { pos: [-165, 3, 0], rot: [0, 0, 0] },
    { pos: [-116, 3, -116], rot: [0, -Math.PI / 4, 0] },
    { pos: [0, 3, -165], rot: [0, Math.PI / 2, 0] },
    { pos: [116, 3, -116], rot: [0, Math.PI / 4, 0] },
  ], []);

  const boostPads = useMemo(() => [
    { pos: [165, 0.25, 40], rot: [0, 0, 0] },
    { pos: [40, 0.25, 165], rot: [0, Math.PI / 2, 0] },
    { pos: [-165, 0.25, -40], rot: [0, 0, 0] },
    { pos: [-40, 0.25, -165], rot: [0, Math.PI / 2, 0] },
  ], []);

  return (
    <group>
      {/* Giant Outer Ring Race Track */}
      <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[155, 175, 64]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Outer Neon Borders */}
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[174.8, 175.2, 64]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[154.8, 155.2, 64]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={2.0} />
      </mesh>

      {/* Cyberpunk Torus Checkpoint Arches */}
      {checkpoints.map((cp, i) => (
        <group key={`cp-${i}`} position={cp.pos} rotation={cp.rot}>
          <mesh castShadow>
            <torusGeometry args={[9, 0.6, 8, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Internal neon scan field */}
          <mesh>
            <torusGeometry args={[8.4, 0.08, 4, 24]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={3.0} />
          </mesh>
          {/* Float logo above arch */}
          <Float speed={2} floatIntensity={0.5}>
            <mesh position={[0, 11, 0]}>
              <octahedronGeometry args={[1.2, 0]} />
              <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={2.0} />
            </mesh>
          </Float>
        </group>
      ))}

      {/* Speed Boost Pads */}
      {boostPads.map((bp, i) => (
        <mesh key={`bp-${i}`} position={bp.pos} rotation={[Math.PI / 2, bp.rot[1], 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3.0} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Puzzle Temple Component ──────────────────────────────────────────
function PuzzleTemple({ position }) {
  const columns = useMemo(() => [
    { p: [-12, 0, -12], h: 6.5, rot: 0.1 },
    { p: [12, 0, -12], h: 8.0, rot: -0.05 },
    { p: [-12, 0, 12], h: 7.2, rot: -0.15 },
    { p: [12, 0, 12], h: 5.0, rot: 0.2 },
    { p: [-15, 0, 0], h: 8.5, rot: 0.05 },
    { p: [15, 0, 0], h: 6.0, rot: -0.22 },
  ], []);

  const statues = useMemo(() => [
    { p: [-6, 1.2, -6], c: '#b58900' },
    { p: [6, 1.2, -6], c: '#b58900' },
  ], []);

  return (
    <group position={position}>
      {/* Temple circular base */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[22, 23, 0.6, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.95} flatShading />
      </mesh>

      {/* Central Puzzle Seal */}
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Glowing Temple Symbols */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 6, 0.44, Math.sin(a) * 6]} rotation={[0, -a, 0]}>
            <boxGeometry args={[1.5, 0.02, 1.5]} />
            <meshStandardMaterial color="#e2e8f0" emissive="#d946ef" emissiveIntensity={2.5} />
          </mesh>
        );
      })}

      {/* Floating central rune */}
      <Float speed={3.0} floatIntensity={1.0} rotationIntensity={0.8}>
        <mesh position={[0, 5, 0]}>
          <dodecahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={3.0} metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      {/* Ruined Columns */}
      {columns.map((col, i) => (
        <group key={`col-${i}`} position={[col.p[0], 0.4, col.p[2]]} rotation={[col.rot, col.rot * 1.5, 0]}>
          <mesh castShadow receiveShadow position={[0, col.h / 2, 0]}>
            <cylinderGeometry args={[0.9, 1.1, col.h, 6]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
          </mesh>
          {/* Capital block */}
          <mesh castShadow position={[0, col.h, 0]}>
            <boxGeometry args={[2.5, 0.6, 2.5]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Guardian Statues */}
      {statues.map((st, i) => (
        <group key={`st-${i}`} position={st.p}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[1.4, 1.2, 1.4]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 1.8, 0]}>
            <dodecahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} emissive="#00f5ff" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Crystal Cave Component ───────────────────────────────────────────
function CrystalCave({ position }) {
  const caveCrystals = useMemo(() => [
    { p: [-5, 1, -5], s: 1.5, c: '#00f5ff' },
    { p: [6, 1.5, 5], s: 1.8, c: '#d946ef' },
    { p: [-7, 2, 6], s: 2.2, c: '#b58900' },
    { p: [8, 0.8, -7], s: 1.4, c: '#00f5ff' },
    { p: [0, 4, 0], s: 2.5, c: '#d946ef' },
  ], []);

  return (
    <group position={position}>
      {/* Outer Rocky Cave Shell */}
      <mesh castShadow receiveShadow position={[0, 4, 0]}>
        <sphereGeometry args={[18, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d3748" roughness={0.95} flatShading side={THREE.DoubleSide} />
      </mesh>

      {/* Internal Cave Glowing Core */}
      <pointLight position={[0, 6, 0]} color="#d946ef" intensity={4.5} distance={30} />

      {/* Giant Cluster of Glowing Crystals */}
      {caveCrystals.map((cr, i) => (
        <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.4} rotationIntensity={0.4}>
          <mesh position={cr.p} scale={cr.s} rotation={[0.4 * i, 0.8 * i, 0.1 * i]}>
            <coneGeometry args={[0.7, 3.2, 5]} />
            <meshStandardMaterial color={cr.c} emissive={cr.c} emissiveIntensity={3.0} roughness={0.1} metalness={0.8} />
          </mesh>
        </Float>
      ))}

      {/* Reflective Crystal Cave Floor */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[15, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.95} />
      </mesh>
    </group>
  );
}

// ─── Robot Area Component ─────────────────────────────────────────────
function RobotArea({ position }) {
  const terminalPositions = useMemo(() => [
    { p: [-8, 0.5, 6], r: 0.8 },
    { p: [8, 0.5, -6], r: -2.3 },
  ], []);

  return (
    <group position={position}>
      {/* Metallic Lab Grid base */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[18, 18.5, 0.4, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Blue energy grids */}
      <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16.5, 17, 16]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2.5} />
      </mesh>

      {/* AI Terminals */}
      {terminalPositions.map((term, i) => (
        <group key={i} position={term.p} rotation={[0, term.r, 0]}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[2.0, 1.2, 0.8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Hologram Screen */}
          <mesh position={[0, 1.5, 0]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[2.2, 1.1]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2.0} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* Floating Hover Drone */}
      <Float speed={4.0} floatIntensity={1.2} rotationIntensity={0.5}>
        <group position={[0, 4.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Glowing visor */}
          <mesh position={[0, 0, 1.3]}>
            <boxGeometry args={[1.6, 0.3, 0.2]} />
            <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={3.0} />
          </mesh>
          {/* Outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5, 0.15, 8, 24]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2.0} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// ─── Sky Observatory Component ────────────────────────────────────────
function SkyObservatory({ position }) {
  const planetOrbits = useMemo(() => [
    { r: 7.5, s: 0.8, c: '#00f5ff', sp: 1.2, ph: 0 },
    { r: 12.0, s: 1.2, c: '#d946ef', sp: 0.8, ph: Math.PI / 3 },
    { r: 16.5, s: 1.0, c: '#fbbf24', sp: 0.5, ph: Math.PI * 1.2 },
  ], []);

  return (
    <group position={position}>
      {/* Stone observatory dome base */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[20, 20.5, 0.5, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Curved dome structure */}
      <mesh castShadow position={[0, 3.8, 0]}>
        <sphereGeometry args={[12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Observatory opening slit rings */}
      <mesh position={[0, 4, 0]}>
        <torusGeometry args={[12.2, 0.2, 6, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.0} />
      </mesh>

      {/* Giant Telescope */}
      <group position={[0, 5, 0]} rotation={[0.9, 0.4, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.5, 1.2, 15, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Glowing lens */}
        <mesh position={[0, 7.6, 0]}>
          <cylinderGeometry args={[1.4, 1.4, 0.2, 16]} />
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={4.0} />
        </mesh>
      </group>

      {/* Orbiting Holographic Planets */}
      {planetOrbits.map((orb, i) => (
        <Float key={i} speed={2} floatIntensity={0.2}>
          <group>
            {/* Orbit ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[orb.r, 0.05, 4, 32]} />
              <meshStandardMaterial color={orb.c} emissive={orb.c} emissiveIntensity={0.4} transparent opacity={0.15} />
            </mesh>
            {/* Spinning planet */}
            <OrbitingPlanet radius={orb.r} speed={orb.sp} size={orb.s} color={orb.c} phase={orb.ph} />
          </group>
        </Float>
      ))}
    </group>
  );
}

// ─── Helper Component: Orbiting Planet ────────────────────────────────
function OrbitingPlanet({ radius, speed, size, color, phase }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + phase;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 2.0) * 0.8;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} roughness={0.1} />
    </mesh>
  );
}

// ─── Irregular Island Base ───────────────────────────────────────────
function IslandBase({ timeOfDay }) {
  const grassColor = timeOfDay === 'night' ? '#14532d' : timeOfDay === 'sunset' ? '#166534' : '#4ade80';
  const grassDark = timeOfDay === 'night' ? '#052e16' : timeOfDay === 'sunset' ? '#14532d' : '#22c55e';
  const rockColor = '#2d3748';
  const earthColor = '#44372e';

  return (
    <group>
      {/* Main grass disc */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[210, 200, 1.5, 36]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} flatShading />
      </mesh>

      {/* Irregular edge bumps to break the circle */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
        const a = (i / 12) * Math.PI * 2 + i * 0.15;
        const r = 195 + Math.sin(i * 2.3) * 12;
        return (
          <mesh key={i} position={[Math.cos(a) * r, -0.2, Math.sin(a) * r]}
            rotation={[Math.random() * 0.3, a, Math.random() * 0.3]}>
            <dodecahedronGeometry args={[18 + Math.sin(i * 1.4) * 4, 0]} />
            <meshStandardMaterial color={grassColor} roughness={0.9} flatShading />
          </mesh>
        );
      })}

      {/* Earth cliffs layer */}
      <mesh position={[0, -3.8, 0]} castShadow>
        <cylinderGeometry args={[200, 185, 6.5, 32]} />
        <meshStandardMaterial color={earthColor} roughness={0.95} flatShading />
      </mesh>
      {/* Rocky underside */}
      <mesh position={[0, -7.5, 0]} castShadow>
        <cylinderGeometry args={[185, 160, 6.5, 28]} />
        <meshStandardMaterial color={rockColor} roughness={0.95} flatShading />
      </mesh>
      {/* Inverted cone spike bottom */}
      <mesh position={[0, -32, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[150, 45, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} flatShading />
      </mesh>

      {/* Hanging rock spikes */}
      {[
        { p: [-75, -35, 60], s: [22, 55, 22] },
        { p: [95, -40, -75], s: [28, 65, 28] },
        { p: [-105, -30, -85], s: [19, 45, 19] },
        { p: [60, -32, 100], s: [22, 50, 22] },
        { p: [0, -28, -120], s: [15, 38, 15] },
      ].map((sp, i) => (
        <mesh key={i} position={sp.p} scale={sp.s} rotation={[Math.PI, i * 0.6, 0.3]}>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.95} flatShading />
        </mesh>
      ))}

      {/* Small floating rocks underneath */}
      {[-40, -20, 0, 20, 40].map((v, i) => (
        <Float key={i} speed={0.9 + i * 0.25} floatIntensity={0.7} rotationIntensity={0.25}>
          <mesh position={[v * 3.5 + Math.sin(i) * 12, -36 - (i % 3) * 8, v * 2.2 - Math.cos(i) * 20]} scale={3.0 + (i % 3) * 1.5}>
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.95} flatShading />
          </mesh>
        </Float>
      ))}

      {/* Crystals embedded in rocks along edges */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i / 6) * Math.PI * 2 + 0.4;
        const colors = ['#22d3ee', '#a855f7', '#f472b6', '#22d3ee', '#a855f7', '#f472b6'];
        return (
          <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.2} rotationIntensity={0.1}>
            <mesh position={[Math.cos(a) * 192, -2 + Math.sin(i * 1.2) * 1.5, Math.sin(a) * 192]} scale={0.9}>
              <octahedronGeometry args={[1.5, 0]} />
              <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={2.0} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}






>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
// ─── Solid Obstacle Component ────────────────────────────────────────
function StaticObstacle({ obstacle }) {
  const heightY = 0.2; // default grass height
  return (
    <group position={[obstacle.x, heightY, obstacle.z]}>
      {obstacle.type === 'crate' ? (
<<<<<<< HEAD
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 1.1]} />
          <meshStandardMaterial color={obstacle.color} roughness={0.9} flatShading />
        </mesh>
      ) : (
        <mesh position={[0, 0.7, 0]} scale={1.2} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color={obstacle.color} roughness={0.8} flatShading />
        </mesh>
=======
        // Futuristic glowing energy crate
        <group position={[0, 0.55, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 1.1, 1.1]} />
            <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.7} flatShading />
          </mesh>
          {/* Neon energy stripes */}
          <mesh position={[0, 0, 0.56]}>
            <boxGeometry args={[1.3, 0.1, 0.02]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2.0} />
          </mesh>
          <mesh position={[0, 0, -0.56]}>
            <boxGeometry args={[1.3, 0.1, 0.02]} />
            <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={2.0} />
          </mesh>
        </group>
      ) : (
        // Ancient neon monolith stone
        <group position={[0, 0.7, 0]} scale={1.2}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#1a202c" roughness={0.9} flatShading />
          </mesh>
          {/* Glowing runic core */}
          <mesh scale={0.8}>
            <dodecahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={2.5} transparent opacity={0.4} />
          </mesh>
        </group>
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      )}
    </group>
  );
}

<<<<<<< HEAD
// ─── Refactored Sandbox Mode: Target/Crystal components removed ───

=======
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
// ─── Hover Vehicle Component ────────────────────────────────────────
function HoverVehicle({
  avatarColor,
  ringsRef,
  targetsRef,
  speedTextRef,
  boostTextRef,
  crystalsCollectedTextRef,
  smashCountTextRef,
  comboTextRef,
  scoreTextRef,
  timeLeftRef,
  scoreRef,
  gameStateRef,
<<<<<<< HEAD
=======
  arenaStateRef,
  arenaBoundaryRef,
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  trickTextRef,
  skyRingsRef,
  timeLeftTextRef,
  onNearPhotoSpot,
  photoModeActive,
  cameraAngle,
  onNearGarageSpot,
  garageModeActive,
  carColor,
<<<<<<< HEAD
  physicsItemsRef
=======
  physicsItemsRef,
  mathBoostActiveRef,
  solvedPortalsRef,
  onTriggerMathPortal,
  vehiclePosRef,
  cameraShakeIntensityRef,
  ballHitTriggerRef
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
}) {
  const vehicleRef = useRef();
  const bodyRef = useRef();
  const currentLookTarget = useRef(null);
  const wasNearSpotRef = useRef(false);
  const wasNearGarageSpotRef = useRef(false);

  const wheelFLRef = useRef();
  const wheelFRRef = useRef();
  const wheelRLRef = useRef();
  const wheelRRRef = useRef();
  const steerFLRef = useRef();
  const steerFRRef = useRef();

  const vehiclePos = useRef(new THREE.Vector3(0, 0.2, 0));
  const carRotY = useRef(0);
  const velocity = useRef(0);
  const moveDirection = useRef(new THREE.Vector3(0, 0, 1));
  const vy = useRef(0);

  const wheelRotX = useRef(0);
  const frontWheelSteerY = useRef(0);

  const isJumping = useRef(false);
  const isFalling = useRef(false);
  const boostTime = useRef(0);
  const totalCrystalsCollected = useRef(0);

  const vehiclePitch = useRef(0);

  // Target Smash state
  const totalSmashes = useRef(0);
  const comboCount = useRef(0);
  const comboTimer = useRef(0);

  // Trick roll states
  const trickTime = useRef(0);
  const trickRoll = useRef(0);
  const trickTextTimer = useRef(0);
  const gasHeldTime = useRef(0);

  const [, getKeys] = useKeyboardControls();

  const OBSTACLES = useMemo(() => [
    { x: -30, z: 25, r: 1.8, type: 'rock', color: '#7f8c8d' },
    { x: -34, z: 21, r: 1.1, type: 'crate', color: '#b45309' },
    { x: -27, z: 28, r: 1.1, type: 'crate', color: '#b45309' },
    { x: -31, z: 17, r: 1.1, type: 'crate', color: '#b45309' },
  ], []);

  useFrame((state, delta) => {
    if (!vehicleRef.current || !bodyRef.current) return;

    if (garageModeActive) {
      velocity.current = 0;
      vy.current = 0;
      gasHeldTime.current = 0;
      if (speedTextRef.current) {
        speedTextRef.current.innerHTML = `0 <span style="font-size: 1rem; color: #64748b; font-weight: bold;">KM/H</span>`;
      }
      if (!currentLookTarget.current) {
        currentLookTarget.current = vehiclePos.current.clone().add(new THREE.Vector3(0, 1.2, 0));
      }
<<<<<<< HEAD
      
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      const targetPos = new THREE.Vector3();
      const targetLook = new THREE.Vector3();
      // Front diagonal customization view
      const offset = new THREE.Vector3(4.5, 1.8, 6.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
      targetPos.copy(vehiclePos.current).add(offset);
      targetLook.copy(vehiclePos.current).add(new THREE.Vector3(0, 0.6, 0));
<<<<<<< HEAD
      
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      state.camera.position.lerp(targetPos, 5 * delta);
      currentLookTarget.current.lerp(targetLook, 5 * delta);
      state.camera.lookAt(currentLookTarget.current);

      vehicleRef.current.position.copy(vehiclePos.current);
      vehicleRef.current.rotation.y = carRotY.current;
      bodyRef.current.rotation.x = vehiclePitch.current;
      bodyRef.current.rotation.z = trickRoll.current;
      return;
    }

    if (photoModeActive) {
      velocity.current = 0;
      vy.current = 0;
      gasHeldTime.current = 0;
      if (speedTextRef.current) {
        speedTextRef.current.innerHTML = `0 <span style="font-size: 1rem; color: #64748b; font-weight: bold;">KM/H</span>`;
      }
      if (!currentLookTarget.current) {
        currentLookTarget.current = vehiclePos.current.clone().add(new THREE.Vector3(0, 1.2, 0));
      }
<<<<<<< HEAD
      
      const targetPos = new THREE.Vector3();
      const targetLook = new THREE.Vector3();
      
=======

      const targetPos = new THREE.Vector3();
      const targetLook = new THREE.Vector3();

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      if (cameraAngle === 0) {
        // Front Diagonal View
        const offset = new THREE.Vector3(5, 2.2, 8).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
        targetPos.copy(vehiclePos.current).add(offset);
        targetLook.copy(vehiclePos.current).add(new THREE.Vector3(0, 0.7, 0));
      } else if (cameraAngle === 1) {
        // Dramatic Low Angle
        const offset = new THREE.Vector3(-2.8, 0.6, 6).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
        targetPos.copy(vehiclePos.current).add(offset);
        targetLook.copy(vehiclePos.current).add(new THREE.Vector3(0, 1.0, 0));
      } else {
        // Wide Scenic View
        const offset = new THREE.Vector3(10, 6.8, 12).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
        targetPos.copy(vehiclePos.current).add(offset);
        targetLook.copy(vehiclePos.current).add(new THREE.Vector3(0, 1.2, 0));
      }
<<<<<<< HEAD
      
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      state.camera.position.lerp(targetPos, 5 * delta);
      currentLookTarget.current.lerp(targetLook, 5 * delta);
      state.camera.lookAt(currentLookTarget.current);

      vehicleRef.current.position.copy(vehiclePos.current);
      vehicleRef.current.rotation.y = carRotY.current;
      bodyRef.current.rotation.x = vehiclePitch.current;
      bodyRef.current.rotation.z = trickRoll.current;
      return;
    }

    if (gameStateRef && gameStateRef.current !== 'playing') {
      velocity.current = 0;
      vy.current = 0;
      if (speedTextRef.current) {
        speedTextRef.current.innerHTML = `0 <span style="font-size: 1rem; color: #64748b; font-weight: bold;">KM/H</span>`;
      }
      return;
    }

    const keys = getKeys();

    if (boostTime.current > 0) {
      boostTime.current -= delta;
      if (boostTime.current < 0) boostTime.current = 0;
    }

    if (keys.forward) {
      gasHeldTime.current += delta;
    } else {
      gasHeldTime.current = Math.max(0, gasHeldTime.current - delta * 2.0);
    }

    const gasBonus = Math.min(gasHeldTime.current * 2.5, 14);
    const baseSpeed = 16 + gasBonus;
    const maxBoostSpeed = 26 + gasBonus;
    const maxSpeed = boostTime.current > 0 ? maxBoostSpeed : baseSpeed;
    const accel = 18 + Math.min(gasHeldTime.current * 4.0, 20);
    const drag = 3.0;

    if (keys.forward) {
      velocity.current += accel * delta;
    } else if (keys.backward) {
      velocity.current -= (18 * 0.8) * delta;
    } else {
      velocity.current -= velocity.current * drag * delta;
    }
    velocity.current = THREE.MathUtils.clamp(velocity.current, -5, maxSpeed);

    const turnFactor = Math.min(1.0, Math.abs(velocity.current) / 4);
    const maxTurnSpeed = 2.4;
    let steerDir = 0;
    if (keys.left) steerDir = 1;
    if (keys.right) steerDir = -1;

    if (steerDir !== 0) {
      carRotY.current += steerDir * maxTurnSpeed * turnFactor * delta;
    }

    const heading = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
    moveDirection.current.copy(heading);

    const nextPos = vehiclePos.current.clone().addScaledVector(moveDirection.current, velocity.current * delta);
<<<<<<< HEAD
    const distFromCenter = Math.sqrt(nextPos.x * nextPos.x + nextPos.z * nextPos.z);
    const isOffIsland = distFromCenter > 60.0;
=======
    // ─── If arena is active, prevent player from leaving the arena bounds ───
    if (arenaBoundaryRef && arenaBoundaryRef.current && (arenaStateRef.current === 'playing' || arenaStateRef.current === 'math-challenge')) {
      const center = arenaBoundaryRef.current.center || new THREE.Vector3(-125, 0.22, 0);
      const relX = nextPos.x - center.x;
      const relZ = nextPos.z - center.z;
      const distArena = Math.sqrt(relX * relX + relZ * relZ);
      const maxR = arenaBoundaryRef.current.radius || 20;
      if (distArena > maxR) {
        const angle = Math.atan2(relZ, relX);
        nextPos.x = center.x + Math.cos(angle) * (maxR - 0.6);
        nextPos.z = center.z + Math.sin(angle) * (maxR - 0.6);
        velocity.current = 0;
        cameraShakeIntensityRef.current = Math.max(cameraShakeIntensityRef.current, 0.6);
      }
    }
    const distFromCenter = Math.sqrt(nextPos.x * nextPos.x + nextPos.z * nextPos.z);
    const isOffIsland = distFromCenter > 205.0;
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)

    let collisionDetected = false;

    if (!isOffIsland && !isJumping.current && vehiclePos.current.y < 1.0) {
      for (let obs of OBSTACLES) {
        const dx = nextPos.x - obs.x;
        const dz = nextPos.z - obs.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < obs.r + 0.95) {
          collisionDetected = true;
          velocity.current = -velocity.current * 0.4;
          break;
        }
      }
    }

    if (!collisionDetected) {
      vehiclePos.current.x = nextPos.x;
      vehiclePos.current.z = nextPos.z;
    }

    const x = vehiclePos.current.x;
    const z = vehiclePos.current.z;

    const isOnRamp = (x >= -3.5 && x <= 3.5 && z >= 35 && z <= 48);

    let targetRampY = 0.2;
    if (isOnRamp) {
      targetRampY = 0.2 + ((z - 35) / 13) * 2.0;
    }

    if (!isJumping.current && !isFalling.current) {
      if (isOnRamp && z > 47.6 && velocity.current > 2) {
        isJumping.current = true;
        vy.current = velocity.current * 0.25;
      } else if (vehiclePos.current.y > targetRampY + 0.3) {
        isJumping.current = true;
        vy.current = Math.max(0, velocity.current * 0.1);
      } else {
        vehiclePos.current.y = targetRampY;
      }
    }

    if (isOffIsland && !isJumping.current && !isFalling.current) {
      isFalling.current = true;
      isJumping.current = true;
      vy.current = 1.0;
    }

    if (isJumping.current) {
      vy.current -= 12 * delta;
      vehiclePos.current.y += vy.current * delta;

      if (isFalling.current) {
        if (vehiclePos.current.y < -15) {
          vehiclePos.current.set(0, 0.2, 0);
          carRotY.current = 0;
          velocity.current = 0;
          isJumping.current = false;
          isFalling.current = false;
          vy.current = 0;
        }
      } else {
        let landY = 0.2;
        if (isOnRamp) {
          landY = 0.2 + ((z - 35) / 13) * 2.0;
        }

        if (vehiclePos.current.y <= landY) {
          vehiclePos.current.y = landY;
          isJumping.current = false;
          vy.current = 0;
        }
      }
    }

    const bdx = vehiclePos.current.x - 0;
    const bdz = vehiclePos.current.z - (-45);
    const bdistSq = bdx * bdx + bdz * bdz;
    if (bdistSq < 16.0) {
      boostTime.current = 2.5;
    }

<<<<<<< HEAD
=======
    // ─── Math Portal Collisions ────────────────────────────────────────
    if (solvedPortalsRef && solvedPortalsRef.current && onTriggerMathPortal) {
      const portals = [
        { id: 1, pos: [60, 0.5, 40], question: "7 + 5", options: ["11", "12", "13"], answer: "12" },
        { id: 2, pos: [-70, 0.5, 70], question: "9 * 8", options: ["72", "81", "64"], answer: "72" },
        { id: 3, pos: [100, 0.5, -30], question: "15 - 8", options: ["6", "7", "8"], answer: "7" },
        { id: 4, pos: [-90, 0.5, -70], question: "24 / 6", options: ["3", "4", "5"], answer: "4" },
        { id: 5, pos: [0, 0.5, -100], question: "12 + 19", options: ["29", "31", "32"], answer: "31" },
      ];

      portals.forEach(portal => {
        if (solvedPortalsRef.current.includes(portal.id)) return;
        const dx = vehiclePos.current.x - portal.pos[0];
        const dz = vehiclePos.current.z - portal.pos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 4.0) {
          velocity.current = 0;
          onTriggerMathPortal(portal);
        }
      });
    }

    if (mathBoostActiveRef && mathBoostActiveRef.current) {
      boostTime.current = 4.0;
      mathBoostActiveRef.current = false;
    }

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
    // ─── Custom Interactive Physics Objects Simulation ─────────────────
    if (physicsItemsRef && physicsItemsRef.current) {
      physicsItemsRef.current.forEach((obj) => {
        if (!obj || !obj.mesh) return;

        const pos = obj.mesh.position;
        const vel = obj.velocity;

        // 1. Gravity and Ground Collision
        const xObj = pos.x;
        const zObj = pos.z;
        const distFromCenterObj = Math.sqrt(xObj * xObj + zObj * zObj);
        const isOnRampObj = (xObj >= -3.5 && xObj <= 3.5 && zObj >= 35 && zObj <= 48);
<<<<<<< HEAD
        
        let targetYObj = 0.2;
        if (distFromCenterObj > 60.0) {
=======

        let targetYObj = 0.2;
        if (distFromCenterObj > 205.0) {
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          targetYObj = -100; // fell off island
        } else if (isOnRampObj) {
          targetYObj = 0.2 + ((zObj - 35) / 13) * 2.0;
        }

        if (pos.y > targetYObj) {
          vel.y -= 12 * delta; // gravity
        } else {
          pos.y = targetYObj;
          vel.y = 0;
          // Friction on ground
          vel.x *= Math.max(0, 1 - 2.0 * delta);
          vel.z *= Math.max(0, 1 - 2.0 * delta);
        }

        // Update position
        pos.x += vel.x * delta;
        pos.y += vel.y * delta;
        pos.z += vel.z * delta;

        // Spin rotation based on horizontal speed
        const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
        if (speed > 0.05) {
          const ax = -vel.z / speed;
          const az = vel.x / speed;
          const angle = (speed / obj.radius) * delta;
          obj.mesh.rotateOnWorldAxis(new THREE.Vector3(ax, 0, az), angle);
        }

        // 2. Collision with the Hover Vehicle
        const dx = pos.x - vehiclePos.current.x;
        const dy = pos.y - vehiclePos.current.y;
        const dz = pos.z - vehiclePos.current.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const colRadius = 1.6 + obj.radius;

        if (dist < colRadius) {
          const overlap = colRadius - dist;
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);
          const nz = dz / (dist || 1);

          pos.x += nx * overlap;
          pos.y += ny * overlap;
          pos.z += nz * overlap;

          const carSpeed = velocity.current;
          const pushForce = Math.max(4.0, Math.abs(carSpeed) * 1.5);

          vel.x = nx * pushForce + moveDirection.current.x * pushForce * 0.4;
          vel.z = nz * pushForce + moveDirection.current.z * pushForce * 0.4;

          if (Math.abs(carSpeed) > 4 || isJumping.current) {
            vel.y = Math.max(2.0, Math.abs(carSpeed) * 0.6);
          }

          // Slow down the vehicle slightly upon collision
          velocity.current *= 0.88;
<<<<<<< HEAD
=======

          if (obj === physicsItemsRef.current[5]) {
            if (ballHitTriggerRef) {
              ballHitTriggerRef.current = 1.0;
            }
          }
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
        }

        // 3. Fall off island boundary and respawn
        const distFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
<<<<<<< HEAD
        if (distFromCenter > 60.0) {
=======
        if (distFromCenter > 205.0) {
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          vel.y -= 12 * delta;
          if (pos.y < -15) {
            pos.set(obj.initPos[0], 6.0, obj.initPos[2]);
            vel.set(0, 0, 0);
          }
        }
      });

      // 4. Object-to-object collisions
      for (let i = 0; i < physicsItemsRef.current.length; i++) {
        for (let j = i + 1; j < physicsItemsRef.current.length; j++) {
          const o1 = physicsItemsRef.current[i];
          const o2 = physicsItemsRef.current[j];
          if (!o1 || !o2 || !o1.mesh || !o2.mesh) continue;

          const p1 = o1.mesh.position;
          const p2 = o2.mesh.position;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dz = p2.z - p1.z;
<<<<<<< HEAD
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
=======
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          const minDist = o1.radius + o2.radius;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            const nz = dz / (dist || 1);

            p1.x -= nx * overlap * 0.5;
            p1.y -= ny * overlap * 0.5;
            p1.z -= nz * overlap * 0.5;
            p2.x += nx * overlap * 0.5;
            p2.y += ny * overlap * 0.5;
            p2.z += nz * overlap * 0.5;

            const tempVx = o1.velocity.x;
            const tempVy = o1.velocity.y;
            const tempVz = o1.velocity.z;

            o1.velocity.x = o2.velocity.x * 0.85;
            o1.velocity.y = o2.velocity.y * 0.85;
            o1.velocity.z = o2.velocity.z * 0.85;

            o2.velocity.x = tempVx * 0.85;
            o2.velocity.y = tempVy * 0.85;
            o2.velocity.z = tempVz * 0.85;
          }
        }
      }
    }

    // ─── Trick Text display countdown timer ─────────────────────
    if (trickTextTimer.current > 0) {
      trickTextTimer.current -= delta;
      if (trickTextTimer.current <= 0) {
        trickTextTimer.current = 0;
        if (trickTextRef.current) trickTextRef.current.style.display = 'none';
      }
    }

    // ─── Perform trick roll on Spacebar key when in mid-air ──────
    if (isJumping.current && keys.space && trickTime.current <= 0) {
      trickTime.current = 0.65; // 0.65s trick animation duration
    }

    if (trickTime.current > 0) {
      trickTime.current -= delta;
      trickRoll.current = (1 - (trickTime.current / 0.65)) * Math.PI * 2;

      if (trickTime.current <= 0) {
        trickTime.current = 0;
        trickRoll.current = 0;
      }
    }

    wheelRotX.current += (velocity.current / 0.55) * delta;
    const targetSteerY = steerDir * 0.4;
    frontWheelSteerY.current = THREE.MathUtils.lerp(frontWheelSteerY.current, targetSteerY, 10 * delta);

    if (wheelFLRef.current) wheelFLRef.current.rotation.x = wheelRotX.current;
    if (wheelFRRef.current) wheelFRRef.current.rotation.x = wheelRotX.current;
    if (wheelRLRef.current) wheelRLRef.current.rotation.x = wheelRotX.current;
    if (wheelRRRef.current) wheelRRRef.current.rotation.x = wheelRotX.current;

    if (steerFLRef.current) steerFLRef.current.rotation.y = frontWheelSteerY.current;
    if (steerFRRef.current) steerFRRef.current.rotation.y = frontWheelSteerY.current;

    let pitchAngle = 0;
    if (isJumping.current) {
      pitchAngle = -vy.current * 0.03;
    } else if (isOnRamp) {
      pitchAngle = -0.15;
    }
    vehiclePitch.current = THREE.MathUtils.lerp(vehiclePitch.current, pitchAngle, 8 * delta);

    vehicleRef.current.position.copy(vehiclePos.current);
    vehicleRef.current.rotation.y = carRotY.current;
    bodyRef.current.rotation.x = vehiclePitch.current;
    bodyRef.current.rotation.z = trickRoll.current;

    if (speedTextRef.current) {
      speedTextRef.current.innerHTML = `${Math.round(Math.abs(velocity.current) * 8)} <span style="font-size: 1rem; color: #64748b; font-weight: bold;">KM/H</span>`;
    }
    if (boostTextRef.current) {
      boostTextRef.current.style.display = boostTime.current > 0.05 ? 'block' : 'none';
    }

    // ─── Proximity check for the Scenic Photo Spot (at [32, 18]) ───
    const spotX = 32;
    const spotZ = 18;
    const dxSpot = vehiclePos.current.x - spotX;
    const dzSpot = vehiclePos.current.z - spotZ;
    const distToSpot = Math.sqrt(dxSpot * dxSpot + dzSpot * dzSpot);
    const isNearSpot = distToSpot < 4.2;

    if (isNearSpot !== wasNearSpotRef.current) {
      wasNearSpotRef.current = isNearSpot;
      if (onNearPhotoSpot) {
        onNearPhotoSpot(isNearSpot);
      }
    }

    // ─── Proximity check for the Customizer Garage Spot (at [32, 4]) ───
    const garageX = 32;
    const garageZ = 4;
    const dxGarage = vehiclePos.current.x - garageX;
    const dzGarage = vehiclePos.current.z - garageZ;
    const distToGarage = Math.sqrt(dxGarage * dxGarage + dzGarage * dzGarage);
    const isNearGarage = distToGarage < 4.2;

    if (isNearGarage !== wasNearGarageSpotRef.current) {
      wasNearGarageSpotRef.current = isNearGarage;
      if (onNearGarageSpot) {
        onNearGarageSpot(isNearGarage);
      }
    }

<<<<<<< HEAD
    const camOffset = new THREE.Vector3(0, 4.8, -12);
    camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
    const targetCamPos = vehiclePos.current.clone().add(camOffset);
    state.camera.position.copy(targetCamPos);
    state.camera.lookAt(vehiclePos.current.clone().add(new THREE.Vector3(0, 1.2, 0)));
=======
    if (vehiclePosRef) {
      vehiclePosRef.current.copy(vehiclePos.current);
    }

    let shakeOffset = new THREE.Vector3(0, 0, 0);
    if (cameraShakeIntensityRef && cameraShakeIntensityRef.current > 0.01) {
      cameraShakeIntensityRef.current *= 0.92;
      const intensity = cameraShakeIntensityRef.current;
      shakeOffset.set(
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity
      );
    }

    const camOffset = new THREE.Vector3(0, 4.8, -12);
    camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
    const targetCamPos = vehiclePos.current.clone().add(camOffset).add(shakeOffset);
    state.camera.position.copy(targetCamPos);
    state.camera.lookAt(vehiclePos.current.clone().add(new THREE.Vector3(0, 1.2, 0)).add(shakeOffset));
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  });

  return (
    <group ref={vehicleRef} scale={0.75}>
      <group ref={bodyRef}>
        <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
          <boxGeometry args={[1.7, 0.4, 3.0]} />
          <meshStandardMaterial color={carColor} roughness={0.2} metalness={0.1} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.85, 0.95]}>
          <boxGeometry args={[1.7, 0.25, 1.1]} />
          <meshStandardMaterial color={carColor} roughness={0.2} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.8, 0.95, -0.75]}>
          <boxGeometry args={[0.1, 0.4, 1.5]} />
          <meshStandardMaterial color={carColor} roughness={0.2} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0.8, 0.95, -0.75]}>
          <boxGeometry args={[0.1, 0.4, 1.5]} />
          <meshStandardMaterial color={carColor} roughness={0.2} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.95, -1.45]}>
          <boxGeometry args={[1.7, 0.4, 0.1]} />
          <meshStandardMaterial color={carColor} roughness={0.2} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.76, -0.75]}>
          <boxGeometry args={[1.5, 0.05, 1.4]} />
          <meshStandardMaterial color="#27272a" roughness={0.8} flatShading />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.15, 0.1]}>
          <boxGeometry args={[1.5, 0.65, 1.2]} />
          <meshStandardMaterial color={carColor} roughness={0.2} flatShading />
        </mesh>
        <mesh position={[0, 1.25, 0.71]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[1.35, 0.4, 0.02]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.25, 0.72]}>
          <boxGeometry args={[1.4, 0.45, 0.01]} />
          <meshStandardMaterial color="#18181b" roughness={0.5} />
        </mesh>
        <mesh position={[-0.76, 1.2, 0.1]}>
          <boxGeometry args={[0.01, 0.35, 0.8]} />
          <meshStandardMaterial color="#27272a" roughness={0.2} />
        </mesh>
        <mesh position={[0.76, 1.2, 0.1]}>
          <boxGeometry args={[0.01, 0.35, 0.8]} />
          <meshStandardMaterial color="#27272a" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.8, 1.51]}>
          <boxGeometry args={[1.5, 0.25, 0.02]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.55, 0.8, 1.52]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.55, 0.8, 1.52]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 1.5, 0.1]}>
          <boxGeometry args={[1.1, 0.05, 0.05]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        {[-0.4, -0.13, 0.13, 0.4].map((xOffset, i) => (
          <group key={`rl-${i}`} position={[xOffset, 1.58, 0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.12, 0.12]} />
              <meshStandardMaterial color="#18181b" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
              <boxGeometry args={[0.12, 0.08, 0.01]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.8} />
            </mesh>
          </group>
        ))}
        <group position={[0, 0.95, -1.55]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.25, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 6]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
        </group>
        <mesh position={[-0.7, 1.15, -0.2]} castShadow>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <mesh position={[0.7, 1.15, -0.2]} castShadow>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.45, -0.2]} castShadow>
          <boxGeometry args={[1.46, 0.06, 0.06]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.7, 1.15, -0.75]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <mesh position={[0.7, 1.15, -0.75]} rotation={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        <group position={[-0.7, 0.95, 1.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 6]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.9, 4]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
        </group>
      </group>
      <group position={[-0.9, 0.55, 1.0]} ref={steerFLRef}>
        <group ref={wheelFLRef}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.4, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[-0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      </group>
      <group position={[0.9, 0.55, 1.0]} ref={steerFRRef}>
        <group ref={wheelFRRef}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.4, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      </group>
      <group position={[-0.9, 0.55, -1.0]}>
        <group ref={wheelRLRef}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.4, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[-0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      </group>
      {/* Rear Right Wheel */}
      <group position={[0.9, 0.55, -1.0]}>
        <group ref={wheelRRRef}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.4, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          <mesh position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ─── Scenic Photo Spot Component ───
function PhotoSpot({ position }) {
  const borderRef = useRef();
<<<<<<< HEAD
  
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  useFrame((state) => {
    if (borderRef.current) {
      const glow = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.4;
      borderRef.current.emissiveIntensity = glow;
    }
  });

  return (
    <group position={position}>
      {/* Semi-transparent glowing yellow deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.2} roughness={0.4} />
      </mesh>
<<<<<<< HEAD
      
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      {/* Yellow borders */}
      <mesh position={[-3.05, 0.02, 0]}>
        <boxGeometry args={[0.15, 0.04, 8.1]} />
        <meshStandardMaterial ref={borderRef} color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[3.05, 0.02, 0]}>
        <boxGeometry args={[0.15, 0.04, 8.1]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.02, -4.05]}>
        <boxGeometry args={[6.25, 0.04, 0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.02, 4.05]}>
        <boxGeometry args={[6.25, 0.04, 0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} />
      </mesh>

      {/* Floating Holographic Camera Icon */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
        <group position={[0, 2.3, 0]} scale={0.7}>
          {/* Camera body */}
          <mesh castShadow>
            <boxGeometry args={[1.3, 0.8, 0.5]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} metalness={0.6} roughness={0.2} />
          </mesh>
          {/* Camera lens */}
          <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.25, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Camera flash */}
          <mesh position={[0.4, 0.26, 0.3]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.0} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// ─── Car Paint Garage Spot Component ───
function GarageSpot({ position }) {
  const borderRef = useRef();
<<<<<<< HEAD
  
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  useFrame((state) => {
    if (borderRef.current) {
      const glow = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.4;
      borderRef.current.emissiveIntensity = glow;
    }
  });

  return (
    <group position={position}>
      {/* Semi-transparent glowing cyan deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 8]} />
        <meshStandardMaterial color="#00d2d3" transparent opacity={0.2} roughness={0.4} />
      </mesh>
<<<<<<< HEAD
      
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      {/* Cyan borders */}
      <mesh position={[-3.05, 0.02, 0]}>
        <boxGeometry args={[0.15, 0.04, 8.1]} />
        <meshStandardMaterial ref={borderRef} color="#00d2d3" emissive="#00d2d3" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[3.05, 0.02, 0]}>
        <boxGeometry args={[0.15, 0.04, 8.1]} />
        <meshStandardMaterial color="#00d2d3" emissive="#00d2d3" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.02, -4.05]}>
        <boxGeometry args={[6.25, 0.04, 0.15]} />
        <meshStandardMaterial color="#00d2d3" emissive="#00d2d3" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.02, 4.05]}>
        <boxGeometry args={[6.25, 0.04, 0.15]} />
        <meshStandardMaterial color="#00d2d3" emissive="#00d2d3" emissiveIntensity={1.2} />
      </mesh>

      {/* Floating Holographic Spray Paint Can */}
      <Float speed={2.0} rotationIntensity={1.0} floatIntensity={1.2}>
        <group position={[0, 2.3, 0]} scale={0.7}>
          {/* Can body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
            <meshStandardMaterial color="#00d2d3" emissive="#00d2d3" emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Can top shoulder */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Spray nozzle */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Cap / Spray nozzle tip */}
          <mesh position={[0, 0.95, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

<<<<<<< HEAD
// ─── Main Scene Component ───────────────────────────────────────────
export default function SkyIsland({ onBack, avatarColor, avatarGender }) {
=======
// ─── Math Portal Item Component ──────────────────────────────────────
function MathPortalItem({ id, position, solved }) {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (meshRef.current && !solved) {
      meshRef.current.rotation.y += 1.0 * delta;
      meshRef.current.rotation.z += 0.5 * delta;
    }
  });

  if (solved) return null;

  return (
    <group position={position}>
      {/* Floating question mark or math symbol above portal */}
      <Float speed={2.5} floatIntensity={0.6}>
        <mesh position={[0, 2.8, 0]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.5} />
        </mesh>
      </Float>

      {/* Main glowing ring */}
      <mesh ref={meshRef} castShadow>
        <torusGeometry args={[2.0, 0.22, 8, 24]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={2.5} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Inner portal energy core */}
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1.8} transparent opacity={0.6} />
      </mesh>

      {/* Subtle point light indicator */}
      <pointLight color="#10b981" intensity={1.5} distance={10} />
    </group>
  );
}

// ─── Main Scene Component ───────────────────────────────────────────
export default function SkyIsland({ onBack, avatarColor, avatarGender }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');

  // ─── Math Battle Arena State & Refs ─────────────────────────────────
  const [arenaState, setArenaState] = useState('idle');
  const [arenaScores, setArenaScores] = useState({ blue: 0, red: 0 });
  const [arenaTimer, setArenaTimer] = useState(120);
  const [countdownValue, setCountdownValue] = useState(3);
  const [arenaMathQuestion, setArenaMathQuestion] = useState(null);
  const [mathChallengeTimer, setMathChallengeTimer] = useState(15);
  const [mathStats, setMathStats] = useState({ goals: 0, totalAttempts: 0, correctAnswers: 0, totalAnswered: 0 });
  const [arenaLedText, setArenaLedText] = useState('WELCOME');
  const [isNearArenaStart, setIsNearArenaStart] = useState(false);
  const [lastGoalScorer, setLastGoalScorer] = useState(null);
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [bestShotSpeed, setBestShotSpeed] = useState(0);

  const arenaStateRef = useRef('idle');
  const arenaScoresRef = useRef({ blue: 0, red: 0 });
  const arenaTimerRef = useRef(120);
  const vehiclePosRef = useRef(new THREE.Vector3(0, 0.2, 0));
  const arenaBoundaryRef = useRef({ radius: 20, center: new THREE.Vector3(-125, 0.22, 0) });
  const cameraShakeIntensityRef = useRef(0);
  const ballMeshRef = useRef();
  const ballHitTriggerRef = useRef(0);

  useEffect(() => { arenaStateRef.current = arenaState; }, [arenaState]);
  useEffect(() => { arenaScoresRef.current = arenaScores; }, [arenaScores]);
  useEffect(() => { arenaTimerRef.current = arenaTimer; }, [arenaTimer]);

  useEffect(() => {
    let interval = null;
    if (arenaState === 'math-challenge') {
      setMathChallengeTimer(15);
      interval = setInterval(() => {
        setMathChallengeTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleMathChallengeSubmit(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [arenaState, arenaMathQuestion]);

  useEffect(() => {
    let interval = null;
    if (arenaState === 'playing') {
      interval = setInterval(() => {
        setArenaTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setArenaState('game-over');
            setArenaLedText('MATCH FINISHED');
            playSynthesizedSound('whistle');
            return 0;
          }
          const nextVal = prev - 1;
          if (nextVal === 30) {
            setArenaLedText('30 SECS LEFT');
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [arenaState]);

  useEffect(() => {
    let interval = null;
    if (arenaState === 'countdown') {
      setCountdownValue(3);
      playSynthesizedSound('countdown');
      interval = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setArenaState('playing');
            setArenaLedText('GO!');
            playSynthesizedSound('go');
            setArenaScores({ blue: 0, red: 0 });
            setMathStats({ goals: 0, totalAttempts: 0, correctAnswers: 0, totalAnswered: 0 });
            setBestShotSpeed(0);
            setArenaTimer(120);
            if (ballMeshRef.current) {
              ballMeshRef.current.position.set(-125, 2.5, 0);
              if (ballMeshRef.current.userData.velocity) {
                ballMeshRef.current.userData.velocity.set(0, 0, 0);
              }
            }
            return 0;
          }
          playSynthesizedSound('countdown');
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [arenaState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'e' || e.key === 'E') {
        if (arenaStateRef.current === 'idle' && isNearArenaStart) {
          playSynthesizedSound('whistle');
          setArenaState('countdown');
          setCountdownValue(3);
          setArenaLedText('MATCH START');
          // Teleport vehicle into the arena start position so pressing E actually "enters" the arena
          try {
            if (vehiclePosRef && vehiclePosRef.current) {
              // Move vehicle near the arena entrance (slightly inside)
              vehiclePosRef.current.set(-120, 0.2, 0);
            }
          } catch (err) {
            // ignore if ref not available yet
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNearArenaStart]);

  const generateMathQuestion = () => {
    const operations = ['+', '-', '×', '÷'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer, question;

    if (op === '+') {
      num1 = Math.floor(Math.random() * 80) + 20;
      num2 = Math.floor(Math.random() * 80) + 20;
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
    } else if (op === '-') {
      num1 = Math.floor(Math.random() * 80) + 20;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
      question = `${num1} - ${num2}`;
    } else if (op === '×') {
      num1 = Math.floor(Math.random() * 10) + 3;
      num2 = Math.floor(Math.random() * 8) + 2;
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
    } else {
      num2 = Math.floor(Math.random() * 8) + 2;
      answer = Math.floor(Math.random() * 10) + 2;
      num1 = num2 * answer;
      question = `${num1} ÷ ${num2}`;
    }

    const options = new Set([answer]);
    while (options.size < 3) {
      const diff = Math.floor(Math.random() * 15) - 7;
      const fake = answer + diff;
      if (fake !== answer && fake > 0) {
        options.add(fake);
      }
    }

    return {
      question,
      answer: String(answer),
      options: Array.from(options).sort(() => Math.random() - 0.5).map(String),
    };
  };

  const handleGoalScored = (scorer, speedKmh) => {
    setLastGoalScorer(scorer);
    setBestShotSpeed((prev) => Math.max(prev, speedKmh));
    if (ballMeshRef.current && ballMeshRef.current.userData.velocity) {
      ballMeshRef.current.userData.velocity.set(0, 0, 0);
    }
    const challenge = generateMathQuestion();
    setArenaMathQuestion(challenge);
    setArenaState('math-challenge');
    setArenaLedText('MATH CHALLENGE');
  };

  const handleMathChallengeSubmit = (selectedOption) => {
    if (arenaStateRef.current !== 'math-challenge') return;
    const isCorrect = selectedOption === arenaMathQuestion.answer;
    
    setMathStats((prev) => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      totalAnswered: prev.totalAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      goals: prev.goals + (isCorrect && lastGoalScorer === 'blue' ? 1 : 0),
    }));

    if (isCorrect) {
      playSynthesizedSound('correct');
      setArenaLedText(lastGoalScorer === 'blue' ? 'GOAL BLUE!' : 'GOAL RED!');
      setArenaScores((prev) => {
        const next = { ...prev };
        if (lastGoalScorer === 'blue') next.blue += 1;
        else next.red += 1;
        return next;
      });

      if (lastGoalScorer === 'blue') {
        scoreRef.current += 250;
        if (scoreTextRef.current) {
          scoreTextRef.current.innerHTML = `⭐ Score: ${scoreRef.current}`;
        }
      }

      setArenaState('goal-celebration');
      setCelebrationTrigger(true);
      playSynthesizedSound('siren');
      cameraShakeIntensityRef.current = 2.5;

      setTimeout(() => {
        setCelebrationTrigger(false);
        if (ballMeshRef.current) {
          ballMeshRef.current.position.set(-125, 2.5, 0);
          if (ballMeshRef.current.userData.velocity) {
            ballMeshRef.current.userData.velocity.set(0, 0, 0);
          }
        }
        setArenaState('playing');
        setArenaLedText('PLAYING');
      }, 3500);
    } else {
      playSynthesizedSound('fail');
      setArenaLedText('GOAL CANCELLED');
      setArenaState('goal-celebration');

      setTimeout(() => {
        if (ballMeshRef.current) {
          ballMeshRef.current.position.set(-125, 2.5, 0);
          if (ballMeshRef.current.userData.velocity) {
            ballMeshRef.current.userData.velocity.set(0, 0, 0);
          }
        }
        setArenaState('playing');
        setArenaLedText('PLAYING');
      }, 2500);
    }
  };
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  const [isNearPhotoSpot, setIsNearPhotoSpot] = useState(false);
  const [photoModeActive, setPhotoModeActive] = useState(false);
  const [cameraAngle, setCameraAngle] = useState(0); // 0: Diagonal, 1: Low-Angle, 2: Wide
  const [shutterFlash, setShutterFlash] = useState(false);
<<<<<<< HEAD
  
=======

  // Math Challenge Portal States & Refs
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [solvedPortals, setSolvedPortals] = useState([]);
  const solvedPortalsRef = useRef([]);
  const mathBoostActiveRef = useRef(false);

  const handleAnswerSubmit = (selectedAnswer) => {
    if (!activeQuestion) return;
    if (selectedAnswer === activeQuestion.answer) {
      // Add Score
      scoreRef.current += 100;
      if (scoreTextRef.current) {
        scoreTextRef.current.innerHTML = `⭐ Score: ${scoreRef.current}`;
      }
      // Activate speed boost
      mathBoostActiveRef.current = true;
      // Mark as solved
      const updated = [...solvedPortals, activeQuestion.id];
      setSolvedPortals(updated);
      solvedPortalsRef.current = updated;
    }
    setActiveQuestion(null);
  };

  const skyConfig = useMemo(() => {
    switch (timeOfDay) {
      case 'sunset':
        return {
          skyColor: '#e28743',
          fogColor: '#b95c50',
          ambientColor: '#ffe1d4',
          ambientIntensity: 0.5,
          lightColor: '#fdba74',
          lightIntensity: 1.1,
          lightPosition: [35, 12, 10],
          cloudColor: '#ffb0a0',
        };
      case 'night':
        return {
          skyColor: '#0a0b1e',
          fogColor: '#0a0b1e',
          ambientColor: '#8bb1ff',
          ambientIntensity: 0.35,
          lightColor: '#a5b4fc',
          lightIntensity: 0.45,
          lightPosition: [-20, 30, -10],
          cloudColor: '#3a3250',
        };
      case 'morning':
      default:
        return {
          skyColor: '#7ec8e3',
          fogColor: '#7ec8e3',
          ambientColor: '#ffffff',
          ambientIntensity: 0.65,
          lightColor: '#ffffff',
          lightIntensity: 1.25,
          lightPosition: [20, 35, 10],
          cloudColor: '#ffffff',
        };
    }
  }, [timeOfDay]);

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  // Customizer Garage States
  const [carColor, setCarColor] = useState('#ef4444');
  const [isNearGarageSpot, setIsNearGarageSpot] = useState(false);
  const [garageModeActive, setGarageModeActive] = useState(false);

  const speedTextRef = useRef(null);
  const boostTextRef = useRef(null);
  const crystalsCollectedTextRef = useRef(null);
  const smashCountTextRef = useRef(null);
  const comboTextRef = useRef(null);

  const ringsRef = useRef([]);
  const targetsRef = useRef([]);
  const scoreTextRef = useRef(null);
  const timeLeftTextRef = useRef(null);
  const trickTextRef = useRef(null);
  const gameStateRef = useRef('playing');
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(9999);
<<<<<<< HEAD
  
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  const skyRingsRef = useRef([]);
  const physicsItemsRef = useRef([]);
  const canvasRef = useRef(null);

  const OBSTACLES = useMemo(() => [
    { x: -30, z: 25, r: 1.8, type: 'rock', color: '#7f8c8d' },
    { x: -34, z: 21, r: 1.1, type: 'crate', color: '#b45309' },
    { x: -27, z: 28, r: 1.1, type: 'crate', color: '#b45309' },
    { x: -31, z: 17, r: 1.1, type: 'crate', color: '#b45309' },
  ], []);

  // Setup Keyboard Control Map
  const keyMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW', 'w'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS', 's'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA', 'a'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD', 'd'] },
    { name: 'space', keys: ['Space'] },
<<<<<<< HEAD
=======
    { name: 'interact', keys: ['KeyE', 'e', 'E'] },
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
  ], []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <KeyboardControls map={keyMap}>
        <Canvas shadows onCreated={({ gl }) => { canvasRef.current = gl.domElement; }}>
          <PerspectiveCamera makeDefault position={[0, 6, -14]} fov={56} />
<<<<<<< HEAD
          <color attach="background" args={['#7ec8e3']} />
          <fog attach="fog" args={['#7ec8e3', 60, 150]} />

          <ambientLight intensity={0.55} color="#ffffff" />
          <directionalLight
            position={[20, 35, 10]} intensity={1.1} castShadow color="#ffffff"
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-70} shadow-camera-right={70}
            shadow-camera-top={70} shadow-camera-bottom={-70}
          />

          {/* Holographic Scenic Photo Spot Platform */}
          <PhotoSpot position={[32, 0.22, 18]} />
          
          {/* Holographic Tuning Garage Spot Platform */}
          <GarageSpot position={[32, 0.22, 4]} />

          {/* Spacious Circular Floating Island of Radius 60 */}
          <group position={[0, -1.8, 0]}>
            <mesh receiveShadow castShadow>
              <cylinderGeometry args={[60, 50, 4.0, 32]} />
              <meshStandardMaterial color="#4caf50" flatShading />
            </mesh>
            <mesh position={[0, -5.0, 0]}>
              <coneGeometry args={[50, 16, 16]} />
              <meshStandardMaterial color="#8B6914" flatShading roughness={0.9} />
            </mesh>
          </group>

          {/* Wooden sloped jump ramp (North) */}
          <group position={[0, 1.1, 41.5]} rotation={[0.152649, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[6.4, 0.2, 13.15]} />
              <meshStandardMaterial color="#d97706" roughness={0.9} />
            </mesh>
            {/* Left border */}
            <mesh position={[-3.1, 0.2, 0]}>
              <boxGeometry args={[0.2, 0.4, 13.15]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
            {/* Right border */}
            <mesh position={[3.1, 0.2, 0]}>
              <boxGeometry args={[0.2, 0.4, 13.15]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          </group>

=======
          <color attach="background" args={[skyConfig.skyColor]} />
          <fog attach="fog" args={[skyConfig.fogColor, 120, 380]} />

          {/* Interactive lights */}
          <ambientLight intensity={skyConfig.ambientIntensity} color={skyConfig.ambientColor} />
          <directionalLight
            position={skyConfig.lightPosition}
            intensity={skyConfig.lightIntensity}
            color={skyConfig.lightColor}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-220} shadow-camera-right={220}
            shadow-camera-top={220} shadow-camera-bottom={-220}
          />

          {/* Stars & Moon (visible only at night) */}
          <StarsField visible={timeOfDay === 'night'} />
          <NightExtras visible={timeOfDay === 'night'} />
          {/* Magic Dust particles always floating */}
          <MagicDust count={150} />

          {/* Holographic Scenic Photo Spot Platform */}
          <PhotoSpot position={[32, 0.22, 18]} />

          {/* Holographic Tuning Garage Spot Platform */}
          <GarageSpot position={[32, 0.22, 4]} />

          {/* ─── Full Island Base: irregular terrain, cliffs, hanging rocks ─── */}
          <IslandBase timeOfDay={timeOfDay} />

          {/* Futuristic Energy Jump Ramp (North) */}
          <group position={[0, 1.1, 41.5]} rotation={[0.152649, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[6.4, 0.2, 13.15]} />
              <meshStandardMaterial color="#00f5ff" emissive="#00e5ff" emissiveIntensity={0.65} transparent opacity={0.65} roughness={0.1} />
            </mesh>
            {/* Left border - Glowing metal */}
            <mesh position={[-3.1, 0.2, 0]}>
              <boxGeometry args={[0.2, 0.4, 13.15]} />
              <meshStandardMaterial color="#1e293b" emissive="#d946ef" emissiveIntensity={1.2} />
            </mesh>
            {/* Right border - Glowing metal */}
            <mesh position={[3.1, 0.2, 0]}>
              <boxGeometry args={[0.2, 0.4, 13.15]} />
              <meshStandardMaterial color="#1e293b" emissive="#d946ef" emissiveIntensity={1.2} />
            </mesh>
          </group>

          {/* ─── Grand Portal Plaza (Center of Island) ─── */}
          <GrandPortalPlaza />

          {/* ─── Math Battle Arena ─── */}
          <MathArena
            position={[-125, 0.22, 0]}
            soccerBallRef={ballMeshRef}
            physicsItemsRef={physicsItemsRef}
            arenaState={arenaState}
            onGoalScored={handleGoalScored}
            vehiclePosRef={vehiclePosRef}
            setIsNearArenaStart={setIsNearArenaStart}
            hitTriggerRef={ballHitTriggerRef}
            celebrationTrigger={celebrationTrigger}
            lastGoalScorer={lastGoalScorer}
            ledText={arenaLedText}
            scores={arenaScores}
            arenaTimer={arenaTimer}
            arenaBoundaryRef={arenaBoundaryRef}
          />

          {/* ─── Cyberpunk Racing Zone ─── */}
          <RacingZone />

          {/* ─── Crystal Lake & Bridge ─── */}
          <CrystalLake position={[-60, 0.22, -60]} />

          {/* ─── Bioluminescent Magic Garden ─── */}
          <GlowingGarden position={[-120, 0.22, 100]} />

          {/* ─── Puzzle Temple ─── */}
          <PuzzleTemple position={[120, 0.22, -60]} />

          {/* ─── Crystal Cave ─── */}
          <CrystalCave position={[-120, 0.22, -100]} />

          {/* ─── Robot Area ─── */}
          <RobotArea position={[100, 0.22, 100]} />

          {/* ─── Sky Observatory (Raised high on Observatory Hill) ─── */}
          <SkyObservatory position={[0, 18, 120]} />

          {/* ─── Two Giant Endlessly Flowing Waterfalls at Opposite Edges ─── */}
          <Waterfall position={[0, -0.4, 198.5]} rotation={[0, 0, 0]} />
          <Waterfall position={[-198.5, -0.4, 0]} rotation={[0, Math.PI / 2, 0]} />

          {/* ─── Circular Stone Path + lanterns ─── */}
          <StonePath />

          {/* ─── Scattered Large Fantasy Trees ─── */}
          <FantasyTree position={[40, 0.22, 25]} trunkH={4} color="#22d3ee" scale={1.0} />
          <FantasyTree position={[45, 0.22, -15]} trunkH={3.5} color="#f472b6" scale={0.9} />
          <FantasyTree position={[-44, 0.22, -28]} trunkH={5} color="#a855f7" scale={1.1} />
          <FantasyTree position={[25, 0.22, 45]} trunkH={3.8} color="#22d3ee" scale={0.95} />
          <FantasyTree position={[30, 0.22, -42]} trunkH={4.2} color="#f472b6" scale={1.05} />
          <FantasyTree position={[-48, 0.22, 30]} trunkH={3.6} color="#a855f7" scale={0.88} />

          {/* Path lanterns */}
          {[
            [8, 0.22, 1], [18, 0.22, 3], [10, 0.22, 7], [22, 0.22, 13]
          ].map(([lx, ly, lz], i) => (
            <group key={`lan-${i}`} position={[lx, ly + 0.6, lz]}>
              <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.6]} />
                <meshStandardMaterial color="#2d3748" />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <coneGeometry args={[0.25, 0.2, 4]} />
                <meshStandardMaterial color="#4a5568" />
              </mesh>
              <mesh position={[0, 0.0, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#fbbf24"
                  emissiveIntensity={2.5}
                />
              </mesh>
            </group>
          ))}

          {/* ─── Large Floating Crystals above the island ─── */}
          <FloatingCrystal position={[35, 6, -15]} color="#22d3ee" scale={1.3} />
          <FloatingCrystal position={[-35, 8, 25]} color="#f472b6" scale={1.1} />
          <FloatingCrystal position={[-20, 10, -38]} color="#a855f7" scale={1.5} />
          <FloatingCrystal position={[18, 7, 32]} color="#22d3ee" scale={1.2} />
          <FloatingCrystal position={[50, 12, 5]} color="#f472b6" scale={1.0} />
          <FloatingCrystal position={[-52, 9, -10]} color="#a855f7" scale={0.9} />

          {/* ─── 5 Floating Sub-Islands around the main island ─── */}
          {/* 1. Giant Tree Island (East) */}
          <SubIsland position={[250, 20, 120]} scale={1.2} floatSpeed={1.1} floatIntensity={0.5}>
            <SubIslandGiantTree />
          </SubIsland>

          {/* 2. Ancient Ruins Island (West) */}
          <SubIsland position={[-260, 25, -90]} scale={1.1} floatSpeed={1.3} floatIntensity={0.4}>
            <SubIslandRuins />
          </SubIsland>

          {/* 3. Portal Island (North) */}
          <SubIsland position={[50, 30, -270]} scale={1.3} floatSpeed={0.9} floatIntensity={0.6}>
            <SubIslandPortal />
          </SubIsland>

          {/* 4. Crystal Cluster Island (SW) */}
          <SubIsland position={[-220, 18, 200]} scale={1.0} floatSpeed={1.4} floatIntensity={0.55}>
            <SubIslandCrystals />
          </SubIsland>

          {/* 5. Mini Garden Island (SE) */}
          <SubIsland position={[200, 15, -220]} scale={1.1} floatSpeed={1.2} floatIntensity={0.5}>
            <SubIslandGiantTree />
          </SubIsland>

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          {/* Scattered Interactive Physics Items */}
          {[
            { id: 0, type: 'ball', color: '#ff4757', radius: 1.2, initPos: [-10, 2, 10] },
            { id: 1, type: 'ball', color: '#2ed573', radius: 1.0, initPos: [15, 2, -15] },
            { id: 2, type: 'ball', color: '#1e90ff', radius: 1.5, initPos: [-20, 2, -10] },
            { id: 3, type: 'crate', color: '#ffa502', size: 1.4, initPos: [10, 2, 20] },
            { id: 4, type: 'crate', color: '#ff6b81', size: 1.2, initPos: [-5, 2, -25] },
          ].map((item, idx) => (
            <group
              key={item.id}
              ref={(el) => {
                if (el) {
                  physicsItemsRef.current[idx] = {
                    mesh: el,
                    type: item.type,
                    radius: item.type === 'ball' ? item.radius : item.size * 0.7,
                    position: el.position,
                    velocity: el.userData.velocity || (el.userData.velocity = new THREE.Vector3(0, 0, 0)),
                    rotation: el.rotation,
                    initPos: item.initPos,
                  };
                }
              }}
              position={item.initPos}
            >
              {item.type === 'ball' ? (
                <mesh castShadow receiveShadow>
                  <sphereGeometry args={[item.radius, 16, 16]} />
                  <meshStandardMaterial color={item.color} roughness={0.3} metalness={0.1} />
                </mesh>
              ) : (
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[item.size, item.size, item.size]} />
                  <meshStandardMaterial color={item.color} roughness={0.7} flatShading />
                </mesh>
              )}
            </group>
          ))}

          {/* Solid Obstacles (West) */}
          {OBSTACLES.map((obs, i) => (
            <StaticObstacle key={`obs-${i}`} obstacle={obs} />
          ))}

<<<<<<< HEAD
          {/* Ambient Scattered Trees & Small Rocks along the perimeter */}
          {[
            [40, 0, 25], [45, 0, -15], [-45, 0, -28], [-20, 0, -45],
            [30, 0, -42], [-48, 0, 30], [25, 0, 45], [-35, 0, 40]
          ].map(([x, y, z], i) => (
            <group key={`decor-t-${i}`} position={[x, 0.2, z]} scale={1.1 + i * 0.15}>
              <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.18, 2, 5]} />
                <meshStandardMaterial color="#8B4513" flatShading />
              </mesh>
              <mesh position={[0, 2.6, 0]} castShadow>
                <coneGeometry args={[1.1, 2.2, 5]} />
                <meshStandardMaterial color="#2d8a4e" flatShading />
              </mesh>
            </group>
          ))}

          {/* Clouds in the sky */}
          <SkyCloud position={[-35, 22, 40]} speed={0.3} scale={1.8} />
          <SkyCloud position={[30, 26, 110]} speed={0.45} scale={1.5} />
          <SkyCloud position={[-40, 28, -80]} speed={0.25} scale={2.2} />
          <SkyCloud position={[35, 20, -120]} speed={0.35} scale={1.6} />

          {/* Distant background floating islands */}
          <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
            <group position={[90, 12, 50]} scale={4.0}>
              <mesh><coneGeometry args={[4, 5, 6]} /><meshStandardMaterial color="#5a4030" flatShading /></mesh>
              <mesh position={[0, 2.6, 0]}><cylinderGeometry args={[4, 4.3, 0.3, 6]} /><meshStandardMaterial color="#5ac96a" flatShading /></mesh>
            </group>
          </Float>
          <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
            <group position={[-95, 15, -60]} scale={3.5}>
              <mesh><coneGeometry args={[3, 4, 6]} /><meshStandardMaterial color="#6b5344" flatShading /></mesh>
              <mesh position={[0, 2.1, 0]}><cylinderGeometry args={[3, 3.2, 0.3, 6]} /><meshStandardMaterial color="#5ac96a" flatShading /></mesh>
=======
          {/* ─── Slow Drifting Clouds ─── */}
          <SkyCloud position={[-35, 22, 40]} speed={0.3} scale={1.8} color={skyConfig.cloudColor} />
          <SkyCloud position={[30, 26, 110]} speed={0.45} scale={1.5} color={skyConfig.cloudColor} />
          <SkyCloud position={[-40, 28, -80]} speed={0.25} scale={2.2} color={skyConfig.cloudColor} />
          <SkyCloud position={[35, 20, -120]} speed={0.35} scale={1.6} color={skyConfig.cloudColor} />
          <SkyCloud position={[0, 18, 80]} speed={0.28} scale={2.0} color={skyConfig.cloudColor} />
          <SkyCloud position={[-70, 24, 20]} speed={0.22} scale={2.5} color={skyConfig.cloudColor} />

          {/* ─── Additional extra-large distant background mini-islands ─── */}
          <Float speed={0.5} rotationIntensity={0.08} floatIntensity={0.3}>
            <group position={[130, 14, 70]} scale={5.0}>
              <mesh><coneGeometry args={[4, 5, 5]} /><meshStandardMaterial color="#44372e" flatShading /></mesh>
              <mesh position={[0, 2.7, 0]}><cylinderGeometry args={[4, 4.3, 0.3, 5]} /><meshStandardMaterial color="#4ade80" flatShading /></mesh>
            </group>
          </Float>
          <Float speed={0.4} rotationIntensity={0.06} floatIntensity={0.25}>
            <group position={[-120, 16, -80]} scale={4.5}>
              <mesh><coneGeometry args={[3.5, 4.5, 5]} /><meshStandardMaterial color="#44372e" flatShading /></mesh>
              <mesh position={[0, 2.4, 0]}><cylinderGeometry args={[3.5, 3.8, 0.3, 5]} /><meshStandardMaterial color="#4ade80" flatShading /></mesh>
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
            </group>
          </Float>

          {/* Hover Vehicle (Red Off-Road Jeep) */}
          <HoverVehicle
            avatarColor={avatarColor}
            ringsRef={ringsRef}
            targetsRef={targetsRef}
            speedTextRef={speedTextRef}
            boostTextRef={boostTextRef}
            crystalsCollectedTextRef={crystalsCollectedTextRef}
            smashCountTextRef={smashCountTextRef}
            comboTextRef={comboTextRef}
            scoreTextRef={scoreTextRef}
            timeLeftRef={timeLeftRef}
            scoreRef={scoreRef}
            gameStateRef={gameStateRef}
<<<<<<< HEAD
=======
            arenaStateRef={arenaStateRef}
            arenaBoundaryRef={arenaBoundaryRef}
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
            trickTextRef={trickTextRef}
            skyRingsRef={skyRingsRef}
            timeLeftTextRef={timeLeftTextRef}
            onNearPhotoSpot={setIsNearPhotoSpot}
            photoModeActive={photoModeActive}
            cameraAngle={cameraAngle}
            onNearGarageSpot={setIsNearGarageSpot}
            garageModeActive={garageModeActive}
            carColor={carColor}
            physicsItemsRef={physicsItemsRef}
<<<<<<< HEAD
=======
            vehiclePosRef={vehiclePosRef}
            cameraShakeIntensityRef={cameraShakeIntensityRef}
            ballHitTriggerRef={ballHitTriggerRef}
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          />
        </Canvas>
      </KeyboardControls>

<<<<<<< HEAD
=======
      {/* ═══ Math Battle Arena HUD Overlays ═══ */}
      {!photoModeActive && !garageModeActive && arenaState === 'idle' && isNearArenaStart && (
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid #00f5ff',
          borderRadius: '24px',
          padding: '24px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 40px rgba(0, 245, 255, 0.35)',
          zIndex: 10,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          textAlign: 'center',
          color: '#ffffff',
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 900, color: '#00f5ff' }}>
            <span>⚽</span>
            <span>Math Battle Arena</span>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 'bold' }}>
            Drive into the glowing arena gate & press <span style={{ color: '#fbbf24', fontSize: '1.1rem', padding: '2px 8px', background: 'rgba(251,191,36,0.2)', borderRadius: '6px' }}>E</span> to Enter
          </div>
        </div>
      )}

      {arenaState === 'countdown' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.5)',
          zIndex: 20,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: '8rem',
            fontWeight: 900,
            color: '#00f5ff',
            textShadow: '0 0 40px rgba(0,245,255,0.8)',
            animation: 'scalePulse 1s infinite ease-out',
          }}>
            {countdownValue === 0 ? 'GO!' : countdownValue}
          </div>
        </div>
      )}

      {!photoModeActive && !garageModeActive && (arenaState === 'playing' || arenaState === 'math-challenge' || arenaState === 'goal-celebration') && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '16px 24px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          color: '#ffffff',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#00f5ff', fontWeight: 'bold' }}>BLUE (YOU)</span>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#00f5ff' }}>{arenaScores.blue}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)', padding: '0 20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>TIME LEFT</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: arenaTimer <= 30 ? '#ef4444' : '#ffffff', animation: arenaTimer <= 30 ? 'pulse 1s infinite' : 'none' }}>
              {Math.floor(arenaTimer / 60)}:{(arenaTimer % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#d946ef', fontWeight: 'bold' }}>RED (AI)</span>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#d946ef' }}>{arenaScores.red}</span>
          </div>
        </div>
      )}

      {arenaState === 'math-challenge' && arenaMathQuestion && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.75)',
          zIndex: 100,
          fontFamily: "'Outfit', 'Inter', sans-serif",
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '2px solid #fbbf24',
            borderRadius: '28px',
            padding: '40px',
            width: '450px',
            boxShadow: '0 20px 60px rgba(251, 191, 36, 0.35)',
            textAlign: 'center',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '1px' }}>⚠️ MATH CHALLENGE!</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ef4444' }}>⏱️ {mathChallengeTimer}s</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
              Solve this problem to confirm the goal!
            </div>
            <div style={{
              fontSize: '3.6rem',
              fontWeight: 900,
              color: '#ffffff',
              margin: '10px 0',
              textShadow: '0 0 20px rgba(255,255,255,0.2)',
            }}>
              {arenaMathQuestion.question} = ?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {arenaMathQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleMathChallengeSubmit(opt)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    color: '#ffffff',
                    padding: '16px',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(251, 191, 36, 0.15)';
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {arenaState === 'goal-celebration' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: lastGoalScorer === 'blue' ? 'rgba(0, 245, 255, 0.15)' : 'rgba(217, 70, 239, 0.15)',
          zIndex: 50,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: '6rem',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: lastGoalScorer === 'blue' ? '0 0 40px #00f5ff' : '0 0 40px #d946ef',
            animation: 'scalePulse 0.5s infinite alternate ease-in-out',
            textAlign: 'center',
          }}>
            <div>{arenaLedText}</div>
            {arenaLedText.includes('GOAL') && (
              <div style={{ fontSize: '2.2rem', marginTop: '10px', color: '#fbbf24', textShadow: 'none' }}>
                {lastGoalScorer === 'blue' ? 'Goal Confirmed! (+250 Score)' : 'Goal Confirmed for AI!'}
              </div>
            )}
          </div>
        </div>
      )}

      {arenaState === 'game-over' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.9)',
          zIndex: 200,
          fontFamily: "'Outfit', 'Inter', sans-serif",
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '2px solid #00f5ff',
            borderRadius: '32px',
            padding: '40px',
            width: '500px',
            boxShadow: '0 20px 60px rgba(0, 245, 255, 0.25)',
            textAlign: 'center',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#00f5ff', margin: 0 }}>
              Match Finished!
            </h2>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#fbbf24',
              margin: '10px 0',
            }}>
              {arenaScores.blue > arenaScores.red ? '🏆 BLUE WINS!' : arenaScores.blue < arenaScores.red ? '🔴 RED WINS!' : '🤝 DRAW!'}
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Final Score:</span>
                <span style={{ fontWeight: 800 }}>Blue {arenaScores.blue} - {arenaScores.red} Red</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Goals Scored:</span>
                <span style={{ fontWeight: 800, color: '#00f5ff' }}>{mathStats.goals}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Math Accuracy:</span>
                <span style={{ fontWeight: 800, color: '#2ecc71' }}>
                  {mathStats.totalAnswered > 0 ? Math.round((mathStats.correctAnswers / mathStats.totalAnswered) * 100) : 100}% 
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '6px' }}>
                    ({mathStats.correctAnswers}/{mathStats.totalAnswered})
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Best Shot Speed:</span>
                <span style={{ fontWeight: 800, color: '#e056fd' }}>{bestShotSpeed} KM/H</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Match Duration:</span>
                <span style={{ fontWeight: 800 }}>120 Seconds</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button
                onClick={() => {
                  setArenaState('countdown');
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00d2d3, #01a3a4)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 210, 211, 0.3)',
                  transition: 'all 0.2s',
                }}
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => {
                  setArenaState('idle');
                  if (vehiclePosRef.current) {
                    vehiclePosRef.current.set(0, 0.2, 0);
                  }
                }}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🚗 Exit Arena
              </button>
            </div>
          </div>
        </div>
      )}

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      {/* ═══ HUD Overlay ═══ */}
      {!photoModeActive && !garageModeActive && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          padding: '12px 20px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(108, 92, 231, 0.08)',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          color: '#3a3a50',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          pointerEvents: 'none',
        }}>
          <span>⚡ Speed:</span>
          <span ref={speedTextRef} style={{ color: '#6c5ce7', fontWeight: 800 }}>0 KM/H</span>
          <span ref={boostTextRef} style={{ display: 'none', color: '#ec4899', marginLeft: '6px', fontSize: '0.8rem', animation: 'pulse 1s infinite' }}>BOOST!</span>
        </div>
      )}

<<<<<<< HEAD
=======
      {/* ═══ Time of Day HUD Selector ═══ */}
      {!photoModeActive && !garageModeActive && (
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          padding: '6px',
          borderRadius: '20px',
          display: 'flex',
          gap: '8px',
          boxShadow: '0 10px 30px rgba(108, 92, 231, 0.08)',
          zIndex: 10,
          fontFamily: "'Outfit', 'Inter', sans-serif",
        }}>
          {[
            { id: 'morning', label: '🌅 Morning', activeColor: '#38bdf8' },
            { id: 'sunset', label: '🌇 Sunset', activeColor: '#fb923c' },
            { id: 'night', label: '🌌 Night', activeColor: '#818cf8' },
          ].map((tab) => {
            const isActive = timeOfDay === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimeOfDay(tab.id)}
                style={{
                  background: isActive ? tab.activeColor : 'transparent',
                  border: 'none',
                  color: isActive ? '#ffffff' : '#475569',
                  padding: '10px 18px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? `0 4px 12px ${tab.activeColor}44` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      {/* ═══ Back Button ═══ */}
      {!photoModeActive && !garageModeActive && onBack && (
        <button onClick={onBack} style={{
          position: 'absolute', top: '2rem', right: '2rem',
          background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          color: '#3a3a50', padding: '12px 24px', borderRadius: '14px',
          cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold',
          fontFamily: 'Inter, sans-serif', transition: 'all 0.3s',
          boxShadow: '0 8px 32px rgba(108, 92, 231, 0.08)',
          zIndex: 10,
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#6c5ce7';
            e.currentTarget.style.boxShadow = '0 0 18px rgba(108,92,231,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(108, 92, 231, 0.08)';
          }}
        >
          ← Back to City
        </button>
      )}

      {/* ═══ Proximity Alert Prompt to Enter Photo Mode ═══ */}
      {!photoModeActive && !garageModeActive && isNearPhotoSpot && (
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid #fbbf24',
          borderRadius: '24px',
          padding: '20px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 40px rgba(251, 191, 36, 0.25)',
          zIndex: 10,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          textAlign: 'center',
          animation: 'pulse 2s infinite',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 900, color: '#d97706' }}>
            <span>📸</span>
            <span>Scenic Photo Spot Detected!</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#5a627a', fontWeight: 'bold' }}>
            Park your vehicle here to take a picture of the landscape.
          </div>
          <button
            onClick={() => {
              setCameraAngle(0);
              setPhotoModeActive(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              border: 'none',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
            }}
          >
            Enter Photo Mode
          </button>
        </div>
      )}

      {/* ═══ Proximity Alert Prompt to Enter Tuning Customizer ═══ */}
      {!photoModeActive && !garageModeActive && isNearGarageSpot && (
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '2px solid #00d2d3',
          borderRadius: '24px',
          padding: '20px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 40px rgba(0, 210, 211, 0.25)',
          zIndex: 10,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          textAlign: 'center',
          animation: 'pulse 2s infinite',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 900, color: '#01a3a4' }}>
            <span>🔧</span>
            <span>Tuning Garage Detected!</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#5a627a', fontWeight: 'bold' }}>
            Park your vehicle here to customize its body paint.
          </div>
          <button
            onClick={() => {
              setGarageModeActive(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #00d2d3, #01a3a4)',
              border: 'none',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(0, 210, 211, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 210, 211, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 210, 211, 0.3)';
            }}
          >
            Customize Vehicle
          </button>
        </div>
      )}

      {/* ═══ Tuning Garage Customizer Panel ═══ */}
      {garageModeActive && (
        <div style={{
          position: 'absolute',
          right: '2rem',
          top: '2rem',
          bottom: '2rem',
          width: '320px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '24px',
          padding: '30px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          fontFamily: "'Outfit', 'Inter', sans-serif",
          boxSizing: 'border-box',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎨</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.5px' }}>Paint Shop</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '24px' }}>
              Select a high-gloss finish for your Hover Vehicle body panels.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { name: 'Cyber Red', hex: '#ef4444', desc: 'Futuristic Crimson' },
                { name: 'Electric Purple', hex: '#9b59b6', desc: 'Neon Violet' },
                { name: 'Acid Lime', hex: '#2ecc71', desc: 'Lime Green' },
                { name: 'Cyan Sky', hex: '#00d2d3', desc: 'Aero Blue' },
                { name: 'Sunset Gold', hex: '#f1c40f', desc: 'Metallic Gold' },
                { name: 'Carbon Dark', hex: '#2c3e50', desc: 'Stealth Grey' },
              ].map((colorOpt) => {
                const isSelected = carColor === colorOpt.hex;
                return (
                  <button
                    key={colorOpt.hex}
                    onClick={() => setCarColor(colorOpt.hex)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.4)',
                      border: isSelected ? `2.5px solid ${colorOpt.hex}` : '1.5px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '16px',
                      padding: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? `0 8px 20px ${colorOpt.hex}33` : '0 4px 10px rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: colorOpt.hex,
                      boxShadow: `0 4px 12px ${colorOpt.hex}55`,
                      border: '2px solid #ffffff',
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>{colorOpt.name}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', marginTop: '2px' }}>{colorOpt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <div style={{
              background: 'rgba(0, 210, 211, 0.08)',
              border: '1px solid rgba(0, 210, 211, 0.2)',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '0.75rem',
              color: '#01a3a4',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>💡</span>
              <span>Vehicle controls are locked during customization.</span>
            </div>

            <button
              onClick={() => setGarageModeActive(false)}
              style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: 'none',
                color: '#ffffff',
                padding: '14px',
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.15)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.15)';
              }}
            >
              <span>🚗</span>
              <span>Return to Drive</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══ Photo Mode Overlay (Viewfinder & Guidelines) ═══ */}
      {photoModeActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
          boxSizing: 'border-box',
          border: '20px solid rgba(0, 0, 0, 0.3)',
        }}>
          {/* Viewfinder brackets */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '32px', height: '32px', borderLeft: '4px solid #fbbf24', borderTop: '4px solid #fbbf24' }}></div>
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '32px', height: '32px', borderRight: '4px solid #fbbf24', borderTop: '4px solid #fbbf24' }}></div>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '32px', height: '32px', borderLeft: '4px solid #fbbf24', borderBottom: '4px solid #fbbf24' }}></div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '32px', height: '32px', borderRight: '4px solid #fbbf24', borderBottom: '4px solid #fbbf24' }}></div>
<<<<<<< HEAD
          
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          {/* Rule of Thirds Grid Lines */}
          <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.18)' }}></div>
          <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.18)' }}></div>
          <div style={{ position: 'absolute', left: '33.33%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.18)' }}></div>
          <div style={{ position: 'absolute', left: '66.66%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.18)' }}></div>
<<<<<<< HEAD
          
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          {/* Central crosshair circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '48px',
            height: '48px',
            border: '2px solid rgba(251, 191, 36, 0.4)',
            borderRadius: '50%',
          }}></div>
<<<<<<< HEAD
          
=======

>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
          {/* Center tiny dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4px',
            height: '4px',
            background: 'rgba(251, 191, 36, 0.6)',
            borderRadius: '50%',
          }}></div>

          <div style={{
            position: 'absolute',
            top: '35px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '6px 16px',
            borderRadius: '12px',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}>
            📷 PHOTO MODE ACTIVE
          </div>
        </div>
      )}

      {/* ═══ Photo Mode Control Center ═══ */}
      {photoModeActive && (
        <div style={{
          position: 'absolute',
          bottom: '3.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          zIndex: 10,
        }}>
          {/* Angle Switcher */}
          <button
            onClick={() => setCameraAngle(prev => (prev + 1) % 3)}
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '18px',
              color: '#3a3a50',
              padding: '14px 24px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 32px rgba(108, 92, 231, 0.08)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#fbbf24'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'; }}
          >
            <span>🔄</span>
            <span>Angle {cameraAngle + 1}</span>
          </button>

          {/* Shutter Capture Button */}
          <button
            onClick={() => {
              setShutterFlash(true);
              setTimeout(() => {
                setShutterFlash(false);
                const canvas = canvasRef.current || document.querySelector('canvas');
                if (canvas) {
                  try {
                    const url = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `MathVerse_SkyIsland_Photo_${Date.now()}.png`;
                    link.href = url;
                    link.click();
                  } catch (err) {
                    console.error("Failed to capture image:", err);
                  }
                }
              }, 200);
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              padding: '14px 36px',
              borderRadius: '18px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(16, 185, 129, 0.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)'; }}
          >
            <span>📸</span>
            <span>Capture Photo</span>
          </button>

          {/* Exit Button */}
          <button
            onClick={() => setPhotoModeActive(false)}
            style={{
              background: 'rgba(239, 68, 68, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: 'none',
              borderRadius: '18px',
              color: '#ffffff',
              padding: '14px 24px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)'; }}
          >
            <span>❌</span>
            <span>Exit</span>
          </button>
        </div>
      )}

      {/* ═══ Simulated Camera Shutter Flash ═══ */}
      {shutterFlash && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#ffffff',
          zIndex: 99999,
          pointerEvents: 'none',
          animation: 'shutterEffect 0.3s ease-out',
        }}></div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 0) scale(1.02); }
          100% { transform: translate(-50%, 0) scale(1); }
        }
        @keyframes shutterEffect {
          0% { opacity: 0; }
          15% { opacity: 1; }
          100% { opacity: 0; }
        }
<<<<<<< HEAD
=======
        @keyframes scalePulse {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.1); }
        }
>>>>>>> e96a8ffa (feat: add static fallback data, styles, and initial setup for React app)
      `}</style>
    </div>
  );
}
