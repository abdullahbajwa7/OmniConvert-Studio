import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Copy,
  Check,
  Download,
  Search,
  Filter,
  Info,
  ShieldAlert,
  ArrowRight,
  Code2,
  BookOpen,
} from 'lucide-react';
import { GOLDEN_RULES, generateMasterMarkdownTable, FORMAT_CATALOG } from '../data/formatMatrix';

export const FormatMatrixViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRuleNumber, setActiveRuleNumber] = useState<number | null>(null);

  const copyMarkdownTable = () => {
    const md = generateMasterMarkdownTable();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdownFile = () => {
    const md = generateMasterMarkdownTable();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OmniConvert_Master_Conversion_Matrix.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const matrixRows = [
    // Raster
    {
      format: 'JPG / JPEG',
      category: 'raster',
      categoryLabel: 'Raster Image',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'No Transparency',
      bits: '8-bit',
      lossy: 'Lossy (DCT)',
      tools: 'Sharp, mozjpeg, ImageMagick',
      romanUrduNote: 'Sub se aam photo format. Transparent background support nahi karta.',
    },
    {
      format: 'PNG',
      category: 'raster',
      categoryLabel: 'Raster Image',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full 8-bit Alpha',
      bits: '8/16-bit',
      lossy: 'Lossless (Deflate)',
      tools: 'Sharp, libpng, oxipng',
      romanUrduNote: 'Lossless standard. Transparent icons aur sharp graphics ke liye ideal.',
    },
    {
      format: 'WEBP',
      category: 'raster',
      categoryLabel: 'Modern Raster',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full Alpha Channel',
      bits: '8-bit',
      lossy: 'Lossy & Lossless',
      tools: 'Sharp, cwebp, libwebp',
      romanUrduNote: 'Google ka web format jo PNG se 26% aur JPG se 34% chhota size deta hai.',
    },
    {
      format: 'AVIF',
      category: 'raster',
      categoryLabel: 'Next-Gen Raster',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full Alpha Channel',
      bits: '10/12-bit HDR',
      lossy: 'Lossy & Lossless (AV1)',
      tools: 'Sharp, libavif',
      romanUrduNote: 'Cutting-edge AV1 intra frame standard with high dynamic range.',
    },
    {
      format: 'GIF',
      category: 'raster',
      categoryLabel: 'Raster Palette',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: '1-bit Binary Alpha',
      bits: '8-bit (256 colors)',
      lossy: 'Palette Quantized',
      tools: 'Sharp, gifsicle, FFmpeg',
      romanUrduNote: 'Sirf 256 colors aur binary on/off transparency.',
    },
    {
      format: 'BMP',
      category: 'raster',
      categoryLabel: 'Uncompressed',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Optional 32-bit Alpha',
      bits: '24/32-bit',
      lossy: 'Uncompressed Lossless',
      tools: 'Canvas API, ImageMagick',
      romanUrduNote: 'Raw pixel grid baghair kisi compression ke.',
    },
    {
      format: 'TIFF',
      category: 'raster',
      categoryLabel: 'Archival Raster',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Multi-page Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full Alpha Channel',
      bits: '16/32-bit Deep',
      lossy: 'Lossless LZW / ZIP',
      tools: 'Sharp, libtiff, Photoshop',
      romanUrduNote: 'Commercial publishing aur museum scan archival standard.',
    },
    {
      format: 'ICO',
      category: 'raster',
      categoryLabel: 'System Icon',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full Alpha Channel',
      bits: '32-bit RGBA',
      lossy: 'Lossless BMP/PNG sub-streams',
      tools: 'Canvas API, png2ico',
      romanUrduNote: 'Browser favicons aur Windows desktop application icon container.',
    },
    {
      format: 'TGA',
      category: 'raster',
      categoryLabel: 'Game Texture',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full Alpha Channel',
      bits: '24/32-bit',
      lossy: 'Uncompressed / RLE',
      tools: 'ImageMagick, GIMP, DirectX',
      romanUrduNote: 'Game engines aur 3D texture pipelines ka classic uncompressed format.',
    },
    {
      format: 'DDS',
      category: 'raster',
      categoryLabel: 'GPU Texture',
      raster: '100% Direct Decompress',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'DXT5 / BC3 Block Alpha',
      bits: 'BCn Compressed',
      lossy: 'DirectX Block Compression',
      tools: 'DirectXTex, Texconv, GIMP',
      romanUrduNote: 'GPU video memory me direct render hone wala texture container.',
    },
    {
      format: 'PCX',
      category: 'raster',
      categoryLabel: 'Legacy Raster',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'No Transparency',
      bits: '8/24-bit',
      lossy: 'Lossless RLE',
      tools: 'ImageMagick, Netpbm',
      romanUrduNote: 'MS-DOS aur classic gaming era ka run-length encoded bitmap.',
    },

    // Mobile / HDR
    {
      format: 'HEIC / HEIF',
      category: 'mobile_hdr',
      categoryLabel: 'Mobile / Apple',
      raster: '100% Direct (libheif)',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Alpha & Depth Map Channels',
      bits: '10/12-bit',
      lossy: 'HEVC / H.265 Intra',
      tools: 'libheif, Sharp, ImageMagick',
      romanUrduNote: 'iPhone ka default camera format. Dual camera depth maps bhi store karta hai.',
    },
    {
      format: 'JXL',
      category: 'mobile_hdr',
      categoryLabel: 'Next-Gen HDR',
      raster: '100% Direct Re-encode',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Raster Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Full Alpha Channel',
      bits: '32-bit Float',
      lossy: 'Lossless & VarDCT',
      tools: 'libjxl, cjpegxl',
      romanUrduNote: 'JPEG XL standard jo existing JPEGs ko bina loss 20% chhota kar deta hai.',
    },
    {
      format: 'EXR',
      category: 'mobile_hdr',
      categoryLabel: 'VFX / Cinema',
      raster: 'Tone-map to 8-bit Raster',
      vector: 'Trace / Potrace Required',
      project: 'Multi-channel Pass Import',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'Arbitrary Float Channels',
      bits: '16/32-bit Float',
      lossy: 'PIZ / ZIP / DWAA',
      tools: 'OpenEXR, Blender, Nuke',
      romanUrduNote: 'Hollywood movies aur 3D compositing ke liye 32-bit float lighting format.',
    },
    {
      format: 'HDR',
      category: 'mobile_hdr',
      categoryLabel: '3D Radiance',
      raster: 'Tone-map to 8-bit Raster',
      vector: 'Trace / Potrace Required',
      project: 'Single Layer Environment',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 1: Direct',
      alpha: 'No Alpha (RGBE)',
      bits: '32-bit RGBE',
      lossy: 'Radiance Logarithmic',
      tools: 'Radiance, Blender, Three.js',
      romanUrduNote: '3D environment dome lighting maps ke liye 360 panorama.',
    },

    // Vector
    {
      format: 'SVG',
      category: 'vector',
      categoryLabel: 'Vector Standard',
      raster: 'Rasterize at Target DPI (Rule 2)',
      vector: '100% Direct Mathematical',
      project: 'Import as Smart Vector Shape',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 2: Rasterize',
      alpha: 'Full Vector Opacity',
      bits: 'Infinite Scalability',
      lossy: 'Lossless Vector Primitives',
      tools: 'Potrace, Inkscape, Resvg, Canvas 2D',
      romanUrduNote: 'Mathematical formulas. Jitna marzi bara zoom kar lo kabhi pixelate nahi hota.',
    },
    {
      format: 'EPS',
      category: 'vector',
      categoryLabel: 'Print Vector',
      raster: 'Rasterize via Ghostscript (Rule 2)',
      vector: 'Direct PostScript Vector',
      project: 'Import Vector Artwork',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 2: Rasterize',
      alpha: 'PostScript Transparency',
      bits: 'Infinite Scalability',
      lossy: 'Lossless PostScript',
      tools: 'Ghostscript, Adobe Illustrator',
      romanUrduNote: 'Printing press aur vector branding ka established standard.',
    },
    {
      format: 'PDF',
      category: 'vector',
      categoryLabel: 'Vector / Document',
      raster: 'Render Pages via Poppler (Rule 2)',
      vector: 'Extract Vector Stream',
      project: 'Import Page as Canvas',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 2: Rasterize',
      alpha: 'Full Vector & Raster Alpha',
      bits: 'Standard Print Units',
      lossy: 'Hybrid Vector / Raster',
      tools: 'pdf-lib, Ghostscript, Poppler',
      romanUrduNote: 'Universal document container jisme fonts, vectors aur rasters sab embed hote hain.',
    },
    {
      format: 'AI',
      category: 'vector',
      categoryLabel: 'Native Vector',
      raster: 'Render PDF Stream (Rule 2)',
      vector: 'Direct Illustrator Vectors',
      project: 'Direct Open in Photoshop',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 2: Rasterize',
      alpha: 'Full Vector Transparency',
      bits: 'Infinite Scalability',
      lossy: 'Lossless Vector',
      tools: 'Adobe Illustrator, Inkscape',
      romanUrduNote: 'Adobe Illustrator ki native vector file. Raster banate waqt DPI specify karni hoti hai.',
    },
    {
      format: 'CDR',
      category: 'vector',
      categoryLabel: 'Native Vector',
      raster: 'Export via UniConvertor (Rule 2)',
      vector: 'CorelDRAW Vector Objects',
      project: 'Export to PSD Compatible',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 2: Rasterize',
      alpha: 'Full Vector Transparency',
      bits: 'Infinite Scalability',
      lossy: 'Lossless Vector',
      tools: 'CorelDRAW, UniConvertor',
      romanUrduNote: 'CorelDRAW vector artwork jo signage aur plotting machine cutting me use hota hai.',
    },

    // Native Projects
    {
      format: 'PSD',
      category: 'layered_project',
      categoryLabel: 'Layered Project',
      raster: 'Flatten All Layers (Rule 4)',
      vector: 'Extract Vector Clipping Paths',
      project: 'Native Adobe Photoshop',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 4: Flattened',
      alpha: 'Layer Masks & Blending',
      bits: '8/16/32-bit Multi-layer',
      lossy: 'Lossless Layered',
      tools: 'Photoshop, psd-tools, Sharp',
      romanUrduNote: 'Photoshop multi-layer project. Export par sabhi layers ek chapti picture ban jati hain.',
    },
    {
      format: 'PSB',
      category: 'layered_project',
      categoryLabel: 'Large Project',
      raster: 'Flatten All Layers (Rule 4)',
      vector: 'Extract Vector Clipping Paths',
      project: 'Large Photoshop Document',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 4: Flattened',
      alpha: 'Layer Masks & Blending',
      bits: '8/16/32-bit Multi-layer',
      lossy: 'Lossless Layered',
      tools: 'Photoshop, psd-tools',
      romanUrduNote: '30,000 pixels ya 2GB se bari Photoshop files ke liye format.',
    },
    {
      format: 'XCF',
      category: 'layered_project',
      categoryLabel: 'Layered Project',
      raster: 'Flatten via GIMP (Rule 4)',
      vector: 'Extract Vector Paths',
      project: 'Native GIMP Workspace',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 4: Flattened',
      alpha: 'Layer Transparency Masks',
      bits: '8/16/32-bit Multi-layer',
      lossy: 'Lossless Layered',
      tools: 'GIMP batch, ImageMagick',
      romanUrduNote: 'GIMP open source software ka native layered file format.',
    },
    {
      format: 'KRA',
      category: 'layered_project',
      categoryLabel: 'Layered Project',
      raster: 'Extract mergedimage.png (Rule 4)',
      vector: 'Extract Vector Vector Layers',
      project: 'Native Krita Workspace',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 4: Flattened',
      alpha: 'Layer Transparency Masks',
      bits: '8/16/32-bit Float',
      lossy: 'Lossless ZIP container',
      tools: 'Krita CLI, unzip archive',
      romanUrduNote: 'Krita digital painting software ka native layered canvas archive.',
    },
    {
      format: 'AFPHOTO',
      category: 'layered_project',
      categoryLabel: 'Layered Project',
      raster: 'Flatten via Affinity (Rule 4)',
      vector: 'Extract Vector Paths',
      project: 'Native Affinity Photo',
      cameraRaw: 'Impossible (Hardware Sensor)',
      rule: 'Rule 4: Flattened',
      alpha: 'Layer Transparency Masks',
      bits: '8/16/32-bit Multi-layer',
      lossy: 'Lossless Layered',
      tools: 'Affinity Photo',
      romanUrduNote: 'Serif Affinity Photo ka proprietary layered document.',
    },

    // Camera RAW
    {
      format: 'DNG',
      category: 'camera_raw',
      categoryLabel: 'Open RAW DNG',
      raster: 'Demosaic to TIFF/JPG (Rule 5)',
      vector: 'Trace after Demosaic',
      project: 'Camera Raw Layer Plugin',
      cameraRaw: 'Native DNG Container',
      rule: 'Rule 5: Demosaic',
      alpha: 'No Transparency',
      bits: '12/14/16-bit Linear',
      lossy: 'Lossless / Lossy DNG',
      tools: 'Adobe DNG, LibRaw, dcraw',
      romanUrduNote: 'Adobe ka open-standard raw container jo sabhi cameras me archive standard hai.',
    },
    {
      format: 'CR2 / CR3',
      category: 'camera_raw',
      categoryLabel: 'Canon RAW',
      raster: 'Demosaic to TIFF/JPG (Rule 5)',
      vector: 'Trace after Demosaic',
      project: 'Camera Raw Layer Plugin',
      cameraRaw: 'Convert to DNG only',
      rule: 'Rule 5: Demosaic',
      alpha: 'No Transparency',
      bits: '14-bit CFA Sensor',
      lossy: 'Lossless Bayer Sensor Readout',
      tools: 'LibRaw, Canon DPP, dcraw',
      romanUrduNote: 'Canon DSLR aur EOS mirrorless cameras ka physical photosite raw data.',
    },
    {
      format: 'NEF',
      category: 'camera_raw',
      categoryLabel: 'Nikon RAW',
      raster: 'Demosaic to TIFF/JPG (Rule 5)',
      vector: 'Trace after Demosaic',
      project: 'Camera Raw Layer Plugin',
      cameraRaw: 'Convert to DNG only',
      rule: 'Rule 5: Demosaic',
      alpha: 'No Transparency',
      bits: '12/14-bit CFA Sensor',
      lossy: 'Lossless Bayer Sensor Readout',
      tools: 'LibRaw, Nikon NX Studio, dcraw',
      romanUrduNote: 'Nikon cameras ka original sensor uncompressed data.',
    },
    {
      format: 'ARW',
      category: 'camera_raw',
      categoryLabel: 'Sony RAW',
      raster: 'Demosaic to TIFF/JPG (Rule 5)',
      vector: 'Trace after Demosaic',
      project: 'Camera Raw Layer Plugin',
      cameraRaw: 'Convert to DNG only',
      rule: 'Rule 5: Demosaic',
      alpha: 'No Transparency',
      bits: '14-bit CFA Sensor',
      lossy: 'Uncompressed / Compressed ARW',
      tools: 'LibRaw, Sony Imaging Edge, dcraw',
      romanUrduNote: 'Sony Alpha mirrorless cameras ka high dynamic range sensor raw format.',
    },
    {
      format: 'RAF',
      category: 'camera_raw',
      categoryLabel: 'Fuji RAW',
      raster: 'Demosaic to TIFF/JPG (Rule 5)',
      vector: 'Trace after Demosaic',
      project: 'Camera Raw Layer Plugin',
      cameraRaw: 'Convert to DNG only',
      rule: 'Rule 5: Demosaic',
      alpha: 'No Transparency',
      bits: '14/16-bit X-Trans',
      lossy: 'Lossless X-Trans Sensor',
      tools: 'LibRaw, Fuji X RAW Studio, dcraw',
      romanUrduNote: 'Fujifilm cameras ka unique 6x6 aperiodic X-Trans color filter sensor data.',
    },
    {
      format: 'RW2',
      category: 'camera_raw',
      categoryLabel: 'Lumix RAW',
      raster: 'Demosaic to TIFF/JPG (Rule 5)',
      vector: 'Trace after Demosaic',
      project: 'Camera Raw Layer Plugin',
      cameraRaw: 'Convert to DNG only',
      rule: 'Rule 5: Demosaic',
      alpha: 'No Transparency',
      bits: '12/14-bit CFA Sensor',
      lossy: 'Lossless Lumix Sensor',
      tools: 'LibRaw, SILKYPIX, dcraw',
      romanUrduNote: 'Panasonic Lumix cameras ka raw sensor data.',
    },
  ];

  const filteredRows = matrixRows.filter((row) => {
    const matchesSearch =
      row.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.tools.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.romanUrduNote.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' ? true : row.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">
            Media Technician & Graphic Format Specialist Matrix
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Exhaustive Cross-Conversion Guide & Matrix
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Governed by the 5 Golden Rules of digital image physics: Raster to Raster, Vector to Raster, Raster to Vector, Multi-layer Flattening, and Sensor RAW irreversibility.
          </p>
        </div>

        {/* Copy & Download Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyMarkdownTable}
            className="px-3.5 py-2 rounded-xl glass-button text-xs font-semibold text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-white/30 transition-all flex items-center gap-2 shadow-xs active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Master Table (MD)</span>
              </>
            )}
          </button>

          <button
            onClick={downloadMarkdownFile}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .MD File</span>
          </button>
        </div>
      </div>

      {/* 5 Golden Rules Cards Grid */}
      <div className="mb-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>The 5 Golden Rules of Conversion Logic</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOLDEN_RULES.map((rule) => {
            const isSelected = activeRuleNumber === rule.number;
            return (
              <div
                key={rule.number}
                onClick={() => setActiveRuleNumber(isSelected ? null : rule.number)}
                className={`p-5 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'glass-panel border-neutral-900 dark:border-white ring-2 ring-neutral-900/10 dark:ring-white/20 shadow-xl'
                    : 'glass-panel hover:border-neutral-400 dark:hover:border-white/30 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold flex items-center justify-center shadow-xs">
                      {rule.number}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {rule.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5">
                    {rule.directness}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Technical Principle:
                    </span>{' '}
                    <p className="text-neutral-600 dark:text-neutral-300 mt-0.5 leading-relaxed">
                      {rule.english}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[11px] text-neutral-500 font-mono">
                    Tooling: {rule.tooling}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search format, tool, or rule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-button text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
          />
        </div>

        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 glass-button rounded-xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'raster', label: 'Raster' },
            { id: 'mobile_hdr', label: 'Mobile / HDR' },
            { id: 'vector', label: 'Vector' },
            { id: 'layered_project', label: 'Projects' },
            { id: 'camera_raw', label: 'Camera RAW' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Master Markdown Table Rendered as Modern Glass Data Grid */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                <th className="py-3 px-4 font-semibold">Input Format</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Target: Raster</th>
                <th className="py-3 px-3 font-semibold">Target: Vector</th>
                <th className="py-3 px-3 font-semibold">Target: Projects</th>
                <th className="py-3 px-3 font-semibold">Target: Camera RAW</th>
                <th className="py-3 px-3 font-semibold">5 Golden Rules</th>
                <th className="py-3 px-3 font-semibold">Transparency</th>
                <th className="py-3 px-3 font-semibold">Bit-Depth</th>
                <th className="py-3 px-4 font-semibold">Native Toolchain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-sans">
              {filteredRows.map((row, idx) => (
                <tr
                  key={row.format}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {/* Format Title */}
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white whitespace-nowrap font-mono">
                    {row.format}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {row.categoryLabel}
                  </td>

                  {/* Raster Target */}
                  <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">
                    <span className="font-medium">{row.raster}</span>
                  </td>

                  {/* Vector Target */}
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                    {row.vector}
                  </td>

                  {/* Project Target */}
                  <td className="py-3 px-3 text-neutral-700 dark:text-neutral-300">
                    {row.project}
                  </td>

                  {/* Camera RAW Target */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {row.cameraRaw.includes('Impossible') ? (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        ❌ Impossible (Rule 5)
                      </span>
                    ) : (
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {row.cameraRaw}
                      </span>
                    )}
                  </td>

                  {/* Golden Rule */}
                  <td className="py-3 px-3 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {row.rule}
                  </td>

                  {/* Alpha / Transparency */}
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    {row.alpha}
                  </td>

                  {/* Bit Depth */}
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 font-mono tabular-nums whitespace-nowrap">
                    {row.bits}
                  </td>

                  {/* Recommended Tool */}
                  <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                    {row.tools}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950/80 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <span>Showing {filteredRows.length} formats covered by OmniConvert Master Specification.</span>
          <button
            onClick={copyMarkdownTable}
            className="text-neutral-900 dark:text-white font-medium hover:underline flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Raw Markdown Table for Documentation</span>
          </button>
        </div>
      </div>
    </section>
  );
};
