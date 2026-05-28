"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Rotation controller (lives outside render cycle) ─────────────────────
interface Ctrl {
  y: number;
  dragging: boolean;
  lastX: number;
  autoRotate: boolean;
}

// ─── Core jersey mesh ──────────────────────────────────────────────────────
function JerseyMesh({ ctrl }: { ctrl: React.MutableRefObject<Ctrl> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const floatT = useRef(0);

  // Imperative texture loading — no Suspense, no Drei, no network CDN calls.
  // flipY=true (Three.js default) is CORRECT for PlaneGeometry:
  //   PlaneGeometry assigns UV v=1 to the top vertex, v=0 to the bottom.
  //   flipY=true flips the image so v=1→collar, v=0→hem — correct display.
  const { frontMat, backMat } = useMemo(() => {
    const loader = new THREE.TextureLoader();

    // Front texture — default flipY=true keeps jersey right-side up
    const fTex = loader.load("/harpia-front.PNG");
    fTex.colorSpace = THREE.SRGBColorSpace;
    fTex.anisotropy = 4;

    // Back texture — rotated 180° Y on the mesh means UV u is mirrored.
    // Compensate with repeat(-1,1) + offset(1,0) which maps u → 1-u.
    // wrapS=RepeatWrapping ensures negative repeat is supported.
    const bTex = loader.load("/harpia-back.PNG");
    bTex.colorSpace = THREE.SRGBColorSpace;
    bTex.anisotropy = 4;
    bTex.wrapS = THREE.RepeatWrapping;
    bTex.repeat.set(-1, 1);
    bTex.offset.set(1, 0);

    return {
      frontMat: new THREE.MeshBasicMaterial({ map: fTex }),
      backMat: new THREE.MeshBasicMaterial({ map: bTex }),
    };
  }, []);

  // Drag interaction via the WebGL canvas element
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    let resumeTimer: ReturnType<typeof setTimeout>;

    const onDown = (e: PointerEvent) => {
      ctrl.current.dragging = true;
      ctrl.current.lastX = e.clientX;
      ctrl.current.autoRotate = false;
      clearTimeout(resumeTimer);
      canvas.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!ctrl.current.dragging) return;
      ctrl.current.y += (e.clientX - ctrl.current.lastX) * 0.014;
      ctrl.current.lastX = e.clientX;
    };
    const onUp = () => {
      if (!ctrl.current.dragging) return;
      ctrl.current.dragging = false;
      canvas.style.cursor = "grab";
      resumeTimer = setTimeout(() => {
        ctrl.current.autoRotate = true;
      }, 2500);
    };

    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      clearTimeout(resumeTimer);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl, ctrl]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    const c = ctrl.current;
    if (!g) return;
    if (!c.dragging && c.autoRotate) c.y += delta * 0.38;
    g.rotation.y = c.y;
    floatT.current += delta;
    g.position.y = Math.sin(floatT.current * 0.85) * 0.06;
  });

  return (
    <group ref={groupRef}>
      {/* Front face */}
      <mesh material={frontMat} position={[0, 0, 0.022]}>
        <planeGeometry args={[2.0, 2.3]} />
      </mesh>
      {/* Back face — rotated 180° on Y; texture is pre-flipped to cancel mirror */}
      <mesh material={backMat} rotation-y={Math.PI} position={[0, 0, -0.022]}>
        <planeGeometry args={[2.0, 2.3]} />
      </mesh>
    </group>
  );
}

// ─── Canvas wrapper ────────────────────────────────────────────────────────
export default function Jersey3D() {
  const ctrl = useRef<Ctrl>({
    y: 0,
    dragging: false,
    lastX: 0,
    autoRotate: true,
  });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 44 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          // Explicit dark clear — prevents the default transparent/white flash
          gl.setClearColor(new THREE.Color("#111111"), 1);
        }}
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        {/* No lights needed: MeshBasicMaterial renders texture as-is.
            These subtle rims add a slight warmth/depth to the scene fog. */}
        <pointLight position={[3, 3, 4]} intensity={0.4} color="#C9A84C" />
        <pointLight position={[-3, -2, 3]} intensity={0.2} color="#0AAFAA" />
        <JerseyMesh ctrl={ctrl} />
      </Canvas>

      {/* Hint label */}
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
