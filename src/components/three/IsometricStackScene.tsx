'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function IsometricStackScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(4, 4, 6);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    scene.add(group);

    const layout = [
      { x: -1.1, z: 0.6, h: 0.35, color: 0x57339d, stack: 1 },
      { x: 0, z: 0, h: 0.55, color: 0x7c3aed, stack: 2 },
      { x: 1.1, z: -0.5, h: 0.4, color: 0x9333ea, stack: 1 },
      { x: -0.5, z: -0.9, h: 0.3, color: 0xc084fc, stack: 1 },
      { x: 0.9, z: 0.8, h: 0.45, color: 0x391f6b, stack: 1 },
    ];

    const meshes: THREE.Mesh[] = [];
    layout.forEach((b) => {
      for (let s = 0; s < b.stack; s++) {
        const geo = new THREE.BoxGeometry(0.85, b.h, 0.85);
        disposables.push(geo);
        const mat = new THREE.MeshPhysicalMaterial({
          color: b.color,
          metalness: 0.35,
          roughness: 0.25,
          clearcoat: 0.7,
          emissive: b.color,
          emissiveIntensity: 0.08,
        });
        disposables.push(mat);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(b.x, b.h / 2 + s * (b.h + 0.08), b.z);
        mesh.rotation.y = Math.PI / 4;
        group.add(mesh);
        meshes.push(mesh);
      }
    });

    const ghostGeo = new THREE.BoxGeometry(0.85, 0.04, 0.85);
    disposables.push(ghostGeo);
    const ghostMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
    disposables.push(ghostMat);
    [[-1.1, 0.6], [0.5, -0.3]].forEach(([x, z]) => {
      const g = new THREE.Mesh(ghostGeo, ghostMat);
      g.position.set(x, 0.02, z);
      g.rotation.y = Math.PI / 4;
      group.add(g);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const key = new THREE.PointLight(0x7c3aed, 16, 18);
    key.position.set(3, 5, 5);
    scene.add(key);

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
      group.rotation.y = Math.sin(s * 0.25) * 0.12;
      meshes.forEach((m, i) => {
        m.position.y += Math.sin(s * 1.1 + i * 0.7) * 0.0008;
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

  return <div ref={containerRef} className="mt-scene" aria-hidden="true" />;
}
