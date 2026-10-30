function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

async function downloadImage(url, filename) {
  const res = await fetch(url)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}

function AnimeDetail({ anime, onClose }) {
  const title = anime.title.english || anime.title.romaji
  const description = stripHtml(anime.description)

  const handleSavePdf = () => {
    window.print()
  }

  const handleSaveImage = () => {
    const safeName = title.replace(/[^\w\-]+/g, '_')
    downloadImage(anime.coverImage.large, `${safeName}_cover.jpg`)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close no-print" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="anime-detail print-area">
          {anime.bannerImage && (
            <img className="detail-banner" src={anime.bannerImage} alt="" />
          )}

          <div className="detail-body">
            <img className="detail-cover" src={anime.coverImage.large} alt={title} />

            <div className="detail-info">
              <h2>{title}</h2>
              {anime.title.native && <p className="native-title">{anime.title.native}</p>}

              <div className="badges">
                {anime.format && <span className="badge">{anime.format}</span>}
                {anime.status && <span className="badge">{anime.status}</span>}
                {anime.episodes && <span className="badge">{anime.episodes} episodios</span>}
                {anime.averageScore && <span className="badge score">★ {anime.averageScore}</span>}
              </div>

              {anime.genres?.length > 0 && (
                <div className="genres">
                  {anime.genres.map((g) => (
                    <span key={g} className="genre-tag">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <p className="description">{description}</p>

              <div className="detail-actions no-print">
                <button onClick={handleSaveImage}>Guardar imagen</button>
                <button onClick={handleSavePdf}>Guardar como PDF</button>
                <a href={anime.siteUrl} target="_blank" rel="noreferrer">
                  Ver en AniList
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeDetail
