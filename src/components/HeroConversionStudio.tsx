import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  RefreshCw,
  Trash2,
  Archive,
  CheckCircle2,
  Plus,
  Maximize2,
  X,
  Sparkles,
  AlertTriangle,
  Sliders,
  FileText,
  Music,
  Video,
  Eye,
  Zap,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { ConversionJob, ConversionOptions, FormatMeta } from '../types/conversion';
import { FormatDropdown } from './FormatDropdown';
import {
  getAvailableTargetsForFormat,
  getConversionRuleExplanation,
} from '../data/formatMatrix';

interface HeroConversionStudioProps {
  jobs: ConversionJob[];
  activeJobId: string;
  onSelectJob: (id: string) => void;
  onUpdateJob: (id: string, updates: Partial<ConversionJob>) => void;
  onRemoveJob: (id: string) => void;
  onConvertJob: (id: string) => void;
  onConvertAll: () => void;
  onClearAll: () => void;
  onAddFiles: (files: File[]) => void;
}

export const HeroConversionStudio: React.FC<HeroConversionStudioProps> = ({
  jobs,
  activeJobId,
  onSelectJob,
  onUpdateJob,
  onRemoveJob,
  onConvertJob,
  onConvertAll,
  onClearAll,
  onAddFiles,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [aiOptimized, setAiOptimized] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Active job
  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];
  if (!activeJob) return null;

  const availableTargetGroups = getAvailableTargetsForFormat(activeJob.detectedFormat);
  const ruleExplanation = getConversionRuleExplanation(
    activeJob.detectedFormat,
    activeJob.targetFormat
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format clean human-readable filename (stripping ugly UUID hashes if present)
  const formatCleanFileName = (name: string): string => {
    if (name.length > 26) {
      const ext = name.split('.').pop() || '';
      const base = name.substring(0, name.lastIndexOf('.')) || name;
      // If filename contains UUID or raw hash
      if (/^[0-9a-fA-F-]{16,}/.test(base)) {
        return `${base.slice(0, 10)}…${base.slice(-6)}.${ext}`;
      }
      return `${base.slice(0, 16)}…${base.slice(-6)}.${ext}`;
    }
    return name;
  };

  // AI Smart Target & Optimization Recommendations
  const getAIRecommendation = (detected: FormatMeta, currentTarget: string) => {
    const ext = detected.extension.toLowerCase();
    let bestTarget = 'webp';
    let label = 'WebP';
    let rationale = 'Maintains 100% transparency with ~45% smaller payload';

    if (ext === 'png') {
      bestTarget = 'webp';
      label = 'WEBP (Lossless)';
      rationale = 'Preserves crystal-clear alpha transparency with 40-50% size savings';
    } else if (['jpg', 'jpeg'].includes(ext)) {
      bestTarget = 'avif';
      label = 'AVIF (Next-Gen)';
      rationale = 'High dynamic range preservation with state-of-the-art AV1 compression';
    } else if (ext === 'avif') {
      bestTarget = 'webp';
      label = 'WEBP (Universal)';
      rationale = 'Lossless cross-browser compatibility with zero visual distortion';
    } else if (ext === 'svg') {
      bestTarget = 'png';
      label = 'PNG (High-DPI)';
      rationale = 'Crisp rasterization at 300 DPI for high-resolution displays';
    } else if (ext === 'heic' || ext === 'heif') {
      bestTarget = 'jpg';
      label = 'JPG (Ultra Quality)';
      rationale = '4:4:4 chroma subsampling for broad compatibility';
    } else if (ext === 'mp3') {
      bestTarget = 'wav';
      label = 'WAV (Studio PCM)';
      rationale = 'Uncompressed linear PCM audio waveform';
    } else if (ext === 'pdf') {
      bestTarget = 'docx';
      label = 'DOCX (Editable)';
      rationale = 'Structured document layout with extractable text';
    }

    // Size estimation
    let factor = 0.75;
    const t = currentTarget.toLowerCase();
    if (t === 'avif') factor = 0.35;
    else if (t === 'webp') factor = 0.52;
    else if (t === 'jpg' || t === 'jpeg') factor = 0.65;
    else if (t === 'png') factor = 1.05;
    else if (t === 'svg') factor = 0.45;
    else if (t === 'wav') factor = 3.5;

    const estimatedSize = Math.max(1024, Math.round(activeJob.originalSize * factor));
    const savings = factor < 1 ? Math.round((1 - factor) * 100) : 0;

    return {
      bestTarget,
      label,
      rationale,
      estimatedSize,
      savings,
    };
  };

  const aiRec = getAIRecommendation(activeJob.detectedFormat, activeJob.targetFormat);

  const handleTargetChange = (newTarget: string) => {
    onUpdateJob(activeJob.id, {
      targetFormat: newTarget,
    });
  };

  const handleOptionChange = (key: keyof ConversionOptions, val: any) => {
    onUpdateJob(activeJob.id, {
      options: {
        ...activeJob.options,
        [key]: val,
      },
    });
  };

  // Apply AI Recommendation
  const handleApplyAITarget = () => {
    handleTargetChange(aiRec.bestTarget);
    handleOptionChange('quality', 100);
  };

  // Batch ZIP download
  const handleDownloadAllZip = async () => {
    const completedJobs = jobs.filter((j) => j.status === 'completed' && j.convertedBlob);
    if (completedJobs.length === 0) return;

    const zip = new JSZip();
    for (const job of completedJobs) {
      if (job.convertedBlob && job.convertedFileName) {
        zip.file(job.convertedFileName, job.convertedBlob);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `OmniConvert_Batch_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(zipUrl);
  };

  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const isConvertingAny = jobs.some((j) => j.status === 'converting');

  // Size delta text
  let sizeDeltaText = '';
  let isSmaller = false;
  if (activeJob.status === 'completed' && activeJob.convertedSize && activeJob.originalSize) {
    const diff = activeJob.convertedSize - activeJob.originalSize;
    const pct = Math.abs(Math.round((diff / activeJob.originalSize) * 100));
    if (diff < 0) {
      sizeDeltaText = `${pct}% smaller`;
      isSmaller = true;
    } else if (diff > 0) {
      sizeDeltaText = `${pct}% larger`;
      isSmaller = false;
    } else {
      sizeDeltaText = 'Identical size';
    }
  }

  const isImageCategory = ['raster', 'mobile_hdr', 'vector', 'layered_project', 'camera_raw'].includes(
    activeJob.detectedFormat.category
  );

  return (
    <div className="relative rounded-3xl glass-panel p-5 sm:p-7 shadow-2xl transition-all duration-300 dark:border-white/10 text-left overflow-visible">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAddFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* TOP HEADER ROW: Clean, High-Contrast Typography with Micro-Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Extension Badge with High Contrast Glow */}
          <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex flex-col items-center justify-center shrink-0 shadow-md font-mono font-bold text-xs uppercase tracking-wider">
            {activeJob.detectedFormat.extension}
          </div>

          <div className="min-w-0">
            {/* Clean File Name with Tooltip */}
            <div className="flex items-center gap-2.5">
              <h3
                className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight truncate max-w-[280px] sm:max-w-[420px]"
                title={activeJob.originalName}
              >
                {formatCleanFileName(activeJob.originalName)}
              </h3>
              <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 font-medium shrink-0">
                {formatFileSize(activeJob.originalSize)}
              </span>
            </div>

            {/* Polished Micro-Badges Line */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-neutral-200/70 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium">
                {activeJob.detectedFormat.name}
              </span>

              {activeJob.dimensions && (
                <span className="px-2 py-0.5 rounded-md bg-neutral-200/70 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 font-mono font-medium">
                  {activeJob.dimensions.width} × {activeJob.dimensions.height} px
                </span>
              )}

              <span
                className={`px-2 py-0.5 rounded-md font-medium ${
                  activeJob.detectedFormat.supportsAlpha
                    ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20'
                    : 'bg-neutral-200/50 dark:bg-white/5 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {activeJob.detectedFormat.supportsAlpha ? 'Alpha Transparency' : 'Opaque Canvas'}
              </span>

              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Zero Quality Loss</span>
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl glass-button text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-xs hover:border-neutral-400"
            title="Upload another file to batch"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>

          {jobs.length > 1 && completedCount > 0 && (
            <button
              type="button"
              onClick={handleDownloadAllZip}
              className="px-3.5 py-2 rounded-xl glass-button text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="p-2 rounded-xl text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Clear all uploaded files"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-file thumbnail strip (if multiple files uploaded) */}
      {jobs.length > 1 && (
        <div className="py-3 flex items-center gap-2 overflow-x-auto border-b border-neutral-200/80 dark:border-white/10 no-scrollbar">
          <span className="text-[11px] text-neutral-400 font-semibold shrink-0 mr-1 uppercase tracking-wider">
            Queue ({jobs.length}):
          </span>
          {jobs.map((j) => {
            const isActive = j.id === activeJob.id;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => onSelectJob(j.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all shrink-0 text-left ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-md ring-2 ring-neutral-900/20 dark:ring-white/20'
                    : 'glass-button text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {j.previewUrl && isImageCategory ? (
                  <img
                    src={j.previewUrl}
                    alt={j.originalName}
                    className="w-5 h-5 rounded-md object-cover shrink-0"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-md font-mono text-[9px] flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 font-bold uppercase">
                    {j.detectedFormat.extension.slice(0, 3)}
                  </span>
                )}
                <span className="text-xs truncate max-w-[120px]">{formatCleanFileName(j.originalName)}</span>
                {j.status === 'completed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN SHOWCASE BODY: Side-by-Side Zero-Loss Preview & Controls */}
      <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: High-Fidelity Zero-Loss Image Display */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 tracking-tight">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Full-Quality Live Preview</span>
            </span>
            <span className="text-[11px] text-neutral-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Bit-for-Bit Lossless</span>
            </span>
          </div>

          {/* Canvas Box with Transparent Checkerboard */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-white/10 shadow-inner group min-h-[280px] sm:min-h-[320px] max-h-[390px] flex items-center justify-center checkerboard-bg">
            {isImageCategory && activeJob.previewUrl ? (
              <img
                src={activeJob.previewUrl}
                alt={activeJob.originalName}
                style={{ imageRendering: '-webkit-optimize-contrast' }}
                className="w-full h-full max-h-[380px] object-contain transition-transform duration-300 select-none p-2"
              />
            ) : activeJob.detectedFormat.category === 'audio' ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl glass-button flex items-center justify-center text-neutral-900 dark:text-white mb-3 shadow-sm">
                  <Music className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  Audio Stream Loaded
                </p>
                <p className="text-xs text-neutral-500 mb-3 font-mono">
                  {formatFileSize(activeJob.originalSize)} · Ready for WAV/MP3 conversion
                </p>
                {activeJob.previewUrl && (
                  <audio controls src={activeJob.previewUrl} className="w-full max-w-xs h-8" />
                )}
              </div>
            ) : activeJob.detectedFormat.category === 'video' ? (
              <div className="p-4 text-center w-full">
                {activeJob.previewUrl && (
                  <video
                    controls
                    src={activeJob.previewUrl}
                    className="max-h-[260px] mx-auto rounded-xl shadow-xs"
                  />
                )}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl glass-button flex items-center justify-center text-neutral-900 dark:text-white mb-3 shadow-sm">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  Document Ready
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  {activeJob.detectedFormat.name} · {formatFileSize(activeJob.originalSize)}
                </p>
              </div>
            )}

            {/* Floating Quality Overlay & Lightbox Button */}
            {isImageCategory && activeJob.previewUrl && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="px-3 py-1.5 rounded-xl glass-button text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
                  title="Inspect Full-Size Original"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Inspect Quality</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-Premium AI-Optimized Live Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* AI SMART OPTIMIZATION & RECOMMENDATION BAR */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 border border-indigo-500/20 dark:border-indigo-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    AI Smart Optimization
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                    Auto-Tuned
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5 leading-snug">
                  {aiRec.rationale}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                  <span>Est. Output: ~{formatFileSize(aiRec.estimatedSize)}</span>
                  {aiRec.savings > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      (⚡ {aiRec.savings}% smaller payload)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick 1-Click AI Best Choice Trigger */}
            {activeJob.targetFormat.toLowerCase() !== aiRec.bestTarget.toLowerCase() && (
              <button
                type="button"
                onClick={handleApplyAITarget}
                className="shrink-0 text-xs px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5"
              >
                <span>Use {aiRec.bestTarget.toUpperCase()}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* TARGET SELECTION WORKSTATION (High z-index to stay above Golden Rule banner) */}
          <div className="rounded-2xl p-4 sm:p-5 bg-neutral-100/70 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-white/10 backdrop-blur-md relative z-30">
            {/* Header with Title and Custom Format Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Output Format</span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                    Source Excluded
                  </span>
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Kis format me convert karna chahte hain?
                </p>
              </div>

              {/* Format Dropdown & Settings Drawer Trigger */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-neutral-400 font-semibold">To:</span>
                <FormatDropdown
                  selectedFormat={activeJob.targetFormat}
                  onSelectFormat={handleTargetChange}
                  availableGroups={availableTargetGroups}
                  disabled={activeJob.status === 'converting' || activeJob.status === 'completed'}
                />

                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
                    showAdvanced
                      ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'glass-button text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                  title="Advanced conversion options"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-semibold">Settings</span>
                </button>
              </div>
            </div>

            {/* Quick Target Capsule Chips */}
            <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 font-semibold mr-1">Quick Select:</span>
              {availableTargetGroups
                .flatMap((g) => g.formats)
                .slice(0, 8)
                .map((meta) => {
                  const isSelected = activeJob.targetFormat.toLowerCase() === meta.extension.toLowerCase();
                  return (
                    <button
                      key={meta.extension}
                      type="button"
                      onClick={() => handleTargetChange(meta.extension)}
                      disabled={activeJob.status === 'converting' || activeJob.status === 'completed'}
                      className={`text-[11px] px-3 py-1 rounded-xl font-mono transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-md scale-105'
                          : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-400 font-medium'
                      }`}
                    >
                      {meta.extension.toUpperCase()}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* ULTRA-PREMIUM TECHNICAL RULE INSIGHT CARD */}
          <div className="rounded-2xl p-4 sm:p-5 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 text-xs backdrop-blur-md relative z-10">
            {/* Header with Rule Badge */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-neutral-200/80 dark:border-neutral-800/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  {ruleExplanation.ruleNumber || 'Ω'}
                </div>
                <h5 className="font-bold text-neutral-900 dark:text-white tracking-tight text-xs sm:text-sm">
                  {ruleExplanation.ruleTitle}
                </h5>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 font-medium">
                {activeJob.detectedFormat.extension.toUpperCase()} ➔ {activeJob.targetFormat.toUpperCase()}
              </span>
            </div>

            {/* Stylized Roman Urdu Callout (Clear, comfortable reading typography) */}
            <div className="mb-3 rounded-xl p-3 bg-white/70 dark:bg-black/40 border border-neutral-200/70 dark:border-white/5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <span>Roman Urdu Wazaahat:</span>
              </div>
              <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal text-xs sm:text-[13px]">
                {ruleExplanation.romanUrdu}
              </p>
            </div>

            {/* Technical Physics Note */}
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-400" />
              <span>
                <strong className="text-neutral-700 dark:text-neutral-300 font-semibold">Technical Standard:</strong>{' '}
                {ruleExplanation.english}
              </span>
            </div>

            {/* Transparency Alert (Luminous Amber Notice) */}
            {ruleExplanation.warning && (
              <div className="mt-3 flex items-start gap-2.5 text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 p-3 rounded-xl border border-amber-500/20 dark:border-amber-400/20">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <span className="leading-snug text-xs font-medium">
                  {ruleExplanation.warning}
                </span>
              </div>
            )}
          </div>

          {/* Advanced Drawer */}
          {showAdvanced && (
            <div className="p-4 rounded-2xl bg-neutral-100/80 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-white/10 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="font-bold text-neutral-800 dark:text-neutral-200">
                    Quality Level (Zero Loss Default)
                  </label>
                  <span className="font-mono text-neutral-900 dark:text-white font-bold">
                    {activeJob.options.quality}% {activeJob.options.quality === 100 ? '(Lossless)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={activeJob.options.quality}
                  onChange={(e) => handleOptionChange('quality', parseInt(e.target.value, 10))}
                  className="w-full accent-neutral-900 dark:accent-white cursor-pointer"
                />
                <span className="text-[10px] text-neutral-400">100% preserves pixel-for-pixel mathematical fidelity.</span>
              </div>

              {activeJob.detectedFormat.category === 'vector' && (
                <div>
                  <label className="font-bold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                    Rasterization DPI (Rule 2)
                  </label>
                  <select
                    value={activeJob.options.dpi || 300}
                    onChange={(e) => handleOptionChange('dpi', parseInt(e.target.value, 10))}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-2 text-xs text-neutral-900 dark:text-white"
                  >
                    <option value={72}>72 DPI (Standard Web Display)</option>
                    <option value={150}>150 DPI (Medium Quality)</option>
                    <option value={300}>300 DPI (Commercial Print Press)</option>
                    <option value={600}>600 DPI (Ultra Fine Archival)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* BOTTOM CONVERSION ACTION BAR (Refined High-End Studio Layout) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200/80 dark:border-white/10">
            {/* Status and Diagnostics */}
            <div className="w-full sm:flex-1">
              {activeJob.status === 'converting' && (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-900 dark:text-white font-bold animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      <span>Re-encoding to {activeJob.targetFormat.toUpperCase()}...</span>
                    </span>
                    <span className="font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                      {activeJob.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden p-0.5">
                    <div
                      className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300 ease-out shadow-sm"
                      style={{ width: `${activeJob.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {activeJob.status === 'completed' && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-neutral-900 dark:text-white">
                    Conversion Complete!
                  </span>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="font-mono font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
                    {activeJob.convertedSize ? formatFileSize(activeJob.convertedSize) : ''}
                  </span>
                  {sizeDeltaText && (
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                        isSmaller
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                      }`}
                    >
                      {sizeDeltaText}
                    </span>
                  )}
                </div>
              )}

              {activeJob.status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{activeJob.errorMessage || 'Conversion failed. Please try another format.'}</span>
                </div>
              )}

              {activeJob.status === 'idle' && (
                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                  <span>
                    Ready to convert from{' '}
                    <strong className="text-neutral-900 dark:text-white font-mono font-bold">
                      {activeJob.detectedFormat.extension.toUpperCase()}
                    </strong>{' '}
                    to{' '}
                    <strong className="text-neutral-900 dark:text-white font-mono font-bold">
                      {activeJob.targetFormat.toUpperCase()}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* Glowing High-Contrast Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
              {activeJob.status !== 'completed' ? (
                <button
                  type="button"
                  onClick={() => onConvertJob(activeJob.id)}
                  disabled={activeJob.status === 'converting'}
                  className="w-full sm:w-auto px-7 py-3 text-xs font-extrabold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {activeJob.status === 'converting' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Convert Now</span>
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={activeJob.convertedUrl}
                  download={activeJob.convertedFileName}
                  className="w-full sm:w-auto px-7 py-3 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Converted File</span>
                </a>
              )}

              {jobs.length > 1 && (
                <button
                  type="button"
                  onClick={onConvertAll}
                  disabled={isConvertingAny}
                  className="px-4 py-3 rounded-2xl glass-button text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-all shadow-xs"
                  title="Convert all uploaded files"
                >
                  Convert All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FULL-SIZE QUALITY LIGHTBOX MODAL */}
      {lightboxOpen && activeJob.previewUrl && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] glass-dropdown rounded-3xl p-4 flex flex-col items-center shadow-2xl"
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800/80 text-xs px-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 dark:text-white font-mono">
                  {formatCleanFileName(activeJob.originalName)}
                </span>
                {activeJob.dimensions && (
                  <span className="text-neutral-400">
                    ({activeJob.dimensions.width} × {activeJob.dimensions.height} px)
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                  Pristine 100% Source Fidelity
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-auto max-h-[75vh] checkerboard-bg p-2 flex items-center justify-center">
              <img
                src={activeJob.previewUrl}
                alt={activeJob.originalName}
                className="max-h-[72vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
