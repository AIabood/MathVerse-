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

function StreetLight({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]} castShadow><cylinderGeometry args={[0.05, 0.1, 3, 8]} /><meshStandardMaterial color="#333" /></mesh>
      {/* Top Arm */}
      <mesh position={[0.4, 3, 0]} castShadow rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.05, 0.05, 0.8, 8]} /><meshStandardMaterial color="#333" /></mesh>
      {/* Light Bulb */}
      <mesh position={[0.7, 2.9, 0]}><boxGeometry args={[0.2, 0.1, 0.1]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} /></mesh>
      {/* Light Glow */}
      <mesh position={[0.7, 2.4, 0]}><coneGeometry args={[0.8, 1, 16]} /><meshBasicMaterial color="#fff" transparent opacity={0.1} /></mesh>
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
            <mesh position={[0, size[1]/2 + 0.5, 0]} castShadow receiveShadow><boxGeometry args={[size[0]*0.8, 1, size[2]*0.8]} /><meshStandardMaterial color="#2c3e50" flatShading /></mesh>
            <mesh position={[0, size[1]/2 + 1.5, 0]} castShadow receiveShadow><boxGeometry args={[size[0]*0.4, 1, size[2]*0.4]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Antenna */}
            <mesh position={[0, size[1]/2 + 3, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 2, 8]} /><meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={hovered ? 2 : 0.5} /></mesh>
            {/* Entrance */}
            <mesh position={[0, -size[1]/2 + 1, size[2]/2 + 0.01]} castShadow><boxGeometry args={[2, 2, 0.2]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
            {/* Detailed Windows - Grid */}
            {[-1.5, 0, 1.5].map((x, ix) => (
              [-2, 0, 2, 4].map((y, iy) => (
                <mesh key={`win-${ix}-${iy}`} position={[x, y, size[2]/2 + 0.01]} castShadow>
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
            <mesh position={[0, size[1] * 0.3, 0]} rotation={[Math.PI/4, 0, 0]} castShadow receiveShadow><torusGeometry args={[size[0]*0.6, 0.4, 8, 24]} /><meshStandardMaterial color="#fff" flatShading /></mesh>
            <mesh position={[0, size[1] * 0.3, 0]} rotation={[0, Math.PI/4, 0]} castShadow receiveShadow><torusGeometry args={[size[0]*0.6, 0.4, 8, 24]} /><meshStandardMaterial color="#fff" flatShading /></mesh>
            {/* Floating Pyramid */}
            <Float speed={3} rotationIntensity={1} floatIntensity={2}>
              <mesh position={[0, size[1] * 0.9, 0]} castShadow receiveShadow><coneGeometry args={[size[0] * 0.6, size[1] * 0.5, 4]} /><meshStandardMaterial color={color} flatShading emissive={hovered ? color : '#000'} emissiveIntensity={0.5} /></mesh>
            </Float>
            {/* Corner Orbs */}
            {[[-1,-1], [-1,1], [1,-1], [1,1]].map(([x, z], i) => (
              <mesh key={`orb-${i}`} position={[x * size[0]/2, 0.5, z * size[2]/2]} castShadow>
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
                <mesh key={`rack-${i}`} position={[x, -size[1]/2 + 1.5, -size[2]/2 - 0.2]} castShadow>
                  <boxGeometry args={[1, 2, 0.5]} />
                  <meshStandardMaterial color="#34495e" />
                </mesh>
             ))}
             {/* Data Pipes */}
             <mesh position={[size[0]/2 + 0.2, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, size[1], 8]} /><meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} /></mesh>
          </group>
        );
      case 'ai':
        return (
          <group position={[0, 0.1, 0]}>
            {/* Core Base */}
            <mesh position={[0, size[1] / 4, 0]} castShadow receiveShadow><cylinderGeometry args={[size[0]*0.4, size[0]*0.5, size[1]/2, 16]} /><meshStandardMaterial color="#2c3e50" flatShading /></mesh>
            {/* Glowing Inner Core */}
            <mesh position={[0, size[1] * 0.6, 0]} castShadow receiveShadow><sphereGeometry args={[size[0] / 2, 16, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1 : 0.4} /></mesh>
            {/* Glass Dome */}
            <mesh position={[0, size[1] * 0.6, 0]} castShadow receiveShadow><sphereGeometry args={[size[0] / 1.7, 16, 16]} /><meshStandardMaterial color="#fff" transparent opacity={0.3} roughness={0.1} metalness={0.8} /></mesh>
            {/* Orbiting Tech Rings */}
            <Float speed={4} rotationIntensity={2}>
              <mesh position={[0, size[1] * 0.6, 0]} rotation={[Math.PI/3, 0, 0]}><torusGeometry args={[size[0]*0.7, 0.1, 8, 32]} /><meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1} /></mesh>
              <mesh position={[0, size[1] * 0.6, 0]} rotation={[-Math.PI/3, Math.PI/4, 0]}><torusGeometry args={[size[0]*0.8, 0.05, 8, 32]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} /></mesh>
            </Float>
          </group>
        );
      case 'cyber':
        return (
          <group position={[0, size[1] / 2 + 0.1, 0]}>
            {/* Fortress Base */}
            <mesh position={[0, -1, 0]} castShadow receiveShadow><boxGeometry args={[size[0]+1, size[1]-2, size[2]+1]} /><meshStandardMaterial color="#2c3e50" /></mesh>
            {/* Core Tower */}
            <mesh castShadow receiveShadow><cylinderGeometry args={[size[0] / 2, size[0] / 1.8, size[1], 8]} /><meshStandardMaterial color={color} flatShading /></mesh>
            {/* Top Command Center */}
            <mesh position={[0, size[1] / 2 + 0.5, 0]} castShadow receiveShadow><cylinderGeometry args={[size[0] / 2.5, size[0] / 2, 1.5, 8]} /><meshStandardMaterial color="#111" /></mesh>
            {/* Lock Symbol */}
            <group position={[0, 1, size[2]/2 + 0.5]}>
              <mesh castShadow><boxGeometry args={[1.5, 1.2, 0.2]} /><meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={hovered ? 0.8 : 0} /></mesh>
              <mesh position={[0, 0.8, 0]}><torusGeometry args={[0.5, 0.15, 8, 16, Math.PI]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
              {/* Keyhole */}
              <mesh position={[0, -0.1, 0.11]}><circleGeometry args={[0.2, 16]} /><meshStandardMaterial color="#222" /></mesh>
            </group>
            {/* Energy Shields */}
            <mesh position={[0, 0, 0]}><sphereGeometry args={[size[0], 16, 16]} /><meshStandardMaterial color={color} transparent opacity={hovered ? 0.15 : 0.05} wireframe={hovered} /></mesh>
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

const BUILDINGS_BOUNDS = [
  // Algebra Tower
  { x: [-14 - 3, -14 + 3], z: [-14 - 3, -14 + 3] },
  // Geometry Center
  { x: [14 - 3.5, 14 + 3.5], z: [-14 - 3.5, -14 + 3.5] },
  // Data Center
  { x: [-16 - 3.5, -16 + 3.5], z: [12 - 3.5, 12 + 3.5] },
  // AI Lab
  { x: [16 - 3, 16 + 3], z: [12 - 3, 12 + 3] },
  // Cyber Center
  { x: [0 - 4, 0 + 4], z: [-20 - 4, -20 + 4] },
  // Central Fountain
  { x: [-2, 2], z: [-2, 2] }
];

function checkCollision(newX, newZ) {
  const playerRadius = 0.5; // Padding so player doesn't clip into walls
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
  return false;
}

// Player Controller
function Player() {
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
      newPos.x = Math.max(-25, Math.min(25, newPos.x));
      newPos.z = Math.max(-25, Math.min(25, newPos.z));

      // Apply sliding collision
      if (!checkCollision(newPos.x, playerRef.current.position.z)) {
        playerRef.current.position.x = newPos.x;
      }
      if (!checkCollision(playerRef.current.position.x, newPos.z)) {
        playerRef.current.position.z = newPos.z;
      }
    }

    // Smooth Third-Person Camera Follow
    const cameraOffset = new THREE.Vector3(0, 3.5, -7); // Camera sits behind and above
    cameraOffset.applyQuaternion(playerRef.current.quaternion);
    const cameraTargetPos = playerRef.current.position.clone().add(cameraOffset);

    state.camera.position.lerp(cameraTargetPos, 0.1);

    // Look slightly above the player's head
    const lookAtPos = playerRef.current.position.clone().add(new THREE.Vector3(0, 1.5, 0));
    state.camera.lookAt(lookAtPos);
  });

  return (
    <group ref={playerRef} position={[0, 0.2, 8]}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial color="#00f0ff" flatShading />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[0, 1.4, 0.3]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#7000ff" />
      </mesh>
    </group>
  );
}

export default function FutureTechCity({ onEnterBuilding }) {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const keyboardMap = useMemo(() => [
    { name: 'forward', keys: ['ArrowUp', 'KeyW', 'w'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS', 's'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA', 'a'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD', 'd'] },
  ], []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#a0d8ef' }}>
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, -10]} fov={60} near={0.1} far={1000} />

          <color attach="background" args={['#a0d8ef']} />
          <fog attach="fog" args={['#a0d8ef', 30, 80]} />

          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight
            position={[15, 30, -5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-bias={-0.0001}
          />

          {/* Main Ground (Grass) */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#a8e6cf" roughness={1} />
          </mesh>

          {/* Ground Details (Hills, Bushes, Rocks) */}
          <group>
            {[[-10, -20], [20, 15], [-25, 25], [25, -25], [15, -15], [-15, 10]].map((pos, i) => (
               <mesh key={`hill-${i}`} position={[pos[0], -0.5, pos[1]]} receiveShadow>
                 <sphereGeometry args={[4, 16, 16]} />
                 <meshStandardMaterial color="#9addc4" flatShading />
               </mesh>
            ))}
            {[...Array(30)].map((_, i) => {
              const x = (Math.random() - 0.5) * 80;
              const z = (Math.random() - 0.5) * 80;
              if (Math.abs(x) < 8 && Math.abs(z) < 8) return null; // Avoid center intersection
              return Math.random() > 0.5 ? 
                <Bush key={`bush-${i}`} position={[x, 0, z]} scale={0.5 + Math.random()} /> :
                <Rock key={`rock-${i}`} position={[x, 0, z]} scale={0.3 + Math.random()} />
            })}
          </group>

          {/* Main Roads System */}
          <group position={[0, 0, 0]}>
            {/* Horizontal Road */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 8]} />
              <meshStandardMaterial color="#7f8c8d" />
            </mesh>
            {/* Vertical Road */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[8, 100]} />
              <meshStandardMaterial color="#7f8c8d" />
            </mesh>

            {/* Road Dashed Lines */}
            {[...Array(20)].map((_, i) => (
              <mesh key={`hline-${i}`} position={[-45 + i * 5, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 0.2]} /><meshStandardMaterial color="#f1c40f" />
              </mesh>
            ))}
            {[...Array(20)].map((_, i) => (
              <mesh key={`vline-${i}`} position={[0, 0.06, -45 + i * 5]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                <planeGeometry args={[2, 0.2]} /><meshStandardMaterial color="#f1c40f" />
              </mesh>
            ))}

            {/* Sidewalk Borders */}
            <mesh position={[0, 0.1, -4.2]} receiveShadow castShadow><boxGeometry args={[100, 0.2, 0.4]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
            <mesh position={[0, 0.1, 4.2]} receiveShadow castShadow><boxGeometry args={[100, 0.2, 0.4]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
            <mesh position={[-4.2, 0.1, 0]} receiveShadow castShadow><boxGeometry args={[0.4, 0.2, 100]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
            <mesh position={[4.2, 0.1, 0]} receiveShadow castShadow><boxGeometry args={[0.4, 0.2, 100]} /><meshStandardMaterial color="#ecf0f1" /></mesh>

            {/* Crosswalks */}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-n-${i}`} position={[-3 + i * 1.2, 0.06, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="#fff" /></mesh>
            ))}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-s-${i}`} position={[-3 + i * 1.2, 0.06, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="#fff" /></mesh>
            ))}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-e-${i}`} position={[5, 0.06, -3 + i * 1.2]} rotation={[-Math.PI / 2, 0, Math.PI/2]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="#fff" /></mesh>
            ))}
            {[...Array(6)].map((_, i) => (
              <mesh key={`cw-w-${i}`} position={[-5, 0.06, -3 + i * 1.2]} rotation={[-Math.PI / 2, 0, Math.PI/2]} receiveShadow><planeGeometry args={[0.6, 2]} /><meshStandardMaterial color="#fff" /></mesh>
            ))}

            {/* Streetlights */}
            {[[-10, -4.5], [-20, -4.5], [10, -4.5], [20, -4.5]].map((pos, i) => <StreetLight key={`sl1-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, Math.PI/2, 0]} />)}
            {[[-10, 4.5], [-20, 4.5], [10, 4.5], [20, 4.5]].map((pos, i) => <StreetLight key={`sl2-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, -Math.PI/2, 0]} />)}
            {[[-4.5, -10], [-4.5, -20], [-4.5, 10], [-4.5, 20]].map((pos, i) => <StreetLight key={`sl3-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, 0, 0]} />)}
            {[[4.5, -10], [4.5, -20], [4.5, 10], [4.5, 20]].map((pos, i) => <StreetLight key={`sl4-${i}`} position={[pos[0], 0, pos[1]]} rotation={[0, Math.PI, 0]} />)}
          </group>

          {/* MathVerse Central Hub */}
          <group position={[0, 0.1, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[7, 7, 0.2, 32]} />
              <meshStandardMaterial color="#fdfdfd" />
            </mesh>
            {/* Inner Ring (Grass) */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[5, 32]} />
              <meshStandardMaterial color="#b3e099" />
            </mesh>

            {/* Fountain */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[2.5, 2.5, 0.8, 16]} />
              <meshStandardMaterial color="#e0e0e0" flatShading />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[2.2, 2.2, 0.4, 16]} />
              <meshStandardMaterial color="#00f0ff" transparent opacity={0.6} />
            </mesh>
            {/* Holographic Globe */}
            <Float speed={2} rotationIntensity={3} position={[0, 3.5, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[1.2, 12, 12]} />
                <meshStandardMaterial color="#00f0ff" wireframe emissive="#00f0ff" emissiveIntensity={0.5} />
              </mesh>
            </Float>

            {/* Small trees around central hub */}
            <Tree position={[3, 0, 3]} scale={0.6} />
            <Tree position={[-3, 0, 3]} scale={0.6} />
            <Tree position={[3, 0, -3]} scale={0.6} />
            <Tree position={[-3, 0, -3]} scale={0.6} />
          </group>



          {/* Clouds */}
          <Cloud position={[-15, 12, -15]} speed={0.5} scale={1.5} />
          <Cloud position={[10, 15, -5]} speed={0.8} scale={1} />
          <Cloud position={[-5, 10, 15]} speed={0.3} scale={1.2} />

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
            type="cyber" position={[0, 0, -20]} size={[7, 9, 7]} color="#ef4444"
            title="Cyber Security Center" topics={['Logic', 'Encryption', 'Defense']} difficulty="Expert"
            onClick={setSelectedBuilding}
          />

          {/* Decorative Elements */}
          <Tree position={[-8, 0, -8]} scale={1.2} />
          <Tree position={[-6, 0, -10]} scale={0.8} />
          <Tree position={[8, 0, -8]} scale={1.5} />
          <Tree position={[10, 0, -6]} scale={1} />
          <Tree position={[-10, 0, 8]} scale={1.3} />
          <Tree position={[-8, 0, 10]} scale={0.9} />
          <Tree position={[10, 0, 8]} scale={1.1} />
          <Tree position={[8, 0, 10]} scale={1.4} />

          <Player />
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
