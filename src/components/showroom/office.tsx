"use client";
import { createContext, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { finishes, furniture, themes, type FurnitureId, type InteriorConfig } from "./interior-config";
type V = [number, number, number];
function createResources() { const box = new THREE.BoxGeometry(1, 1, 1); return ({
    outline: new THREE.EdgesGeometry(box),
    box, cylinder: new THREE.CylinderGeometry(1, 1, 1, 16), sphere: new THREE.SphereGeometry(1, 10, 8),
    materials: {
      plaster: new THREE.MeshStandardMaterial({ color: "#dcd6c6", roughness: .95 }),
      flooring: new THREE.MeshStandardMaterial({ color: "#b99569", roughness: .85 }),
      floorEdge: new THREE.MeshStandardMaterial({ color: "#947754", roughness: .9 }),
      accent: new THREE.MeshStandardMaterial({ color: "#343a33", roughness: .55, metalness: .25 }),
      highlight: new THREE.LineBasicMaterial({ color: "#71502d", depthTest: false, toneMapped: false }),
      timber: new THREE.MeshStandardMaterial({ color: "#ae8156", roughness: .75 }),
      edge: new THREE.MeshStandardMaterial({ color: "#775b41", roughness: .8 }),
      stone: new THREE.MeshStandardMaterial({ color: "#c9bda6", roughness: .92 }),
      olive: new THREE.MeshStandardMaterial({ color: "#697052", roughness: 1 }),
      fabric: new THREE.MeshStandardMaterial({ color: "#ded7c7", roughness: 1 }),
      dark: new THREE.MeshStandardMaterial({ color: "#343a33", roughness: .55 }),
      leaf: new THREE.MeshStandardMaterial({ color: "#526b40", roughness: .9 }),
      rug: new THREE.MeshStandardMaterial({ color: "#aaa38d", roughness: 1 }),
      glass: new THREE.MeshStandardMaterial({ color: "#c4e3da", transparent: true, opacity: .16, roughness: .1, depthWrite: false }),
      light: new THREE.MeshStandardMaterial({ color: "#fff2ce", emissive: "#ffe4a0", emissiveIntensity: 1 }),
    }
  }); }
type Resources = ReturnType<typeof createResources>;
const ResourceContext = createContext<Resources | null>(null);
function useResources() { const resources = useContext(ResourceContext); if (!resources) throw new Error("Office resource provider missing"); return resources; }
type Material = keyof Resources["materials"];
type Selection = { selected: FurnitureId | null; onSelect: (id: FurnitureId | null) => void };
const SelectionContext = createContext<Selection>({ selected: null, onSelect: () => {} });
export function Office({ config, onSelect }: { config: InteriorConfig; onSelect: Selection["onSelect"] }) {
  const resources = useMemo(() => createResources(), []);
  useEffect(() => () => { resources.outline.dispose(); resources.box.dispose(); resources.cylinder.dispose(); resources.sphere.dispose(); Object.values(resources.materials).forEach(m => m.dispose()); }, [resources]);
  const selection = useMemo(() => ({ selected: config.selectedFurniture, onSelect }), [config.selectedFurniture, onSelect]);
  return <ResourceContext.Provider value={resources}><Appearance config={config}/><SelectionContext.Provider value={selection}><OfficeGeometry/></SelectionContext.Provider></ResourceContext.Provider>;
}
const OfficeGeometry = memo(function OfficeGeometry() {
  return <group dispose={null}>
    <Box p={[0,-.22,0]} s={[14.4,.4,10.4]} m="stone"/>
    <Box p={[0,0,0]} s={[14,.06,10]} m="flooring"/>
    <RepeatedBoxes count={27} start={[-6.75,.05,0]} step={[.5,0,0]} scale={[.012,.005,10]} material="floorEdge"/>
    <Box p={[0,1.6,-5]} s={[14,3.2,.18]} m="plaster" shadow/>
    <Box p={[-7,1.6,0]} s={[.18,3.2,10]} m="plaster" shadow/>
    <Box p={[-6.86,.18,0]} s={[.12,.25,10]} m="stone"/>
    {/* Window rhythm and a restrained timber feature wall. */}
    <Box p={[3,1.9,-4.88]} s={[7,2,.035]} m="glass"/>
    {[-.5,1.25,3,4.75,6.5].map(x => <Box key={x} p={[x,1.9,-4.8]} s={[.05,2.2,.08]} m="accent"/>)}
    {[.8,3].map(y => <Box key={y} p={[3,y,-4.8]} s={[7,.05,.08]} m="accent"/>)}
    <RepeatedBoxes count={18} start={[-6.85,1.5,.5]} step={[0,0,.2]} scale={[.12,2.8,.07]} material="timber"/>
    {/* Glazed meeting room, open doorway towards the central circulation. */}
    <Box p={[-4.45,.06,-2.5]} s={[4.8,.04,4.5]} m="rug"/>
    <Box p={[-2,1.5,-2.85]} s={[.035,3,3.9]} m="glass"/>
    <Box p={[-4.45,1.5,-.45]} s={[4.8,3,.035]} m="glass"/>
    {[-6.8,-4.4,-2].map(x => <Box key={x} p={[x,1.5,-.45]} s={[.045,3,.055]} m="accent"/>)}
    <Box p={[-4.45,3,-.45]} s={[4.9,.06,.06]} m="accent"/>
    <Box p={[-2,3,-2.7]} s={[.06,.06,4.5]} m="accent"/>
    <Furniture id="meeting">
    <Box p={[-4.45,.8,-2.7]} s={[2.7,.12,1.3]} m="timber" shadow/>
    {[-5.3,-3.6].map(x => <Box key={x} p={[x,.4,-2.7]} s={[.15,.8,.8]} m="accent"/>)}
    </Furniture>
    {[-5.25,-4.45,-3.65].map(x => <group key={x}><Chair x={x} z={-1.65}/><Chair x={x} z={-3.7} rotation={Math.PI}/></group>)}
    {/* Reception */}
    <Furniture id="reception">
    <Box p={[-4.3,.58,2.9]} s={[3.3,1.16,.9]} m="timber" shadow/>
    <RepeatedBoxes count={15} start={[-5.8,.55,3.37]} step={[.21,0,0]} scale={[.05,1.05,.05]} material="edge"/>
    <Box p={[-4.3,1.2,2.9]} s={[3.5,.15,1.05]} m="stone" shadow/>
    </Furniture>
    <Box p={[-4.8,1.31,2.8]} s={[.5,.07,.35]} m="accent"/>
    <Chair x={-4.3} z={1.8} rotation={Math.PI}/>
    {/* Shared bench / task stations */}
    {[1.5,4.3].map(x => <group key={x}><Furniture id={x === 1.5 ? "workbench" : undefined}>
      <Box p={[x,.78,-2.4]} s={[2.5,.12,2.3]} shadow/>
      {[-3.2,-1.6].map(z => <Box key={z} p={[x,.38,z]} s={[2.2,.76,.07]} m="accent"/>)}
      </Furniture>
      {[-1,1].map(side => <group key={side}>
        <Box p={[x,1.1,-2.4+side*.25]} s={[.8,.47,.045]} m="dark"/>
        <Box p={[x,.86,-2.4+side*.65]} s={[.55,.035,.2]} m="dark"/>
        <Chair x={x} z={-2.4+side*1.6} rotation={side === -1 ? Math.PI : 0}/>
      </group>)}
      <Box p={[x,2.85,-2.4]} s={[2,.07,.15]} m="accent"/>
      <Box p={[x,2.8,-2.4]} s={[1.9,.02,.12]} m="light"/>
    </group>)}
    {/* Collaboration lounge */}
    <Box p={[3.1,.065,2.65]} s={[5.5,.05,3.5]} m="rug"/>
    <Furniture id="sofa">
    <Box p={[3.2,.38,3.8]} s={[3.5,.65,.85]} m="olive" shadow/>
    <Box p={[3.2,.9,4.1]} s={[3.5,.6,.2]} m="olive"/>
    {[1.5,4.9].map(x => <Box key={x} p={[x,.7,3.8]} s={[.2,.55,.9]} m="olive"/>)}
    </Furniture>
    <Cylinder p={[3.2,.36,2.35]} s={[1.05,.14,.65]}/>
    <Cylinder p={[3.2,.18,2.35]} s={[.48,.35,.3]} m="edge"/>
    <Box p={[3.3,.46,2.3]} s={[.45,.06,.3]} m="fabric"/>
    <Chair x={1} z={2} rotation={1.1}/><Chair x={5.5} z={2} rotation={-1.1}/>
    <Plant x={-6} z={4.2}/><Plant x={-6.1} z={-4.2} scale={.9}/><Plant x={6.2} z={-4} scale={1.3}/><Plant x={6} z={3.9}/>
    <Cylinder p={[.1,.35,.1]} s={[.45,.7,.45]}/><Plant x={.1} z={.1} scale={.8}/>
  </group>;
});

  function Box({ p, s, m = "timber", shadow = false }: { p: V; s: V; m?: Material; shadow?: boolean }) {
    const resources = useResources();
    return <mesh geometry={resources.box} material={resources.materials[m]} position={p} scale={s} castShadow={shadow} receiveShadow dispose={null}/>;
  }
  function Cylinder({ p, s, m = "stone" }: { p: V; s: V; m?: Material }) {
    const resources = useResources();
    return <mesh geometry={resources.cylinder} material={resources.materials[m]} position={p} scale={s} receiveShadow dispose={null}/>;
  }
  function Plant({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
    const resources = useResources();
    return <group position={[x, 0, z]} scale={scale}>
      <Cylinder p={[0, .32, 0]} s={[.3, .64, .3]}/><Cylinder p={[0, 1, 0]} s={[.035, 1.3, .035]} m="edge"/>
      {[0,1,2,3,4].map(i => <mesh key={i} geometry={resources.sphere} material={resources.materials.leaf} position={[Math.sin(i * 2.4) * .25, 1.2 + i * .16, Math.cos(i * 2.4) * .25]} scale={[.3,.48,.18]} rotation={[0,i, .4]} dispose={null}/>)}
    </group>;
  }
  function Chair({ x, z, rotation = 0, m = "fabric" }: { x: number; z: number; rotation?: number; m?: Material }) {
    return <group position={[x,0,z]} rotation={[0,rotation,0]}><Box p={[0,.48,0]} s={[.57,.15,.58]} m={m}/><Box p={[0,.83,.24]} s={[.57,.6,.12]} m={m}/><Cylinder p={[0,.23,0]} s={[.05,.45,.05]} m="accent"/><Box p={[0,.04,0]} s={[.5,.06,.45]} m="accent"/></group>;
  }
function RepeatedBoxes({ count, start, step, scale, material }: { count: number; start: V; step: V; scale: V; material: Material }) {
  const resources = useResources();
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => { const instance = mesh.current; return () => instance?.dispose(); }, []);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      matrix.compose(new THREE.Vector3(start[0] + step[0]*i, start[1] + step[1]*i, start[2] + step[2]*i), new THREE.Quaternion(), new THREE.Vector3(...scale));
      mesh.current.setMatrixAt(i, matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [count, start, step, scale]);
  return <instancedMesh ref={mesh} args={[resources.box, resources.materials[material], count]} receiveShadow dispose={null}/>;
}

function Appearance({ config }: { config: InteriorConfig }) {
  const resources = useResources();
  const { gl, invalidate } = useThree();
  useLayoutEffect(() => {
    const mapping = { timber: resources.materials.timber, flooring: resources.materials.flooring, upholstery: resources.materials.olive, accent: resources.materials.accent };
    for (const group of Object.keys(mapping) as (keyof typeof mapping)[]) {
      const finish = finishes[config.materials[group]], material = mapping[group];
      material.color.set(finish.colour);
      material.roughness = finish.roughness;
      material.metalness = finish.metalness;
    }
    const theme = themes[config.theme];
    resources.materials.plaster.color.set(theme.plaster);
    resources.materials.stone.color.set(theme.stone);
    resources.materials.fabric.color.set(theme.fabric);
    resources.materials.rug.color.set(theme.rug);
    resources.materials.edge.color.copy(resources.materials.timber.color).multiplyScalar(.65);
    resources.materials.floorEdge.color.copy(resources.materials.flooring.color).multiplyScalar(.8);
    gl.domElement.setAttribute("data-materials", JSON.stringify(Object.fromEntries(Object.entries(mapping).map(([key, material]) => [key, "#" + material.color.getHexString()]))));
    gl.domElement.setAttribute("data-resource-ids", [resources.box.uuid, resources.cylinder.uuid, resources.sphere.uuid].join(","));
    invalidate();
  }, [config.materials, config.theme, resources, gl, invalidate]);
  return null;
}
function Furniture({ id, children }: { id?: FurnitureId; children: ReactNode }) {
  const resources = useResources();
  const selection = useContext(SelectionContext);
  const { gl, invalidate } = useThree();
  useEffect(() => {
    gl.domElement.setAttribute("data-selected-furniture", selection.selected ?? "");
    invalidate();
  }, [selection.selected, gl, invalidate]);
  if (!id) return <group>{children}</group>;
  const item = furniture[id];
  return <group name={id} onClick={event => {
    if (event.delta > 5) return;
    event.stopPropagation();
    selection.onSelect(id);
  }}>
    {children}
    {selection.selected === id && <lineSegments geometry={resources.outline} material={resources.materials.highlight}
      position={[...item.position]} scale={[...item.scale]} renderOrder={10} dispose={null}/>}
  </group>;
}
