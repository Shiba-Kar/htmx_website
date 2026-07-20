package data

import (
	"fmt"
	"html"
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
		ID:          "htmx-nebula",
		Title:       "HTMX Nebula UI System",
		Category:    "Fullstack",
		Tags:        []string{"HTMX", "Go", "Vanilla CSS", "SSE"},
		Summary:     "Server-driven hypermedia dashboard system with real-time SSE streaming & zero JS client bundle.",
		Description: "Demonstrates how to replace heavy client-side SPAs with hypermedia-driven architecture using HTMX, Server-Sent Events (SSE), and custom server partials for streaming metrics.",
		Stars:       2840,
		Forks:       310,
		Metrics:     "0kb client JS framework / 99 Lighthouse",
		Image:       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
		GithubURL:   "https://github.com/example/htmx-nebula",
		LiveURL:     "https://htmx-nebula.dev",
		Featured:    true,
		CodeHighlight: `<!-- HTMX Dynamic Dashboard Partial -->
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

func RenderProjectCardsHTML(items []Project) string {
	if len(items) == 0 {
		return `
			<div class="empty-state">
				<i class="fa-solid fa-folder-open"></i>
				<h3>No projects found</h3>
				<p>Try searching for a different keyword or resetting filters.</p>
			</div>`
	}

	var sb strings.Builder
	for _, project := range items {
		var tagsHTML strings.Builder
		for _, tag := range project.Tags {
			tagsHTML.WriteString(fmt.Sprintf(`<span class="tag">%s</span>`, html.EscapeString(tag)))
		}

		cardHTML := fmt.Sprintf(`
		<article class="project-card spotlight-card" id="project-%s">
			<div class="card-image-wrapper">
				<img src="%s" alt="%s" loading="lazy" />
				<div class="card-badge">%s</div>
			</div>
			<div class="card-content">
				<div class="card-meta">
					<span><i class="fa-regular fa-star"></i> %d</span>
					<span><i class="fa-solid fa-code-fork"></i> %d</span>
					<span class="metric-pill"><i class="fa-solid fa-bolt"></i> %s</span>
				</div>
				<h3 class="card-title">%s</h3>
				<p class="card-summary">%s</p>
				<div class="card-tags">
					%s
				</div>
				<div class="card-actions">
					<button class="btn btn-secondary btn-sm"
							hx-get="/api/project-detail/%s"
							hx-target="#modal-container"
							hx-swap="innerHTML">
						<i class="fa-solid fa-expand"></i> Details
					</button>
					<a href="%s" target="_blank" rel="noopener" class="btn btn-icon btn-sm" title="View Source Code">
						<i class="fa-brands fa-github"></i>
					</a>
					<a href="%s" target="_blank" rel="noopener" class="btn btn-icon btn-sm" title="Live Preview">
						<i class="fa-solid fa-arrow-up-right-from-square"></i>
					</a>
				</div>
			</div>
		</article>`,
			project.ID,
			project.Image,
			html.EscapeString(project.Title),
			html.EscapeString(project.Category),
			project.Stars,
			project.Forks,
			html.EscapeString(project.Metrics),
			html.EscapeString(project.Title),
			html.EscapeString(project.Summary),
			tagsHTML.String(),
			project.ID,
			project.GithubURL,
			project.LiveURL,
		)

		sb.WriteString(cardHTML)
	}

	return sb.String()
}
