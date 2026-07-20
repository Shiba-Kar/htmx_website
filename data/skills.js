const skills = [
  {
    category: "frontend",
    title: "Frontend Engineering",
    description: "Building responsive, hypermedia-driven, and accessible user interfaces with zero bloat.",
    items: [
      { name: "HTMX & Hypermedia Architecture", level: 98, experience: "4+ yrs", icon: "fa-bolt" },
      { name: "Vanilla JavaScript (ESNext / Web Components)", level: 95, experience: "7+ yrs", icon: "fa-code" },
      { name: "Modern CSS (Grid, Flexbox, Animations, Design Tokens)", level: 96, experience: "7+ yrs", icon: "fa-palette" },
      { name: "React & Next.js Ecosystem", level: 90, experience: "5+ yrs", icon: "fa-atom" },
      { name: "TypeScript & Type Safety Systems", level: 92, experience: "5+ yrs", icon: "fa-shield-halved" },
      { name: "Performance & Lighthouse Optimization (Core Web Vitals)", level: 95, experience: "6+ yrs", icon: "fa-gauge-high" }
    ]
  },
  {
    category: "backend",
    title: "Backend & Systems",
    description: "Architecting high-throughput distributed microservices, low-latency APIs, and database engines.",
    items: [
      { name: "Node.js & Express / Fastify Frameworks", level: 96, experience: "6+ yrs", icon: "fa-server" },
      { name: "Rust (Async Tokio, Systems, Memory Management)", level: 88, experience: "3+ yrs", icon: "fa-gear" },
      { name: "Go (Distributed Services, Concurrency, Channels)", level: 90, experience: "4+ yrs", icon: "fa-cubes" },
      { name: "PostgreSQL, Redis & Distributed KV Stores", level: 94, experience: "6+ yrs", icon: "fa-database" },
      { name: "gRPC, Protocol Buffers & WebSockets", level: 91, experience: "4+ yrs", icon: "fa-network-wired" },
      { name: "Python (FastAPI, AsyncIO, Data Pipelines)", level: 89, experience: "5+ yrs", icon: "fa-brain" }
    ]
  },
  {
    category: "devops",
    title: "Cloud & Infrastructure",
    description: "Automating cloud infrastructure, CI/CD deployment pipelines, containerization, and monitoring.",
    items: [
      { name: "Docker & Container Runtime Orchestration", level: 95, experience: "6+ yrs", icon: "fa-docker" },
      { name: "Kubernetes, Helm & Cloud-Native Services", level: 88, experience: "4+ yrs", icon: "fa-dharmachakra" },
      { name: "Terraform & Infrastructure as Code (IaC)", level: 87, experience: "3+ yrs", icon: "fa-cloud" },
      { name: "GitHub Actions & Automated Testing CI/CD", level: 94, experience: "5+ yrs", icon: "fa-code-branch" },
      { name: "Prometheus, Grafana & eBPF Telemetry", level: 86, experience: "3+ yrs", icon: "fa-chart-line" },
      { name: "Linux Administration, Bash & Edge Security", level: 92, experience: "7+ yrs", icon: "fa-terminal" }
    ]
  },
  {
    category: "architecture",
    title: "Architecture & Methodology",
    description: "Designing resilient event-driven systems, RESTful hypermedia APIs, and domain-driven software.",
    items: [
      { name: "Hypermedia Driven Application Design (REST / HATEOAS)", level: 98, experience: "4+ yrs", icon: "fa-sitemap" },
      { name: "Event-Driven Architecture & Message Queues (Kafka / RabbitMQ)", level: 90, experience: "4+ yrs", icon: "fa-diagram-project" },
      { name: "Domain-Driven Design (DDD) & Clean Architecture", level: 92, experience: "5+ yrs", icon: "fa-layer-group" },
      { name: "Zero-Trust Security & OAuth2 / OIDC", level: 88, experience: "4+ yrs", icon: "fa-lock" },
      { name: "API Gateway Design & Rate Limiting", level: 93, experience: "5+ yrs", icon: "fa-filter" }
    ]
  }
];

module.exports = skills;
