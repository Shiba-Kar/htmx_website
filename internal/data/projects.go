package data

import (
	"strings"
)

type Project struct {
	ID            string   `json:"id"`
	Title         string   `json:"title"`
	Category      string   `json:"category"`
	Tags          []string `json:"tags"`
	Summary       string   `json:"summary"`
	Description   string   `json:"description"`
	Stars         int      `json:"stars"`
	Forks         int      `json:"forks"`
	Metrics       string   `json:"metrics"`
	Image         string   `json:"image"`
	GithubURL     string   `json:"githubUrl"`
	LiveURL       string   `json:"liveUrl"`
	Featured      bool     `json:"featured"`
	CodeHighlight string   `json:"codeHighlight"`
}

var Projects = []Project{
	{
		ID:          "hyper-hyper-db",
		Title:       "HyperScale DB Engine",
		Category:    "Backend",
		Tags:        []string{"Rust", "Distributed Systems", "Raft", "gRPC"},
		Summary:     "Distributed, low-latency LSM-tree key-value store engineered for ultra-high throughput transactions.",
		Description: "Built with Rust and gRPC, HyperScale DB implements custom memory allocation, write-ahead logging (WAL), zero-copy serialization, and raft consensus protocol for multi-region replication with under 2ms tail latency.",
		Stars:       1420,
		Forks:       185,
		Metrics:     "150k+ QPS / 1.8ms p99 latency",
		Image:       "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/hyperscale-db",
		LiveURL:     "https://hyperscale-demo.dev",
		Featured:    true,
		CodeHighlight: `// Rust LSM-Tree MemTable Flush Implementation
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
}`,
	},
	{
		ID:          "alpine-nebula",
		Title:       "Alpine Nebula UI System",
		Category:    "Fullstack",
		Tags:        []string{"Alpine.js", "Go", "Vanilla CSS", "SSE"},
		Summary:     "Reactive client dashboard system with Alpine.js state management & Go backend.",
		Description: "Demonstrates high-performance client interactivity powered by Alpine.js declarative directives, real-time metrics streaming, and clean RESTful Go endpoints.",
		Stars:       2840,
		Forks:       310,
		Metrics:     "Reactive Alpine.js / 99 Lighthouse",
		Image:       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/alpine-nebula",
		LiveURL:     "https://alpine-nebula.dev",
		Featured:    true,
		CodeHighlight: `<!-- Alpine.js Dynamic Reactive Card -->
<div x-data="{ metrics: {} }" 
     x-init="setInterval(async () => metrics = await (await fetch('/api/stats')).json(), 2000)" 
     class="dashboard-card">
  <div class="card-header">
    <span class="live-indicator pulse"></span>
    <h3>Realtime Throughput</h3>
  </div>
  <div class="metric-value" x-text="metrics.commits + ' Commits'"></div>
</div>`,
	},
	{
		ID:          "edge-router",
		Title:       "Aether Edge Router",
		Category:    "DevOps",
		Tags:        []string{"Go", "WebAssembly", "Envoy", "Docker"},
		Summary:     "High-performance API gateway with inline dynamic Wasm plugin filtering and automatic TLS renewal.",
		Description: "An ultra-fast edge routing proxy supporting dynamic Wasm dynamic filter pipelines, OAuth2 token validation at the edge, and zero-downtime hot-reloading of route tables.",
		Stars:       980,
		Forks:       112,
		Metrics:     "Sub-millisecond route resolution",
		Image:       "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/aether-router",
		LiveURL:     "https://aether-proxy.dev",
		Featured:    true,
		CodeHighlight: `// Go Edge Wasm Filter Execution Pipeline
func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    ctx := req.Context()
    for _, plugin := range r.wasmPlugins {
        if err := plugin.Execute(ctx, req); err != nil {
            http.Error(w, "Edge Policy Violation: " + err.Error(), http.StatusForbidden)
            return
        }
    }
    r.proxy.ServeHTTP(w, req)
}`,
	},
	{
		ID:          "synth-ai",
		Title:       "Neural Vision Assistant",
		Category:    "AI/ML",
		Tags:        []string{"Python", "PyTorch", "FastAPI", "ONNX"},
		Summary:     "Real-time multimodal video stream analysis pipeline for automated anomaly detection.",
		Description: "Engineered a low-latency video inference engine using PyTorch, ONNX Runtime, and TensorRT CUDA acceleration to analyze high-framerate camera streams for thermal anomalies.",
		Stars:       2150,
		Forks:       430,
		Metrics:     "60 FPS @ 4K resolution processing",
		Image:       "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/neural-vision",
		LiveURL:     "https://neuralvision.ai",
		Featured:    false,
		CodeHighlight: `@app.post("/api/v1/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    image_bytes = await file.read()
    tensor = preprocess_image(image_bytes).cuda()
    with torch.no_grad():
        predictions = onnx_session.run(None, {"input": tensor.cpu().numpy()})
    return {"anomalies": parse_predictions(predictions)}`,
	},
	{
		ID:          "micro-mesh",
		Title:       "KubeMesh Observability",
		Category:    "DevOps",
		Tags:        []string{"Kubernetes", "Prometheus", "Grafana", "eBPF"},
		Summary:     "Kernel-level network observability and tracing using eBPF probes without sidecars.",
		Description: "Zero-overhead service mesh telemetry system capturing TCP socket latency, HTTP payloads, and TLS handshakes directly in kernel space via eBPF programs.",
		Stars:       1750,
		Forks:       210,
		Metrics:     "< 0.5% CPU overhead in production",
		Image:       "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/kubemesh",
		LiveURL:     "https://kubemesh.io",
		Featured:    false,
		CodeHighlight: `// eBPF C Kernel Probe
SEC("kprobe/tcp_v4_connect")
int BPF_KPROBE(tcp_v4_connect, struct sock *sk) {
    u64 pid = bpf_get_current_pid_tgid();
    struct event_t event = {};
    event.pid = pid >> 32;
    event.ts = bpf_ktime_get_ns();
    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &event, sizeof(event));
    return 0;
}`,
	},
	{
		ID:          "vector-flow",
		Title:       "VectorFlow Search Engine",
		Category:    "Backend",
		Tags:        []string{"Rust", "HNSW", "SIMD", "Vector DB"},
		Summary:     "Hardware-accelerated SIMD vector similarity search index for LLM embeddings.",
		Description: "Implements hierarchical navigable small world (HNSW) graph indexing with AVX-512 SIMD vector distance calculation, delivering million-scale semantic search in milliseconds.",
		Stars:       3200,
		Forks:       410,
		Metrics:     "1M vectors / < 5ms recall search",
		Image:       "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/vectorflow",
		LiveURL:     "https://vectorflow.dev",
		Featured:    false,
		CodeHighlight: `// SIMD Cosine Distance AVX-512 in Rust
#[target_feature(enable = "avx512f")]
pub unsafe fn cosine_distance_simd(a: &[f32], b: &[f32]) -> f32 {
    let mut dot = _mm512_setzero_ps();
    for i in (0..a.len()).step_by(16) {
        let va = _mm512_loadu_ps(a.as_ptr().add(i));
        let vb = _mm512_loadu_ps(b.as_ptr().add(i));
        dot = _mm512_fmadd_ps(va, vb, dot);
    }
    _mm512_reduce_add_ps(dot)
}`,
	},
}

func FilterProjects(category, query string) []Project {
	var result []Project
	q := strings.ToLower(strings.TrimSpace(query))
	cat := strings.ToLower(strings.TrimSpace(category))

	for _, p := range Projects {
		matchCat := cat == "" || cat == "all" || strings.ToLower(p.Category) == cat
		matchQuery := true
		if q != "" {
			matchQuery = strings.Contains(strings.ToLower(p.Title), q) ||
				strings.Contains(strings.ToLower(p.Summary), q) ||
				strings.Contains(strings.ToLower(p.Description), q)
			if !matchQuery {
				for _, tag := range p.Tags {
					if strings.Contains(strings.ToLower(tag), q) {
						matchQuery = true
						break
					}
				}
			}
		}

		if matchCat && matchQuery {
			result = append(result, p)
		}
	}
	return result
}
