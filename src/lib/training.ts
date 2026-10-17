// Browser-safe and asset-free so seo.ts (and through it vite.config.ts) can import it.
import { profile, training } from './portfolio';

export type CourseModule = { title: string; topics: string[] };
export type Course = { id: 'full-stack' | 'genai'; title: string; tagline: string; audience: string; summary: string; modules: CourseModule[]; tools: string[] };
export type TrainingFormat = { id: string; title: string; description: string };

// Course outlines drafted from technologies already verified on this site, pending Rudresh's review.
// Fees, durations, batch dates, and institution names are deliberately omitted until he confirms them.
export const courses: Course[] = [
 {
  id: 'full-stack',
  title: 'Full Stack Web Development',
  tagline: 'From first component to deployed product.',
  audience: 'Students, graduates, and developers moving into full-stack roles',
  summary: 'A hands-on path through modern front-end, back-end, data, and cloud delivery, built around the same practices used on production client platforms.',
  modules: [
   { title: 'Web foundations', topics: ['Semantic HTML5 and responsive CSS3', 'Modern JavaScript and TypeScript', 'Browser tooling and debugging'] },
   { title: 'React front-end', topics: ['Components, hooks, and routing', 'State with Redux and TanStack Query', 'Styling with Tailwind CSS and component libraries'] },
   { title: 'Back-end APIs with Node.js', topics: ['Express routing and middleware', 'REST API design and validation', 'Error handling and logging'] },
   { title: 'Databases', topics: ['Relational modeling with PostgreSQL and MySQL', 'Document data with MongoDB', 'ORMs and schema migrations'] },
   { title: 'Authentication and security', topics: ['JWT sessions and refresh tokens', 'Role-based access control', 'Single sign-on concepts'] },
   { title: 'Cloud and delivery', topics: ['AWS fundamentals: S3 and Lambda', 'Git workflows and code review', 'Performance and caching basics'] },
   { title: 'Capstone project', topics: ['Plan, build, and deploy a complete full-stack application', 'Code review and production-readiness checklist'] },
  ],
  tools: ['HTML5 / CSS3', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Git'],
 },
 {
  id: 'genai',
  title: 'Generative AI & LLM Engineering',
  tagline: 'Build AI features that hold up in production.',
  audience: 'Developers and engineering teams adding LLMs and agents to real products',
  summary: 'A practical course on language models, retrieval, and agent workflows, focused on structured outputs, observability, and cost—not demos.',
  modules: [
   { title: 'LLM fundamentals', topics: ['Tokens, context windows, and model selection', 'Calling model APIs, including Azure AI Foundry', 'Prompt design patterns'] },
   { title: 'Structured outputs and tool calling', topics: ['Schema-constrained responses', 'Retries, validation, and error handling', 'Connecting APIs as tools'] },
   { title: 'Retrieval-augmented generation', topics: ['Embeddings and chunking', 'Vector search with FAISS and Qdrant', 'Hybrid ranking with BM25'] },
   { title: 'Agents with LangChain and LangGraph', topics: ['Stateful multi-step workflows', 'Memory and checkpointing', 'Multi-step execution and retries'] },
   { title: 'Serving AI with FastAPI', topics: ['Designing AI-backed APIs', 'API performance and response latency', 'Persisting conversations and agent state'] },
   { title: 'Evaluation and observability', topics: ['Tracing and evaluation with LangSmith', 'Prompt and cost monitoring with Langfuse', 'Token usage and latency tuning'] },
   { title: 'Capstone project', topics: ['Design and ship a tool-connected agent', 'Evaluate it against a test set before release'] },
  ],
  tools: ['Python', 'FastAPI', 'LangChain', 'LangGraph', 'Azure AI Foundry', 'FAISS', 'Qdrant', 'LangSmith', 'Langfuse'],
 },
];

const formatDetails: Record<string, Omit<TrainingFormat, 'title'>> = {
 'Corporate training': { id: 'corporate', description: 'Upskilling engineering teams on full-stack delivery and Generative AI.' },
 'College & university sessions': { id: 'college', description: 'Workshops and sessions for students preparing for industry roles.' },
 'Own institute & online courses': { id: 'institute', description: 'Structured courses delivered in person and online.' },
 'Mentoring & internships': { id: 'mentoring', description: 'One-to-one guidance and real project experience for early-career engineers.' },
};
// Titles stay sourced from the confirmed training.formats list.
export const trainingFormats: TrainingFormat[] = training.formats.map(title => ({ title, id: formatDetails[title]?.id ?? title, description: formatDetails[title]?.description ?? '' }));

export function getCourse(id: string) { return courses.find(course => course.id === id); }
export function courseEnquiryHref(course?: Course) { return `mailto:${profile.email}?subject=${encodeURIComponent(course ? `Training enquiry: ${course.title}` : 'Training enquiry')}`; }
