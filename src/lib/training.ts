// Browser-safe and asset-free so seo.ts (and through it vite.config.ts) can import it.
import { profile, training } from './portfolio';

export const courseCategories = ['All', 'Web & Backend', 'Data', 'Cloud & Infra', 'AI'] as const;
export type CourseCategory = Exclude<typeof courseCategories[number], 'All'>;
export type CourseModule = { title: string; topics: string[] };
export type Course = { id: 'full-stack' | 'backend' | 'database' | 'infra' | 'databricks' | 'genai' | 'fde'; title: string; category: CourseCategory; tagline: string; audience: string; summary: string; modules: CourseModule[]; tools: string[]; trending?: boolean };
export type TrainingFormat = { id: string; title: string; description: string };

// Course outlines drafted for Rudresh's review. Most draw on technologies verified on this site; the
// infrastructure and Databricks tracks cover tools he teaches that are not yet listed in his skills.
// Fees, durations, batch dates, and institution names are deliberately omitted until he confirms them.
export const courses: Course[] = [
 {
  id: 'full-stack',
  title: 'Full Stack Web Development',
  category: 'Web & Backend',
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
  id: 'backend',
  title: 'Backend Design with Node.js & Python',
  category: 'Web & Backend',
  tagline: 'Design APIs and services that scale with the business.',
  audience: 'Developers who want to design and own production-grade backend services',
  summary: 'Designing backend services in Node.js and Python—API contracts, architecture, security, asynchronous work, and performance—using patterns from production platforms.',
  modules: [
   { title: 'Backend fundamentals', topics: ['HTTP, REST principles, and the request lifecycle', 'The Node.js event loop', 'Async programming in Python'] },
   { title: 'API design', topics: ['Resource modeling and versioning', 'Validation and consistent error contracts', 'Choosing between REST and GraphQL'] },
   { title: 'Node.js services with Express', topics: ['Routing and middleware', 'Service and data-access layers', 'Testing API endpoints'] },
   { title: 'Python services with FastAPI', topics: ['Request and response schemas with Pydantic', 'Dependency injection', 'Async endpoints'] },
   { title: 'Clean architecture', topics: ['Modular routes, services, schemas, and models', 'Configuration across environments', 'Modular monolith versus microservices'] },
   { title: 'Authentication and security', topics: ['JWT with refresh-token rotation and replay detection', 'Role-based access control', 'Azure AD single sign-on'] },
   { title: 'Async work and integrations', topics: ['Message queues with Amazon SQS', 'Integrating third-party APIs', 'Caching for faster responses'] },
   { title: 'Capstone project', topics: ['Design, document, and build a tested backend service'] },
  ],
  tools: ['Node.js', 'Express', 'Python', 'FastAPI', 'TypeScript', 'GraphQL', 'JWT', 'Amazon SQS'],
 },
 {
  id: 'database',
  title: 'Database Design: SQL & NoSQL',
  category: 'Data',
  tagline: 'Model data right the first time.',
  audience: 'Developers and analysts who design or own application databases',
  summary: 'Relational and NoSQL data modeling, querying, and performance—choosing the right store and designing schemas that hold up as products grow.',
  modules: [
   { title: 'Data modeling fundamentals', topics: ['Entities, relationships, and normalization', 'Designing from access patterns', 'Choosing SQL or NoSQL'] },
   { title: 'Relational design with PostgreSQL and MySQL', topics: ['Keys, constraints, and joins', 'Indexes and query plans', 'Transactions'] },
   { title: 'ORMs and migrations', topics: ['Modeling with SQLAlchemy', 'Versioned schema changes with Alembic'] },
   { title: 'Document databases', topics: ['MongoDB schema design', 'Embedding versus referencing', 'Aggregation pipelines'] },
   { title: 'Key-value at scale', topics: ['DynamoDB partition and sort keys', 'Single-table design', 'Query optimization'] },
   { title: 'Graph and search', topics: ['Graph data with ArangoDB', 'Full-text search with Elasticsearch', 'Hosted search with Algolia'] },
   { title: 'Performance and operations', topics: ['Indexing strategy', 'Caching', 'Backups and recovery'] },
   { title: 'Capstone project', topics: ['Design the data layer for a real product across SQL and NoSQL stores'] },
  ],
  tools: ['PostgreSQL', 'MySQL', 'SQLAlchemy', 'MongoDB', 'DynamoDB', 'Azure Cosmos DB', 'ArangoDB', 'Elasticsearch'],
 },
 {
  id: 'infra',
  title: 'Cloud Infrastructure Setup',
  category: 'Cloud & Infra',
  tagline: 'From a laptop to a production-ready cloud environment.',
  audience: 'Developers and teams setting up or modernizing cloud infrastructure',
  summary: 'Setting up the infrastructure applications run on—cloud accounts, networking, compute, containers, CI/CD, and monitoring—on AWS and Azure.',
  modules: [
   { title: 'Cloud foundations', topics: ['AWS and Azure accounts, regions, and IAM', 'Cost awareness', 'The shared responsibility model'] },
   { title: 'Networking and security', topics: ['VPCs, VNets, subnets, and security groups', 'DNS and TLS', 'Secrets management'] },
   { title: 'Compute', topics: ['Virtual machines on EC2', 'Serverless with AWS Lambda', 'Azure Functions and App Service'] },
   { title: 'Containers', topics: ['Docker images and Compose', 'Container registries', 'Introduction to Kubernetes'] },
   { title: 'Infrastructure as Code', topics: ['Terraform basics', 'Reusable modules', 'Managing state'] },
   { title: 'CI/CD', topics: ['Pipelines with GitHub Actions and GitLab CI', 'Build, test, and deploy stages', 'Promoting across environments'] },
   { title: 'Monitoring and reliability', topics: ['Logs and metrics with CloudWatch', 'Application monitoring with Datadog', 'Alerts and runbooks'] },
   { title: 'Capstone project', topics: ['Provision and deploy a production-ready environment end to end'] },
  ],
  tools: ['AWS', 'Azure', 'EC2', 'AWS Lambda', 'Docker', 'Terraform', 'GitHub Actions', 'CloudWatch', 'Datadog'],
  trending: true,
 },
 {
  id: 'databricks',
  title: 'Data Engineering with Databricks',
  category: 'Data',
  tagline: 'Build reliable data pipelines on the lakehouse.',
  audience: 'Data engineers, analysts, and developers moving into data platforms',
  summary: 'Lakehouse fundamentals on Databricks—Spark, Delta Lake, pipelines, governance, and preparing data for analytics and AI.',
  modules: [
   { title: 'Lakehouse fundamentals', topics: ['Data lakes versus warehouses', 'Workspaces, clusters, and notebooks'] },
   { title: 'Spark essentials', topics: ['DataFrames with PySpark and Spark SQL', 'Transformations and actions', 'Partitioning'] },
   { title: 'Delta Lake', topics: ['ACID tables and schema enforcement', 'Time travel', 'Upserts with MERGE'] },
   { title: 'Data pipelines', topics: ['Medallion architecture: bronze, silver, and gold', 'Incremental ingestion with Auto Loader', 'Orchestration with Jobs and Workflows'] },
   { title: 'Governance with Unity Catalog', topics: ['Access control', 'Data lineage'] },
   { title: 'Performance and cost', topics: ['Cluster sizing', 'OPTIMIZE and Z-ordering', 'Caching'] },
   { title: 'Data for AI', topics: ['Feature preparation', 'Experiment tracking with MLflow', 'Vector search for retrieval-augmented generation'] },
   { title: 'Capstone project', topics: ['Build an end-to-end medallion pipeline from raw data to analytics-ready tables'] },
  ],
  tools: ['Databricks', 'Apache Spark', 'PySpark', 'Spark SQL', 'Delta Lake', 'Unity Catalog', 'MLflow', 'Python'],
  trending: true,
 },
 {
  id: 'genai',
  title: 'Generative AI & LLM Engineering',
  category: 'AI',
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
  trending: true,
 },
 {
  id: 'fde',
  title: 'Forward Deployed Engineering',
  category: 'AI',
  tagline: 'Ship AI solutions inside real customer environments.',
  audience: 'Engineers moving into customer-facing, solutions, or forward deployed roles',
  summary: 'Working embedded with customers to turn business problems into deployed AI systems—discovery, rapid prototyping, integration, and production hand-off.',
  modules: [
   { title: 'The FDE role', topics: ['Owning outcomes from discovery to deployment', 'Working across engineering, product, and customers'] },
   { title: 'Discovery and scoping', topics: ['Writing user stories with stakeholders', 'Translating business workflows into requirements', 'Defining success metrics'] },
   { title: 'Rapid prototyping', topics: ['LLM workflows and APIs with FastAPI and LangGraph', 'Demo-driven iteration with customer feedback'] },
   { title: 'Integrating with customer systems', topics: ['REST and GraphQL APIs and existing data stores', 'Azure AD SSO and role-based access', 'Cloud services on Azure and AWS'] },
   { title: 'Production readiness', topics: ['Structured outputs, retries, and validation', 'Tracing with LangSmith and Langfuse', 'Cost and latency tuning'] },
   { title: 'Delivery and communication', topics: ['Client updates and expectation setting', 'Tracking delivery in JIRA', 'Documentation and handover'] },
   { title: 'Capstone project', topics: ['Scope, prototype, and deploy an AI workflow for a realistic customer brief'] },
  ],
  tools: ['Python', 'FastAPI', 'LangGraph', 'Azure AI Foundry', 'Azure Cosmos DB', 'AWS', 'LangSmith', 'Langfuse', 'JIRA'],
  trending: true,
 },
];

const formatDetails: Record<string, Omit<TrainingFormat, 'title'>> = {
 'Corporate training': { id: 'corporate', description: 'Upskilling engineering teams on full-stack delivery, data, cloud, and Generative AI.' },
 'College & university sessions': { id: 'college', description: 'Workshops and sessions for students preparing for industry roles.' },
 'Own institute & online courses': { id: 'institute', description: 'Structured courses delivered in person and online.' },
 'Mentoring & internships': { id: 'mentoring', description: 'One-to-one guidance and real project experience for early-career engineers.' },
};
// Titles stay sourced from the confirmed training.formats list.
export const trainingFormats: TrainingFormat[] = training.formats.map(title => ({ title, id: formatDetails[title]?.id ?? title, description: formatDetails[title]?.description ?? '' }));

export function filterCourses(category: typeof courseCategories[number], list: Course[] = courses) { return category === 'All' ? list : list.filter(course => course.category === category); }
export function getCourse(id: string) { return courses.find(course => course.id === id); }
export function getNextCourse(id: string) {
 const index = courses.findIndex(course => course.id === id);
 return index < 0 ? undefined : courses[(index + 1) % courses.length];
}
export function coursePath(id: Course['id']) { return `/training/${id}`; }
export function courseEnquiryHref(course?: Course) { return `mailto:${profile.email}?subject=${encodeURIComponent(course ? `Training enquiry: ${course.title}` : 'Training enquiry')}`; }
