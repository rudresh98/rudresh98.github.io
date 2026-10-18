export const profile = {
  name: "Rudresh Oza",
  role: "Forward Deployed Engineer (FDE)",
  email: "ozarudresh18@gmail.com",
  location: "Jaipur, India",
  experience: "6+",
  availability: "Open to international remote opportunities",
  timezone: "IST (UTC+5:30)",
  linkedin: "https://www.linkedin.com/in/rudreshoza/",
  github: "https://github.com/rudresh98",
};
export const achievements = {
  transactions: 15000,
  clients: 200000,
  transactionSpeedPercent: 40,
  issuesResolved: 15,
  transactionMonths: 6,
  issueMonths: 1,
  codeLines: 1000000000,
  studentsTrained: 5000,
  trainingYears: 5,
};
export type Credential = {
  value: number;
  suffix: string;
  label: string;
  context: string;
  // "compact" shows the verified number abbreviated (2000 → 2K); screen readers still hear the full figure.
  format?: "full" | "compact";
};
// Hero credibility strip: every value is a verified achievement above, never a new figure.
export const heroCredentials: Credential[] = [
  {
    value: Number.parseInt(profile.experience),
    suffix: "+",
    label: "Years of professional engineering",
    context: "Since 2020",
  },
  {
    value: achievements.clients,
    suffix: "+",
    label: "Clients served by transfer & split",
    context: "Full stack · Anchor",
    format: "compact",
  },
  {
    value: achievements.transactions,
    suffix: "+",
    label: "Redemption transactions in six months",
    context: "Product impact",
    format: "compact",
  },
  {
    value: achievements.transactionSpeedPercent,
    suffix: "%",
    label: "Faster transfer & split transactions",
    context: "Performance",
  },
  {
    value: achievements.studentsTrained,
    suffix: "+",
    label: "Students trained in full-stack & GenAI",
    context: "Training · 5 years",
    format: "compact",
  },
];
export const categories = [
  "All",
  "Full Stack",
  "Mobile",
  "Web",
  "Cloud",
  "GenAI",
  "Data Engineering",
] as const;
export type Category = (typeof categories)[number];
export type ProjectLink = { label: string; url: string };
export type Project = {
  id: string;
  title: string;
  category: Category;
  alsoIn?: Category[];
  tags: string[];
  description: string;
  context: string;
  contributions: string[];
  outcome: string;
  nodes: string[];
  client?: string;
  links?: ProjectLink[];
};
export const projects: Project[] = [
  {
    id: "music-ai",
    title: "AI Agent Platform",
    category: "GenAI",
    client: "Pollstar",
    links: [{ label: "Visit pollstar.com", url: "https://pollstar.com/" }],
    tags: [
      "LangGraph",
      "Azure",
      "FastAPI",
      "RAG",
      "React",
      "Tailwind CSS",
      "shadcn",
    ],
    description:
      "Intelligent, tool-connected agents for the music industry. Built for multi-step execution and production observability.",
    context:
      "Pollstar, a live-entertainment industry publication, connecting language models with internal and external music APIs through a web app and agent.",
    contributions: [
      "Built the web interface with React, Tailwind CSS, and shadcn.",
      "Developed backend APIs and agent workflows using LangChain and LangGraph.",
      "Integrated Azure AI Foundry models and Azure Cosmos DB for conversations, agent state, and metadata.",
      "Implemented memory, checkpointing, multi-step execution, structured outputs, retries, and validation.",
      "Used LangSmith for tracing and evaluation and Langfuse for prompt monitoring and cost tracking.",
    ],
    outcome:
      "Delivered tool-connected agent workflows with observable execution; optimized API performance, token usage, and response latency.",
    nodes: [
      "FastAPI",
      "LangGraph agent",
      "GPT-5.4",
      "Function App tools",
      "FAISS RAG",
      "Cosmos DB",
    ],
  },
  {
    id: "supply-chain",
    title: "Supply Chain Digital Twin",
    category: "Cloud",
    tags: ["Next.js", "FastAPI", "Supabase", "AWS"],
    description:
      "AI-assisted route recommendations and asynchronous what-if simulations for complex supply chain networks.",
    context:
      "A digital twin platform for evaluating supply chain routes, network scenarios, and operational KPIs, built as a Next.js monorepo, a FastAPI backend, and Supabase on AWS.",
    contributions: [
      "Architected a modular FastAPI backend with routes, services, schemas, and models, deployed on Amazon ECS.",
      "Built the Next.js monorepo frontend for networks, scenarios, and simulation results, deployed as a Docker container on Amazon ECS.",
      "Built an AI route-recommendation agent and an asynchronous simulation engine on AWS Lambda workers fed by Amazon SQS.",
      "Developed cost models for freight, expedite penalties, SLA violations, and capacity utilization.",
      "Persisted networks, scenarios, and simulation results in Supabase PostgreSQL through its PostgREST API, with Alembic schema migrations, and stored documents in Amazon S3.",
      "Implemented RBAC, JWT authentication, refresh-token rotation, replay detection, and Azure AD SSO.",
      "Monitored the FastAPI service on ECS and the Lambda workers with CloudWatch logs and metrics.",
    ],
    outcome:
      "Enabled route recommendations, what-if analysis, and permission-controlled network and simulation workflows.",
    nodes: [
      "Next.js on ECS",
      "FastAPI on ECS",
      "SQS + Lambda simulations",
      "Supabase",
      "S3 documents",
    ],
  },
  {
    id: "anchor",
    title: "Booking & Redemption Platform",
    category: "Full Stack",
    tags: ["React", "GraphQL", "AWS Lambda", "DynamoDB"],
    description:
      "Customer-facing booking, gift card redemption, and seamless transaction workflows for Anchor.",
    context:
      "Anchor, an operations and reservations platform, serving customer booking and redemption experiences.",
    contributions: [
      "Developed Gift Card and Passes redemption and Manage My Booking capabilities.",
      "Built transfer and split functionalities for more than 2,000 clients.",
      "Integrated Algolia city search and AWS SQS messaging; optimized DynamoDB queries.",
      "Upgraded Node.js from v14 to v20 and implemented SDK and frontend caching.",
    ],
    outcome:
      "1,500+ new transactions within six months; transfer and split improvements served 2,000+ clients and improved transaction speed by 40%.",
    nodes: ["Booking SDK", "GraphQL API", "AWS Lambda", "DynamoDB", "SQS"],
  },
  {
    id: "izo-sdwan",
    title: "Telecommunication Web Application",
    category: "Data Engineering",
    tags: ["Angular", "Microfrontends", "Node.js", "ArangoDB"],
    description:
      "Modular interfaces and interactive analytical dashboards for the IZO-SDWAN telecommunications product.",
    context:
      "A telecommunications web application with modular administration and analytical interfaces.",
    contributions: [
      "Implemented microfrontends to streamline development and administration.",
      "Built an interactive dashboard using Highcharts.",
      "Developed a personification feature for user customization.",
      "Introduced dark mode and collaborated with clients on user stories, tracking delivery in JIRA.",
    ],
    outcome:
      "Delivered modular frontend features, interactive data visualization, and user customization.",
    nodes: [
      "Angular microfrontends",
      "Socket.IO",
      "Node.js",
      "ArangoDB",
      "SD-WAN feed",
    ],
  },
  {
    id: "reporting",
    title: "Automated Reporting Tool",
    category: "Cloud",
    tags: ["Angular", "Amazon S3", "Automation"],
    description:
      "A redesigned enterprise reporting experience with automated report generation and cloud uploads.",
    context:
      "A cloud-secured managed reporting tool requiring UI modernization and reliable reporting workflows.",
    contributions: [
      "Revamped the complete interface using Angular 12 with architectural improvements.",
      "Automated report generation and uploads to Amazon S3.",
      "Resolved 15 complex application issues within a single month through targeted debugging.",
    ],
    outcome:
      "Modernized the reporting interface and improved stability by resolving 15 issues in one month.",
    nodes: ["Report generation", "Angular UI", "Amazon S3", "Debugging"],
  },
  {
    id: "death-portal",
    title: "Death Portal",
    category: "Mobile",
    tags: ["React Native", "Node.js", "GraphQL", "AWS Lambda"],
    description:
      "A cross-platform mobile app that helps families manage after-death administration on iOS and Android.",
    context:
      "A freelance engagement building a mobile product that guides families through the administration that follows a death.",
    contributions: [
      "Built the iOS and Android app from a single React Native codebase.",
      "Developed Node.js GraphQL APIs on AWS Lambda with MongoDB persistence.",
      "Stored family documents in Amazon S3 and defined infrastructure with AWS CloudFormation.",
      "Monitored the platform with Amazon CloudWatch and Datadog.",
    ],
    outcome:
      "Delivered a cross-platform mobile app on a serverless, observable AWS backend.",
    nodes: [
      "React Native app",
      "GraphQL API",
      "AWS Lambda",
      "MongoDB",
      "Amazon S3",
    ],
  },
  {
    id: "plant-health",
    title: "Plant Health Advisor",
    category: "Mobile",
    client: "Hydro Farm Technologies",
    links: [
      {
        label: "Get Genie AI on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.hydrofarmtech.Genie_AI",
      },
    ],
    tags: ["React Native", "TensorFlow Lite", "Python", "Android"],
    description:
      "An Android garden app that detects plant deficiencies from photos and recommends products to treat them.",
    context:
      "A freelance garden-care app, published on Google Play as Genie AI, where users photograph their plants to diagnose deficiencies across 10 supported plant species.",
    contributions: [
      "Built the Android app in React Native, with photo upload and results screens.",
      "Trained a TensorFlow CNN on images of 10 plant species and ran it on-device with TensorFlow Lite.",
      "Developed a Python API that maps detected deficiencies to recommended products.",
    ],
    outcome:
      "Delivered on-device plant deficiency detection with product recommendations in a single Android app.",
    nodes: [
      "React Native app",
      "TFLite model",
      "Python API",
      "Product database",
    ],
  },
  {
    id: "mealboy",
    title: "MealBoy Ordering Platform",
    category: "Full Stack",
    client: "MealBoy",
    links: [{ label: "Visit mealboy.nl", url: "https://mealboy.nl/" }],
    tags: ["Next.js", "Tailwind CSS", "shadcn", "Node.js", "MongoDB"],
    description:
      "Online ordering for delivery, pickup, and catering for an Indian kitchen in Eindhoven, the Netherlands.",
    context:
      "MealBoy, an Indian food business in Eindhoven, needed a web platform where customers order and pay online for delivery or pickup and request catering.",
    contributions: [
      "Built the ordering web app with Next.js, Tailwind CSS, and shadcn.",
      "Developed the Node.js backend with MongoDB persistence.",
      "Implemented user authentication with accounts and saved addresses.",
    ],
    outcome:
      "Delivered a live ordering platform with customer accounts for delivery, pickup, and catering.",
    nodes: ["Next.js storefront", "Node.js API", "MongoDB", "Auth", "Orders"],
  },
  {
    id: "tareek",
    title: "Tareek Dating App",
    category: "Mobile",
    client: "Tareek",
    tags: ["iOS & Android", "Web app"],
    description:
      "A dating app for the Canadian market, delivered as an iOS and Android mobile app and a web app.",
    context:
      "Tareek, a dating product for the Canadian market, delivered as a mobile app and a web app.",
    contributions: ["Built the dating experience for mobile and the web."],
    outcome: "Delivered the Tareek dating app across mobile and web.",
    nodes: ["Mobile app", "Web app", "Backend API", "Profiles & matching"],
  },
  {
    id: "maitrii-infotech",
    title: "Maitrii Infotech Website",
    category: "Web",
    client: "Maitrii Infotech",
    links: [
      { label: "Visit live site", url: "https://www.maitriiinfotech.com/" },
    ],
    tags: ["Next.js", "GSAP", "Responsive design"],
    description:
      "The marketing website for Maitrii Infotech, a Jaipur-based custom software studio, with GSAP-driven motion.",
    context:
      "A static marketing website for Maitrii Infotech, built with Next.js and animated with GSAP.",
    contributions: [
      "Built the static website with Next.js.",
      "Created scroll and entrance animations with GSAP.",
      "Implemented responsive layouts across screen sizes.",
    ],
    outcome:
      "Delivered a live, animated marketing website for Maitrii Infotech.",
    nodes: [
      "Next.js pages",
      "GSAP animations",
      "Responsive sections",
      "Live site",
    ],
  },
  {
    id: "fundflick",
    title: "Fund Flick Lending Operations Suite",
    category: "Full Stack",
    alsoIn: ["GenAI"],
    client: "Fund Flick · Maitrii Infotech",
    links: [
      {
        label: "Get Fund Flick on Google Play",
        url: "https://play.google.com/store/apps/details?id=com.maitrii.losapp",
      },
      { label: "Visit fundflick.in", url: "https://www.fundflick.in/" },
    ],
    tags: [
      "React Native",
      "Next.js",
      "Node.js",
      "FastAPI",
      "MongoDB",
      "LangGraph",
      "AWS Lambda",
    ],
    description:
      "A lending and HR SaaS platform with LangGraph AI agents, a web dashboard, and an Android field app for loans, collections, payroll, attendance, and leave.",
    context:
      "Fund Flick, by Maitrii Infotech, is a lending operations suite for LAP, MSME, vehicle, business, personal, and gold lenders. One SaaS platform covers lending work and the HR suite, with AI agents for HR, on the web and in the Fund Flick app for field officers, collection agents, and managers.",
    contributions: [
      "Built the React Native field app for collection cases, EMI repayment records, field visits, and tasks, with selfie and GPS proof of each visit.",
      "Added push notifications for task assignments, comments, and collection follow-ups.",
      "Built the Next.js dashboard across lending and the HR suite: Employees, HR Letters, Payroll, Outward Payments, Reports, Attendance, Leave Management, Deletion Requests, and Settings.",
      "Developed Node.js and FastAPI services on AWS Lambda, with MongoDB Atlas for loans, collections, employees, payroll, attendance, and leave.",
      "Built LangGraph agents with LangChain: an HR policy assistant over MongoDB Atlas Vector Search, HR letter drafting, payroll and attendance insights, and resume and onboarding document parsing.",
      "Stored HR letters, uploads, and report exports in Amazon S3, traced agents with LangSmith, and monitored the platform with CloudWatch and Datadog.",
      "Built the fundflick.in marketing website in Next.js with GSAP animations.",
    ],
    outcome:
      "Delivered a live lending and HR SaaS platform with AI-assisted HR workflows on the web and Google Play, plus the public marketing website.",
    nodes: [
      "Next.js dashboard",
      "React Native app",
      "Node.js · FastAPI",
      "LangGraph agents",
      "MongoDB Atlas",
      "Amazon S3",
    ],
  },
  {
    id: "ai2go",
    title: "AI2Go Solutions Website",
    category: "Web",
    client: "AI2Go Solutions",
    links: [{ label: "Visit live site", url: "https://ai2gosolutions.com/" }],
    tags: ["Next.js", "GSAP", "Responsive design"],
    description:
      "The marketing website for AI2Go Solutions, built with Next.js and GSAP-driven motion.",
    context:
      "A static marketing website for AI2Go Solutions, built with Next.js and animated with GSAP.",
    contributions: [
      "Built the static website with Next.js.",
      "Created scroll and entrance animations with GSAP.",
      "Implemented responsive layouts across screen sizes.",
    ],
    outcome:
      "Delivered a live, animated marketing website for AI2Go Solutions.",
    nodes: [
      "Next.js pages",
      "GSAP animations",
      "Responsive sections",
      "Live site",
    ],
  },
  {
    id: "qualitech",
    title: "Qualitech Group Website",
    category: "Web",
    client: "Qualitech Group",
    links: [{ label: "Visit live site", url: "https://qualitechgroup.in/" }],
    tags: ["Next.js", "GSAP", "Responsive design"],
    description:
      "The marketing website for Qualitech Group, built with Next.js and GSAP-driven motion.",
    context:
      "A static marketing website for Qualitech Group, built with Next.js and animated with GSAP.",
    contributions: [
      "Built the static website with Next.js.",
      "Created scroll and entrance animations with GSAP.",
      "Implemented responsive layouts across screen sizes.",
    ],
    outcome:
      "Delivered a live, animated marketing website for Qualitech Group.",
    nodes: [
      "Next.js pages",
      "GSAP animations",
      "Responsive sections",
      "Live site",
    ],
  },
];
// A project can belong to more than one category (e.g. a full-stack platform with a GenAI layer).
export function projectCategories(project: Project) {
  return [project.category, ...(project.alsoIn ?? [])];
}
export function filterProjects(category: Category) {
  return category === "All"
    ? projects
    : projects.filter((p) => projectCategories(p).includes(category));
}
export function getProject(projectId: string) {
  return projects.find((project) => project.id === projectId);
}
export function getNextProject(projectId: string) {
  const index = projects.findIndex((project) => project.id === projectId);
  return index < 0 ? undefined : projects[(index + 1) % projects.length];
}
export const experience = [
  {
    id: "celebal-fde",
    role: "Forward Deployed Engineer (FDE)",
    company: "Celebal Technologies",
    date: "Feb 2026 — Present",
    location: "Jaipur, India",
    items: [
      "Building AI-based supply chain solutions with LangChain, LangGraph, and FastAPI.",
      "Developing LLM workflows and APIs to automate supply chain processes.",
      "Designed a scalable AI-powered travel agent with Azure Cosmos DB, Azure AI Foundry, LangSmith, and Langfuse.",
    ],
  },
  {
    id: "hornblower",
    role: "Software Engineer",
    company: "HornBlower Encore Studio",
    date: "May 2023 — Feb 2026",
    location: "Jaipur, India",
    items: [
      "Contributed to Anchor, an operations and reservations technology platform.",
      "Implemented SDK caching for a smoother checkout experience and delivered transfer and split capabilities.",
      "Developed a scalable Travel AI Agent using LangChain, LangGraph, and Azure AI services.",
    ],
  },
  {
    id: "revdau",
    role: "Software Engineer",
    company: "RevDau Industries",
    date: "Dec 2022 — May 2023",
    location: "Pune, India",
    items: [
      "Delivered full-stack features for a telecommunications product.",
      "Managed client communications and collaborated on user stories.",
      "Coordinated delivery and tracked tasks using JIRA.",
    ],
  },
  {
    id: "celebal-fullstack",
    role: "Full Stack Developer",
    company: "Celebal Technologies",
    date: "Nov 2020 — Dec 2022",
    location: "Jaipur, India",
    items: [
      "Collaborated with engineers and product managers to develop software solutions.",
      "Created a web application providing real-time updates on nearby client sites based on user input.",
    ],
  },
  {
    id: "qualitech-freelance",
    role: "Freelance Front-end Developer",
    company: "Qualitech Chart & Craft",
    date: "Apr 2020 — Nov 2020",
    location: "Jaipur, India",
    items: [
      "Developed the company website and an administration dashboard.",
      "Implemented feedback collection and dynamic page management.",
    ],
  },
];
// Training ran alongside engineering roles; formats and topics are user-confirmed, with no invented institutions or dates.
export type Training = {
  role: string;
  span: string;
  summary: string;
  formats: string[];
  topics: string[];
};
export const training: Training = {
  role: "Technical Trainer & Mentor",
  span: `${achievements.trainingYears} years · alongside engineering roles`,
  summary: `Trained ${achievements.studentsTrained.toLocaleString("en-US")}+ students and professionals in full-stack web development and Generative AI.`,
  formats: [
    "Corporate training",
    "College & university sessions",
    "Own institute & online courses",
    "Mentoring & internships",
  ],
  topics: ["Full-stack web development", "Generative AI & LLMs"],
};
export function emailDraft(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
}
