# StreamingCommunity GUI

Un'applicazione React frontend con backend Django per la ricerca e download di contenuti streaming.

## 🚀 Avvio Rapido

### Prerequisiti
- Python 3.8+
- Node.js 16+
- pip per Python

### Installazione Completa

1. **Installa dipendenze:**
   ```bash
   # Installa Node.js dependencies
   npm install

   # Installa Python dependencies
   cd backend && pip install -r requirements.txt && cd ..
   ```

2. **Configura database:**
   ```bash
   cd backend && python manage.py migrate && cd ..
   ```

3. **Avvia servizi:**
   ```bash
   # Avvia entrambi i servizi (consigliato)
   npm run dev:full

   # Oppure avvia separatamente:
   npm run backend:dev  # Django su http://localhost:8000
   npm run dev          # React su http://localhost:5173
   ```

### Script di Avvio Rapido (Windows)
```cmd
start.bat install    # Installa tutto
start.bat setup      # Configura database
start.bat dev        # Avvia entrambi i servizi
```

## 📁 Struttura Progetto

```
GUI-v2/
├── backend/                 # Backend Django API
│   ├── manage.py           # Entry point Django
│   ├── requirements.txt    # Dipendenze Python
│   ├── config.json         # Configurazione StreamingCommunity
│   ├── searchapp/          # App Django principale
│   │   ├── views.py        # API views con supporto JSON
│   │   ├── urls.py         # URL patterns
│   │   ├── forms.py        # Django forms
│   │   └── models.py       # Database models
│   └── webgui/             # Configurazione Django + CORS
├── src/                    # Frontend React
│   ├── components/         # Componenti React
│   ├── pages/             # Pagine React
│   ├── api/               # API calls al backend
│   └── types/             # TypeScript types
├── package.json           # Dipendenze e script Node.js
├── vite.config.ts         # Configurazione Vite con proxy API
└── start.bat             # Script di avvio Windows
```

## 🔧 API Endpoints

Tutti gli endpoint supportano sia form che JSON:

- `POST /api/search/` - Cerca contenuti
- `POST /api/download/` - Avvia download
- `GET /api/list/` - Lista watchlist
- `POST /api/remove-from-list/` - Rimuovi dalla lista
- `POST /api/series-metadata/` - Metadata serie

## 🎯 Funzionalità

- ✅ **Ricerca contenuti** multi-sito (AnimeUnity, StreamingCommunity)
- ✅ **Download con selezione episodio** per serie TV
- ✅ **Gestione watchlist** con aggiunta/rimozione
- ✅ **Autenticazione utenti** con sessioni
- ✅ **UI moderna** con Tailwind CSS
- ✅ **API RESTful** con supporto JSON
- ✅ **CORS configurato** per sviluppo locale
- ✅ **Proxy Vite** per sviluppo semplificato

## 🛠 Script Disponibili

### Frontend (React)
- `npm run dev` - Avvia frontend React (porta 5173)
- `npm run build` - Build per produzione
- `npm run preview` - Preview build locale

### Backend (Django)
- `npm run backend:install` - Installa dipendenze Python
- `npm run backend:migrate` - Esegue migrazioni database
- `npm run backend:dev` - Avvia Django (porta 8000)
- `npm run backend:setup` - Setup completo backend

### Full Stack
- `npm run install:all` - Installa tutto (frontend + backend)
- `npm run dev:full` - Avvia entrambi i servizi
- `start.bat dev` - Script Windows per avvio completo

## 🌐 URL di Sviluppo

- **Frontend React:** http://localhost:5173
- **Backend Django:** http://localhost:8000
- **API:** http://localhost:8000/api/*

## 🔒 Configurazione

- **Database:** SQLite (file: `backend/db.sqlite3`)
- **Configurazione:** `backend/config.json`
- **Utenti:** Admin/admin, Test/tester
- **CORS:** Configurato per localhost:5173

## 📝 Note

- Il backend supporta sia template HTML che risposte JSON
- Il frontend usa proxy Vite per le chiamate API in sviluppo
- Database e configurazioni sono preservate nella migrazione
- CORS è configurato per lo sviluppo locale

---

**✨ Il progetto è ora completamente unificato con frontend React e backend Django in un'unica codebase!**
