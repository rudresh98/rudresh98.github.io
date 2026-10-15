import { describe, expect, it } from 'vitest';
import { achievements, filterProjects, emailDraft, getProject, getNextProject } from '@/lib/portfolio';
import { testimonials } from '@/lib/testimonials';
describe('Confirmed professional achievements',()=>{
 it('keeps 1500 transactions over six months',()=>{expect(achievements.transactions).toBe(1500);expect(achievements.transactionMonths).toBe(6)});
 it('keeps 2000 clients',()=>expect(achievements.clients).toBe(2000));
 it('keeps 40 percent transaction speed improvement',()=>expect(achievements.transactionSpeedPercent).toBe(40));
 it('keeps 15 resolved issues within one month',()=>{expect(achievements.issuesResolved).toBe(15);expect(achievements.issueMonths).toBe(1)});
 it('keeps 1 billion lines of code written',()=>expect(achievements.codeLines).toBe(1000000000));
});
describe('Portfolio interactions',()=>{
 it('resolves all five case studies by stable ID',()=>{for(const id of ['music-ai','supply-chain','anchor','izo-sdwan','reporting']) expect(getProject(id)?.id).toBe(id)});
 it('does not resolve unknown case studies',()=>{expect(getProject('unknown')).toBeUndefined();expect(getNextProject('unknown')).toBeUndefined()});
 it('advances case studies and wraps the final project',()=>{expect(getNextProject('music-ai')?.id).toBe('supply-chain');expect(getNextProject('reporting')?.id).toBe('music-ai')});
 it('filters GenAI projects without other categories',()=>{expect(filterProjects('GenAI').map(p=>p.id)).toEqual(['music-ai'])});
 it('filters cloud work',()=>expect(filterProjects('Cloud').map(p=>p.id)).toEqual(['supply-chain','reporting']));
 it('builds an email draft with actual recipient and encoded user input',()=>{const url=emailDraft('Ada','ada@example.com','AI & cloud','Hello\nWorld');expect(url).toContain('mailto:ozarudresh18@gmail.com?');expect(url).toContain('subject=AI%20%26%20cloud');expect(decodeURIComponent(url)).toContain('From: Ada\nEmail: ada@example.com\n\nHello\nWorld')});
});
describe('Approved testimonials',()=>{
 it('publishes the seven quotes Rudresh supplied, attributed by name',()=>{
  expect(testimonials).toHaveLength(7);
  expect(testimonials.map(t=>t.name)).toEqual(['Rami Chaar','Prashant Kumar','Neetu Dave','Aatharv Bharve','Harshal Jain','Khushal Gupta','Aman Bhargav']);
  for(const t of testimonials) expect(t.quote.length).toBeGreaterThan(40);
 });
 it('keeps no placeholder entries in the published quotes',()=>{
  for(const t of testimonials){ expect(t.quote).not.toContain('pending'); expect(t.quote).not.toContain('Placeholder'); expect(t.quote).not.toContain('to be added'); }
 });
});
