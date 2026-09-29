import React, { useRef, useState } from 'react';
import { UploadCloud, FileUp, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ConversionJob } from '../types/conversion';
import { HeroConversionStudio } from './HeroConversionStudio';

interface HeroUploaderProps {
  jobs: ConversionJob[];
  activeJobId: string | null;
  onSelectJob: (id: string) => void;
  onFilesSelected: (files: File[]) => void;
  onApplyPreset: (presetName: string) => void;
  onUpdateJob: (id: string, updates: Partial<ConversionJob>) => void;
  onRemoveJob: (id: string) => void;
  onConvertJob: (id: string) => void;
  onConvertAll: () => void;
  onClearAll: () => void;
  activeCategoryFilter: string;
}

export const HeroUploader: React.FC<HeroUploaderProps> = ({
  jobs,
  activeJobId,
  onSelectJob,
  onFilesSelected,
  onApplyPreset,
  onUpdateJob,
  onRemoveJob,
  onConvertJob,
  onConvertAll,
  onClearAll,
  activeCategoryFilter,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = ''; // Reset input to allow re-upload of same file
    }
  };

  // Create demo file for instant test
  const handleLoadDemoFile = (type: 'png' | 'svg' | 'txt' | 'jpg') => {
    let file: File;
    if (type === 'svg') {
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <circle cx="100" cy="100" r="80" fill="#3b82f6" />
        <path d="M70 100 L90 120 L135 75" stroke="#ffffff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      file = new File([svgData], 'vector_badge_sample.svg', { type: 'image/svg+xml' });
    } else if (type === 'txt') {
      const txtData = `OmniConvert Document Sample\n\nThis is a sample document file formatted for testing online conversion.\n- Fast batch conversion\n- 5 Golden Rules compliance\n- Zero telemetry\n- Instant download output.`;
      file = new File([txtData], 'quarterly_report_sample.txt', { type: 'text/plain' });
    } else {
      // Create minimal synthetic PNG via Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, 400, 300);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#6366f1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('Sample Graphic Asset', 40, 160);
      }
      canvas.toBlob((blob) => {
        if (blob) {
          const sample = new File([blob], type === 'png' ? 'alpha_showcase_sample.png' : 'hero_photo_sample.jpg', {
            type: type === 'png' ? 'image/png' : 'image/jpeg',
          });
          onFilesSelected([sample]);
        }
      });
      return;
    }
    onFilesSelected([file]);
  };

  return (
    <section className="relative pt-8 pb-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10 blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        {/* Editorial Subtitle / Kicker */}
        <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold mb-2.5">
          Universal Digital Media Conversion & Technical Guide
        </p>

        {/* Display Headline with balanced wrap */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3 text-balance">
          Convert Any File. Adhere to Media Physics.
        </h1>

        {/* Single unboxed metadata line */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          <span>Raster & Vector</span>
          <span aria-hidden="true">·</span>
          <span>Camera RAW Demosaicing</span>
          <span aria-hidden="true">·</span>
          <span>Audio & Video</span>
          <span aria-hidden="true">·</span>
          <span>PDF & Documents</span>
          <span aria-hidden="true">·</span>
          <span>100% Zero Quality Loss</span>
        </div>

        {/* IN-PLACE SHOWCASE ZONE ("itni jaga pe image show honi chaye") */}
        {jobs.length > 0 && activeJobId ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`transition-all duration-300 ${isDragging ? 'ring-2 ring-neutral-900 dark:ring-white scale-[1.01]' : ''}`}
          >
            <HeroConversionStudio
              jobs={jobs}
              activeJobId={activeJobId}
              onSelectJob={onSelectJob}
              onUpdateJob={onUpdateJob}
              onRemoveJob={onRemoveJob}
              onConvertJob={onConvertJob}
              onConvertAll={onConvertAll}
              onClearAll={onClearAll}
              onAddFiles={onFilesSelected}
            />
          </div>
        ) : (
          /* Empty Drag and Drop Upload Zone - Glassy Premium Box */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-3xl p-8 sm:p-12 transition-all duration-300 cursor-pointer ${
              isDragging
                ? 'glass-panel ring-2 ring-neutral-900 dark:ring-white scale-[1.01] shadow-2xl'
                : 'glass-panel hover:border-neutral-400/80 dark:hover:border-white/30 shadow-xl hover:shadow-2xl'
            }`}
          >
            <input
              ref={fileInputRef}
              id="file-upload-input"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center pointer-events-none">
              {/* Glass Icon Circle */}
              <div className="w-16 h-16 rounded-2xl glass-button flex items-center justify-center text-neutral-900 dark:text-white mb-4 transition-transform group-hover:scale-110 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>

              <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
                Drag & drop your files here, or <span className="underline decoration-neutral-400 underline-offset-4 font-extrabold">browse files</span>
              </p>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mb-5 leading-relaxed">
                Supports 30+ major formats including JPG, PNG, WEBP, HEIC, SVG, PSD, RAW, MP3, MP4, PDF. Instant in-memory processing up to 50MB.
              </p>

              {/* Quick Demo Test Trigger */}
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 mt-1">
                <span className="text-xs text-neutral-400 font-medium">Or test sample:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadDemoFile('png');
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg glass-button text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-all font-mono font-medium active:scale-95"
                >
                  Sample Image (.PNG)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadDemoFile('svg');
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg glass-button text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-all font-mono font-medium active:scale-95"
                >
                  Sample Vector (.SVG)
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadDemoFile('txt');
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg glass-button text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-all font-mono font-medium active:scale-95"
                >
                  Sample Document (.TXT)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popular Presets Quick Strip */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-neutral-400 dark:text-neutral-500 font-medium mr-1">Popular Quick Presets:</span>
          {[
            { label: 'JPG to PNG', id: 'jpg-to-png' },
            { label: 'PNG to JPG', id: 'png-to-jpg' },
            { label: 'WebP to JPG', id: 'webp-to-jpg' },
            { label: 'HEIC to JPG', id: 'heic-to-jpg' },
            { label: 'MP3 to WAV', id: 'mp3-to-wav' },
            { label: 'MP4 to MP3', id: 'mp4-to-mp3' },
            { label: 'PDF to Word', id: 'pdf-to-word' },
            { label: 'Word to PDF', id: 'word-to-pdf' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id)}
              className="px-3 py-1.5 rounded-xl glass-button text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-900 dark:hover:border-white transition-all font-medium active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
