package data

import (
	"fmt"
	"html"
	"strings"
)

type SkillItem struct {
	Name       string `json:"name"`
	Level      int    `json:"level"`
	Experience string `json:"experience"`
	Icon       string `json:"icon"`
}

type SkillCategory struct {
	Category    string      `json:"category"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Items       []SkillItem `json:"items"`
}

var Skills = []SkillCategory{
	{
		Category:    "frontend",
		Title:       "Frontend & Hypermedia",
		Description: "Building responsive, hypermedia-driven, and accessible user interfaces with zero client bloat.",
		Items: []SkillItem{
			{Name: "HTMX & Hypermedia Architecture", Level: 98, Experience: "4+ yrs", Icon: "fa-bolt"},
			{Name: "Vanilla JavaScript (ESNext / Web Components)", Level: 95, Experience: "7+ yrs", Icon: "fa-code"},
			{Name: "Modern CSS (Grid, Flexbox, Animations, Design Tokens)", Level: 96, Experience: "7+ yrs", Icon: "fa-palette"},
			{Name: "React & Next.js Ecosystem", Level: 90, Experience: "5+ yrs", Icon: "fa-atom"},
			{Name: "TypeScript & Type Safety Systems", Level: 92, Experience: "5+ yrs", Icon: "fa-shield-halved"},
			{Name: "Performance & Lighthouse Optimization (Core Web Vitals)", Level: 95, Experience: "6+ yrs", Icon: "fa-gauge-high"},
		},
	},
	{
		Category:    "backend",
		Title:       "Backend & Distributed Systems",
		Description: "Architecting high-throughput microservices, low-latency Go & Rust APIs, and memory engines.",
		Items: []SkillItem{
			{Name: "Go (Golang Systems, Concurrency, Channels, HTTP)", Level: 96, Experience: "5+ yrs", Icon: "fa-cubes"},
			{Name: "Node.js & Express / Fastify Frameworks", Level: 94, Experience: "6+ yrs", Icon: "fa-server"},
			{Name: "Rust (Async Tokio, Memory Safety, KV Stores)", Level: 88, Experience: "3+ yrs", Icon: "fa-gear"},
			{Name: "PostgreSQL, Redis & Distributed KV Stores", Level: 94, Experience: "6+ yrs", Icon: "fa-database"},
			{Name: "gRPC, Protocol Buffers & WebSockets", Level: 91, Experience: "4+ yrs", Icon: "fa-network-wired"},
			{Name: "Python (FastAPI, AsyncIO, Data Pipelines)", Level: 89, Experience: "5+ yrs", Icon: "fa-brain"},
		},
	},
	{
		Category:    "devops",
		Title:       "DevOps & Cloud Infrastructure",
		Description: "Automating cloud infrastructure, CI/CD deployment pipelines, containerization, and monitoring.",
		Items: []SkillItem{
			{Name: "Docker & Container Runtime Orchestration", Level: 95, Experience: "6+ yrs", Icon: "fa-docker"},
			{Name: "Kubernetes, Helm & Cloud-Native Services", Level: 88, Experience: "4+ yrs", Icon: "fa-dharmachakra"},
			{Name: "Terraform & Infrastructure as Code (IaC)", Level: 87, Experience: "3+ yrs", Icon: "fa-cloud"},
			{Name: "GitHub Actions & Automated Testing CI/CD", Level: 94, Experience: "5+ yrs", Icon: "fa-code-branch"},
			{Name: "Prometheus, Grafana & eBPF Telemetry", Level: 86, Experience: "3+ yrs", Icon: "fa-chart-line"},
			{Name: "Linux Administration, Bash & Edge Security", Level: 92, Experience: "7+ yrs", Icon: "fa-terminal"},
		},
	},
	{
		Category:    "architecture",
		Title:       "System Architecture & Methodology",
		Description: "Designing resilient event-driven systems, RESTful hypermedia APIs, and domain-driven software.",
		Items: []SkillItem{
			{Name: "Hypermedia Driven Application Design (REST / HATEOAS)", Level: 98, Experience: "4+ yrs", Icon: "fa-sitemap"},
			{Name: "Event-Driven Architecture & Message Queues (Kafka / NATS)", Level: 90, Experience: "4+ yrs", Icon: "fa-diagram-project"},
			{Name: "Domain-Driven Design (DDD) & Clean Architecture", Level: 92, Experience: "5+ yrs", Icon: "fa-layer-group"},
			{Name: "Zero-Trust Security & OAuth2 / OIDC", Level: 88, Experience: "4+ yrs", Icon: "fa-lock"},
			{Name: "API Gateway Design & Rate Limiting", Level: 93, Experience: "5+ yrs", Icon: "fa-filter"},
		},
	},
}

func RenderSkillsHTML(catParam string) string {
	targetCat := strings.ToLower(strings.TrimSpace(catParam))
	if targetCat == "" {
		targetCat = "frontend"
	}

	var group SkillCategory = Skills[0]
	for _, s := range Skills {
		if strings.ToLower(s.Category) == targetCat {
			group = s
			break
		}
	}

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf(`
	<div class="skills-grid-container" id="skills-grid">
		<div class="category-info">
			<h3>%s</h3>
			<p>%s</p>
		</div>
		<div class="skill-cards">`,
		html.EscapeString(group.Title),
		html.EscapeString(group.Description),
	))

	for _, item := range group.Items {
		cardHTML := fmt.Sprintf(`
			<div class="skill-card">
				<div class="skill-card-header">
					<div class="skill-icon"><i class="fa-solid %s"></i></div>
					<div class="skill-titles">
						<h4>%s</h4>
						<span class="skill-exp">%s experience</span>
					</div>
					<span class="skill-pct">%d%%</span>
				</div>
				<div class="skill-bar-bg">
					<div class="skill-bar-fill" style="width: %d%%"></div>
				</div>
			</div>`,
			html.EscapeString(item.Icon),
			html.EscapeString(item.Name),
			html.EscapeString(item.Experience),
			item.Level,
			item.Level,
		)
		sb.WriteString(cardHTML)
	}

	sb.WriteString(`
		</div>
	</div>`)

	return sb.String()
}
