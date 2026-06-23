import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ViewState } from '../types';

interface CameraRigProps {
  activeView: ViewState;
  onTransitionChange?: (isTransitioning: boolean) => void;
  entranceStage?: 'black_world' | 'door_opening' | 'teleporting' | 'entered';
}

const views: Record<ViewState, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  desk: { pos: [0, 1.75, 4.15], lookAt: [0, 1.12, 0] },
  monitor: { pos: [0, 1.70, 1.50], lookAt: [0, 1.70, -0.5] },
  usb: { pos: [-1.35, 1.70, 1.45], lookAt: [-1.7, 0.82, 0.45] },
  folder: { pos: [1.35, 1.70, 1.45], lookAt: [1.7, 0.82, 0.45] },
  phone: { pos: [-0.58, 1.68, 1.55], lookAt: [-0.75, 0.82, 0.72] },
  chair: { pos: [0, 1.22, 1.22], lookAt: [0, 1.20, -0.2] },
  sofa: { pos: [3.2, 0.95, 2.3], lookAt: [0, 1.10, 1.8] }
};

export const CameraRig: React.FC<CameraRigProps> = ({ 
  activeView, 
  onTransitionChange,
  entranceStage
}) => {
  const { camera, gl } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 1.12, 0));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevViewRef = useRef<ViewState>(activeView);

  // Reposition player when starting in the black world
  useEffect(() => {
    if (entranceStage && entranceStage !== 'entered') {
      camera.position.set(0, 1.75, 38.0);
      baseTheta.current = Math.PI; // Face the door (negative Z direction)
      basePhi.current = 0;
      rotation.current.theta = Math.PI;
      rotation.current.phi = 0;
    }
  }, [entranceStage, camera]);

  // Custom first-person rotation coordinates
  // baseTheta tracks the player's facing direction (turned by mouse movement or Q/E)
  const baseTheta = useRef(Math.PI);
  const basePhi = useRef(-0.15);
  const rotation = useRef({ theta: Math.PI, phi: -0.15 });

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const mouseWindowPos = useRef({ x: 0, y: 0 });
  const smoothPan = useRef({ x: 0, y: 0 });

  // Track global mouse position for parallax view in monitor focus
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      mouseWindowPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseWindowPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  // Dispatch custom pointer lock events
  useEffect(() => {
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === gl.domElement;
      window.dispatchEvent(new CustomEvent('pointerlockchange-custom', { detail: isLocked }));
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl]);

  // Click canvas: if not locked → request lock; if locked → fire interact event for objects
  useEffect(() => {
    const handleCanvasClick = () => {
      if (activeView !== 'desk' || isTransitioning) return;

      if (!document.pointerLockElement) {
        // First click: just lock the mouse, don't interact
        gl.domElement.requestPointerLock?.();
      } else {
        // Already locked: dispatch interact event for InteractiveObjects to catch
        window.dispatchEvent(new Event('locked-interact'));
      }
    };

    gl.domElement.addEventListener('click', handleCanvasClick);
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [activeView, isTransitioning, gl]);

  // Handle exiting pointer lock on view transition
  useEffect(() => {
    if (activeView !== 'desk') {
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock?.();
      }
    }
  }, [activeView, gl]);

  // Disable canvas pointer events when zoomed into a focused view so that
  // HTML overlays (virtual screen, USB, folder, phone) can receive clicks
  useEffect(() => {
    gl.domElement.style.pointerEvents = activeView === 'desk' ? 'auto' : 'none';
    return () => {
      gl.domElement.style.pointerEvents = 'auto';
    };
  }, [activeView, gl]);

  // Mouse movement look handler for pointer lock
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === gl.domElement && activeView === 'desk' && !isTransitioning) {
        const sensitivity = 0.0022;
        baseTheta.current -= e.movementX * sensitivity;
        basePhi.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, basePhi.current - e.movementY * sensitivity));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeView, isTransitioning, gl]);

  // Detect view changes and start transition
  useEffect(() => {
    if (activeView !== prevViewRef.current) {
      setIsTransitioning(true);
      if (onTransitionChange) onTransitionChange(true);
      prevViewRef.current = activeView;

      // Reset rotation states to face forward when returning to main desk view
      if (activeView === 'desk') {
        baseTheta.current = Math.PI;
        basePhi.current = -0.15;
        rotation.current = { theta: Math.PI, phi: -0.15 };
      }
    }
  }, [activeView, onTransitionChange]);

  // Set initial position on mount
  useEffect(() => {
    const config = views[activeView];
    camera.position.set(...config.pos);
    currentLookAt.current.set(...config.lookAt);
    camera.lookAt(currentLookAt.current);
  }, []);

  // Listen to keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Helper to check collision with solid obstacles in the room
  const checkCollision = (x: number, z: number): boolean => {
    // 1. Hacking Desk in the center
    if (x >= -1.7 && x <= 1.7 && z >= -1.1 && z <= 1.0) {
      return true;
    }
    // 2. Server Racks on the left
    if (x >= -3.3 && x <= -2.4 && z >= -1.0 && z <= 1.7) {
      return true;
    }
    // 3. Mini Fridge in the left-front corner
    if (x >= -4.5 && x <= -3.2 && z >= 2.9 && z <= 4.5) {
      return true;
    }
    // 4. Grey Sofa on the right wall
    if (x >= 2.6 && x <= 4.8 && z >= 0.8 && z <= 3.7) {
      return true;
    }
    // 5. Gaming Chair near the desk
    if (x >= -0.6 && x <= 0.6 && z >= 0.6 && z <= 1.7) {
      return true;
    }
    return false;
  };

  useFrame((state) => {
    // Entrance Stage Camera Override
    if (entranceStage && entranceStage !== 'entered') {
      const dirX = Math.sin(rotation.current.theta) * Math.cos(rotation.current.phi);
      const dirY = Math.sin(rotation.current.phi);
      const dirZ = Math.cos(rotation.current.theta) * Math.cos(rotation.current.phi);
      const direction = new THREE.Vector3(dirX, dirY, dirZ).normalize();

      // Keyboard rotation Q / E
      const rotateSpeed = 0.025;
      if (keysPressed.current['q']) {
        baseTheta.current += rotateSpeed;
      }
      if (keysPressed.current['e']) {
        baseTheta.current -= rotateSpeed;
      }

      // Parallax mouse rotation when pointer lock is not active
      const isLocked = document.pointerLockElement === gl.domElement;
      const parallaxTheta = baseTheta.current - (isLocked ? 0 : state.pointer.x * 0.22);
      const parallaxPhi = basePhi.current + (isLocked ? 0 : state.pointer.y * 0.15);

      rotation.current.theta = THREE.MathUtils.lerp(rotation.current.theta, parallaxTheta, 0.08);
      rotation.current.phi = THREE.MathUtils.lerp(rotation.current.phi, parallaxPhi, 0.08);

      if (entranceStage === 'black_world') {
        // Player can walk with WASD
        const speed = 0.045;
        const moveVec = new THREE.Vector3();
        const forward = new THREE.Vector3(direction.x, 0, direction.z).normalize();
        const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

        if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
          moveVec.addScaledVector(forward, speed);
        }
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
          moveVec.addScaledVector(forward, -speed);
        }
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
          moveVec.addScaledVector(right, speed);
        }
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
          moveVec.addScaledVector(right, -speed);
        }

        camera.position.add(moveVec);

        // Clamp camera position inside entrance corridor
        camera.position.x = Math.max(-0.6, Math.min(0.6, camera.position.x));
        camera.position.y = 1.75;
        camera.position.z = Math.max(20.8, Math.min(39.0, camera.position.z));
      } 
      else if (entranceStage === 'teleporting') {
        // Automatic slide forward through the doorway + warp FOV
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = THREE.MathUtils.lerp(camera.fov, 125, 0.06);
          camera.updateProjectionMatrix();
        }
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 18.0, 0.04);
      }

      const lookTarget = new THREE.Vector3().copy(camera.position).add(direction);
      camera.lookAt(lookTarget);
      currentLookAt.current.copy(lookTarget);
      return;
    }

    // Smoothly restore FOV in normal mode
    if (entranceStage === 'entered' && camera instanceof THREE.PerspectiveCamera && camera.fov !== 60) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.1);
      camera.updateProjectionMatrix();
    }

    const time = state.clock.getElapsedTime();
    const config = views[activeView];

    // Target vectors for transition lerping
    const targetPos = new THREE.Vector3(...config.pos);
    const targetLookAt = new THREE.Vector3(...config.lookAt);

    // Dynamic aspect-ratio responsive zoom for focused assets
    const aspect = state.size.width / state.size.height;
    if (aspect < 1.4) {
      const zoomFactor = 1.4 / aspect;
      if (activeView === 'monitor') {
        targetPos.z = 1.50 * zoomFactor;
      } else if (activeView === 'usb') {
        targetPos.z = 1.45 * zoomFactor;
        targetPos.x = -1.35 * zoomFactor;
      } else if (activeView === 'folder') {
        targetPos.z = 1.45 * zoomFactor;
        targetPos.x = 1.35 * zoomFactor;
      } else if (activeView === 'phone') {
        targetPos.z = 1.55 * zoomFactor;
        targetPos.x = -0.58 * zoomFactor;
      } else if (activeView === 'chair') {
        targetPos.z = 1.22 * zoomFactor;
      } else if (activeView === 'sofa') {
        targetPos.x = 3.2 * zoomFactor;
        targetPos.z = 2.3 * zoomFactor;
      }
    }

    if (isTransitioning) {
      // Lerp camera position
      camera.position.lerp(targetPos, 0.075);
      // Lerp look-at target
      currentLookAt.current.lerp(targetLookAt, 0.075);
      camera.lookAt(currentLookAt.current);

      // Check if camera has reached close enough to stop transition
      const posDist = camera.position.distanceTo(targetPos);
      const lookDist = currentLookAt.current.distanceTo(targetLookAt);

      if (posDist < 0.04 && lookDist < 0.04) {
        setIsTransitioning(false);
        if (onTransitionChange) onTransitionChange(false);
      }
    } else if (activeView === 'desk') {
      // KEYBOARD ROTATION CONTROLS (Q / E keys to rotate player body)
      const rotateSpeed = 0.025;
      if (keysPressed.current['q']) {
        baseTheta.current += rotateSpeed;
      }
      if (keysPressed.current['e']) {
        baseTheta.current -= rotateSpeed;
      }

      // SUBTLE PARALLAX MOUSE EFFECT (Subtle camera drift to match cursor when pointer lock is not active)
      const isLocked = document.pointerLockElement === gl.domElement;
      const parallaxTheta = baseTheta.current - (isLocked ? 0 : state.pointer.x * 0.22);
      const parallaxPhi = basePhi.current + (isLocked ? 0 : state.pointer.y * 0.15);

      // Smoothly lerp camera orientation
      rotation.current.theta = THREE.MathUtils.lerp(rotation.current.theta, parallaxTheta, 0.08);
      rotation.current.phi = THREE.MathUtils.lerp(rotation.current.phi, parallaxPhi, 0.08);

      // FPS WALK CONTROLS
      const speed = 0.045;
      const moveVec = new THREE.Vector3();

      // Calculate camera horizontal forward and right directions
      const dirX = Math.sin(rotation.current.theta) * Math.cos(rotation.current.phi);
      const dirY = Math.sin(rotation.current.phi);
      const dirZ = Math.cos(rotation.current.theta) * Math.cos(rotation.current.phi);

      const direction = new THREE.Vector3(dirX, dirY, dirZ).normalize();

      // Horizontal projection for forward/backward walk
      const forward = new THREE.Vector3(direction.x, 0, direction.z).normalize();
      const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        moveVec.addScaledVector(forward, speed);
      }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        moveVec.addScaledVector(forward, -speed);
      }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        moveVec.addScaledVector(right, speed);
      }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        moveVec.addScaledVector(right, -speed);
      }

      if (moveVec.lengthSq() > 0) {
        // Test X movement separately to allow sliding along walls
        const nextX = camera.position.x + moveVec.x;
        if (!checkCollision(nextX, camera.position.z)) {
          camera.position.x = nextX;
        }

        // Test Z movement separately
        const nextZ = camera.position.z + moveVec.z;
        if (!checkCollision(camera.position.x, nextZ)) {
          camera.position.z = nextZ;
        }
      }

      // Clamp camera position to keep it strictly inside the room walls/floor/ceiling
      camera.position.x = Math.max(-4.4, Math.min(4.4, camera.position.x));
      camera.position.y = Math.max(0.6, Math.min(3.6, camera.position.y));
      camera.position.z = Math.max(-0.8, Math.min(4.4, camera.position.z));

      // Calculate final target coordinates to look at
      const lookTarget = new THREE.Vector3().copy(camera.position).add(direction);
      camera.lookAt(lookTarget);

      // Update lookAt ref to match current looking state
      currentLookAt.current.copy(lookTarget);
    } else {
      // Lock precisely to target position if in a zoomed-in focus view
      if (activeView === 'monitor') {
        // Smoothly lerp mouse pan offsets relative to window
        smoothPan.current.x = THREE.MathUtils.lerp(smoothPan.current.x, mouseWindowPos.current.x * 0.12, 0.08);
        smoothPan.current.y = THREE.MathUtils.lerp(smoothPan.current.y, mouseWindowPos.current.y, 0.08);

        // Clamp camera movement strictly inside the computer/monitor area
        const panX = smoothPan.current.x;
        const panY = Math.max(-0.08, Math.min(0.08, smoothPan.current.y * 0.08));

        // Offset position
        camera.position.x = targetPos.x + panX;
        camera.position.y = targetPos.y + panY;
        camera.position.z = targetPos.z;

        // Apply subtle parallax offset to lookAt target
        const dynamicLookAt = new THREE.Vector3().copy(targetLookAt);
        dynamicLookAt.x += panX * 0.35;
        dynamicLookAt.y += panY * 0.35;

        // Add tiny screen hum
        const jitter = Math.sin(time * 15) * 0.0008;
        camera.position.y += jitter;

        camera.lookAt(dynamicLookAt);
      } else {
        camera.position.copy(targetPos);
        camera.lookAt(targetLookAt);
      }
    }
  });

  return null;
};

export default CameraRig;
