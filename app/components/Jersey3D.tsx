"use client";

import { useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

function JerseyGLB() {
  const { scene } = useGLTF("/models/Jersy-3D.glb");
  const { gl: renderer } = useThree();

  useEffect(() => {
    console.log("[Jersey3D] GLB loaded ✓");
    console.log("[Jersey3D] scene:", scene);
    console.log("[Jersey3D] children count:", scene.children.length);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    console.log("[Jersey3D] bounding box size:", size);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    console.log("[Jersey3D] GPU max anisotropy:", maxAnisotropy);

    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;

        // Texture slots to inspect and sharpen
        const slots: [string, THREE.Texture | null | undefined][] = [
          ["map",          m.map],
          ["normalMap",    m.normalMap],
          ["roughnessMap", m.roughnessMap],
          ["metalnessMap", m.metalnessMap],
          ["emissiveMap",  m.emissiveMap],
          ["aoMap",        m.aoMap],
        ];

        console.group(`[Jersey3D] mesh="${mesh.name}" mat="${m.name}" (${m.type})`);
        console.log(`  color=#${m.color?.getHexString() ?? "?"} roughness=${m.roughness ?? "?"} metalness=${m.metalness ?? "?"}`);

        slots.forEach(([label, tex]) => {
          if (!tex) {
            console.log(`  ${label}: MISSING`);
            return;
          }
          const img = tex.image as HTMLImageElement | ImageBitmap | undefined;
          const w = img ? ("width" in img ? img.width : "?") : "?";
          const h = img ? ("height" in img ? img.height : "?") : "?";
          console.log(`  ${label}: ${w}×${h}px  anisotropy=${tex.anisotropy}→${maxAnisotropy}`);

          // Apply max anisotropy for sharper detail at oblique angles
          tex.anisotropy = maxAnisotropy;
          tex.needsUpdate = true;
        });

        console.groupEnd();
      });
    });
  }, [scene, renderer]);

  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

export default function Jersey3D() {
  useEffect(() => {
    console.log("[Jersey3D] 3D viewer mounted");
    console.log("[Jersey3D] GLB loading started: /models/Jersy-3D.glb");
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 1.2, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#ffffff", "#C9A84C", 0.6]} />
        <directionalLight position={[3, 5, 3]} intensity={1.4} />
        <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#C9A84C" />
        <directionalLight position={[0, -3, -4]} intensity={0.25} />

        <Suspense fallback={null}>
          <JerseyGLB />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 1.6}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.35)",
          fontWeight: 500,
        }}
      >
        Arrastra para rotar
      </div>
    </div>
  );
}
