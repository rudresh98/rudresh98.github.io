import { createFileRoute } from '@tanstack/react-router';
import { pageHead, breadcrumbJsonLd } from '@/lib/seo';
import { Page, PageIntro, ExperienceContent } from '@/components/portfolio/content';
export const Route=createFileRoute('/experience')({head:()=>pageHead('Professional Experience','Explore Rudresh Oza’s software engineering career at Celebal Technologies, HornBlower Encore Studio, RevDau Industries, and beyond.','/experience',{jsonLd:[breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Experience',path:'/experience'}])]}),component:Experience});
function Experience(){return <Page><PageIntro eyebrow="Career" title="Experience Building and Evolving Software." description="6+ years of engineering ownership—from customer-facing web experiences to cloud platforms and intelligent agents."/><ExperienceContent/></Page>}
