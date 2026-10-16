import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import { SkillsHub } from '@/components/portfolio/skills';
import { getProject, projects } from '@/lib/portfolio';
import { skillIcons } from '@/lib/skill-icons';
import { skillInformation } from '@/lib/skill-information';
import { capabilities, ecosystemFlows, featuredAreas, filterSkills, getSkill, skillFilters, skillGroups, skills, skillsForProject } from '@/lib/skills';

async function renderHub() {
  const router = createRouter({ routeTree: createRootRoute({ component: SkillsHub }), history: createMemoryHistory({ initialEntries: ['/'] }) });
  await act(() => router.load());
  render(<RouterProvider router={router} />);
  return screen.findByRole('heading', { level: 1 });
}
const explorerCards = () => within(screen.getByRole('heading', { name: /Every tool/ }).closest('section') as HTMLElement).getAllByRole('article');

describe('Verified skills data', () => {
  it('keeps unique skills, each with an icon, a general description, and a usage line', () => {
    expect(new Set(skills.map(skill => skill.id)).size).toBe(skills.length);
    expect(new Set(skills.map(skill => skill.name)).size).toBe(skills.length);
    for (const skill of skills) {
      expect(skillIcons[skill.id], skill.id).toBeDefined();
      expect(skillInformation[skill.id], skill.id).toBeTruthy();
      expect(skill.usage.length).toBeGreaterThan(30);
    }
    expect(Object.keys(skillIcons).sort()).toEqual(skills.map(skill => skill.id).sort());
    expect(Object.keys(skillInformation).sort()).toEqual(skills.map(skill => skill.id).sort());
  });

  it('only links skills, capabilities, and featured areas to real data', () => {
    const projectIds = [...skills.flatMap(skill => skill.projects), ...capabilities.flatMap(capability => capability.projects)];
    for (const id of projectIds) expect(getProject(id), id).toBeDefined();
    const skillIds = [...featuredAreas.flatMap(area => area.skills), ...ecosystemFlows.flatMap(flow => flow.nodes.flatMap(node => node.skills))];
    for (const id of skillIds) expect(getSkill(id), id).toBeDefined();
    for (const capability of capabilities) expect(capability.projects.length).toBeGreaterThan(0);
  });

  it('backs every case study with at least one skill', () => {
    for (const project of projects) expect(skillsForProject(project.id).length, project.id).toBeGreaterThan(0);
  });

  it('leaves out technologies the resume does not support', () => {
    const names = skills.map(skill => `${skill.name} ${skill.usage}`).join(' ');
    for (const unverified of ['Bootstrap', 'Docker', 'Kubernetes', 'ClickHouse', 'MCP', 'Azure Functions', 'App Service', 'GitHub Actions', 'CI/CD']) expect(names).not.toContain(unverified);
  });

  it('partitions every skill into exactly one filter group', () => {
    expect(filterSkills('all')).toHaveLength(skills.length);
    expect(skillGroups.reduce((total, group) => total + filterSkills(group.id).length, 0)).toBe(skills.length);
    for (const group of skillGroups) expect(filterSkills(group.id).length, group.id).toBeGreaterThan(0);
  });
});

describe('Skills hub', () => {
  it('introduces the toolkit with counts derived from the data', async () => {
    expect(await renderHub()).toHaveTextContent('My Engineering Toolkit.');
    const stats = screen.getByRole('list', { name: 'Toolkit at a glance' });
    expect(stats).toHaveTextContent(String(skills.length));
    expect(stats).toHaveTextContent(String(projects.length));
  });

  it('filters the explorer in place and announces the result', async () => {
    await renderHub();
    expect(explorerCards()).toHaveLength(skills.length);
    const group = screen.getByRole('group', { name: 'Skill categories' });
    expect(within(group).getAllByRole('button')).toHaveLength(skillFilters.length);
    const genai = within(group).getByRole('button', { name: /^GenAI/ });
    fireEvent.click(genai);
    expect(genai).toHaveAttribute('aria-pressed', 'true');
    expect(within(group).getByRole('button', { name: /^All Skills/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('status')).toHaveTextContent(`${filterSkills('genai').length} skills shown in GenAI`);
    expect(await screen.findByRole('heading', { name: 'LangChain / LangGraph', level: 3 })).toBeInTheDocument();
  });

  it('opens the matching explorer category from a featured card', async () => {
    await renderHub();
    fireEvent.click(screen.getByRole('button', { name: /Explore Cloud & DevOps/ }));
    const group = screen.getByRole('group', { name: 'Skill categories' });
    expect(within(group).getByRole('button', { name: /^Cloud & DevOps/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: /Every tool/ })).toHaveFocus();
  });

  it('links skills and capabilities to their case studies', async () => {
    await renderHub();
    const links = screen.getAllByRole('link', { name: /Supply Chain Digital Twin/ });
    expect(links.length).toBeGreaterThan(1);
    for (const link of links) expect(link).toHaveAttribute('href', '/projects/supply-chain');
    for (const project of projects) expect(screen.getByRole('link', { name: `Read case study: ${project.title}` })).toHaveAttribute('href', `/projects/${project.id}`);
  });

  it('reveals the tools behind each ecosystem stage', async () => {
    await renderHub();
    const stage = screen.getByRole('button', { name: /Agent Orchestration/ });
    expect(stage).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(stage);
    expect(stage).toHaveAttribute('aria-pressed', 'true');
    expect(await screen.findByRole('list', { name: 'Agent Orchestration technologies' })).toHaveTextContent('Memory & Checkpointing');
  });
});
