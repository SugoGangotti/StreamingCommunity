// Hook per la ricerca di contenuti

import { useState, useCallback } from 'react';
import backendService from '../lib/backend-service';
import type { MediaItemType } from '../types/MediaItemType';
import type { SearchResponse } from '../types/api-types';

export interface UseSearchState {
  results: MediaItemType[];
  isLoading: boolean;
  error: string | null;
  query: string;
  hasSearched: boolean;
}

export interface UseSearchActions {
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  setQuery: (query: string) => void;
}

export const useSearch = (): UseSearchState & UseSearchActions => {
  const [state, setState] = useState<UseSearchState>({
    results: [],
    isLoading: false,
    error: null,
    query: '',
    hasSearched: false,
  });

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length === 0) {
      setState(prev => ({
        ...prev,
        error: 'Inserisci un termine di ricerca valido',
        results: [],
        hasSearched: false,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      query: query.trim(),
      hasSearched: true,
    }));

    try {
      const response: SearchResponse = await backendService.search(query);
      setState(prev => ({
        ...prev,
        results: response.results,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Errore durante la ricerca',
      }));
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({
      results: [],
      isLoading: false,
      error: null,
      query: '',
      hasSearched: false,
    });
  }, []);

  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  return {
    ...state,
    search,
    clearResults,
    setQuery,
  };
};
