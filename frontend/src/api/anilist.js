const ENDPOINT = 'https://graphql.anilist.co'

const MEDIA_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    large
    color
  }
  bannerImage
  description(asHtml: false)
  genres
  averageScore
  episodes
  format
  status
  season
  seasonYear
  siteUrl
`

async function query(gqlQuery, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: gqlQuery, variables }),
  })
  const json = await res.json()
  if (!res.ok || json.errors) {
    const message = json.errors?.[0]?.message || 'Error consultando AniList'
    throw new Error(message)
  }
  return json.data
}

export async function getTrending() {
  const q = `
    query {
      Page(perPage: 18) {
        media(sort: TRENDING_DESC, type: ANIME) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `
  const data = await query(q)
  return data.Page.media
}

export async function searchAnime(search) {
  const q = `
    query ($search: String) {
      Page(perPage: 20) {
        media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `
  const data = await query(q, { search })
  return data.Page.media
}

export async function getAnimeById(id) {
  const q = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_FIELDS}
      }
    }
  `
  const data = await query(q, { id })
  return data.Media
}
