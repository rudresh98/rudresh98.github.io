import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { achievements } from '@/lib/portfolio';
import { courseEnquiryHref, courses, trainingFormats, type Course } from '@/lib/training';
import { courseIcons, formatIcons } from '@/lib/training-icons';
import { Counter, Reveal } from './motion';

export function TrainingStats() {
 const stats=[{value:achievements.studentsTrained,suffix:'+',label:'Students trained'},{value:achievements.trainingYears,suffix:'',label:'Years of training'},{value:courses.length,suffix:'',label:'Core courses'},{value:trainingFormats.length,suffix:'',label:'Delivery formats'}];
 return <Reveal className="training-stats"><ul aria-label="Training highlights">{stats.map(s=><li key={s.label}><strong><Counter value={s.value} suffix={s.suffix}/></strong><span className="training-stat-label">{s.label}</span></li>)}</ul></Reveal>;
}

function CourseCard({course,index}:{course:Course,index:number}) {
 const Icon=courseIcons[course.id];
 return <Reveal delay={index*.08} className="course-card-motion"><article id={course.id} className="course-card" aria-labelledby={`${course.id}-title`}>
  <div className="course-top"><span className="course-icon" aria-hidden="true">{Icon&&<Icon/>}</span><span className="course-count">{String(index+1).padStart(2,'0')} · {course.modules.length} modules</span></div>
  <h3 id={`${course.id}-title`} className="course-title">{course.title}</h3>
  <p className="course-tagline">{course.tagline}</p>
  <p className="course-summary">{course.summary}</p>
  <p className="course-audience"><span>Who it's for</span>{course.audience}</p>
  <div className="project-tags" aria-label={`${course.title} tools`}>{course.tools.map(t=><span key={t}>{t}</span>)}</div>
  <Accordion type="single" collapsible className="course-modules">{course.modules.map((m,i)=><AccordionItem key={m.title} value={m.title} className="course-module"><AccordionTrigger className="course-module-trigger"><span className="course-module-number">{String(i+1).padStart(2,'0')}</span><span className="flex-1">{m.title}</span></AccordionTrigger><AccordionContent><ul className="course-module-topics">{m.topics.map(t=><li key={t}>{t}</li>)}</ul></AccordionContent></AccordionItem>)}</Accordion>
  <a href={courseEnquiryHref(course)} className="course-enquire" aria-label={`Enquire about ${course.title} by email`}>Enquire about this course <ArrowUpRight aria-hidden="true"/></a>
 </article></Reveal>;
}

export function CourseCards() {
 return <section className="section" aria-labelledby="courses-heading"><Reveal><p className="eyebrow">Courses</p><h2 id="courses-heading" className="section-heading">Two tracks.<br/><span className="text-muted-foreground">Built from production work.</span></h2><p className="section-description">Modules draw on the same stack I use in client work, so learners practice the patterns real teams rely on.</p></Reveal><div className="course-grid">{courses.map((c,i)=><CourseCard key={c.id} course={c} index={i}/>)}</div></section>;
}

export function TrainingFormats() {
 return <section className="section training-formats" aria-labelledby="formats-heading"><Reveal><p className="eyebrow">How I teach</p><h2 id="formats-heading" className="section-heading">Flexible formats for<br/><span className="text-muted-foreground">teams, campuses, and individuals.</span></h2></Reveal><ul className="format-grid">{trainingFormats.map((f,i)=>{const Icon=formatIcons[f.id];return <li key={f.id}><Reveal delay={i*.06} className="format-card"><span className="course-icon" aria-hidden="true">{Icon&&<Icon/>}</span><h3>{f.title}</h3><p>{f.description}</p></Reveal></li>})}</ul></section>;
}

export function TrainingCta() {
 return <section className="collaboration-band"><Reveal className="container-shell collaboration-inner"><div><p className="eyebrow">Training enquiries</p><h2>Bring this training<br/>to your team or campus.</h2><p>Share your audience, goals, and preferred format, and I'll suggest the right course structure.</p></div><div className="collaboration-actions"><Button asChild className="h-12 px-6 shadow-none"><Link to="/contact">Discuss Training <ArrowRight/></Link></Button><a href={courseEnquiryHref()} className="text-sm text-muted-foreground hover:text-primary"><Mail className="mr-1.5 inline" size={14} aria-hidden="true"/>Email a training enquiry</a></div></Reveal></section>;
}
