import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/portfolio/content';
import { Reveal } from '@/components/portfolio/motion';
import { Architecture } from '@/components/portfolio/visuals';
import { getProject, getNextProject, pageHead } from '@/lib/portfolio';
import { projectVisuals } from '@/lib/portfolio-visuals';

export const Route = createFileRoute('/projects/$projectId')({
 loader: ({params}) => {
  const project = getProject(params.projectId);
  if (!project) throw notFound();
  return project;
 },
 head: ({loaderData}) => loaderData ? pageHead(loaderData.title,loaderData.description) : pageHead('Project unavailable','The requested engineering case study is unavailable.'),
 component: ProjectPage,
 notFoundComponent: () => <ProjectUnavailable missing/>,
 errorComponent: () => <ProjectUnavailable/>,
});

function ProjectUnavailable({missing=false}:{missing?:boolean}) {
 return <Page><section className="section"><h1 className="section-heading">{missing?'Project not found':'This project could not load'}</h1><Button asChild variant="link" className="mt-6 px-0"><Link to="/projects"><ArrowLeft/>Back to projects</Link></Button></section></Page>;
}

function ProjectPage() {
 const project = Route.useLoaderData();
 const visual = projectVisuals[project.id];
 const next = getNextProject(project.id);
 return <Page><article className="project-detail"><Reveal className="project-detail-intro"><Button asChild variant="link" className="mb-8 px-0"><Link to="/projects"><ArrowLeft/>Back to projects</Link></Button><p className="eyebrow">{project.category} · Engineering case study</p><h1>{project.title}</h1><p className="section-description">{project.description}</p><div className="project-tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></Reveal><Reveal className="project-detail-visual"><Architecture project={project}/></Reveal><div className="project-detail-body"><Reveal className="case-study-section"><span className="case-number">01</span><div><h2>The problem & context</h2><p>{project.context}</p></div></Reveal><Reveal className="case-study-section"><span className="case-number">02</span><div><h2>Architecture</h2><p>{visual?.architecture}</p><p className="illustration-note">Illustrative system view, not a production screenshot.</p></div></Reveal><Reveal className="case-study-section"><span className="case-number">03</span><div><h2>Implementation & my contribution</h2><ul>{project.contributions.map(item=><li key={item}>{item}</li>)}</ul></div></Reveal><Reveal className="case-study-section"><span className="case-number">04</span><div><h2>Outcome</h2>{visual?.impact&&<div className="case-impact">{visual.impact.map(metric=><div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}<p>{project.outcome}</p></div></Reveal></div><nav className="project-detail-navigation" aria-label="Case study navigation"><Button asChild variant="outline"><Link to="/projects"><ArrowLeft/>All projects</Link></Button>{next&&<Button asChild variant="link" className="next-project"><Link to="/projects/$projectId" params={{projectId:next.id}}><span><small>Next project</small>{next.title}</span><ArrowRight/></Link></Button>}</nav></article></Page>;
}