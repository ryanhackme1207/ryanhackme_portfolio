import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ViewState } from '../types';

interface CameraRigProps {
  activeView: ViewState;
  onTransitionChange?: (isTransitioning: boolean) => void;
}

const views: Record<ViewState, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  desk: { pos: [0, 1.75, 4.15], lookAt: [0, 1.12, 0] },
  monitor: { pos: [0, 1.70, 1.50], lookAt: [0, 1.70, -0.5] },
  usb: { pos: [-1.35, 1.70, 1.45], lookAt: [-1.7, 0.82, 0.45] },
  folder: { pos: [1.35, 1.70, 1.45], lookAt: [1.7, 0.82, 0.45] },
  phone: { pos: [-0.58, 1.68, 1.55], lookAt: [-0.75, 0.82, 0.72] }
};

export const CameraRig: React.FC<CameraRigProps> = ({ activeView, onTransitionChange }) => {
  const { camera, gl } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 1.12, 0));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevViewRef = useRef<ViewState>(activeView);

  // Custom first-person rotation coordinates
  // baseTheta tracks the player's facing direction (turned by mouse movement or Q/E)
  const baseTheta = useRef(Math.PI);
  const basePhi = useRef(-0.15);
  const rotation = useRef({ theta: Math.PI, phi: -0.15 });

  const keysPressed = useRef<{ [key: string]: boolean }>({});

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

  useFrame((state) => {
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
        camera.position.add(moveVec);
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
      camera.position.copy(targetPos);
      if (activeView === 'monitor') {
        // Add tiny screen hum
        const jitter = Math.sin(time * 15) * 0.0008;
        camera.position.y += jitter;
      }
      camera.lookAt(targetLookAt);
    }
  });

  return null;
};

export default CameraRig;
