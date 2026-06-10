import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, KeyboardControls, useKeyboardControls, Float, Box, Cylinder, Cone, Sphere, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- Infinitown Style Details ---

function Cloud({ position, speed, scale = 1 }) {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 40) ref.current.position.x = -40;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={1} />
      </mesh>
      <mesh position={[1.2, -0.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={1} />
      </mesh>
      <mesh position={[-1.2, -0.3, 0.5]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={1} />
      </mesh>
    </group>
  );
}



function SidewalkBlock({ position, size }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[size[0], 0.2, size[2]]} />
      <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
    </mesh>
  );
}

function StreetLight({ position, rotation, lightPower = 18 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 3, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Top Arm — extends in local -X so it faces the road after group rotation */}
      <mesh position={[-0.4, 3, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Light Housing */}
      <mesh position={[-0.7, 2.85, 0]} castShadow>
        <boxGeometry args={[0.28, 0.12, 0.18]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Light Bulb (glowing) */}
      <mesh position={[-0.7, 2.82, 0]}>
        <boxGeometry args={[0.18, 0.07, 0.1]} />
        <meshStandardMaterial color="#ffe8a0" emissive="#ffe8a0" emissiveIntensity={3} />
      </mesh>
      {/* Cone glow effect pointing down */}
      <mesh position={[-0.7, 2.3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.7, 1.2, 16, 1, true]} />
        <meshBasicMaterial color="#ffe8a0" transparent opacity={0.07} side={2} />
      </mesh>
      {/* Point Light shining downward onto road */}
      <pointLight
        position={[-0.7, 2.8, 0]}
        color="#ffe8a0"
        intensity={lightPower}
        distance={12}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}

function Rock({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#7f8c8d" flatShading />
    </mesh>
  );
}

function Bush({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[0.6, 7, 7]} />
      <meshStandardMaterial color="#27ae60" flatShading />
    </mesh>
  );
}

// ── Professional Mountain ────────────────────────────────────────────────────
// Each mountain is 6 overlapping cones: base skirt → main body → shoulder →
// upper face → sharp tip → snow.  Rotate Y randomly for silhouette variety.
function Mountain({ position, scale = 1, rotY = 0, snow = true }) {
  const h = 30 * scale;
  const r = 13 * scale;
  return (
    <group position={[position[0], 0, position[2]]} rotation={[0, rotY, 0]}>
      {/* 1 — Wide dark base / foothills skirt */}
      <mesh position={[0, h * 0.06, 0]} castShadow receiveShadow>
        <coneGeometry args={[r * 1.55, h * 0.16, 6]} />
        <meshStandardMaterial color="#1e2d3d" flatShading roughness={1} />
      </mesh>
      {/* 2 — Main mountain body */}
      <mesh position={[0, h * 0.42, 0]} castShadow receiveShadow>
        <coneGeometry args={[r, h * 0.85, 7]} />
        <meshStandardMaterial color="#2d3f52" flatShading roughness={0.95} />
      </mesh>
      {/* 3 — Shoulder / secondary ridge (offset left) */}
      <mesh position={[-r * 0.38, h * 0.22, r * 0.18]} rotation={[0, 0.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[r * 0.52, h * 0.52, 6]} />
        <meshStandardMaterial color="#3a4f63" flatShading roughness={0.93} />
      </mesh>
      {/* 4 — Upper rocky face — brighter midtone layer */}
      <mesh position={[0, h * 0.68, 0]} castShadow receiveShadow>
        <coneGeometry args={[r * 0.42, h * 0.56, 7]} />
        <meshStandardMaterial color="#4d6278" flatShading roughness={0.88} />
      </mesh>
      {/* 5 — Sharp jagged tip */}
      <mesh position={[0, h * 0.91, 0]} castShadow>
        <coneGeometry args={[r * 0.14, h * 0.22, 5]} />
        <meshStandardMaterial color="#5a7080" flatShading roughness={0.8} />
      </mesh>
      {/* 6 — Snow cap */}
      {snow && <>
        <mesh position={[0, h * 0.845, 0]} castShadow>
          <coneGeometry args={[r * 0.28, h * 0.2, 7]} />
          <meshStandardMaterial color="#dfe6ed" flatShading roughness={0.4} />
        </mesh>
        {/* Snow patch on shoulder */}
        <mesh position={[-r * 0.38, h * 0.38, r * 0.18]} rotation={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[r * 0.12, h * 0.09, 5]} />
          <meshStandardMaterial color="#ecf0f1" flatShading roughness={0.4} />
        </mesh>
      </>}
    </group>
  );
}

// Low-poly Tree
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.2, 1, 5]} />
        <meshStandardMaterial color="#8B4513" flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8, 2, 6]} />
        <meshStandardMaterial color="#2d8a4e" flatShading />
      </mesh>
    </group>
  );
}

// Detailed Low-poly Building Component
function Building({ position, color, size, title, topics, difficulty, onClick, type }) {
  const [hovered, setHovered] = useState(false);

  const renderShape = () => {
    switch (type) {
      case 'algebra':
        return (
          <group position={[0, size[1] / 2 + 0.1, 0]}>
            {/* Main Body */}
            <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} flatShading emissive={hovered ? color : '#000'} emissiveIntensity={0.2} /></mesh>
            {/* Roof tiers */}
            <mesh position={[0, size[1] / 2 + 0.5, 0]} castShadow receiveShadow><boxGeometry args={[size[0] * 0.8, 1, size[2] * 0.8]} /><meshStandardMaterial color="#2c3e50" flatShading /></mesh>
            <mesh position={[0, size[1] / 2 + 1.5, 0]} castShadow receiveShadow><boxGeometry args={[size[0] * 0.4, 1, size[2] * 0.4]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Antenna */}
            <mesh position={[0, size[1] / 2 + 3, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 2, 8]} /><meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={hovered ? 2 : 0.5} /></mesh>
            {/* Entrance */}
            <mesh position={[0, -size[1] / 2 + 1, size[2] / 2 + 0.01]} castShadow><boxGeometry args={[2, 2, 0.2]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
            {/* Detailed Windows - Grid */}
            {[-1.5, 0, 1.5].map((x, ix) => (
              [-2, 0, 2, 4].map((y, iy) => (
                <mesh key={`win-${ix}-${iy}`} position={[x, y, size[2] / 2 + 0.01]} castShadow>
                  <boxGeometry args={[0.8, 1.2, 0.1]} />
                  <meshStandardMaterial color="#fff" emissive={color} emissiveIntensity={0.6} />
                </mesh>
              ))
            ))}
          </group>
        );
      case 'geometry':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Base Block */}
            <mesh position={[0, size[1] * 0.3, 0]} castShadow receiveShadow><boxGeometry args={[size[0], size[1] * 0.6, size[2]]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Intersecting Torus */}
            <mesh position={[0, size[1] * 0.3, 0]} rotation={[Math.PI / 4, 0, 0]} castShadow receiveShadow><torusGeometry args={[size[0] * 0.6, 0.4, 8, 24]} /><meshStandardMaterial color="#fff" flatShading /></mesh>
            <mesh position={[0, size[1] * 0.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow><torusGeometry args={[size[0] * 0.6, 0.4, 8, 24]} /><meshStandardMaterial color="#fff" flatShading /></mesh>
            {/* Floating Pyramid */}
            <Float speed={3} rotationIntensity={1} floatIntensity={2}>
              <mesh position={[0, size[1] * 0.9, 0]} castShadow receiveShadow><coneGeometry args={[size[0] * 0.6, size[1] * 0.5, 4]} /><meshStandardMaterial color={color} flatShading emissive={hovered ? color : '#000'} emissiveIntensity={0.5} /></mesh>
            </Float>
            {/* Corner Orbs */}
            {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) => (
              <mesh key={`orb-${i}`} position={[x * size[0] / 2, 0.5, z * size[2] / 2]} castShadow>
                <sphereGeometry args={[0.6, 16, 16]} />
                <meshStandardMaterial color="#f1c40f" />
              </mesh>
            ))}
          </group>
        );
      case 'data':
        return (
          <group position={[0, size[1] / 2 + 0.1, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Main Holographic Screen */}
            <mesh position={[0, 1, size[2] / 2 + 0.1]} castShadow receiveShadow><boxGeometry args={[size[0] * 0.8, 2.5, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
            {/* Screen Content (Charts) */}
            <mesh position={[-1, 1, size[2] / 2 + 0.22]}><boxGeometry args={[0.5, 1.5, 0.05]} /><meshStandardMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={1} /></mesh>
            <mesh position={[0, 1, size[2] / 2 + 0.22]}><boxGeometry args={[0.5, 2, 0.05]} /><meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={1} /></mesh>
            <mesh position={[1, 1, size[2] / 2 + 0.22]}><boxGeometry args={[0.5, 1, 0.05]} /><meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={1} /></mesh>
            {/* Server Racks Protruding */}
            {[-2, 0, 2].map((x, i) => (
              <mesh key={`rack-${i}`} position={[x, -size[1] / 2 + 1.5, -size[2] / 2 - 0.2]} castShadow>
                <boxGeometry args={[1, 2, 0.5]} />
                <meshStandardMaterial color="#34495e" />
              </mesh>
            ))}
            {/* Data Pipes */}
            <mesh position={[size[0] / 2 + 0.2, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, size[1], 8]} /><meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} /></mesh>
          </group>
        );
      case 'ai':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Core Base */}
            <mesh position={[0, size[1] / 4, 0]} castShadow receiveShadow><cylinderGeometry args={[size[0] * 0.4, size[0] * 0.5, size[1] / 2, 16]} /><meshStandardMaterial color="#2c3e50" flatShading /></mesh>
            {/* Glowing Inner Core */}
            <mesh position={[0, size[1] * 0.6, 0]} castShadow receiveShadow><sphereGeometry args={[size[0] / 2, 16, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1 : 0.4} /></mesh>
            {/* Glass Dome */}
            <mesh position={[0, size[1] * 0.6, 0]} castShadow receiveShadow><sphereGeometry args={[size[0] / 1.7, 16, 16]} /><meshStandardMaterial color="#fff" transparent opacity={0.3} roughness={0.1} metalness={0.8} /></mesh>
            {/* Orbiting Tech Rings */}
            <Float speed={4} rotationIntensity={2}>
              <mesh position={[0, size[1] * 0.6, 0]} rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[size[0] * 0.7, 0.1, 8, 32]} /><meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} /></mesh>
              <mesh position={[0, size[1] * 0.6, 0]} rotation={[-Math.PI / 3, Math.PI / 4, 0]}><torusGeometry args={[size[0] * 0.8, 0.05, 8, 32]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} /></mesh>
            </Float>
          </group>
        );
      case 'cyber':
        return (
          <group position={[0, size[1] / 2 + 0.1, 0]}>
            {/* Fortress Base */}
            <mesh position={[0, -1, 0]} castShadow receiveShadow><boxGeometry args={[size[0] + 1, size[1] - 2, size[2] + 1]} /><meshStandardMaterial color="#2c3e50" /></mesh>
            {/* Core Tower */}
            <mesh castShadow receiveShadow><cylinderGeometry args={[size[0] / 2, size[0] / 1.8, size[1], 8]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Top Command Center */}
            <mesh position={[0, size[1] / 2 + 0.5, 0]} castShadow receiveShadow><cylinderGeometry args={[size[0] / 2.5, size[0] / 2, 1.5, 8]} /><meshStandardMaterial color="#111" /></mesh>
            {/* Lock Symbol */}
            <group position={[0, 1, size[2] / 2 + 0.5]}>
              <mesh castShadow><boxGeometry args={[1.5, 1.2, 0.2]} /><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={hovered ? 0.8 : 0} /></mesh>
              <mesh position={[0, 0.8, 0]}><torusGeometry args={[0.5, 0.15, 8, 16, Math.PI]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
              {/* Keyhole */}
              <mesh position={[0, -0.1, 0.11]}><circleGeometry args={[0.2, 16]} /><meshStandardMaterial color="#222" /></mesh>
            </group>
            {/* Energy Shields */}
            <mesh position={[0, 0, 0]}><sphereGeometry args={[size[0], 16, 16]} /><meshStandardMaterial color={color} transparent opacity={hovered ? 0.15 : 0.05} wireframe={hovered} /></mesh>
          </group>
        );
      case 'physics':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Observatory Base */}
            <mesh position={[0, size[1] * 0.25, 0]} castShadow receiveShadow><cylinderGeometry args={[size[0] * 0.5, size[0] * 0.55, size[1] * 0.5, 12]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Dome */}
            <mesh position={[0, size[1] * 0.55, 0]} castShadow receiveShadow><sphereGeometry args={[size[0] * 0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#ecf0f1" flatShading metalness={0.6} /></mesh>
            {/* Telescope Slit */}
            <mesh position={[0, size[1] * 0.6, size[0] * 0.3]} rotation={[0.3, 0, 0]} castShadow><cylinderGeometry args={[0.15, 0.25, size[1] * 0.4, 8]} /><meshStandardMaterial color="#2c3e50" /></mesh>
            {/* Floating Planet */}
            <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
              <mesh position={[0, size[1] * 0.9, 0]} castShadow><sphereGeometry args={[0.8, 16, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.8 : 0.3} /></mesh>
              <mesh position={[0, size[1] * 0.9, 0]} rotation={[0.5, 0, 0]}><torusGeometry args={[1.2, 0.08, 8, 32]} /><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={0.6} /></mesh>
            </Float>
            {/* Stars around dome */}
            {[0, 1, 2, 3, 4].map(i => <mesh key={`star-${i}`} position={[Math.cos(i * 1.26) * size[0] * 0.6, size[1] * 0.4 + Math.sin(i * 2) * 0.5, Math.sin(i * 1.26) * size[0] * 0.6]}><octahedronGeometry args={[0.2, 0]} /><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={1} flatShading /></mesh>)}
          </group>
        );
      case 'code':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Arena Base */}
            <mesh position={[0, size[1] * 0.2, 0]} castShadow receiveShadow><cylinderGeometry args={[size[0] * 0.6, size[0] * 0.65, size[1] * 0.4, 8]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Screen Walls */}
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
              <mesh key={`scr-${i}`} position={[Math.cos(a) * size[0] * 0.5, size[1] * 0.5, Math.sin(a) * size[0] * 0.5]} rotation={[0, -a + Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[2.5, size[1] * 0.5, 0.15]} />
                <meshStandardMaterial color="#1a1a2e" emissive={hovered ? '#00ff66' : '#003311'} emissiveIntensity={0.8} />
              </mesh>
            ))}
            {/* Floating Code Symbol */}
            <Float speed={3} rotationIntensity={1.5}>
              <mesh position={[0, size[1] * 0.85, 0]} castShadow><boxGeometry args={[1.2, 0.3, 1.2]} /><meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={1} /></mesh>
              <mesh position={[0, size[1] * 0.85 + 0.4, 0]} castShadow><boxGeometry args={[0.3, 0.8, 0.3]} /><meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={1} /></mesh>
            </Float>
          </group>
        );
      case 'chemistry':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Lab Base */}
            <mesh position={[0, size[1] * 0.3, 0]} castShadow receiveShadow><boxGeometry args={[size[0], size[1] * 0.6, size[2]]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Smoke Stack 1 */}
            <mesh position={[-size[0] * 0.3, size[1] * 0.7, 0]} castShadow><cylinderGeometry args={[0.3, 0.4, size[1] * 0.4, 8]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
            {/* Smoke Stack 2 */}
            <mesh position={[size[0] * 0.3, size[1] * 0.8, 0]} castShadow><cylinderGeometry args={[0.25, 0.35, size[1] * 0.5, 8]} /><meshStandardMaterial color="#95a5a6" /></mesh>
            {/* Glowing Tubes */}
            {[-1, 0, 1].map((x, i) => (
              <group key={`tube-${i}`} position={[x * 1.2, size[1] * 0.62, size[2] * 0.5 + 0.2]}>
                <mesh castShadow><sphereGeometry args={[0.4, 8, 8]} /><meshStandardMaterial color={['#e74c3c', '#2ecc71', '#3498db'][i]} transparent opacity={0.7} emissive={['#e74c3c', '#2ecc71', '#3498db'][i]} emissiveIntensity={hovered ? 1 : 0.4} /></mesh>
                <mesh position={[0, 0.6, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.8, 6]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
              </group>
            ))}
            {/* Bubbles */}
            <Float speed={4} floatIntensity={2}>
              {[0, 1, 2].map(i => <mesh key={`bub-${i}`} position={[Math.cos(i * 2.1) * 0.5, size[1] * 0.9 + i * 0.3, Math.sin(i * 2.1) * 0.5]}><sphereGeometry args={[0.15 + i * 0.05, 8, 8]} /><meshStandardMaterial color={color} transparent opacity={0.4} emissive={color} emissiveIntensity={0.5} /></mesh>)}
            </Float>
          </group>
        );
      case 'music':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Concert Hall Base */}
            <mesh position={[0, size[1] * 0.25, 0]} castShadow receiveShadow><boxGeometry args={[size[0], size[1] * 0.5, size[2]]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Curved Roof */}
            <mesh position={[0, size[1] * 0.55, 0]} castShadow receiveShadow><sphereGeometry args={[size[0] * 0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#e74c3c" flatShading metalness={0.4} /></mesh>
            {/* Stage Lights */}
            {[-1.5, 0, 1.5].map((x, i) => (
              <mesh key={`light-${i}`} position={[x, size[1] * 0.6, size[2] * 0.4]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color={['#e74c3c', '#f1c40f', '#3498db'][i]} emissive={['#e74c3c', '#f1c40f', '#3498db'][i]} emissiveIntensity={hovered ? 2 : 0.6} /></mesh>
            ))}
            {/* Floating Notes */}
            <Float speed={3} rotationIntensity={2} floatIntensity={2}>
              <mesh position={[-1, size[1] * 0.9, 0]} castShadow><sphereGeometry args={[0.25, 8, 8]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} /></mesh>
              <mesh position={[-1, size[1] * 0.9 + 0.3, 0.15]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.03, 0.03, 0.6, 4]} /><meshStandardMaterial color="#fff" /></mesh>
            </Float>
            <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
              <mesh position={[1, size[1] * 0.85, 0.5]} castShadow><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={0.5} /></mesh>
              <mesh position={[1, size[1] * 0.85 + 0.25, 0.6]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.03, 0.03, 0.5, 4]} /><meshStandardMaterial color="#f1c40f" /></mesh>
            </Float>
          </group>
        );
      default:
        return <mesh position={[0, size[1] / 2 + 0.1, 0]} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} flatShading /></mesh>;
    }
  };

  return (
    <group position={position}>
      {/* Interaction Hitbox */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); onClick({ title, topics, difficulty, color }); }}
        position={[0, size[1] / 2, 0]}
        visible={false}
      >
        <boxGeometry args={[size[0] + 1, size[1] + 2, size[2] + 1]} />
        <meshBasicMaterial />
      </mesh>

      {/* Sidewalk base for the building */}
      <SidewalkBlock position={[0, 0.1, 0]} size={[size[0] + 2, 0.2, size[2] + 2]} />

      {renderShape()}

      {/* Floating Indicator */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[0, size[1] + 2, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} flatShading />
        </mesh>
      </Float>

      {hovered && (
        <Html position={[0, size[1] + 3.5, 0]} center zIndexRange={[100, 0]}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: `2px solid ${color}`,
            color: '#333',
            whiteSpace: 'nowrap',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            transform: 'scale(1.1)',
            transition: 'transform 0.2s'
          }}>
            <h4 style={{ margin: 0, color }}>{title}</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#666' }}>Click to Enter</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// Decorative Building Component (No interactions)
function DecoBuilding({ position, color, size, type = 'box' }) {
  return (
    <group position={position}>
      <SidewalkBlock position={[0, 0.1, 0]} size={[size[0] + 2, 0.2, size[2] + 2]} />
      {type === 'box' && (
        <group position={[0, size[1] / 2 + 0.1, 0]}>
          <mesh castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} flatShading /></mesh>
          <mesh position={[0, size[1] / 2 + 0.5, 0]} castShadow receiveShadow><boxGeometry args={[size[0] * 0.8, 1, size[2] * 0.8]} /><meshStandardMaterial color="#2c3e50" flatShading /></mesh>
        </group>
      )}
      {type === 'tower' && (
        <group position={[0, size[1] / 2 + 0.1, 0]}>
          <mesh castShadow receiveShadow><cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 12]} /><meshStandardMaterial color={color} flatShading /></mesh>
        </group>
      )}
    </group>
  );
}

// Box colliders — buildings & deco structures
const BUILDINGS_BOUNDS = [
  // Algebra Tower [-14, -14]
  { x: [-14 - 3, -14 + 3], z: [-14 - 3, -14 + 3] },
  // Geometry Center [14, -14]
  { x: [14 - 3.5, 14 + 3.5], z: [-14 - 3.5, -14 + 3.5] },
  // Data Center [-16, 12]
  { x: [-16 - 3.5, -16 + 3.5], z: [12 - 3.5, 12 + 3.5] },
  // AI Lab [16, 12]
  { x: [16 - 3, 16 + 3], z: [12 - 3, 12 + 3] },
  // Cyber Center [10, -30]
  { x: [10 - 4, 10 + 4], z: [-30 - 4, -30 + 4] },
  // Function Observatory [-38, -12]
  { x: [-38 - 3.5, -38 + 3.5], z: [-12 - 3.5, -12 + 3.5] },
  // Algorithm Arena [38, -12]
  { x: [38 - 3.5, 38 + 3.5], z: [-12 - 3.5, -12 + 3.5] },
  // Probability Lab [-14, 38]
  { x: [-14 - 3.5, -14 + 3.5], z: [38 - 3.5, 38 + 3.5] },
  // Pattern Academy [14, 38]
  { x: [14 - 3.5, 14 + 3.5], z: [38 - 3.5, 38 + 3.5] },
  // Deco Buildings
  { x: [-45 - 4, -45 + 4], z: [-35 - 4, -35 + 4] },
  { x: [45 - 4, 45 + 4], z: [-35 - 4, -35 + 4] },
  { x: [-45 - 4, -45 + 4], z: [38 - 4, 38 + 4] },
  { x: [45 - 4, 45 + 4], z: [38 - 4, 38 + 4] },
  { x: [12 - 4, 12 + 4], z: [-50 - 4, -50 + 4] },
  { x: [12 - 4, 12 + 4], z: [52 - 4, 52 + 4] }
];

// Circular colliders — trees, rocks, roundabout pillars  [cx, cz, radius]
const CIRCLE_BOUNDS = [
  // ── Inner city trees (around intersection) ──
  [-8, -8, 0.9], [-6, -10, 0.7], [8, -8, 1.1], [10, -6, 0.8],
  [-10, 8, 1.0], [-8, 10, 0.7], [10, 8, 0.9], [8, 10, 1.1],

  // ── Trees near buildings ──
  [-24, 4, 0.9], [-32, -3, 0.7], [24, -4, 1.0], [32, 3, 0.7],
  [-10, 26, 0.8], [10, 32, 0.9], [18, 24, 0.6], [-18, 32, 1.1],

  // ── Outer world trees ──
  [-50, 15, 1.2], [-55, -15, 1.0], [50, -15, 1.2], [55, 18, 0.9],
  [-40, -35, 1.4], [40, 35, 1.1], [-60, 30, 1.0], [60, -30, 1.3],
  [0, 50, 1.2], [0, -50, 1.0], [-35, 50, 0.8], [35, -50, 1.3],
  [-70, 0, 1.6], [70, 0, 1.5], [45, 45, 1.0], [-45, -45, 1.2],
  [-65, 40, 0.9], [65, -40, 1.1],

  // ── Street lights – South side of horizontal road (z ≈ -4.5) ──
  [-10, -4.5, 0.3], [-20, -4.5, 0.3], [10, -4.5, 0.3], [20, -4.5, 0.3],
  [-30, -4.5, 0.3], [-40, -4.5, 0.3], [30, -4.5, 0.3], [40, -4.5, 0.3],
  [-50, -4.5, 0.3], [50, -4.5, 0.3],

  // ── Street lights – North side of horizontal road (z ≈ 4.5) ──
  [-10, 4.5, 0.3], [-20, 4.5, 0.3], [10, 4.5, 0.3], [20, 4.5, 0.3],
  [-30, 4.5, 0.3], [-40, 4.5, 0.3], [30, 4.5, 0.3], [40, 4.5, 0.3],
  [-50, 4.5, 0.3], [50, 4.5, 0.3],

  // ── Street lights – West side of vertical road (x ≈ -4.5) ──
  [-4.5, -10, 0.3], [-4.5, -20, 0.3], [-4.5, 10, 0.3], [-4.5, 20, 0.3],
  [-4.5, -30, 0.3], [-4.5, -40, 0.3], [-4.5, 30, 0.3], [-4.5, 40, 0.3],
  [-4.5, 50, 0.3],

  // ── Street lights – East side of vertical road (x ≈ 4.5) ──
  [4.5, -10, 0.3], [4.5, -20, 0.3], [4.5, 10, 0.3], [4.5, 20, 0.3],
  [4.5, -30, 0.3], [4.5, -40, 0.3], [4.5, 30, 0.3], [4.5, 40, 0.3],
  [4.5, 50, 0.3],
];

function checkCollision(newX, newZ) {
  const playerRadius = 0.5;

  // Box colliders (buildings)
  for (let box of BUILDINGS_BOUNDS) {
    if (
      newX + playerRadius > box.x[0] &&
      newX - playerRadius < box.x[1] &&
      newZ + playerRadius > box.z[0] &&
      newZ - playerRadius < box.z[1]
    ) {
      return true;
    }
  }

  // Circle colliders (trees, rocks, pillars)
  for (let [cx, cz, r] of CIRCLE_BOUNDS) {
    const dx = newX - cx;
    const dz = newZ - cz;
    if (dx * dx + dz * dz < (r + playerRadius) * (r + playerRadius)) {
      return true;
    }
  }

  return false;
}

// Player Controller
function Player({ avatarColor, avatarGender, accessories = [], onMove, cameraMode }) {
  const playerRef = useRef();
  const [, getKeys] = useKeyboardControls();
  const speed = 8;
  const rotationSpeed = 3.5;

  useFrame((state, delta) => {
    const keys = getKeys();
    if (!playerRef.current) return;

    // Third-Person Movement Controls
    let moveZ = 0;
    let rotateY = 0;

    if (keys.forward) moveZ = 1;
    if (keys.backward) moveZ = -1;
    if (keys.left) rotateY = 1;
    if (keys.right) rotateY = -1;

    // Apply Rotation (A/D to turn)
    if (rotateY !== 0) {
      playerRef.current.rotation.y += rotateY * rotationSpeed * delta;
    }

    // Apply Translation (W/S to move forward/backward)
    if (moveZ !== 0) {
      const direction = new THREE.Vector3(0, 0, moveZ);
      direction.applyQuaternion(playerRef.current.quaternion);

      const newPos = playerRef.current.position.clone().addScaledVector(direction, speed * delta);

      // Clamp to city bounds first
      newPos.x = Math.max(-95, Math.min(95, newPos.x));
      newPos.z = Math.max(-95, Math.min(95, newPos.z));

      // Apply sliding collision
      if (!checkCollision(newPos.x, playerRef.current.position.z)) {
        playerRef.current.position.x = newPos.x;
      }
      if (!checkCollision(playerRef.current.position.x, newPos.z)) {
        playerRef.current.position.z = newPos.z;
      }
      if (onMove) onMove(playerRef.current.position.x, playerRef.current.position.z);
    }

    // Smooth Camera Transition (Follow vs Top-Down)
    if (cameraMode === 'topdown') {
      const cameraTargetPos = playerRef.current.position.clone().add(new THREE.Vector3(0, 45, -15));
      state.camera.position.lerp(cameraTargetPos, 0.05);

      // Look at the player but slightly offset to center the city context
      const lookAtPos = playerRef.current.position.clone();
      state.camera.lookAt(lookAtPos);
    } else {
      const cameraOffset = new THREE.Vector3(0, 3.5, -7); // Camera sits behind and above
      cameraOffset.applyQuaternion(playerRef.current.quaternion);
      const cameraTargetPos = playerRef.current.position.clone().add(cameraOffset);

      state.camera.position.lerp(cameraTargetPos, 0.1);

      // Look slightly above the player's head
      const lookAtPos = playerRef.current.position.clone().add(new THREE.Vector3(0, 1.5, 0));
      state.camera.lookAt(lookAtPos);
    }
  });

  return (
    <group ref={playerRef} position={[0, 0.2, 8]}>
      {/* Body */}
      {avatarGender === 'girl' ? (
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.4, 0.8, 16]} />
          <meshStandardMaterial color={avatarColor || "#00f0ff"} flatShading />
        </mesh>
      ) : (
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
          <meshStandardMaterial color={avatarColor || "#00f0ff"} flatShading />
        </mesh>
      )}

      {/* Head */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>

      {/* Hair / Visor */}
      {avatarGender === 'girl' ? (
        <mesh position={[0, 1.3, -0.3]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
          <coneGeometry args={[0.15, 0.6, 8]} />
          <meshStandardMaterial color={avatarColor || "#00f0ff"} />
        </mesh>
      ) : (
        <mesh position={[0, 1.4, 0.35]} castShadow>
          <boxGeometry args={[0.4, 0.15, 0.2]} />
          <meshStandardMaterial color="#111" emissive="#00f0ff" emissiveIntensity={0.5} />
        </mesh>
      )}


      {/* Backpack / Default Jetpack if no Jetpack equipped? Let's just remove the default backpack to let Jetpack shine */}
      {!accessories.includes('Jetpack') && (
        <mesh position={[0, 0.9, -0.3]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.15]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      )}

      {/* Accessories */}
      {accessories.includes('VR Headset') && (
        <mesh position={[0, 1.4, 0.45]} castShadow>
          <boxGeometry args={[0.45, 0.2, 0.25]} />
          <meshStandardMaterial color="#000" emissive="#00f0ff" emissiveIntensity={0.8} />
        </mesh>
      )}
      {accessories.includes('Jetpack') && (
        <group position={[0, 0.7, -0.3]}>
          <mesh position={[-0.15, 0, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.4]} /><meshStandardMaterial color="#333" /></mesh>
          <mesh position={[0.15, 0, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.4]} /><meshStandardMaterial color="#333" /></mesh>
          <mesh position={[-0.15, -0.25, 0]}><coneGeometry args={[0.06, 0.2]} /><meshStandardMaterial color="#ff5500" emissive="#ff0000" emissiveIntensity={2} /></mesh>
          <mesh position={[0.15, -0.25, 0]}><coneGeometry args={[0.06, 0.2]} /><meshStandardMaterial color="#ff5500" emissive="#ff0000" emissiveIntensity={2} /></mesh>
        </group>
      )}
      {accessories.includes('Cyber Wings') && (
        <group position={[0, 0.8, -0.3]}>
          <mesh position={[-0.4, 0, 0]} rotation={[0, 0, -Math.PI / 6]}><planeGeometry args={[0.6, 0.15]} /><meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} side={2} transparent opacity={0.6} /></mesh>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 6]}><planeGeometry args={[0.6, 0.15]} /><meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} side={2} transparent opacity={0.6} /></mesh>
        </group>
      )}
    </group>
  );
}

export default function FutureTechCity({ onEnterBuilding, avatarColor, avatarGender, accessories, cameraMode, isNight }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const mapMarkerRef = useRef(null);

  const handlePlayerMove = (x, z) => {
    if (mapMarkerRef.current) {
      // World is 200x200 (-100 to 100), map to 0%-100%
      const left = ((x + 100) / 200) * 100;
      const top = ((z + 100) / 200) * 100;
      mapMarkerRef.current.style.left = `${left}%`;
      mapMarkerRef.current.style.top = `${top}%`;
    }
  };

  const keyboardMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW', 'w'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS', 's'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA', 'a'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD', 'd'] },
  ], []);

  // ── Day / Night scene values ──────────────────────────────────────
  const skyColor    = isNight ? '#05060f' : '#a0d8ef';
  const fogColor    = isNight ? '#05060f' : '#a0d8ef';
  const fogNear     = isNight ? 30 : 40;
  const fogFar      = isNight ? 120 : 150;
  const ambInt      = isNight ? 0.04 : 0.6;
  const ambColor    = isNight ? '#2020ff' : '#ffffff';
  const sunInt      = isNight ? 0.08 : 1.2;
  const sunPos      = isNight ? [-15, 8, 5] : [15, 30, -5];   // moon low on horizon
  const grassColor  = isNight ? '#1a3a1a' : '#4caf50';
  const lampPower   = isNight ? 22 : 0;   // lamps off during day

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: skyColor, transition: 'background 2s ease' }}>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, -10]} fov={60} near={0.1} far={1000} />

          <color attach="background" args={[skyColor]} />
          <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

          <ambientLight intensity={ambInt} color={ambColor} />
          <directionalLight
            position={sunPos}
            intensity={sunInt}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
            shadow-bias={-0.0001}
          />

          {/* Stars — visible only at night */}
          {isNight && (
            <group>
              {Array.from({ length: 200 }, (_, i) => {
                const theta = Math.random() * Math.PI * 2;
                const phi   = Math.random() * Math.PI * 0.5; // upper hemisphere only
                const r     = 160 + Math.random() * 20;
                return (
                  <mesh key={`star-${i}`}
                    position={[
                      r * Math.sin(phi) * Math.cos(theta),
                      r * Math.cos(phi),
                      r * Math.sin(phi) * Math.sin(theta)
                    ]}
                  >
                    <sphereGeometry args={[0.25 + Math.random() * 0.35, 4, 4]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                );
              })}
              {/* Moon */}
              <mesh position={[-60, 55, -80]}>
                <sphereGeometry args={[6, 16, 16]} />
                <meshBasicMaterial color="#e8e0c8" />
              </mesh>
            </group>
          )}

          {/* Main Ground (Grass) */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color={grassColor} roughness={1} />
          </mesh>

          {/* ====== Professional Mountain Ranges ====== */}
          <group>
            {/* ── North range (z ≈ -88 → -115) ─────────────────────── */}
            {/* Front row */}
            <Mountain position={[-72, 0, -90]}  scale={1.1} rotY={0.3}  snow={true}  />
            <Mountain position={[-44, 0, -96]}  scale={1.4} rotY={-0.5} snow={true}  />
            <Mountain position={[-18, 0, -88]}  scale={0.9} rotY={1.1}  snow={false} />
            <Mountain position={[  2, 0, -102]} scale={1.6} rotY={0.2}  snow={true}  />
            <Mountain position={[ 26, 0, -91]}  scale={1.2} rotY={-0.8} snow={true}  />
            <Mountain position={[ 50, 0, -88]}  scale={1.0} rotY={0.6}  snow={false} />
            <Mountain position={[ 74, 0, -96]}  scale={1.35} rotY={-0.3} snow={true} />
            {/* Back layer */}
            <Mountain position={[-58, 0, -113]} scale={0.6}  rotY={0.9}  snow={false} />
            <Mountain position={[ -8, 0, -110]} scale={0.65} rotY={-0.4} snow={false} />
            <Mountain position={[ 35, 0, -111]} scale={0.55} rotY={0.7}  snow={false} />
            <Mountain position={[ 68, 0, -112]} scale={0.62} rotY={-0.9} snow={false} />

            {/* ── South range (z ≈ 88 → 115) ──────────────────────── */}
            <Mountain position={[-74, 0,  92]}  scale={1.15} rotY={-0.4} snow={true}  />
            <Mountain position={[-46, 0,  88]}  scale={0.95} rotY={0.8}  snow={false} />
            <Mountain position={[-18, 0,  98]}  scale={1.5}  rotY={-0.2} snow={true}  />
            <Mountain position={[  6, 0,  90]}  scale={1.1}  rotY={1.0}  snow={false} />
            <Mountain position={[ 32, 0,  96]}  scale={1.3}  rotY={-0.6} snow={true}  />
            <Mountain position={[ 58, 0,  90]}  scale={0.9}  rotY={0.4}  snow={false} />
            <Mountain position={[ 80, 0,  99]}  scale={1.25} rotY={-1.2} snow={true}  />
            {/* Back layer */}
            <Mountain position={[-38, 0, 112]}  scale={0.6}  rotY={0.5}  snow={false} />
            <Mountain position={[ 14, 0, 113]}  scale={0.7}  rotY={-0.7} snow={false} />
            <Mountain position={[ 58, 0, 110]}  scale={0.58} rotY={0.3}  snow={false} />

            {/* ── West range (x ≈ -88 → -115) ─────────────────────── */}
            <Mountain position={[-90, 0, -62]}  scale={1.2}  rotY={1.5}  snow={true}  />
            <Mountain position={[-88, 0, -32]}  scale={0.95} rotY={2.2}  snow={false} />
            <Mountain position={[-98, 0,   0]}  scale={1.55} rotY={1.8}  snow={true}  />
            <Mountain position={[-90, 0,  30]}  scale={1.1}  rotY={2.6}  snow={true}  />
            <Mountain position={[-95, 0,  62]}  scale={1.3}  rotY={1.3}  snow={false} />
            {/* Back layer */}
            <Mountain position={[-112, 0, -48]} scale={0.62} rotY={2.0}  snow={false} />
            <Mountain position={[-113, 0,  12]} scale={0.65} rotY={2.8}  snow={false} />
            <Mountain position={[-110, 0,  52]} scale={0.58} rotY={1.6}  snow={false} />

            {/* ── East range (x ≈ 88 → 115) ───────────────────────── */}
            <Mountain position={[ 92, 0, -65]}  scale={1.1}  rotY={-1.5} snow={true}  />
            <Mountain position={[ 88, 0, -30]}  scale={1.45} rotY={-2.0} snow={true}  />
            <Mountain position={[ 98, 0,   5]}  scale={1.0}  rotY={-1.8} snow={false} />
            <Mountain position={[ 90, 0,  36]}  scale={1.35} rotY={-2.5} snow={true}  />
            <Mountain position={[ 96, 0,  66]}  scale={0.9}  rotY={-1.2} snow={false} />
            {/* Back layer */}
            <Mountain position={[110, 0, -52]}  scale={0.6}  rotY={-2.2} snow={false} />
            <Mountain position={[113, 0,  14]}  scale={0.68} rotY={-2.7} snow={false} />
            <Mountain position={[110, 0,  58]}  scale={0.55} rotY={-1.4} snow={false} />

            {/* ── Corner massifs (where borders meet) ─────────────── */}
            <Mountain position={[-85, 0, -87]}  scale={1.2}  rotY={0.8}  snow={true}  />
            <Mountain position={[ 85, 0, -87]}  scale={1.3}  rotY={-0.6} snow={true}  />
            <Mountain position={[-85, 0,  88]}  scale={1.1}  rotY={1.2}  snow={true}  />
            <Mountain position={[ 85, 0,  88]}  scale={1.25} rotY={-1.0} snow={true}  />
          </group>


          {/* Ground Details (Hills, Bushes, Rocks) */}
          <group>
            {/* Hills removed to prevent overlapping with buildings */}
            {/* Random bushes and rocks removed as requested to prevent clipping into buildings */}
          </group>

          {/* Main Roads System */}
          <group position={[0, 0, 0]}>
            {/* Horizontal Road - Asphalt */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[200, 8]} />
              <meshStandardMaterial color="#2b2b2b" roughness={0.9} />
            </mesh>
            {/* Vertical Road - Asphalt */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[8, 200]} />
              <meshStandardMaterial color="#2b2b2b" roughness={0.9} />
            </mesh>

            {/* Outer Ring Roads */}
            {[
              [0, 28, 80, 6], [0, -20, 80, 6],
              [-28, 4, 6, 56], [28, 4, 6, 56]
            ].map(([x, z, w, h], i) => (
              <group key={`ring-${i}`} position={[x, 0, z]}>
                {/* Asphalt */}
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[w, h]} />
                  <meshStandardMaterial color="#2b2b2b" roughness={0.9} />
                </mesh>
              </group>
            ))}

            {/* Natural Entrances / Gates at the 4 ends of the city */}
            {[
              [0, 95, 0], [0, -95, 0], [95, 0, Math.PI / 2], [-95, 0, Math.PI / 2]
            ].map(([x, z, rot], i) => (
              <group key={`entrance-${i}`} position={[x, 0, z]} rotation={[0, rot, 0]}>
                {/* Stone Pillars */}
                <mesh position={[-5, 2.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.5, 5, 1.5]} />
                  <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
                </mesh>
                <mesh position={[5, 2.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.5, 5, 1.5]} />
                  <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
                </mesh>
                {/* Arch Top / Banner */}
                <mesh position={[0, 5.25, 0]} castShadow receiveShadow>
                  <boxGeometry args={[11, 0.5, 1]} />
                  <meshStandardMaterial color="#2c3e50" roughness={0.8} />
                </mesh>
                {/* Bushes near entrance */}
                <Bush position={[-6.5, 0, 0]} scale={1.2} />
                <Bush position={[6.5, 0, 0]} scale={1.2} />
              </group>
            ))}

            {/* --- Road Markings (تخطيط الشوارع) --- */}
            
            {/* Center Dashed Lines (Yellow) */}
            {[...Array(40)].map((_, i) => (
              <mesh key={`hline-${i}`} position={[-95 + i * 5, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 0.2]} /><meshStandardMaterial color="#f1c40f" />
              </mesh>
            ))}
            {[...Array(40)].map((_, i) => (
              <mesh key={`vline-${i}`} position={[0, 0.06, -95 + i * 5]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                <planeGeometry args={[2, 0.2]} /><meshStandardMaterial color="#f1c40f" />
              </mesh>
            ))}

            {/* Continuous Edge Lines (White) */}
            {/* Horizontal Edge Lines */}
            <mesh position={[0, 0.06, -3.7]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[200, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
            <mesh position={[0, 0.06, 3.7]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[200, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
            {/* Vertical Edge Lines */}
            <mesh position={[-3.7, 0.06, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[200, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>
            <mesh position={[3.7, 0.06, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}><planeGeometry args={[200, 0.15]} /><meshStandardMaterial color="#ffffff" /></mesh>

            {/* Sidewalk Borders (Natural Stone) */}
            <mesh position={[0, 0.1, -4.3]} receiveShadow castShadow><boxGeometry args={[200, 0.3, 0.6]} /><meshStandardMaterial color="#95a5a6" roughness={1} /></mesh>
            <mesh position={[0, 0.1, 4.3]} receiveShadow castShadow><boxGeometry args={[200, 0.3, 0.6]} /><meshStandardMaterial color="#95a5a6" roughness={1} /></mesh>
            <mesh position={[-4.3, 0.1, 0]} receiveShadow castShadow><boxGeometry args={[0.6, 0.3, 200]} /><meshStandardMaterial color="#95a5a6" roughness={1} /></mesh>
            <mesh position={[4.3, 0.1, 0]} receiveShadow castShadow><boxGeometry args={[0.6, 0.3, 200]} /><meshStandardMaterial color="#95a5a6" roughness={1} /></mesh>

            {/* Crosswalks (Faded White) */}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-n-${i}`} position={[-3 + i * 1.2, 0.06, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="rgba(255,255,255,0.7)" transparent /></mesh>
            ))}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-s-${i}`} position={[-3 + i * 1.2, 0.06, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="rgba(255,255,255,0.7)" transparent /></mesh>
            ))}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-e-${i}`} position={[5, 0.06, -3 + i * 1.2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="rgba(255,255,255,0.7)" transparent /></mesh>
            ))}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-w-${i}`} position={[-5, 0.06, -3 + i * 1.2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="rgba(255,255,255,0.7)" transparent /></mesh>
            ))}

            {/* Streetlights - Main roads */}
            {[[-10, -4.5], [-20, -4.5], [10, -4.5], [20, -4.5], [-30, -4.5], [-40, -4.5], [30, -4.5], [40, -4.5], [-50, -4.5], [50, -4.5]].map((pos, i) => <StreetLight key={`sl1-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, Math.PI / 2, 0]} lightPower={lampPower} />)}
            {[[-10, 4.5], [-20, 4.5], [10, 4.5], [20, 4.5], [-30, 4.5], [-40, 4.5], [30, 4.5], [40, 4.5], [-50, 4.5], [50, 4.5]].map((pos, i) => <StreetLight key={`sl2-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, -Math.PI / 2, 0]} lightPower={lampPower} />)}
            {/* sl3: x=-4.5 (west side) → arm must point toward +X (road center), so rotation π */}
            {[[-4.5, -10], [-4.5, -20], [-4.5, 10], [-4.5, 20], [-4.5, -30], [-4.5, -40], [-4.5, 30], [-4.5, 40], [-4.5, 50]].map((pos, i) => <StreetLight key={`sl3-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, Math.PI, 0]} lightPower={lampPower} />)}
            {/* sl4: x=+4.5 (east side) → arm must point toward -X (road center), so rotation 0 */}
            {[[4.5, -10], [4.5, -20], [4.5, 10], [4.5, 20], [4.5, -30], [4.5, -40], [4.5, 30], [4.5, 40], [4.5, 50]].map((pos, i) => <StreetLight key={`sl4-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, 0, 0]} lightPower={lampPower} />)}
          </group>

          {/* MathVerse Central Roundabout removed as requested */}



          {/* Clouds */}
          <Cloud position={[-15, 12, -15]} speed={0.5} scale={1.5} />
          <Cloud position={[10, 15, -5]} speed={0.8} scale={1} />
          <Cloud position={[-5, 10, 15]} speed={0.3} scale={1.2} />
          <Cloud position={[-40, 14, 30]} speed={0.4} scale={1.8} />
          <Cloud position={[35, 11, -30]} speed={0.6} scale={1.3} />
          <Cloud position={[50, 13, 20]} speed={0.35} scale={1.6} />
          <Cloud position={[-55, 16, -10]} speed={0.7} scale={1.1} />
          <Cloud position={[20, 18, 50]} speed={0.25} scale={2.0} />
          <Cloud position={[-30, 12, -50]} speed={0.45} scale={1.4} />

          {/* Buildings */}
          <Building
            type="algebra" position={[-14, 0, -14]} size={[5, 12, 5]} color="#3b82f6"
            title="Algebra Tower" topics={['Equations', 'Functions', 'Variables']} difficulty="Medium"
            onClick={setSelectedBuilding}
          />

          <Building
            type="geometry" position={[14, 0, -14]} size={[6, 8, 6]} color="#10b981"
            title="Geometry Center" topics={['Area', 'Volume', 'Spatial Reasoning']} difficulty="Easy"
            onClick={setSelectedBuilding}
          />

          <Building
            type="data" position={[-16, 0, 12]} size={[6, 7, 6]} color="#f59e0b"
            title="Data Center" topics={['Statistics', 'Data Analysis', 'Charts']} difficulty="Medium"
            onClick={setSelectedBuilding}
          />

          <Building
            type="ai" position={[16, 0, 12]} size={[5, 10, 5]} color="#8b5cf6"
            title="AI Lab" topics={['Pattern Recognition', 'Predictions', 'Neural Basics']} difficulty="Hard"
            onClick={setSelectedBuilding}
          />

          <Building
            type="cyber" position={[10, 0, -30]} size={[7, 9, 7]} color="#ef4444"
            title="Cyber Security Center" topics={['Logic', 'Encryption', 'Defense']} difficulty="Expert"
            onClick={setSelectedBuilding}
          />

          {/* New Buildings */}
          <Building
            type="physics" position={[-38, 0, -12]} size={[6, 10, 6]} color="#e67e22"
            title="Function Observatory" topics={['Linear', 'Quadratic', 'Polynomials']} difficulty="Hard"
            onClick={setSelectedBuilding}
          />

          <Building
            type="code" position={[38, 0, -12]} size={[6, 8, 6]} color="#00b894"
            title="Algorithm Arena" topics={['Algorithms', 'Loops', 'Logic']} difficulty="Medium"
            onClick={setSelectedBuilding}
          />

          <Building
            type="chemistry" position={[-14, 0, 38]} size={[6, 8, 6]} color="#6c5ce7"
            title="Probability Lab" topics={['Statistics', 'Chance', 'Distributions']} difficulty="Medium"
            onClick={setSelectedBuilding}
          />

          <Building
            type="music" position={[14, 0, 38]} size={[6, 7, 6]} color="#fd79a8"
            title="Pattern Academy" topics={['Sequences', 'Fractals', 'Symmetry']} difficulty="Easy"
            onClick={setSelectedBuilding}
          />

          {/* Deco Buildings (No interactions) */}
          <DecoBuilding position={[-45, 0, -35]} size={[8, 14, 8]} color="#7f8c8d" type="box" />
          <DecoBuilding position={[45, 0, -35]} size={[7, 18, 7]} color="#95a5a6" type="tower" />
          <DecoBuilding position={[-45, 0, 38]} size={[7, 12, 7]} color="#bdc3c7" type="tower" />
          <DecoBuilding position={[45, 0, 38]} size={[8, 10, 8]} color="#34495e" type="box" />
          <DecoBuilding position={[12, 0, -50]} size={[8, 16, 8]} color="#95a5a6" type="box" />
          <DecoBuilding position={[12, 0, 52]} size={[7, 15, 7]} color="#7f8c8d" type="tower" />

          {/* Decorative Elements */}
          <Tree position={[-8, 0, -8]} scale={1.2} />
          <Tree position={[-6, 0, -10]} scale={0.8} />
          <Tree position={[8, 0, -8]} scale={1.5} />
          <Tree position={[10, 0, -6]} scale={1} />
          <Tree position={[-10, 0, 8]} scale={1.3} />
          <Tree position={[-8, 0, 10]} scale={0.9} />
          <Tree position={[10, 0, 8]} scale={1.1} />
          <Tree position={[8, 0, 10]} scale={1.4} />
          {/* Trees near buildings */}
          <Tree position={[-24, 0, 4]} scale={1.1} />
          <Tree position={[-32, 0, -3]} scale={0.9} />
          <Tree position={[24, 0, -4]} scale={1.3} />
          <Tree position={[32, 0, 3]} scale={0.8} />
          <Tree position={[-10, 0, 26]} scale={1.0} />
          <Tree position={[10, 0, 32]} scale={1.2} />
          <Tree position={[18, 0, 24]} scale={0.7} />
          <Tree position={[-18, 0, 32]} scale={1.4} />
          {/* Outer world trees */}
          <Tree position={[-50, 0, 15]} scale={1.6} />
          <Tree position={[-55, 0, -15]} scale={1.3} />
          <Tree position={[50, 0, -15]} scale={1.5} />
          <Tree position={[55, 0, 18]} scale={1.1} />
          <Tree position={[-40, 0, -35]} scale={1.8} />
          <Tree position={[40, 0, 35]} scale={1.4} />
          <Tree position={[-60, 0, 30]} scale={1.2} />
          <Tree position={[60, 0, -30]} scale={1.7} />
          <Tree position={[0, 0, 50]} scale={1.5} />
          <Tree position={[0, 0, -50]} scale={1.3} />
          <Tree position={[-35, 0, 50]} scale={1.0} />
          <Tree position={[35, 0, -50]} scale={1.6} />
          <Tree position={[-70, 0, 0]} scale={2.0} />
          <Tree position={[70, 0, 0]} scale={1.9} />
          <Tree position={[45, 0, 45]} scale={1.3} />
          <Tree position={[-45, 0, -45]} scale={1.5} />
          <Tree position={[-65, 0, 40]} scale={1.1} />
          <Tree position={[65, 0, -40]} scale={1.4} />
          {/* Park benches (simple box representations) */}
          {[[-22, 8], [22, -8], [-8, 20], [8, -18]].map((p, i) => (
            <group key={`bench-${i}`} position={[p[0], 0, p[1]]}>
              <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1.5, 0.1, 0.5]} /><meshStandardMaterial color="#8B4513" /></mesh>
              <mesh position={[-0.6, 0.15, 0]} castShadow><boxGeometry args={[0.1, 0.3, 0.4]} /><meshStandardMaterial color="#333" /></mesh>
              <mesh position={[0.6, 0.15, 0]} castShadow><boxGeometry args={[0.1, 0.3, 0.4]} /><meshStandardMaterial color="#333" /></mesh>
            </group>
          ))}

          {/* ====== Lake & Nature Zone ====== */}
          <group position={[-58, 0, 18]}>
            {/* Sandy / muddy shore base */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[14, 10, 1]} receiveShadow>
              <circleGeometry args={[1, 32]} />
              <meshStandardMaterial color="#c2a96e" roughness={1} />
            </mesh>

            {/* Water surface — main layer */}
            <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[11, 7.5, 1]} receiveShadow>
              <circleGeometry args={[1, 32]} />
              <meshStandardMaterial
                color={isNight ? '#0a1a3a' : '#1e90ff'}
                transparent opacity={0.78}
                roughness={0.05}
                metalness={0.2}
                emissive={isNight ? '#0a1a4a' : '#006bb3'}
                emissiveIntensity={isNight ? 0.4 : 0.1}
              />
            </mesh>

            {/* Water shimmer layer on top */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[10.5, 7, 1]}>
              <circleGeometry args={[1, 32]} />
              <meshStandardMaterial color="#87ceeb" transparent opacity={0.2} roughness={0} />
            </mesh>

            {/* Rocks around the shore — various sizes */}
            {[
              [10, 0, 0,   1.4, '#7f8c8d'],   // East big
              [8,  0, 4,   0.8, '#95a5a6'],
              [5,  0, 8,   1.1, '#6d7d8b'],
              [-2, 0, 9.5, 0.9, '#7f8c8d'],
              [-8, 0, 7,   1.3, '#555f69'],
              [-12,0, 2,   1.0, '#95a5a6'],
              [-11,0,-4,   0.7, '#6d7d8b'],
              [-7, 0,-8,   1.2, '#7f8c8d'],
              [0,  0,-9.5, 0.9, '#9aabb5'],
              [6,  0,-7,   1.4, '#555f69'],
              [11, 0,-3,   0.8, '#7f8c8d'],
              [3,  0, 9,   0.6, '#95a5a6'],
              [-4, 0,-9,   1.1, '#6d7d8b'],
            ].map(([x, y, z, s, c], i) => (
              <mesh key={`lakerock-${i}`} position={[x, 0.15, z]} scale={s} castShadow receiveShadow>
                <dodecahedronGeometry args={[0.65, 0]} />
                <meshStandardMaterial color={c} flatShading roughness={0.9} />
              </mesh>
            ))}

            {/* Small pebble clusters */}
            {[
              [7, 6], [-5, 8.5], [-10, -2], [4, -8], [9, -5],
            ].map(([x, z], i) => (
              <group key={`pebbles-${i}`} position={[x, 0.12, z]}>
                {[0, 0.5, 1, 1.5, 2].map(j => (
                  <mesh key={j} position={[Math.cos(j * 1.3) * 0.4, 0, Math.sin(j * 1.3) * 0.4]} castShadow>
                    <sphereGeometry args={[0.12 + Math.random() * 0.1, 5, 5]} />
                    <meshStandardMaterial color="#9aabb5" flatShading />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Reed / grass sticks along shore */}
            {[
              [9, 3], [7.5, -2], [-9, 3], [-6, 8], [2, 9], [-3, -9],
            ].map(([x, z], i) => (
              <group key={`reed-${i}`} position={[x, 0, z]}>
                <mesh position={[0, 0.7, 0]} castShadow>
                  <cylinderGeometry args={[0.04, 0.06, 1.4, 5]} />
                  <meshStandardMaterial color="#6b7c3a" />
                </mesh>
                {/* Reed tip */}
                <mesh position={[0, 1.5, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.04, 0.35, 6]} />
                  <meshStandardMaterial color="#5a4020" flatShading />
                </mesh>
              </group>
            ))}

            {/* Lily pads on water */}
            {[
              [3, 2], [-3, 1], [1, -3], [-2, -2], [5, -1],
            ].map(([x, z], i) => (
              <group key={`lily-${i}`} position={[x, 0.11, z]}>
                {/* Pad */}
                <mesh rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
                  <circleGeometry args={[0.45, 12]} />
                  <meshStandardMaterial color="#2d7a3a" />
                </mesh>
                {/* Flower */}
                <mesh position={[0, 0.05, 0]}>
                  <sphereGeometry args={[0.12, 6, 6]} />
                  <meshStandardMaterial color={['#ff69b4','#fff','#ffe4b5','#ff69b4','#fff'][i]} emissive={['#ff69b4','#eee','#ffd700','#ff69b4','#eee'][i]} emissiveIntensity={0.3} />
                </mesh>
              </group>
            ))}

            {/* Trees forming a forest around the lake */}
            {[
              [13, -6, 1.4], [13, 6, 1.1], [9, 12, 1.6], [0, 13, 1.2],
              [-9, 12, 1.5], [-14, 5, 1.3], [-14, -5, 1.7], [-9, -11, 1.2],
              [0, -12, 1.4], [9, -10, 1.0], [14, 0, 1.5], [11, 10, 0.9],
            ].map(([x, z, s], i) => (
              <Tree key={`laketree-${i}`} position={[x, 0, z]} scale={s} />
            ))}

            {/* Wooden dock / pier */}
            <group position={[9.5, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
              {/* Planks */}
              {[0, 0.6, 1.2, 1.8, 2.4].map((z, i) => (
                <mesh key={`plank-${i}`} position={[0, 0.08, z]} castShadow>
                  <boxGeometry args={[1.2, 0.08, 0.5]} />
                  <meshStandardMaterial color="#8B4513" roughness={0.9} />
                </mesh>
              ))}
              {/* Support poles */}
              {[[-0.5, 0], [0.5, 0], [-0.5, 2.4], [0.5, 2.4]].map(([x, z], i) => (
                <mesh key={`pole-${i}`} position={[x, -0.3, z]} castShadow>
                  <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
                  <meshStandardMaterial color="#5a3010" />
                </mesh>
              ))}
            </group>

            {/* Night-time water glow point light */}
            {isNight && (
              <pointLight position={[0, 1.5, 0]} color="#1e90ff" intensity={6} distance={18} decay={2} />
            )}
          </group>

          <Player avatarColor={avatarColor} avatarGender={avatarGender} accessories={accessories} onMove={handlePlayerMove} cameraMode={cameraMode} />
        </Canvas>
      </KeyboardControls>

      {/* Floating HUD */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '15px 25px',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,1)'
        }}>
          <h2 style={{ color: '#2c3e50', margin: '0 0 5px 0', fontFamily: 'Space Grotesk', fontSize: '1.5rem', fontWeight: 'bold' }}>
            MathVerse
          </h2>
          <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
            Use W A S D or Arrow Keys to explore
          </p>
        </div>
      </div>

      {/* Circular Minimap HUD */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '2rem',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'rgba(26, 30, 40, 0.75)',
        backdropFilter: 'blur(8px)',
        border: '3px solid rgba(0, 240, 255, 0.4)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(0, 240, 255, 0.2)',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Roads on minimap */}
        <div style={{ position: 'absolute', left: '50%', top: '0', width: '2px', height: '100%', background: 'rgba(127,140,141,0.4)', transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '2px', background: 'rgba(127,140,141,0.4)', transform: 'translateY(-50%)' }} />

        {/* Render building blips */}
        {(() => {
          const buildingColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#e67e22', '#00b894', '#6c5ce7', '#fd79a8'];
          const decoStart = 9;
          return BUILDINGS_BOUNDS.map((bounds, i) => {
            const cx = (bounds.x[0] + bounds.x[1]) / 2;
            const cz = (bounds.z[0] + bounds.z[1]) / 2;
            const left = ((cx + 100) / 200) * 100;
            const top = ((cz + 100) / 200) * 100;
            const isDeco = i >= decoStart;
            const isInteractive = i < decoStart;
            const blipColor = isDeco ? 'rgba(150,160,170,0.6)' : buildingColors[i] || '#fff';
            const blipSize = isDeco ? '10px' : '12px';
            return (
              <div key={`blip-${i}`} style={{
                position: 'absolute',
                left: `${left}%`, top: `${top}%`,
                width: blipSize, height: blipSize,
                background: blipColor,
                borderRadius: '3px',
                transform: 'translate(-50%, -50%)',
                boxShadow: isInteractive ? `0 0 6px ${blipColor}` : 'none',
                border: isInteractive ? '1px solid rgba(255,255,255,0.5)' : 'none'
              }} />
            )
          });
        })()}
        {/* Player Marker */}
        <div ref={mapMarkerRef} style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: '10px', height: '10px',
          background: '#ff4757',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px #ff4757',
          transition: 'left 0.1s linear, top 0.1s linear',
          zIndex: 10
        }} />
        {/* Minimap scanner line effect (Optional decoration) */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '100%', height: '2px', background: 'linear-gradient(90deg, rgba(0,240,255,0) 0%, rgba(0,240,255,0.5) 100%)',
          transformOrigin: 'left center',
          animation: 'radarScan 4s linear infinite'
        }} />
        <style>{`
          @keyframes radarScan {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Building Interaction Modal */}
      <AnimatePresence>
        {selectedBuilding && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)',
              zIndex: 20
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              padding: '2.5rem', minWidth: '450px',
              borderRadius: '24px',
              borderTop: `6px solid ${selectedBuilding.color}`,
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, color: '#2c3e50', fontFamily: 'Space Grotesk', fontSize: '2rem' }}>{selectedBuilding.title}</h2>
                <button
                  onClick={() => setSelectedBuilding(null)}
                  style={{
                    background: '#f1f2f6', border: 'none', color: '#747d8c',
                    width: '36px', height: '36px', borderRadius: '50%',
                    cursor: 'pointer', fontSize: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.target.style.background = '#eccc68'; e.target.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.target.style.background = '#f1f2f6'; e.target.style.color = '#747d8c'; }}
                >×</button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#a4b0be', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>LEARNING TOPICS</span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {selectedBuilding.topics.map(topic => (
                    <span key={topic} style={{
                      background: `${selectedBuilding.color}15`,
                      color: selectedBuilding.color,
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', background: '#f1f2f6', padding: '16px 20px', borderRadius: '16px' }}>
                <div>
                  <span style={{ color: '#a4b0be', fontSize: '0.85rem', fontWeight: 'bold' }}>DIFFICULTY</span>
                  <div style={{ color: '#2f3542', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '4px' }}>{selectedBuilding.difficulty}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#a4b0be', fontSize: '0.85rem', fontWeight: 'bold' }}>STATUS</span>
                  <div style={{ color: '#2ed573', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '4px' }}>Unlocked</div>
                </div>
              </div>

              <button style={{
                width: '100%', padding: '18px',
                background: selectedBuilding.color, color: 'white',
                border: 'none', borderRadius: '16px',
                fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: `0 8px 20px ${selectedBuilding.color}50`,
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
                onClick={() => {
                  if (onEnterBuilding) onEnterBuilding(selectedBuilding);
                  setSelectedBuilding(null); // Close the modal
                }}
                onMouseOver={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = `0 12px 25px ${selectedBuilding.color}60`; }}
                onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 8px 20px ${selectedBuilding.color}50`; }}
              >
                Enter Environment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
