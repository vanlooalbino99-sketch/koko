'use client';

import { useEffect, useRef, useState } from 'react';
import { GlassRing } from './charts';

// Anneau de verre en 3D de la carte « À retenir » (maquette « RevenuePulse ») : six segments brillants, violet en
// haut et cyan en bas, qui tournent lentement pendant que l'anneau pivote. three.js n'est chargé qu'à l'affichage ;
// l'anneau SVG reste visible en attendant, ou si le navigateur n'a pas WebGL. Pause hors écran ; immobile si
// l'utilisateur réduit les animations.
export function GlassTorus({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = box.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      const size = () => [host.clientWidth || 150, host.clientHeight || 150] as const;
      const [w, h] = size();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.style.display = 'block';
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      scene.environmentIntensity = 0.5;
      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 50);
      camera.position.set(0, 0, 5.4);

      // Inclinaison (penché comme sur la maquette) > lacet (vu de trois quarts) > rotation des segments sur l'anneau.
      const tilt = new THREE.Group();
      const yaw = new THREE.Group();
      const spin = new THREE.Group();
      tilt.add(yaw);
      yaw.add(spin);
      scene.add(tilt);
      const top = new THREE.Color('#9f74ff');
      const mid = new THREE.Color('#708cff');
      const bottom = new THREE.Color('#42e2ee');
      const SEGMENTS = 6;
      const arc = (Math.PI * 2) / SEGMENTS;
      const geometry = new THREE.TorusGeometry(1, 0.22, 48, 32, arc - 0.025);
      const materials: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
      for (let k = 0; k < SEGMENTS; k++) {
        const material = new THREE.MeshPhysicalMaterial({
          roughness: 0.22,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          iridescence: 0.25,
          transparent: true,
          opacity: 0.88,
          emissiveIntensity: 0.5,
        });
        materials.push(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.z = k * arc;
        spin.add(mesh);
      }
      scene.add(new THREE.AmbientLight('#ffffff', 0.4));
      const key = new THREE.DirectionalLight('#ffffff', 2.4);
      key.position.set(-2, 3, 4);
      scene.add(key);
      const violet = new THREE.PointLight('#a78bfa', 10, 12);
      violet.position.set(1.5, 2.5, 2.5);
      scene.add(violet);
      const cyan = new THREE.PointLight('#22d3ee', 10, 12);
      cyan.position.set(-1, -2.5, 2.5);
      scene.add(cyan);

      // Couleur de chaque segment selon sa hauteur à l'écran : violet en haut, cyan en bas, même quand il tourne.
      const world = new THREE.Vector3();
      const recolor = () => {
        spin.children.forEach((_, k) => {
          world.set(Math.cos(k * arc + arc / 2), Math.sin(k * arc + arc / 2), 0);
          spin.localToWorld(world);
          const tY = THREE.MathUtils.clamp((world.y + 1) / 2, 0, 1);
          const c = tY > 0.5 ? mid.clone().lerp(top, (tY - 0.5) * 2) : bottom.clone().lerp(mid, tY * 2);
          materials[k].color.copy(c);
          materials[k].emissive.copy(c);
        });
      };

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let frame = 0;
      let visible = true;
      // Lent : les segments font le tour de l'anneau en 18 s, l'anneau pivote de trois quarts et flotte un peu.
      const render = (time: number) => {
        const t = time / 1000;
        tilt.rotation.z = 0.62 + Math.sin(t * 0.3) * 0.06;
        tilt.position.y = Math.sin(t * 0.8) * 0.05;
        yaw.rotation.set(0.12 + Math.sin(t * 0.5) * 0.08, 1.05 + Math.sin(t * 0.5) * 0.18, 0);
        spin.rotation.z = t * 0.35;
        scene.updateMatrixWorld(true);
        recolor();
        renderer.render(scene, camera);
      };
      const loop = (time: number) => {
        render(time);
        if (!reduce && visible) frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
      setReady(true);
      const ro = new ResizeObserver(() => {
        const [nw, nh] = size();
        renderer.setSize(nw, nh);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        render(performance.now());
      });
      ro.observe(host);
      const io = new IntersectionObserver(([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (visible && !was && !reduce) frame = requestAnimationFrame(loop);
      });
      io.observe(host);
      cleanup = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        io.disconnect();
        geometry.dispose();
        materials.forEach((m) => m.dispose());
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch(() => undefined);
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={className}>
      <div ref={box} className="relative z-10 aspect-square w-full">
        {!ready && (
          <div className="absolute inset-0 grid place-items-center">
            <GlassRing />
          </div>
        )}
      </div>
      <div aria-hidden="true" className="-mt-6 mr-auto h-5 w-[88%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(14,12,44,0.75),transparent)]" />
    </div>
  );
}
