'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroOrbsScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.SphereGeometry(0.85, 48, 48);
    disposables.push(coreGeo);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x57339d,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 0.8,
      emissive: 0x391f6b,
      emissiveIntensity: 0.2,
    });
    disposables.push(coreMat);
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const ringGeo = new THREE.TorusGeometry(1.35, 0.012, 8, 120);
    disposables.push(ringGeo);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.55 });
    disposables.push(ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    group.add(ring);

    const cubes: THREE.Mesh[] = [];
    const cubeData = [
      { r: 2.1, speed: 0.7, offset: 0, color: 0x9333ea },
      { r: 2.5, speed: -0.55, offset: 1.2, color: 0x7c3aed },
      { r: 1.8, speed: 0.9, offset: 2.4, color: 0xc084fc },
      { r: 2.3, speed: -0.65, offset: 3.8, color: 0xa855f7 },
    ];
    cubeData.forEach(({ color }) => {
      const geo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
      disposables.push(geo);
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.5,
        roughness: 0.2,
        emissive: color,
        emissiveIntensity: 0.15,
      });
      disposables.push(mat);
      const cube = new THREE.Mesh(geo, mat);
      group.add(cube);
      cubes.push(cube);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const pl = new THREE.PointLight(0x7c3aed, 20, 20);
    pl.position.set(2, 2, 4);
    scene.add(pl);

    const resize = () => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    let animFrame = 0;
    const animate = (t: number) => {
      const s = t * 0.001;
      core.rotation.y = s * 0.35;
      ring.rotation.z = s * 0.2;
      ring.rotation.x = Math.PI / 2.2 + Math.sin(s * 0.3) * 0.1;
      cubes.forEach((cube, i) => {
        const d = cubeData[i];
        const a = s * d.speed + d.offset;
        cube.position.x = Math.cos(a) * d.r;
        cube.position.y = Math.sin(a * 1.3) * 0.5;
        cube.position.z = Math.sin(a) * d.r * 0.35;
        cube.rotation.x = s * 1.2 + i;
        cube.rotation.y = s * 0.8 + i;
      });
      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />;
}
