# Progetto-Libreria
## Introduzione

**Progetto-Libreria** è un'applicazione web per la gestione di una libreria personale. Consente agli utenti di:

- **Visualizzare** una collezione di libri
- **Aggiungere** nuovi libri manualmente compilando un semplice form
- **Generare** libri casualmente in modo massivo (10 libri alla volta)
- **Cercare** libri per titolo, autore o genere
- **Eliminare** singoli libri o l'intera collezione
- **Persistenza dei dati** - i dati vengono salvati nel backend

L'applicazione utilizza un'architettura **client-server** con frontend React e backend Flask, comunicando tramite API REST con CORS abilitato.

---

## Architettura

```
┌──────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│           http://localhost:3000                      │
│  - Interfaccia utente interattiva                   │
│  - Gestione stato con useState/useEffect            │
│  - Comunicazione via fetch API                       │
└──────────────────────────────────────────────────────┘
                          ↕
                    API REST / CORS
                          ↕
┌──────────────────────────────────────────────────────┐
│                 Backend (Flask)                      │
│           http://localhost:5000                      │
│  - Endpoints REST per CRUD libri                    │
│  - Generazione dati con Faker                       │
│  - Gestione persistenza in memoria                  │
└──────────────────────────────────────────────────────┘
```

---

## Frontend (React)

### Cartella: `/frontend`

**Stack tecnologico:**
- React 19
- Vite (build tool)
- CSS puro per lo styling

### Funzionalità Principale

1. **Caricamento libri al mount**
   - Al caricamento della pagina, il componente App fa fetch dei libri dal backend
   - I libri vengono visualizzati in ordine decrescente (ultimi inseriti in alto)

2. **Form di Inserimento**
   - Tre campi di input: Titolo, Autore, Genere (select dropdown)
   - Validazione: Titolo e Autore sono obbligatori
   - POST a `/api/libri` con i dati compilati
   - Reset form dopo aggiunta riuscita

3. **Generazione Casuale**
   - Pulsante "Genera" invia POST a `/api/libri/genera`
   - Il backend genera 10 libri con dati fittizi
   - I nuovi libri vengono aggiunti alla lista locale

4. **Ricerca**
   - Input di ricerca filtra in tempo reale
   - Ricerca su titolo, autore e genere (case-insensitive)

5. **Eliminazione**
   - Pulsante "Rimuovi" per ogni libro → DELETE `/api/libri/<id>`
   - Pulsante "Rimuovi tutto" → DELETE `/api/libri`
   - Aggiornamento sincronizzato con il backend

### File Principali

- `src/App.jsx` - Componente principale con tutta la logica
- `src/App.css` - Styling dell'interfaccia
- `src/main.jsx` - Entry point React
- `index.html` - Template HTML

---

## Backend (Flask)

### Cartella: `/Backend`

**Stack tecnologico:**
- Python 3
- Flask (web framework)
- flask_cors (CORS support)
- Faker (generazione dati casuali)

### Endpoints API

#### `GET /api/libri`
Restituisce la lista di tutti i libri.
```
Response: 200 OK
[
  {
    "id": 1,
    "titolo": "...",
    "autore": "...",
    "genere": "...",
    "anno": 2024
  },
  ...
]
```

#### `POST /api/libri`
Aggiunge un nuovo libro alla libreria.
```
Request Body:
{
  "titolo": "Titolo del libro",
  "autore": "Nome Autore",
  "genere": "Fantasy",
  "anno": 2024
}

Response: 201 Created
{
  "id": 21,
  "titolo": "...",
  "autore": "...",
  "genere": "...",
  "anno": 2024
}
```

#### `POST /api/libri/genera`
Genera 10 libri casuali e li aggiunge alla libreria.
```
Response: 201 Created
[
  { "id": 21, "titolo": "...", "autore": "...", "genere": "...", "anno": ... },
  { "id": 22, "titolo": "...", "autore": "...", "genere": "...", "anno": ... },
  ...
]
```

#### `DELETE /api/libri/<id>`
Elimina un libro specifico.
```
Response: 200 OK
{
  "messaggio": "Libro eliminato"
}
```

#### `DELETE /api/libri`
Elimina tutti i libri.
```
Response: 200 OK
{
  "messaggio": "Tutti i libri sono stati eliminati"
}
```

### Gestione Dati

- **Variabile globale `libri`**: Lista in memoria che contiene tutti i libri
- **Variabile `prossimo_id`**: Contatore auto-incrementale per gli ID
- **Generatore Faker**: Crea dati realistici in italiano (nomi, titoli, generi)
- **Generi fissi**: 10 generi predefiniti (Fantasy, Distopia, Romanzo, etc.)

### Avvio Backend

```bash
cd Backend
python main.py
```
Il server parte su `http://localhost:5000`

---

## Installazione e Avvio

### Backend

```bash
cd Backend
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Il frontend sarà disponibile su `http://localhost:5173` (porta default Vite)

---

## Flusso Operativo

1. **Avvio Backend**: Flask server ascolta su `localhost:5000`
2. **Avvio Frontend**: React dev server su `localhost:5173` (o porta disponibile)
3. **Caricamento app**: 20 libri vengono generati al startup del backend
4. **Interazione utente**:
   - Immettere un libro manualmente nel form
   - Fare clic su "Genera" per aggiungere 10 libri casuali
   - Cercare libri nella barra di ricerca
   - Rimuovere singoli libri o tutti contemporaneamente
5. **Persistenza**: Tutti i dati rimangono memorizzati nel backend finché il server è in esecuzione

---

## Versione Control

Repository GitHub: [https://github.com/PietroGadaldi/Progetto-Libreria](https://github.com/PietroGadaldi/Progetto-Libreria)

Branching:
- `main` - Versione stabile
- `DEV` - Versione in sviluppo

---

## Note Tecniche

- **CORS**: Abilitato su Flask per consentire richieste dal frontend
- **Gestione ID**: Gli ID vengono assegnati sequenzialmente, incrementando un contatore
- **Validazione**: Il backend valida i campi obbligatori (titolo e autore)
- **Data locale**: I dati sono memorizzati in memoria e perduti al riavvio del server