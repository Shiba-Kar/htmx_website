package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
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

	// Serve Static Assets from public/
	fs := http.FileServer(http.Dir("public"))
	mux.Handle("/", fs)

	// Alpine.js JSON API Endpoints
	mux.HandleFunc("/api/projects", handleProjectsJSON)
	mux.HandleFunc("/api/project-detail/", handleProjectDetailJSON)
	mux.HandleFunc("/api/skills", handleSkillsJSON)
	mux.HandleFunc("/api/code-snippet/", handleCodeSnippetJSON)
	mux.HandleFunc("/api/contact", handleContactJSON)
	mux.HandleFunc("/api/articles", handleArticlesJSON)
	mux.HandleFunc("/api/stats", handleStatsJSON)

	serverAddr := ":" + port
	log.Printf("🚀 Go & Alpine.js Developer Portfolio Server running at http://localhost:%s", port)
	if err := http.ListenAndServe(serverAddr, mux); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

// JSON Endpoint: Projects Search & Category Filter
func handleProjectsJSON(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	query := r.URL.Query().Get("query")

	filtered := data.FilterProjects(category, query)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(filtered)
}

// JSON Endpoint: Project Detail Modal
func handleProjectDetailJSON(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/project-detail/")

	for _, p := range data.Projects {
		if p.ID == id {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(p)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]string{"error": "Project not found"})
}

// JSON Endpoint: Skills Categories
func handleSkillsJSON(w http.ResponseWriter, r *http.Request) {
	category := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("category")))
	if category == "" {
		category = "frontend"
	}

	var found *data.SkillCategory
	for _, s := range data.Skills {
		if strings.ToLower(s.Category) == category {
			found = &s
			break
		}
	}
	if found == nil {
		found = &data.Skills[0]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(found)
}

// JSON Endpoint: Code Snippet Viewer
func handleCodeSnippetJSON(w http.ResponseWriter, r *http.Request) {
	lang := strings.TrimPrefix(r.URL.Path, "/api/code-snippet/")
	snippet := data.GetCodeSnippet(lang)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(snippet)
}

// JSON Endpoint: Contact Form Handler
func handleContactJSON(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var name, emailVal, message string

	if strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		var req struct {
			Name    string `json:"name"`
			Email   string `json:"email"`
			Message string `json:"message"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err == nil {
			name = req.Name
			emailVal = req.Email
			message = req.Message
		}
	} else {
		r.ParseForm()
		name = r.FormValue("name")
		emailVal = r.FormValue("email")
		message = r.FormValue("message")
	}

	name = strings.TrimSpace(name)
	emailVal = strings.TrimSpace(emailVal)
	message = strings.TrimSpace(message)

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

	w.Header().Set("Content-Type", "application/json")
	if len(errs) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": false,
			"errors":  errs,
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Thank you, " + name + "! I will get back to you within 24 hours at " + emailVal + ".",
	})
}

// JSON Endpoint: Articles Pagination
func handleArticlesJSON(w http.ResponseWriter, r *http.Request) {
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}

	pageSize := 3
	start := (page - 1) * pageSize
	end := start + pageSize

	if start >= len(data.Articles) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"articles": []data.Article{},
			"hasMore":  false,
			"page":     page,
		})
		return
	}

	if end > len(data.Articles) {
		end = len(data.Articles)
	}

	paged := data.Articles[start:end]
	hasMore := end < len(data.Articles)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"articles":  paged,
		"hasMore":   hasMore,
		"page":      page,
		"remaining": len(data.Articles) - end,
	})
}

// JSON Endpoint: Live Stats Counter
func handleStatsJSON(w http.ResponseWriter, r *http.Request) {
	rand.Seed(time.Now().UnixNano())
	commits := 1480 + rand.Intn(5)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"commits":        commits,
		"uptime":         "99.99%",
		"activeProjects": 14,
	})
}
