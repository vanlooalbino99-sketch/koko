'use client';

import { useEffect, useRef, useState } from 'react';
import { GlassRing } from './charts';

// Anneau de verre lumineux de la carte « À retenir » (maquette « RevenuePulse ») : six segments, violet en haut et
// cyan en bas, bords qui s'illuminent, halo qui respire, et son ombre sur la carte. Il tourne lentement, pivote et
// flotte ; l'ombre suit sa hauteur. three.js n'est chargé qu'à l'affichage ; l'anneau SVG reste visible en attendant,
// ou si le navigateur n'a pas WebGL. Pause hors écran ; immobile si l'utilisateur réduit les animations.
export function GlassTorus({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
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
      scene.environmentIntensity = 0.3;
      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 50);
      camera.position.set(0, 0, 5.6);

      // Inclinaison (penché comme sur la maquette) > lacet (vu de trois quarts) > rotation des segments sur l'anneau.
      const tilt = new THREE.Group();
      const yaw = new THREE.Group();
      const spin = new THREE.Group();
      tilt.add(yaw);
      yaw.add(spin);
      scene.add(tilt);
      const top = new THREE.Color('#8f5cff');
      const mid = new THREE.Color('#5f86ff');
      const bottom = new THREE.Color('#22d8e6');
      const SEGMENTS = 6;
      const arc = (Math.PI * 2) / SEGMENTS;
      const geometry = new THREE.TorusGeometry(1, 0.25, 48, 40, arc - 0.012);
      const materials: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
      for (let k = 0; k < SEGMENTS; k++) {
        const material = new THREE.MeshPhysicalMaterial({
          roughness: 0.4,
          metalness: 0,
          clearcoat: 0.6,
          clearcoatRoughness: 0.25,
          sheen: 0.6,
          sheenColor: new THREE.Color('#ffffff'),
          sheenRoughness: 0.5,
          transparent: true,
          opacity: 0.9,
          emissiveIntensity: 0.4,
        });
        // Bords lumineux : plus la surface est vue de biais, plus elle émet sa propre couleur, un peu blanchie.
        material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <emissivemap_fragment>',
            `#include <emissivemap_fragment>
            float rim = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.2);
            totalEmissiveRadiance += mix(emissive, vec3(1.0), 0.15) * rim * 0.8;`,
          );
        };
        materials.push(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.z = k * arc;
        spin.add(mesh);
      }
      scene.add(new THREE.AmbientLight('#ffffff', 0.25));
      const key = new THREE.DirectionalLight('#ffffff', 1.1);
      key.position.set(-2, 3, 4);
      scene.add(key);
      const violet = new THREE.PointLight('#a78bfa', 5.5, 12);
      violet.position.set(1.5, 2.5, 2.5);
      scene.add(violet);
      const cyan = new THREE.PointLight('#22d3ee', 5.5, 12);
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
      // Lent : les segments font le tour de l'anneau en 28 s, l'anneau pivote et flotte ; son ombre rétrécit et
      // pâlit quand il monte.
      const render = (time: number) => {
        const t = time / 1000;
        const lift = Math.sin(t * 0.6);
        tilt.rotation.z = 0.7 + Math.sin(t * 0.22) * 0.05;
        tilt.position.y = lift * 0.06;
        yaw.rotation.set(0.12 + Math.sin(t * 0.3) * 0.06, 1.12 + Math.sin(t * 0.3) * 0.15, 0);
        spin.rotation.z = t * 0.22;
        scene.updateMatrixWorld(true);
        recolor();
        renderer.render(scene, camera);
        if (shadow.current) {
          shadow.current.style.transform = `scale(${(1 - lift * 0.06).toFixed(3)})`;
          shadow.current.style.opacity = (0.9 - lift * 0.1).toFixed(3);
        }
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
      <div className="relative">
        {/* Ombre de la maquette : une large flaque claire sous l'anneau, décalée à gauche, et un cœur plus sombre. */}
        <div ref={shadow} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[30%] origin-center">
          <div className="absolute bottom-[4%] left-[-6%] h-[74%] w-[92%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(140,135,225,0.38),rgba(120,115,210,0.18)_60%,transparent)]" />
          <div className="absolute bottom-[26%] left-[22%] h-[36%] w-[48%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(10,8,40,0.55),transparent)]" />
        </div>
        <div ref={box} className="bs-glow relative z-10 aspect-square w-full">
          {!ready && (
            <div className="absolute inset-0 grid place-items-center">
              <GlassRing />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
