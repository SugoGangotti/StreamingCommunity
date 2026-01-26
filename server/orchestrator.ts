import { spawn } from "child_process";
import path from "path";
import { stateManager } from "./state.js";

interface DownloadRequest {
  url: string;
  method: string;
}

interface DownloadResult {
  success: boolean;
  url: string;
  method: string;
  output_path?: string;
  result?: string;
  error?: string;
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
    url: string,
    method: string,
  ): Promise<void> {
    try {
      // Update status to downloading
      stateManager.updateDownloadStatus(id, "downloading", 0);

      // Execute Python download script
      const downloadResult = await this.executePythonDownload(url, method);

      if (downloadResult.success) {
        // Mark as completed
        stateManager.updateDownloadStatus(id, "completed");
        console.log(`Download completed: ${downloadResult.output_path}`);
      } else {
        // Mark as error
        stateManager.updateDownloadStatus(
          id,
          "error",
          undefined,
          downloadResult.error || "Unknown error",
        );
      }
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

  private executePythonDownload(
    url: string,
    method: string,
  ): Promise<DownloadResult> {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(
        process.cwd(),
        "core",
        "download_manager.py",
      );

      const pythonProcess = spawn("python", [
        pythonScript,
        url,
        method,
        `./downloads/${Date.now()}_${path.basename(url)}`,
      ]);

      let output = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${errorOutput}`));
          return;
        }

        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error}`));
        }
      });

      pythonProcess.on("error", (error) => {
        reject(new Error(`Failed to start Python process: ${error}`));
      });
    });
  }

  private generateId(): string {
    return `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const orchestrator = new Orchestrator();
export type { DownloadRequest };
