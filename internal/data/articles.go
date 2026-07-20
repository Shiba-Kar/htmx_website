package data

import (
	"fmt"
	"html"
	"strconv"
	"strings"
)

type Article struct {
	ID       int      `json:"id"`
	Title    string   `json:"title"`
	Category string   `json:"category"`
	Date     string   `json:"date"`
	ReadTime string   `json:"readTime"`
	Snippet  string   `json:"snippet"`
	Tags     []string `json:"tags"`
	Link     string   `json:"link"`
}

var Articles = []Article{
	{
		ID:       1,
		Title:    "Rethinking Modern Web Architecture: Why HTMX Beats Heavy SPAs for 90% of Use Cases",
		Category: "Architecture",
		Date:     "July 12, 2026",
		ReadTime: "7 min read",
		Snippet:  "Client-side JS bundle fatigue is real. How swapping HTML fragments over the wire restores web simplicity, reduces latency, and slashes maintenance overhead.",
		Tags:     []string{"HTMX", "Hypermedia", "Web Performance"},
		Link:     "#",
	},
	{
		ID:       2,
		Title:    "Building Low-Latency LSM-Tree Storage Engines in Async Rust & Go",
		Category: "Systems",
		Date:     "June 28, 2026",
		ReadTime: "12 min read",
		Snippet:  "A deep dive into zero-copy serialization, write-ahead log flush strategies, memtable concurrency, and block compression for embedded KV databases.",
		Tags:     []string{"Go", "Rust", "Distributed Systems", "Database"},
		Link:     "#",
	},
	{
		ID:       3,
		Title:    "Kernel-Level Observability: Harnessing eBPF Probes for Microservice Tracing",
		Category: "DevOps",
		Date:     "May 15, 2026",
		ReadTime: "9 min read",
		Snippet:  "How to capture TCP latency metrics and HTTP handshakes directly in kernel space without installing bulky sidecar proxies in Kubernetes pods.",
		Tags:     []string{"eBPF", "Kubernetes", "Linux"},
		Link:     "#",
	},
	{
		ID:       4,
		Title:    "SIMD Acceleration in Go & Rust: 10x Vector Distance Queries for Embedded LLMs",
		Category: "AI/ML",
		Date:     "April 04, 2026",
		ReadTime: "10 min read",
		Snippet:  "Leveraging AVX-512 and NEON vector primitives to supercharge cosine similarity search algorithms without dedicated GPU hardware.",
		Tags:     []string{"Go", "SIMD", "Vector DB"},
		Link:     "#",
	},
	{
		ID:       5,
		Title:    "Mastering HTMX Patterns: Click-To-Edit, Active Search & Server-Sent Events",
		Category: "Frontend",
		Date:     "March 20, 2026",
		ReadTime: "8 min read",
		Snippet:  "Practical patterns for implementing seamless real-time web applications with minimal JavaScript and max developer productivity.",
		Tags:     []string{"HTMX", "JavaScript", "REST"},
		Link:     "#",
	},
	{
		ID:       6,
		Title:    "Designing High-Throughput Event-Driven Microservices with Go and NATS",
		Category: "Backend",
		Date:     "February 11, 2026",
		ReadTime: "11 min read",
		Snippet:  "Lessons learned building backpressure-aware message consumer pipelines handling over 500,000 events per second with zero data loss.",
		Tags:     []string{"Go", "NATS", "Microservices"},
		Link:     "#",
	},
}

func RenderArticlesHTML(pageStr string) string {
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSize := 3
	start := (page - 1) * pageSize
	end := start + pageSize

	if start >= len(Articles) {
		return ""
	}
	if end > len(Articles) {
		end = len(Articles)
	}

	paged := Articles[start:end]
	hasMore := end < len(Articles)

	var sb strings.Builder
	for _, a := range paged {
		var tagsHTML strings.Builder
		for _, tag := range a.Tags {
			tagsHTML.WriteString(fmt.Sprintf(`<span class="tag tag-sm">%s</span>`, html.EscapeString(tag)))
		}

		cardHTML := fmt.Sprintf(`
		<article class="article-card">
			<div class="article-meta">
				<span class="tag tag-outline">%s</span>
				<span class="article-date"><i class="fa-regular fa-calendar"></i> %s</span>
				<span class="article-time"><i class="fa-regular fa-clock"></i> %s</span>
			</div>
			<h3 class="article-title">%s</h3>
			<p class="article-snippet">%s</p>
			<div class="article-footer">
				<div class="card-tags">
					%s
				</div>
				<a href="%s" class="read-more-link">Read Article <i class="fa-solid fa-arrow-right"></i></a>
			</div>
		</article>`,
			html.EscapeString(a.Category),
			html.EscapeString(a.Date),
			html.EscapeString(a.ReadTime),
			html.EscapeString(a.Title),
			html.EscapeString(a.Snippet),
			tagsHTML.String(),
			html.EscapeString(a.Link),
		)

		sb.WriteString(cardHTML)
	}

	if hasMore {
		nextPage := page + 1
		remaining := len(Articles) - end
		sb.WriteString(fmt.Sprintf(`
		<div class="load-more-wrapper" id="load-more-container">
			<button class="btn btn-secondary"
					hx-get="/api/articles?page=%d"
					hx-target="#load-more-container"
					hx-swap="outerHTML">
				<i class="fa-solid fa-arrows-rotate"></i> Load More Articles (%d remaining)
			</button>
		</div>`, nextPage, remaining))
	}

	return sb.String()
}
