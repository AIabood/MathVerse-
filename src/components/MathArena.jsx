import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function CornerSpotlight({ position, color }) {
  const coneRef = useRef();
  useFrame((state) => {
    if (coneRef.current) {
      const t = state.clock.elapsedTime;
      coneRef.current.rotation.z = Math.sin(t * 0.8) * 0.4;
      coneRef.current.rotation.x = Math.cos(t * 0.6) * 0.3;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 8, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <group position={[0, 8, 0]} ref={coneRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.5, 12, 16, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.0} />
        </mesh>
        <spotLight position={[0, 0, 0]} angle={0.4} penumbra={0.5} intensity={4} color={color} castShadow />
      </group>
    </group>
  );
}

function MathBotCrowd() {
  const crowdRef = useRef();
  const mathBots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      const zW = -30 + (i / 15) * 60;
      const yW = 0.5 + (i % 3) * 0.6;
      arr.push({ pos: [-148 - (i % 3) * 0.5, yW, zW], side: 'west', id: `w-${i}` });

      const zE = -30 + (i / 15) * 60;
      const yE = 0.5 + (i % 3) * 0.6;
      arr.push({ pos: [-102 + (i % 3) * 0.5, yE, zE], side: 'east', id: `e-${i}` });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!crowdRef.current) return;
    const t = state.clock.elapsedTime;
    crowdRef.current.children.forEach((child, index) => {
      const offset = Math.sin(t * 5 + index) * 0.12;
      child.position.y = mathBots[index].pos[1] + Math.max(0, offset);
      const eyeMesh = child.children[1];
      if (eyeMesh && eyeMesh.material) {
        eyeMesh.material.emissiveIntensity = 1.5 + Math.sin(t * 8 + index) * 0.5;
      }
    });
  });

  return (
    <group ref={crowdRef}>
      {mathBots.map((bot) => (
        <group key={bot.id} position={bot.pos}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[bot.side === 'west' ? 0.26 : -0.26, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.15, 0.35]} />
            <meshStandardMaterial color={bot.id.startsWith('w') ? '#00f5ff' : '#d946ef'} emissive={bot.id.startsWith('w') ? '#00f5ff' : '#d946ef'} emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ArenaFlag({ position, rotation, color = '#00f5ff' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 2.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.75} metalness={0.4} />
      </mesh>
      <mesh position={[0.7, 4.35, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.6, 1.0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <group position={[0.95, 4.35, 0]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.45, 0.35]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function ArenaScoreboard({ ledText, scores, arenaTimer }) {
  const minutes = Math.floor(arenaTimer / 60);
  const seconds = String(arenaTimer % 60).padStart(2, '0');
  const timerText = `${minutes}:${seconds}`;

  return (
    <group>
      <mesh position={[0, 11, 0]} castShadow>
        <boxGeometry args={[14, 4.6, 0.6]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0, 11, 0.33]}>
        <planeGeometry args={[13.6, 3.8]} />
        <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.2} roughness={0.1} />
      </mesh>
      <Text position={[0, 12.1, 0.35]} rotation={[0, Math.PI, 0]} fontSize={0.45} color="#7c3aed" maxWidth={11} letterSpacing={0.06} anchorX="center" anchorY="middle">
        MATH ARENA
      </Text>
      <Text position={[0, 11.45, 0.35]} rotation={[0, Math.PI, 0]} fontSize={0.34} color="#38bdf8" maxWidth={11} letterSpacing={0.04} anchorX="center" anchorY="middle">
        {`BLUE ${scores.blue}  -  ${scores.red} RED`}
      </Text>
      <Text position={[0, 10.85, 0.35]} rotation={[0, Math.PI, 0]} fontSize={0.28} color="#ffffff" maxWidth={11} letterSpacing={0.05} anchorX="center" anchorY="middle">
        {`TIME ${timerText}`}
      </Text>
      <Text position={[0, 10.2, 0.35]} rotation={[0, Math.PI, 0]} fontSize={0.24} color="#fbbf24" maxWidth={11} letterSpacing={0.06} anchorX="center" anchorY="middle">
        {ledText}
      </Text>
      <pointLight position={[0, 11.5, 1.5]} color="#60a5fa" intensity={1.2} distance={20} />

      <group position={[-18, 8.5, -9]} rotation={[0, Math.PI / 7, 0]}>
        <mesh>
          <boxGeometry args={[7.5, 4.2, 0.3]} />
          <meshStandardMaterial color="#0f172a" emissive="#10b981" emissiveIntensity={0.75} roughness={0.15} />
        </mesh>
        <Text position={[0, 0.6, 0.18]} rotation={[0, Math.PI, 0]} fontSize={0.3} color="#10b981" anchorX="center" anchorY="middle">
          ARENA
        </Text>
        <Text position={[0, -0.2, 0.18]} rotation={[0, Math.PI, 0]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle">
          START
        </Text>
      </group>
      <group position={[18, 8.5, -9]} rotation={[0, -Math.PI / 7, 0]}>
        <mesh>
          <boxGeometry args={[7.5, 4.2, 0.3]} />
          <meshStandardMaterial color="#0f172a" emissive="#f472b6" emissiveIntensity={0.75} roughness={0.15} />
        </mesh>
        <Text position={[0, 0.6, 0.18]} rotation={[0, Math.PI, 0]} fontSize={0.3} color="#f472b6" anchorX="center" anchorY="middle">
          GOAL
        </Text>
        <Text position={[0, -0.2, 0.18]} rotation={[0, Math.PI, 0]} fontSize={0.22} color="#ffffff" anchorX="center" anchorY="middle">
          ZONE
        </Text>
      </group>
      <ArenaFlag position={[-25, 0, -18]} rotation={[0, 0, 0]} color="#60a5fa" />
      <ArenaFlag position={[25, 0, -18]} rotation={[0, 0, 0]} color="#d946ef" />
    </group>
  );
}

function EnergyMathSphere({ sphereRef, hitTriggerRef }) {
  const outerRef = useRef();
  const trailRef = useRef();
  const trailCount = 10;

  const trailHistory = useMemo(() => {
    const arr = [];
    for (let i = 0; i < trailCount; i++) {
      arr.push(new THREE.Vector3(-125, 2.5, 0));
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!sphereRef.current) return;
    const sphere = sphereRef.current;
    const pos = sphere.position;

    if (outerRef.current) {
      outerRef.current.rotation.y += 1.5 * delta;
      outerRef.current.rotation.z += 0.8 * delta;
      
      const hitPulse = hitTriggerRef.current > 0 ? hitTriggerRef.current : 0;
      if (hitTriggerRef.current > 0) {
        hitTriggerRef.current = Math.max(0, hitTriggerRef.current - delta * 4.0);
      }
      
      const coreMesh = outerRef.current.children[0];
      if (coreMesh) {
        const glow = 1.5 + Math.sin(state.clock.elapsedTime * 8) * 0.5 + hitPulse * 3.0;
        coreMesh.material.emissiveIntensity = glow;
      }

      const scaleVal = 1.0 + hitPulse * 0.25;
      sphere.scale.set(scaleVal, scaleVal, scaleVal);
    }

    const currentPos = pos.clone();
    trailHistory.unshift(currentPos);
    trailHistory.pop();

    if (trailRef.current) {
      trailRef.current.children.forEach((mesh, index) => {
        const histPos = trailHistory[index];
        mesh.position.copy(histPos);
        const tScale = 0.85 * (1 - index / trailCount);
        mesh.scale.set(tScale, tScale, tScale);
        mesh.material.opacity = 0.25 * (1 - index / trailCount);
      });
    }
  });

  return (
    <group>
      <group ref={sphereRef} position={[-125, 2.5, 0]}>
        <group ref={outerRef}>
          <mesh castShadow>
            <sphereGeometry args={[2.0, 16, 16]} />
            <meshStandardMaterial color="#00f5ff" emissive="#a855f7" emissiveIntensity={1.5} roughness={0.1} />
          </mesh>
          <mesh>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.35} metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      </group>
      <group ref={trailRef}>
        {Array.from({ length: trailCount }).map((_, i) => (
          <mesh key={i} position={[-125, 2.5, 0]}>
            <sphereGeometry args={[2.0, 8, 8]} />
            <meshBasicMaterial color="#00f5ff" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ArenaCelebrations({ lastGoalScorer, celebrationTrigger }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (!celebrationTrigger) return;
    const newParticles = [];
    const color = lastGoalScorer === 'blue' ? '#00f5ff' : '#d946ef';
    const startX = -125;
    const startY = 1.0;
    const startZ = lastGoalScorer === 'blue' ? 35 : -35;

    for (let i = 0; i < 80; i++) {
      const theta = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 12;
      const angleVal = Math.random() * Math.PI * 0.4;
      newParticles.push({
        id: i,
        pos: [startX + (Math.random() - 0.5) * 8, startY, startZ + (Math.random() - 0.5) * 2],
        vel: [
          Math.cos(theta) * Math.sin(angleVal) * speed,
          Math.cos(angleVal) * speed + 5,
          Math.sin(theta) * Math.sin(angleVal) * speed
        ],
        life: 1.5 + Math.random() * 1.0,
        color: Math.random() > 0.5 ? color : '#fbbf24',
        size: 0.15 + Math.random() * 0.25,
      });
    }
    setParticles(newParticles);
  }, [celebrationTrigger, lastGoalScorer]);

  useFrame((state, delta) => {
    if (particles.length === 0) return;
    setParticles((prev) =>
      prev
        .map((p) => {
          const nextLife = p.life - delta;
          if (nextLife <= 0) return null;
          const nextVelY = p.vel[1] - 9.8 * delta;
          return {
            ...p,
            pos: [
              p.pos[0] + p.vel[0] * delta,
              p.pos[1] + p.vel[1] * delta,
              p.pos[2] + p.vel[2] * delta,
            ],
            vel: [p.vel[0] * 0.98, nextVelY, p.vel[2] * 0.98],
            life: nextLife,
          };
        })
        .filter(Boolean)
    );
  });

  return (
    <group>
      {particles.map((p) => (
        <mesh key={p.id} position={p.pos}>
          <boxGeometry args={[p.size, p.size, p.size]} />
          <meshBasicMaterial color={p.color} transparent opacity={p.life > 0.5 ? 0.9 : p.life * 1.8} />
        </mesh>
      ))}
    </group>
  );
}

function MathArena({
  position,
  soccerBallRef,
  physicsItemsRef,
  arenaState,
  onGoalScored,
  vehiclePosRef,
  setIsNearArenaStart,
  hitTriggerRef,
  celebrationTrigger,
  lastGoalScorer,
  ledText,
  scores,
  arenaTimer,
  arenaBoundaryRef,
}) {
  const arenaGroupRef = useRef();
  const BASE_RADIUS = 36; // base playable radius in world units (visual: large neon arena)
  const energyRingRef = useRef();

  // Animate arena scale and update shared boundary ref so the world enforces limits
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    let scale = 1.0 + Math.sin(t * 0.65) * 0.12; // gentle expand/shrink
    // celebration pulse
    if (celebrationTrigger) {
      scale *= 1.0 + 0.08 * Math.abs(Math.sin(t * 8.0));
    }
    if (arenaGroupRef.current) {
      arenaGroupRef.current.scale.set(scale, 1, scale);
    }
    const radius = BASE_RADIUS * scale;
    if (arenaBoundaryRef && arenaBoundaryRef.current) {
      arenaBoundaryRef.current.radius = radius;
      if (!arenaBoundaryRef.current.center) arenaBoundaryRef.current.center = new THREE.Vector3(position[0], position[1], position[2]);
      else arenaBoundaryRef.current.center.set(position[0], position[1], position[2]);
    }
    // rotate energy ring
    if (energyRingRef.current) {
      energyRingRef.current.rotation.y = t * 0.6;
    }
  });
  useEffect(() => {
    if (soccerBallRef.current && physicsItemsRef.current) {
      physicsItemsRef.current[5] = {
        mesh: soccerBallRef.current,
        type: 'ball',
        radius: 2.2,
        position: soccerBallRef.current.position,
        velocity: soccerBallRef.current.userData.velocity || (soccerBallRef.current.userData.velocity = new THREE.Vector3(0, 0, 0)),
        rotation: soccerBallRef.current.rotation,
        initPos: [-125, 2.5, 0],
      };
    }
    return () => {
      if (physicsItemsRef.current) {
        physicsItemsRef.current[5] = null;
      }
    };
  }, [soccerBallRef, physicsItemsRef]);

  useFrame((state, delta) => {
    if (vehiclePosRef.current) {
      const dx = vehiclePosRef.current.x - position[0];
      const dz = vehiclePosRef.current.z - position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      setIsNearArenaStart(dist < 6.0);
    }

    if (!soccerBallRef.current) return;
    const pos = soccerBallRef.current.position;
    const vel = soccerBallRef.current.userData.velocity;
    if (!vel) return;

    if (arenaState === 'math-challenge' || arenaState === 'goal-celebration') {
      vel.set(0, 0, 0);
      return;
    }

    if (pos.x < -144) {
      pos.x = -144;
      vel.x = Math.abs(vel.x) * 0.8;
    } else if (pos.x > -106) {
      pos.x = -106;
      vel.x = -Math.abs(vel.x) * 0.8;
    }

    if (pos.z < -34.5) {
      if (pos.x > -132 && pos.x < -118) {
        const speedKmh = Math.round(Math.sqrt(vel.x * vel.x + vel.z * vel.z) * 8);
        onGoalScored('red', speedKmh);
      } else {
        pos.z = -34.5;
        vel.z = Math.abs(vel.z) * 0.8;
      }
    } else if (pos.z > 34.5) {
      if (pos.x > -132 && pos.x < -118) {
        const speedKmh = Math.round(Math.sqrt(vel.x * vel.x + vel.z * vel.z) * 8);
        onGoalScored('blue', speedKmh);
      } else {
        pos.z = 34.5;
        vel.z = -Math.abs(vel.z) * 0.8;
      }
    }
  });

  if (arenaState === 'idle') {
    return (
      <group ref={arenaGroupRef} position={position}>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.5, 12.5, 64]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.75} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <torusGeometry args={[5.5, 0.45, 16, 64]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 4.4, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.95} metalness={0.4} />
        </mesh>
        <group position={[0, 3.4, 0]}>
          <Text rotation={[0, Math.PI, 0]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
            MATH ARENA
          </Text>
          <Text position={[0, -0.45, 0]} rotation={[0, Math.PI, 0]} fontSize={0.22} color="#fbbf24" anchorX="center" anchorY="middle">
            Press E to Enter
          </Text>
        </group>
        <Float speed={1.8} floatIntensity={0.55} rotationIntensity={0.5}>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2.2} transparent opacity={0.9} />
          </mesh>
        </Float>
      </group>
    );
  }

  return (
    <group ref={arenaGroupRef} position={position}>
      {/* Main circular platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, 0.28, 128]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.9} />
      </mesh>

      {/* Neon concentric rings */}
      {[0.6, 1.6, 2.6].map((r, i) => (
        <mesh key={`neon-ring-${i}`} position={[0, 0.03 + i * 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BASE_RADIUS - r - 0.6, BASE_RADIUS - r, 256]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#00f5ff' : '#8b5cf6'} emissive={i % 2 === 0 ? '#00f5ff' : '#8b5cf6'} emissiveIntensity={2.2} transparent opacity={0.95} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Holographic cylindrical boundary */}
      <mesh position={[0, 2.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[BASE_RADIUS + 1.2, BASE_RADIUS + 1.2, 5.2, 128, 1, true]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating holographic scoreboard */}
      <group position={[0, 7.5, 0]}>
        <ArenaScoreboard ledText={ledText} scores={scores} arenaTimer={arenaTimer} />
      </group>

      {/* Corner spotlights */}
      {[[-BASE_RADIUS + 6, 0, -BASE_RADIUS + 6], [BASE_RADIUS - 6, 0, -BASE_RADIUS + 6], [-BASE_RADIUS + 6, 0, BASE_RADIUS - 6], [BASE_RADIUS - 6, 0, BASE_RADIUS - 6]].map((pos, idx) => (
        <CornerSpotlight key={`corner-spot-${idx}`} position={[pos[0], 0, pos[2]]} color={idx % 2 === 0 ? '#00f5ff' : '#8b5cf6'} />
      ))}

      {/* Energy particle ring (orbiting) */}
      <group ref={energyRingRef} position={[0, 2.5, 0]}>
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh key={`energy-${i}`} position={[Math.cos((i / 40) * Math.PI * 2) * (BASE_RADIUS - 2), 0.2 + Math.sin(i) * 0.06, Math.sin((i / 40) * Math.PI * 2) * (BASE_RADIUS - 2)]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#00f5ff' : '#8b5cf6'} emissive={i % 2 === 0 ? '#00f5ff' : '#8b5cf6'} emissiveIntensity={1.8} transparent opacity={0.95} />
          </mesh>
        ))}
      </group>

      {/* Energy Math Sphere (ball) */}
      <EnergyMathSphere sphereRef={soccerBallRef} hitTriggerRef={hitTriggerRef} />

      {/* Celebration particles */}
      <ArenaCelebrations lastGoalScorer={lastGoalScorer} celebrationTrigger={celebrationTrigger} />

      {/* Small decorative rail lines */}
      <group position={[0, 0.06, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BASE_RADIUS - 6, BASE_RADIUS - 5.6, 256]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[BASE_RADIUS - 12, BASE_RADIUS - 11.6, 256]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.16} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {[-18, 18].map((x) => (
        <group key={`side-screen-${x}`} position={[x, 4.5, 0]} rotation={[0, x < 0 ? 0.2 : -0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 4.5, 10]} />
            <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.18} />
          </mesh>
          <mesh position={[0.22, 0, 0]}>
            <planeGeometry args={[0.01, 3.8]} />
            <meshStandardMaterial color="#0f172a" emissive={x < 0 ? '#60a5fa' : '#ec4899'} emissiveIntensity={0.75} transparent opacity={0.95} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0, 35.2]}>
        <mesh position={[-7, 2, 0]} castShadow>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#00f5ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[7, 2, 0]} castShadow>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#00f5ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[14.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#00f5ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 2, 0.1]} rotation={[0, 0, 0]}>
          <planeGeometry args={[14, 4]} />
          <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1.5} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <group position={[0, 0, -35.2]}>
        <mesh position={[-7, 2, 0]} castShadow>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#d946ef" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[7, 2, 0]} castShadow>
          <boxGeometry args={[0.4, 4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#d946ef" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[14.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#d946ef" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 2, -0.1]} rotation={[0, 0, 0]}>
          <planeGeometry args={[14, 4]} />
          <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={1.5} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={[-20.1, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[70, 3]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.3} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[20.1, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[70, 3]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.3} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-13.5, 1.5, 35]}>
        <planeGeometry args={[13, 3]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.3} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[13.5, 1.5, 35]}>
        <planeGeometry args={[13, 3]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={0.3} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-13.5, 1.5, -35]}>
        <planeGeometry args={[13, 3]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.3} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[13.5, 1.5, -35]}>
        <planeGeometry args={[13, 3]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.3} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      <CornerSpotlight position={[-20, 0, -35]} color="#00f5ff" />
      <CornerSpotlight position={[20, 0, -35]} color="#d946ef" />
      <CornerSpotlight position={[-20, 0, 35]} color="#d946ef" />
      <CornerSpotlight position={[20, 0, 35]} color="#00f5ff" />

      <MathBotCrowd />

      <EnergyMathSphere sphereRef={soccerBallRef} hitTriggerRef={hitTriggerRef} />

      <ArenaCelebrations lastGoalScorer={lastGoalScorer} celebrationTrigger={celebrationTrigger} />

      <ArenaScoreboard ledText={ledText} scores={scores} arenaTimer={arenaTimer} />

      {[-12, 12].map((x, idx) => (
        <Float key={`orb-${idx}`} speed={1.8} floatIntensity={0.6} rotationIntensity={0.5}>
          <mesh position={[x, 3.2, 0]}>
            <sphereGeometry args={[1.1, 14, 14]} />
            <meshStandardMaterial color={idx === 0 ? '#00f5ff' : '#d946ef'} emissive={idx === 0 ? '#00f5ff' : '#d946ef'} emissiveIntensity={2.5} transparent opacity={0.7} metalness={0.9} roughness={0.08} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default MathArena;
