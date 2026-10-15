import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/portfolio';
import { Page, PageIntro, ExpertiseContent } from '@/components/portfolio/content';
import { Collaboration } from '@/components/portfolio/work';
export const Route=createFileRoute('/expertise')({head:()=>pageHead('Technical Expertise','Rudresh Oza’s expertise in full-stack development, Azure and AWS, LangGraph AI agents, and data-driven applications.'),component:Expertise});
function Expertise(){return <><Page><PageIntro eyebrow="Technical expertise" title="Across the stack. Beyond the obvious." description="A practical engineering toolkit shaped by customer-facing products, enterprise platforms, and AI-powered systems."/><section className="pb-16"><ExpertiseContent/></section></Page><Collaboration/></>}
