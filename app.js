// Mock Database & State
let folders = [
  { id: 1, name: "New Folder", date: "8 Oct 2026", count: 0 },
  { id: 2, name: "ID Cards", date: "8 Oct 2026", count: 0 },
  { id: 3, name: "Bills", date: "8 Oct 2026", count: 0 }
];

let documents = [
  { id: 1, name: "DocScanner 10 Oct 2026...", date: "4 weeks ago", pages: 3, thumb: "https://images.unsplash.com/photo-1568667256549-094345857637?w=100&q=80", favourite: true },
  { id: 2, name: "DocScanner 9 Oct 2026 7...", date: "9 Oct 2026", pages: 4, thumb: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&q=80", favourite: false },
  { id: 3, name: "DocScanner 9 Oct 2026 6...", date: "9 Oct 2026", pages: 2, thumb: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=100&q=80", favourite: false }
];

let currentImage = null;
let currentRotation = 0;
let currentFilter = 'original';

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  renderFolders();
  renderDocs();
  setupEventListeners();
  initSignaturePad();
});

function setupEventListeners() {
  // Drawer
  document.getElementById("menu-btn").addEventListener("click", () => {
    document.getElementById("side-drawer").classList.remove("hidden");
  });
  document.getElementById("side-drawer").addEventListener("click", (e) => {
    if (e.target.id === "side-drawer") closeDrawer();
  });

  // More menu
  const moreBtn = document.getElementById("more-menu-btn");
  const moreMenu = document.getElementById("more-dropdown");
  moreBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    moreMenu.classList.toggle("hidden");
  });
  document.addEventListener("click", () => moreMenu.classList.add("hidden"));

  // Search Toggle
  document.getElementById("search-toggle-btn").addEventListener("click", () => {
    const bar = document.getElementById("search-bar");
    bar.classList.toggle("hidden");
    if (!bar.classList.contains("hidden")) document.getElementById("search-input").focus();
  });
  document.getElementById("close-search").addEventListener("click", () => {
    document.getElementById("search-bar").classList.add("hidden");
    renderDocs();
  });
  document.getElementById("search-input").addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = documents.filter(d => d.name.toLowerCase().includes(val));
    renderDocs(filtered);
  });

  document.getElementById("vip-crown-btn").addEventListener("click", openPremiumModal);
}

function renderFolders() {
  const container = document.getElementById("folders-list");
  document.getElementById("folder-count").innerText = folders.length;
  container.innerHTML = folders.map(f => `
    <div class="folder-item">
      <i class="fa-solid fa-folder folder-icon"></i>
      <div class="folder-details">
        <div class="folder-name">${f.name}</div>
        <div class="folder-date">${f.date} [${f.count}]</div>
      </div>
      <i class="fa-solid fa-ellipsis-vertical" style="color:#94a3b8"></i>
    </div>
  `).join("");
}

function renderDocs(list = documents) {
  const container = document.getElementById("docs-list");
  document.getElementById("doc-count").innerText = list.length;
  if (list.length === 0) {
    container.innerHTML = `<p style="color:#94a3b8; font-size:0.85rem; text-align:center; padding: 20px 0;">No documents found</p>`;
    return;
  }
  container.innerHTML = list.map(d => `
    <div class="doc-item" onclick="viewMockDoc('${d.name}', '${d.thumb}')">
      <img src="${d.thumb}" class="doc-thumb" alt="thumb">
      <div class="doc-details">
        <div class="doc-name">${d.name}</div>
        <div class="doc-date">${d.date} &bull; ${d.pages} pages</div>
      </div>
      <i class="fa-solid ${d.favourite ? 'fa-star' : 'fa-ellipsis-vertical'}" style="color:${d.favourite ? '#f59e0b' : '#94a3b8'}"></i>
    </div>
  `).join("");
}

function promptCreateFolder() {
  const name = prompt("Enter new folder name:", "Documents 2026");
  if (name) {
    folders.unshift({ id: Date.now(), name, date: "Today", count: 0 });
    renderFolders();
  }
}

function switchTab(el, type) {
  document.querySelectorAll(".tab-pill").forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  filterDocs(type);
}

function filterDocs(type) {
  if (type === 'favourite') {
    renderDocs(documents.filter(d => d.favourite));
  } else if (type === 'trash') {
    alert("Trash folder is currently empty.");
  } else {
    renderDocs(documents);
  }
}

function closeDrawer() {
  document.getElementById("side-drawer").classList.add("hidden");
}

function openPremiumModal() {
  document.getElementById("premium-modal").classList.remove("hidden");
}
function closePremiumModal() {
  document.getElementById("premium-modal").classList.add("hidden");
}

function openToolkit() {
  document.getElementById("toolkit-modal").classList.remove("hidden");
}
function closeToolkit() {
  document.getElementById("toolkit-modal").classList.add("hidden");
}

function openSettings() {
  document.getElementById("settings-modal").classList.remove("hidden");
}
function closeSettings() {
  document.getElementById("settings-modal").classList.add("hidden");
}

// Scanning & Canvas Logic
function handleImagePicked(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      currentImage = img;
      currentRotation = 0;
      currentFilter = 'original';
      document.getElementById("scanner-modal").classList.remove("hidden");
      renderEditorCanvas();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function renderEditorCanvas() {
  if (!currentImage) return;
  const canvas = document.getElementById("editor-canvas");
  const ctx = canvas.getContext("2d");

  const isRotated = currentRotation % 180 !== 0;
  canvas.width = isRotated ? currentImage.height : currentImage.width;
  canvas.height = isRotated ? currentImage.width : currentImage.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((currentRotation * Math.PI) / 180);
  ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);
  ctx.restore();

  // Apply Pixel Filters
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  if (currentFilter === 'grayscale') {
    for (let i = 0; i < d.length; i += 4) {
      const avg = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
      d[i] = avg; d[i+1] = avg; d[i+2] = avg;
    }
  } else if (currentFilter === 'bw') {
    for (let i = 0; i < d.length; i += 4) {
      const avg = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
      const threshold = avg > 128 ? 255 : 0;
      d[i] = threshold; d[i+1] = threshold; d[i+2] = threshold;
    }
  } else if (currentFilter === 'contrast') {
    const factor = 1.5;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, Math.max(0, factor * (d[i] - 128) + 128));
      d[i+1] = Math.min(255, Math.max(0, factor * (d[i+1] - 128) + 128));
      d[i+2] = Math.min(255, Math.max(0, factor * (d[i+2] - 128) + 128));
    }
  } else if (currentFilter === 'magic') {
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] * 1.15);
      d[i+1] = Math.min(255, d[i+1] * 1.15);
      d[i+2] = Math.min(255, d[i+2] * 1.15);
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function applyFilter(filterName) {
  currentFilter = filterName;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  renderEditorCanvas();
}

function rotateImage() {
  currentRotation = (currentRotation + 90) % 360;
  renderEditorCanvas();
}

function closeScanner() {
  document.getElementById("scanner-modal").classList.add("hidden");
}

function saveScannedDocument() {
  const canvas = document.getElementById("editor-canvas");
  const thumb = canvas.toDataURL("image/jpeg", 0.7);
  const newDoc = {
    id: Date.now(),
    name: `DocScanner_${new Date().toLocaleDateString().replace(/\//g, '_')}`,
    date: "Just now",
    pages: 1,
    thumb: thumb,
    favourite: false
  };
  documents.unshift(newDoc);
  renderDocs();
  closeScanner();
}

function downloadCurrentAsPDF() {
  const canvas = document.getElementById("editor-canvas");
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
  pdf.save("scanned-document.pdf");
}

// Signature Pad
let sigDrawing = false;
let sigCtx;

function initSignaturePad() {
  const sigCanvas = document.getElementById("signature-canvas");
  sigCtx = sigCanvas.getContext("2d");
  sigCtx.strokeStyle = "#000000";
  sigCtx.lineWidth = 2.5;

  const start = (e) => { sigDrawing = true; sigCtx.beginPath(); draw(e); };
  const end = () => { sigDrawing = false; sigCtx.beginPath(); };
  const draw = (e) => {
    if (!sigDrawing) return;
    const rect = sigCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    sigCtx.lineTo(x, y);
    sigCtx.stroke();
  };

  sigCanvas.addEventListener("mousedown", start);
  sigCanvas.addEventListener("mousemove", draw);
  sigCanvas.addEventListener("mouseup", end);

  sigCanvas.addEventListener("touchstart", (e) => { e.preventDefault(); start(e); });
  sigCanvas.addEventListener("touchmove", (e) => { e.preventDefault(); draw(e); });
  sigCanvas.addEventListener("touchend", end);
}

function openSignatureModal() {
  document.getElementById("signature-modal").classList.remove("hidden");
}
function closeSignatureModal() {
  document.getElementById("signature-modal").classList.add("hidden");
}
function clearSignature() {
  const canvas = document.getElementById("signature-canvas");
  sigCtx.clearRect(0, 0, canvas.width, canvas.height);
}
function applySignatureToDocument() {
  const sigCanvas = document.getElementById("signature-canvas");
  const editorCanvas = document.getElementById("editor-canvas");
  if (!editorCanvas || document.getElementById("scanner-modal").classList.contains("hidden")) {
    alert("Signature saved! Scan or open a document to stamp it.");
    closeSignatureModal();
    return;
  }
  const ctx = editorCanvas.getContext("2d");
  // Stamp signature at bottom right
  const stampWidth = editorCanvas.width * 0.3;
  const stampHeight = (sigCanvas.height / sigCanvas.width) * stampWidth;
  ctx.drawImage(sigCanvas, editorCanvas.width - stampWidth - 20, editorCanvas.height - stampHeight - 20, stampWidth, stampHeight);
  closeSignatureModal();
}

// OCR
function triggerOCRFlow() {
  document.getElementById("gallery-input").click();
}
function openOCRModal() {
  const canvas = document.getElementById("editor-canvas");
  document.getElementById("ocr-modal").classList.remove("hidden");
  document.getElementById("ocr-loading").classList.remove("hidden");
  document.getElementById("ocr-text-result").value = "";

  Tesseract.recognize(canvas, 'eng')
    .then(({ data: { text } }) => {
      document.getElementById("ocr-loading").classList.add("hidden");
      document.getElementById("ocr-text-result").value = text || "No clear text detected.";
    })
    .catch(err => {
      document.getElementById("ocr-loading").classList.add("hidden");
      document.getElementById("ocr-text-result").value = "Failed to run OCR: " + err.message;
    });
}
function closeOCRModal() {
  document.getElementById("ocr-modal").classList.add("hidden");
}
function copyOCRText() {
  const text = document.getElementById("ocr-text-result").value;
  navigator.clipboard.writeText(text);
  alert("OCR Text copied to clipboard!");
}

function viewMockDoc(name, thumb) {
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    currentRotation = 0;
    currentFilter = 'original';
    document.getElementById("scanner-modal").classList.remove("hidden");
    renderEditorCanvas();
  };
  img.src = thumb;
}
