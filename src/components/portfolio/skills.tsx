import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, Bot, Cloud, Code2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getProject, projects } from '@/lib/portfolio';
import { capabilities, ecosystemFlows, featuredAreas, filterSkills, getSkill, groupLabel, skillFilters, skillGroups, skills, skillsForProject, type EcosystemFlow, type FeaturedArea, type Skill, type SkillFilter, type SkillGroup } from '@/lib/skills';
import { getSkillIcon } from '@/lib/skill-icons';
import { skillInformation } from '@/lib/skill-information';
import { Reveal } from './motion';

const ease = [.22, 1, .36, 1] as const;
const areaIcons = { code: Code2, cloud: Cloud, bot: Bot, activity: Activity };
const countWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
const pad = (value: number) => String(value).padStart(2, '0');
const resolveSkills = (ids: string[]) => ids.map(getSkill).filter((skill): skill is Skill => Boolean(skill));
const uniqueProjects = (ids: string[]) => [...new Set(resolveSkills(ids).flatMap(skill => skill.projects))];
// The "All Skills" overview previews each category; the full list is one control away.
const overviewSize = 3;

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
  <SkillsExplorer filter={filter} onFilter={setFilter} onExplore={explore} headingRef={explorerHeading}/>
  <Capabilities/>
  <Ecosystem/>
  <SkillProof/>
 </>;
}

// Entrance motion lives in CSS so the heading animates from the first prerendered paint.
function SkillsIntro() {
 const stats = [
  { value: skills.length, label: 'Technologies & practices' },
  { value: skillGroups.length, label: 'Skill categories' },
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
  <Reveal><p className="eyebrow">Core disciplines</p><h2 id="featured-title" className="section-heading">{countWords[featuredAreas.length] ?? featuredAreas.length} disciplines.<br/><span className="text-muted-foreground">One connected practice.</span></h2></Reveal>
  <div className="featured-grid">{featuredAreas.map((area, i) => <Reveal key={area.id} delay={i * .08} className="featured-cell"><FeaturedCard area={area} index={i} onExplore={onExplore}/></Reveal>)}</div>
 </section>;
}

function FeaturedCard({ area, index, onExplore }: { area: FeaturedArea; index: number; onExplore: (filter: SkillFilter) => void }) {
 const Icon = areaIcons[area.icon];
 const proof = uniqueProjects(area.skills).length;
 return <article className={`featured-card ${area.id === 'genai' ? 'featured-card-accent' : ''}`} aria-labelledby={`featured-${area.id}`}>
  <span className="featured-index" aria-hidden="true">{pad(index + 1)}</span>
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

type ExplorerItem = { kind: 'group'; group: SkillGroup; total: number; hidden: number } | { kind: 'skill'; skill: Skill; tail: boolean };
// In two-column layouts the last card of an odd-sized run spans the row instead of leaving a gap.
const toItems = (list: Skill[]) => list.map((skill, i) => ({ kind: 'skill' as const, skill, tail: list.length % 2 === 1 && i === list.length - 1 }));

function SkillsExplorer({ filter, onFilter, onExplore, headingRef }: { filter: SkillFilter; onFilter: (filter: SkillFilter) => void; onExplore: (filter: SkillFilter) => void; headingRef: RefObject<HTMLHeadingElement | null> }) {
 const reduced = useReducedMotion();
 const [info, setInfo] = useState<string | null>(null);
 const [expanded, setExpanded] = useState(false);
 const filters = useRef<HTMLDivElement>(null), more = useRef<HTMLButtonElement>(null);
 const items: ExplorerItem[] = filter === 'all'
  ? skillGroups.flatMap(({ id }) => {
   const all = filterSkills(id), visible = expanded ? all : all.slice(0, overviewSize);
   return [{ kind: 'group' as const, group: id, total: all.length, hidden: all.length - visible.length }, ...toItems(visible)];
  })
  : toItems(filterSkills(filter));
 const shown = items.filter(item => item.kind === 'skill').length;
 const active = skillFilters.find(item => item.id === filter)?.label ?? 'All Skills';
 // Keep the selected chip visible in the horizontally scrolling tray, without touching page scroll.
 useEffect(() => {
  const tray = filters.current, chip = tray?.querySelector<HTMLElement>('[aria-pressed="true"]');
  if (!tray || !chip || tray.scrollWidth <= tray.clientWidth) return;
  tray.scrollTo?.({ left: Math.max(0, chip.offsetLeft - (tray.clientWidth - chip.offsetWidth) / 2), behavior: reduced ? 'auto' : 'smooth' });
 }, [filter, reduced]);
 // Collapsing removes thousands of pixels above the toggle; keep it where the reader is.
 const toggle = () => {
  setExpanded(!expanded);
  if (expanded) requestAnimationFrame(() => more.current?.scrollIntoView?.({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }));
 };
 return <section className="section skills-block skills-explorer" aria-labelledby="explorer-title">
  <Reveal><p className="eyebrow">Skills explorer</p><h2 id="explorer-title" ref={headingRef} tabIndex={-1} className="section-heading explorer-heading">The full toolkit, <span className="text-muted-foreground">in one place.</span></h2><p className="section-description">Filter by category. Each entry describes the technology’s role in my work and, where it shipped in a featured case study, links straight to it.</p></Reveal>
  <div ref={filters} className="skill-filters" role="group" aria-label="Skill categories">
   {skillFilters.map(item => <Button key={item.id} variant="ghost" className="skill-filter" aria-pressed={filter === item.id} onClick={() => onFilter(item.id)}>
    {filter === item.id && <motion.span layoutId="skill-filter-pill" className="skill-filter-pill" transition={{ duration: reduced ? 0 : .3, ease }} aria-hidden="true"/>}
    {item.label}<span className="skill-filter-count" aria-hidden="true">{filterSkills(item.id).length}</span>
   </Button>)}
  </div>
  <p className="sr-only" role="status">{shown} of {filterSkills(filter).length} skills shown in {active}</p>
  <TooltipProvider delayDuration={180} skipDelayDuration={80}>
   <ul className="explorer-grid">
    <AnimatePresence initial={false} mode="popLayout">
     {items.map(item => <motion.li key={item.kind === 'group' ? `group-${item.group}` : item.skill.id} className={item.kind === 'group' ? 'explorer-group' : 'explorer-item'} data-tail={item.kind === 'skill' && item.tail || undefined} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : .97 }} transition={{ duration: reduced ? 0 : .3, ease }}>
      {item.kind === 'group'
       ? <><h3>{groupLabel(item.group)}<span>{pad(item.total)}</span></h3>{item.hidden > 0 && <Button variant="ghost" className="explorer-group-link" onClick={() => onExplore(item.group)}>View all {item.total}<ArrowRight aria-hidden="true"/></Button>}</>
       : <SkillCard skill={item.skill} nested={filter === 'all'} infoOpen={info === item.skill.id} onInfo={open => setInfo(current => open ? item.skill.id : current === item.skill.id ? null : current)}/>}
     </motion.li>)}
    </AnimatePresence>
   </ul>
  </TooltipProvider>
  {filter === 'all' && <div className="explorer-more"><Button ref={more} variant="outline" aria-expanded={expanded} onClick={toggle}>{expanded ? 'Show the overview' : `Show all ${skills.length} skills`}</Button></div>}
 </section>;
}

function SkillCard({ skill, nested, infoOpen, onInfo }: { skill: Skill; nested: boolean; infoOpen: boolean; onInfo: (open: boolean) => void }) {
 const Icon = getSkillIcon(skill.id);
 const Heading = nested ? 'h4' : 'h3';
 const trigger = useRef<HTMLButtonElement>(null);
 const wasOpen = useRef(false), escaped = useRef(false);
 // Radix closes on any scroll around the trigger, including Tab scrolling it into view; keep keyboard focus open until blur or Escape.
 useEffect(() => {
  if (!infoOpen) return;
  const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') escaped.current = true; };
  window.addEventListener('keydown', onKey, { capture: true });
  return () => window.removeEventListener('keydown', onKey, { capture: true });
 }, [infoOpen]);
 const change = (open: boolean) => {
  const button = trigger.current;
  if (!open && !escaped.current && button && document.activeElement === button && button.matches(':focus-visible')) return;
  escaped.current = false;
  onInfo(open);
 };
 return <article className="skill-card" aria-labelledby={`skill-${skill.id}`}>
  <div className="skill-card-top">
   <span className="skill-card-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.8}/></span>
   <div className="min-w-0"><Heading id={`skill-${skill.id}`}>{skill.name}</Heading></div>
   <Tooltip open={infoOpen} onOpenChange={change}>
    {/* Taps and Enter/Space toggle; pointerdown records the state before Radix's own close runs. */}
    <TooltipTrigger asChild><Button ref={trigger} variant="ghost" size="icon" className="skill-info" aria-label={`What is ${skill.name}?`} onPointerDown={() => { wasOpen.current = infoOpen; }} onClick={event => { event.preventDefault(); onInfo(event.detail === 0 ? !infoOpen : !wasOpen.current); wasOpen.current = false; }}><Info aria-hidden="true"/></Button></TooltipTrigger>
    <TooltipContent side="top" sideOffset={10} collisionPadding={20} className="skill-tooltip"><p className="mb-2 font-bold">{skill.name}</p><p>{skillInformation[skill.id]}</p></TooltipContent>
   </Tooltip>
  </div>
  <p className="skill-card-usage">{skill.usage}</p>
  {skill.projects.length > 0
   ? <ul className="skill-card-projects" aria-label={`Case studies using ${skill.name}`}><ProjectLinks ids={skill.projects}/></ul>
   : <p className="skill-card-note">Used outside the featured case studies</p>}
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
   <span className="capability-number" aria-hidden="true">{pad(i + 1)}</span>
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

// Stages follow the tabs pattern: one selected stage, arrow keys move between them, the panel shows its tools.
function FlowDiagram({ flow }: { flow: EcosystemFlow }) {
 const [active, setActive] = useState(0);
 const tabs = useRef<(HTMLButtonElement | null)[]>([]);
 const reduced = useReducedMotion();
 const node = flow.nodes[active] ?? flow.nodes[0];
 const tabId = (i: number) => `eco-tab-${flow.id}-${i}`, panelId = `eco-panel-${flow.id}`;
 const select = (i: number) => { const next = (i + flow.nodes.length) % flow.nodes.length; setActive(next); tabs.current[next]?.focus(); };
 const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
  const moves: Record<string, number> = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: flow.nodes.length - 1 };
  const next = moves[event.key];
  if (next === undefined) return;
  event.preventDefault();
  select(next);
 };
 if (!node) return null;
 return <div className="eco-flow">
  <div className="eco-flow-head"><h3 className="eco-flow-title" id={`eco-title-${flow.id}`}>{flow.title}</h3><span className="eco-flow-caption" aria-hidden="true">{pad(flow.nodes.length)} stages</span></div>
  <ol className="eco-track" role="tablist" aria-labelledby={`eco-title-${flow.id}`} onKeyDown={onKeyDown}>{flow.nodes.map((item, i) => <li className="eco-step" role="presentation" key={item.id}>
   <Button ref={element => { tabs.current[i] = element; }} variant="ghost" className="eco-node" role="tab" id={tabId(i)} aria-selected={i === active} aria-controls={panelId} tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}>
    <span className="eco-index" aria-hidden="true">{pad(i + 1)}</span>{item.label}
   </Button>
   {i < flow.nodes.length - 1 && <span className="eco-connector" data-lit={i < active} style={{ '--i': i } as CSSProperties} aria-hidden="true"><i/></span>}
  </li>)}</ol>
  <div className="eco-detail" role="tabpanel" tabIndex={0} id={panelId} aria-labelledby={tabId(active)}>
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
  <Reveal><p className="eyebrow">Project-linked proof</p><h2 id="proof-title" className="section-heading">Where the toolkit<br/><span className="text-muted-foreground">shipped.</span></h2></Reveal>
  <ul className="proof-list">{projects.map(project => <li key={project.id}><Reveal className="proof-row">
   <div><p className="proof-category">{project.category}</p><h3>{project.title}</h3><p className="proof-outcome">{project.outcome}</p></div>
   <SkillChips ids={skillsForProject(project.id).map(skill => skill.id)} label={`Skills used in ${project.title}`}/>
   <Button asChild variant="link" className="proof-link"><Link to="/projects/$projectId" params={{ projectId: project.id }} aria-label={`Read case study: ${project.title}`}>Case study <ArrowUpRight/></Link></Button>
  </Reveal></li>)}</ul>
 </section>;
}
