'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ALLOCATION = [
  { pct: 0.30, color: 0x7c3aed },
  { pct: 0.18, color: 0x9333ea },
  { pct: 0.13, color: 0x6d28d9 },
  { pct: 0.12, color: 0xa855f7 },
  { pct: 0.27, color: 0xc084fc },
];

export default function TokenomicsScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    scene.add(group);

    const donutGroup = new THREE.Group();
    donutGroup.rotation.x = -Math.PI / 2.2;
    donutGroup.position.y = 0.35;
    group.add(donutGroup);

    let angle = 0;
    const radius = 1.55;
    const tube = 0.22;
    ALLOCATION.forEach(({ pct, color }) => {
      const arc = pct * Math.PI * 2 * 0.96;
      const geo = new THREE.TorusGeometry(radius, tube, 16, 64, arc);
      disposables.push(geo);
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.45,
        roughness: 0.2,
        clearcoat: 0.8,
        emissive: color,
        emissiveIntensity: 0.08,
      });
      disposables.push(mat);
      const seg = new THREE.Mesh(geo, mat);
      seg.rotation.z = angle + Math.PI / 2;
      angle += arc + 0.04;
      donutGroup.add(seg);
    });

    const coinGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.14, 64);
    disposables.push(coinGeo);
    const coinMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.7,
      roughness: 0.15,
      clearcoat: 1,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.15,
    });
    disposables.push(coinMat);
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.position.y = 0.35;
    group.add(coin);

    const coinRimGeo = new THREE.TorusGeometry(0.72, 0.035, 12, 64);
    disposables.push(coinRimGeo);
    const coinRimMat = new THREE.MeshPhysicalMaterial({
      color: 0xc084fc,
      metalness: 0.9,
      roughness: 0.1,
    });
    disposables.push(coinRimMat);
    const coinRim = new THREE.Mesh(coinRimGeo, coinRimMat);
    coinRim.rotation.x = Math.PI / 2;
    coinRim.position.y = 0.42;
    group.add(coinRim);

    const innerRingGeo = new THREE.TorusGeometry(0.48, 0.012, 8, 64);
    disposables.push(innerRingGeo);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xe9d5ff, transparent: true, opacity: 0.7 });
    disposables.push(innerRingMat);
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.43;
    group.add(innerRing);

    const chainGroup = new THREE.Group();
    chainGroup.position.set(0, -1.05, 0);
    group.add(chainGroup);

    const blocks: THREE.Mesh[] = [];
    const blockCount = 6;
    for (let i = 0; i < blockCount; i++) {
      const geo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
      disposables.push(geo);
      const mat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? 0x9333ea : 0xa855f7,
        metalness: 0.35,
        roughness: 0.25,
        clearcoat: 0.5,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.06,
      });
      disposables.push(mat);
      const block = new THREE.Mesh(geo, mat);
      block.position.x = (i - (blockCount - 1) / 2) * 0.52;
      chainGroup.add(block);
      blocks.push(block);

      if (i < blockCount - 1) {
        const linkGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.14, 8);
        disposables.push(linkGeo);
        const linkMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.8 });
        disposables.push(linkMat);
        const link = new THREE.Mesh(linkGeo, linkMat);
        link.rotation.z = Math.PI / 2;
        link.position.set(block.position.x + 0.26, 0, 0);
        chainGroup.add(link);
      }
    }

    const glowGeo = new THREE.RingGeometry(1.85, 2.05, 64);
    disposables.push(glowGeo);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    disposables.push(glowMat);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.02;
    group.add(glow);

    const orbitOrbs: THREE.Mesh[] = [];
    [1.9, 2.3].forEach((r, idx) => {
      const geo = new THREE.SphereGeometry(0.045, 10, 10);
      const mat = new THREE.MeshBasicMaterial({ color: idx === 0 ? 0xa855f7 : 0xc084fc });
      disposables.push(geo, mat);
      const orb = new THREE.Mesh(geo, mat);
      group.add(orb);
      orbitOrbs.push(orb);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const key = new THREE.PointLight(0x7c3aed, 16, 14);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0xc084fc, 8, 12);
    fill.position.set(2.5, 1, 3);
    scene.add(fill);

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
      renderer.setSize(w, h);
      group.scale.setScalar(w < 400 ? 0.78 : 1);
    };

    let animFrame = 0;
    const animate = (t: number) => {
      const s = t * 0.001;
      group.rotation.y = Math.sin(s * 0.25) * 0.12 + pointer.x * 0.1;
      group.rotation.x = -pointer.y * 0.05;
      donutGroup.rotation.z = s * 0.15;
      coin.rotation.y = s * 0.35;
      coinRim.rotation.z = s * 0.35;
      innerRing.rotation.z = -s * 0.2;
      glow.rotation.z = s * 0.08;
      chainGroup.rotation.y = Math.sin(s * 0.4) * 0.08;
      blocks.forEach((b, i) => {
        b.position.y = Math.sin(s * 1.5 + i * 0.8) * 0.04;
        b.rotation.y = s * 0.3 + i * 0.2;
      });
      orbitOrbs.forEach((orb, i) => {
        const r = i === 0 ? 1.9 : 2.3;
        const speed = i === 0 ? 0.9 : -0.7;
        const a = s * speed + i * Math.PI;
        orb.position.x = Math.cos(a) * r;
        orb.position.z = Math.sin(a) * r;
        orb.position.y = 0.35 + Math.sin(s * 2 + i) * 0.08;
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

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />;
}
