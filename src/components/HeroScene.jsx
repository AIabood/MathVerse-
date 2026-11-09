import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Float, Stars, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';

function FuturisticCity() {
  const group = useRef();
  
  useFrame((state) => {
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group}>
      {/* City Base */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[15, 15, 0.5, 64]} />
        <meshStandardMaterial color="#050510" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Grid Lines */}
      <gridHelper args={[30, 30, '#00f0ff', '#7000ff']} position={[0, -1.74, 0]} />

      {/* Buildings Placeholder */}
      {[...Array(20)].map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const height = Math.random() * 5 + 2;
        return (
          <mesh key={i} position={[x, height / 2 - 1.74, z]}>
            <boxGeometry args={[1, height, 1]} />
            <meshStandardMaterial color="#0a0a2a" emissive="#00f0ff" emissiveIntensity={Math.random() * 0.5} wireframe={Math.random() > 0.8} />
          </mesh>
        );
      })}

      {/* Floating Holograms */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[0, 4, 0]}>
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene({ onStart }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    >
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 10, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <directionalLight position={[-10, 10, -10]} intensity={1} color="#7000ff" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={20} size={2} speed={0.4} color="#00f0ff" />
        <FuturisticCity />
        <Environment preset="city" />
      </Canvas>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ textAlign: 'center' }}
        >
          <h1 style={{ 
            fontSize: '5rem', 
            margin: 0,
            background: 'linear-gradient(to right, #00f0ff, #7000ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0, 240, 255, 0.5)'
          }}>MathVerse</h1>
          <p style={{ fontSize: '1.5rem', color: '#a0a0b0', letterSpacing: '4px', marginBottom: '2rem' }}>FUTURE TECH CITY</p>
          
          <button 
            className="glowing-button"
            style={{ pointerEvents: 'auto', padding: '15px 40px', fontSize: '1.2rem' }}
            onClick={onStart}
          >
            Start Journey
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
