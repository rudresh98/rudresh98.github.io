export type VisualNode = { id: string; label: string; detail?: string; x: number; y: number; kind?: 'primary' | 'plain' };
export type VisualEdge = { from: string; to: string };
type VisualBase = { title: string; architecture: string; impact?: { value: string; label: string }[] };
export type GraphVisual = VisualBase & { type: 'graph'; nodes: VisualNode[]; edges: VisualEdge[] };
export type AnalyticsVisual = VisualBase & { type: 'analytics' };
export type NodeSide = 'l' | 'r' | 't' | 'b';
export type SystemLane = { id: string; label: string; x: number; width: number };
// Detail lines split on \n; `short` replaces the label in compact gallery cards.
export type SystemNode = VisualNode & { lane: string; width?: number; height?: number; short?: string };
export type SystemEdge = VisualEdge & { id?: string; kind?: 'request' | 'async' | 'poll' | 'asset' | 'ops'; label?: string; duplex?: boolean; fromSide?: NodeSide; toSide?: NodeSide; d?: string; labelAt?: Point };
// `reverse` lists step edges whose packets travel from `to` back to `from`, e.g. a response.
export type SystemStep = { id: string; label: string; detail: string; nodes: string[]; edges: string[]; reverse?: string[] };
export type SystemVisual = VisualBase & { type: 'system'; journey: string; width: number; height: number; lanes: SystemLane[]; boundary: { label: string; x: number; y: number; width: number; height: number; railY: number; railLabel: string }; nodes: SystemNode[]; edges: SystemEdge[]; steps: SystemStep[] };
export type ProjectVisual = GraphVisual | AnalyticsVisual | SystemVisual;
export const edgeKey = (edge: SystemEdge) => edge.id ?? `${edge.from}>${edge.to}`;

// Coordinates describe illustrative topology, never a production screenshot.
export const projectVisuals: Record<string, ProjectVisual> = {
 'music-ai': {type:'system',title:'Agent request on Azure',journey:'Illustrative agent request',width:760,height:400,
  lanes:[{id:'client',label:'Client',x:0,width:136},{id:'api',label:'API · App Service',x:140,width:148},{id:'agent',label:'Agent · LangGraph',x:296,width:148},{id:'models',label:'Models & tools',x:448,width:148},{id:'data',label:'Data & retrieval',x:604,width:156}],
  boundary:{label:'AZURE',x:142,y:30,width:614,height:270,railY:316,railLabel:'CONNECTED SERVICES'},
  nodes:[
   {id:'react',lane:'client',label:'React app',detail:'Chat interface',x:8,y:128,width:118},
   {id:'fastapi',lane:'api',label:'FastAPI',detail:'Azure App Service',x:152,y:128,width:124},
   {id:'agent',lane:'agent',label:'LangGraph agent',short:'LangGraph',detail:'Single LangChain agent\nMemory · checkpoints',x:304,y:104,width:138,height:60,kind:'primary'},
   {id:'rag',lane:'agent',label:'RAG retriever',detail:'Document reading',x:304,y:216,width:128},
   {id:'gpt',lane:'models',label:'GPT-5.4',detail:'Azure AI Foundry',x:458,y:40,width:128},
   {id:'mini',lane:'models',label:'GPT-5.4 mini',detail:'Azure AI Foundry',x:458,y:132,width:128},
   {id:'tools',lane:'models',label:'Function App',detail:'Agent tools',x:458,y:216,width:128},
   {id:'cosmos',lane:'data',label:'Cosmos DB',detail:'Chats · agent state',x:618,y:86,width:128},
   {id:'faiss',lane:'data',label:'FAISS index',detail:'Document vectors',x:618,y:216,width:128},
   {id:'obs',lane:'api',label:'LangSmith · Langfuse',detail:'Traces · prompts · cost',x:148,y:330,width:176},
   {id:'music',lane:'models',label:'Music APIs',detail:'.NET product backend',x:458,y:330,width:150},
  ],
  edges:[
   {from:'react',to:'fastapi'},{from:'fastapi',to:'agent'},
   {from:'agent',to:'gpt'},{from:'agent',to:'mini'},{from:'agent',to:'tools'},
   {from:'tools',to:'music',duplex:true,fromSide:'b',toSide:'t'},
   {from:'agent',to:'rag',fromSide:'b',toSide:'t'},
   {from:'rag',to:'faiss',kind:'async',duplex:true,label:'vector search',d:'M 432 250 C 446 250, 446 278, 460 278 L 600 278 C 612 278, 612 250, 618 250',labelAt:{x:530,y:273}},
   {from:'agent',to:'cosmos',kind:'async',label:'state',d:'M 442 120 C 452 120, 450 108, 460 108 L 618 108',labelAt:{x:530,y:104}},
   {from:'fastapi',to:'obs',kind:'ops',label:'traces',fromSide:'b',toSide:'t'},
  ],
  steps:[
   {id:'ask',label:'Ask',detail:'The React app sends the user question to FastAPI on App Service.',nodes:['react','fastapi'],edges:['react>fastapi']},
   {id:'load',label:'Orchestrate',detail:'FastAPI invokes the LangGraph agent, which loads conversation state from Cosmos DB.',nodes:['fastapi','agent','cosmos'],edges:['fastapi>agent','agent>cosmos'],reverse:['agent>cosmos']},
   {id:'reason',label:'Reason',detail:'The agent reasons with GPT-5.4 and GPT-5.4 mini on Azure AI Foundry.',nodes:['agent','gpt','mini'],edges:['agent>gpt','agent>mini']},
   {id:'tools',label:'Call tools',detail:'Function App tools consume the existing .NET music APIs for product data.',nodes:['agent','tools','music'],edges:['agent>tools','tools>music']},
   {id:'retrieve',label:'Retrieve',detail:'RAG reads documents by searching the FAISS index for relevant passages.',nodes:['agent','rag','faiss'],edges:['agent>rag','rag>faiss']},
   {id:'respond',label:'Respond',detail:'The grounded answer returns through FastAPI to the React app.',nodes:['agent','fastapi','react'],edges:['fastapi>agent','react>fastapi'],reverse:['fastapi>agent','react>fastapi']},
   {id:'persist',label:'Persist',detail:'Cosmos DB stores the conversation, agent state, and metadata.',nodes:['agent','cosmos'],edges:['agent>cosmos']},
   {id:'trace',label:'Trace',detail:'LangSmith and Langfuse capture traces, evaluations, prompts, and cost.',nodes:['fastapi','obs'],edges:['fastapi>obs']},
  ],
  architecture:'A React chat interface calls FastAPI on Azure App Service, which runs a single LangChain and LangGraph agent with memory and checkpointing. The agent reasons with GPT-5.4 and GPT-5.4 mini through Azure AI Foundry, calls tools hosted on an Azure Function App that consume the existing .NET music APIs, and uses retrieval-augmented generation over a FAISS index to read documents. Azure Cosmos DB holds conversations, agent state, and metadata, while LangSmith and Langfuse support tracing, evaluation, prompt monitoring, and cost tracking.' },
 'supply-chain': {type:'graph',title:'Network simulation',nodes:[
  {id:'network',label:'Network',detail:'Routes & scenarios',x:30,y:40},
  {id:'agent',label:'Route agent',detail:'AI recommendations',x:30,y:225},
  {id:'engine',label:'Simulation',detail:'Async what-if engine',x:210,y:130,kind:'primary'},
  {id:'cost',label:'Cost models',detail:'Freight · SLA · capacity',x:390,y:40},
  {id:'data',label:'PostgreSQL',detail:'Network data',x:390,y:225},
 ],edges:[{from:'network',to:'engine'},{from:'agent',to:'engine'},{from:'engine',to:'cost'},{from:'engine',to:'data'}],architecture:'A modular FastAPI backend separates routes, services, schemas, and models. AI route recommendations and asynchronous simulations evaluate network scenarios and cost models, with PostgreSQL persistence and permission-controlled access.'},
 // Steps animate an illustrative booking request through the system; edges are referenced by edgeKey.
 'anchor': {type:'system',title:'Booking & redemption on AWS',journey:'Illustrative booking journey',width:760,height:400,
  lanes:[{id:'channels',label:'Host channels',x:0,width:136},{id:'frontend',label:'Frontend · React',x:140,width:148},{id:'api',label:'API',x:296,width:148},{id:'compute',label:'Compute · Lambda',x:448,width:148},{id:'data',label:'Data & messaging',x:604,width:156}],
  boundary:{label:'AWS CLOUD',x:294,y:30,width:462,height:362,railY:316,railLabel:'PROVISION · OBSERVE'},
  nodes:[
   {id:'wp',lane:'channels',label:'WordPress',detail:'Plugin embed',x:8,y:56,width:118},
   {id:'android',lane:'channels',label:'Android app',detail:'WebView host',x:8,y:136,width:118},
   {id:'web',lane:'channels',label:'Any website',detail:'Script embed',x:8,y:216,width:118},
   {id:'sdk',lane:'frontend',label:'Booking SDK',detail:'Booking engine\nGift cards · passes',x:148,y:104,width:124,height:60,kind:'primary'},
   {id:'dashboard',lane:'frontend',label:'Dashboard',detail:'Operator admin',x:148,y:236,width:124},
   {id:'gql',lane:'api',label:'GraphQL API',detail:'Queries · mutations',x:312,y:128,width:116,kind:'primary'},
   {id:'booking',lane:'compute',label:'Booking λ',detail:'Transfer · split',x:458,y:64,width:124},
   {id:'redeem',lane:'compute',label:'Redemption λ',detail:'Gift cards · passes',x:458,y:144,width:124},
   {id:'worker',lane:'compute',label:'Ticket worker',detail:'SQS consumer λ',x:458,y:236,width:124},
   {id:'s3',lane:'data',label:'Amazon S3',short:'S3',detail:'SDK bundle · assets',x:618,y:40,width:128},
   {id:'ddb',lane:'data',label:'DynamoDB',detail:'Bookings · tickets',x:618,y:104,width:128},
   {id:'sqs',lane:'data',label:'Amazon SQS',short:'SQS',detail:'Booking queue',x:618,y:176,width:128},
   {id:'sns',lane:'data',label:'Amazon SNS',short:'SNS',detail:'Confirmations',x:618,y:252,width:128},
   {id:'cfn',lane:'api',label:'CloudFormation',detail:'Infrastructure as code',x:304,y:330,width:150},
   {id:'cw',lane:'compute',label:'CloudWatch',detail:'Logs · metrics · alarms',x:470,y:330,width:150},
  ],
  edges:[
   {from:'wp',to:'sdk'},{from:'android',to:'sdk'},{from:'web',to:'sdk'},
   {from:'sdk',to:'gql'},{from:'dashboard',to:'gql'},
   {from:'gql',to:'booking'},{from:'gql',to:'redeem'},
   {from:'booking',to:'ddb'},{from:'redeem',to:'ddb'},{from:'booking',to:'sqs'},
   {from:'sqs',to:'worker',kind:'async'},{from:'worker',to:'ddb',kind:'async'},{from:'worker',to:'sns',kind:'async'},
   {id:'poll',from:'sdk',to:'gql',kind:'poll',label:'poll status',duplex:true,d:'M 252 164 C 252 210, 330 210, 330 172',labelAt:{x:291,y:216}},
   {from:'s3',to:'sdk',kind:'asset',label:'SDK bundle',d:'M 618 62 C 520 30, 260 34, 210 104',labelAt:{x:398,y:58}},
   {from:'cfn',to:'gql',kind:'ops',label:'deploys',fromSide:'t',toSide:'b'},
   {from:'cw',to:'worker',kind:'ops',label:'logs',fromSide:'t',toSide:'b'},
  ],
  steps:[
   {id:'embed',label:'Embed',detail:'S3 serves the SDK bundle into WordPress, Android, and web hosts.',nodes:['s3','sdk','wp','android','web'],edges:['s3>sdk','wp>sdk','android>sdk','web>sdk']},
   {id:'book',label:'Book',detail:'The SDK sends a booking mutation to the GraphQL API.',nodes:['sdk','gql'],edges:['sdk>gql']},
   {id:'resolve',label:'Resolve',detail:'GraphQL invokes the Booking Lambda resolver.',nodes:['gql','booking'],edges:['gql>booking']},
   {id:'queue',label:'Queue',detail:'A pending booking is written to DynamoDB and queued in SQS.',nodes:['booking','ddb','sqs'],edges:['booking>ddb','booking>sqs']},
   {id:'process',label:'Process',detail:'The ticket worker consumes SQS and confirms tickets in DynamoDB.',nodes:['sqs','worker','ddb'],edges:['sqs>worker','worker>ddb']},
   {id:'notify',label:'Notify',detail:'SNS publishes the booking confirmation.',nodes:['worker','sns'],edges:['worker>sns']},
   {id:'poll',label:'Poll',detail:'The SDK polls booking status over GraphQL until tickets are confirmed.',nodes:['sdk','gql'],edges:['poll']},
   {id:'redeem',label:'Redeem',detail:'Gift cards and passes redeem through the Redemption Lambda.',nodes:['sdk','gql','redeem','ddb'],edges:['sdk>gql','gql>redeem','redeem>ddb']},
  ],
  architecture:'The React booking SDK is the core engine for bookings, gift cards, passes, transfer, and split, embedded in host channels such as WordPress sites, Android apps, and other websites; a React dashboard serves operators. Both call a GraphQL API resolved by AWS Lambda functions over DynamoDB. Booking requests are queued in Amazon SQS and processed by a worker Lambda, Amazon SNS publishes confirmations, and the SDK polls booking status until tickets are confirmed. Amazon S3 serves the SDK bundle and assets, CloudFormation provisions the stack, and CloudWatch captures logs, metrics, and alarms. Frontend and SDK caching support a smoother checkout experience.',
  impact:[{value:'1,500+',label:'Transactions / six months'},{value:'2,000+',label:'Clients served'},{value:'40%',label:'Faster transactions'}]},
 'izo-sdwan': {type:'analytics',title:'Modular analytics workspace',architecture:'Microfrontends organize the telecommunications interface into modular features. Highcharts powers the interactive dashboard, alongside personalization, dark mode, and administration workflows.'},
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
