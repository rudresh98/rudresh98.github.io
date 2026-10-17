import { createFileRoute } from '@tanstack/react-router';
import { pageHead, pageSeo, projectListJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { Page } from '@/components/portfolio/content';
import { ProjectGrid, Collaboration } from '@/components/portfolio/work';

export const Route=createFileRoute('/projects/')({head:()=>pageHead(pageSeo['/projects'].title,pageSeo['/projects'].description,'/projects',{fullTitle:true,jsonLd:[projectListJsonLd(),breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Projects',path:'/projects'}])]}),component:Projects});
function Projects(){return <><Page><section className="section"><ProjectGrid/></section></Page><Collaboration/></>}