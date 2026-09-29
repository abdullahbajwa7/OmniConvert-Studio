import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Configure multer memory storage (no persistent files to leak, auto-cleanup in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

app.use(express.json());

// API: File Conversion Endpoint
app.post('/api/convert', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const targetFormat = ((req.body.targetFormat || 'png') as string).toLowerCase().trim();
    const quality = Math.min(100, Math.max(10, parseInt(req.body.quality || '90', 10)));
    const originalName = req.file.originalname;
    const baseName = path.parse(originalName).name;
    const inputBuffer = req.file.buffer;

    // Check if target is supported by Sharp
    const sharpSupportedTargets = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'];

    if (sharpSupportedTargets.includes(targetFormat)) {
      let pipeline = sharp(inputBuffer, { failOn: 'none' });

      let outputBuffer: Buffer;
      let contentType = 'application/octet-stream';

      switch (targetFormat) {
        case 'jpg':
        case 'jpeg':
          outputBuffer = await pipeline
            .flatten({ background: { r: 255, g: 255, b: 255 } }) // Handle alpha to white for JPEG
            .jpeg({ quality, chromaSubsampling: '4:4:4', mozjpeg: true })
            .toBuffer();
          contentType = 'image/jpeg';
          break;

        case 'png':
          outputBuffer = await pipeline
            .png({ compressionLevel: 9, effort: 7, palette: false })
            .toBuffer();
          contentType = 'image/png';
          break;

        case 'webp':
          outputBuffer = await pipeline
            .webp({ quality, lossless: quality === 100, effort: 4 })
            .toBuffer();
          contentType = 'image/webp';
          break;

        case 'avif':
          outputBuffer = await pipeline
            .avif({ quality, lossless: quality === 100, effort: 4 })
            .toBuffer();
          contentType = 'image/avif';
          break;

        case 'tiff':
          outputBuffer = await pipeline
            .tiff({ quality, compression: 'deflate' })
            .toBuffer();
          contentType = 'image/tiff';
          break;

        case 'gif':
          outputBuffer = await pipeline
            .gif()
            .toBuffer();
          contentType = 'image/gif';
          break;

        default:
          outputBuffer = await pipeline.toBuffer();
          break;
      }

      const outputFileName = `${baseName}.${targetFormat}`;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);
      res.setHeader('X-Converted-Size', outputBuffer.length.toString());
      res.setHeader('X-Original-Size', inputBuffer.length.toString());
      res.send(outputBuffer);
      return;
    }

    // For other formats or specialized processing, return JSON indicating client-engine capability
    res.status(200).json({
      status: 'use_client_engine',
      message: `Format ${targetFormat} will be processed via high-fidelity in-browser engine.`,
      targetFormat,
    });
  } catch (error: any) {
    console.error('Server conversion error:', error);
    res.status(500).json({ error: error?.message || 'Conversion failed' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
