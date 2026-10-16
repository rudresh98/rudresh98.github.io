// Verified toolkit: every skill appears on the resume, and every usage line and project link
// restates resume or case-study facts. General "what is it" copy lives in skill-information.ts.
export const skillGroups = [
 { id: 'frontend', label: 'Frontend' },
 { id: 'backend', label: 'Backend' },
 { id: 'cloud', label: 'Cloud & DevOps' },
 { id: 'genai', label: 'GenAI' },
 { id: 'data', label: 'Databases' },
 { id: 'architecture', label: 'Tools & Architecture' },
] as const;
export type SkillGroup = typeof skillGroups[number]['id'];
export type SkillFilter = 'all' | SkillGroup;
export const skillFilters: { id: SkillFilter; label: string }[] = [{ id: 'all', label: 'All Skills' }, ...skillGroups];

export type Skill = { id: string; name: string; group: SkillGroup; usage: string; projects: string[] };
export const skills: Skill[] = [
 { id:'react', name:'React / Next.js', group:'frontend', usage:'Customer booking, redemption, and Manage My Booking journeys for Anchor, plus the modular IZO-SDWAN interface.', projects:['anchor','izo-sdwan'] },
 { id:'angular', name:'Angular', group:'frontend', usage:'Rebuilt the complete automated reporting interface in Angular 12 with architectural improvements.', projects:['reporting'] },
 { id:'typescript', name:'TypeScript / JavaScript', group:'frontend', usage:'The working language across React, Angular, and Node.js codebases, typed for long-term maintainability.', projects:['anchor','reporting'] },
 { id:'react-native', name:'React Native', group:'frontend', usage:'Cross-platform mobile interfaces built with the same React component patterns as the web.', projects:[] },
 { id:'state', name:'Redux / TanStack Query', group:'frontend', usage:'Predictable client state and cached, synchronized server data in React applications.', projects:[] },
 { id:'html-css', name:'HTML5 / CSS3', group:'frontend', usage:'Semantic, responsive interfaces, including the dark mode introduced for IZO-SDWAN accessibility.', projects:['izo-sdwan'] },
 { id:'tailwind', name:'Tailwind CSS / shadcn', group:'frontend', usage:'Utility-first styling on accessible component primitives, including this portfolio.', projects:[] },
 { id:'material-ui', name:'Material UI', group:'frontend', usage:'Themeable React components for consistent, fast interface delivery.', projects:[] },
 { id:'node', name:'Node.js / Express', group:'backend', usage:'Booking and redemption services for Anchor; upgraded the runtime from Node.js v14 to v20.', projects:['anchor'] },
 { id:'fastapi', name:'Python / FastAPI', group:'backend', usage:'Modular backends for the Supply Chain Digital Twin and the music industry AI agent platform.', projects:['supply-chain','music-ai'] },
 { id:'apis', name:'REST APIs / GraphQL', group:'backend', usage:'REST APIs for networks, simulations, lead times, users, and permission-based navigation.', projects:['supply-chain'] },
 { id:'auth', name:'RBAC / JWT / Azure AD SSO', group:'backend', usage:'Application-level RBAC, JWT with refresh-token rotation and replay detection, and Azure AD single sign-on.', projects:['supply-chain'] },
 { id:'azure', name:'Microsoft Azure', group:'cloud', usage:'Azure AI Foundry, Cosmos DB, and Azure AD powering agent and supply chain platforms.', projects:['music-ai','supply-chain'] },
 { id:'aws', name:'AWS', group:'cloud', usage:'Cloud services behind Anchor messaging and data access and the reporting tool’s uploads.', projects:['anchor','reporting'] },
 { id:'lambda', name:'AWS Lambda', group:'cloud', usage:'Event-driven, serverless functions without managing servers.', projects:[] },
 { id:'s3', name:'Amazon S3', group:'cloud', usage:'Automated report generation with seamless uploads to S3.', projects:['reporting'] },
 { id:'sqs-ses', name:'Amazon SQS / SES', group:'cloud', usage:'Integrated SQS to make Anchor’s system messaging more reliable; SES for application email.', projects:['anchor'] },
 { id:'monitoring', name:'CloudWatch / DataDog', group:'cloud', usage:'Logs, metrics, and alerts for understanding and troubleshooting production health.', projects:[] },
 { id:'langgraph', name:'LangChain / LangGraph', group:'genai', usage:'Stateful, multi-step agent workflows for music industry, supply chain, and travel AI agents.', projects:['music-ai','supply-chain'] },
 { id:'llms', name:'Large Language Models', group:'genai', usage:'LLM workflows and APIs that automate supply chain processes and power intelligent responses.', projects:['supply-chain','music-ai'] },
 { id:'ai-foundry', name:'Azure AI Foundry', group:'genai', usage:'Model integrations behind the music platform and the travel AI agent.', projects:['music-ai'] },
 { id:'agents', name:'AI Agents & Tool Calling', group:'genai', usage:'Music APIs connected as agent tools, and an AI agent that recommends optimal supply chain routes.', projects:['music-ai','supply-chain'] },
 { id:'memory', name:'Memory & Checkpointing', group:'genai', usage:'Agent memory, checkpointed state, and multi-step execution that can resume and be inspected.', projects:['music-ai'] },
 { id:'structured-outputs', name:'Structured Outputs', group:'genai', usage:'Schema-constrained responses with retries, validation, and error handling.', projects:['music-ai'] },
 { id:'rag', name:'RAG & Vector Search', group:'genai', usage:'Retrieval with vector stores and lexical ranking: FAISS, Qdrant, and BM25.', projects:[] },
 { id:'langsmith', name:'LangSmith', group:'genai', usage:'Tracing, debugging, and evaluation of agent runs.', projects:['music-ai'] },
 { id:'langfuse', name:'Langfuse', group:'genai', usage:'Prompt monitoring, cost tracking, and LLM observability.', projects:['music-ai'] },
 { id:'llm-performance', name:'Token & Latency Tuning', group:'genai', usage:'Optimized API performance, token usage, and response latency for agent workflows.', projects:['music-ai'] },
 { id:'postgres', name:'PostgreSQL / MySQL / Supabase', group:'data', usage:'Relational persistence for supply chain networks, simulations, and role-based permissions.', projects:['supply-chain'] },
 { id:'sqlalchemy', name:'SQLAlchemy / Alembic', group:'data', usage:'ORM-backed RBAC plus versioned schema migrations for PostgreSQL.', projects:['supply-chain'] },
 { id:'dynamodb', name:'DynamoDB', group:'data', usage:'Optimized query performance on Anchor for faster retrieval and better scalability.', projects:['anchor'] },
 { id:'cosmos', name:'Azure Cosmos DB', group:'data', usage:'Conversations, agent state, and metadata for AI agents.', projects:['music-ai'] },
 { id:'mongodb', name:'MongoDB / ArangoDB', group:'data', usage:'Document and multi-model storage for flexible, evolving data shapes.', projects:[] },
 { id:'redshift', name:'Amazon Redshift', group:'data', usage:'SQL analytics across large datasets in a managed cloud warehouse.', projects:[] },
 { id:'search', name:'Algolia / Elasticsearch', group:'data', usage:'Algolia city search across multiple Anchor locations; Elasticsearch for indexed search.', projects:['anchor'] },
 { id:'highcharts', name:'Highcharts Dashboards', group:'data', usage:'An interactive IZO-SDWAN dashboard for clearer data visualization.', projects:['izo-sdwan'] },
 { id:'simulation', name:'Simulation & KPI Modeling', group:'data', usage:'An asynchronous what-if engine with KPI calculation and freight, SLA, and capacity cost models.', projects:['supply-chain'] },
 { id:'clean-architecture', name:'Clean Architecture', group:'architecture', usage:'Modular routes, services, schemas, and models in the Supply Chain Digital Twin.', projects:['supply-chain'] },
 { id:'microfrontends', name:'Micro Frontends', group:'architecture', usage:'Streamlined IZO-SDWAN development and administration with modular frontends.', projects:['izo-sdwan'] },
 { id:'integration', name:'API & System Integration', group:'architecture', usage:'Connected Algolia, AWS SQS, Azure AD, and internal and external music APIs into products.', projects:['anchor','supply-chain','music-ai'] },
 { id:'performance', name:'Performance Optimization', group:'architecture', usage:'SDK and frontend caching, DynamoDB tuning, and a runtime upgrade; transfer and split became 40% faster.', projects:['anchor'] },
 { id:'debugging', name:'Debugging & Troubleshooting', group:'architecture', usage:'Resolved 15 complex application issues within a single month.', projects:['reporting'] },
 { id:'git', name:'GitHub / GitLab', group:'architecture', usage:'Version control, code review, and collaborative delivery.', projects:[] },
 { id:'jira', name:'Jira & Client Delivery', group:'architecture', usage:'Coordinated user stories with clients and tracked delivery in JIRA.', projects:['izo-sdwan'] },
];

export function getSkill(id: string) { return skills.find(skill => skill.id === id); }
export function filterSkills(filter: SkillFilter) { return filter === 'all' ? skills : skills.filter(skill => skill.group === filter); }
export function skillsForProject(projectId: string) { return skills.filter(skill => skill.projects.includes(projectId)); }
export function groupLabel(group: SkillGroup) { return skillGroups.find(item => item.id === group)?.label ?? group; }

export type FeaturedArea = { id: string; title: string; icon: 'code' | 'cloud' | 'bot' | 'activity'; description: string; skills: string[]; filters: SkillGroup[] };
export const featuredAreas: FeaturedArea[] = [
 { id:'full-stack', title:'Full Stack Engineering', icon:'code', description:'Customer-facing React and Angular products backed by Node.js and FastAPI services, from booking and redemption flows to modular dashboards.', skills:['react','angular','typescript','node','fastapi','apis'], filters:['frontend','backend'] },
 { id:'cloud', title:'Cloud & Infrastructure', icon:'cloud', description:'Azure and AWS services connecting applications, persistence, identity, and asynchronous messaging.', skills:['azure','aws','sqs-ses','s3','lambda'], filters:['cloud'] },
 { id:'genai', title:'Generative AI & Agentic Systems', icon:'bot', description:'LangGraph agents that coordinate models, tools, memory, and checkpointed state, with structured outputs and measurable execution.', skills:['langgraph','llms','agents','memory','rag','ai-foundry'], filters:['genai'] },
 { id:'data', title:'Data & Observability', icon:'activity', description:'Relational and NoSQL data models, analytical dashboards, and tracing that keep products measurable and agent runs inspectable.', skills:['postgres','dynamodb','cosmos','highcharts','langsmith','langfuse'], filters:['data'] },
];

export type Capability = { title: string; description: string; projects: string[] };
export const capabilities: Capability[] = [
 { title:'Scalable full stack applications', description:'Customer-facing journeys and the services behind them, including transfer and split for 2,000+ clients.', projects:['anchor','izo-sdwan'] },
 { title:'Cloud-integrated platforms', description:'Applications wired to managed cloud storage, messaging, identity, and data services.', projects:['anchor','reporting'] },
 { title:'AI agents and LLM workflows', description:'Tool-connected agents with memory, checkpointing, structured outputs, and multi-step execution.', projects:['music-ai','supply-chain'] },
 { title:'API integrations and enterprise software', description:'Secure REST APIs, permission-based access, single sign-on, and third-party integrations.', projects:['supply-chain','anchor'] },
 { title:'Analytics and observability', description:'Interactive dashboards, simulations with KPI calculation, and traceable, cost-aware AI execution.', projects:['izo-sdwan','supply-chain','music-ai'] },
 { title:'Performance and maintainable architecture', description:'Caching, query tuning, runtime upgrades, clean architecture, and focused debugging.', projects:['anchor','reporting','supply-chain'] },
];

export type EcosystemNode = { id: string; label: string; description: string; skills: string[] };
export type EcosystemFlow = { id: string; title: string; nodes: EcosystemNode[] };
export const ecosystemFlows: EcosystemFlow[] = [
 { id:'product', title:'Product delivery', nodes:[
  { id:'frontend', label:'Frontend', description:'Interfaces customers and operators use every day.', skills:['react','angular','typescript'] },
  { id:'apis', label:'Backend APIs', description:'Typed services, authentication, and integrations.', skills:['node','fastapi','apis','auth'] },
  { id:'databases', label:'Databases', description:'Persistence modeled and tuned for each access pattern.', skills:['postgres','dynamodb','cosmos'] },
  { id:'cloud', label:'Cloud Infrastructure', description:'Managed services for storage, messaging, and identity.', skills:['azure','aws','sqs-ses','s3'] },
 ] },
 { id:'intelligence', title:'Intelligent systems', nodes:[
  { id:'llms', label:'LLMs', description:'Hosted models for reasoning and intelligent responses.', skills:['llms','ai-foundry'] },
  { id:'retrieval', label:'RAG & Retrieval', description:'Context from vector search and connected tools.', skills:['rag','agents'] },
  { id:'orchestration', label:'Agent Orchestration', description:'Stateful, multi-step workflows with validated outputs.', skills:['langgraph','memory','structured-outputs'] },
  { id:'observability', label:'Evaluation & Observability', description:'Tracing, evaluation, prompt monitoring, and cost tracking.', skills:['langsmith','langfuse','llm-performance'] },
 ] },
];
