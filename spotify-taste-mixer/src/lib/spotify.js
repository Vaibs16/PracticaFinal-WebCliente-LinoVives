import { getAccessToken } from './auth';

export async function generatePlaylist(preferences) {
  const { artists, genres, decades = [], popularity, tracks = [], audioFeatures, limit } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  let searchGenres = [...genres];
  if (audioFeatures) {
    if (audioFeatures.target_energy > 70) {
      searchGenres.push('edm', 'party');
    } 
    else if (audioFeatures.target_energy < 40) {
      searchGenres.push('chill', 'ambient');
    }
    if (audioFeatures.target_valence > 70) {
      searchGenres.push('happy', 'pop');
    } 
    else if (audioFeatures.target_valence < 30) {
      searchGenres.push('sad', 'piano');
    }
    if (audioFeatures.target_danceability > 70) {
      searchGenres.push('dance', 'reggaeton');
    }
    else if (audioFeatures.target_danceability < 30) {
      searchGenres.push('classical', 'opera');
    }
    if (audioFeatures.target_acousticness > 70) {
      searchGenres.push('acoustic', 'country');
    }
    else if (audioFeatures.target_acousticness < 30) {
      searchGenres.push('techno', 'electro');
    }
  }

  const finalGenresToSearch = [...new Set(searchGenres)].slice(0, 10);
  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    allTracks.push(...data.tracks);
  }

  // 2. Buscar por géneros
  for (const genre of finalGenresToSearch) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    allTracks.push(...data.tracks.items);
  }

  // 3. Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // Añadir canciones seleccionadas manualmente por el usaurio

  if (tracks.length > 0) {
    allTracks.push(...tracks);
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 200 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 200);

  // Desordenar resultado de manera random para que no de todo el rato las mismas
  // Restar 0.5 genera negativos y positivos al azar (50/50), haciendo que el sort baraje la lista.
  uniqueTracks.sort(() => Math.random() - 0.5);
  return uniqueTracks;
}