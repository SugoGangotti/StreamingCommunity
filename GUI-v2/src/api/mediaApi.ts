import { MediaItem } from "../types/MediaItem";

// API Base URL - uses Vite proxy in development, direct URL in production
const API_BASE_URL = "/api";

export interface SearchRequest {
  site: string;
  query: string;
}

export interface DownloadRequest {
  source_alias: string;
  item_payload: string;
  season?: string;
  episode?: string;
}

export interface RemoveFromListRequest {
  source_alias: string;
  item_payload: string;
}

// Search for media items
export async function searchMedia(request: SearchRequest): Promise<MediaItem[]> {
  try {
    const formData = new FormData();
    formData.append("site", request.site);
    formData.append("query", request.query);

    const response = await fetch(`${API_BASE_URL}/search/`, {
      method: "POST",
      body: formData,
      credentials: "include", // Include cookies for session management
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

// Start download
export async function startDownload(request: DownloadRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const formData = new FormData();
    formData.append("source_alias", request.source_alias);
    formData.append("item_payload", request.item_payload);

    if (request.season) formData.append("season", request.season);
    if (request.episode) formData.append("episode", request.episode);

    const response = await fetch(`${API_BASE_URL}/download/`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Download failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Download error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Remove from list
export async function removeFromList(request: RemoveFromListRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const formData = new FormData();
    formData.append("source_alias", request.source_alias);
    formData.append("item_payload", request.item_payload);

    const response = await fetch(`${API_BASE_URL}/remove-from-list/`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Remove failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Remove from list error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Get watchlist
export async function getWatchlist(): Promise<MediaItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/list/`, {
      method: "GET",
      credentials: "include",
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Watchlist fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.watchlist || [];
  } catch (error) {
    console.error("Watchlist fetch error:", error);
    return [];
  }
}
