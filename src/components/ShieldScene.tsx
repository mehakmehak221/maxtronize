'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ShieldScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    scene.add(group);

    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.42);
    shieldShape.bezierCurveTo(0.68, 1.18, 1.12, 0.94, 1.26, 0.54);
    shieldShape.bezierCurveTo(1.14, -0.6, 0.56, -1.28, 0, -1.62);
    shieldShape.bezierCurveTo(-0.56, -1.28, -1.14, -0.6, -1.26, 0.54);
    shieldShape.bezierCurveTo(-1.12, 0.94, -0.68, 1.18, 0, 1.42);

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.3, bevelEnabled: true, bevelSegments: 16,
      bevelSize: 0.055, bevelThickness: 0.075,
    });
    shieldGeo.center();
    disposables.push(shieldGeo);

    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      metalness: 0.55,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.12,
      iridescence: 0.65,
      iridescenceIOR: 1.45,
    });
    disposables.push(shieldMat);
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);

    const edgeGeo = new THREE.EdgesGeometry(shieldGeo, 15);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.9 });
    disposables.push(edgeGeo, edgeMat);
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    group.add(edges);

    const ringColors = [0x7c3aed, 0xa855f7, 0xc084fc];
    const rings = [1.75, 2.2, 2.65].map((radius, idx) => {
      const geo = new THREE.TorusGeometry(radius, 0.008, 8, 180);
      disposables.push(geo);
      const mat = new THREE.MeshBasicMaterial({
        color: ringColors[idx], transparent: true, opacity: 0.35 - idx * 0.06,
      });
      disposables.push(mat);
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.set(Math.PI / 2.15, idx * 0.5, idx * 0.3);
      group.add(ring);
      return ring;
    });

    const orbData = [
      { r: 1.95, speed: 1.4, offset: 0, color: 0xa855f7 },
      { r: 2.35, speed: -1.1, offset: Math.PI * 0.7, color: 0xc084fc },
      { r: 1.6, speed: 1.8, offset: Math.PI * 1.4, color: 0x9333ea },
    ];
    const orbs = orbData.map(({ r, speed, offset, color }) => {
      const geo = new THREE.SphereGeometry(0.055, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ color });
      disposables.push(geo, mat);
      const orb = new THREE.Mesh(geo, mat);
      group.add(orb);
      return { mesh: orb, r, speed, offset };
    });

    const platGeo = new THREE.CylinderGeometry(1.3, 1.45, 0.1, 56);
    disposables.push(platGeo);
    const platMat = new THREE.MeshPhysicalMaterial({
      color: 0xf3e8ff, metalness: 0.3, roughness: 0.35,
      clearcoat: 0.6, emissive: 0x7c3aed, emissiveIntensity: 0.06,
    });
    disposables.push(platMat);
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.position.y = -1.65;
    group.add(platform);

    const platRingGeo = new THREE.TorusGeometry(1.32, 0.01, 8, 90);
    disposables.push(platRingGeo);
    const platRingMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.45 });
    disposables.push(platRingMat);
    const platRing = new THREE.Mesh(platRingGeo, platRingMat);
    platRing.rotation.x = Math.PI / 2;
    platRing.position.y = -1.6;
    group.add(platRing);

    scene.add(new THREE.AmbientLight(0xffffff, 2.2));
    const key = new THREE.PointLight(0x7c3aed, 18, 14);
    key.position.set(-2.5, 2, 4);
    scene.add(key);
    const fill = new THREE.PointLight(0xc084fc, 10, 12);
    fill.position.set(2.5, 0, 3);
    scene.add(fill);
    const top = new THREE.DirectionalLight(0xffffff, 1.8);
    top.position.set(0, 5, 3);
    scene.add(top);

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
      group.scale.setScalar(w < 400 ? 0.82 : 1);
    };

    let animFrame = 0;
    const animate = (t: number) => {
      const s = t * 0.001;
      group.rotation.y = Math.sin(s * 0.3) * 0.18 + pointer.x * 0.14;
      group.rotation.x = Math.sin(s * 0.25) * 0.06 - pointer.y * 0.06;
      shield.rotation.z = Math.sin(s * 0.4) * 0.025;
      edges.rotation.copy(shield.rotation);
      platform.rotation.y = -s * 0.12;
      platRing.rotation.z = s * 0.25;
      orbs.forEach((orb) => {
        const a = s * orb.speed + orb.offset;
        orb.mesh.position.x = Math.cos(a) * orb.r;
        orb.mesh.position.z = Math.sin(a) * orb.r;
        orb.mesh.position.y = -1.55 + Math.sin(s * 2 + orb.offset) * 0.15;
      });
      rings.forEach((ring, i) => {
        ring.rotation.z = s * (0.1 + i * 0.035);
        ring.rotation.y += 0.0012 + i * 0.0004;
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
