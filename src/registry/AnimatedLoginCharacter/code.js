export const animatedLoginFormCode = `import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- 1. 3D CHARACTER COMPONENT ---
function AnimatedBoy() {
  const boyGroup = useRef();
  const formGroup = useRef();
  
  const [uiState, setUiState] = useState('hidden');
  const phase = useRef('start'); 
  
  const { scene, animations } = useGLTF('/models/animated_boy.glb');
  const { actions } = useAnimations(animations, boyGroup);

  useEffect(() => {
    const runSequence = async () => {
      phase.current = 'walk_in';
      setUiState('hidden');
      actions['mixamo.com']?.reset().fadeIn(0.5).play();
      await wait(2000);

      phase.current = 'wave';
      setUiState('waving_text'); 
      actions['mixamo.com']?.fadeOut(0.5);
      actions['NlaTrack.002']?.reset().fadeIn(0.5).play();
      await wait(3000); 

      phase.current = 'walk_to_edge';
      setUiState('hidden');
      actions['NlaTrack.002']?.fadeOut(0.5);
      actions['mixamo.com']?.reset().fadeIn(0.5).play();
      await wait(2400); 

      phase.current = 'pulling';
      setUiState('pulling'); 
      actions['mixamo.com']?.fadeOut(0.5); 
      actions['NlaTrack.001']?.reset().fadeIn(0.5).play();
      await wait(3000); 

      phase.current = 'idle';
      setUiState('idle'); 
      actions['NlaTrack.001']?.fadeOut(0.5);
      actions['NlaTrack']?.reset().fadeIn(0.5).play();
    };

    if (actions && Object.keys(actions).length > 0) {
      runSequence();
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!boyGroup.current || !formGroup.current) return;

    if (phase.current === 'walk_in') {
      boyGroup.current.position.x += 2.2 * delta; 
      boyGroup.current.rotation.y = THREE.MathUtils.lerp(boyGroup.current.rotation.y, Math.PI / 2, 8 * delta); 
    } 
    else if (phase.current === 'wave') {
      boyGroup.current.rotation.y = THREE.MathUtils.lerp(boyGroup.current.rotation.y, 0.3, 5 * delta);
    } 
    else if (phase.current === 'walk_to_edge') {
      boyGroup.current.position.x += 3.0 * delta;
      boyGroup.current.rotation.y = THREE.MathUtils.lerp(boyGroup.current.rotation.y, Math.PI / 2, 8 * delta);
    } 
    else if (phase.current === 'pulling') {
      boyGroup.current.position.x -= 1.85 * delta; 
      boyGroup.current.rotation.y = THREE.MathUtils.lerp(boyGroup.current.rotation.y, Math.PI / 2.5, 5 * delta); 
      formGroup.current.position.x = boyGroup.current.position.x + 1.6; 
    } 
    else if (phase.current === 'idle') {
      boyGroup.current.rotation.y = THREE.MathUtils.lerp(boyGroup.current.rotation.y, 0.2, 5 * delta);
      formGroup.current.position.x = boyGroup.current.position.x + 1.6;
    }
  });

  return (
    <>
      <primitive ref={boyGroup} object={scene} position={[-6.5, -1.8, 0]} scale={1.1}>
        <Html position={[0, 2.4, 0]} center zIndexRange={[100, 0]}>
          <div style={{
            ...bubbleStyle,
            opacity: uiState === 'waving_text' ? 1 : 0,
            transform: uiState === 'waving_text' ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
          }}>
            Wait a second! Let me grab the login form for you! ✌️
          </div>
          <div style={{
            ...bubbleStyle,
            opacity: uiState === 'idle' ? 1 : 0,
            transform: uiState === 'idle' ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
          }}>
            Here is your form! ✨
          </div>
        </Html>
      </primitive>

      <group ref={formGroup} position={[20, -0.2, 0]}>
        <Html center zIndexRange={[90, 0]}>
          <div style={{
            background: 'rgba(17, 24, 39, 0.65)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '40px 32px', 
            borderRadius: '24px', 
            width: '340px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            pointerEvents: 'auto',
            fontFamily: "'Inter', sans-serif"
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ 
                margin: '0', 
                fontSize: '28px', 
                fontWeight: '700', 
                background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                Welcome Back
              </h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
                Sign in to continue your journey
              </p>
            </div>
            
            <label style={labelStyle}>Email Address</label>
            <input type="email" placeholder="developer@codexr.com" style={inputStyle} />
            
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
            
            <button style={buttonStyle}>Sign In</button>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a href="#" style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>
            </div>
          </div>
        </Html>
      </group>
    </>
  );
}

export default function AnimatedLoginCharacter() {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: '#050505', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />
        <AnimatedBoy />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

const bubbleStyle = {
  position: 'absolute',
  background: 'white',
  color: '#000',
  padding: '12px 20px',
  borderRadius: '20px',
  fontSize: '15px',
  fontWeight: '600',
  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
  transition: 'all 0.3s ease-out',
  whiteSpace: 'nowrap',
  pointerEvents: 'none'
};

const labelStyle = { display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px', fontWeight: '500', letterSpacing: '0.3px' };
const inputStyle = { width: '100%', padding: '14px 16px', marginBottom: '22px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.25)', color: 'white', boxSizing: 'border-box', outline: 'none', fontSize: '14px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' };
const buttonStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer', marginTop: '8px', boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)', transition: 'transform 0.2s ease, filter 0.2s ease' };

useGLTF.preload('/models/animated_boy.glb');
`;