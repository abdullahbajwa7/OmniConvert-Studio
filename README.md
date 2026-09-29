# OmniConvert Studio 🚀

> **Master Universal Media Converter & Media Specialist Platform**
> Compliant with the 5 Golden Rules of Media Physics, featuring an In-Place Zero-Quality-Loss Live Studio, Glassmorphic UI, and Comprehensive Roman Urdu & English Matrix.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AbdullahBajwa787/OmniConvert-Studio)

---

## 🌟 Key Features

1. **In-Place Hero Conversion Studio (`No Scrolling Required`)**:
   - Dropping or uploading files transforms the central hero box into a live inspection and conversion studio.
   - 100% full-resolution preview rendered directly with high-fidelity checkerboard transparency.
   - Live target format selection, settings, and conversion actions right in the viewport.

2. **Zero Quality Loss Engine**:
   - `100% Quality / Lossless Mode` by default.
   - `4:4:4 Chroma Subsampling` for JPEG images (eliminates red/blue color blur and preserves crisp typography).
   - Lossless mathematical compression for PNG, WebP, AVIF, and TIFF.
   - Built-in full-screen pixel inspection lightbox.

3. **5 Golden Rules of Media Physics Enforcement**:
   - **Rule 1 (Raster to Raster)**: 100% direct re-encoding across JPG, PNG, WEBP, BMP, TIFF, HEIC, AVIF, GIF, ICO, TGA, DDS, PCX with transparency auto-flattening notifications.
   - **Rule 2 (Vector to Raster)**: Mathematical SVG vector rasterization with customizable DPI presets (72 Web, 150 Medium, 300 Print Press, 600 Archival) and resolution scaling (1080p, 2K, 4K).
   - **Rule 3 (Raster to Vector)**: Edge-detection contour tracing and vectorization notes for raster-to-SVG.
   - **Rule 4 (Layered Projects to Image)**: Project layer flattening warnings (PSD, PSB, XCF, KRA, AFPHOTO).
   - **Rule 5 (Image to Camera RAW)**: Strictly designates conversion to proprietary camera sensor RAW (CR2, NEF, ARW, RAF, RW2) as **impossible** because physical hardware sensor photosite voltages cannot be recreated by software.
   - **Strict Exclusion Rule**: The uploaded format is automatically excluded from the target choices.

4. **Multi-Format Media Engine**:
   - **Image**: JPG, PNG, WEBP, AVIF, SVG, GIF, BMP, TIFF, ICO, TGA, HEIC, HDR.
   - **Audio**: MP3, WAV, AAC, OGG, FLAC, M4A with high-bitrate Web Audio PCM synthesis.
   - **Video**: MP4, WebM, MOV, AVI extraction and transcoding.
   - **Documents**: PDF, Word (DOCX), TXT, Markdown (MD), HTML via `pdf-lib` and binary encoders.

5. **Batch Processing & Instant Utilities**:
   - Multi-file queue with progress indicators.
   - Before/after file size diffs and compression delta percentages.
   - Individual one-click downloads + **Download All (.ZIP)** via JSZip.
   - Soft Web Audio completion chime & browser notifications.

---

## 🚀 Deploying to Vercel

### Method 1: Import via Vercel Dashboard (Recommended)

1. Open [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** ➔ **"Project"**.
3. Select your GitHub repository: `AbdullahBajwa787/OmniConvert-Studio`.
4. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your app will be live with an SSL URL in under a minute!

---

### Method 2: Deploy with Vercel CLI

```bash
# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Deploy to preview
vercel

# 3. Deploy directly to production
vercel --prod
```

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/AbdullahBajwa787/OmniConvert-Studio.git
cd OmniConvert-Studio

# 2. Install dependencies
npm install

# 3. Start development server (Port 3000)
npm run dev

# 4. Build production bundle
npm run build
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Full-Stack Runtime**: Vite 8, Express, Sharp (libvips), Multer, tsx
- **Client Processing**: HTML5 Canvas 2D, pdf-lib, JSZip, Web Audio API
- **Deployment**: Vercel ready with configured `vercel.json` and static rewrite rules

---

## 📄 License

MIT License. Built for universal high-performance digital media conversion.
