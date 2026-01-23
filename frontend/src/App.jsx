import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [libri, setLibri] = useState([])
  const [ricerca, setRicerca] = useState('')
  const [errore, setErrore] = useState('')
  const [formTitolo, setFormTitolo] = useState('')
  const [formAutore, setFormAutore] = useState('')
  const [formGenere, setFormGenere] = useState('Fantasy')

  const generi = [
    'Fantasy', 'Distopia', 'Romanzo', 'Mistero', 'Fantascienza',
    'Horror', 'Avventura', 'Storico', 'Biografia', 'Poesia'
  ]
  
  useEffect(() => {
    caricaLibriDalServer()
  }, [])

  function caricaLibriDalServer() {
    setErrore('')

    fetch('http://localhost:5000/api/libri')
      .then(risposta => risposta.json())
      .then(dati => {
        setLibri(dati)
      })
      .catch(err => {
        console.log('Errore', err)
        setErrore('Errore nel caricamento dei libri dal server')
      })
  }

  function generaLibri() {
    fetch('http://localhost:5000/api/libri/genera', {
      method: 'POST'
    })
      .then(risposta => {
        if (!risposta.ok) {
          throw new Error(`HTTP ${risposta.status}: ${risposta.statusText}`)
        }
        return risposta.json()
      })
      .then(nuoviLibri => {
        setLibri([...libri, ...nuoviLibri])
      })
      .catch(err => {
        console.error('Errore:', err)
        alert('Errore nella generazione dei libri: ' + err.message)
      })
  }

  function rimuoviLibro(id) {
    fetch(`http://localhost:5000/api/libri/${id}`, {
      method: 'DELETE'
    })
      .then(risposta => {
        if (!risposta.ok) {
          throw new Error(`HTTP ${risposta.status}`)
        }
        let libriAggiornati = libri.filter(libro => libro.id !== id)
        setLibri(libriAggiornati)
      })
      .catch(err => {
        console.error('Errore eliminazione:', err)
        alert('Errore nella eliminazione del libro')
      })
  }

  function eliminaTuttiLibri() {
    fetch('http://localhost:5000/api/libri', {
      method: 'DELETE'
    })
      .then(risposta => {
        if (!risposta.ok) {
          throw new Error(`HTTP ${risposta.status}`)
        }
        setLibri([])
      })
      .catch(err => {
        console.error('Errore eliminazione totale:', err)
        alert('Errore nella eliminazione dei libri')
      })
  }

  function aggiungiLibro() {
    if (!formTitolo.trim() || !formAutore.trim()) {
      alert('Titolo e Autore sono obbligatori')
      return
    }

    fetch('http://localhost:5000/api/libri', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titolo: formTitolo,
        autore: formAutore,
        genere: formGenere,
        anno: new Date().getFullYear()
      })
    })
      .then(risposta => {
        if (!risposta.ok) {
          throw new Error(`HTTP ${risposta.status}`)
        }
        return risposta.json()
      })
      .then(nuovoLibro => {
        setLibri([...libri, nuovoLibro])
        setFormTitolo('')
        setFormAutore('')
        setFormGenere('Fantasy')
      })
      .catch(err => {
        console.error('Errore aggiunta libro:', err)
        alert('Errore nell\'aggiunta del libro')
      })
  }

  function filtroLibri() {
    let libriFiltrati = libri.filter(libro => {
      let titolo_minuscolo = libro.titolo.toLowerCase()
      let autore_minuscolo = libro.autore.toLowerCase()
      let genere_minuscolo = libro.genere.toLowerCase()
      let ricerca_minuscolo = ricerca.toLowerCase()

      if (titolo_minuscolo.includes(ricerca_minuscolo)) {
        return true
      }
      if (autore_minuscolo.includes(ricerca_minuscolo)) {
        return true
      }
      if (genere_minuscolo.includes(ricerca_minuscolo)) {
        return true
      }

      return false
    })

    return libriFiltrati
  }

  let libriMostrati = filtroLibri()

  return (
    <div className="container">
      <h1>La Mia Libreria</h1>

      {errore && <div className="errore">{errore}</div>}

      <div className="form-section">
        <h2>Aggiungi un libro</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Titolo"
            value={formTitolo}
            onChange={(e) => setFormTitolo(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Autore"
            value={formAutore}
            onChange={(e) => setFormAutore(e.target.value)}
            className="form-input"
          />
          <select
            value={formGenere}
            onChange={(e) => setFormGenere(e.target.value)}
            className="form-select"
          >
            {generi.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <button onClick={aggiungiLibro} className="btn-aggiungi">
            Aggiungi
          </button>
        </div>
      </div>

      <div className="libri-section">
        <div className="sezione-titolo">
          <h2>I miei libri ({libriMostrati.length})</h2>
          <div className="btn-group">
            <button onClick={generaLibri} className="btn-genera">
              Genera
            </button>
            {libri.length > 0 && (
              <button onClick={eliminaTuttiLibri} className="btn-elimina-tutti">
                Rimuovi tutto
              </button>
            )}
          </div>
        </div>

        <div className="ricerca-section">
          <input
            type="text"
            placeholder="Cerca Libro per titolo, genere o autore"
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            className="input-ricerca"
          />
        </div>

        {libri.length === 0 && <p>Non hai ancora nessun libro</p>}

        {libri.length > 0 && libriMostrati.length === 0 && (
          <p>Nessun libro corrisponde alla ricerca</p>
        )}

        {libriMostrati.map((libro) => (
          <div key={libro.id} className="libro-card">
            <div className="libro-info">
              <h3>{libro.titolo}</h3>
              <p><strong>Autore:</strong> {libro.autore}</p>
              {libro.genere && <p><strong>Genere:</strong> {libro.genere}</p>}
              {libro.anno && <p><strong>Anno:</strong> {libro.anno}</p>}
            </div>
            
            <button 
              onClick={() => rimuoviLibro(libro.id)}
              className="btn-rimuovi"
            >
              Rimuovi
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
