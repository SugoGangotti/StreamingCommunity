// Hook per la gestione della coda dei download

import { useState, useEffect, useCallback } from 'react';
import backendService from '../lib/backend-service';
import type { QueueItemType } from '../types/QueueItemType';
import type { StatusResponse } from '../types/api-types';

export interface UseQueueState {
  downloads: QueueItemType[];
  activeDownloads: QueueItemType[];
  isLoading: boolean;
  error: string | null;
  totalDownloads: number;
  activeCount: number;
}

export interface UseQueueActions {
  refreshStatus: () => Promise<void>;
  startDownload: (url: string, method: string) => Promise<void>;
  retryRefresh: () => Promise<void>;
}

export const useQueue = (autoRefresh: boolean = true, refreshInterval: number = 5000): UseQueueState & UseQueueActions => {
  const [state, setState] = useState<UseQueueState>({
    downloads: [],
    activeDownloads: [],
    isLoading: false,
    error: null,
    totalDownloads: 0,
    activeCount: 0,
  });

  const refreshStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const status: StatusResponse = await backendService.getStatus();
      setState({
        downloads: status.downloads,
        activeDownloads: status.active,
        isLoading: false,
        error: null,
        totalDownloads: status.totalDownloads,
        activeCount: status.activeDownloads,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Errore durante il recupero dello stato',
      }));
    }
  }, []);

  const startDownload = useCallback(async (url: string, method: string) => {
    try {
      await backendService.startDownload(url, method);
      // Dopo aver avviato un download, aggiorna lo stato
      await refreshStatus();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Errore durante lavvio del download',
      }));
    }
  }, [refreshStatus]);

  const retryRefresh = useCallback(async () => {
    await refreshStatus();
  }, [refreshStatus]);

  // Auto-refresh se abilitato
  useEffect(() => {
    if (!autoRefresh) return;

    refreshStatus(); // Carica iniziale

    const interval = setInterval(() => {
      refreshStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshStatus]);

  return {
    ...state,
    refreshStatus,
    startDownload,
    retryRefresh,
  };
};
