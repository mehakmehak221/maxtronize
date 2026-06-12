'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PILLARS = [
  { x: -2.1, z: -0.4, h: 1.1, label: 'Compliance Bond', highlight: true },
  { x: -1.05, z: -0.4, h: 0.85, label: 'Verification', highlight: false },
  { x: 0, z: -0.4, h: 1.35, label: 'Governance', highlight: true },
  { x: 1.05, z: -0.4, h: 0.75, label: 'Listing', highlight: false },
  { x: 2.1, z: -0.4, h: 0.95, label: 'Burn', highlight: false },
  { x: -1.55, z: 0.85, h: 0.65, label: 'Access', highlight: false },
  { x: -0.45, z: 0.85, h: 0.55, label: 'Treasury', highlight: false },
  { x: 0.55, z: 0.85, h: 0.7, label: 'Oracles', highlight: false },
  { x: 1.55, z: 0.85, h: 0.6, label: 'Bridges', highlight: false },
];

function makeBlock(w: number, h: number, d: number, color: number, emissive = 0.08) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.35,
    roughness: 0.22,
    clearcoat: 0.7,
    transparent: true,
    opacity: 0.92,
    emissive: color,
    emissiveIntensity: emissive,
  });
  return { geo, mat, mesh: new THREE.Mesh(geo, mat) };
}

export default function ShieldStackScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(4.5, 4.2, 6.5);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    group.rotation.x = -0.42;
    group.rotation.y = 0.55;
    scene.add(group);

    const base = makeBlock(5.2, 0.18, 2.8, 0x4c1d95, 0.1);
    base.mesh.position.y = -0.55;
    group.add(base.mesh);
    disposables.push(base.geo, base.mat);

    const coreL = makeBlock(2.2, 0.22, 1.2, 0x581c87, 0.12);
    coreL.mesh.position.set(-1.35, -0.28, 0.2);
    group.add(coreL.mesh);
    disposables.push(coreL.geo, coreL.mat);

    const coreR = makeBlock(2.2, 0.22, 1.2, 0x6b28c9, 0.14);
    coreR.mesh.position.set(1.35, -0.28, 0.2);
    group.add(coreR.mesh);
    disposables.push(coreR.geo, coreR.mat);

    const pillars: THREE.Mesh[] = [];
    PILLARS.forEach(({ x, z, h, highlight }) => {
      const block = makeBlock(0.55, h, 0.55, highlight ? 0x7c3aed : 0x9333ea, highlight ? 0.18 : 0.08);
      block.mesh.position.set(x, -0.12 + h / 2, z);
      group.add(block.mesh);
      pillars.push(block.mesh);
      disposables.push(block.geo, block.mat);
    });

    const glowGeo = new THREE.PlaneGeometry(7, 4);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    disposables.push(glowGeo, glowMat);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.56;
    group.add(glow);

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 6, 4);
    scene.add(key);
    const accent = new THREE.PointLight(0xa855f7, 12, 14);
    accent.position.set(-3, 2, 3);
    scene.add(accent);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const resize = () => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      group.scale.setScalar(w < 500 ? 0.72 : 1);
    };

    let animFrame = 0;
    const animate = (t: number) => {
      const s = t * 0.001;
      group.rotation.y = 0.55 + pointer.x * 0.08 + Math.sin(s * 0.2) * 0.04;
      group.rotation.x = -0.42 - pointer.y * 0.04;
      pillars.forEach((p, i) => {
        p.position.y = -0.12 + (PILLARS[i].h / 2) + Math.sin(s * 1.2 + i * 0.6) * 0.02;
      });
      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer);
    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden />;
}
