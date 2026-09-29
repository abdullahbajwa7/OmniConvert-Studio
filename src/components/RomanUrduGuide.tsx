import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Sliders, Layers, EyeOff, Wrench } from 'lucide-react';

export const RomanUrduGuide: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Title Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1">
          Technical Handbook & Specialist Rules
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Digital Graphic File Format Specialist Guide (Roman Urdu)
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Digital media conversion, transparency physics, compression loss aur toolchain ki mukammal tafseel.
        </p>
      </div>

      {/* 5 Golden Rules Detailed Section */}
      <div className="space-y-6 mb-12">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white pb-2 border-b border-neutral-200 dark:border-neutral-800">
          5 Golden Conversion Rules (Tafseeli Wazaahat)
        </h3>

        {/* Rule 1 */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center shadow-xs">
              1
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Rule 1: Raster to Raster (Direct 1:1 Pixel Re-encoding)
            </h4>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3.5">
            <strong>Roman Urdu:</strong> JPG, PNG, WEBP, BMP, TIFF, HEIC, AVIF, GIF, ICO, TGA ye aapas me 100% direct aur baghair kisi issue ke convert ho jate hain. Kyunke sabhi formats ek rectangular pixel grid (width × height) par mushtamil hote hain, software sirf ek format ke compression algorithm ko decode karke doosre format me re-encode karta hai.
          </p>
          <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 text-xs space-y-2 border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 backdrop-blur-md">
            <p>
              <strong className="text-neutral-900 dark:text-white">Transparency Behavior:</strong> Agar aap PNG (jo transparent hai) se JPG banayenge, to JPG transparency support nahi karta; transparent hissa automatically white background me convert ho jayega. WebP, AVIF aur TIFF me transparency barqaraar rehti hai.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Quality / Compression:</strong> Lossy format (JPG/WebP lossy) me quality percentage (1–100%) chuni jati hai. Lossless format (PNG, TIFF) me har pixel bilkul waisa hi rehta hai jaisa original me tha.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Tooling:</strong> Sharp (libvips), ImageMagick, libpng, mozjpeg.
            </p>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center shadow-xs">
              2
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Rule 2: Vector to Raster (Resolution & DPI Rasterization)
            </h4>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3.5">
            <strong>Roman Urdu:</strong> SVG, AI, EPS, CDR, PDF ➔ JPG, PNG etc. Bohat asan hai, bas output resolution (e.g. 1080p, 4K, ya 300 DPI) set karke rasterize karna hota hai.
          </p>
          <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 text-xs space-y-2 border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 backdrop-blur-md">
            <p>
              <strong className="text-neutral-900 dark:text-white">Kyun Zaroori Hai?</strong> Vector files me mathematical lines aur Bézier curves hoti hain jin ka koi fixed pixel size nahi hota. Jab aap inko JPG ya PNG banate hain, to engine ko batana parta hai ke kitne pixels par draw karna hai (Web ke liye 72 DPI, High Quality Print ke liye 300 DPI).
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Ek Baar Rasterize Ho Jane Ke Baad:</strong> Infinite zoom khatam ho jata hai aur file fixed pixels ban jati hai.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Tooling:</strong> Inkscape CLI, Ghostscript, Poppler pdftoppm, HTML5 Canvas 2D.
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center shadow-xs">
              3
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Rule 3: Raster to Vector (Image Tracing & Contour Detection)
            </h4>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3.5">
            <strong>Roman Urdu:</strong> JPG, PNG ➔ SVG, AI, EPS, PDF. Direct 1:1 mathematical conversion nahi hoti; software me Image Trace ya Vectorization karni parti hai.
          </p>
          <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 text-xs space-y-2 border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 backdrop-blur-md">
            <p>
              <strong className="text-neutral-900 dark:text-white">Technical Wazaahat:</strong> Ek photo ke lakhoon pixels ko mathematical curves me convert karne ke liye edge-detection aur polygon contour algorithm (e.g. Potrace) chalana parta hai. Logos, icons, aur black & white line drawings bohot shandar trace hoti hain. Lekin realistic insan ki photo trace karne par SVG file hazaron paths se bhar jati hai aur file size megabytes me chala jata hai.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Tooling:</strong> Potrace, AutoTrace, Inkscape Trace Bitmap, Adobe Illustrator Image Trace.
            </p>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center shadow-xs">
              4
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Rule 4: Project Files to Image (Layer Flattening / Merge)
            </h4>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3.5">
            <strong>Roman Urdu:</strong> PSD, PSB, XCF, KRA, AFPHOTO ➔ JPG, PNG. Sab layers flat (merge) ho kar single picture ban jati hain. Reverse me normal image as single background layer import hoti hai.
          </p>
          <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 text-xs space-y-2 border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 backdrop-blur-md">
            <p>
              <strong className="text-neutral-900 dark:text-white">Warning:</strong> Photoshop ya Krita ke project me text layers, adjustment layers, drop shadows aur masks hote hain. Jab aap ise JPG/PNG banate hain to saari layers composite ho kar ek flat canvas ban jati hain. Iske baad text ko edit nahi kiya ja sakta.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Tooling:</strong> Photoshop Scripting, psd-tools, GIMP CLI, Krita CLI.
            </p>
          </div>
        </div>

        {/* Rule 5 */}
        <div className="p-6 rounded-2xl glass-panel shadow-sm">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-7 h-7 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center shadow-xs">
              5
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Rule 5: Image to Camera RAW (Technically Impossible)
            </h4>
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3.5">
            <strong>Roman Urdu:</strong> Any Image ➔ CR2, NEF, ARW, RAF, RW2. <strong>Namumkin hai!</strong> Kyunke camera sensor ka physical uncompressed raw data software wapas create nahi kar sakta.
          </p>
          <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 text-xs space-y-2 border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 backdrop-blur-md">
            <p>
              <strong className="text-neutral-900 dark:text-white">Physics Aur Engineering Reason:</strong> Camera RAW file koi ordinary image nahi hoti, balkay camera ke CMOS/CCD sensor par light girne se paida hone wala voltage readout (Bayer color filter array) hota hai. Ek baar jab image develop ho kar JPG ya PNG ban gayi, to sensor ki original electrical readings hamesha ke liye wipe out ho jati hain. Koi software sensor ka hardware physical readout dobara generate nahi kar sakta. Sirf generic Adobe DNG container wrap ho sakta hai, lekin genuine Canon/Nikon/Sony RAW wapas nahi ban sakti.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">Proper Workflow:</strong> Camera RAW ➔ TIFF / DNG / JPG (Demosaicing via LibRaw / Lightroom).
            </p>
          </div>
        </div>
      </div>

      {/* Transparency & Compression Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <EyeOff className="w-4 h-4" />
            <span>Transparency Matrix (Alpha Channels)</span>
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-neutral-900 dark:text-white">Full Alpha (8-bit / 256 levels):</strong> PNG, WEBP, AVIF, TIFF, SVG, PSD. Soft transparent shadows aur smooth glass gradients preserve hote hain.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">1-bit Binary Alpha (On / Off):</strong> GIF. Pixel ya to 100% visible hoga ya 100% invisible. Jagged edges (anti-aliasing issue) aate hain.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">No Alpha (Opaque only):</strong> JPG, JPEG, PCX, Standard HDR. Inme transparent hissa white background se replace ho jata hai.
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Compression & Quality Rules</span>
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-neutral-900 dark:text-white">Lossless:</strong> PNG, TIFF, BMP, WebP Lossless, FLAC. File size thora bara hota hai lekin har single pixel 100% mathematically exact rehta hai.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Lossy:</strong> JPG, WebP Lossy, AVIF, MP3, MP4. File size 80-90% chhota ho jata hai kyunke insani aankh/kaan jin details ko mehsus nahi kar sakte unhe discard kar diya jata hai.
            </li>
            <li>
              <strong className="text-neutral-900 dark:text-white">Generation Loss:</strong> Ek hi JPG ko bar bar convert ya save karne se compression artifacts barhte jate hain.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
