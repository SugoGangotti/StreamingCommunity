interface DownloadStatus {
  id: string;
  url: string;
  method: string;
  status: "pending" | "downloading" | "completed" | "error";
  progress?: number;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

class StateManager {
  private downloads: Map<string, DownloadStatus> = new Map();

  addDownload(id: string, url: string, method: string): void {
    this.downloads.set(id, {
      id,
      url,
      method,
      status: "pending",
      startTime: new Date(),
    });
  }

  updateDownloadStatus(
    id: string,
    status: DownloadStatus["status"],
    progress?: number,
    error?: string,
  ): void {
    const download = this.downloads.get(id);
    if (download) {
      download.status = status;
      if (progress !== undefined) download.progress = progress;
      if (error) download.error = error;
      if (status === "completed" || status === "error") {
        download.endTime = new Date();
      }
    }
  }

  getDownloadStatus(id: string): DownloadStatus | undefined {
    return this.downloads.get(id);
  }

  getAllDownloads(): DownloadStatus[] {
    return Array.from(this.downloads.values());
  }

  getActiveDownloads(): DownloadStatus[] {
    return this.getAllDownloads().filter(
      (d) => d.status === "pending" || d.status === "downloading",
    );
  }

  removeDownload(id: string): boolean {
    return this.downloads.delete(id);
  }
}

export const stateManager = new StateManager();
export type { DownloadStatus };
