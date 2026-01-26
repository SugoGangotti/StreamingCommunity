/* eslint-disable react-hooks/set-state-in-effect */
// Hook principale per interagire con il backend

import { useState, useEffect, useCallback } from "react";
import backendService from "../lib/backend-service";
import type { HealthResponse } from "../types/api-types";

export interface UseBackendState {
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
  health: HealthResponse | null;
}

export interface UseBackendActions {
  checkHealth: () => Promise<void>;
  retryConnection: () => Promise<void>;
}

export const useBackend = (): UseBackendState & UseBackendActions => {
  const [state, setState] = useState<UseBackendState>({
    isAvailable: false,
    isLoading: true,
    error: null,
    health: null,
  });

  const checkHealth = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const health = await backendService.healthCheck();
      setState({
        isAvailable: true,
        isLoading: false,
        error: null,
        health,
      });
    } catch (error) {
      setState({
        isAvailable: false,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore di connessione al backend",
        health: null,
      });
    }
  }, []);

  const retryConnection = useCallback(async () => {
    await checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    ...state,
    checkHealth,
    retryConnection,
  };
};
