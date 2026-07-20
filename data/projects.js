const projects = [
  {
    id: "hyper-hyper-db",
    title: "HyperScale DB Engine",
    category: "Backend",
    tags: ["Rust", "Distributed Systems", "Raft", "gRPC"],
    summary: "Distributed, low-latency LSM-tree key-value store engineered for ultra-high throughput transactions.",
    description: "Built with Rust and gRPC, HyperScale DB implements custom memory allocation, write-ahead logging (WAL), zero-copy serialization, and raft consensus protocol for multi-region replication with under 2ms tail latency.",
    stars: 1420,
    forks: 185,
    metrics: "150k+ QPS / 1.8ms p99 latency",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com/example/hyperscale-db",
    liveUrl: "https://hyperscale-demo.dev",
    featured: true,
    codeHighlight: `// Rust LSM-Tree MemTable Flush Implementation
pub async fn flush_memtable(&self, memtable: Arc<MemTable>) -> Result<SSTableId> {
    let sstable_id = self.manifest.next_sstable_id();
    let mut builder = SSTableBuilder::new(sstable_id, self.config.block_size);
    
    let iter = memtable.iter();
    while let Some((key, val)) = iter.next() {
        builder.add(&key, &val)?;
    }
    
    let sstable = builder.finish(&self.disk_manager).await?;
    self.l0_tables.write().await.push_front(sstable);
    Ok(sstable_id)
}`
  },
  {
    id: "htmx-nebula",
    title: "HTMX Nebula UI System",
    category: "Fullstack",
    tags: ["HTMX", "Node.js", "Vanilla CSS", "SSE"],
    summary: "Server-driven hypermedia dashboard system with real-time SSE streaming & zero JS client bundle.",
    description: "Demonstrates how to replace heavy client-side SPAs with hypermedia-driven architecture using HTMX, Server-Sent Events (SSE), and custom server partials for streaming metrics.",
    stars: 2840,
    forks: 310,
    metrics: "0kb client JS framework / 99 Lighthouse",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com/example/htmx-nebula",
    liveUrl: "https://htmx-nebula.dev",
    featured: true,
    codeHighlight: `<!-- HTMX Dynamic Dashboard Partial -->
<div hx-get="/api/metrics/live" 
     hx-trigger="every 2s" 
     hx-target="#live-chart" 
     hx-swap="innerHTML" 
     class="dashboard-card">
  <div class="card-header">
    <span class="live-indicator pulse"></span>
    <h3>Realtime Throughput</h3>
  </div>
  <div id="live-chart">
    <!-- Server-rendered inline SVG sparkline swapped every 2s -->
  </div>
</div>`
  },
  {
    id: "edge-router",
    title: "Aether Edge Router",
    category: "DevOps",
    tags: ["Go", "WebAssembly", "Envoy", "Docker"],
    summary: "High-performance API gateway with inline dynamic Wasm plugin filtering and automatic TLS renewal.",
    description: "An ultra-fast edge routing proxy supporting dynamic Wasm dynamic filter pipelines, OAuth2 token validation at the edge, and zero-downtime hot-reloading of route tables.",
    stars: 980,
    forks: 112,
    metrics: "Sub-millisecond route resolution",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com/example/aether-router",
    liveUrl: "https://aether-proxy.dev",
    featured: true,
    codeHighlight: `// Go Edge Wasm Filter Execution Pipeline
func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    ctx := req.Context()
    for _, plugin := range r.wasmPlugins {
        if err := plugin.Execute(ctx, req); err != nil {
            http.Error(w, "Edge Policy Violation: " + err.Error(), http.StatusForbidden)
            return
        }
    }
    r.proxy.ServeHTTP(w, req)
}`
  },
  {
    id: "synth-ai",
    title: "Neural Vision Assistant",
    category: "AI/ML",
    tags: ["Python", "PyTorch", "FastAPI", "ONNX"],
    summary: "Real-time multimodal video stream analysis pipeline for automated anomaly detection.",
    description: "Engineered a low-latency video inference engine using PyTorch, ONNX Runtime, and TensorRT CUDA acceleration to analyze high-framerate camera streams for thermal anomalies.",
    stars: 2150,
    forks: 430,
    metrics: "60 FPS @ 4K resolution processing",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com/example/neural-vision",
    liveUrl: "https://neuralvision.ai",
    featured: false,
    codeHighlight: `@app.post("/api/v1/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    image_bytes = await file.read()
    tensor = preprocess_image(image_bytes).cuda()
    with torch.no_grad():
        predictions = onnx_session.run(None, {"input": tensor.cpu().numpy()})
    return {"anomalies": parse_predictions(predictions)}`
  },
  {
    id: "micro-mesh",
    title: "KubeMesh Observability",
    category: "DevOps",
    tags: ["Kubernetes", "Prometheus", "Grafana", "eBPF"],
    summary: "Kernel-level network observability and tracing using eBPF probes without sidecars.",
    description: "Zero-overhead service mesh telemetry system capturing TCP socket latency, HTTP payloads, and TLS handshakes directly in kernel space via eBPF programs.",
    stars: 1750,
    forks: 210,
    metrics: "< 0.5% CPU overhead in production",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com/example/kubemesh",
    liveUrl: "https://kubemesh.io",
    featured: false,
    codeHighlight: `// eBPF C Kernel Probe
SEC("kprobe/tcp_v4_connect")
int BPF_KPROBE(tcp_v4_connect, struct sock *sk) {
    u64 pid = bpf_get_current_pid_tgid();
    struct event_t event = {};
    event.pid = pid >> 32;
    event.ts = bpf_ktime_get_ns();
    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &event, sizeof(event));
    return 0;
}`
  },
  {
    id: "vector-flow",
    title: "VectorFlow Search Engine",
    category: "Backend",
    tags: ["Rust", "HNSW", "SIMD", "Vector DB"],
    summary: "Hardware-accelerated SIMD vector similarity search index for LLM embeddings.",
    description: "Implements hierarchical navigable small world (HNSW) graph indexing with AVX-512 SIMD vector distance calculation, delivering million-scale semantic search in milliseconds.",
    stars: 3200,
    forks: 410,
    metrics: "1M vectors / < 5ms recall search",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    githubUrl: "https://github.com/example/vectorflow",
    liveUrl: "https://vectorflow.dev",
    featured: false,
    codeHighlight: `// SIMD Cosine Distance AVX-512 in Rust
#[target_feature(enable = "avx512f")]
pub unsafe fn cosine_distance_simd(a: &[f32], b: &[f32]) -> f32 {
    let mut dot = _mm512_setzero_ps();
    for i in (0..a.len()).step_by(16) {
        let va = _mm512_loadu_ps(a.as_ptr().add(i));
        let vb = _mm512_loadu_ps(b.as_ptr().add(i));
        dot = _mm512_fmadd_ps(va, vb, dot);
    }
    _mm512_reduce_add_ps(dot)
}`
  }
];

module.exports = projects;
