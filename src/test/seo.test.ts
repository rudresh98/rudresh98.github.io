import { describe, expect, it } from 'vitest';
import { projects, profile } from '@/lib/portfolio';
import { canonicalUrl, pageHead, sitemapXml, sitePages, siteJsonLd, projectJsonLd } from '@/lib/seo';

describe('Canonical URLs',()=>{
 it('matches the trailing-slash URLs GitHub Pages serves',()=>{
  expect(canonicalUrl('/')).toBe('https://rudresh98.github.io/');
  expect(canonicalUrl('/about')).toBe('https://rudresh98.github.io/about/');
  expect(canonicalUrl('/projects/anchor/')).toBe('https://rudresh98.github.io/projects/anchor/');
 });
 it('emits one canonical link and matching og:url per page',()=>{
  const head=pageHead('About','Description','/about');
  expect(head.links).toEqual([{rel:'canonical',href:'https://rudresh98.github.io/about/'}]);
  expect(head.meta).toContainEqual({property:'og:url',content:'https://rudresh98.github.io/about/'});
  expect(head.meta).toContainEqual({title:'About | Rudresh Oza — Cloud & GenAI'});
 });
 it('keeps unavailable pages out of the index',()=>{
  const head=pageHead('Missing','Description','/projects/missing',{noindex:true});
  expect(head.links).toEqual([]);
  expect(head.meta).toContainEqual({name:'robots',content:'noindex, follow'});
 });
});

describe('Sitemap',()=>{
 it('lists every named page and case study once',()=>{
  const xml=sitemapXml();
  for(const path of ['/','/about/','/expertise/','/experience/','/projects/','/contact/',...projects.map(p=>`/projects/${p.id}/`)])
   expect(xml).toContain(`<loc>https://rudresh98.github.io${path}</loc>`);
  expect(new Set(sitePages.map(p=>p.path)).size).toBe(sitePages.length);
 });
 it('does not list the SPA shell or not-found page',()=>{expect(sitemapXml()).not.toMatch(/shell|404/)});
});

describe('Structured data',()=>{
 it('describes the person with verified profile links',()=>{
  const person=siteJsonLd('/assets/portrait.png')['@graph'].find(node=>node['@type']==='Person');
  expect(person).toMatchObject({name:profile.name,jobTitle:profile.role,image:'https://rudresh98.github.io/assets/portrait.png',sameAs:[profile.linkedin,profile.github]});
 });
 it('attributes each case study to the site author',()=>{
  for(const project of projects) expect(projectJsonLd(project)).toMatchObject({name:project.title,url:canonicalUrl(`/projects/${project.id}`),author:{'@id':'https://rudresh98.github.io/#person'}});
 });
});
