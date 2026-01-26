/* eslint-disable @typescript-eslint/no-unused-vars */
import { stateManager } from "./state.js";

interface DownloadRequest {
  url: string;
  method: string;
}

class Orchestrator {
  async startDownload(request: DownloadRequest): Promise<string> {
    const id = this.generateId();

    // Add download to state
    stateManager.addDownload(id, request.url, request.method);

    // Start the download process asynchronously
    this.processDownload(id, request.url, request.method);

    return id;
  }

  private async processDownload(
    id: string,
    _url: string,
    _method: string,
  ): Promise<void> {
    try {
      // Update status to downloading
      stateManager.updateDownloadStatus(id, "downloading", 0);

      // Simulate download progress (replace with actual download logic)
      for (let progress = 0; progress <= 100; progress += 10) {
        await this.simulateProgress();
        stateManager.updateDownloadStatus(id, "downloading", progress);
      }

      // Mark as completed
      stateManager.updateDownloadStatus(id, "completed");
    } catch (error) {
      // Mark as error
      stateManager.updateDownloadStatus(
        id,
        "error",
        undefined,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  private generateId(): string {
    return `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private simulateProgress(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export const orchestrator = new Orchestrator();
export type { DownloadRequest };
