import { createFileRoute } from '@tanstack/react-router';
import { pageHead, breadcrumbJsonLd, certificationListJsonLd } from '@/lib/seo';
import { Page, PageIntro } from '@/components/portfolio/content';
import { CertificationGrid } from '@/components/portfolio/certifications';
import { Collaboration } from '@/components/portfolio/work';

export const Route=createFileRoute('/certifications')({head:()=>pageHead('Certifications','Verified certifications held by Rudresh Oza: Anthropic Claude developer certification, Databricks data engineering, and Microsoft Azure, each linked to its official issuer record.','/certifications',{jsonLd:[certificationListJsonLd(),breadcrumbJsonLd([{name:'Home',path:'/'},{name:'Certifications',path:'/certifications'}])]}),component:Certifications});
function Certifications(){return <><Page><PageIntro eyebrow="Credentials" title="Certified Across Cloud, Data, and AI." description="Industry certifications that back hands-on engineering work—each one verifiable with its issuer."/><CertificationGrid/></Page><Collaboration/></>}
