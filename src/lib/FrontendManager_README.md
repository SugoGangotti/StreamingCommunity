# Frontend Manager - Guida all'Uso

Il Frontend Manager è un sistema centralizzato per semplificare l'interazione tra il frontend React e il backend Node.js/Fastify.

## 📁 Struttura dei File

```
src/
├── lib/
│   ├── api-client.ts          # HTTP client configurato
│   ├── backend-service.ts     # Servizio backend astratto
│   └── FrontendManager_README.md # Questa documentazione
├── hooks/
│   ├── index.ts               # Esportazione centralizzata
│   ├── useBackend.ts          # Hook per stato backend
│   ├── useSearch.ts           # Hook per ricerca
│   └── useQueue.ts            # Hook per coda download
└── types/
    └── api-types.ts           # Tipi TypeScript per API
```

## 🚀 Come Usare

### 1. Setup Base

Importa gli hook necessari:

```tsx
import { useBackend, useSearch, useQueue } from '@/hooks';
```

### 2. Hook Principali

#### `useBackend()` - Stato Connessione Backend

```tsx
const { 
  isAvailable,     // boolean - backend raggiungibile?
  isLoading,       // boolean - controllo salute in corso
  error,          // string | null - errore di connessione
  health,         // HealthResponse | null - info backend
  checkHealth,    // () => Promise<void> - ricontrolla salute
  retryConnection // () => Promise<void> - riprova connessione
} = useBackend();
```

#### `useSearch()` - Ricerca Contenuti

```tsx
const {
  results,        // MediaItemType[] - risultati ricerca
  isLoading,      // boolean - ricerca in corso
  error,         // string | null - errore ricerca
  query,         // string - query corrente
  hasSearched,   // boolean - ha già cercato?
  search,        // (query: string) => Promise<void> - esegui ricerca
  clearResults,  // () => void - pulisci risultati
  setQuery       // (query: string) => void - imposta query
} = useSearch();
```

#### `useQueue()` - Gestione Coda Download

```tsx
const {
  downloads,       // QueueItemType[] - tutti i download
  activeDownloads, // QueueItemType[] - download attivi
  isLoading,       // boolean - caricamento stato
  error,          // string | null - errore
  totalDownloads, // number - totale download
  activeCount,    // number - download attivi
  refreshStatus,  // () => Promise<void> - aggiorna stato
  startDownload,  // (url: string, method: string) => Promise<void>
  retryRefresh    // () => Promise<void> - riprova refresh
} = useQueue(autoRefresh?, refreshInterval?);
```

## 📝 Esempi Pratici

### Pagina Download Completa

```tsx
import { useSearch, useBackend } from '@/hooks';

const DownloadPage = () => {
  const { isAvailable, error: backendError } = useBackend();
  const { results, isLoading, error, search } = useSearch();

  const handleSearch = (query: string) => {
    if (isAvailable) {
      search(query);
    }
  };

  if (!isAvailable) {
    return <div>Backend non disponibile: {backendError}</div>;
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <div>Caricamento...</div>}
      {error && <div>Errore: {error}</div>}
      {results.map(item => <MediaItem key={item.id} item={item} />)}
    </div>
  );
};
```

### Pagina Coda con Auto-Refresh

```tsx
import { useQueue } from '@/hooks';

const QueuePage = () => {
  const { downloads, isLoading, refreshStatus } = useQueue(true, 5000);

  return (
    <div>
      <button onClick={refreshStatus}>Aggiorna</button>
      {isLoading ? (
        <div>Caricamento coda...</div>
      ) : (
        downloads.map(item => <QueueItem key={item.id} item={item} />)
      )}
    </div>
  );
};
```

## 🔧 Configurazione

### URL Backend Personalizzato

```tsx
import { backendService } from '@/lib/backend-service';

// Imposta URL personalizzato
backendService.setBaseUrl('https://api.miosito.com');
```

### Auto-Refresh Coda

```tsx
// Auto-refresh ogni 3 secondi
const queue = useQueue(true, 3000);

// Disabilita auto-refresh
const queue = useQueue(false);
```

## 🎯 Vantaggi

1. **Semplicità**: Hook ready-to-use con loading/error states
2. **Type Safety**: TypeScript per autocompletamento e error checking
3. **Centralizzato**: Tutta la logica API in un posto
4. **Error Handling**: Gestione automatica errori con retry
5. **Performance**: Auto-refresh ottimizzato e caching
6. **Maintainable**: Facile da aggiornare e testare

## 🔄 Migrazione da Mockup

### Prima (con mockup):

```tsx
import { mediaItems } from '@/MOCKUP/searchData';

const Download = () => {
  const [items] = useState(mediaItems);
  // ... logica filtering locale
};
```

### Dopo (con Frontend Manager):

```tsx
import { useSearch } from '@/hooks';

const Download = () => {
  const { results, isLoading, error, search } = useSearch();
  // ... logica filtering su results reali
};
```

## 🛠️ Backend Endpoints Richiesti

Il Frontend Manager si aspetta questi endpoint:

- `GET /search?q=<query>` - Ricerca contenuti
- `POST /download` - Avvia download `{ url, method }`
- `GET /status` - Stato coda download
- `GET /health` - Salute server

## 🐛 Troubleshooting

### Backend Non Raggiungibile

```tsx
const { isAvailable, error, retryConnection } = useBackend();

if (!isAvailable) {
  return (
    <div>
      <p>Errore: {error}</p>
      <button onClick={retryConnection}>Riprova</button>
    </div>
  );
}
```

### Errori di Ricerca

```tsx
const { error, search } = useSearch();

const handleSearch = async (query) => {
  try {
    await search(query);
  } catch (err) {
    console.error('Search failed:', err);
  }
};
```

## 📋 TODO Backend

Per funzionalità complete, il backend avrà bisogno di:

1. **DELETE /download/:id** - Rimuovi download
2. **PUT /download/:id/pause** - Pausa download
3. **PUT /download/:id/resume** - Riprendi download
4. **PUT /queue/reorder** - Riordina coda
5. **WebSocket/SSE** - Real-time updates (opzionale)

---

## 🎉 Risultato Finale

Con il Frontend Manager hai:

- ✅ **Interazione semplificata** con il backend
- ✅ **Codice pulito e maintainable**
- ✅ **Type safety completo**
- ✅ **Error handling robusto**
- ✅ **Performance ottimizzata**

Basta chiamare API manualmente! Usa gli hook e concentrati sulla UI. 🚀
