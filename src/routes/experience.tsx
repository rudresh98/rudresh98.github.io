import { createFileRoute } from '@tanstack/react-router';
import { pageHead, pageSeo, breadcrumbJsonLd } from '@/lib/seo';
import { Page, PageIntro, ExperienceContent } from '@/components/portfolio/content';
export const Route=createFileRoute('/experience')({head:()=>pageHead(pageSeo['/experience'].title,pageSeo['/experience'].description,'/experience',{fullTitle:true,jsonLd:[breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Experience',path:'/experience'}])]}),component:Experience});
function Experience(){return <Page><PageIntro eyebrow="Career" title="Experience Building and Evolving Software." description="6+ years of engineering ownership and 5,000+ students trained—from customer-facing web experiences to cloud platforms and intelligent agents."/><ExperienceContent/></Page>}
