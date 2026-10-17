import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { edgeKey, type NodeSide, type Point, type SystemEdge, type SystemNode, type SystemVisual } from '@/lib/portfolio-visuals';

const STEP_MS = 2400;
const normal: Record<NodeSide, Point> = { l:{x:-1,y:0}, r:{x:1,y:0}, t:{x:0,y:-1}, b:{x:0,y:1} };
const size = (n: SystemNode) => ({ w: n.width ?? 120, h: n.height ?? 44 });
function anchor(n: SystemNode, side: NodeSide): Point {
 const {w,h}=size(n);
 return side==='l'?{x:n.x,y:n.y+h/2}:side==='r'?{x:n.x+w,y:n.y+h/2}:side==='t'?{x:n.x+w/2,y:n.y}:{x:n.x+w/2,y:n.y+h};
}
// Cubic curve leaving and entering along each side's normal; data may override with an explicit path.
function geometry(edge: SystemEdge, from: SystemNode, to: SystemNode) {
 const forward=to.x>=from.x, fs=edge.fromSide??(forward?'r':'l'), ts=edge.toSide??(forward?'l':'r'), a=anchor(from,fs), b=anchor(to,ts);
 const k=Math.max(14,(fs==='l'||fs==='r'?Math.abs(b.x-a.x):Math.abs(b.y-a.y))/2);
 const c1={x:a.x+normal[fs].x*k,y:a.y+normal[fs].y*k}, c2={x:b.x+normal[ts].x*k,y:b.y+normal[ts].y*k};
 const mid={x:(a.x+3*c1.x+3*c2.x+b.x)/8,y:(a.y+3*c1.y+3*c2.y+b.y)/8};
 return { d: edge.d ?? `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`, label: edge.labelAt ?? mid };
}

export function SystemMap({visual,detail=false,frame}:{visual:SystemVisual;detail?:boolean;frame:(canvas:ReactNode)=>ReactNode}) {
 const ref=useRef<SVGSVGElement>(null);const visible=useInView(ref,{amount:.3});const reduced=useReducedMotion();
 const uid=`sys${useId().replace(/[^a-zA-Z0-9]/g,'')}`;
 const [step,setStep]=useState(0);const [hold,setHold]=useState<'hover'|'click'|null>(null);
 const animate=visible&&!reduced;
 useEffect(()=>{if(!animate||hold)return;const t=setInterval(()=>setStep(s=>(s+1)%visual.steps.length),STEP_MS);return()=>clearInterval(t)},[animate,hold,visual.steps.length]);
 const current=visual.steps[step]??visual.steps[0];const activeNodes=new Set(current?.nodes);
 const nodes=new Map(visual.nodes.map(n=>[n.id,n]));
 const edges=visual.edges.flatMap(e=>{const from=nodes.get(e.from),to=nodes.get(e.to);return from&&to?[{key:edgeKey(e),edge:e,id:`${uid}-${edgeKey(e).replace(/[^a-zA-Z0-9]/g,'-')}`,...geometry(e,from,to)}]:[]});
 const lit=edges.filter(e=>current?.edges.includes(e.key));
 const b=visual.boundary;
 const pick=(i:number,mode:'hover'|'click')=>{setStep(i);setHold(h=>mode==='click'&&h==='click'&&i===step?null:h==='click'?'click':mode)};
 const svg=<div className="system-scroll"><svg ref={ref} viewBox={`0 0 ${visual.width} ${visual.height}`} role="img" aria-label={`${visual.title}: illustrative system map`} className={`architecture-svg system-svg${animate?' is-live':''}`}>
  <defs><pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" className="svg-grid"/></pattern></defs>
  <rect width={visual.width} height={visual.height} fill={`url(#${uid}-grid)`}/>
  {visual.lanes.map(l=><g key={l.id}><rect x={l.x} y={0} width={l.width} height={visual.height} rx={6} className="svg-lane"/><text x={l.x+8} y={14} className="svg-lane-label">{l.label}</text></g>)}
  <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={10} className="svg-boundary"/>
  <line x1={b.x} x2={b.x+b.width} y1={b.railY} y2={b.railY} className="svg-rail"/>
  <rect x={b.x+10} y={b.y-6} width={64} height={12} rx={3} className="svg-boundary-tab"/><text x={b.x+42} y={b.y+3} textAnchor="middle" className="svg-boundary-label">{b.label}</text>
  <text x={b.x+b.width-10} y={b.railY+42} textAnchor="end" className="svg-lane-label">{b.railLabel}</text>
  {edges.map(e=><path key={e.key} id={e.id} d={e.d} className={`svg-edge svg-edge-${e.edge.kind??'request'}`}/>)}
  {lit.map(e=><motion.path key={`${current?.id}-${e.key}`} d={e.d} className="svg-flow" initial={animate?{pathLength:0,opacity:0}:false} animate={{pathLength:1,opacity:.9}} transition={{duration:.7,ease:'easeInOut'}}/>)}
  {detail&&edges.filter(e=>e.edge.label).map(e=><text key={e.key} x={e.label.x} y={e.label.y} textAnchor="middle" className="svg-edge-label">{e.edge.label}</text>)}
  {animate&&lit.flatMap((e,i)=>[0,1].map(j=>{const reverse=current?.reverse?.includes(e.key)!==(e.edge.duplex===true&&j===1),timing={dur:'1.4s',begin:`${i*.15+j*.7}s`,repeatCount:'indefinite'};
   return <circle key={`${current?.id}-${e.key}-${j}`} r={3.2} opacity={0} className="svg-packet"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" {...timing}/><animateMotion {...timing} {...(reverse?{keyPoints:'1;0',keyTimes:'0;1',calcMode:'linear'}:{})}><mpath href={`#${e.id}`}/></animateMotion></circle>}))}
  {visual.nodes.map(n=>{const {w,h}=size(n),primary=n.kind==='primary',on=activeNodes.has(n.id),lines=detail?(n.detail??'').split('\n').filter(Boolean):[];
   return <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
    {on&&<motion.rect key={current?.id} x={-4} y={-4} width={w+8} height={h+8} rx={8} className="svg-pulse" initial={false} animate={animate?{opacity:[.75,0],scale:[1,1.05]}:{opacity:.6}} transition={animate?{duration:1.4,repeat:Infinity,ease:'easeOut'}:{duration:0}} style={{transformBox:'fill-box',transformOrigin:'center'}}/>}
    <rect width={w} height={h} rx={5} className={`${primary?'svg-node-primary':'svg-node'}${on?' svg-node-on':''}`}/>
    <circle cx={14} cy={detail?17:h/2} r={3} className={primary?'svg-dot-inverse':'svg-dot'}/>
    <text x={detail?25:24} y={detail?21:h/2+4.5} className={`${primary?'svg-title-inverse':'svg-title'}${detail?'':' svg-title-compact'}`}>{detail?n.label:n.short??n.label}</text>
    {lines.map((line,i)=><text key={line} x={13} y={36+i*12} className={primary?'svg-detail-inverse':'svg-detail'}>{line}</text>)}
   </g>})}
 </svg></div>;
 if(!detail)return frame(svg);
 return <>{frame(svg)}<div className="system-steps-wrap"><ol className="system-steps" aria-label={visual.journey} onMouseLeave={()=>setHold(h=>h==='hover'?null:h)} onBlur={ev=>{if(!ev.currentTarget.contains(ev.relatedTarget))setHold(h=>h==='hover'?null:h)}}>{visual.steps.map((s,i)=><li key={s.id}><button type="button" className="system-step" aria-current={i===step?'step':undefined} aria-pressed={hold==='click'&&i===step} onClick={()=>pick(i,'click')} onMouseEnter={()=>pick(i,'hover')} onFocus={()=>pick(i,'hover')}><span className="system-step-index">{String(i+1).padStart(2,'0')}</span><span className="system-step-label">{s.label}</span><span className="system-step-detail">{s.detail}</span></button></li>)}</ol><p className="sr-only" aria-live="polite">{hold&&current?`Step ${step+1}, ${current.label}: ${current.detail}`:''}</p></div></>;
}
