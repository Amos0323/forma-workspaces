"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { cameraLimits, renderQuality, views, type ViewName } from "./config";
import { Office } from "./office";
import { lightingPresets, type InteriorConfig, type FurnitureId } from "./interior-config";
type Props = { config: InteriorConfig; registerCapture: (capture: (() => string | null) | null) => void; onSelect: (id: FurnitureId | null) => void; view: ViewName; revision: number; reduced: boolean; onReady: () => void; onFailure: () => void; onReset: () => void };
function CaptureBridge({ register }: { register: Props["registerCapture"] }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    register(() => {
      if (gl.getContext().isContextLost()) return null;
      // Render and read in the same task; no permanent preserveDrawingBuffer cost.
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    });
    return () => register(null);
  }, [gl, scene, camera, register]);
  return null;
}
function CameraRig({ view, revision, reduced, onReady, onFailure, onReset }: Props) {
  const { camera, gl, invalidate, size } = useThree();
  const commits = useRef(0);
  useEffect(() => { gl.domElement.setAttribute("data-scene-commits", String(++commits.current)); });
  const controls = useMemo(() => new OrbitControls(camera), [camera]);
  const destination = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const frames = useRef(0);
  const callbacks = useRef({ onReady, onFailure, onReset });
  useEffect(() => { callbacks.current = { onReady, onFailure, onReset }; }, [onReady, onFailure, onReset]);
  useEffect(() => {
    if (controls.domElement) controls.disconnect();
    controls.connect(gl.domElement);
    Object.assign(controls, cameraLimits, { enablePan: false, enableDamping: !reduced, dampingFactor: .09, minAzimuthAngle: -.1, maxAzimuthAngle: 1.5 });
    const canvas = gl.domElement;
    canvas.setAttribute("tabindex", "0");
    canvas.setAttribute("aria-label", "Interactive office. Arrow keys orbit, plus and minus zoom, Home resets.");
    canvas.setAttribute("role", "img");
    const change = () => invalidate();
    const start = () => { destination.current = null; };
    const lost = (event: Event) => { event.preventDefault(); callbacks.current.onFailure(); };
    const key = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "Home"].includes(event.key)) return;
      event.preventDefault();
      destination.current = null;
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === "ArrowLeft") spherical.theta -= .12;
      if (event.key === "ArrowRight") spherical.theta += .12;
      if (event.key === "ArrowUp") spherical.phi -= .08;
      if (event.key === "ArrowDown") spherical.phi += .08;
      if (event.key === "+" || event.key === "=") spherical.radius *= .9;
      if (event.key === "-") spherical.radius *= 1.1;
      if (event.key === "Home") {
        callbacks.current.onReset();
        controls.target.set(...views.Overview.target);
        spherical.set(size.width < 650 ? 32 : 24, .76, .65);
      }
      spherical.radius = THREE.MathUtils.clamp(spherical.radius, cameraLimits.minDistance, cameraLimits.maxDistance);
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, cameraLimits.minPolarAngle, cameraLimits.maxPolarAngle);
      spherical.theta = THREE.MathUtils.clamp(spherical.theta, -.1, 1.5);
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
      controls.update(); invalidate();
    };
    controls.addEventListener("change", change);
    controls.addEventListener("start", start);
    canvas.addEventListener("keydown", key);
    canvas.addEventListener("webglcontextlost", lost);
    callbacks.current.onReady();
    return () => {
      controls.removeEventListener("change", change); controls.removeEventListener("start", start);
      canvas.removeEventListener("keydown", key); canvas.removeEventListener("webglcontextlost", lost);
      controls.dispose();
    };
  }, [controls, camera, gl, invalidate, reduced, size.width]);
  useEffect(() => {
    const preset = views[view];
    const target = new THREE.Vector3(...preset.target);
    const position = target.clone().add(new THREE.Vector3().setFromSpherical(new THREE.Spherical(preset.distance * (size.width < 650 ? 1.3 : 1), .76, .65)));
    if (reduced || frames.current < 2) {
      controls.target.copy(target); camera.position.copy(position); controls.update();
      destination.current = null;
    } else destination.current = { position, target };
    gl.domElement.setAttribute("data-view", view);
    invalidate();
  }, [view, revision, reduced, controls, camera, gl, invalidate, size.width]);
  useFrame((_, delta) => {
    frames.current++;
    if (destination.current) {
      const blend = 1 - Math.exp(-7 * Math.min(delta, .05));
      camera.position.lerp(destination.current.position, blend);
      controls.target.lerp(destination.current.target, blend);
      if (camera.position.distanceTo(destination.current.position) < .005) {
        camera.position.copy(destination.current.position); controls.target.copy(destination.current.target);
        destination.current = null;
      }
      invalidate();
    }
    if (controls.update()) invalidate();
    Object.assign(gl.domElement.dataset, {
      frames: String(frames.current), calls: String(gl.info.render.calls),
      triangles: String(gl.info.render.triangles), geometries: String(gl.info.memory.geometries),
      textures: String(gl.info.memory.textures), cameraY: camera.position.y.toFixed(2),
      cameraPosition: camera.position.toArray().map(n => n.toFixed(2)).join(","),
    });
  });
  return null;
}
export default function ShowroomCanvas(props: Props) {
  const compact = typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches;
  const quality = renderQuality(compact);
  return <Canvas frameloop="demand" dpr={quality.dpr} shadows camera={{ position: [14, 18, 20], fov: 40, near: .1, far: 100 }}
    gl={{ antialias: !compact, powerPreference: "low-power", toneMapping: THREE.ACESFilmicToneMapping }}
    onCreated={({ gl }) => {
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      // Furniture and the sun position are fixed; colour/intensity changes reuse shadows.
      gl.shadowMap.autoUpdate = false;
      gl.shadowMap.needsUpdate = true;
      gl.toneMappingExposure = 1.15;
    }}>
    <Lighting config={props.config} shadowSize={quality.shadowSize}/>
    <Office config={props.config} onSelect={props.onSelect}/>
    <CameraRig {...props}/>
    <CaptureBridge register={props.registerCapture}/>
  </Canvas>;
}
function Lighting({ config, shadowSize }: { config: InteriorConfig; shadowSize: number }) {
  const preset = lightingPresets[config.lighting];
  const { gl, invalidate } = useThree();
  useEffect(() => {
    Object.assign(gl, { toneMappingExposure: preset.exposure });
    gl.domElement.setAttribute("data-lighting", config.lighting);
    gl.domElement.setAttribute("data-background", preset.background);
    invalidate();
  }, [preset, config.lighting, gl, invalidate]);
  return <>
    <color attach="background" args={[preset.background]}/>
    <ambientLight intensity={preset.ambient} color={preset.sky}/>
    <hemisphereLight args={[preset.sky, preset.ground, preset.hemisphere]}/>
    <directionalLight position={[3, 12, 6]} color={preset.sun} intensity={preset.intensity} castShadow shadow-mapSize={[shadowSize, shadowSize]} shadow-bias={-.0005} shadow-normalBias={.035} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12}/>
  </>;
}
