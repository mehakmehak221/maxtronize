'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type CubeDef = { height: number; color: number };

type Props = {
  cubes: CubeDef[];
  className?: string;
};

export default function CubeFlowScene({ cubes, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 2.2, 6.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const disposables: Array<{ dispose: () => void }> = [];
    const group = new THREE.Group();
    scene.add(group);

    const count = cubes.length;
    const spacing = 1.35;
    const startX = -((count - 1) * spacing) / 2;

    const meshCubes: THREE.Mesh[] = [];
    const baseMeshes: THREE.Mesh[] = [];

    cubes.forEach((cube, i) => {
      const h = cube.height;
      const geo = new THREE.BoxGeometry(0.75, h, 0.75);
      disposables.push(geo);
      const mat = new THREE.MeshPhysicalMaterial({
        color: cube.color,
        metalness: 0.45,
        roughness: 0.22,
        clearcoat: 0.85,
        emissive: cube.color,
        emissiveIntensity: 0.1,
      });
      disposables.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(startX + i * spacing, h / 2, 0);
      group.add(mesh);
      meshCubes.push(mesh);

      const baseGeo = new THREE.BoxGeometry(1.05, 0.04, 1.05);
      disposables.push(baseGeo);
      const baseMat = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.35,
      });
      disposables.push(baseMat);
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.set(startX + i * spacing, 0.02, 0);
      base.rotation.y = Math.PI / 4;
      group.add(base);
      baseMeshes.push(base);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(startX + i * spacing, h + 0.15, 0),
        new THREE.Vector3(startX + i * spacing, h + 1.2, 0),
      ]);
      disposables.push(lineGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.4 });
      disposables.push(lineMat);
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
    });

    const pathPoints: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      pathPoints.push(new THREE.Vector3(startX + i * spacing, 0.05, 0));
    }
    const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
    disposables.push(pathGeo);
    const pathMat = new THREE.LineDashedMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.5,
      dashSize: 0.12,
      gapSize: 0.08,
    });
    disposables.push(pathMat);
    const path = new THREE.Line(pathGeo, pathMat);
    path.computeLineDistances();
    group.add(path);

    const glowGeo = new THREE.PlaneGeometry(8, 4);
    disposables.push(glowGeo);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x57339d,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    disposables.push(glowMat);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.05;
    group.add(glow);

    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const key = new THREE.PointLight(0x7c3aed, 18, 16);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(0xc084fc, 10, 14);
    fill.position.set(3, 2, 4);
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
      renderer.setSize(w, h, false);
      group.scale.setScalar(w < 500 ? 0.72 : w < 768 ? 0.88 : 1);
    };

    let animFrame = 0;
    const animate = (t: number) => {
      const s = t * 0.001;
      group.rotation.y = Math.sin(s * 0.2) * 0.08 + pointer.x * 0.08;
      meshCubes.forEach((mesh, i) => {
        mesh.position.y = cubes[i].height / 2 + Math.sin(s * 1.2 + i * 0.9) * 0.04;
        mesh.rotation.y = s * 0.25 + i * 0.15;
      });
      baseMeshes.forEach((base, i) => {
        base.rotation.z = s * 0.15 + i * 0.1;
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
  }, [cubes]);

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} aria-hidden="true" />;
}
