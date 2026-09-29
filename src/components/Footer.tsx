import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Clean Metadata (Zero-Pill) */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-bold text-neutral-900 dark:text-white">OmniConvert Studio</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>Digital Media Engineering Matrix</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>5 Golden Rules Compliant</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span>Auto-Clean Temporary Storage</span>
        </div>

        {/* Technical standards */}
        <div className="text-xs text-neutral-400 font-mono">
          Sharp (libvips) · Potrace · pdf-lib · Web Audio API
        </div>
      </div>
    </footer>
  );
};
