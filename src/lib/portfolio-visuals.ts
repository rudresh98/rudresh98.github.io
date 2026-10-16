export type VisualNode = { id: string; label: string; detail?: string; x: number; y: number; kind?: 'primary' | 'plain' };
export type VisualEdge = { from: string; to: string };
export type ProjectVisual = { type: 'graph' | 'analytics'; title: string; nodes: VisualNode[]; edges: VisualEdge[]; architecture: string; impact?: { value: string; label: string }[] };

// Coordinates describe illustrative topology, never a production screenshot.
export const projectVisuals: Record<string, ProjectVisual> = {
 'music-ai': { type:'graph', title:'Agent execution graph', nodes:[
  {id:'api',label:'FastAPI',detail:'Request interface',x:30,y:130},
  {id:'agent',label:'LangGraph',detail:'Agent orchestration',x:210,y:130,kind:'primary'},
  {id:'model',label:'Azure AI',detail:'Model integrations',x:390,y:40},
  {id:'tools',label:'Music APIs',detail:'Connected tools',x:390,y:130},
  {id:'memory',label:'Cosmos DB',detail:'Memory & state',x:210,y:235},
  {id:'trace',label:'Tracing',detail:'LangSmith · Langfuse',x:390,y:235},
 ],edges:[{from:'api',to:'agent'},{from:'agent',to:'model'},{from:'agent',to:'tools'},{from:'agent',to:'memory'},{from:'agent',to:'trace'}], architecture:'FastAPI connects request handling to LangGraph workflows, Azure AI models, and music APIs. Cosmos DB holds conversations and agent state; LangSmith and Langfuse support tracing, evaluation, and prompt monitoring.' },
 'supply-chain': {type:'graph',title:'Network simulation',nodes:[
  {id:'network',label:'Network',detail:'Routes & scenarios',x:30,y:40},
  {id:'agent',label:'Route agent',detail:'AI recommendations',x:30,y:225},
  {id:'engine',label:'Simulation',detail:'Async what-if engine',x:210,y:130,kind:'primary'},
  {id:'cost',label:'Cost models',detail:'Freight · SLA · capacity',x:390,y:40},
  {id:'data',label:'PostgreSQL',detail:'Network data',x:390,y:225},
 ],edges:[{from:'network',to:'engine'},{from:'agent',to:'engine'},{from:'engine',to:'cost'},{from:'engine',to:'data'}],architecture:'A modular FastAPI backend separates routes, services, schemas, and models. AI route recommendations and asynchronous simulations evaluate network scenarios and cost models, with PostgreSQL persistence and permission-controlled access.'},
 'anchor': {type:'graph',title:'Booking to redemption',nodes:[
  {id:'ui',label:'React',detail:'Customer experience',x:30,y:130},
  {id:'api',label:'Booking APIs',detail:'Node.js services',x:210,y:130,kind:'primary'},
  {id:'redeem',label:'Redemption',detail:'Gift cards & passes',x:390,y:40},
  {id:'db',label:'DynamoDB',detail:'Optimized queries',x:390,y:130},
  {id:'sqs',label:'AWS SQS',detail:'Messaging',x:390,y:225},
 ],edges:[{from:'ui',to:'api'},{from:'api',to:'redeem'},{from:'api',to:'db'},{from:'api',to:'sqs'}],architecture:'React customer journeys connect to Node.js booking and redemption capabilities, optimized DynamoDB access, and AWS SQS messaging. Frontend and SDK caching support a smoother checkout experience.',impact:[{value:'1,500+',label:'Transactions / six months'},{value:'2,000+',label:'Clients served'},{value:'40%',label:'Faster transactions'}]},
 'izo-sdwan': {type:'analytics',title:'Modular analytics workspace',nodes:[],edges:[],architecture:'Microfrontends organize the telecommunications interface into modular features. Highcharts powers the interactive dashboard, alongside personalization, dark mode, and administration workflows.'},
 'reporting': {type:'graph',title:'Automated reporting pipeline',nodes:[
  {id:'ui',label:'Angular 12',detail:'Reporting interface',x:30,y:100},
  {id:'report',label:'Reports',detail:'Automated generation',x:210,y:100,kind:'primary'},
  {id:'cloud',label:'Amazon S3',detail:'Cloud uploads',x:390,y:100},
  {id:'quality',label:'Debugging',detail:'Application stability',x:210,y:225},
 ],edges:[{from:'ui',to:'report'},{from:'report',to:'cloud'},{from:'quality',to:'report'}],architecture:'The modernized Angular 12 interface supports automated report generation and Amazon S3 uploads. Targeted debugging and architectural improvements address application stability.',impact:[{value:'15',label:'Issues resolved / one month'}]},
};

export const architectureLayers = [
 {id:'interface',label:'Interface',icon:'code',description:'Customer-facing applications and modular interfaces built with React and Angular.'},
 {id:'api',label:'APIs',icon:'workflow',description:'Structured services and integrations using Node.js, FastAPI, REST, and GraphQL.'},
 {id:'cloud',label:'Cloud',icon:'cloud',description:'Azure and AWS services connect applications, persistence, and asynchronous workflows.'},
 {id:'ai',label:'AI orchestration',icon:'bot',description:'LangGraph workflows coordinate models, tools, memory, and multi-step execution.'},
 {id:'data',label:'Data',icon:'database',description:'Data models, SQL queries, simulations, and analytical interfaces support product decisions.'},
 {id:'observe',label:'Observability',icon:'activity',description:'Tracing, evaluation, and prompt monitoring make agent execution easier to inspect and improve.'},
] as const;
export type Point = { x: number; y: number };
export type HeroPanel = { id: string; index: string; title: string; icon: 'code' | 'cloud' | 'bot' | 'activity'; detail: 'request' | 'queue' | 'steps' | 'trace'; stack: string[]; description: string; x: number; y: number; width: number; anchor: Point; hubAnchor: Point; float?: boolean };
export type HeroSystem = { width: number; height: number; hub: { label: string; detail: string; x: number; y: number; width: number; height: number }; panels: [HeroPanel, ...HeroPanel[]] };
// Hero system map shares one 560×520 coordinate space between the SVG edges and HTML panels.
export const heroSystem: HeroSystem = {
 width: 560, height: 520,
 hub: { label: 'Product system', detail: 'Build · ship · observe', x: 196, y: 226, width: 168, height: 64 },
 panels: [
  { id:'full-stack', index:'01', title:'Full Stack Engineering', icon:'code', detail:'request', stack:['React','Node.js','FastAPI'], description:'Customer-facing React and Angular applications backed by Node.js and FastAPI services, from booking flows to modular dashboards.', x:8, y:14, width:220, anchor:{x:228,y:52}, hubAnchor:{x:272,y:226} },
  { id:'cloud', index:'02', title:'Cloud Infrastructure', icon:'cloud', detail:'queue', stack:['Azure','AWS','SQS'], description:'Azure and AWS services, including Lambda, S3, SQS, DynamoDB, and Cosmos DB, connecting applications, persistence, and asynchronous workflows.', x:332, y:50, width:220, anchor:{x:332,y:88}, hubAnchor:{x:288,y:226}, float:true },
  { id:'ai', index:'03', title:'AI Agents & RAG', icon:'bot', detail:'steps', stack:['LangGraph','Azure AI Foundry','Vector DBs'], description:'LangGraph agents coordinating Azure AI models, tools, memory, and checkpointing, with structured outputs, retries, and validation.', x:0, y:330, width:228, anchor:{x:228,y:368}, hubAnchor:{x:272,y:290}, float:true },
  { id:'data', index:'04', title:'Data & Observability', icon:'activity', detail:'trace', stack:['PostgreSQL','LangSmith','Langfuse'], description:'Data models, analytical dashboards, and LangSmith and Langfuse tracing that keep products measurable and agent execution easy to inspect.', x:324, y:350, width:228, anchor:{x:324,y:388}, hubAnchor:{x:288,y:290} },
 ],
};
