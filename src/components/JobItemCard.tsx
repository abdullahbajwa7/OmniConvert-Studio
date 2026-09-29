import React, { useState } from 'react';
import {
  Download,
  AlertTriangle,
  CheckCircle2,
  Settings2,
  Trash2,
  Layers,
  Sparkles,
  RefreshCw,
  FileCode,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { ConversionJob, ConversionOptions, FormatMeta } from '../types/conversion';
import {
  getAvailableTargetsForFormat,
  getConversionRuleExplanation,
  FORMAT_CATALOG,
} from '../data/formatMatrix';
import { FormatDropdown } from './FormatDropdown';

interface JobItemCardProps {
  job: ConversionJob;
  onUpdateJob: (id: string, updates: Partial<ConversionJob>) => void;
  onRemoveJob: (id: string) => void;
  onConvertJob: (id: string) => void;
}

export const JobItemCard: React.FC<JobItemCardProps> = ({
  job,
  onUpdateJob,
  onRemoveJob,
  onConvertJob,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableTargetGroups = getAvailableTargetsForFormat(job.detectedFormat);
  const ruleExplanation = getConversionRuleExplanation(job.detectedFormat, job.targetFormat);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleTargetChange = (newTarget: string) => {
    onUpdateJob(job.id, {
      targetFormat: newTarget,
    });
  };

  const handleOptionChange = (key: keyof ConversionOptions, val: any) => {
    onUpdateJob(job.id, {
      options: {
        ...job.options,
        [key]: val,
      },
    });
  };

  // Calculate size delta if completed
  let sizeDeltaText = '';
  let isSmaller = false;
  if (job.status === 'completed' && job.convertedSize && job.originalSize) {
    const diff = job.convertedSize - job.originalSize;
    const pct = Math.abs(Math.round((diff / job.originalSize) * 100));
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

  return (
    <div className="glass-panel rounded-2xl relative transition-all duration-300 hover:shadow-xl dark:border-white/10">
      {/* Header Info Bar */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Top File Meta Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Format Badge Avatar */}
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex flex-col items-center justify-center shrink-0 shadow-xs font-mono font-bold text-xs uppercase">
              {job.detectedFormat.extension}
            </div>

            {/* Title & Technical Classification */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {job.originalName}
                </h3>
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  {formatFileSize(job.originalSize)}
                </span>
              </div>

              {/* Exact user-requested response string: "Detected Format: [Uploaded Format]" */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                <span>
                  <strong className="text-neutral-700 dark:text-neutral-300">Detected Format:</strong>{' '}
                  {job.detectedFormat.name} ({job.detectedFormat.categoryLabel})
                </span>
                <span aria-hidden="true">·</span>
                <span>Bit Depth: {job.detectedFormat.maxBitDepth || 24}-bit</span>
                <span aria-hidden="true">·</span>
                <span>{job.detectedFormat.supportsAlpha ? 'Alpha Transparency' : 'No Alpha'}</span>
              </div>
            </div>
          </div>

          {/* Remove Action */}
          <button
            onClick={() => onRemoveJob(job.id)}
            disabled={job.status === 'converting'}
            className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Operational Query Prompt & Target Selector */}
        <div className="rounded-xl p-3.5 bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-white/10 backdrop-blur-md relative z-30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {/* Exact user-prompt string */}
              <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-0.5">
                Kis format me convert karna chahte hain?
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Please select target extension (current format & sensor RAW are strictly excluded).
              </p>
            </div>

            {/* Custom Enhanced Glassy Format Dropdown adhering strictly to EXCLUSION RULE */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-neutral-500 font-medium">To:</span>
              <FormatDropdown
                selectedFormat={job.targetFormat}
                onSelectFormat={handleTargetChange}
                availableGroups={availableTargetGroups}
                disabled={job.status === 'converting' || job.status === 'completed'}
              />

              {/* Advanced Settings Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
                  showAdvanced
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'glass-button text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Advanced conversion parameters"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Quick Target Chips (Excluding current) */}
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
                  disabled={job.status === 'converting' || job.status === 'completed'}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                    job.targetFormat.toLowerCase() === meta.extension.toLowerCase()
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs scale-105'
                      : 'bg-white/80 dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-400 dark:hover:border-neutral-500'
                  }`}
                >
                  {meta.extension.toUpperCase()}
                </button>
              ))}
          </div>
        </div>

        {/* Technical Rule Callout Banner (Roman Urdu & English) */}
        <div className="rounded-xl p-3.5 bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 text-xs backdrop-blur-md relative z-10">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-neutral-200/70 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-neutral-800 dark:text-neutral-200">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-neutral-900 dark:text-white tracking-tight">
                  {ruleExplanation.ruleTitle}
                </span>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-1.5">
                <span className="font-semibold text-neutral-900 dark:text-white">Roman Urdu:</span>{' '}
                {ruleExplanation.romanUrdu}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Technical Note:</span>{' '}
                {ruleExplanation.english}
              </p>

              {/* Warning if transparency loss or flattening */}
              {ruleExplanation.warning && (
                <div className="mt-2.5 flex items-center gap-2 text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 p-2.5 rounded-xl border border-amber-500/20 dark:border-amber-400/20">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{ruleExplanation.warning}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Settings Drawer */}
        {showAdvanced && (
          <div className="p-4 rounded-xl bg-neutral-100/80 dark:bg-neutral-950/70 border border-neutral-200/80 dark:border-white/10 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 backdrop-blur-md">
            {/* Quality Slider for lossy formats */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Compression Quality
                </label>
                <span className="font-mono text-neutral-900 dark:text-white font-bold">{job.options.quality}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={job.options.quality}
                onChange={(e) => handleOptionChange('quality', parseInt(e.target.value, 10))}
                className="w-full accent-neutral-900 dark:accent-white cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">Higher = crisper image, larger file size.</span>
            </div>

            {/* DPI / Resolution setting for Vector to Raster */}
            {job.detectedFormat.category === 'vector' && (
              <div>
                <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                  Rasterization Target DPI (Rule 2)
                </label>
                <select
                  value={job.options.dpi || 300}
                  onChange={(e) => handleOptionChange('dpi', parseInt(e.target.value, 10))}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value={72}>72 DPI (Standard Web Display)</option>
                  <option value={150}>150 DPI (Medium Quality / Presentations)</option>
                  <option value={300}>300 DPI (Commercial Print Press Standard)</option>
                  <option value={600}>600 DPI (Ultra Fine Art / Archival)</option>
                </select>
              </div>
            )}

            {/* Resolution Preset */}
            <div>
              <label className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1.5">
                Resolution Scaling
              </label>
              <select
                value={job.options.resolutionPreset || 'original'}
                onChange={(e) => handleOptionChange('resolutionPreset', e.target.value)}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
              >
                <option value="original">Original Dimensions (100%)</option>
                <option value="1080p">Scale to 1080p Full HD (1920px)</option>
                <option value="2k">Scale to 2K Quad HD (2560px)</option>
                <option value="4k">Scale to 4K Ultra HD (3840px)</option>
              </select>
            </div>
          </div>
        )}

        {/* Progress Bar & Actions Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Indicator & Progress Bar */}
          <div className="w-full sm:flex-1">
            {job.status === 'converting' && (
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-neutral-900 dark:text-white font-semibold animate-pulse flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Converting to {job.targetFormat.toUpperCase()}...</span>
                  </span>
                  <span className="font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                    {job.progress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300 ease-out shadow-xs"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            )}

            {job.status === 'completed' && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-neutral-900 dark:text-white">
                  Conversion Complete!
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="font-mono font-medium tabular-nums text-neutral-600 dark:text-neutral-400">
                  {job.convertedSize ? formatFileSize(job.convertedSize) : ''}
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

            {job.status === 'error' && (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{job.errorMessage || 'Conversion failed. Please try another format.'}</span>
              </div>
            )}

            {job.status === 'idle' && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Ready to convert from <strong className="text-neutral-900 dark:text-white font-mono">{job.detectedFormat.extension.toUpperCase()}</strong> to{' '}
                <strong className="text-neutral-900 dark:text-white font-mono">{job.targetFormat.toUpperCase()}</strong>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            {job.status !== 'completed' ? (
              <button
                type="button"
                onClick={() => onConvertJob(job.id)}
                disabled={job.status === 'converting'}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {job.status === 'converting' ? (
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
                href={job.convertedUrl}
                download={job.convertedFileName}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Converted File</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
