'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleField({ count = 120, spread = 12 }: { count?: number; spread?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities.push((Math.random() - 0.5) * 0.004);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const resize = () => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    let frame = 0;
    const animate = (t: number) => {
      const s = t * 0.001;
      const pos = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += velocities[i];
        if (pos[i * 3 + 1] > spread * 0.35) pos[i * 3 + 1] = -spread * 0.35;
        pos[i * 3] += Math.sin(s + i) * 0.001;
      }
      geo.attributes.position.needsUpdate = true;

      const linkDist = 2.2;
      const linkVerts: number[] = [];
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          if (dx * dx + dy * dy + dz * dz < linkDist * linkDist) {
            linkVerts.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
          }
        }
      }
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linkVerts, 3));

      points.rotation.y = s * 0.04;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      geo.dispose();
      mat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count, spread]);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />;
}
