import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Architecture } from "@/components/portfolio/visuals";
import { getProject } from "@/lib/portfolio";
import {
  edgeKey,
  projectExtraVisuals,
  projectVisuals,
  type SystemVisual,
} from "@/lib/portfolio-visuals";

// Extra architectures (shown after a case study's primary map) are keyed `<project>:agents` etc. by heading.
const extraKey = (id: string, heading: string) =>
  `${id}:${heading.toLowerCase().replace(/[^a-z]+/g, "-")}`;
const systems = [
  ...Object.entries(projectVisuals).flatMap(([id, v]) =>
    v.type === "system" ? [[id, v] as [string, SystemVisual]] : [],
  ),
  ...Object.entries(projectExtraVisuals).flatMap(([id, list]) =>
    list.flatMap((x) =>
      x.visual.type === "system"
        ? [[extraKey(id, x.heading), x.visual] as [string, SystemVisual]]
        : [],
    ),
  ),
];
const system = (id: string) => systems.find(([key]) => key === id)?.[1];

describe("System map data", () => {
  it("draws the booking, telecom, agent, and mobile platforms, including on-device ML as lane-based systems", () =>
    expect(systems.map(([id]) => id).sort()).toEqual([
      "anchor",
      "death-portal",
      "fundflick",
      "fundflick:hr-ai-agents",
      "izo-sdwan",
      "music-ai",
      "plant-health",
    ]));
  it.each(systems)(
    "%s references only declared nodes, lanes, and edges",
    (_id, visual) => {
      const nodes = new Set(visual.nodes.map((n) => n.id)),
        lanes = new Set(visual.lanes.map((l) => l.id)),
        edges = new Set(visual.edges.map(edgeKey));
      expect(edges.size).toBe(visual.edges.length);
      for (const n of visual.nodes) expect(lanes).toContain(n.lane);
      for (const e of visual.edges) {
        expect(nodes).toContain(e.from);
        expect(nodes).toContain(e.to);
      }
      for (const s of visual.steps) {
        for (const n of s.nodes) expect(nodes).toContain(n);
        for (const e of s.edges) expect(edges).toContain(e);
        for (const e of s.reverse ?? []) expect(s.edges).toContain(e);
      }
    },
  );
  it.each([
    [
      "anchor",
      [
        "Booking SDK",
        "Dashboard",
        "WordPress",
        "Android",
        "GraphQL",
        "λ",
        "DynamoDB",
        "SQS",
        "SNS",
        "S3",
        "CloudWatch",
        "CloudFormation",
      ],
    ],
    [
      "izo-sdwan",
      [
        "Angular",
        "Dashboard",
        "Admin",
        "MFE",
        "Highcharts",
        "Socket.IO",
        "REST API",
        "Collector",
        "ArangoDB",
        "Controller",
        "Edge devices",
        "EC2",
        "Docker",
      ],
    ],
    [
      "death-portal",
      [
        "React Native",
        "iOS",
        "Android",
        "Death Portal",
        "GraphQL",
        "Node.js λ",
        "MongoDB",
        "S3",
        "CloudWatch",
        "CloudFormation",
        "Datadog",
      ],
    ],
    [
      "plant-health",
      [
        "React Native",
        "Android",
        "TFLite",
        "TensorFlow",
        "10 plants",
        "Python API",
        "Product DB",
        "Results",
        "Plant images",
      ],
    ],
    [
      "music-ai",
      [
        "React",
        "FastAPI",
        "LangGraph",
        "RAG",
        "GPT-5.4",
        "GPT-5.4 mini",
        "Function App",
        "Music APIs",
        ".NET",
        "Cosmos DB",
        "FAISS",
        "LangSmith",
        "Langfuse",
      ],
    ],
    [
      "fundflick",
      [
        "Next.js",
        "Fund Flick app",
        "React Native",
        "Node.js",
        "FastAPI",
        "Lambda",
        "Lending",
        "collections",
        "Payroll",
        "Attendance",
        "S3",
        "Push",
        "MongoDB",
        "CloudWatch",
        "Datadog",
        "LangSmith",
      ],
    ],
    [
      "fundflick:hr-ai-agents",
      [
        "Next.js",
        "Fund Flick app",
        "FastAPI",
        "Lambda",
        "LangGraph",
        "Atlas Vector Search",
        "LLM",
        "LangChain",
        "S3",
        "MongoDB",
        "CloudWatch",
        "Datadog",
        "LangSmith",
      ],
    ],
  ])("%s includes every service in the described stack", (id, services) => {
    const text =
      system(id)
        ?.nodes.map((n) => `${n.label} ${n.detail ?? ""}`)
        .join(" ") ?? "";
    for (const service of services) expect(text).toContain(service);
  });
});

describe("Telecom system map", () => {
  it("stays free of AI services", () => {
    const visual = system("izo-sdwan");
    const text = [
      visual?.architecture,
      ...(visual?.nodes ?? []).map((n) => `${n.label} ${n.detail ?? ""}`),
      ...(visual?.steps ?? []).map((s) => s.detail),
    ].join(" ");
    expect(text).not.toMatch(/GPT|LangGraph|LangChain|\bAI\b|agent|RAG\b/i);
    expect(getProject("izo-sdwan")?.tags).not.toContain("React");
  });
});

describe("System map rendering", () => {
  it.each([
    ["anchor", "Illustrative booking journey"],
    ["music-ai", "Illustrative agent request"],
    ["izo-sdwan", "Illustrative live update"],
    ["death-portal", "Illustrative family request"],
    ["plant-health", "Illustrative plant diagnosis"],
    ["fundflick", "Illustrative lending & HR workflow"],
  ])(
    "renders the %s step journey on the case-study page",
    (id, journeyLabel) => {
      const project = getProject(id);
      if (!project) throw new Error("missing project");
      render(<Architecture project={project} detail />);
      expect(
        screen.getByRole("img", { name: /illustrative system map/ }),
      ).toBeInTheDocument();
      const journey = screen.getByRole("list", { name: journeyLabel });
      expect(within(journey).getAllByRole("button")).toHaveLength(8);
      expect(within(journey).getAllByRole("button")[0]).toHaveAttribute(
        "aria-current",
        "step",
      );
    },
  );
  it("renders Fund Flick’s second architecture, the HR AI agents, with its own journey", () => {
    const project = getProject("fundflick");
    const extra = projectExtraVisuals["fundflick"]?.[0];
    if (!project || !extra) throw new Error("missing extra architecture");
    render(<Architecture project={project} visual={extra.visual} detail />);
    const journey = screen.getByRole("list", {
      name: "Illustrative HR request",
    });
    expect(within(journey).getAllByRole("button")).toHaveLength(8);
  });
  it("keeps gallery cards compact", () => {
    const project = getProject("anchor");
    if (!project) throw new Error("missing project");
    render(<Architecture project={project} />);
    expect(
      screen.queryByRole("list", { name: "Illustrative booking journey" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("poll status")).not.toBeInTheDocument();
  });
});
