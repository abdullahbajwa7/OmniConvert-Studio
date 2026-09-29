export type FormatCategory =
  | 'raster'
  | 'mobile_hdr'
  | 'vector'
  | 'layered_project'
  | 'camera_raw'
  | 'audio'
  | 'video'
  | 'document';

export type GoldenRuleNumber = 1 | 2 | 3 | 4 | 5 | 0;

export interface FormatMeta {
  extension: string;
  name: string;
  category: FormatCategory;
  categoryLabel: string;
  mimeType: string;
  description: string;
  romanUrduDescription: string;
  supportsAlpha: boolean;
  isLossy: boolean | 'both';
  maxBitDepth: number;
  recommendedTools: string[];
  goldenRule: GoldenRuleNumber;
}

export type ConversionStatus = 'idle' | 'analyzing' | 'converting' | 'completed' | 'error';

export interface ConversionOptions {
  quality: number; // 10 - 100
  dpi?: number; // 72, 150, 300, 600
  vectorizeMode?: 'bw' | 'color' | 'outline';
  resolutionPreset?: 'original' | '1080p' | '2k' | '4k';
  targetWidth?: number;
  targetHeight?: number;
  flattenLayers?: boolean;
}

export interface ConversionJob {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  detectedFormat: FormatMeta;
  targetFormat: string;
  status: ConversionStatus;
  progress: number;
  options: ConversionOptions;
  previewUrl?: string;
  dimensions?: { width: number; height: number };
  convertedBlob?: Blob;
  convertedSize?: number;
  convertedUrl?: string;
  convertedFileName?: string;
  errorMessage?: string;
  convertedAt?: Date;
  ruleExplanation?: {
    title: string;
    romanUrdu: string;
    english: string;
    warning?: string;
  };
}

export interface MatrixCellCompatibility {
  status: 'direct' | 'rasterize' | 'trace' | 'flatten' | 'impossible' | 'export_only';
  icon: string;
  label: string;
  notes: string;
  romanUrdu: string;
}
