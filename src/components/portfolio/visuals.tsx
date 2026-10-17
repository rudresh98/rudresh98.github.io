import { useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Activity, Bot, Cloud, Code2, Database, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { architectureLayers, projectVisuals, type GraphVisual, type ProjectVisual } from '@/lib/portfolio-visuals';
import type { Project } from '@/lib/portfolio';
import { Reveal } from './motion';
import { SystemMap } from './system-map';

function Graph({visual}:{visual:GraphVisual}) {
 const ref=useRef<SVGSVGElement>(null);const visible=useInView(ref,{amount:.3});const reduced=useReducedMotion();
 return <svg ref={ref} viewBox="0 0 560 320" role="img" aria-label={visual.title} className="architecture-svg"><defs><pattern id={`grid-${visual.title.replaceAll(' ','-')}`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" className="svg-grid"/></pattern></defs><rect width="560" height="320" fill={`url(#grid-${visual.title.replaceAll(' ','-')})`}/>
  {visual.edges.map((edge,i)=>{const from=visual.nodes.find(n=>n.id===edge.from),to=visual.nodes.find(n=>n.id===edge.to);if(!from||!to)return null;const x1=from.x+65,y1=from.y+27,x2=to.x+65,y2=to.y+27;const path=`M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`;
   return <g key={edge.from+edge.to}><path d={path} className="svg-edge"/><motion.path d={path} className="svg-flow" initial={false} animate={visible&&!reduced?{pathLength:[0,1],opacity:[0,.7,0]}:{pathLength:1,opacity:.4}} transition={{duration:3.6,delay:i*.3,repeat:Infinity,repeatDelay:2,ease:'easeInOut'}}/></g>;
  })}
  {visual.nodes.map(node=><g key={node.id} transform={`translate(${node.x} ${node.y})`}><rect width="140" height="58" rx="5" className={node.kind==='primary'?'svg-node-primary':'svg-node'}/><circle cx="15" cy="17" r="3" className={node.kind==='primary'?'svg-dot-inverse':'svg-dot'}/><text x="27" y="21" className={node.kind==='primary'?'svg-title-inverse':'svg-title'}>{node.label}</text><text x="14" y="43" className={node.kind==='primary'?'svg-detail-inverse':'svg-detail'}>{node.detail}</text></g>)}
 </svg>;
}

export function Architecture({project,detail=false,visual:override}:{project:Project;detail?:boolean;visual?:ProjectVisual}) {
 const visual=override??projectVisuals[project.id];if(!visual)return null;
 const frame=(canvas:ReactNode)=><div className={`project-visual visual-${project.id}${visual.type==='system'?' is-system':''}`}><div className="visual-caption"><span>Illustrative architecture</span><span aria-hidden="true">SYSTEM MAP</span></div><div className="preview-canvas">{canvas}</div><div className="visual-footer"><span>{visual.title}</span><span className="visual-live" aria-hidden="true"><span/>ENGINEERING STUDY</span></div></div>;
 if(visual.type==='system')return <SystemMap visual={visual} detail={detail} frame={frame}/>;
 return frame(<Graph visual={visual}/>);
}

const icons={code:Code2,workflow:Workflow,cloud:Cloud,bot:Bot,database:Database,activity:Activity};
export function ArchitectureFlow({compact=false}:{compact?:boolean}) {
 const [active,setActive]=useState(0);const layer=architectureLayers[active]??architectureLayers[0];const reduced=useReducedMotion();
 return <Reveal className={compact?'hero-system':'section architecture-section'}><div className="architecture-intro"><p className="eyebrow">Connected by design</p>{compact?<h2>One system.<br/><span className="text-primary">Many possibilities.</span></h2>:<><h2 className="section-heading">From architecture<br/><span className="text-muted-foreground">to intelligent products.</span></h2><p className="section-description">A connected engineering practice, from the first interaction to production insight.</p></>}</div><div className={`layer-flow ${compact?'layer-flow-compact':''}`} aria-label="Engineering layers">{architectureLayers.map((item,i)=>{const Icon=icons[item.icon];return <motion.div className="flow-item" key={item.id} initial={false} whileInView={reduced?{}:{opacity:[0,1],y:[14,0]}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:reduced?0:i*.07,ease:[.22,1,.36,1]}}><span className="flow-number" aria-hidden="true">0{i+1}</span><Button variant="ghost" className={`flow-node ${i===active?'flow-active':''}`} aria-pressed={i===active} onClick={()=>setActive(i)} onFocus={()=>setActive(i)} onMouseEnter={()=>setActive(i)} aria-describedby={i===active?`layer-description-${compact?'hero':'main'}`:undefined}><Icon size={compact?18:24}/><span>{item.label}</span></Button>{i<architectureLayers.length-1&&<span className="flow-connector" aria-hidden="true"/>}</motion.div>})}</div><div className="layer-description" id={`layer-description-${compact?'hero':'main'}`}><span className="text-primary">{layer.label}</span><p>{layer.description}</p></div>{compact&&<span className="system-caption">Full stack · Cloud · AI · Data</span>}</Reveal>;
}