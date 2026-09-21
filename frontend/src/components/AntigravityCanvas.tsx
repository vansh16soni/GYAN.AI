import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

interface Props {
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export default function AntigravityCanvas({
  interactive = true,
  opacity = 0.85,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central 3D Antigravity Floating Core
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner glowing geometric crystal
    const icoGeometry = new THREE.IcosahedronGeometry(4.8, 1);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: isDark ? 0x4f46e5 : 0x6366f1,
      emissive: isDark ? 0x312e81 : 0xa5b4fc,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    coreGroup.add(icoMesh);

    // Inner solid core
    const innerSolidGeo = new THREE.OctahedronGeometry(2.6, 0);
    const innerSolidMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      emissive: isDark ? 0x0891b2 : 0x38bdf8,
      emissiveIntensity: isDark ? 0.4 : 0.6,
      transparent: true,
      opacity: isDark ? 0.2 : 0.25,
      wireframe: false,
    });
    const innerSolidMesh = new THREE.Mesh(innerSolidGeo, innerSolidMat);
    coreGroup.add(innerSolidMesh);

    // Orbital Ring 1
    const ring1Geo = new THREE.TorusGeometry(8.5, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x818cf8 : 0x4f46e5,
      transparent: true,
      opacity: isDark ? 0.45 : 0.55,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    // Orbital Ring 2
    const ring2Geo = new THREE.TorusGeometry(11.2, 0.03, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x38bdf8 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.35 : 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    coreGroup.add(ring2);

    // Orbital Ring 3
    const ring3Geo = new THREE.TorusGeometry(14.5, 0.02, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xa855f7 : 0x7c3aed,
      transparent: true,
      opacity: isDark ? 0.2 : 0.3,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 2.2;
    coreGroup.add(ring3);

    // 3. Floating Antigravity Particles Constellation
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const radius = 6 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = (radius * Math.sin(phi) * Math.sin(theta)) * 0.75;
      positions[idx + 2] = (radius * Math.cos(phi)) * 0.65;

      velocities[idx] = (Math.random() - 0.5) * 0.008;
      velocities[idx + 1] = (Math.random() - 0.5) * 0.008;
      velocities[idx + 2] = (Math.random() - 0.5) * 0.008;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvasTexture = createParticleTexture(isDark);
    const particlesMaterial = new THREE.PointsMaterial({
      color: isDark ? 0xa5b4fc : 0x6366f1,
      size: isDark ? 0.85 : 0.95,
      map: canvasTexture,
      transparent: true,
      opacity: isDark ? 0.75 : 0.85,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 4. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, isDark ? 3 : 2.2, 50);
    pointLight1.position.set(12, 12, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, isDark ? 2.5 : 2.0, 50);
    pointLight2.position.set(-12, -10, 8);
    scene.add(pointLight2);

    // 5. Mouse Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 1.2;
      targetRotationX = -y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      icoMesh.rotation.x += 0.003;
      icoMesh.rotation.y += 0.004;

      innerSolidMesh.rotation.x -= 0.004;
      innerSolidMesh.rotation.z += 0.005;

      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.0018;
      ring3.rotation.z += 0.0012;

      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.04;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.04;
      coreGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.6;

      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        posArray[idx] += velocities[idx];
        posArray[idx + 1] += velocities[idx + 1] + Math.sin(elapsedTime + i) * 0.003;
        posArray[idx + 2] += velocities[idx + 2];

        const dist = Math.sqrt(
          posArray[idx] ** 2 + posArray[idx + 1] ** 2 + posArray[idx + 2] ** 2
        );
        if (dist > 30 || dist < 4) {
          velocities[idx] *= -1;
          velocities[idx + 1] *= -1;
          velocities[idx + 2] *= -1;
        }
      }
      posAttr.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      icoGeometry.dispose();
      icoMaterial.dispose();
      innerSolidGeo.dispose();
      innerSolidMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [interactive, isDark]);

  return (
    <div
      ref={containerRef}
      style={{ opacity: isDark ? opacity : opacity * 0.9 }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

function createParticleTexture(isDark: boolean): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    if (isDark) {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.25, 'rgba(129, 140, 248, 0.85)');
      gradient.addColorStop(0.55, 'rgba(56, 189, 248, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(99, 102, 241, 1)');
      gradient.addColorStop(0.35, 'rgba(56, 189, 248, 0.8)');
      gradient.addColorStop(0.65, 'rgba(147, 197, 253, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
