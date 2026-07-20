package data

import (
	"fmt"
	"html"
	"strings"
)

type SnippetItem struct {
	Lang     string `json:"lang"`
	Title    string `json:"title"`
	Filename string `json:"filename"`
	Code     string `json:"code"`
}

var SnippetsMap = map[string]SnippetItem{
	"htmx": {
		Lang:     "HTML / HTMX",
		Title:    "Server-Driven Hypermedia Pattern",
		Filename: "active_search.html",
		Code: `<!-- Realtime Active Search with HTMX & Go Server -->
<input type="text" 
       name="query" 
       placeholder="Search repository..." 
       hx-get="/api/projects" 
       hx-trigger="keyup changed delay:250ms, search" 
       hx-target="#project-grid" 
       hx-indicator="#loading-spinner"
       class="search-input" />

<div id="loading-spinner" class="htmx-indicator spinner"></div>
<div id="project-grid">
  <!-- Go server returns updated HTML list snippet here -->
</div>`,
	},
	"go": {
		Lang:     "Go",
		Title:    "High-Performance Go Net/HTTP Server & Router",
		Filename: "server.go",
		Code: `// Native Go 1.26 HTTP Router & HTMX Handler
package main

import (
    "fmt"
    "net/http"
    "time"
)

func HandleProjects(w http.ResponseWriter, r *http.Request) {
    category := r.URL.Query().Get("category")
    query := r.URL.Query().Get("query")
    
    projects := data.FilterProjects(category, query)
    htmlPartial := data.RenderProjectCardsHTML(projects)
    
    w.Header().Set("Content-Type", "text/html; charset=utf-8")
    w.Write([]byte(htmlPartial))
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

func RenderCodeSnippetHTML(langKey string) string {
	key := strings.ToLower(strings.TrimSpace(langKey))
	item, ok := SnippetsMap[key]
	if !ok {
		item = SnippetsMap["htmx"]
	}

	return fmt.Sprintf(`
	<div class="terminal-content">
		<div class="terminal-subheader">
			<span class="file-name"><i class="fa-regular fa-file-code"></i> %s</span>
			<span class="file-tag">%s</span>
		</div>
		<pre class="terminal-code"><code>%s</code></pre>
	</div>`,
		html.EscapeString(item.Filename),
		html.EscapeString(item.Lang),
		html.EscapeString(item.Code),
	)
}
