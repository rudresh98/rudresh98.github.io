import { createFileRoute } from '@tanstack/react-router';
import { pageHead, breadcrumbJsonLd } from '@/lib/seo';
import { Page } from '@/components/portfolio/content';
import { SkillsHub } from '@/components/portfolio/skills';
import { Collaboration } from '@/components/portfolio/work';
export const Route=createFileRoute('/expertise')({head:()=>pageHead('Technical Expertise','Rudresh Oza’s expertise in React, Node.js, Python and FastAPI, Azure and AWS cloud, LangChain and LangGraph AI agents, and data-driven applications.','/expertise',{jsonLd:[breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Expertise',path:'/expertise'}])]}),component:Expertise});
function Expertise(){return <><Page><SkillsHub/></Page><Collaboration/></>}
