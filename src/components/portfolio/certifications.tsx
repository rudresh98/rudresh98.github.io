import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { certifications, certificationIssuers, certificationStatus, filterCertifications, formatMonth, type Certification } from '@/lib/certifications';
import { certificationIcon } from '@/lib/certification-icons';
import { Reveal } from './motion';

export function CertificationCard({cert}:{cert:Certification}) {
 const Icon=certificationIcon(cert.issuer);const status=certificationStatus(cert);
 return <Reveal className="cert-card-inner">
  <div className="cert-top"><span className="cert-icon" aria-hidden="true"><Icon/></span><span className="cert-status" data-status={status}>{status==='active'?'Active':'Expired'}</span></div>
  <p className="cert-issuer">{cert.issuer}</p>
  <h2 className="cert-name">{cert.name}</h2>
  <p className="cert-dates">Issued {formatMonth(cert.issued)}{cert.expires&&<> · {status==='expired'?'Expired':'Expires'} {formatMonth(cert.expires)}</>}</p>
  {cert.credentialId&&<p className="cert-id"><span>Credential ID</span> {cert.credentialId}</p>}
  {cert.skills.length>0&&<div className="project-tags">{cert.skills.map(s=><span key={s}>{s}</span>)}</div>}
  {cert.verifyUrl&&<a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="cert-verify" aria-label={`Verify credential: ${cert.name} (opens in a new tab)`}>Verify credential <ArrowUpRight aria-hidden="true"/></a>}
 </Reveal>;
}

export function CertificationGrid({items=certifications}:{items?:Certification[]}) {
 const [issuer,setIssuer]=useState('All');const reduced=useReducedMotion();
 const issuers=certificationIssuers(items);const shown=filterCertifications(issuer,items);
 if(items.length===0) return <Reveal className="cert-empty"><span className="cert-icon" aria-hidden="true"><Award/></span><div><h2>Certifications coming soon</h2><p>Verified credentials will be listed here with links to their official issuer records.</p></div></Reveal>;
 return <section className="cert-section">
  {issuers.length>2&&<div className="project-filters" aria-label="Certification issuers">{issuers.map(i=><Button key={i} variant="ghost" className="category-filter" onClick={()=>setIssuer(i)} aria-pressed={issuer===i}>{i}{issuer===i&&<motion.span layoutId="cert-filter-underline" className="filter-underline" transition={{duration:reduced?0:.25}}/>}</Button>)}</div>}
  <div className="sr-only" role="status">{shown.length} {shown.length===1?'certification':'certifications'}{issuer!=='All'&&` from ${issuer}`}</div>
  <motion.div layout={!reduced} className="cert-grid"><AnimatePresence mode="popLayout">{shown.map(c=><motion.article layout={!reduced} initial={false} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:reduced?1:.97}} transition={{duration:reduced?0:.3}} className="cert-card" key={c.id}><CertificationCard cert={c}/></motion.article>)}</AnimatePresence></motion.div>
 </section>;
}
