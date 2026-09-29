import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HeroUploader } from './components/HeroUploader';
import { ConversionQueue } from './components/ConversionQueue';
import { FormatMatrixViewer } from './components/FormatMatrixViewer';
import { RomanUrduGuide } from './components/RomanUrduGuide';
import { QuickConvertersGrid } from './components/QuickConvertersGrid';
import { Footer } from './components/Footer';
import { ConversionJob } from './types/conversion';
import {
  detectFileFormat,
  getAvailableTargetsForFormat,
  FORMAT_CATALOG,
} from './data/formatMatrix';
import { processConversionJob } from './utils/converterEngine';

export default function App() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'converter' | 'matrix' | 'guide'>('converter');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(prefers-color-scheme: dark)').matches ||
        document.documentElement.classList.contains('dark')
      );
    }
    return false;
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [pendingPresetTarget, setPendingPresetTarget] = useState<string | null>(null);

  // Sync dark class on root html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle incoming files from uploader
  const handleFilesSelected = (files: File[]) => {
    const newJobs: ConversionJob[] = files.map((file) => {
      const detected = detectFileFormat(file);
      const availableGroups = getAvailableTargetsForFormat(detected);

      // Select default target based on preset or domain standard (STRICT EXCLUSION RULE)
      let defaultTarget = 'png';

      if (pendingPresetTarget) {
        defaultTarget = pendingPresetTarget;
      } else {
        const ext = detected.extension.toLowerCase();
        if (ext === 'png') defaultTarget = 'jpg';
        else if (['jpg', 'jpeg'].includes(ext)) defaultTarget = 'png';
        else if (ext === 'webp') defaultTarget = 'jpg';
        else if (['heic', 'heif'].includes(ext)) defaultTarget = 'jpg';
        else if (ext === 'svg') defaultTarget = 'png';
        else if (['mp3'].includes(ext)) defaultTarget = 'wav';
        else if (['mp4'].includes(ext)) defaultTarget = 'mp3';
        else if (['pdf'].includes(ext)) defaultTarget = 'docx';
        else if (['docx', 'txt', 'html', 'md'].includes(ext)) defaultTarget = 'pdf';
        else {
          // Pick first available target format from groups
          const firstAvailable = availableGroups[0]?.formats[0]?.extension || 'png';
          defaultTarget = firstAvailable;
        }
      }

      // Generate instant raw object URL for 100% full-resolution preview
      const previewUrl = URL.createObjectURL(file);
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      // Inspect image dimensions if raster/vector
      const isImg = ['raster', 'mobile_hdr', 'vector', 'layered_project'].includes(detected.category);
      if (isImg && typeof window !== 'undefined') {
        const testImg = new Image();
        testImg.onload = () => {
          setJobs((currentJobs) =>
            currentJobs.map((j) =>
              j.id === jobId
                ? {
                    ...j,
                    dimensions: {
                      width: testImg.naturalWidth,
                      height: testImg.naturalHeight,
                    },
                  }
                : j
            )
          );
        };
        testImg.src = previewUrl;
      }

      return {
        id: jobId,
        file,
        originalName: file.name,
        originalSize: file.size,
        detectedFormat: detected,
        targetFormat: defaultTarget,
        status: 'idle',
        progress: 0,
        previewUrl,
        options: {
          quality: 100, // Zero quality loss default
          dpi: 300,
          resolutionPreset: 'original',
        },
      };
    });

    setJobs((prev) => {
      const combined = [...prev, ...newJobs];
      if (!activeJobId && combined.length > 0) {
        setActiveJobId(newJobs[0].id);
      }
      return combined;
    });

    if (newJobs.length > 0) {
      setActiveJobId(newJobs[0].id);
    }

    setPendingPresetTarget(null);
    setActiveTab('converter');
  };

  // Preset triggers
  const handleApplyPreset = (presetId: string) => {
    let target = 'png';
    switch (presetId) {
      case 'jpg-to-png':
        target = 'png';
        break;
      case 'png-to-jpg':
        target = 'jpg';
        break;
      case 'webp-to-jpg':
        target = 'jpg';
        break;
      case 'heic-to-jpg':
        target = 'jpg';
        break;
      case 'mp3-to-wav':
        target = 'wav';
        break;
      case 'mp4-to-mp3':
        target = 'mp3';
        break;
      case 'avi-to-mp4':
        target = 'mp4';
        break;
      case 'pdf-to-word':
        target = 'docx';
        break;
      case 'word-to-pdf':
        target = 'pdf';
        break;
      case 'img-to-pdf':
        target = 'pdf';
        break;
    }
    setPendingPresetTarget(target);
    document.getElementById('file-upload-input')?.click();
  };

  const handleUpdateJob = (id: string, updates: Partial<ConversionJob>) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...updates } : job))
    );
  };

  const handleRemoveJob = (id: string) => {
    setJobs((prev) => {
      const target = prev.find((j) => j.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.convertedUrl) URL.revokeObjectURL(target.convertedUrl);

      const filtered = prev.filter((j) => j.id !== id);
      if (activeJobId === id) {
        setActiveJobId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    jobs.forEach((j) => {
      if (j.previewUrl) URL.revokeObjectURL(j.previewUrl);
      if (j.convertedUrl) URL.revokeObjectURL(j.convertedUrl);
    });
    setJobs([]);
    setActiveJobId(null);
  };

  // Convert a single job
  const handleConvertJob = async (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job || job.status === 'converting') return;

    handleUpdateJob(id, { status: 'converting', progress: 5, errorMessage: undefined });

    try {
      const result = await processConversionJob(job, (prog) => {
        handleUpdateJob(id, { progress: prog });
      });

      handleUpdateJob(id, {
        status: 'completed',
        progress: 100,
        convertedBlob: result.blob,
        convertedSize: result.size,
        convertedFileName: result.fileName,
        convertedUrl: result.url,
        convertedAt: new Date(),
      });

      // Trigger celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err: any) {
      console.error('Conversion execution error:', err);
      handleUpdateJob(id, {
        status: 'error',
        errorMessage: err?.message || 'Conversion failed. Please try a different target format.',
      });
    }
  };

  // Convert all pending jobs
  const handleConvertAll = async () => {
    const pendingJobs = jobs.filter((j) => j.status === 'idle' || j.status === 'error');
    for (const job of pendingJobs) {
      await handleConvertJob(job.id);
    }
  };

  const handleQuickSelectCategory = (cat: string) => {
    setActiveCategoryFilter(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 ambient-glow relative">
      {/* Top Bar adhering strictly to Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onQuickSelectCategory={handleQuickSelectCategory}
      />

      <main className="flex-1">
        {activeTab === 'converter' && (
          <>
            {/* IN-PLACE HERO SHOWCASE & UPLOADER ("itni jaga pe image show honi chaye") */}
            <HeroUploader
              jobs={jobs}
              activeJobId={activeJobId}
              onSelectJob={setActiveJobId}
              onFilesSelected={handleFilesSelected}
              onApplyPreset={handleApplyPreset}
              onUpdateJob={handleUpdateJob}
              onRemoveJob={handleRemoveJob}
              onConvertJob={handleConvertJob}
              onConvertAll={handleConvertAll}
              onClearAll={handleClearAll}
              activeCategoryFilter={activeCategoryFilter}
            />

            {/* If user uploaded multiple files (3+), display secondary batch queue list */}
            {jobs.length > 2 && (
              <ConversionQueue
                jobs={jobs}
                onUpdateJob={handleUpdateJob}
                onRemoveJob={handleRemoveJob}
                onConvertJob={handleConvertJob}
                onConvertAll={handleConvertAll}
                onClearAll={handleClearAll}
              />
            )}

            {/* Dedicated Categorized Quick Converters */}
            <QuickConvertersGrid onSelectTool={handleApplyPreset} />
          </>
        )}

        {activeTab === 'matrix' && <FormatMatrixViewer />}

        {activeTab === 'guide' && <RomanUrduGuide />}
      </main>

      {/* Domain-Native Clean Footer */}
      <Footer />
    </div>
  );
}
