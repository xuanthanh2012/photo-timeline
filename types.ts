
export interface Photo {
  id: string;
  date: string; // ISO 8601 string
  caption: string;
  dataUrl: string; // base64 encoded image data
}
