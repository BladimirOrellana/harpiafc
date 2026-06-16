"use client";

import { useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";

function JerseyGLB() {
  const { scene } = useGLTF("/models/Jersy-3D.glb");
  const { gl: renderer } = useThree();

  useEffect(() => {
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const m = mat as THREE.MeshStandardMaterial;
        [m.map, m.normalMap, m.roughnessMap, m.metalnessMap, m.emissiveMap, m.aoMap].forEach((tex) => {
          if (!tex) return;
          tex.anisotropy = maxAnisotropy;
          tex.needsUpdate = true;
        });
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
        Drag to rotate
      </div>
    </div>
  );
}
