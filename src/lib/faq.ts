// Question-and-answer copy for answer engines (featured snippets, AI answers, voice) and the
// visible FAQ sections. Browser-safe and asset-free so the SEO module can turn the same entries
// into FAQPage JSON-LD and llms.txt. Every answer restates facts already in the portfolio data:
// no new figures, prices, dates, or claims.
import { achievements, experience, profile, projects } from "./portfolio";
import { certifications, sortCertifications } from "./certifications";
import { courses, trainingFormats } from "./training";

export type Faq = { question: string; answer: string };

const firstRole = experience[experience.length - 1]!;
const firstYear = firstRole.date.split(" ")[1];
const clients = projects
  .map((project) => project.client)
  .filter((client): client is string => Boolean(client))
  .map((client) => client.split(" · ")[0]!);
const list = (items: string[]) =>
  items.length < 2
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
const shortest = Math.min(...courses.map((course) => course.hours));
const longest = Math.max(...courses.map((course) => course.hours));

export const aboutFaqs: Faq[] = [
  {
    question: "What is a Forward Deployed Engineer?",
    answer:
      "A Forward Deployed Engineer (FDE) is a software engineer who works directly inside a client's team to turn a product or AI platform into a working solution for that client. An FDE scopes the problem with users, builds and integrates the software, and stays through production rollout, combining full-stack, cloud, and customer-facing skills.",
  },
  {
    question: "What does Rudresh Oza do?",
    answer: `${profile.name} is a ${profile.role} in ${profile.location}. He builds Generative AI agents with LangChain and LangGraph, full-stack web apps with React, Node.js, and FastAPI, and cloud platforms on AWS and Azure, for clients including ${list(clients.slice(0, 4))}.`,
  },
  {
    question: "How much experience does Rudresh Oza have?",
    answer: `${profile.name} has ${profile.experience} years of professional software engineering since ${firstYear}, at HornBlower Encore Studio, RevDau Industries, Celebal Technologies, and as a freelancer. Alongside that, he has spent ${achievements.trainingYears} years training ${achievements.studentsTrained.toLocaleString("en-US")}+ students and professionals.`,
  },
  {
    question: "Which certifications does Rudresh Oza hold?",
    answer: `${profile.name} holds ${certifications.length} verifiable certifications: ${list(sortCertifications(certifications).map((cert) => `${cert.name} (${cert.issuer})`))}.`,
  },
];

export const contactFaqs: Faq[] = [
  {
    question: "Is Rudresh Oza available for remote work?",
    answer: `Yes. ${profile.name} is open to international remote opportunities and works from ${profile.location} on ${profile.timezone}. He has delivered for clients in eight countries and is also available on-site in Jaipur.`,
  },
  {
    question: "What can I contact Rudresh Oza about?",
    answer:
      "Forward Deployed Engineer roles with international teams, GenAI agent and RAG projects, full-stack web and mobile apps, AWS and Azure cloud platforms, Databricks data engineering, and corporate or campus training.",
  },
  {
    question: "How do I contact Rudresh Oza?",
    answer: `Email ${profile.email}, use the contact form on this page (it opens a draft in your email app), or message him on LinkedIn. Including the role or project, timeline, and team size helps him reply with specifics.`,
  },
];

export const trainingFaqs: Faq[] = [
  {
    question: "What training formats does Rudresh Oza offer?",
    answer: `Rudresh offers ${trainingFormats.length} formats: ${list(trainingFormats.map((format) => format.title))}. Courses run online or on-site, and each one is built from production client work rather than demos.`,
  },
  {
    question: "How long are the courses?",
    answer: `The ${courses.length} core courses run from ${shortest} to ${longest} hours: ${list(courses.map((course) => `${course.title} (${course.hours} hours)`))}.`,
  },
  {
    question: "How do I book training for a team or campus?",
    answer:
      "Email a training enquiry or use the contact page with your audience, goals, and preferred format. Rudresh will suggest the right course structure and modules for your group.",
  },
];
