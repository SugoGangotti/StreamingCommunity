// Tipi per le API del backend

import type { MediaItemType } from "./MediaItemType";
import type { QueueItemType } from "./QueueItemType";

// Search API
export interface SearchRequest {
  q: string;
}

export interface SearchResponse {
  query: string;
  results: MediaItemType[];
  count: number;
}

// Download API
export interface DownloadRequest {
  url: string;
  method: string;
}

export interface DownloadResponse {
  message: string;
  downloadId: string;
  url: string;
  method: string;
}

// Status API
export interface StatusResponse {
  activeDownloads: number;
  totalDownloads: number;
  downloads: QueueItemType[];
  active: QueueItemType[];
}

// Health API
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

// Error types
export interface BackendError {
  error: string;
  code?: string;
  details?: unknown;
}
