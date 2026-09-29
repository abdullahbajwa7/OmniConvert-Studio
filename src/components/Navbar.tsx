import React from 'react';
import { Moon, Sun, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'converter' | 'matrix';
  setActiveTab: (tab: 'converter' | 'matrix') => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onQuickSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  onQuickSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-white/10 bg-white/75 dark:bg-neutral-950/75 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark in display face */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('converter')}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
              Ω
            </div>
            <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
              OmniConvert
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => {
              setActiveTab('converter');
              onQuickSelectCategory('image');
            }}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'converter'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            Image Converters
          </button>

          <button
            onClick={() => {
              setActiveTab('converter');
              onQuickSelectCategory('media');
            }}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Audio & Video
          </button>

          <button
            onClick={() => {
              setActiveTab('converter');
              onQuickSelectCategory('document');
            }}
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Document Converters
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`transition-colors hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'text-neutral-900 dark:text-white font-bold'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Master Matrix (5 Rules)</span>
          </button>
        </nav>

        {/* Zone 3: Primary action & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="p-2 rounded-xl glass-button text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-95 shadow-xs"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('converter');
              document.getElementById('file-upload-input')?.click();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Select Files</span>
          </button>
        </div>
      </div>
    </header>
  );
};
