import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [libri, setLibri] = useState([])
  const [ricerca, setRicerca] = useState('')
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  // ===== USEEFFECT: CARICA I DATI ALL'AVVIO DELL'APP =====
  
  // useEffect si esegue quando la pagina si carica
  useEffect(() => {
    caricaLibriDalServer()
  }, [])

  function caricaLibriDalServer() {
    setCaricamento(true)
    setErrore('')

    fetch('http://localhost:5000/api/libri')
      .then(risposta => risposta.json())
      .then(dati => {
        setLibri(dati)
        setCaricamento(false)
      })
      .catch(err => {
        console.log('Errore nel caricamento:', err)
        setErrore('Errore nel caricamento dei libri dal server')
        setCaricamento(false)
      })
  }

  function rimuoviLibro(id) {
    fetch(`http://localhost:5000/api/libri/${id}`, {
      method: 'DELETE'
    })
      .then(risposta => risposta.json())
      .then(() => {
        let libriAggiornati = libri.filter(libro => libro.id !== id)
        setLibri(libriAggiornati)
      })
      .catch(err => {
        console.log('Errore:', err)
        alert('Errore nel eliminazione del libro')
      })
  }

  function filtroLibri() {
    let libriFiltraci = libri.filter(libro => {
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

    return libriFiltraci
  }

  let libriMostrati = filtroLibri()

  return (
    <div className="container">
      <h1>La Mia Libreria</h1>

      {errore && <div className="errore">{errore}</div>}

      <div className="libri-section">
        <div className="sezione-titolo">
          <h2>I miei libri ({libriMostrati.length})</h2>
        </div>

        <div className="ricerca-section">
          <input
            type="text"
            placeholder="Cerca per titolo, autore o genere..."
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            className="input-ricerca"
          />
        </div>

        {caricamento && <p>Caricamento...</p>}

        {!caricamento && libri.length === 0 && <p>Non hai ancora nessun libro</p>}

        {!caricamento && libri.length > 0 && libriMostrati.length === 0 && (
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
