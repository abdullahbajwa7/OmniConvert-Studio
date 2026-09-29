import { FormatMeta, FormatCategory, MatrixCellCompatibility, GoldenRuleNumber } from '../types/conversion';

export const GOLDEN_RULES = [
  {
    number: 1,
    title: 'Raster to Raster',
    formats: 'JPG, PNG, WEBP, BMP, TIFF, HEIC, AVIF, GIF, ICO, TGA, DDS, PCX',
    romanUrdu:
      'Ye aapas me 100% direct aur baghair kisi issue ke convert ho jate hain. Sirf transparency aur compression loss ka dhyan rakhna hota hai (e.g. PNG to JPG me transparent background white/black ban jata hai kyunke JPG transparency support nahi karta).',
    english:
      'Direct 1:1 pixel raster re-encoding. Lossless formats (PNG, TIFF, lossless WebP) preserve pixel exactness; lossy formats (JPG, lossy WebP, AVIF) discard high-frequency DCT/wavelet data. Alpha channels are flattened when converting to formats without transparency support.',
    directness: '100% Direct Compatible',
    tooling: 'Sharp (libvips), ImageMagick, Canvas API',
  },
  {
    number: 2,
    title: 'Vector to Raster',
    formats: 'SVG, AI, EPS, CDR, PDF ➔ JPG, PNG, WEBP, TIFF, etc.',
    romanUrdu:
      'Bohat asan hai, bas output resolution (e.g. 1080p, 4K, ya 300 DPI) set karke rasterize karna hota hai. Infinite mathematical formulas ko physical pixels grid me draw kiya jata hai.',
    english:
      'Vector primitives (Bézier curves, polygons, coordinates) are rendered onto a discrete raster pixel matrix at a user-specified resolution or print DPI. Once rasterized, infinite scalability is replaced with fixed pixel dimensions.',
    directness: 'Resolution / DPI Dependent',
    tooling: 'Inkscape CLI, Cairo, Resvg, Web Canvas 2D',
  },
  {
    number: 3,
    title: 'Raster to Vector',
    formats: 'JPG, PNG ➔ SVG, AI, EPS, PDF',
    romanUrdu:
      'Direct 1:1 mathematical conversion nahi hoti; software me Image Trace ya Vectorization karni parti hai. Pixels ke edges aur color boundaries detect karke vector paths bante hain.',
    english:
      'Algorithmic edge detection, color quantization, and contour tracing (e.g., Potrace, AutoTrace). Effective for logos, line art, and typography. Complex photographic rasters produce heavy, complex vector path meshes rather than clean shapes.',
    directness: 'Requires Contour / Vector Tracing',
    tooling: 'Potrace, AutoTrace, Inkscape Trace, Adobe Image Trace',
  },
  {
    number: 4,
    title: 'Project Files to Image',
    formats: 'PSD, PSB, XCF, KRA, AFPHOTO ➔ JPG, PNG, WEBP',
    romanUrdu:
      'Sab layers flat (merge) ho kar single picture ban jati hain. Adjustment layers, smart objects aur text layers editable nahi rehte. Reverse me normal image as single background layer import hoti hai.',
    english:
      'Multi-layer composition, non-destructive layer masks, blending modes, and text objects are composited and baked into a single composite raster layer. Reverse import loads the raster as an unlayered background plane.',
    directness: 'One-Way Compositing (Flattened)',
    tooling: 'psd-tools, ImageMagick, GIMP batch, Krita CLI',
  },
  {
    number: 5,
    title: 'Image to Camera RAW',
    formats: 'Any Image ➔ CR2, NEF, ARW, RAF, RW2',
    romanUrdu:
      'Namumkin hai! Kyunke camera sensor ka physical uncompressed raw photosite bayer data software wapas create nahi kar sakta. Sirf generic Adobe DNG container wrap ho sakta hai, proprietary RAW recreate nahi ho sakta.',
    english:
      'Physically impossible. Proprietary camera RAW files contain un-demosaiced sensor electrical readouts and Bayer CFA voltages direct from the camera hardware. Rendered images can only be wrapped into an Adobe DNG linear container; true proprietary camera RAW data cannot be synthesized.',
    directness: 'Technically Impossible (One-Way Hardware Readout)',
    tooling: 'LibRaw, dcraw, Adobe DNG Converter (Sensor to Raster only)',
  },
];

export const FORMAT_CATALOG: Record<string, FormatMeta> = {
  // Raster
  jpg: {
    extension: 'jpg',
    name: 'JPEG Image',
    category: 'raster',
    categoryLabel: 'Raster Image',
    mimeType: 'image/jpeg',
    description: 'Universal lossy raster image standard with DCT compression.',
    romanUrduDescription: 'Sub se aam photo format. Lossy compression hoti hai aur transparency support nahi karta.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 8,
    recommendedTools: ['Sharp', 'mozjpeg', 'ImageMagick'],
    goldenRule: 1,
  },
  jpeg: {
    extension: 'jpeg',
    name: 'JPEG Image',
    category: 'raster',
    categoryLabel: 'Raster Image',
    mimeType: 'image/jpeg',
    description: 'Joint Photographic Experts Group raster standard.',
    romanUrduDescription: 'JPEG standard. Photos ke liye best hai lekin transparency nahi hoti.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 8,
    recommendedTools: ['Sharp', 'mozjpeg'],
    goldenRule: 1,
  },
  png: {
    extension: 'png',
    name: 'Portable Network Graphics',
    category: 'raster',
    categoryLabel: 'Raster Image',
    mimeType: 'image/png',
    description: 'Lossless bitmap image format with 8-bit alpha channel transparency.',
    romanUrduDescription: 'Lossless format hai jo transparent background aur sharp graphics ke liye ideal hai.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 16,
    recommendedTools: ['Sharp', 'oxipng', 'libpng'],
    goldenRule: 1,
  },
  webp: {
    extension: 'webp',
    name: 'WebP Image',
    category: 'raster',
    categoryLabel: 'Modern Raster',
    mimeType: 'image/webp',
    description: 'Modern web image format supporting both lossy/lossless and alpha channel.',
    romanUrduDescription: 'Google ka modern web format. PNG se 26% aur JPG se 34% chhota size deta hai.',
    supportsAlpha: true,
    isLossy: 'both',
    maxBitDepth: 8,
    recommendedTools: ['Sharp', 'cwebp', 'libwebp'],
    goldenRule: 1,
  },
  avif: {
    extension: 'avif',
    name: 'AV1 Image File Format',
    category: 'raster',
    categoryLabel: 'Next-Gen Raster',
    mimeType: 'image/avif',
    description: 'Cutting-edge AV1 intra-frame compressed image container with HDR.',
    romanUrduDescription: 'Sab se modern compression format. High dynamic range aur extreme compression deta hai.',
    supportsAlpha: true,
    isLossy: 'both',
    maxBitDepth: 12,
    recommendedTools: ['Sharp', 'libavif'],
    goldenRule: 1,
  },
  gif: {
    extension: 'gif',
    name: 'Graphics Interchange Format',
    category: 'raster',
    categoryLabel: 'Raster Image',
    mimeType: 'image/gif',
    description: '8-bit indexed color raster format with animation and 1-bit transparency.',
    romanUrduDescription: '256 colors palette aur animated loops ke liye purana standard format.',
    supportsAlpha: true,
    isLossy: true,
    maxBitDepth: 8,
    recommendedTools: ['Sharp', 'gifsicle', 'ffmpeg'],
    goldenRule: 1,
  },
  bmp: {
    extension: 'bmp',
    name: 'Bitmap Image',
    category: 'raster',
    categoryLabel: 'Uncompressed Raster',
    mimeType: 'image/bmp',
    description: 'Standard uncompressed Windows bitmap raster graphics format.',
    romanUrduDescription: 'Bagair compression ke raw pixel grid data. File size bohot bara hota hai.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Canvas API', 'ImageMagick'],
    goldenRule: 1,
  },
  tiff: {
    extension: 'tiff',
    name: 'Tagged Image File Format',
    category: 'raster',
    categoryLabel: 'Print / Archival Raster',
    mimeType: 'image/tiff',
    description: 'High-depth professional print, scanning, and publishing raster format.',
    romanUrduDescription: 'Professional printing aur archiving ke liye lossless high bit-depth format.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Sharp', 'libtiff'],
    goldenRule: 1,
  },
  ico: {
    extension: 'ico',
    name: 'Windows Icon',
    category: 'raster',
    categoryLabel: 'System Icon Raster',
    mimeType: 'image/x-icon',
    description: 'Multi-resolution container for desktop favicons and system icons.',
    romanUrduDescription: 'Favicon aur operating system icons ka multi-resolution container.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Canvas API', 'png2ico'],
    goldenRule: 1,
  },
  tga: {
    extension: 'tga',
    name: 'Truevision Targa',
    category: 'raster',
    categoryLabel: 'Game Raster',
    mimeType: 'image/x-tga',
    description: 'Game development and 3D texture raster format with direct alpha.',
    romanUrduDescription: 'Game engines aur 3D textures me uncompressed alpha maps ke liye use hota hai.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['ImageMagick', 'GIMP'],
    goldenRule: 1,
  },
  dds: {
    extension: 'dds',
    name: 'DirectDraw Surface',
    category: 'raster',
    categoryLabel: 'GPU Texture Raster',
    mimeType: 'image/vnd-ms.dds',
    description: 'DirectX compressed GPU texture container with DXT/BC compression and mipmaps.',
    romanUrduDescription: 'DirectX GPU texture format jo graphic card direct VRAM me load karta hai.',
    supportsAlpha: true,
    isLossy: 'both',
    maxBitDepth: 32,
    recommendedTools: ['DirectXTex', 'Texconv', 'GIMP DDS'],
    goldenRule: 1,
  },
  pcx: {
    extension: 'pcx',
    name: 'PiCture eXchange',
    category: 'raster',
    categoryLabel: 'Legacy Raster',
    mimeType: 'image/x-pcx',
    description: 'Historic MS-DOS Paintbrush raster format with simple run-length encoding.',
    romanUrduDescription: 'DOS era ka purana graphic format jo RLE compression use karta hai.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 24,
    recommendedTools: ['ImageMagick', 'Netpbm'],
    goldenRule: 1,
  },

  // Mobile / HDR
  heic: {
    extension: 'heic',
    name: 'High Efficiency Image Container',
    category: 'mobile_hdr',
    categoryLabel: 'Mobile / HDR',
    mimeType: 'image/heic',
    description: 'Apple iOS camera photo container based on HEVC/H.265 compression.',
    romanUrduDescription: 'iPhone ka default camera format. High quality aur depth maps support karta hai.',
    supportsAlpha: true,
    isLossy: true,
    maxBitDepth: 12,
    recommendedTools: ['libheif', 'Sharp with libheif', 'ImageMagick'],
    goldenRule: 1,
  },
  heif: {
    extension: 'heif',
    name: 'High Efficiency Image Format',
    category: 'mobile_hdr',
    categoryLabel: 'Mobile / HDR',
    mimeType: 'image/heif',
    description: 'ISO standardized container for compressed media and burst sequences.',
    romanUrduDescription: 'HEIF generic container jo modern mobile cameras me use hota hai.',
    supportsAlpha: true,
    isLossy: true,
    maxBitDepth: 12,
    recommendedTools: ['libheif', 'Sharp'],
    goldenRule: 1,
  },
  jxl: {
    extension: 'jxl',
    name: 'JPEG XL',
    category: 'mobile_hdr',
    categoryLabel: 'Mobile / HDR',
    mimeType: 'image/jxl',
    description: 'Next-generation lossless and lossy standard designed to succeed JPEG.',
    romanUrduDescription: 'Agli nasal ka photo format jo existing JPEGs ko baghair kisi loss ke 20% chhota kar deta hai.',
    supportsAlpha: true,
    isLossy: 'both',
    maxBitDepth: 32,
    recommendedTools: ['libjxl', 'cjpegxl'],
    goldenRule: 1,
  },
  exr: {
    extension: 'exr',
    name: 'OpenEXR',
    category: 'mobile_hdr',
    categoryLabel: 'VFX / HDR',
    mimeType: 'image/x-exr',
    description: 'Industrial Light & Magic 16/32-bit floating point HDR format for VFX.',
    romanUrduDescription: 'Hollywood VFX aur 3D rendering ke liye 32-bit float high dynamic range format.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['OpenEXR', 'Blender', 'ImageMagick'],
    goldenRule: 1,
  },
  hdr: {
    extension: 'hdr',
    name: 'Radiance HDR',
    category: 'mobile_hdr',
    categoryLabel: '3D / HDR',
    mimeType: 'image/vnd.radiance',
    description: 'RGBE high dynamic range format for 3D environment lighting map domes.',
    romanUrduDescription: '3D models ki realistic environmental lighting ke liye 360 HDR panorama format.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Radiance', 'Blender', 'Three.js'],
    goldenRule: 1,
  },

  // Vector
  svg: {
    extension: 'svg',
    name: 'Scalable Vector Graphics',
    category: 'vector',
    categoryLabel: 'Vector Graphic',
    mimeType: 'image/svg+xml',
    description: 'W3C XML vector standard that scales infinitely without losing sharpness.',
    romanUrduDescription: 'Mathematical vector standard. Jitna marzi zoom kar lo kabhi pixelate nahi hota.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 64,
    recommendedTools: ['Potrace', 'Inkscape', 'svgo', 'Canvas 2D'],
    goldenRule: 2,
  },
  eps: {
    extension: 'eps',
    name: 'Encapsulated PostScript',
    category: 'vector',
    categoryLabel: 'Vector Graphic',
    mimeType: 'application/postscript',
    description: 'Legacy PostScript vector format for commercial printing presses.',
    romanUrduDescription: 'Commercial printing presses aur vector packaging ka standard format.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Ghostscript', 'Inkscape', 'Illustrator'],
    goldenRule: 2,
  },
  pdf: {
    extension: 'pdf',
    name: 'Portable Document Format',
    category: 'vector',
    categoryLabel: 'Vector / Document',
    mimeType: 'application/pdf',
    description: 'Universal document and vector artwork container by Adobe.',
    romanUrduDescription: 'Universal document container jisme vector shapes, fonts aur rasters sab embed hote hain.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['pdf-lib', 'Ghostscript', 'Poppler pdftoppm'],
    goldenRule: 2,
  },
  ai: {
    extension: 'ai',
    name: 'Adobe Illustrator Artwork',
    category: 'vector',
    categoryLabel: 'Native Vector',
    mimeType: 'application/illustrator',
    description: 'Adobe Illustrator vector file with embedded PDF compatibility stream.',
    romanUrduDescription: 'Adobe Illustrator ki native vector file. Raster me convert karte waqt DPI set karni hoti hai.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Adobe Illustrator', 'Inkscape', 'UniConvertor'],
    goldenRule: 2,
  },
  cdr: {
    extension: 'cdr',
    name: 'CorelDRAW Vector Drawing',
    category: 'vector',
    categoryLabel: 'Native Vector',
    mimeType: 'application/coreldraw',
    description: 'CorelDRAW proprietary vector artwork document format.',
    romanUrduDescription: 'CorelDRAW ka vector file format jo printing aur cutting plotters me use hota hai.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['CorelDRAW', 'UniConvertor', 'Inkscape with libcdr'],
    goldenRule: 2,
  },

  // Native Projects
  psd: {
    extension: 'psd',
    name: 'Photoshop Document',
    category: 'layered_project',
    categoryLabel: 'Layered Project',
    mimeType: 'image/vnd.adobe.photoshop',
    description: 'Adobe Photoshop multi-layer project with masks, smart objects, and filters.',
    romanUrduDescription: 'Photoshop project. Export par tamam layers merge ho kar flat picture ban jati hain.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Photoshop', 'psd-tools', 'ImageMagick'],
    goldenRule: 4,
  },
  psb: {
    extension: 'psb',
    name: 'Photoshop Large Document',
    category: 'layered_project',
    categoryLabel: 'Layered Project',
    mimeType: 'image/vnd.adobe.photoshop',
    description: 'Photoshop format for files exceeding 2GB or 30,000 pixels in dimension.',
    romanUrduDescription: 'Bari billboards aur giant design files ke liye Photoshop Large format.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Photoshop', 'psd-tools'],
    goldenRule: 4,
  },
  xcf: {
    extension: 'xcf',
    name: 'GIMP Image Document',
    category: 'layered_project',
    categoryLabel: 'Layered Project',
    mimeType: 'image/x-xcf',
    description: 'GNU Image Manipulation Program native multi-layer document.',
    romanUrduDescription: 'GIMP open source software ka native layered project format.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['GIMP batch', 'ImageMagick'],
    goldenRule: 4,
  },
  kra: {
    extension: 'kra',
    name: 'Krita Paint Document',
    category: 'layered_project',
    categoryLabel: 'Layered Project',
    mimeType: 'application/x-krita',
    description: 'Krita digital painting application layered archive format.',
    romanUrduDescription: 'Krita digital painting ka layered project format.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Krita', 'unzip (mergedimage.png extract)'],
    goldenRule: 4,
  },
  afphoto: {
    extension: 'afphoto',
    name: 'Affinity Photo Document',
    category: 'layered_project',
    categoryLabel: 'Layered Project',
    mimeType: 'application/x-affinity-photo',
    description: 'Serif Affinity Photo native multi-layer raster & vector composition.',
    romanUrduDescription: 'Affinity Photo ka proprietary layered project file.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Affinity Photo'],
    goldenRule: 4,
  },

  // Camera RAW
  dng: {
    extension: 'dng',
    name: 'Digital Negative',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW / DNG',
    mimeType: 'image/x-adobe-dng',
    description: 'Adobe open standard raw camera sensor archival wrapper format.',
    romanUrduDescription: 'Adobe ka open-standard raw container jo sabhi camera brands ke sath compatible hai.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 16,
    recommendedTools: ['Adobe DNG Converter', 'LibRaw', 'dcraw'],
    goldenRule: 5,
  },
  cr2: {
    extension: 'cr2',
    name: 'Canon Raw 2',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW',
    mimeType: 'image/x-canon-cr2',
    description: 'Canon proprietary digital camera sensor raw data format.',
    romanUrduDescription: 'Canon DSLR cameras ka physical sensor raw data.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 14,
    recommendedTools: ['LibRaw', 'dcraw', 'Canon DPP'],
    goldenRule: 5,
  },
  cr3: {
    extension: 'cr3',
    name: 'Canon Raw 3',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW',
    mimeType: 'image/x-canon-cr3',
    description: 'Canon modern Digic 8+ camera sensor raw format with C-RAW compression.',
    romanUrduDescription: 'Canon EOS R mirrorless cameras ka naya CR3 format.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 14,
    recommendedTools: ['LibRaw 0.20+', 'Canon DPP'],
    goldenRule: 5,
  },
  nef: {
    extension: 'nef',
    name: 'Nikon Electronic Format',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW',
    mimeType: 'image/x-nikon-nef',
    description: 'Nikon proprietary digital camera sensor uncompressed raw data.',
    romanUrduDescription: 'Nikon cameras ka original sensor uncompressed data.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 14,
    recommendedTools: ['LibRaw', 'dcraw', 'Nikon NX Studio'],
    goldenRule: 5,
  },
  arw: {
    extension: 'arw',
    name: 'Sony Alpha Raw',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW',
    mimeType: 'image/x-sony-arw',
    description: 'Sony Alpha mirrorless and cinema camera sensor raw data.',
    romanUrduDescription: 'Sony Alpha cameras ka high dynamic range sensor raw format.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 14,
    recommendedTools: ['LibRaw', 'Sony Imaging Edge', 'dcraw'],
    goldenRule: 5,
  },
  raf: {
    extension: 'raf',
    name: 'Fujifilm Raw File',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW',
    mimeType: 'image/x-fuji-raf',
    description: 'Fujifilm proprietary X-Trans or Bayer sensor unprocessed raw data.',
    romanUrduDescription: 'Fujifilm X-Trans aur GFX sensors ka unique color filter raw data.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 16,
    recommendedTools: ['LibRaw', 'Fuji X RAW Studio', 'dcraw'],
    goldenRule: 5,
  },
  rw2: {
    extension: 'rw2',
    name: 'Panasonic Lumix Raw',
    category: 'camera_raw',
    categoryLabel: 'Camera RAW',
    mimeType: 'image/x-panasonic-rw2',
    description: 'Panasonic Lumix camera sensor raw photography data.',
    romanUrduDescription: 'Panasonic Lumix cameras ka raw sensor data.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 14,
    recommendedTools: ['LibRaw', 'SILKYPIX'],
    goldenRule: 5,
  },

  // Audio Formats
  mp3: {
    extension: 'mp3',
    name: 'MPEG Audio Layer III',
    category: 'audio',
    categoryLabel: 'Audio File',
    mimeType: 'audio/mpeg',
    description: 'Universal compressed lossy audio format with psychoacoustic encoding.',
    romanUrduDescription: 'Universal audio standard jo tamam media players me chalta hai.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 16,
    recommendedTools: ['LAME', 'FFmpeg', 'Web Audio API'],
    goldenRule: 0,
  },
  wav: {
    extension: 'wav',
    name: 'Waveform Audio File',
    category: 'audio',
    categoryLabel: 'Audio File',
    mimeType: 'audio/wav',
    description: 'Uncompressed raw PCM linear pulse-code modulated audio.',
    romanUrduDescription: 'Studio recording ka uncompressed lossy-free audio format.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 32,
    recommendedTools: ['Web Audio API', 'FFmpeg'],
    goldenRule: 0,
  },
  ogg: {
    extension: 'ogg',
    name: 'Ogg Vorbis Audio',
    category: 'audio',
    categoryLabel: 'Audio File',
    mimeType: 'audio/ogg',
    description: 'Open container compressed lossy audio format.',
    romanUrduDescription: 'Open-source streaming aur web audio format.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 16,
    recommendedTools: ['FFmpeg', 'Vorbis'],
    goldenRule: 0,
  },
  flac: {
    extension: 'flac',
    name: 'Free Lossless Audio Codec',
    category: 'audio',
    categoryLabel: 'Audio File',
    mimeType: 'audio/flac',
    description: 'Lossless audio compression standard preserving bit-for-bit fidelity.',
    romanUrduDescription: 'Audiophiles ke liye lossless pristine audio format.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 24,
    recommendedTools: ['libFLAC', 'FFmpeg'],
    goldenRule: 0,
  },
  aac: {
    extension: 'aac',
    name: 'Advanced Audio Coding',
    category: 'audio',
    categoryLabel: 'Audio File',
    mimeType: 'audio/aac',
    description: 'High efficiency lossy audio compression standard.',
    romanUrduDescription: 'Modern mobile devices aur Apple music ka high-efficiency audio codec.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 16,
    recommendedTools: ['FFmpeg', 'fdk-aac'],
    goldenRule: 0,
  },

  // Video Formats
  mp4: {
    extension: 'mp4',
    name: 'MPEG-4 Part 14 Video',
    category: 'video',
    categoryLabel: 'Video File',
    mimeType: 'video/mp4',
    description: 'Universal digital multimedia container format commonly storing H.264/AAC.',
    romanUrduDescription: 'Universal video format jo web aur mobile me 100% compatible hai.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 10,
    recommendedTools: ['FFmpeg', 'libx264'],
    goldenRule: 0,
  },
  webm: {
    extension: 'webm',
    name: 'WebM Video',
    category: 'video',
    categoryLabel: 'Video File',
    mimeType: 'video/webm',
    description: 'Royalty-free HTML5 video format utilizing VP9/AV1 and Opus audio.',
    romanUrduDescription: 'Google ka web video format jo transparent video bhi support karta hai.',
    supportsAlpha: true,
    isLossy: true,
    maxBitDepth: 10,
    recommendedTools: ['FFmpeg', 'libvpx'],
    goldenRule: 0,
  },
  avi: {
    extension: 'avi',
    name: 'Audio Video Interleave',
    category: 'video',
    categoryLabel: 'Video File',
    mimeType: 'video/x-msvideo',
    description: 'Microsoft standard multimedia container format.',
    romanUrduDescription: 'Windows ka legacy video container format.',
    supportsAlpha: false,
    isLossy: true,
    maxBitDepth: 8,
    recommendedTools: ['FFmpeg'],
    goldenRule: 0,
  },

  // Documents
  docx: {
    extension: 'docx',
    name: 'Microsoft Word Document',
    category: 'document',
    categoryLabel: 'Office Document',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Office Open XML word processing document with formatted text and tables.',
    romanUrduDescription: 'Microsoft Word ka standard document format.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 0,
    recommendedTools: ['mammoth', 'docx', 'LibreOffice'],
    goldenRule: 0,
  },
  txt: {
    extension: 'txt',
    name: 'Plain Text File',
    category: 'document',
    categoryLabel: 'Text Document',
    mimeType: 'text/plain',
    description: 'Unformatted UTF-8 standard plain text document.',
    romanUrduDescription: 'Sada text file baghair kisi formatting ke.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 0,
    recommendedTools: ['Native UTF-8 stream'],
    goldenRule: 0,
  },
  html: {
    extension: 'html',
    name: 'HTML Web Page',
    category: 'document',
    categoryLabel: 'Web Document',
    mimeType: 'text/html',
    description: 'Standard markup language for documents designed to be displayed in a web browser.',
    romanUrduDescription: 'Web browser document jisme styling aur layout include hoti hai.',
    supportsAlpha: true,
    isLossy: false,
    maxBitDepth: 0,
    recommendedTools: ['DOMParser', 'Pandoc'],
    goldenRule: 0,
  },
  md: {
    extension: 'md',
    name: 'Markdown Document',
    category: 'document',
    categoryLabel: 'Markup Document',
    mimeType: 'text/markdown',
    description: 'Lightweight markup language with plain text formatting syntax.',
    romanUrduDescription: 'Developer friendly lightweight formatted text document.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 0,
    recommendedTools: ['Marked', 'Pandoc'],
    goldenRule: 0,
  },
};

/**
 * Detect file format from File object
 */
export function detectFileFormat(file: File): FormatMeta {
  const fileName = file.name.toLowerCase();
  const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';

  if (FORMAT_CATALOG[ext]) {
    return FORMAT_CATALOG[ext];
  }

  // Fallback by MIME type
  for (const meta of Object.values(FORMAT_CATALOG)) {
    if (meta.mimeType === file.type) {
      return meta;
    }
  }

  // Generic fallback based on broad type
  if (file.type.startsWith('image/')) {
    return {
      extension: ext || 'img',
      name: (ext ? ext.toUpperCase() : 'Raster') + ' Image',
      category: 'raster',
      categoryLabel: 'Raster Image',
      mimeType: file.type || 'image/*',
      description: 'Standard digital bitmap image file.',
      romanUrduDescription: 'Digital image file.',
      supportsAlpha: true,
      isLossy: 'both',
      maxBitDepth: 24,
      recommendedTools: ['Sharp', 'Canvas API'],
      goldenRule: 1,
    };
  }

  if (file.type.startsWith('audio/')) {
    return {
      extension: ext || 'audio',
      name: (ext ? ext.toUpperCase() : 'Audio') + ' Stream',
      category: 'audio',
      categoryLabel: 'Audio File',
      mimeType: file.type,
      description: 'Digital audio sound clip.',
      romanUrduDescription: 'Audio track sound file.',
      supportsAlpha: false,
      isLossy: true,
      maxBitDepth: 16,
      recommendedTools: ['Web Audio API', 'FFmpeg'],
      goldenRule: 0,
    };
  }

  if (file.type.startsWith('video/')) {
    return {
      extension: ext || 'video',
      name: (ext ? ext.toUpperCase() : 'Video') + ' Media',
      category: 'video',
      categoryLabel: 'Video File',
      mimeType: file.type,
      description: 'Digital video recording.',
      romanUrduDescription: 'Video movie media file.',
      supportsAlpha: false,
      isLossy: true,
      maxBitDepth: 8,
      recommendedTools: ['FFmpeg'],
      goldenRule: 0,
    };
  }

  return {
    extension: ext || 'bin',
    name: ext.toUpperCase() || 'Binary File',
    category: 'document',
    categoryLabel: 'Document File',
    mimeType: file.type || 'application/octet-stream',
    description: 'Data document file.',
    romanUrduDescription: 'Data document file.',
    supportsAlpha: false,
    isLossy: false,
    maxBitDepth: 0,
    recommendedTools: ['pdf-lib', 'Pandoc'],
    goldenRule: 0,
  };
}

/**
 * STRICT EXCLUSION RULE IMPLEMENTATION:
 * Given a source format, returns available target formats grouped by category.
 * The uploaded format IS NEVER INCLUDED in the target list!
 */
export function getAvailableTargetsForFormat(sourceMeta: FormatMeta): {
  category: string;
  categoryLabel: string;
  formats: FormatMeta[];
}[] {
  const currentExt = sourceMeta.extension.toLowerCase();
  const sourceCategory = sourceMeta.category;

  const validTargets: FormatMeta[] = [];

  // Determine valid target formats based on media domain
  for (const meta of Object.values(FORMAT_CATALOG)) {
    const targetExt = meta.extension.toLowerCase();

    // STRICT EXCLUSION: If uploaded format matches target, SKIP IT!
    if (targetExt === currentExt) {
      continue;
    }
    // Also skip jpg/jpeg duplicates
    if ((currentExt === 'jpg' && targetExt === 'jpeg') || (currentExt === 'jpeg' && targetExt === 'jpg')) {
      continue;
    }

    // STRICT GOLDEN RULE 5: No format can convert into camera RAW (sensor cannot be reconstructed)
    if (meta.category === 'camera_raw' && targetExt !== 'dng') {
      continue; // Camera RAW formats like CR2, NEF, ARW, RAF, RW2 cannot be targets!
    }

    // If source is image/vector/project/raw
    if (['raster', 'mobile_hdr', 'vector', 'layered_project', 'camera_raw'].includes(sourceCategory)) {
      // Can convert to other raster, mobile_hdr, vector (trace/rasterize), document (PDF)
      if (['raster', 'mobile_hdr', 'vector'].includes(meta.category)) {
        validTargets.push(meta);
      } else if (meta.extension === 'pdf') {
        validTargets.push(meta);
      }
    } else if (sourceCategory === 'audio') {
      // Audio can convert to other audio formats
      if (meta.category === 'audio') {
        validTargets.push(meta);
      }
    } else if (sourceCategory === 'video') {
      // Video can convert to other video formats or extract to audio (MP3, WAV)
      if (meta.category === 'video' || ['mp3', 'wav', 'aac'].includes(meta.extension)) {
        validTargets.push(meta);
      }
    } else if (sourceCategory === 'document') {
      // Document can convert to PDF, DOCX, TXT, HTML, MD
      if (['pdf', 'docx', 'txt', 'html', 'md'].includes(meta.extension)) {
        validTargets.push(meta);
      }
    }
  }

  // Deduplicate by extension
  const uniqueTargetsMap = new Map<string, FormatMeta>();
  for (const item of validTargets) {
    if (!uniqueTargetsMap.has(item.extension)) {
      uniqueTargetsMap.set(item.extension, item);
    }
  }
  const uniqueTargets = Array.from(uniqueTargetsMap.values());

  // Group by category
  const groups: Record<string, { label: string; formats: FormatMeta[] }> = {};

  for (const target of uniqueTargets) {
    let catKey = target.category;
    let label = target.categoryLabel;

    if (!groups[catKey]) {
      groups[catKey] = { label, formats: [] };
    }
    groups[catKey].formats.push(target);
  }

  return Object.entries(groups).map(([catKey, val]) => ({
    category: catKey,
    categoryLabel: val.label,
    formats: val.formats,
  }));
}

/**
 * Get Technical Rule Explanation for a specific [Source, Target] conversion pair
 */
export function getConversionRuleExplanation(source: FormatMeta, targetExt: string): {
  ruleNumber: GoldenRuleNumber;
  ruleTitle: string;
  romanUrdu: string;
  english: string;
  warning?: string;
  badgeType: 'direct' | 'rasterize' | 'trace' | 'flatten' | 'impossible' | 'media';
} {
  const targetMeta = FORMAT_CATALOG[targetExt.toLowerCase()];
  const srcCat = source.category;
  const tgtCat = targetMeta ? targetMeta.category : 'raster';

  // Rule 5: Attempting to convert to proprietary Camera RAW
  if (['cr2', 'cr3', 'nef', 'arw', 'raf', 'rw2'].includes(targetExt.toLowerCase())) {
    return {
      ruleNumber: 5,
      ruleTitle: 'Golden Rule 5: Image to Camera RAW (Impossible)',
      romanUrdu:
        'Namumkin hai! Kyunke camera sensor ka physical uncompressed photosite bayer data software wapas recreate nahi kar sakta.',
      english:
        'Physically impossible: Hardware sensor readouts cannot be synthesized from a processed bitmap. Only generic Adobe DNG linear tags can wrap pixels.',
      warning: 'Sensor hardware data cannot be recreated mathematically.',
      badgeType: 'impossible',
    };
  }

  // Rule 1: Raster to Raster
  if (
    (srcCat === 'raster' || srcCat === 'mobile_hdr') &&
    (tgtCat === 'raster' || tgtCat === 'mobile_hdr')
  ) {
    let warning: string | undefined;
    if (source.supportsAlpha && !targetMeta?.supportsAlpha) {
      warning = `Transparency Warning: ${source.extension.toUpperCase()} me transparent background hai, lekin ${targetExt.toUpperCase()} transparency support nahi karta (background white ho jayega).`;
    }

    return {
      ruleNumber: 1,
      ruleTitle: 'Golden Rule 1: Raster to Raster (100% Direct)',
      romanUrdu:
        'Ye aapas me 100% direct aur baghair kisi issue ke convert ho jate hain. Pixels directly re-encoded hote hain.',
      english:
        'Direct 1:1 raster pixel translation. Pixel grid is re-encoded into the target container with chosen compression settings.',
      warning,
      badgeType: 'direct',
    };
  }

  // Rule 2: Vector to Raster
  if (srcCat === 'vector' && (tgtCat === 'raster' || tgtCat === 'mobile_hdr')) {
    return {
      ruleNumber: 2,
      ruleTitle: 'Golden Rule 2: Vector to Raster (Resolution / DPI Dependent)',
      romanUrdu:
        'Bohat asan hai, bas output resolution (e.g. 1080p, 4K, ya 300 DPI) set karke rasterize karna hota hai. Infinite mathematical formulas physical pixels me render ho jati hain.',
      english:
        'Vector primitives (Bézier curves, lines, fills) are rasterized onto a fixed resolution canvas. Scalability becomes fixed at the selected DPI.',
      badgeType: 'rasterize',
    };
  }

  // Rule 3: Raster to Vector
  if ((srcCat === 'raster' || srcCat === 'mobile_hdr') && tgtCat === 'vector') {
    return {
      ruleNumber: 3,
      ruleTitle: 'Golden Rule 3: Raster to Vector (Requires Image Tracing)',
      romanUrdu:
        'Direct 1:1 mathematical conversion nahi hoti; software me Image Trace ya Vectorization karni parti hai. Pixels ke edges detect karke Bézier vector paths bante hain.',
      english:
        'Algorithmic contour tracing (Potrace) converts pixel color boundaries into Bézier curves and XML path nodes. Logos & line-art trace cleanest.',
      warning: 'Complex photographic images produce thousands of paths. Best suited for logos, graphics, and line art.',
      badgeType: 'trace',
    };
  }

  // Rule 4: Project Files to Image
  if (srcCat === 'layered_project') {
    return {
      ruleNumber: 4,
      ruleTitle: 'Golden Rule 4: Project Files to Image (Flattened Layers)',
      romanUrdu:
        'Sab layers flat (merge) ho kar single picture ban jati hain. Adjustment layers aur layer masks non-editable ban jate hain.',
      english:
        'Multi-layer composition is flattened into a single merged canvas. Individual layer edits, text fields, and adjustment layers become baked.',
      warning: 'Layer hierarchy will be merged into a single composite raster plane.',
      badgeType: 'flatten',
    };
  }

  // Camera RAW to Raster / DNG
  if (srcCat === 'camera_raw') {
    return {
      ruleNumber: 5,
      ruleTitle: 'Camera RAW Demosaicing & Export',
      romanUrdu:
        'RAW sensor data demosaic ho kar full color RGB pixels me develop kiya jata hai.',
      english:
        'Raw sensor Bayer data is interpolated (demosaiced), white-balanced, and color-profiled into standard RGB raster output.',
      badgeType: 'direct',
    };
  }

  // Audio / Video / Document
  return {
    ruleNumber: 0,
    ruleTitle: 'Stream & Container Transcoding',
    romanUrdu:
      'Direct stream transcoding aur container conversion smoothly process hoti hai.',
    english:
      'Standard container re-muxing or codec transcoding with sample rate and bit-depth normalization.',
    badgeType: 'media',
  };
}

/**
 * Generate Complete Master Markdown Table for all formats
 */
export function generateMasterMarkdownTable(): string {
  const formatsList = [
    // Raster
    'JPG', 'PNG', 'WEBP', 'AVIF', 'GIF', 'BMP', 'TIFF', 'ICO', 'TGA', 'DDS', 'PCX',
    // Mobile / HDR
    'HEIC', 'JXL', 'EXR', 'HDR',
    // Vector
    'SVG', 'EPS', 'PDF', 'AI', 'CDR',
    // Native Projects
    'PSD', 'PSB', 'XCF', 'KRA', 'AFPHOTO',
    // Camera RAW
    'DNG', 'CR2/CR3', 'NEF', 'ARW', 'RAF', 'RW2',
  ];

  let md = `# OmniConvert Master Image & Graphic Format Cross-Conversion Matrix\n\n`;
  md += `| Input Format | Category | Target: Raster | Target: Vector | Target: Projects | Target: Camera RAW | 5 Golden Rules Classification | Transparency Support | Bit-Depth | Native Tools & Engines |\n`;
  md += `|:-------------|:---------|:---------------|:---------------|:-----------------|:-------------------|:------------------------------|:---------------------|:----------|:-----------------------|\n`;

  const matrixData: {
    format: string;
    cat: string;
    raster: string;
    vector: string;
    proj: string;
    raw: string;
    rule: string;
    alpha: string;
    bits: string;
    tools: string;
  }[] = [
    // Raster
    { format: 'JPG / JPEG', cat: 'Raster', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '❌ No Alpha', bits: '8-bit', tools: 'Sharp, mozjpeg, ImageMagick' },
    { format: 'PNG', cat: 'Raster', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full 8-bit Alpha', bits: '8/16-bit', tools: 'Sharp, libpng, oxipng' },
    { format: 'WEBP', cat: 'Modern Raster', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full Alpha', bits: '8-bit', tools: 'Sharp, cwebp, libwebp' },
    { format: 'AVIF', cat: 'Next-Gen Raster', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full Alpha', bits: '10/12-bit', tools: 'Sharp, libavif' },
    { format: 'GIF', cat: 'Raster Palette', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '⚠️ 1-bit Binary', bits: '8-bit (256 col)', tools: 'Sharp, gifsicle, FFmpeg' },
    { format: 'BMP', cat: 'Uncompressed', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Optional 32-bit', bits: '24/32-bit', tools: 'Canvas API, ImageMagick' },
    { format: 'TIFF', cat: 'Print / Archival', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Multi-page Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full Alpha', bits: '16/32-bit', tools: 'Sharp, libtiff, Photoshop' },
    { format: 'ICO', cat: 'System Icon', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full Alpha', bits: '32-bit RGBA', tools: 'Canvas API, png2ico' },
    { format: 'TGA', cat: 'Game Texture', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full Alpha Channel', bits: '24/32-bit', tools: 'ImageMagick, GIMP, DirectX' },
    { format: 'DDS', cat: 'GPU Texture', raster: '✅ 100% Direct (Decomp)', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ DXT5/BC3 Alpha', bits: 'BCn compressed', tools: 'DirectXTex, Texconv, GIMP' },
    { format: 'PCX', cat: 'Legacy Raster', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '❌ No Alpha', bits: '8/24-bit', tools: 'ImageMagick, Netpbm' },

    // Mobile / HDR
    { format: 'HEIC / HEIF', cat: 'Mobile / Apple', raster: '✅ 100% Direct (libheif)', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Alpha & Depth Map', bits: '10/12-bit', tools: 'libheif, Sharp, ImageMagick' },
    { format: 'JXL', cat: 'Next-Gen HDR', raster: '✅ 100% Direct', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Full Alpha', bits: '32-bit Float', tools: 'libjxl, cjpegxl' },
    { format: 'EXR', cat: 'VFX / Cinema', raster: '✅ Tone-map to 8-bit', vector: '⚠️ Trace Required', proj: '🔄 Multi-channel Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '✅ Arbitrary Channels', bits: '16/32-bit Float', tools: 'OpenEXR, Blender, Nuke' },
    { format: 'HDR', cat: '3D Radiance', raster: '✅ Tone-map to 8-bit', vector: '⚠️ Trace Required', proj: '🔄 Single Layer Import', raw: '❌ Impossible (Rule 5)', rule: 'Rule 1 (Direct)', alpha: '❌ RGBE Encoded', bits: '32-bit RGBE', tools: 'Radiance, Blender, Three.js' },

    // Vector
    { format: 'SVG', cat: 'Vector Standard', raster: '✅ Rasterize (Rule 2)', vector: '✅ 100% Direct Vector', proj: '🔄 Import as Smart Shape', raw: '❌ Impossible (Rule 5)', rule: 'Rule 2 (Rasterize)', alpha: '✅ Full Vector Alpha', bits: 'Infinite (Math)', tools: 'Resvg, Inkscape, Canvas 2D' },
    { format: 'EPS', cat: 'Print Vector', raster: '✅ Rasterize at DPI', vector: '✅ Direct PostScript', proj: '🔄 Import Vector Layer', raw: '❌ Impossible (Rule 5)', rule: 'Rule 2 (Rasterize)', alpha: '✅ PostScript Alpha', bits: 'Infinite (Math)', tools: 'Ghostscript, Illustrator' },
    { format: 'PDF', cat: 'Vector Document', raster: '✅ Render via Poppler', vector: '✅ Extract Vector Shapes', proj: '🔄 Import Page as Layer', raw: '❌ Impossible (Rule 5)', rule: 'Rule 2 (Rasterize)', alpha: '✅ Full Alpha', bits: 'Document Scale', tools: 'pdf-lib, Ghostscript, Poppler' },
    { format: 'AI', cat: 'Adobe Vector', raster: '✅ Render PDF Stream', vector: '✅ Illustrator Vector', proj: '🔄 Open in Photoshop', raw: '❌ Impossible (Rule 5)', rule: 'Rule 2 (Rasterize)', alpha: '✅ Full Alpha', bits: 'Infinite (Math)', tools: 'Adobe Illustrator, Inkscape' },
    { format: 'CDR', cat: 'CorelDRAW Vector', raster: '✅ Export Raster', vector: '✅ Corel Vector', proj: '🔄 Export to PSD', raw: '❌ Impossible (Rule 5)', rule: 'Rule 2 (Rasterize)', alpha: '✅ Full Alpha', bits: 'Infinite (Math)', tools: 'CorelDRAW, UniConvertor' },

    // Native Projects
    { format: 'PSD', cat: 'Layered Project', raster: '✅ Flattened (Rule 4)', vector: '⚠️ Trace Paths', proj: '✅ Native Photoshop', raw: '❌ Impossible (Rule 5)', rule: 'Rule 4 (Flattened)', alpha: '✅ Layer Transparency', bits: '8/16/32-bit', tools: 'Photoshop, psd-tools, Sharp' },
    { format: 'PSB', cat: 'Large Project', raster: '✅ Flattened (Rule 4)', vector: '⚠️ Trace Paths', proj: '✅ Large Photoshop Doc', raw: '❌ Impossible (Rule 5)', rule: 'Rule 4 (Flattened)', alpha: '✅ Layer Transparency', bits: '8/16/32-bit', tools: 'Photoshop, psd-tools' },
    { format: 'XCF', cat: 'GIMP Layered', raster: '✅ Flattened (Rule 4)', vector: '⚠️ Trace Paths', proj: '✅ GIMP Native', raw: '❌ Impossible (Rule 5)', rule: 'Rule 4 (Flattened)', alpha: '✅ Layer Transparency', bits: '8/16/32-bit', tools: 'GIMP batch, ImageMagick' },
    { format: 'KRA', cat: 'Krita Paint', raster: '✅ Extract Merged PNG', vector: '⚠️ Trace Paths', proj: '✅ Krita Native', raw: '❌ Impossible (Rule 5)', rule: 'Rule 4 (Flattened)', alpha: '✅ Layer Transparency', bits: '8/16/32-bit Float', tools: 'Krita CLI, unzip archive' },
    { format: 'AFPHOTO', cat: 'Affinity Project', raster: '✅ Flattened (Rule 4)', vector: '⚠️ Trace Paths', proj: '✅ Affinity Native', raw: '❌ Impossible (Rule 5)', rule: 'Rule 4 (Flattened)', alpha: '✅ Layer Transparency', bits: '8/16/32-bit', tools: 'Affinity Photo' },

    // Camera RAW
    { format: 'DNG', cat: 'Open RAW DNG', raster: '✅ Demosaic to TIFF/JPG', vector: '⚠️ Trace Required', proj: '🔄 Camera Raw Plugin', raw: '✅ DNG Raw Container', rule: 'Rule 5 (Demosaic)', alpha: '❌ No Alpha', bits: '12/14/16-bit', tools: 'Adobe DNG, LibRaw, dcraw' },
    { format: 'CR2 / CR3', cat: 'Canon Sensor RAW', raster: '✅ Demosaic to TIFF/JPG', vector: '⚠️ Trace Required', proj: '🔄 Camera Raw Plugin', raw: '🔄 Convert to DNG only', rule: 'Rule 5 (Demosaic)', alpha: '❌ No Alpha', bits: '14-bit Uncompressed', tools: 'LibRaw, Canon DPP, dcraw' },
    { format: 'NEF', cat: 'Nikon Sensor RAW', raster: '✅ Demosaic to TIFF/JPG', vector: '⚠️ Trace Required', proj: '🔄 Camera Raw Plugin', raw: '🔄 Convert to DNG only', rule: 'Rule 5 (Demosaic)', alpha: '❌ No Alpha', bits: '12/14-bit NEF', tools: 'LibRaw, Nikon NX, dcraw' },
    { format: 'ARW', cat: 'Sony Sensor RAW', raster: '✅ Demosaic to TIFF/JPG', vector: '⚠️ Trace Required', proj: '🔄 Camera Raw Plugin', raw: '🔄 Convert to DNG only', rule: 'Rule 5 (Demosaic)', alpha: '❌ No Alpha', bits: '14-bit ARW', tools: 'LibRaw, Sony Edge, dcraw' },
    { format: 'RAF', cat: 'Fuji Sensor RAW', raster: '✅ Demosaic to TIFF/JPG', vector: '⚠️ Trace Required', proj: '🔄 Camera Raw Plugin', raw: '🔄 Convert to DNG only', rule: 'Rule 5 (Demosaic)', alpha: '❌ No Alpha', bits: '14/16-bit X-Trans', tools: 'LibRaw, Fuji Studio, dcraw' },
    { format: 'RW2', cat: 'Lumix Sensor RAW', raster: '✅ Demosaic to TIFF/JPG', vector: '⚠️ Trace Required', proj: '🔄 Camera Raw Plugin', raw: '🔄 Convert to DNG only', rule: 'Rule 5 (Demosaic)', alpha: '❌ No Alpha', bits: '12/14-bit RW2', tools: 'LibRaw, SILKYPIX, dcraw' },
  ];

  for (const row of matrixData) {
    md += `| **${row.format}** | ${row.cat} | ${row.raster} | ${row.vector} | ${row.proj} | ${row.raw} | ${row.rule} | ${row.alpha} | ${row.bits} | ${row.tools} |\n`;
  }

  md += `\n### 5 Golden Rules Summary (Roman Urdu & English):\n\n`;
  for (const rule of GOLDEN_RULES) {
    md += `#### Rule ${rule.number}: ${rule.title}\n`;
    md += `- **Coverage**: ${rule.formats}\n`;
    md += `- **Roman Urdu**: ${rule.romanUrdu}\n`;
    md += `- **Technical English**: ${rule.english}\n`;
    md += `- **Recommended Toolchain**: ${rule.tooling}\n\n`;
  }

  return md;
}
