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
  Layers,
} from 'lucide-react';
import { ConversionJob, ConversionOptions } from '../types/conversion';
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
    <div className="relative rounded-3xl glass-panel p-5 sm:p-7 shadow-2xl transition-all duration-300 dark:border-white/10 text-left">
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

      {/* Top Header Row of the Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex flex-col items-center justify-center shrink-0 shadow-xs font-mono font-bold text-xs uppercase">
            {activeJob.detectedFormat.extension}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {activeJob.originalName}
              </h3>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                {formatFileSize(activeJob.originalSize)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              <span>{activeJob.detectedFormat.name}</span>
              <span aria-hidden="true">·</span>
              {activeJob.dimensions ? (
                <>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300 font-medium">
                    {activeJob.dimensions.width} × {activeJob.dimensions.height} px
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              ) : null}
              <span>{activeJob.detectedFormat.supportsAlpha ? 'Alpha Transparency' : 'Opaque (No Alpha)'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Original Quality Maintained
              </span>
            </div>
          </div>
        </div>

        {/* Global / Top Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
            title="Upload another file to batch"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>

          {jobs.length > 1 && completedCount > 0 && (
            <button
              type="button"
              onClick={handleDownloadAllZip}
              className="px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Clear all uploaded files"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multi-file thumbnail strip (if multiple files uploaded) */}
      {jobs.length > 1 && (
        <div className="py-3 flex items-center gap-2 overflow-x-auto border-b border-neutral-200/80 dark:border-white/10 no-scrollbar">
          <span className="text-[11px] text-neutral-400 font-medium shrink-0 mr-1">
            Uploaded Files ({jobs.length}):
          </span>
          {jobs.map((j) => {
            const isActive = j.id === activeJob.id;
            return (
              <button
                key={j.id}
                type="button"
                onClick={() => onSelectJob(j.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all shrink-0 text-left ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs scale-102 ring-2 ring-neutral-900/20 dark:ring-white/20'
                    : 'glass-button text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                {j.previewUrl && isImageCategory ? (
                  <img
                    src={j.previewUrl}
                    alt={j.originalName}
                    className="w-5 h-5 rounded object-cover shrink-0"
                  />
                ) : (
                  <span className="w-5 h-5 rounded font-mono text-[9px] flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 font-bold uppercase">
                    {j.detectedFormat.extension.slice(0, 3)}
                  </span>
                )}
                <span className="text-xs truncate max-w-[110px]">{j.originalName}</span>
                {j.status === 'completed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Body: Image Preview on Left, Live Conversion on Right */}
      <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: High-Fidelity Zero-Loss Image Display */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Full-Quality Live Preview</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              Zero Downsampling
            </span>
          </div>

          {/* Canvas Box with Transparent Checkerboard */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-white/10 shadow-inner group min-h-[260px] sm:min-h-[310px] max-h-[380px] flex items-center justify-center checkerboard-bg">
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
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg glass-button text-[11px] font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                  title="Inspect Full-Size Original"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect Quality</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Conversion Controls (No Scrolling Needed!) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {/* Exact prompt string & target select (High z-index to stay above Golden Rule banner) */}
          <div className="rounded-2xl p-4 bg-neutral-100/70 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-white/10 backdrop-blur-md relative z-30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  Kis format me convert karna chahte hain?
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Select target format (source format excluded by rule).
                </p>
              </div>

              {/* Target Format Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-neutral-500 font-medium">To:</span>
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
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            </div>

            {/* Quick Target Chips */}
            <div className="mt-3 pt-2.5 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 font-medium">Quick Targets:</span>
              {availableTargetGroups
                .flatMap((g) => g.formats)
                .slice(0, 8)
                .map((meta) => (
                  <button
                    key={meta.extension}
                    type="button"
                    onClick={() => handleTargetChange(meta.extension)}
                    disabled={activeJob.status === 'converting' || activeJob.status === 'completed'}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                      activeJob.targetFormat.toLowerCase() === meta.extension.toLowerCase()
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs scale-105'
                        : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-400'
                    }`}
                  >
                    {meta.extension.toUpperCase()}
                  </button>
                ))}
            </div>
          </div>

          {/* Technical Rule Callout Banner (Roman Urdu & English) - Lower z-index so dropdown floats over it */}
          <div className="rounded-xl p-3.5 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 text-xs backdrop-blur-md relative z-10">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-neutral-200/70 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-neutral-800 dark:text-neutral-200">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {ruleExplanation.ruleTitle}
                  </span>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-1">
                  <span className="font-semibold text-neutral-900 dark:text-white">Roman Urdu:</span>{' '}
                  {ruleExplanation.romanUrdu}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Technical Note:</span>{' '}
                  {ruleExplanation.english}
                </p>

                {ruleExplanation.warning && (
                  <div className="mt-2 flex items-center gap-2 text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 p-2 rounded-lg border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{ruleExplanation.warning}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Drawer */}
          {showAdvanced && (
            <div className="p-3.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-white/10 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200">
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
                <span className="text-[10px] text-neutral-400">100% preserves pixel-for-pixel fidelity.</span>
              </div>

              {activeJob.detectedFormat.category === 'vector' && (
                <div>
                  <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
                    Rasterization DPI (Rule 2)
                  </label>
                  <select
                    value={activeJob.options.dpi || 300}
                    onChange={(e) => handleOptionChange('dpi', parseInt(e.target.value, 10))}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg p-1.5 text-xs text-neutral-900 dark:text-white"
                  >
                    <option value={72}>72 DPI (Standard Web)</option>
                    <option value={150}>150 DPI (Medium Quality)</option>
                    <option value={300}>300 DPI (Commercial Print Press)</option>
                    <option value={600}>600 DPI (Ultra Fine Archival)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Action Row & Progress Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:flex-1">
              {activeJob.status === 'converting' && (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-neutral-900 dark:text-white font-semibold animate-pulse flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Converting to {activeJob.targetFormat.toUpperCase()}...</span>
                    </span>
                    <span className="font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                      {activeJob.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden p-0.5">
                    <div
                      className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300 ease-out shadow-xs"
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
                <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{activeJob.errorMessage || 'Conversion failed. Please try another format.'}</span>
                </div>
              )}

              {activeJob.status === 'idle' && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Ready to convert from <strong className="text-neutral-900 dark:text-white font-mono">{activeJob.detectedFormat.extension.toUpperCase()}</strong> to{' '}
                  <strong className="text-neutral-900 dark:text-white font-mono">{activeJob.targetFormat.toUpperCase()}</strong>
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              {activeJob.status !== 'completed' ? (
                <button
                  type="button"
                  onClick={() => onConvertJob(activeJob.id)}
                  disabled={activeJob.status === 'converting'}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {activeJob.status === 'converting' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Convert Now</span>
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={activeJob.convertedUrl}
                  download={activeJob.convertedFileName}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Converted File</span>
                </a>
              )}

              {jobs.length > 1 && (
                <button
                  type="button"
                  onClick={onConvertAll}
                  disabled={isConvertingAny}
                  className="px-3.5 py-2.5 rounded-xl glass-button text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-all shadow-xs"
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
                  {activeJob.originalName}
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
