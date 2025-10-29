export interface Photo {
  id: string;
  date: string; // ISO 8601 string
  caption: string;
  dataUrl: string; // base64 encoded image data
  // Fix: Added optional properties for filtering to resolve type errors in FilterPanel.tsx.
  contentType?: string;
  dominantColor?: string;
}

// Fix: Defined Filters interface to be used in SearchAndFilter and FilterPanel components.
export interface Filters {
  dateRange: { start: string; end: string };
  contentType: string;
  dominantColor: string;
}

export type Layout = 'dated-grid' | 'grid' | 'list';
