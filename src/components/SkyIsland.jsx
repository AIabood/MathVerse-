import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
    </group>
  );
}

// ─── Solid Obstacle Component ────────────────────────────────────────
function StaticObstacle({ obstacle }) {
  const heightY = 0.2; // default grass height
  return (
    <group position={[obstacle.x, heightY, obstacle.z]}>
      {obstacle.type === 'crate' ? (
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 1.1]} />
          <meshStandardMaterial color={obstacle.color} roughness={0.9} flatShading />
        </mesh>
      ) : (
        <mesh position={[0, 0.7, 0]} scale={1.2} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color={obstacle.color} roughness={0.8} flatShading />
        </mesh>
      )}
    </group>
  );
}

// ─── Refactored Sandbox Mode: Target/Crystal components removed ───

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
  trickTextRef,
  skyRingsRef,
  timeLeftTextRef,
  onNearPhotoSpot,
  photoModeActive,
  cameraAngle,
  onNearGarageSpot,
  garageModeActive,
  carColor,
  physicsItemsRef
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
      
      const targetPos = new THREE.Vector3();
      const targetLook = new THREE.Vector3();
      // Front diagonal customization view
      const offset = new THREE.Vector3(4.5, 1.8, 6.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
      targetPos.copy(vehiclePos.current).add(offset);
      targetLook.copy(vehiclePos.current).add(new THREE.Vector3(0, 0.6, 0));
      
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
      
      const targetPos = new THREE.Vector3();
      const targetLook = new THREE.Vector3();
      
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
    const distFromCenter = Math.sqrt(nextPos.x * nextPos.x + nextPos.z * nextPos.z);
    const isOffIsland = distFromCenter > 60.0;

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
        
        let targetYObj = 0.2;
        if (distFromCenterObj > 60.0) {
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
        }

        // 3. Fall off island boundary and respawn
        const distFromCenter = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        if (distFromCenter > 60.0) {
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
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
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

    const camOffset = new THREE.Vector3(0, 4.8, -12);
    camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotY.current);
    const targetCamPos = vehiclePos.current.clone().add(camOffset);
    state.camera.position.copy(targetCamPos);
    state.camera.lookAt(vehiclePos.current.clone().add(new THREE.Vector3(0, 1.2, 0)));
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

// ─── Main Scene Component ───────────────────────────────────────────
export default function SkyIsland({ onBack, avatarColor, avatarGender }) {
  const [isNearPhotoSpot, setIsNearPhotoSpot] = useState(false);
  const [photoModeActive, setPhotoModeActive] = useState(false);
  const [cameraAngle, setCameraAngle] = useState(0); // 0: Diagonal, 1: Low-Angle, 2: Wide
  const [shutterFlash, setShutterFlash] = useState(false);
  
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
  ], []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <KeyboardControls map={keyMap}>
        <Canvas shadows onCreated={({ gl }) => { canvasRef.current = gl.domElement; }}>
          <PerspectiveCamera makeDefault position={[0, 6, -14]} fov={56} />
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
          />
        </Canvas>
      </KeyboardControls>

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
          
          {/* Rule of Thirds Grid Lines */}
          <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.18)' }}></div>
          <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.18)' }}></div>
          <div style={{ position: 'absolute', left: '33.33%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.18)' }}></div>
          <div style={{ position: 'absolute', left: '66.66%', top: 0, width: '1px', height: '100%', background: 'rgba(255,255,255,0.18)' }}></div>
          
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
      `}</style>
    </div>
  );
}
