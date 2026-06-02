import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';

export function AvatarPreview({ color, gender = 'boy', accessories = [] }) {
  return (
    <group position={[0, -1, 0]}>
      {/* Simple Avatar Representation */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Body */}
        {gender === 'girl' ? (
          <mesh position={[0, 1.2, 0]} castShadow>
            <coneGeometry args={[0.6, 1.5, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
          </mesh>
        ) : (
          <mesh position={[0, 1.5, 0]} castShadow>
            <capsuleGeometry args={[0.5, 1, 4, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
          </mesh>
        )}

        {/* Head */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        
        {/* Visor or Hair */}
        {gender === 'girl' ? (
          // Ponytail
          <mesh position={[0, 2.4, -0.4]} rotation={[-Math.PI / 4, 0, 0]} castShadow>
            <coneGeometry args={[0.2, 0.6, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ) : (
          // Visor
          <mesh position={[0, 2.5, 0.35]}>
            <boxGeometry args={[0.5, 0.15, 0.2]} />
            <meshStandardMaterial color="#111" emissive="#00f0ff" emissiveIntensity={0.5} />
          </mesh>
        )}

        {/* Accessories */}
        {accessories.includes('VR Headset') && (
          <mesh position={[0, 2.5, 0.45]} castShadow>
            <boxGeometry args={[0.6, 0.25, 0.3]} />
            <meshStandardMaterial color="#000" emissive="#00f0ff" emissiveIntensity={0.8} />
          </mesh>
        )}
        {accessories.includes('Jetpack') && (
          <group position={[0, 1.5, -0.4]}>
            <mesh position={[-0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.6]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.6]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            {/* Flames */}
            <mesh position={[-0.2, -0.4, 0]}>
              <coneGeometry args={[0.08, 0.3]} />
              <meshStandardMaterial color="#ff5500" emissive="#ff0000" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.2, -0.4, 0]}>
              <coneGeometry args={[0.08, 0.3]} />
              <meshStandardMaterial color="#ff5500" emissive="#ff0000" emissiveIntensity={2} />
            </mesh>
          </group>
        )}
        {accessories.includes('Cyber Wings') && (
          <group position={[0, 1.6, -0.3]}>
            <mesh position={[-0.5, 0, 0]} rotation={[0, 0, -Math.PI/6]}>
              <planeGeometry args={[0.8, 0.2]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} side={2} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI/6]}>
              <planeGeometry args={[0.8, 0.2]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} side={2} transparent opacity={0.6} />
            </mesh>
          </group>
        )}

        {/* Holographic Ring */}
        <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.02, 16, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
      </Float>
      <ContactShadows position={[0, 0, 0]} scale={5} blur={2} far={3} />
    </group>
  );
}

export default function AvatarBuilder({ onSave }) {
  const [activeColor, setActiveColor] = useState('#7000ff');
  const [activeGender, setActiveGender] = useState('boy');
  const [activeAccessories, setActiveAccessories] = useState([]);

  const toggleAccessory = (acc) => {
    setActiveAccessories(prev => prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]);
  };

  const colors = ['#7000ff', '#00f0ff', '#ff0055', '#00ff66', '#ffaa00'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', background: 'rgba(5, 5, 16, 0.8)', backdropFilter: 'blur(10px)', zIndex: 10
      }}
    >
      {/* Left side: 3D Preview */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#00f0ff" />
          <AvatarPreview color={activeColor} gender={activeGender} accessories={activeAccessories} />
          <Environment preset="city" />
          <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={10} />
        </Canvas>

        <div style={{ position: 'absolute', bottom: '2rem', width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
          <h3 style={{ color: '#00f0ff', letterSpacing: '2px' }}>LIVE PREVIEW</h3>
          <p style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>Drag to rotate • Scroll to zoom</p>
        </div>
      </div>

      {/* Right side: Customization UI */}
      <div style={{ width: '400px', padding: '2rem', borderLeft: '1px solid rgba(0,240,255,0.2)', background: 'rgba(5, 5, 16, 0.8)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Avatar Builder</h2>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#a0a0b0' }}>Gender Type</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="futuristic-input" 
                onClick={() => setActiveGender('boy')}
                style={{ flex: 1, textAlign: 'center', cursor: 'pointer', background: activeGender === 'boy' ? 'rgba(0, 240, 255, 0.2)' : 'transparent', borderColor: activeGender === 'boy' ? '#00f0ff' : 'rgba(255,255,255,0.2)' }}
              >
                Boy
              </button>
              <button 
                className="futuristic-input" 
                onClick={() => setActiveGender('girl')}
                style={{ flex: 1, textAlign: 'center', cursor: 'pointer', background: activeGender === 'girl' ? 'rgba(0, 240, 255, 0.2)' : 'transparent', borderColor: activeGender === 'girl' ? '#00f0ff' : 'rgba(255,255,255,0.2)' }}
              >
                Girl
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#a0a0b0' }}>Suit Color</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {colors.map(color => (
                <div
                  key={color}
                  onClick={() => setActiveColor(color)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: color, cursor: 'pointer',
                    border: activeColor === color ? '3px solid white' : 'none',
                    boxShadow: activeColor === color ? `0 0 15px ${color}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#a0a0b0' }}>Accessories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['VR Headset', 'Jetpack', 'Cyber Wings'].map(acc => (
                <div 
                  key={acc} 
                  className="futuristic-input" 
                  style={{ 
                    cursor: 'pointer', 
                    background: activeAccessories.includes(acc) ? 'rgba(0, 240, 255, 0.1)' : 'transparent', 
                    borderColor: activeAccessories.includes(acc) ? '#00f0ff' : 'rgba(255,255,255,0.2)',
                    color: activeAccessories.includes(acc) ? '#00f0ff' : '#fff'
                  }}
                  onClick={() => toggleAccessory(acc)}
                >
                  {acc}
                </div>
              ))}
            </div>
          </div>

        </div>

        <button className="glowing-button" style={{ width: '100%', marginTop: '1rem' }} onClick={() => onSave({ avatarColor: activeColor, avatarGender: activeGender, accessories: activeAccessories })}>
          Save Character
        </button>
      </div>
    </motion.div>
  );
}
