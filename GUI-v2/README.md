# StreamingCommunity GUI

Un'applicazione React frontend con backend Django per la ricerca e download di contenuti streaming.

## 🚀 Avvio Rapido

### Prerequisiti

- Python 3.8+
- Node.js 16+
- pip per Python

### Installazione Completa

```bash
# Installa tutte le dipendenze (frontend + backend)
npm run install:all

# Configura il database Django
npm run backend:setup

# Avvia entrambi i servizi
npm run dev:full
```

### Avvio Separato

#### Backend Django (Porta 8000)

```bash
npm run backend:dev
```

#### Frontend React (Porta 5173)

```bash
npm run dev
```

## 📁 Struttura Progetto

```bash
GUI-v2/
├── backend/                 # Backend Django
│   ├── manage.py           # Entry point Django
│   ├── requirements.txt    # Dipendenze Python
│   ├── config.json         # Configurazione StreamingCommunity
│   ├── searchapp/          # App Django principale
│   └── webgui/             # Configurazione Django
├── src/                    # Frontend React
│   ├── components/         # Componenti React
│   ├── pages/             # Pagine React
│   ├── api/               # API calls
│   └── types/             # TypeScript types
├── package.json           # Dipendenze e script
└── vite.config.ts         # Configurazione Vite
```

## 🔧 API Endpoints

- `POST /api/search/` - Cerca contenuti
- `POST /api/download/` - Avvia download
- `GET /api/list/` - Lista watchlist
- `POST /api/remove-from-list/` - Rimuovi dalla lista
- `POST /api/series-metadata/` - Metadata serie

## 🎯 Funzionalità

- ✅ Ricerca contenuti multi-sito
- ✅ Download con selezione episodio per serie TV
- ✅ Gestione watchlist
- ✅ Autenticazione utenti
- ✅ UI moderna con Tailwind CSS
- ✅ API RESTful JSON

## 🛠 Script Disponibili

- `npm run dev` - Avvia frontend React
- `npm run backend:dev` - Avvia backend Django
- `npm run dev:full` - Avvia entrambi i servizi
- `npm run backend:setup` - Installa e migra database
- `npm run build` - Build frontend per produzione
