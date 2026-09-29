import React from 'react';
import JSZip from 'jszip';
import { Download, RefreshCw, Trash2, Archive, CheckCircle2 } from 'lucide-react';
import { ConversionJob } from '../types/conversion';
import { JobItemCard } from './JobItemCard';

interface ConversionQueueProps {
  jobs: ConversionJob[];
  onUpdateJob: (id: string, updates: Partial<ConversionJob>) => void;
  onRemoveJob: (id: string) => void;
  onConvertJob: (id: string) => void;
  onConvertAll: () => void;
  onClearAll: () => void;
}

export const ConversionQueue: React.FC<ConversionQueueProps> = ({
  jobs,
  onUpdateJob,
  onRemoveJob,
  onConvertJob,
  onConvertAll,
  onClearAll,
}) => {
  if (jobs.length === 0) return null;

  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const isConvertingAny = jobs.some((j) => j.status === 'converting');
  const allCompleted = completedCount === jobs.length && jobs.length > 0;

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

  return (
    <section className="max-w-4xl mx-auto px-4 py-6">
      {/* Batch Header & Global Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
            <span>Conversion Queue</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
              {completedCount} of {jobs.length} completed
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure target formats, adjust settings, and process individually or as a batch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Download All as ZIP (Available when at least 1 completed) */}
          {completedCount > 0 && (
            <button
              onClick={handleDownloadAllZip}
              className="px-3.5 py-2 rounded-xl glass-button text-xs font-semibold text-neutral-900 dark:text-white hover:border-neutral-400 dark:hover:border-white/30 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Download All (.ZIP)</span>
            </button>
          )}

          {/* Convert All Button */}
          {!allCompleted && (
            <button
              onClick={onConvertAll}
              disabled={isConvertingAny}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-xs font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConvertingAny ? 'animate-spin' : ''}`} />
              <span>{isConvertingAny ? 'Converting Batch...' : 'Convert All'}</span>
            </button>
          )}

          {/* Clear Queue (Auto-cleans memory) */}
          <button
            onClick={onClearAll}
            disabled={isConvertingAny}
            className="p-2 rounded-xl glass-button text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs active:scale-95"
            title="Clear all queue items (frees temporary memory)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List of Job Item Cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobItemCard
            key={job.id}
            job={job}
            onUpdateJob={onUpdateJob}
            onRemoveJob={onRemoveJob}
            onConvertJob={onConvertJob}
          />
        ))}
      </div>
    </section>
  );
};
