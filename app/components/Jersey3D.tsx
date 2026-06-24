"use client";

import { useEffect, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { formatFounderNumber } from "../lib/founderNumber";

// ── Founder patch ──────────────────────────────────────────────────────────────
// The GLB ships a Founder Edition patch (material "织标" → texture image 6) with a
// baked "No. 0001 / 1000". We override only the number at runtime: a cleaned base
// texture (number erased) is composited with the dynamic number on a 2D canvas and
// applied as a CanvasTexture. One GLB, one texture — no per-number assets.

// Cleaned patch texture (the baked "0001" removed). Same layout/resolution space
// as the original image, so existing UVs map 1:1.
const PATCH_BASE_URL = "/models/founder-patch-base.png";

// Normalized location of the number on the patch (measured from the original
// texture: white "0001" centered at these coords).
const NUM_BOX = { cx: 0.4207, cy: 0.4385, hNorm: 0.0861, wNorm: 0.2246 };

// Names that identify the founder patch mesh/material across possible exports.
const PATCH_HINTS = ["织标", "graphicstyle_6", "graphic_6", "founder", "patch", "label"];

// Module-level cache so route changes don't refetch the base image.
let basePromise: Promise<HTMLImageElement> | null = null;
function loadPatchBase(): Promise<HTMLImageElement> {
  if (!basePromise) {
    basePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = PATCH_BASE_URL;
    });
  }
  return basePromise;
}

function drawPatch(ctx: CanvasRenderingContext2D, img: HTMLImageElement, display: string) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  if (!display) return; // blank number area — never invents a placeholder

  let fontSize = (NUM_BOX.hNorm * H) / 0.72; // compensate cap-height vs font-size
  const font = (px: number) => `700 ${px}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font(fontSize);

  // Keep within the original number footprint (handles narrow/wide digit sets).
  const maxW = NUM_BOX.wNorm * W * 1.18;
  const measured = ctx.measureText(display).width;
  if (measured > maxW) {
    fontSize = (fontSize * maxW) / measured;
    ctx.font = font(fontSize);
  }

  ctx.fillText(display, NUM_BOX.cx * W, NUM_BOX.cy * H);
}

function JerseyGLB({ founderNumber }: { founderNumber?: number | string | null }) {
  const { scene } = useGLTF("/models/Jersy-3D.glb");
  const { gl: renderer } = useThree();

  // undefined → preview/demo default ("0001"); explicit null/empty → blank.
  const display = founderNumber === undefined ? "0001" : formatFounderNumber(founderNumber);

  // Texture sharpening — unchanged from the original viewer.
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

  // Dynamic founder number on the patch.
  useEffect(() => {
    let cancelled = false;
    let createdTex: THREE.CanvasTexture | null = null;

    // Locate the founder patch material by name (mesh or material).
    let patchMat: THREE.MeshStandardMaterial | null = null;
    scene.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh || patchMat) return;
      const objName = (mesh.name || "").toLowerCase();
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        const matName = ((mat as THREE.Material)?.name || "").toLowerCase();
        if (PATCH_HINTS.some((h) => matName.includes(h) || objName.includes(h))) {
          patchMat = mat as THREE.MeshStandardMaterial;
          break;
        }
      }
    });

    if (!patchMat) {
      console.warn("[Jersey3D] Founder patch material not found — keeping baked texture.");
      return;
    }

    // TS: patchMat is narrowed away inside the async closure below.
    const mat: THREE.MeshStandardMaterial = patchMat;
    const origMap = mat.map ?? null;

    loadPatchBase()
      .then((img) => {
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        drawPatch(ctx, img, display);

        const tex = new THREE.CanvasTexture(canvas);
        // Match the original texture's sampling so UVs/orientation line up exactly.
        tex.colorSpace = origMap?.colorSpace ?? THREE.SRGBColorSpace;
        tex.flipY = origMap ? origMap.flipY : false;
        if (origMap) {
          tex.wrapS = origMap.wrapS;
          tex.wrapT = origMap.wrapT;
          tex.offset.copy(origMap.offset);
          tex.repeat.copy(origMap.repeat);
          tex.center.copy(origMap.center);
          tex.rotation = origMap.rotation;
        }
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;

        mat.map = tex;
        mat.needsUpdate = true;
        createdTex = tex;
      })
      .catch((e) => {
        // Network/CSP failure → keep the baked texture rather than breaking the model.
        console.warn("[Jersey3D] Founder patch base failed to load:", e);
      });

    return () => {
      cancelled = true;
      if (createdTex) {
        mat.map = origMap;
        mat.needsUpdate = true;
        createdTex.dispose();
      }
    };
  }, [scene, renderer, display]);

  return (
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

export default function Jersey3D({ founderNumber }: { founderNumber?: number | string | null }) {
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
          <JerseyGLB founderNumber={founderNumber} />
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
