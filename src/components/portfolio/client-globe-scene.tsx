import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html, Lightformer, useTexture } from '@react-three/drei';
import { BackSide, Euler, Group, Mesh, MeshBasicMaterial, Object3D, Quaternion, Vector3, SRGBColorSpace } from 'three';
import earth from '@/assets/earth-day.jpg';
import { clientCountries, countryPosition, type ClientCountry } from '@/lib/client-countries';

type Props = { selected: ClientCountry; running: boolean; visible: boolean; reduced: boolean; drag: React.MutableRefObject<number>; markerColor: string; ringColor: string; lightColor: string; onReady: () => void };
type MarkerProps = { country: ClientCountry; index: number; selected: boolean; reduced: boolean; color: string; ringColor: string; earthRef: React.RefObject<Object3D> };
const outward = new Vector3(0, 0, 1);
const tip = new Vector3();
const view = new Vector3();
// Pins stand on the surface normal; staggered heights keep neighbouring European heads apart,
// and a pin hides once its head would project outside the globe's silhouette, so heads never float beside it.
function CountryMarker({ country, index, selected, reduced, color, ringColor, earthRef }: MarkerProps) {
 const pin = useRef<Group>(null);
 const pulse = useRef<Mesh>(null);
 const pulseMaterial = useRef<MeshBasicMaterial>(null);
 const position = useMemo(() => countryPosition(country.latitude, country.longitude, 1), [country]);
 const orientation = useMemo(() => new Quaternion().setFromUnitVectors(outward, new Vector3(...position)), [position]);
 const height = .06 + (index % 3) * .015;
 const head = selected ? .036 : .026;
 useFrame(({ clock, camera }) => {
  if (pin.current) {
   const distance = camera.position.length();
   pin.current.localToWorld(tip.set(0, 0, height + head)).sub(camera.position);
   pin.current.visible = tip.dot(view.copy(camera.position).negate()) / (tip.length() * distance) > Math.sqrt(1 - (.96 / distance) ** 2);
  }
  if (!pulse.current || !pulseMaterial.current) return;
  const t = (clock.elapsedTime * .7) % 1;
  pulse.current.scale.setScalar(1 + t * 1.4);
  pulseMaterial.current.opacity = .7 * (1 - t);
 });
 return <group ref={pin} position={position} quaternion={orientation}>
  <mesh position-z={.004}><ringGeometry args={[.022, .032, 32]}/><meshBasicMaterial color={ringColor} transparent opacity={.9} toneMapped={false}/></mesh>
  <mesh position-z={.005}><circleGeometry args={[.022, 32]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
  {selected && !reduced && <mesh ref={pulse} position-z={.006}><ringGeometry args={[.026, .034, 32]}/><meshBasicMaterial ref={pulseMaterial} color={color} transparent depthWrite={false} toneMapped={false}/></mesh>}
  <mesh position-z={height / 2} rotation-x={Math.PI / 2}><cylinderGeometry args={[.004, .004, height, 8]}/><meshBasicMaterial color={ringColor} toneMapped={false}/></mesh>
  <mesh position-z={height}><sphereGeometry args={[head + .007, 20, 14]}/><meshBasicMaterial color={ringColor} side={BackSide} toneMapped={false}/></mesh>
  <mesh position-z={height}><sphereGeometry args={[head, 20, 14]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
  {selected && <Html position={[0, 0, height + head]} center occlude={[earthRef]} zIndexRange={[10, 0]}><span className="globe-pin-label">{country.name}</span></Html>}
 </group>;
}
function Earth({ selected, running, visible, reduced, drag, markerColor, ringColor, onReady }: Props) {
 const group = useRef<Group>(null);
 const globe = useRef<Mesh>(null!);
 const target = useRef<Quaternion | null>(null);
 const texture = useTexture(earth);
 texture.colorSpace = SRGBColorSpace;
 useEffect(() => { onReady(); }, [onReady]);
 const turn = useMemo(() => new Quaternion(), []);
 const axis = useMemo(() => new Vector3(0, 1, 0), []);
 useEffect(() => {
  const orientation = new Quaternion().setFromEuler(new Euler(selected.latitude * Math.PI / 180, -selected.longitude * Math.PI / 180 - Math.PI / 2, 0, 'XYZ'));
  target.current = orientation;
  if (reduced && group.current) { group.current.quaternion.copy(orientation); target.current = null; }
 }, [selected, reduced]);
 useFrame((_, rawDelta) => {
  if (!group.current || !visible) return;
  const dt = Math.min(rawDelta, .05);
  if (drag.current !== 0) {
   group.current.quaternion.premultiply(turn.setFromAxisAngle(axis, drag.current));
   drag.current = 0; target.current = null;
  } else if (target.current) {
   group.current.quaternion.slerp(target.current, 1 - Math.exp(-7 * dt));
   if (group.current.quaternion.angleTo(target.current) < .002) { group.current.quaternion.copy(target.current); target.current = null; }
  } else if (running && !reduced) group.current.quaternion.premultiply(turn.setFromAxisAngle(axis, dt * .065));
 });
 return <group ref={group}>
  <mesh ref={globe}><sphereGeometry args={[1, 64, 48]}/><meshStandardMaterial map={texture} roughness={.86} metalness={0}/></mesh>
  {clientCountries.map((country, index) => <CountryMarker key={country.code} country={country} index={index} selected={country.code === selected.code} reduced={reduced} color={markerColor} ringColor={ringColor} earthRef={globe}/>)}
 </group>;
}
export default function ClientGlobeScene(props: Props) {
 return <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.4], fov: 42 }} frameloop={props.visible ? 'always' : 'never'} gl={{ alpha: true, antialias: true }}>
  <ambientLight intensity={.9}/><directionalLight position={[-3, 4, 5]} intensity={2}/>
  <Environment resolution={64}><Lightformer intensity={.7} position={[0, 4, 2]} scale={[5, 5, 1]} color={props.lightColor}/></Environment>
  <Suspense fallback={null}><Earth {...props}/></Suspense>
 </Canvas>;
}
