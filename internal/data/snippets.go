package data

import (
	"strings"
)

type SnippetItem struct {
	Lang     string `json:"lang"`
	Title    string `json:"title"`
	Filename string `json:"filename"`
	Code     string `json:"code"`
}

var SnippetsMap = map[string]SnippetItem{
	"alpine": {
		Lang:     "HTML / Alpine.js",
		Title:    "Reactive Declarative State Component",
		Filename: "active_search.html",
		Code: `<!-- Realtime Active Search with Alpine.js & Go JSON API -->
<div x-data="{ query: '', category: 'all', projects: [], loading: false }"
     x-init="$watch('query', () => fetchProjects()); $watch('category', () => fetchProjects()); fetchProjects()">
  
  <input type="text" 
         x-model.debounce.250ms="query" 
         placeholder="Search repository..." 
         class="search-input" />

  <template x-if="loading">
    <div class="spinner"></div>
  </template>

  <div class="projects-grid">
    <template x-for="project in projects" :key="project.id">
      <article class="project-card" x-text="project.title"></article>
    </template>
  </div>
</div>`,
	},
	"go": {
		Lang:     "Go",
		Title:    "High-Performance Go Net/HTTP JSON API Router",
		Filename: "server.go",
		Code: `// Native Go 1.26 HTTP Router & Alpine.js JSON API Handler
package main

import (
    "encoding/json"
    "net/http"
)

func HandleProjectsJSON(w http.ResponseWriter, r *http.Request) {
    category := r.URL.Query().Get("category")
    query := r.URL.Query().Get("query")
    
    projects := data.FilterProjects(category, query)
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(projects)
}`,
	},
	"rust": {
		Lang:     "Rust",
		Title:    "Zero-Copy LSM Storage Flush",
		Filename: "storage_engine.rs",
		Code: `// Async Tokio zero-copy storage writer in Rust
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
}`,
	},
	"python": {
		Lang:     "Python",
		Title:    "Async FastAPI Streaming Inference",
		Filename: "inference_stream.py",
		Code: `# Multimodal Tensor Inference Stream
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
        await ws.send_json({"detected": output.argmax().item()})`,
	},
}

func GetCodeSnippet(langKey string) SnippetItem {
	key := strings.ToLower(strings.TrimSpace(langKey))
	item, ok := SnippetsMap[key]
	if !ok {
		item = SnippetsMap["alpine"]
	}
	return item
}
