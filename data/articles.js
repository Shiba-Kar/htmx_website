const articles = [
  {
    id: 1,
    title: "Rethinking Modern Web Architecture: Why HTMX Beats Heavy SPAs for 90% of Use Cases",
    category: "Architecture",
    date: "July 12, 2026",
    readTime: "7 min read",
    snippet: "Client-side JS bundle fatigue is real. How swapping HTML fragments over the wire restores web simplicity, reduces latency, and slashes maintenance overhead.",
    tags: ["HTMX", "Hypermedia", "Web Performance"],
    link: "#"
  },
  {
    id: 2,
    title: "Building Low-Latency LSM-Tree Storage Engines in Async Rust",
    category: "Systems",
    date: "June 28, 2026",
    readTime: "12 min read",
    snippet: "A deep dive into zero-copy serialization, write-ahead log flush strategies, memtable concurrency, and block compression for embedded KV databases.",
    tags: ["Rust", "Distributed Systems", "Database"],
    link: "#"
  },
  {
    id: 3,
    title: "Kernel-Level Observability: Harnessing eBPF Probes for Microservice Tracing",
    category: "DevOps",
    date: "May 15, 2026",
    readTime: "9 min read",
    snippet: "How to capture TCP latency metrics and HTTP handshakes directly in kernel space without installing bulky sidecar proxies in Kubernetes pods.",
    tags: ["eBPF", "Kubernetes", "Linux"],
    link: "#"
  },
  {
    id: 4,
    title: "SIMD Acceleration in Rust: 10x Vector Distance Queries for Embedded LLMs",
    category: "AI/ML",
    date: "April 04, 2026",
    readTime: "10 min read",
    snippet: "Leveraging AVX-512 and NEON vector primitives to supercharge cosine similarity search algorithms without dedicated GPU hardware.",
    tags: ["Rust", "SIMD", "Vector DB"],
    link: "#"
  },
  {
    id: 5,
    title: "Mastering HTMX Patterns: Click-To-Edit, Active Search & Server-Sent Events",
    category: "Frontend",
    date: "March 20, 2026",
    readTime: "8 min read",
    snippet: "Practical patterns for implementing seamless real-time web applications with minimal JavaScript and max developer productivity.",
    tags: ["HTMX", "JavaScript", "REST"],
    link: "#"
  },
  {
    id: 6,
    title: "Designing High-Throughput Event-Driven Microservices with Go and NATS",
    category: "Backend",
    date: "February 11, 2026",
    readTime: "11 min read",
    snippet: "Lessons learned building backpressure-aware message consumer pipelines handling over 500,000 events per second with zero data loss.",
    tags: ["Go", "NATS", "Microservices"],
    link: "#"
  }
];

module.exports = articles;
