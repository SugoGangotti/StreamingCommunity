# StreamingCommunity Server API

Un server Fastify in TypeScript per gestire ricerche e download di contenuti multimediali.

## Avvio del Server

### Development (TypeScript)
```bash
npm run server:ts
```

### Production (dopo compilazione)
```bash
npm run server
```

Il server si avvia sulla porta 3001 (o sulla porta specificata nella variabile d'ambiente `PORT`).

## Endpoint API

### GET /search?q=...

Esegue una ricerca utilizzando gli script nella cartella `core`.

**Query Parameters:**
- `q` (string, required): Termine di ricerca

**Response:**
```json
{
  "query": "test",
  "results": [
    {
      "title": "Example result for \"test\"",
      "url": "https://example.com/video1",
      "source": "Example Source",
      "quality": "1080p",
      "size": "1.2GB"
    }
  ],
  "count": 1
}
```

**Esempio:**
```bash
curl "http://localhost:3001/search?q=film"
```

### POST /download

Avvia un nuovo download passando l'URL e il metodo all'orchestratore.

**Request Body:**
```json
{
  "url": "https://example.com/video",
  "method": "direct"
}
```

**Response:**
```json
{
  "message": "Download started",
  "downloadId": "download_1640995200000_abc123def",
  "url": "https://example.com/video",
  "method": "direct"
}
```

**Esempio:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/video","method":"direct"}' \
  http://localhost:3001/download
```

### GET /status

Restituisce lo stato di tutti i download attivi e completati dalla memoria (RAM).

**Response:**
```json
{
  "activeDownloads": 1,
  "totalDownloads": 3,
  "downloads": [
    {
      "id": "download_1640995200000_abc123def",
      "url": "https://example.com/video",
      "method": "direct",
      "status": "downloading",
      "progress": 45,
      "startTime": "2023-12-31T23:00:00.000Z",
      "endTime": null
    }
  ],
  "active": [
    {
      "id": "download_1640995200000_abc123def",
      "status": "downloading"
    }
  ]
}
```

**Stati possibili:**
- `pending`: In attesa di iniziare
- `downloading`: In download
- `completed`: Completato con successo
- `error`: Errore durante il download

### GET /health

Endpoint di health check per verificare che il server sia operativo.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2023-12-31T23:00:00.000Z",
  "uptime": 3600.123
}
```

## Struttura del Progetto

```
server/
├── index.ts          # Server Fastify principale
├── orchestrator.ts    # Gestore dei download
├── state.ts          # Gestore dello stato in memoria
└── README.md         # Documentazione

core/
└── search.ts         # Funzioni di ricerca (da implementare)
```

## Sviluppo

### Aggiungere nuove funzioni di ricerca

1. Crea nuovi script nella cartella `core/`
2. Importali nel server (`server/index.ts`)
3. Utilizzali nell'endpoint `/search`

### Estendere l'orchestratore

Modifica `server/orchestrator.ts` per implementare la logica di download reale al posto della simulazione attuale.

### Gestione dello stato

Lo stato dei download è mantenuto in RAM tramite la classe `StateManager` in `server/state.ts`. I download persi al riavvio del server.

## Variabili d'Ambiente

- `PORT`: Porta del server (default: 3001)
- `HOST`: Host del server (default: 0.0.0.0)
