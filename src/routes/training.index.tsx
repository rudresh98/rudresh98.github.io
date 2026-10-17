import { createFileRoute } from '@tanstack/react-router';
import { pageHead, breadcrumbJsonLd, courseListJsonLd } from '@/lib/seo';
import { Page, PageIntro } from '@/components/portfolio/content';
import { CourseCards, TrainingCta, TrainingFormats, TrainingStats } from '@/components/portfolio/training';
import { achievements } from '@/lib/portfolio';

export const Route=createFileRoute('/training/')({head:()=>pageHead('Training & Courses',`Full Stack, Backend, Database Design, Cloud Infrastructure, Databricks, Generative AI, and Forward Deployed Engineering courses by Rudresh Oza, who has trained ${achievements.studentsTrained.toLocaleString('en-US')}+ students through corporate, college, institute, and online programs.`,'/training',{jsonLd:[courseListJsonLd(),breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Training',path:'/training'}])]}),component:Training});
function Training(){return <><Page><PageIntro eyebrow="Training & Mentoring" title="Teaching What I Build in Production." description={`${achievements.studentsTrained.toLocaleString('en-US')}+ students and professionals trained over ${achievements.trainingYears} years in full-stack web development and Generative AI, with dedicated tracks in backend and database design, cloud infrastructure, Databricks, and Forward Deployed Engineering.`}/><TrainingStats/><CourseCards/><TrainingFormats/></Page><TrainingCta/></>}
