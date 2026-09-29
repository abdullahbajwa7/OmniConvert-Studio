import React from 'react';
import { Image, Music, Video, FileText, ArrowRight } from 'lucide-react';

interface QuickConvertersGridProps {
  onSelectTool: (preset: string) => void;
}

export const QuickConvertersGrid: React.FC<QuickConvertersGridProps> = ({ onSelectTool }) => {
  const sections = [
    {
      title: 'Image Converters',
      icon: <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      description: 'Raster, modern web, and high-efficiency camera conversions with alpha preservation.',
      tools: [
        { label: 'JPG to PNG', id: 'jpg-to-png', note: 'Lossless container with alpha support' },
        { label: 'PNG to JPG', id: 'png-to-jpg', note: 'Flattened background for photo sharing' },
        { label: 'WebP to JPG', id: 'webp-to-jpg', note: 'Universal browser and legacy compatibility' },
        { label: 'HEIC to JPG', id: 'heic-to-jpg', note: 'Apple iPhone camera photo export' },
      ],
    },
    {
      title: 'Audio & Video Converters',
      icon: <Video className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      description: 'Lossless PCM audio extraction, sample rate conversion, and media transcoding.',
      tools: [
        { label: 'MP3 to WAV', id: 'mp3-to-wav', note: 'Studio uncompressed 16-bit linear PCM' },
        { label: 'MP4 to MP3', id: 'mp4-to-mp3', note: 'Extract audio stream from video file' },
        { label: 'AVI to MP4', id: 'avi-to-mp4', note: 'Web & mobile optimized H.264 playback' },
      ],
    },
    {
      title: 'Document Converters',
      icon: <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      description: 'Vector PDF compilation, structured text extraction, and markup generation.',
      tools: [
        { label: 'PDF to Word', id: 'pdf-to-word', note: 'Extract layout text & editable document' },
        { label: 'Word to PDF', id: 'word-to-pdf', note: 'Universal portable vector layout' },
        { label: 'Image to PDF', id: 'img-to-pdf', note: 'Multi-image high-resolution packaging' },
      ],
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-200/80 dark:border-white/10">
      <div className="mb-8">
        <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Dedicated Conversion Utilities
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Select any preset to configure the pipeline and drop your file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec) => (
          <div
            key={sec.title}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-xl dark:border-white/10"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg glass-button flex items-center justify-center shrink-0">
                  {sec.icon}
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {sec.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed">
                {sec.description}
              </p>

              <div className="space-y-2.5">
                {sec.tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTool(t.id)}
                    className="w-full text-left p-3 rounded-xl border border-neutral-200/70 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white transition-all flex items-center justify-between group bg-white/50 dark:bg-neutral-950/40 hover:bg-white dark:hover:bg-neutral-900 active:scale-98 shadow-2xs"
                  >
                    <div>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:underline">
                        {t.label}
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{t.note}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
