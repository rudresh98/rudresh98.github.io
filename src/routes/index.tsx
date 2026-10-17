import { createFileRoute } from '@tanstack/react-router';
import { pageHead, pageSeo, profilePageJsonLd } from '@/lib/seo';
import { ProjectGrid, Collaboration } from '@/components/portfolio/work';
import { AboutContent } from '@/components/portfolio/content';
import { ArchitectureFlow } from '@/components/portfolio/visuals';
import { ClientGlobe } from '@/components/portfolio/client-globe';
import { Hero } from '@/components/portfolio/hero';
export const Route = createFileRoute('/')({
 // The SPA shell (404.html) is prerendered from this route with only the root server-rendered (ssr false here);
 // keep it out of the index instead of canonicalising it to Home.
 head:({match})=>pageHead(pageSeo['/'].title,pageSeo['/'].description,'/',{fullTitle:true,type:'profile',noindex:match.ssr===false,jsonLd:[profilePageJsonLd('/','Rudresh Oza — Forward Deployed Engineer (FDE) portfolio')]}),component:Index,
});
function Index(){return <main><div className="container-shell"><Hero/><section className="section"><ProjectGrid preview/></section><div className="border-t border-border"><ArchitectureFlow/></div><div className="border-t border-border"><AboutContent compact/></div></div><ClientGlobe/><Collaboration/></main>}
