// Stored in localStorage, contains only serializable data
export interface MediaItemMetadata {
  id: string;
  date: string;
  caption: string;
  type: 'image' | 'video';
}

// Used in the app's state, includes a runtime-generated URL for rendering
export interface MediaItem extends MediaItemMetadata {
  objectURL: string;
}

export interface Filters {
  dateRange: { start: string; end: string };
}

export type Layout = 'dated-grid' | 'grid' | 'list';
