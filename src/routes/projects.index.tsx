import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/portfolio';
import { Page } from '@/components/portfolio/content';
import { ProjectGrid, Collaboration } from '@/components/portfolio/work';

export const Route=createFileRoute('/projects/')({head:()=>pageHead('Selected Projects','Case studies in agentic AI, supply chain simulation, booking and redemption, telecommunications, and automated reporting by Rudresh Oza.'),component:Projects});
function Projects(){return <><Page><section className="section"><ProjectGrid/></section></Page><Collaboration/></>}