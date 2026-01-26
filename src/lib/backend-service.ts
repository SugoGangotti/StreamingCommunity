// Servizio backend astratto per interagire con il backend

import apiClient from "./api-client";
import type {
  SearchResponse,
  DownloadResponse,
  StatusResponse,
  HealthResponse,
} from "../types/api-types";

class BackendService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  /**
   * Ricerca contenuti
   */
  async search(query: string): Promise<SearchResponse> {
    if (!query || query.trim().length === 0) {
      throw new Error("La query di ricerca non può essere vuota");
    }

    try {
      return await apiClient.get<SearchResponse>("/search", {
        q: query.trim(),
      });
    } catch (error) {
      throw new Error(
        `Errore durante la ricerca: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
      );
    }
  }

  /**
   * Avvia un download
   */
  async startDownload(url: string, method: string): Promise<DownloadResponse> {
    if (!url || !method) {
      throw new Error("URL e metodo sono obbligatori per avviare un download");
    }

    try {
      return await apiClient.post<DownloadResponse>("/download", {
        url,
        method,
      });
    } catch (error) {
      throw new Error(
        `Errore durante l'avvio del download: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
      );
    }
  }

  /**
   * Ottiene lo stato dei download
   */
  async getStatus(): Promise<StatusResponse> {
    try {
      return await apiClient.get<StatusResponse>("/status");
    } catch (error) {
      throw new Error(
        `Errore durante il recupero dello stato: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
      );
    }
  }

  /**
   * Controlla salute del server
   */
  async healthCheck(): Promise<HealthResponse> {
    try {
      return await apiClient.get<HealthResponse>("/health");
    } catch (error) {
      throw new Error(
        `Errore durante il health check: ${error instanceof Error ? error.message : "Errore sconosciuto"}`,
      );
    }
  }

  /**
   * Utility per verificare se il backend è raggiungibile
   */
  async isBackendAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Imposta l'URL base del backend (utile per configurazione dinamica)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Ottiene l'URL base corrente
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const backendService = new BackendService();
export default backendService;
