package main

import (
	"fmt"
	"html"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"htmx_website/internal/data"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()

	// Static File Server
	fs := http.FileServer(http.Dir("public"))
	mux.Handle("/", fs)

	// HTMX API Endpoints
	mux.HandleFunc("/api/projects", handleProjects)
	mux.HandleFunc("/api/project-detail/", handleProjectDetail)
	mux.HandleFunc("/api/skills", handleSkills)
	mux.HandleFunc("/api/code-snippet/", handleCodeSnippet)
	mux.HandleFunc("/api/contact", handleContact)
	mux.HandleFunc("/api/articles", handleArticles)
	mux.HandleFunc("/api/stats", handleStats)

	serverAddr := ":" + port
	log.Printf("🚀 Go HTMX Developer Portfolio Server running at http://localhost:%s", port)
	if err := http.ListenAndServe(serverAddr, mux); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

// HTMX Endpoint: Live Project Search & Filter
func handleProjects(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	query := r.URL.Query().Get("query")

	filtered := data.FilterProjects(category, query)
	html := data.RenderProjectCardsHTML(filtered)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(html))
}

// HTMX Endpoint: Single Project Modal Details
func handleProjectDetail(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/project-detail/")

	var found *data.Project
	for _, p := range data.Projects {
		if p.ID == id {
			found = &p
			break
		}
	}

	if found == nil {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`<div class="modal-overlay" onclick="closeModalDirect()"><div class="modal-dialog"><p>Project not found</p></div></div>`))
		return
	}

	var tagsHTML strings.Builder
	for _, tag := range found.Tags {
		tagsHTML.WriteString(fmt.Sprintf(`<span class="tag">%s</span>`, html.EscapeString(tag)))
	}

	var codeBlockHTML string
	if found.CodeHighlight != "" {
		codeBlockHTML = fmt.Sprintf(`
			<h4 class="section-subtitle">Core Implementation Snippet</h4>
			<div class="code-block-wrapper">
				<pre class="code-block"><code>%s</code></pre>
			</div>`, html.EscapeString(found.CodeHighlight))
	}

	modalHTML := fmt.Sprintf(`
	<div class="modal-overlay" onclick="closeModal(event)">
		<div class="modal-dialog" onclick="event.stopPropagation()">
			<header class="modal-header">
				<div>
					<span class="tag tag-accent">%s</span>
					<h2 class="modal-title">%s</h2>
				</div>
				<button class="modal-close-btn" onclick="closeModalDirect()">&times;</button>
			</header>
			<div class="modal-body">
				<img src="%s" alt="%s" class="modal-banner-img" />
				
				<div class="modal-stats">
					<div class="stat-box">
						<i class="fa-regular fa-star"></i>
						<span><strong>%d</strong> GitHub Stars</span>
					</div>
					<div class="stat-box">
						<i class="fa-solid fa-code-fork"></i>
						<span><strong>%d</strong> Forks</span>
					</div>
					<div class="stat-box">
						<i class="fa-solid fa-gauge"></i>
						<span><strong>%s</strong> Key Metric</span>
					</div>
				</div>

				<h4 class="section-subtitle">Architecture Overview</h4>
				<p class="modal-desc">%s</p>

				<h4 class="section-subtitle">Technologies & Tools</h4>
				<div class="card-tags">
					%s
				</div>

				%s
			</div>
			<footer class="modal-footer">
				<a href="%s" target="_blank" rel="noopener" class="btn btn-secondary">
					<i class="fa-brands fa-github"></i> Repository
				</a>
				<a href="%s" target="_blank" rel="noopener" class="btn btn-primary">
					<i class="fa-solid fa-paper-plane"></i> Live System
				</a>
			</footer>
		</div>
	</div>`,
		html.EscapeString(found.Category),
		html.EscapeString(found.Title),
		found.Image,
		html.EscapeString(found.Title),
		found.Stars,
		found.Forks,
		html.EscapeString(found.Metrics),
		html.EscapeString(found.Description),
		tagsHTML.String(),
		codeBlockHTML,
		found.GithubURL,
		found.LiveURL,
	)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(modalHTML))
}

// HTMX Endpoint: Skills Category Matrix
func handleSkills(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	html := data.RenderSkillsHTML(category)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(html))
}

// HTMX Endpoint: Code Snippet Viewer
func handleCodeSnippet(w http.ResponseWriter, r *http.Request) {
	lang := strings.TrimPrefix(r.URL.Path, "/api/code-snippet/")
	html := data.RenderCodeSnippetHTML(lang)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(html))
}

// HTMX Endpoint: Contact Form Handler
func handleContact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(w, "Invalid form data", http.StatusBadRequest)
		return
	}

	name := strings.TrimSpace(r.FormValue("name"))
	emailVal := strings.TrimSpace(r.FormValue("email"))
	message := strings.TrimSpace(r.FormValue("message"))

	var errs []string
	if len(name) < 2 {
		errs = append(errs, "Name must be at least 2 characters.")
	}
	if !strings.Contains(emailVal, "@") {
		errs = append(errs, "Please enter a valid email address.")
	}
	if len(message) < 10 {
		errs = append(errs, "Message must be at least 10 characters.")
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if len(errs) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		var listItems strings.Builder
		for _, e := range errs {
			listItems.WriteString(fmt.Sprintf(`<li>%s</li>`, html.EscapeString(e)))
		}
		errHTML := fmt.Sprintf(`
			<div class="alert alert-error">
				<div class="alert-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
				<div>
					<h4>Submission Error</h4>
					<ul>%s</ul>
				</div>
			</div>`, listItems.String())
		w.Write([]byte(errHTML))
		return
	}

	successHTML := fmt.Sprintf(`
		<div class="alert alert-success">
			<div class="alert-icon"><i class="fa-solid fa-circle-check"></i></div>
			<div>
				<h4>Message Sent Successfully!</h4>
				<p>Thank you, <strong>%s</strong>. I will get back to you within 24 hours at <code>%s</code>.</p>
			</div>
		</div>`, html.EscapeString(name), html.EscapeString(emailVal))

	w.Write([]byte(successHTML))
}

// HTMX Endpoint: Articles Pagination
func handleArticles(w http.ResponseWriter, r *http.Request) {
	page := r.URL.Query().Get("page")
	html := data.RenderArticlesHTML(page)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(html))
}

// HTMX Endpoint: Live Stats Counter
func handleStats(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().UnixNano())
	commits := 1480 + rand.Intn(5)

	statsHTML := fmt.Sprintf(`
		<div class="stat-pill"><i class="fa-solid fa-code-commit"></i> <strong>%d</strong> Commits this year</div>
		<div class="stat-pill"><i class="fa-solid fa-circle-up"></i> <strong>99.99%%</strong> Go Server Uptime</div>
		<div class="stat-pill"><i class="fa-solid fa-diagram-project"></i> <strong>14</strong> Active Repos</div>
		<div class="stat-pill live-now"><span class="pulse-dot"></span> Live Go Stream</div>`, commits)

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(statsHTML))
}
