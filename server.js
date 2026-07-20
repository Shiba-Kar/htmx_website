const express = require('express');
const path = require('path');
const cors = require('cors');

const projects = require('./data/projects');
const skills = require('./data/skills');
const articles = require('./data/articles');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper for rendering HTML project cards
function renderProjectCards(items) {
  if (items.length === 0) {
    return `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <h3>No projects found</h3>
        <p>Try searching for a different keyword or resetting filters.</p>
      </div>
    `;
  }

  return items.map(project => `
    <article class="project-card" id="project-${project.id}">
      <div class="card-image-wrapper">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        <div class="card-badge">${project.category}</div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span><i class="fa-regular fa-star"></i> ${project.stars.toLocaleString()}</span>
          <span><i class="fa-solid fa-code-fork"></i> ${project.forks}</span>
          <span class="metric-pill"><i class="fa-solid fa-bolt"></i> ${project.metrics}</span>
        </div>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-summary">${project.summary}</p>
        <div class="card-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm"
                  hx-get="/api/project-detail/${project.id}"
                  hx-target="#modal-container"
                  hx-swap="innerHTML">
            <i class="fa-solid fa-expand"></i> Details
          </button>
          <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-icon btn-sm" title="View Source Code">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn-icon btn-sm" title="Live Preview">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

// HTMX Endpoint: Live Project Filter & Active Search
app.get('/api/projects', (req, res) => {
  const { query, category } = req.query;
  let filtered = [...projects];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  // Simulate minimal server processing delay for smooth HTMX indicator feedback
  setTimeout(() => {
    res.send(renderProjectCards(filtered));
  }, 100);
});

// HTMX Endpoint: Project Detail Modal Dialog
app.get('/api/project-detail/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).send('<div class="modal-content"><p>Project not found</p></div>');
  }

  const modalHtml = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal-dialog" onclick="event.stopPropagation()">
        <header class="modal-header">
          <div>
            <span class="tag tag-accent">${project.category}</span>
            <h2 class="modal-title">${project.title}</h2>
          </div>
          <button class="modal-close-btn" onclick="closeModalDirect()">&times;</button>
        </header>
        <div class="modal-body">
          <img src="${project.image}" alt="${project.title}" class="modal-banner-img" />
          
          <div class="modal-stats">
            <div class="stat-box">
              <i class="fa-regular fa-star"></i>
              <span><strong>${project.stars}</strong> GitHub Stars</span>
            </div>
            <div class="stat-box">
              <i class="fa-solid fa-code-fork"></i>
              <span><strong>${project.forks}</strong> Forks</span>
            </div>
            <div class="stat-box">
              <i class="fa-solid fa-gauge"></i>
              <span><strong>${project.metrics}</strong> Key Metric</span>
            </div>
          </div>

          <h4 class="section-subtitle">Architecture Overview</h4>
          <p class="modal-desc">${project.description}</p>

          <h4 class="section-subtitle">Technologies & Tools</h4>
          <div class="card-tags">
            ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>

          ${project.codeHighlight ? `
            <h4 class="section-subtitle">Core Implementation Snippet</h4>
            <div class="code-block-wrapper">
              <pre class="code-block"><code>${escapeHtml(project.codeHighlight)}</code></pre>
            </div>
          ` : ''}
        </div>
        <footer class="modal-footer">
          <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-secondary">
            <i class="fa-brands fa-github"></i> Repository
          </a>
          <a href="${project.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary">
            <i class="fa-solid fa-paper-plane"></i> Live System
          </a>
        </footer>
      </div>
    </div>
  `;

  res.send(modalHtml);
});

// HTMX Endpoint: Skills Category Switcher
app.get('/api/skills', (req, res) => {
  const { category } = req.query;
  const activeCategory = category || 'frontend';
  const group = skills.find(s => s.category === activeCategory) || skills[0];

  const html = `
    <div class="skills-grid-container" id="skills-grid">
      <div class="category-info">
        <h3>${group.title}</h3>
        <p>${group.description}</p>
      </div>
      <div class="skill-cards">
        ${group.items.map(item => `
          <div class="skill-card">
            <div class="skill-card-header">
              <div class="skill-icon"><i class="fa-solid ${item.icon}"></i></div>
              <div class="skill-titles">
                <h4>${item.name}</h4>
                <span class="skill-exp">${item.experience} experience</span>
              </div>
              <span class="skill-pct">${item.level}%</span>
            </div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width: ${item.level}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  res.send(html);
});

// Code Snippets Data Store
const snippets = {
  htmx: {
    lang: "HTML / HTMX",
    title: "Server-Driven Hypermedia Pattern",
    filename: "active_search.html",
    code: `<!-- Realtime Active Search with HTMX -->
<input type="text" 
       name="query" 
       placeholder="Search repository..." 
       hx-get="/api/projects" 
       hx-trigger="keyup changed delay:300ms, search" 
       hx-target="#project-grid" 
       hx-indicator="#loading-spinner"
       class="search-input" />

<div id="loading-spinner" class="htmx-indicator spinner"></div>
<div id="project-grid">
  <!-- Server returns updated HTML list snippet here -->
</div>`
  },
  rust: {
    lang: "Rust",
    title: "Zero-Copy LSM Storage Flush",
    filename: "storage_engine.rs",
    code: `// Async Tokio zero-copy storage writer in Rust
pub async fn commit_wal_entry(
    &self, 
    key: &[u8], 
    val: &[u8]
) -> Result<u64, StorageError> {
    let mut guard = self.wal_writer.lock().await;
    let checksum = crc32fast::hash_two(key, val);
    let entry_len = 8 + 4 + key.len() as u32 + val.len() as u32;
    
    let mut buf = BytesMut::with_capacity(entry_len as usize);
    buf.put_u64_le(checksum);
    buf.put_u32_le(key.len() as u32);
    buf.put_slice(key);
    buf.put_slice(val);

    let offset = guard.write_all(&buf).await?;
    Ok(offset)
}`
  },
  python: {
    lang: "Python",
    title: "Async FastAPI Streaming Inference",
    filename: "inference_stream.py",
    code: `# Multimodal Tensor Inference Stream
import asyncio
from fastapi import FastAPI, WebSocket
import torch

app = FastAPI()

@app.websocket("/ws/inference")
async def stream_inference(ws: WebSocket):
    await ws.accept()
    model = torch.jit.load("vision_model.pt").cuda().eval()
    
    while True:
        frame_bytes = await ws.receive_bytes()
        tensor = preprocess_raw(frame_bytes).cuda()
        with torch.no_grad():
            output = model(tensor)
        await ws.send_json({"detected": output.argmax().item()})`
  },
  go: {
    lang: "Go",
    title: "eBPF Kernel Socket Monitor",
    filename: "ebpf_probe.go",
    code: `// Kernel Socket Latency Probe Attachment in Go
package main

import (
    "fmt"
    "github.com/cilium/ebpf/link"
)

func AttachKprobe(ebpfProg *ebpf.Program) error {
    kp, err := link.Kprobe("tcp_v4_connect", ebpfProg, nil)
    if err != nil {
        return fmt.Errorf("failed to attach kprobe: %w", err)
    }
    defer kp.Close()
    
    fmt.Println("eBPF Socket probe attached successfully.")
    select {}
}`
  }
};

// HTMX Endpoint: Interactive Terminal Code Snippet Viewer
app.get('/api/code-snippet/:lang', (req, res) => {
  const langKey = req.params.lang.toLowerCase();
  const item = snippets[langKey] || snippets.htmx;

  const html = `
    <div class="terminal-content">
      <div class="terminal-subheader">
        <span class="file-name"><i class="fa-regular fa-file-code"></i> ${item.filename}</span>
        <span class="file-tag">${item.lang}</span>
      </div>
      <pre class="terminal-code"><code>${escapeHtml(item.code)}</code></pre>
    </div>
  `;

  res.send(html);
});

// HTMX Endpoint: Paginated Articles Loading
app.get('/api/articles', (req, res) => {
  const page = parseInt(req.query.page || '1');
  const pageSize = 3;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedArticles = articles.slice(start, end);
  const hasMore = end < articles.length;

  const articlesHtml = pagedArticles.map(article => `
    <article class="article-card">
      <div class="article-meta">
        <span class="tag tag-outline">${article.category}</span>
        <span class="article-date"><i class="fa-regular fa-calendar"></i> ${article.date}</span>
        <span class="article-time"><i class="fa-regular fa-clock"></i> ${article.readTime}</span>
      </div>
      <h3 class="article-title">${article.title}</h3>
      <p class="article-snippet">${article.snippet}</p>
      <div class="article-footer">
        <div class="card-tags">
          ${article.tags.map(t => `<span class="tag tag-sm">${t}</span>`).join('')}
        </div>
        <a href="${article.link}" class="read-more-link">Read Article <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </article>
  `).join('');

  let responseHtml = articlesHtml;

  if (hasMore) {
    const nextPage = page + 1;
    responseHtml += `
      <div class="load-more-wrapper" id="load-more-container">
        <button class="btn btn-secondary"
                hx-get="/api/articles?page=${nextPage}"
                hx-target="#load-more-container"
                hx-swap="outerHTML">
          <i class="fa-solid fa-arrows-rotate"></i> Load More Articles (${articles.length - end} remaining)
        </button>
      </div>
    `;
  }

  res.send(responseHtml);
});

// HTMX Endpoint: Asynchronous Contact Form Submission with Inline Validation
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Server-side validation
  const errors = [];
  if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters.");
  if (!email || !email.includes('@')) errors.push("Please enter a valid email address.");
  if (!message || message.trim().length < 10) errors.push("Message must be at least 10 characters.");

  if (errors.length > 0) {
    return res.status(400).send(`
      <div class="alert alert-error">
        <div class="alert-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
        <div>
          <h4>Submission Error</h4>
          <ul>
            ${errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
        </div>
      </div>
    `);
  }

  // Simulate message dispatch
  const successHtml = `
    <div class="alert alert-success">
      <div class="alert-icon"><i class="fa-solid fa-circle-check"></i></div>
      <div>
        <h4>Message Sent Successfully!</h4>
        <p>Thank you, <strong>${escapeHtml(name)}</strong>. I will get back to you within 24 hours at <code>${escapeHtml(email)}</code>.</p>
      </div>
    </div>
  `;

  res.send(successHtml);
});

// HTMX Endpoint: Live Stats Counter Partial
app.get('/api/stats', (req, res) => {
  const commits = 1480 + Math.floor(Math.random() * 5);
  const uptime = "99.99%";
  const activeProjects = 14;

  res.send(`
    <div class="stat-pill"><i class="fa-solid fa-code-commit"></i> <strong>${commits}</strong> Commits this year</div>
    <div class="stat-pill"><i class="fa-solid fa-circle-up"></i> <strong>${uptime}</strong> Server Uptime</div>
    <div class="stat-pill"><i class="fa-solid fa-diagram-project"></i> <strong>${activeProjects}</strong> Active Repos</div>
    <div class="stat-pill live-now"><span class="pulse-dot"></span> Live HTMX Stream</div>
  `);
});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(PORT, () => {
  console.log(`🚀 HTMX Developer Portfolio Server running at http://localhost:${PORT}`);
});
