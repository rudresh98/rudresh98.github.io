import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Activity, ArrowUpRight, Bot, Cloud, Code2, Database, Workflow, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { architectureLayers, projectVisuals, type ProjectVisual } from '@/lib/portfolio-visuals';
import type { Project } from '@/lib/portfolio';
import { Reveal } from './motion';

function Graph({visual}:{visual:ProjectVisual}) {
 const ref=useRef<SVGSVGElement>(null);const visible=useInView(ref,{amount:.3});const reduced=useReducedMotion();
 return <svg ref={ref} viewBox="0 0 560 320" role="img" aria-label={visual.title} className="architecture-svg"><defs><pattern id={`grid-${visual.title.replaceAll(' ','-')}`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" className="svg-grid"/></pattern></defs><rect width="560" height="320" fill={`url(#grid-${visual.title.replaceAll(' ','-')})`}/>
  {visual.edges.map((edge,i)=>{const from=visual.nodes.find(n=>n.id===edge.from),to=visual.nodes.find(n=>n.id===edge.to);if(!from||!to)return null;const x1=from.x+65,y1=from.y+27,x2=to.x+65,y2=to.y+27;const path=`M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`;
   return <g key={edge.from+edge.to}><path d={path} className="svg-edge"/><motion.path d={path} className="svg-flow" initial={false} animate={visible&&!reduced?{pathLength:[0,1],opacity:[0,.7,0]}:{pathLength:1,opacity:.4}} transition={{duration:3.6,delay:i*.3,repeat:Infinity,repeatDelay:2,ease:'easeInOut'}}/></g>;
  })}
  {visual.nodes.map(node=><g key={node.id} transform={`translate(${node.x} ${node.y})`}><rect width="140" height="58" rx="5" className={node.kind==='primary'?'svg-node-primary':'svg-node'}/><circle cx="15" cy="17" r="3" className={node.kind==='primary'?'svg-dot-inverse':'svg-dot'}/><text x="27" y="21" className={node.kind==='primary'?'svg-title-inverse':'svg-title'}>{node.label}</text><text x="14" y="43" className={node.kind==='primary'?'svg-detail-inverse':'svg-detail'}>{node.detail}</text></g>)}
 </svg>;
}

function Analytics() {
 return <div className="analytics-preview" role="img" aria-label="Illustrative telecommunications analytics workspace, without production data"><div className="analytics-sidebar"><Layers size={17}/><span/><span/><span/><span/></div><div className="analytics-main"><div className="analytics-top"><span>Network overview</span><span className="analytics-status">Highcharts <ArrowUpRight size={10}/></span></div><div className="analytics-key"><div><span>Traffic</span><strong>Network activity</strong></div><div><span>Workspace</span><strong>Microfrontends</strong></div></div><div className="analytics-chart"><div className="chart-caption">Illustrative activity profile <Activity size={13}/></div><svg viewBox="0 0 420 108" preserveAspectRatio="none" aria-hidden="true"><path className="chart-grid" d="M0 25H420 M0 55H420 M0 85H420"/><path className="chart-area" d="M0 88L30 72L60 78L90 48L120 62L150 29L180 38L210 21L240 45L270 33L300 48L330 18L360 30L390 11L420 19V108H0Z"/><path className="chart-line" d="M0 88L30 72L60 78L90 48L120 62L150 29L180 38L210 21L240 45L270 33L300 48L330 18L360 30L390 11L420 19"/></svg></div><div className="analytics-bottom"><span>Data APIs</span><span>Personalization</span><span>Modular UI</span></div></div></div>;
}

export function Architecture({project}:{project:Project}) {
 const visual=projectVisuals[project.id];if(!visual)return null;
 return <div className={`project-visual visual-${project.id}`}><div className="visual-caption"><span>Illustrative {visual.type==='analytics'?'interface':'architecture'}</span><span aria-hidden="true">{visual.type==='analytics'?'UI / 04':'SYSTEM MAP'}</span></div><div className="preview-canvas">{visual.type==='analytics'?<Analytics/>:<Graph visual={visual}/>}</div><div className="visual-footer"><span>{visual.title}</span><span className="visual-live" aria-hidden="true"><span/>ENGINEERING STUDY</span></div></div>;
}

const icons={code:Code2,workflow:Workflow,cloud:Cloud,bot:Bot,database:Database,activity:Activity};
export function ArchitectureFlow({compact=false}:{compact?:boolean}) {
 const [active,setActive]=useState(0);const layer=architectureLayers[active]??architectureLayers[0];const reduced=useReducedMotion();
 return <Reveal className={compact?'hero-system':'section architecture-section'}><div className="architecture-intro"><p className="eyebrow">Connected by design</p>{compact?<h2>One system.<br/><span className="text-primary">Many possibilities.</span></h2>:<><h2 className="section-heading">From architecture<br/><span className="text-muted-foreground">to intelligent products.</span></h2><p className="section-description">A connected engineering practice, from the first interaction to production insight.</p></>}</div><div className={`layer-flow ${compact?'layer-flow-compact':''}`} aria-label="Engineering layers">{architectureLayers.map((item,i)=>{const Icon=icons[item.icon];return <motion.div className="flow-item" key={item.id} initial={false} whileInView={reduced?{}:{opacity:[0,1],y:[14,0]}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:reduced?0:i*.07,ease:[.22,1,.36,1]}}><span className="flow-number" aria-hidden="true">0{i+1}</span><Button variant="ghost" className={`flow-node ${i===active?'flow-active':''}`} aria-pressed={i===active} onClick={()=>setActive(i)} onFocus={()=>setActive(i)} onMouseEnter={()=>setActive(i)} aria-describedby={i===active?`layer-description-${compact?'hero':'main'}`:undefined}><Icon size={compact?18:24}/><span>{item.label}</span></Button>{i<architectureLayers.length-1&&<span className="flow-connector" aria-hidden="true"/>}</motion.div>})}</div><div className="layer-description" id={`layer-description-${compact?'hero':'main'}`}><span className="text-primary">{layer.label}</span><p>{layer.description}</p></div>{compact&&<span className="system-caption">Full stack · Cloud · AI · Data</span>}</Reveal>;
}