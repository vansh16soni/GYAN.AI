import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext.jsx';

export default function TreeCanvas({
  interactive = true,
  opacity = 0.95,
  className = '',
}) {
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    // Soft soothing mist (Dark: deep midnight forest, Bright: enchanted muted sage-grove mist)
    scene.fog = new THREE.FogExp2(isDark ? 0x030a07 : 0xd2eadc, isDark ? 0.022 : 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.4, 33);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.35 : 1.2;
    container.appendChild(renderer.domElement);

    // Master Forest & Tree Group
    const forestMasterGroup = new THREE.Group();
    scene.add(forestMasterGroup);

    // Main Glowing 3D Gyan Tree Group
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0, -6.2, 0);
    forestMasterGroup.add(treeGroup);

    // 2. Glowing Twisted Trunk (Braided Neural Filaments)
    const trunkGroup = new THREE.Group();
    treeGroup.add(trunkGroup);

    const trunkStrands = 16;
    const trunkHeight = 12.0;
    const trunkMaterials = [];
    const trunkGeometries = [];

    for (let s = 0; s < trunkStrands; s++) {
      const strandPoints = [];
      const angleOffset = (s / trunkStrands) * Math.PI * 2;
      const numSegments = 36;

      for (let j = 0; j <= numSegments; j++) {
        const t = j / numSegments;
        const y = t * trunkHeight;

        // Organic sinuous twist, organic tapering and muscular tree flare
        const twistAngle = angleOffset + t * Math.PI * 2.8 + Math.sin(t * Math.PI * 2.2) * 0.45;
        const baseRadius = (1 - t * 0.62) * (1.35 + Math.sin(s * 1.6) * 0.35) + 0.3;
        const wobbleX = Math.sin(t * 3.4 + s) * 0.45 * (1 - t * 0.25);
        const wobbleZ = Math.cos(t * 2.9 + s) * 0.4 * (1 - t * 0.25);

        const x = Math.cos(twistAngle) * baseRadius + wobbleX;
        const z = Math.sin(twistAngle) * baseRadius + wobbleZ;

        strandPoints.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(strandPoints);
      const tubeGeo = new THREE.TubeGeometry(
        curve,
        54,
        s % 3 === 0 ? 0.14 : 0.085,
        8,
        false
      );
      trunkGeometries.push(tubeGeo);

      const strandMat = new THREE.MeshBasicMaterial({
        color: isDark
          ? s % 4 === 0
            ? 0xa7f3d0 // bright mint
            : s % 2 === 0
            ? 0x34d399 // emerald
            : 0x059669 // deep jade
          : s % 4 === 0
          ? 0x047857 // rich deep forest
          : s % 2 === 0
          ? 0x059669 // vibrant emerald
          : 0x10b981, // luminous green
        transparent: true,
        opacity: isDark
          ? s % 3 === 0 ? 0.98 : 0.82
          : s % 3 === 0 ? 0.98 : 0.88,
        wireframe: s % 5 === 0,
      });
      trunkMaterials.push(strandMat);

      const tubeMesh = new THREE.Mesh(tubeGeo, strandMat);
      trunkGroup.add(tubeMesh);
    }

    // 3. Sprawling Neural Ground Roots (Vibrant Floor Synapses)
    const rootsGroup = new THREE.Group();
    treeGroup.add(rootsGroup);

    const rootBranchLines = [];
    const numPrimaryRoots = 22;
    const rootRadiusMax = 18.0;

    for (let r = 0; r < numPrimaryRoots; r++) {
      const baseAngle = (r / numPrimaryRoots) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      let curX = Math.cos(baseAngle) * 1.6;
      let curY = 0.05;
      let curZ = Math.sin(baseAngle) * 1.6;

      const numSteps = 14 + Math.floor(Math.random() * 8);
      let prevPt = new THREE.Vector3(curX, curY, curZ);

      for (let step = 0; step < numSteps; step++) {
        const progress = step / numSteps;
        const dist = 1.6 + progress * (rootRadiusMax - 1.6);
        const wiggleAngle =
          baseAngle +
          Math.sin(step * 0.85 + r) * 0.5 +
          (Math.random() - 0.5) * 0.3;

        const nextX = Math.cos(wiggleAngle) * dist;
        const nextY = -Math.sin(progress * Math.PI * 0.5) * 0.45 + (Math.random() - 0.5) * 0.08;
        const nextZ = Math.sin(wiggleAngle) * dist;
        const nextPt = new THREE.Vector3(nextX, nextY, nextZ);

        rootBranchLines.push(prevPt.clone(), nextPt.clone());

        // Secondary sub-root branching (fractal lightning pattern)
        if (step > 2 && Math.random() > 0.4) {
          const subAngle = wiggleAngle + (Math.random() > 0.5 ? 0.55 : -0.55);
          const subLength = 3.0 + Math.random() * 4.0;
          const subEnd = new THREE.Vector3(
            nextX + Math.cos(subAngle) * subLength,
            nextY - 0.08,
            nextZ + Math.sin(subAngle) * subLength
          );
          rootBranchLines.push(nextPt.clone(), subEnd);

          // Micro tertiary roots
          if (Math.random() > 0.45) {
            const microEnd = new THREE.Vector3(
              subEnd.x + (Math.random() - 0.5) * 1.8,
              subEnd.y - 0.02,
              subEnd.z + (Math.random() - 0.5) * 1.8
            );
            rootBranchLines.push(subEnd.clone(), microEnd);
          }
        }

        prevPt = nextPt;
      }
    }

    const rootsGeo = new THREE.BufferGeometry().setFromPoints(rootBranchLines);
    const rootsMat = new THREE.LineBasicMaterial({
      color: isDark ? 0x6ee7b7 : 0x047857,
      transparent: true,
      opacity: isDark ? 0.88 : 0.85,
      linewidth: 2,
    });
    const rootsMesh = new THREE.LineSegments(rootsGeo, rootsMat);
    rootsGroup.add(rootsMesh);

    // 4. Intricate Fractal 3D Canopy Branches
    const branchesGroup = new THREE.Group();
    treeGroup.add(branchesGroup);

    const branchLines = [];
    const canopyNodes = [];

    function generateBranches(
      start,
      direction,
      length,
      depth,
      maxDepth
    ) {
      if (depth >= maxDepth) {
        canopyNodes.push(start.clone());
        return;
      }

      const end = start.clone().add(direction.clone().multiplyScalar(length));
      branchLines.push(start.clone(), end.clone());

      const numChildren = depth === 0 ? 5 : depth < 3 ? 3 : 2;
      for (let i = 0; i < numChildren; i++) {
        const spreadAngle = 0.48 + depth * 0.13;
        const phi = (i / numChildren) * Math.PI * 2 + Math.random() * 0.5;

        const newDir = direction.clone();
        newDir.x += Math.cos(phi) * spreadAngle + (Math.random() - 0.5) * 0.25;
        newDir.z += Math.sin(phi) * spreadAngle + (Math.random() - 0.5) * 0.25;
        newDir.y += (0.32 - depth * 0.075) + (Math.random() - 0.5) * 0.2;
        newDir.normalize();

        generateBranches(
          end,
          newDir,
          length * (0.69 + Math.random() * 0.12),
          depth + 1,
          maxDepth
        );
      }
    }

    // Generate multiple main limb crowns branching from the top of the trunk
    const trunkTop = new THREE.Vector3(0, trunkHeight, 0);
    const numCrownLimbs = 8;
    for (let c = 0; c < numCrownLimbs; c++) {
      const limbAngle = (c / numCrownLimbs) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const initialDir = new THREE.Vector3(
        Math.cos(limbAngle) * 0.88,
        0.78 + Math.random() * 0.35,
        Math.sin(limbAngle) * 0.88
      ).normalize();

      generateBranches(trunkTop, initialDir, 4.2, 0, 5);
    }

    const branchesGeo = new THREE.BufferGeometry().setFromPoints(branchLines);
    const branchesMat = new THREE.LineBasicMaterial({
      color: isDark ? 0xa7f3d0 : 0x059669,
      transparent: true,
      opacity: isDark ? 0.78 : 0.8,
    });
    const branchesMesh = new THREE.LineSegments(branchesGeo, branchesMat);
    branchesGroup.add(branchesMesh);

    // 5. Bioluminescent Foliage Particles & Canopy Energy Synapses
    const foliageCount = canopyNodes.length * 3 + 380;
    const foliagePos = new Float32Array(foliageCount * 3);
    const foliageScales = new Float32Array(foliageCount);

    for (let i = 0; i < foliageCount; i++) {
      const idx = i * 3;
      if (i < canopyNodes.length) {
        const node = canopyNodes[i];
        foliagePos[idx] = node.x + (Math.random() - 0.5) * 2.0;
        foliagePos[idx + 1] = node.y + (Math.random() - 0.5) * 2.0;
        foliagePos[idx + 2] = node.z + (Math.random() - 0.5) * 2.0;
      } else {
        const r = 3.5 + Math.random() * 12.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() * 0.5 + 0.08) * Math.PI;

        foliagePos[idx] = r * Math.sin(phi) * Math.cos(theta);
        foliagePos[idx + 1] = trunkHeight + r * Math.cos(phi) * 0.85 + (Math.random() - 0.5) * 2;
        foliagePos[idx + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      foliageScales[i] = Math.random() * 0.9 + 0.5;
    }

    const foliageGeo = new THREE.BufferGeometry();
    foliageGeo.setAttribute('position', new THREE.BufferAttribute(foliagePos, 3));
    foliageGeo.setAttribute('scale', new THREE.BufferAttribute(foliageScales, 1));

    const leafTexture = createSporeTexture(isDark);
    const foliageMat = new THREE.PointsMaterial({
      color: isDark ? 0x00ff9d : 0x059669,
      size: isDark ? 1.05 : 1.15,
      map: leafTexture,
      transparent: true,
      opacity: isDark ? 0.9 : 0.88,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const foliagePoints = new THREE.Points(foliageGeo, foliageMat);
    treeGroup.add(foliagePoints);

    // 6. Dynamic Bioluminescent Fireflies & Floating Spores
    const sporeCount = 200;
    const sporePositions = new Float32Array(sporeCount * 3);
    const sporeVelocities = new Float32Array(sporeCount * 3);

    for (let i = 0; i < sporeCount; i++) {
      const idx = i * 3;
      sporePositions[idx] = (Math.random() - 0.5) * 38;
      sporePositions[idx + 1] = Math.random() * 28 - 5;
      sporePositions[idx + 2] = (Math.random() - 0.5) * 32;

      sporeVelocities[idx] = (Math.random() - 0.5) * 0.014;
      sporeVelocities[idx + 1] = (Math.random() * 0.012 + 0.005);
      sporeVelocities[idx + 2] = (Math.random() - 0.5) * 0.014;
    }

    const sporeGeo = new THREE.BufferGeometry();
    sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));

    const sporeMat = new THREE.PointsMaterial({
      color: isDark ? 0x6ee7b7 : 0x059669,
      size: isDark ? 1.3 : 1.25,
      map: leafTexture,
      transparent: true,
      opacity: isDark ? 0.95 : 0.88,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const sporeSystem = new THREE.Points(sporeGeo, sporeMat);
    scene.add(sporeSystem);

    // 7. Forest Floor Glowing Reflection Disc
    const floorGeo = new THREE.RingGeometry(0.5, 22, 48);
    const floorMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x059669 : 0x059669,
      transparent: true,
      opacity: isDark ? 0.15 : 0.18,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -6.18;
    treeGroup.add(floorMesh);

    // 8. Forest Lighting (Deep & Rich)
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x064e3b : 0xb9e4cd,
      isDark ? 1.3 : 1.8
    );
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(
      isDark ? 0x00ff9d : 0x059669,
      isDark ? 3.8 : 3.4,
      50
    );
    coreLight.position.set(0, 3.5, 2);
    treeGroup.add(coreLight);

    const rootLight = new THREE.PointLight(
      isDark ? 0x34d399 : 0x10b981,
      isDark ? 3.0 : 2.6,
      35
    );
    rootLight.position.set(0, 0.6, 0);
    treeGroup.add(rootLight);

    // 9. Mouse Interaction & Camera Parallax
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 0.9;
      targetRotationX = -y * 0.45;
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

    // 10. Render Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Tree organic idle breath & rotation
      treeGroup.rotation.y += (targetRotationY - treeGroup.rotation.y) * 0.038 + 0.001;
      treeGroup.rotation.x += (targetRotationX - treeGroup.rotation.x) * 0.038;

      const breathing = Math.sin(elapsedTime * 1.4) * 0.018;
      treeGroup.scale.set(1 + breathing, 1 + breathing * 0.85, 1 + breathing);

      // Pulse core and root lights
      coreLight.intensity = (isDark ? 3.2 : 2.8) + Math.sin(elapsedTime * 2.2) * 0.9;
      rootLight.intensity = (isDark ? 2.6 : 2.2) + Math.cos(elapsedTime * 1.8) * 0.7;

      // Rotate foliage and spores
      foliagePoints.rotation.y = Math.sin(elapsedTime * 0.3) * 0.05;

      // Animate floating fireflies
      const sporePosAttr = sporeGeo.attributes.position;
      const sporeArray = sporePosAttr.array;

      for (let i = 0; i < sporeCount; i++) {
        const idx = i * 3;
        sporeArray[idx] += sporeVelocities[idx] + Math.sin(elapsedTime * 0.8 + i) * 0.009;
        sporeArray[idx + 1] += sporeVelocities[idx + 1];
        sporeArray[idx + 2] += sporeVelocities[idx + 2] + Math.cos(elapsedTime * 0.7 + i) * 0.009;

        if (sporeArray[idx + 1] > 23) {
          sporeArray[idx + 1] = -5;
        }
      }
      sporePosAttr.needsUpdate = true;

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

      trunkGeometries.forEach((g) => g.dispose());
      trunkMaterials.forEach((m) => m.dispose());
      rootsGeo.dispose();
      rootsMat.dispose();
      branchesGeo.dispose();
      branchesMat.dispose();
      foliageGeo.dispose();
      foliageMat.dispose();
      sporeGeo.dispose();
      sporeMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
    };
  }, [interactive, isDark]);

  return (
    <div
      ref={containerRef}
      style={{ opacity }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}

function createSporeTexture(isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    if (isDark) {
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(0, 255, 157, 0.95)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(4, 120, 87, 1)');
      gradient.addColorStop(0.25, 'rgba(5, 150, 105, 0.9)');
      gradient.addColorStop(0.55, 'rgba(16, 185, 129, 0.6)');
      gradient.addColorStop(1, 'rgba(210, 234, 220, 0)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
