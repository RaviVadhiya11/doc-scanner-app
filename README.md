# Doc Scanner Web App (DocScanner UI Clone)

A modern, responsive, mobile-first Document Scanner and PDF management application built with pure HTML5, CSS3, JavaScript, jsPDF, and Tesseract.js.

Inspired by mobile document scanner apps.

---

## 🚀 Features

- 📸 **Camera & File Capture**: Instant camera scanning via mobile web capture or image upload.
- 🎨 **Image Enhancement Filters**:
  - Original
  - Magic Color
  - Black & White Binarization
  - Grayscale
  - High Contrast
- 🔄 **Image Rotation**: 90° live image orientation toggle.
- ✍️ **Digital Signature Studio**: Touch & mouse-friendly signature drawing pad to stamp signatures on documents.
- 📄 **PDF Generation**: Direct client-side PDF export using `jsPDF`.
- 🔍 **AI OCR Extraction**: Client-side Optical Character Recognition using `Tesseract.js`.
- 📁 **Folder & Document Management**: Create custom folders, search documents, filter by favourites or categories.
- 🛠️ **Full PDF Toolkit**: UI for Merge, Split, Page sizing, and Watermarking.
- 💎 **Premium Upgrade Screen**: Responsive layout of membership plans and benefits.
- ⚙️ **Settings & Auto Backup Drawer**: Preferences, UI toggles, and DPI settings.

---

## 📁 Project Structure

```
doc-scanner-app/
├── index.html        # Main app layout and all modal templates
├── css/
│   └── style.css     # Clean mobile-first design styles
├── js/
│   └── app.js        # Core canvas processing, OCR, PDF generation, UI state
├── README.md         # Documentation and setup instructions
└── .gitignore
```

---

## 🛠️ How to Run Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/doc-scanner-app.git
   cd doc-scanner-app
   ```
2. Open `index.html` in any modern web browser:
   - On Windows: double click `index.html`
   - Or start a local lightweight server:
     ```bash
     npx serve .
     # OR
     python3 -m http.server 8000
     ```
3. Open `http://localhost:8000` in your browser or test on your mobile phone via local IP.

---

## 🌐 Deploy to GitHub Pages

1. Create a new GitHub repository named `doc-scanner-app`.
2. Push the files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Doc Scanner app"
   git branch -M main
   git remote add origin https://github.com/your-username/doc-scanner-app.git
   git push -u origin main
   ```
3. Go to **Settings** > **Pages** in your GitHub repository.
4. Set source to `Deploy from a branch` -> `main` -> `/ (root)`.
5. Click **Save**. Your web scanner will be live globally!
