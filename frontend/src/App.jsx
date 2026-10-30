import { useEffect, useState } from 'react'
import { getTrending, searchAnime } from './api/anilist'
import AnimeDetail from './components/AnimeDetail'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [animeList, setAnimeList] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTrending()
      .then(setAnimeList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (query.trim() === '') {
        setAnimeList(await getTrending())
      } else {
        setAnimeList(await searchAnime(query.trim()))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="site-header no-print">
        <h1>Anime Explorer</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar anime..."
          />
          <button type="submit">Buscar</button>
        </form>
      </header>

      {error && <p className="error no-print">{error}</p>}
      {loading && <p className="no-print">Cargando...</p>}

      <div className="grid no-print">
        {animeList.map((anime) => (
          <button
            key={anime.id}
            className="anime-card"
            onClick={() => setSelected(anime)}
            style={{ borderColor: anime.coverImage.color || '#444' }}
          >
            <img src={anime.coverImage.large} alt={anime.title.romaji} />
            <span className="card-title">{anime.title.english || anime.title.romaji}</span>
          </button>
        ))}
      </div>

      {selected && <AnimeDetail anime={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default App
