import { Fragment, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Activity, ArrowDown, ArrowUpRight, Bot, Cloud, Code2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getProject, projects } from '@/lib/portfolio';
import { capabilities, ecosystemFlows, featuredAreas, filterSkills, getSkill, groupLabel, skillFilters, skillGroups, skills, skillsForProject, type EcosystemFlow, type FeaturedArea, type Skill, type SkillFilter } from '@/lib/skills';
import { getSkillIcon } from '@/lib/skill-icons';
import { skillInformation } from '@/lib/skill-information';
import { Reveal } from './motion';

const ease = [.22, 1, .36, 1] as const;
const areaIcons = { code: Code2, cloud: Cloud, bot: Bot, activity: Activity };
const resolveSkills = (ids: string[]) => ids.map(getSkill).filter((skill): skill is Skill => Boolean(skill));
const uniqueProjects = (ids: string[]) => [...new Set(resolveSkills(ids).flatMap(skill => skill.projects))];

// One page state: featured cards choose the explorer filter, then hand focus to it.
export function SkillsHub() {
 const [filter, setFilter] = useState<SkillFilter>('all');
 const explorerHeading = useRef<HTMLHeadingElement>(null);
 const reduced = useReducedMotion();
 const explore = (next: SkillFilter) => {
  setFilter(next);
  const heading = explorerHeading.current;
  heading?.scrollIntoView?.({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  heading?.focus({ preventScroll: true });
 };
 return <>
  <SkillsIntro/>
  <FeaturedAreas onExplore={explore}/>
  <SkillsExplorer filter={filter} onFilter={setFilter} headingRef={explorerHeading}/>
  <Capabilities/>
  <Ecosystem/>
  <SkillProof/>
 </>;
}

// Entrance motion lives in CSS so the heading animates from the first prerendered paint.
function SkillsIntro() {
 const stats = [
  { value: skills.length, label: 'Technologies & practices' },
  { value: skillGroups.length, label: 'Engineering disciplines' },
  { value: projects.length, label: 'Case studies as proof' },
 ];
 const words = ['My', 'Engineering', 'Toolkit'];
 return <header className="skills-intro">
  <div>
   <p className="eyebrow skills-rise">Technical expertise</p>
   <h1 className="skills-title">{words.map((word, i) => <Fragment key={word}>{i > 0 && ' '}<span className="skills-word"><span style={{ '--i': i } as CSSProperties}>{word}{i === words.length - 1 && <span className="text-primary">.</span>}</span></span></Fragment>)}</h1>
   <p className="section-description skills-rise" style={{ '--d': '320ms' } as CSSProperties}>Technologies, tools, and engineering practices I use to build scalable applications, cloud-native platforms, and intelligent AI-powered systems.</p>
  </div>
  <ul className="skills-stats skills-rise" style={{ '--d': '440ms' } as CSSProperties} aria-label="Toolkit at a glance">
   {stats.map(stat => <li key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></li>)}
  </ul>
 </header>;
}

function FeaturedAreas({ onExplore }: { onExplore: (filter: SkillFilter) => void }) {
 return <section className="section" aria-labelledby="featured-title">
  <Reveal><p className="eyebrow">Core disciplines</p><h2 id="featured-title" className="section-heading">Four disciplines.<br/><span className="text-muted-foreground">One connected practice.</span></h2></Reveal>
  <div className="featured-grid">{featuredAreas.map((area, i) => <Reveal key={area.id} delay={i * .08} className="featured-cell"><FeaturedCard area={area} index={i} onExplore={onExplore}/></Reveal>)}</div>
 </section>;
}

function FeaturedCard({ area, index, onExplore }: { area: FeaturedArea; index: number; onExplore: (filter: SkillFilter) => void }) {
 const Icon = areaIcons[area.icon];
 const proof = uniqueProjects(area.skills).length;
 return <article className={`featured-card ${area.id === 'genai' ? 'featured-card-accent' : ''}`} aria-labelledby={`featured-${area.id}`}>
  <span className="featured-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
  <span className="featured-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8}/></span>
  <div><h3 id={`featured-${area.id}`}>{area.title}</h3><p className="featured-description">{area.description}</p></div>
  <SkillChips ids={area.skills} label={`${area.title} technologies`}/>
  <div className="featured-footer">
   <span className="featured-proof">{proof > 0 ? `Proven in ${proof} case ${proof === 1 ? 'study' : 'studies'}` : 'Professional toolkit'}</span>
   <div className="featured-actions">{area.filters.map(filter => <Button key={filter} variant="ghost" className="featured-explore" onClick={() => onExplore(filter)}>Explore {groupLabel(filter)}<ArrowDown aria-hidden="true"/></Button>)}</div>
  </div>
 </article>;
}

function SkillChips({ ids, label }: { ids: string[]; label: string }) {
 return <ul className="skill-chips" aria-label={label}>{resolveSkills(ids).map(skill => {
  const Icon = getSkillIcon(skill.id);
  return <li key={skill.id}><Icon aria-hidden="true" strokeWidth={1.8}/>{skill.name}</li>;
 })}</ul>;
}

function SkillsExplorer({ filter, onFilter, headingRef }: { filter: SkillFilter; onFilter: (filter: SkillFilter) => void; headingRef: RefObject<HTMLHeadingElement | null> }) {
 const reduced = useReducedMotion();
 const [info, setInfo] = useState<string | null>(null);
 const shown = filterSkills(filter);
 const active = skillFilters.find(item => item.id === filter)?.label ?? 'All Skills';
 return <section className="section skills-block" aria-labelledby="explorer-title">
  <Reveal><p className="eyebrow">Skills explorer</p><h2 id="explorer-title" ref={headingRef} tabIndex={-1} className="section-heading explorer-heading">Every tool, <span className="text-muted-foreground">in context.</span></h2><p className="section-description">Filter by discipline. Each entry explains how I use the technology and links to the case studies where it shipped.</p></Reveal>
  <div className="skill-filters" role="group" aria-label="Skill categories">
   {skillFilters.map(item => <Button key={item.id} variant="ghost" className="skill-filter" aria-pressed={filter === item.id} onClick={() => onFilter(item.id)}>
    {filter === item.id && <motion.span layoutId="skill-filter-pill" className="skill-filter-pill" transition={{ duration: reduced ? 0 : .3, ease }} aria-hidden="true"/>}
    {item.label}<span className="skill-filter-count" aria-hidden="true">{filterSkills(item.id).length}</span>
   </Button>)}
  </div>
  <p className="sr-only" role="status">{shown.length} skills shown in {active}</p>
  <TooltipProvider delayDuration={180} skipDelayDuration={80}>
   <motion.ul layout={!reduced} className="explorer-grid">
    <AnimatePresence initial={false} mode="popLayout">
     {shown.map(skill => <motion.li key={skill.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : .97 }} transition={{ duration: reduced ? 0 : .3, ease }}>
      <SkillCard skill={skill} showGroup={filter === 'all'} infoOpen={info === skill.id} onInfo={open => setInfo(current => open ? skill.id : current === skill.id ? null : current)}/>
     </motion.li>)}
    </AnimatePresence>
   </motion.ul>
  </TooltipProvider>
 </section>;
}

function SkillCard({ skill, showGroup, infoOpen, onInfo }: { skill: Skill; showGroup: boolean; infoOpen: boolean; onInfo: (open: boolean) => void }) {
 const Icon = getSkillIcon(skill.id);
 return <article className="skill-card" aria-labelledby={`skill-${skill.id}`}>
  <div className="skill-card-top">
   <span className="skill-card-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.8}/></span>
   <div className="min-w-0"><h3 id={`skill-${skill.id}`}>{skill.name}</h3>{showGroup && <p className="skill-card-group">{groupLabel(skill.group)}</p>}</div>
   <Tooltip open={infoOpen} onOpenChange={onInfo}>
    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="skill-info" aria-label={`What is ${skill.name}?`} onClick={event => { event.preventDefault(); onInfo(true); }}><Info aria-hidden="true"/></Button></TooltipTrigger>
    <TooltipContent side="top" sideOffset={10} collisionPadding={20} className="skill-tooltip"><p className="mb-2 font-bold">{skill.name}</p><p>{skillInformation[skill.id]}</p></TooltipContent>
   </Tooltip>
  </div>
  <p className="skill-card-usage">{skill.usage}</p>
  {skill.projects.length > 0
   ? <ul className="skill-card-projects" aria-label={`Case studies using ${skill.name}`}><ProjectLinks ids={skill.projects}/></ul>
   : <p className="skill-card-note">Beyond the featured case studies</p>}
 </article>;
}

function ProjectLinks({ ids }: { ids: string[] }) {
 return ids.map(id => {
  const project = getProject(id);
  return project && <li key={id}><Link to="/projects/$projectId" params={{ projectId: id }}>{project.title}<ArrowUpRight aria-hidden="true"/></Link></li>;
 });
}

function Capabilities() {
 return <section className="section skills-block" aria-labelledby="capabilities-title">
  <Reveal><p className="eyebrow">What this toolkit builds</p><h2 id="capabilities-title" className="section-heading">Skills become<br/><span className="text-muted-foreground">shipped capabilities.</span></h2></Reveal>
  <ol className="capability-list">{capabilities.map((capability, i) => <li key={capability.title}><Reveal delay={(i % 2) * .06} className="capability">
   <span className="capability-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
   <div><h3>{capability.title}</h3><p>{capability.description}</p><ul className="capability-links" aria-label={`Case studies for ${capability.title}`}><ProjectLinks ids={capability.projects}/></ul></div>
  </Reveal></li>)}</ol>
 </section>;
}

function Ecosystem() {
 return <section className="section skills-block" aria-labelledby="ecosystem-title">
  <Reveal><p className="eyebrow">Technology ecosystem</p><h2 id="ecosystem-title" className="section-heading">How the pieces<br/><span className="text-muted-foreground">connect.</span></h2><p className="section-description">Two paths I build end to end. Select a stage to see the tools behind it.</p></Reveal>
  <div className="ecosystem">{ecosystemFlows.map((flow, i) => <Reveal key={flow.id} delay={i * .08}><FlowDiagram flow={flow}/></Reveal>)}</div>
 </section>;
}

function FlowDiagram({ flow }: { flow: EcosystemFlow }) {
 const [active, setActive] = useState(0);
 const reduced = useReducedMotion();
 const node = flow.nodes[active] ?? flow.nodes[0];
 const detailId = `eco-detail-${flow.id}`;
 if (!node) return null;
 return <div className="eco-flow">
  <div className="eco-flow-head"><h3 className="eco-flow-title">{flow.title}</h3><span className="eco-flow-caption" aria-hidden="true">{String(flow.nodes.length).padStart(2, '0')} stages</span></div>
  <ol className="eco-track" aria-label={`${flow.title} stages`}>{flow.nodes.map((item, i) => <li className="eco-step" key={item.id}>
   <Button variant="ghost" className="eco-node" aria-pressed={i === active} aria-controls={detailId} onClick={() => setActive(i)} onFocus={() => setActive(i)} onMouseEnter={() => setActive(i)}>
    <span className="eco-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{item.label}
   </Button>
   {i < flow.nodes.length - 1 && <span className="eco-connector" data-lit={i < active} style={{ '--i': i } as CSSProperties} aria-hidden="true"><i/></span>}
  </li>)}</ol>
  <div className="eco-detail" id={detailId}>
   <AnimatePresence initial={false} mode="wait">
    <motion.div key={node.id} className="eco-detail-body" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -4 }} transition={{ duration: reduced ? 0 : .22, ease }}>
     <p><strong>{node.label}</strong>{node.description}</p>
     <SkillChips ids={node.skills} label={`${node.label} technologies`}/>
    </motion.div>
   </AnimatePresence>
  </div>
 </div>;
}

function SkillProof() {
 return <section className="section skills-block" aria-labelledby="proof-title">
  <Reveal><p className="eyebrow">Project-linked proof</p><h2 id="proof-title" className="section-heading">Every skill traces<br/><span className="text-muted-foreground">to shipped work.</span></h2></Reveal>
  <ul className="proof-list">{projects.map(project => <li key={project.id}><Reveal className="proof-row">
   <div><p className="proof-category">{project.category}</p><h3>{project.title}</h3><p className="proof-outcome">{project.outcome}</p></div>
   <SkillChips ids={skillsForProject(project.id).map(skill => skill.id)} label={`Skills used in ${project.title}`}/>
   <Button asChild variant="link" className="proof-link"><Link to="/projects/$projectId" params={{ projectId: project.id }} aria-label={`Read case study: ${project.title}`}>Case study <ArrowUpRight/></Link></Button>
  </Reveal></li>)}</ul>
 </section>;
}
