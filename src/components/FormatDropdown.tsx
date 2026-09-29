import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Check,
  Sparkles,
  Layers,
  FileCode,
  Sliders,
  X,
} from 'lucide-react';
import { FormatMeta } from '../types/conversion';

interface TargetGroup {
  category: string;
  categoryLabel: string;
  formats: FormatMeta[];
}

interface FormatDropdownProps {
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
  availableGroups: TargetGroup[];
  disabled?: boolean;
}

export const FormatDropdown: React.FC<FormatDropdownProps> = ({
  selectedFormat,
  onSelectFormat,
  availableGroups,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected format meta
  const allFormats = availableGroups.flatMap((g) => g.formats);
  const currentMeta = allFormats.find(
    (f) => f.extension.toLowerCase() === selectedFormat.toLowerCase()
  );

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setActiveCategoryFilter('all');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter formats based on search query and category
  const filteredGroups = availableGroups
    .map((group) => {
      if (activeCategoryFilter !== 'all' && group.category !== activeCategoryFilter) {
        return null;
      }

      const matchingFormats = group.formats.filter((f) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          f.extension.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.categoryLabel.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
        );
      });

      if (matchingFormats.length === 0) return null;

      return {
        ...group,
        formats: matchingFormats,
      };
    })
    .filter(Boolean) as TargetGroup[];

  const totalResultsCount = filteredGroups.reduce((acc, g) => acc + g.formats.length, 0);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${isOpen ? 'z-[100]' : 'z-20'}`}>
      {/* Trigger Button - Glassy, Premium Aesthetic */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`group relative flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 outline-none ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800'
            : isOpen
            ? 'glass-button ring-2 ring-neutral-900/20 dark:ring-white/20 border-neutral-900 dark:border-white shadow-md'
            : 'glass-button hover:border-neutral-400 dark:hover:border-white/30 shadow-xs hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Extension Badge */}
          <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] uppercase bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 tracking-wider shadow-xs">
            {selectedFormat.toUpperCase()}
          </span>

          {/* Full Name & Micro Subtitle */}
          <div className="text-left flex flex-col min-w-0">
            <span className="font-semibold text-neutral-900 dark:text-white truncate max-w-[140px] sm:max-w-[180px]">
              {currentMeta ? currentMeta.name : selectedFormat.toUpperCase()}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
              {currentMeta?.categoryLabel || 'Target Format'}
            </span>
          </div>
        </div>

        {/* Dynamic Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-neutral-900 dark:text-white' : ''
          }`}
        />
      </button>

      {/* Floating Glassy Dropdown Menu - Highest Z-Index Stacking */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] max-w-[92vw] glass-dropdown rounded-2xl p-2.5 z-[9999] shadow-2xl animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* Header & Search Input */}
          <div className="p-1 mb-2 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search target format (e.g. webp, svg, pdf)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-neutral-100/90 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Segment Tabs */}
            <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5 no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'raster', label: 'Raster' },
                { id: 'mobile_hdr', label: 'Mobile' },
                { id: 'vector', label: 'Vector' },
                { id: 'document', label: 'Document' },
                { id: 'audio', label: 'Audio' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeCategoryFilter === tab.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formats Grouped List (Scrollable Area) */}
          <div className="max-h-[310px] overflow-y-auto space-y-3 pr-1">
            {totalResultsCount === 0 ? (
              <div className="py-6 text-center text-xs text-neutral-400">
                No matching target formats found for "{searchQuery}"
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.category} className="space-y-1">
                  {/* Category Header Label */}
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
                    <span>{group.categoryLabel}</span>
                    <span className="font-mono text-[9px]">{group.formats.length} formats</span>
                  </div>

                  {/* Formats Grid / List */}
                  <div className="space-y-0.5">
                    {group.formats.map((meta) => {
                      const isSelected =
                        meta.extension.toLowerCase() === selectedFormat.toLowerCase();

                      return (
                        <button
                          key={meta.extension}
                          type="button"
                          onClick={() => {
                            onSelectFormat(meta.extension);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between group ${
                            isSelected
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                              : 'hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Format Badge */}
                            <span
                              className={`w-11 text-center py-0.5 rounded font-mono font-bold text-[10px] uppercase shrink-0 transition-colors ${
                                isSelected
                                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-neutral-900'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/80 dark:border-neutral-700/80 group-hover:border-neutral-400'
                              }`}
                            >
                              {meta.extension}
                            </span>

                            {/* Format Title & Specs */}
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold truncate">
                                  {meta.name}
                                </span>
                              </div>
                              <div
                                className={`text-[10px] truncate ${
                                  isSelected
                                    ? 'text-white/80 dark:text-neutral-900/80'
                                    : 'text-neutral-400 dark:text-neutral-500'
                                }`}
                              >
                                {meta.supportsAlpha ? 'Alpha' : 'No Alpha'} ·{' '}
                                {meta.isLossy === false
                                  ? 'Lossless'
                                  : meta.isLossy === 'both'
                                  ? 'Lossy/Lossless'
                                  : 'Lossy'}{' '}
                                · {meta.maxBitDepth ? `${meta.maxBitDepth}-bit` : 'Standard'}
                              </div>
                            </div>
                          </div>

                          {/* Selection Checkmark */}
                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note in dropdown */}
          <div className="pt-2 mt-2 border-t border-neutral-200/70 dark:border-neutral-800/70 px-2 flex items-center justify-between text-[10px] text-neutral-400">
            <span>Exclusion Rule: Source format excluded</span>
            <span className="font-mono">OmniEngine</span>
          </div>
        </div>
      )}
    </div>
  );
};
