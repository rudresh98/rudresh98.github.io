import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { ClientOnly } from '@tanstack/react-router';
import { useInView } from 'motion/react';
import { ArrowUpRight, MapPin, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clientCountries } from '@/lib/client-countries';
import fallback from '@/assets/earth-fallback.webp';
import { Reveal } from './motion';
const Scene = lazy(() => import('./client-globe-scene'));
function StaticEarth() { return <img className="globe-fallback" src={fallback} alt="Earth showing the continents" width={640} height={640} loading="lazy" decoding="async"/>; }
class GlobeBoundary extends Component<{children: ReactNode; onError: () => void}, {failed: boolean}> {
 override state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 override componentDidCatch() { this.props.onError(); }
 override render() { return this.state.failed ? <StaticEarth/> : this.props.children; }
}
export function ClientGlobe() {
 const ref = useRef<HTMLElement>(null);
 const near = useInView(ref, { margin: '200px', once: true });
 const inView = useInView(ref, { amount: .1 });
 const [reduced, setReduced] = useState(false);
 const [selected, setSelected] = useState<(typeof clientCountries)[number]>(clientCountries[3]);
 const [paused, setPaused] = useState(false);
 const [tabVisible, setTabVisible] = useState(true);
 const [supported, setSupported] = useState(false);
 const [ready, setReady] = useState(false);
 const [failed, setFailed] = useState(false);
 const [colors, setColors] = useState({ marker: '', ring: '', light: '' });
 const drag = useRef(0);
 const pointer = useRef<{id: number; x: number} | null>(null);
 useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionPreference = () => setReduced(media.matches);
  motionPreference(); media.addEventListener('change', motionPreference);
  const canvas = document.createElement('canvas');
  setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
  const sync = () => { const style = getComputedStyle(document.documentElement); setColors({ marker: style.getPropertyValue('--globe-marker').trim(), ring: style.getPropertyValue('--globe-marker-ring').trim(), light: style.getPropertyValue('--globe-light').trim() }); };
  sync(); const observer = new MutationObserver(sync); observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  const visibility = () => setTabVisible(!document.hidden);
  visibility(); document.addEventListener('visibilitychange', visibility);
  return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motionPreference); };
 }, []);
 return <section ref={ref} className="client-globe-section container-shell" aria-labelledby="client-globe-heading">
  <Reveal className="client-globe-intro"><p className="eyebrow">International collaboration</p><h2 id="client-globe-heading" className="section-heading">Clients across<br/><span className="text-muted-foreground">the globe.</span></h2><p className="section-description mt-5">Working with clients across eight countries, including nine cities in India.</p>
   <div className="client-countries" aria-label="Client countries">{clientCountries.map(country => <Button key={country.code} variant="ghost" aria-pressed={selected.code === country.code} onClick={() => setSelected(country)} className="client-country"><MapPin size={15} aria-hidden="true"/><span>{country.name}</span><ArrowUpRight size={14} aria-hidden="true"/></Button>)}</div>
  </Reveal>
  <div className="client-globe-display">
   <div className="client-globe-canvas" role="img" aria-label={`Earth with client country markers; ${selected.name} selected`}
    onPointerDown={event => { if (event.pointerType === 'mouse') event.preventDefault(); pointer.current = { id: event.pointerId, x: event.clientX }; event.currentTarget.setPointerCapture(event.pointerId); }}
    onPointerMove={event => { if (pointer.current?.id !== event.pointerId) return; drag.current += (event.clientX - pointer.current.x) * .006; pointer.current.x = event.clientX; }}
    onPointerUp={() => { pointer.current = null; }} onPointerCancel={() => { pointer.current = null; }}>
    {!ready && !failed && <StaticEarth/>}
    <ClientOnly fallback={null}>{near && supported && colors.marker ? <GlobeBoundary onError={() => setFailed(true)}><Suspense fallback={null}><Scene selected={selected} running={!paused && pointer.current === null} visible={inView && tabVisible} reduced={reduced} drag={drag} markerColor={colors.marker} ringColor={colors.ring} lightColor={colors.light} onReady={() => setReady(true)}/></Suspense></GlobeBoundary> : null}</ClientOnly>
   </div>
   <div className="globe-caption"><span><i aria-hidden="true"/>{selected.name}</span><Button variant="ghost" size="icon" aria-label={paused ? 'Resume globe rotation' : 'Pause globe rotation'} disabled={reduced || !supported || failed || !ready} onClick={() => setPaused(p => !p)} title={paused ? 'Resume rotation' : 'Pause rotation'}>{paused || reduced ? <Play size={15}/> : <Pause size={15}/>}</Button></div>
   <p className="globe-credit">Earth imagery: NASA Earth Observatory</p>
  </div>
 </section>;
}