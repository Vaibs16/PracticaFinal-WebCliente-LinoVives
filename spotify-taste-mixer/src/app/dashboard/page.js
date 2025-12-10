"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import { generatePlaylist } from "@/lib/spotify";

// componentes y widgets
import ArtistWidget from "@/components/widgets/ArtistWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay"; 
import GenreWidget from "@/components/widgets/GenreWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget"
import ResetFiltersButton from "@/components/ResetFiltersButton";
import Header from "@/components/Header";
import Favorites from "@/components/Favorites";
import TrackModal from "@/components/TrackModal";
import MoodWidget from "@/components/widgets/MoodWidget";

export default function Dashboard() {
  const router = useRouter();
  
  // Estado que almacena las opciones elegidas por el usuario en los widgets para poder generar la playlist
  const [preferences, setPreferences] = useState({
    artists: [],
    genres: [], 
    tracks: [],
    decades: [],
    audioFeatures: null,
    limit: 20
  });
  const [resetKey, setResetKey] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home');
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Si el usuario no está autenticado (no tiene token), lo redirige a la página de login.
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem('favorite_tracks') || '[]');
    setFavorites(savedFavs);
  }, []);

  // Función para abrir el modal
  const handleTrackClick = (track) => {
    setSelectedTrack(track);
  };

// Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedTrack(null);
  };

  // Para el boton de limpiar filtros
  const handleResetFilter = () => {
    setPreferences({
      artists: [],
      genres: [], 
      tracks: [],
      decades: [],
      audioFeatures: null,
      limit: 20
    });
    setResetKey(prev => prev + 1); 
  };

  // Para el boton de limpial playlist
  const handleResetPlaylist = () => {
    setPlaylist([]);
  }

  // Recibe la lista de artistas desde el widget hijo y actualiza el estado de preferencias manteniendo el resto de datos.
  const handleArtistSelection = (selectedArtists) => {
    setPreferences((prev) => ({ ...prev, artists: selectedArtists }));
  };

  const handleGenreSelection = (selectedGenres) => {
    setPreferences((prev) => ({ ...prev, genres: selectedGenres 
    }));
  };

  const handleMoodChange = (features) => {
      const featuresFinal = {
      target_energy: features.energy,           
      target_valence: features.valence,         
      target_danceability: features.danceability, 
      target_acousticness: features.acousticness}
    setPreferences((prev) => ({ 
      ...prev, 
      audioFeatures: featuresFinal 
    }));
  };

  // Activa el estado de carga, llama a la función que conecta con Spotify y guarda las canciones resultantes.
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const tracks = await generatePlaylist(preferences);
      setPlaylist(tracks);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error generando la playlist. Verifica tu conexión.");
      setIsGenerating(false);
    }
  };
  // Seleccionar canciones
  const handleTrackSelection = (selectedTracks) => {
    setPreferences((prev) => ({ 
      ...prev, 
      tracks: selectedTracks 
    }));
  };

  const handleAddMore = async () => {
    setIsGenerating(true);
    try {
      const newTracks = await generatePlaylist(preferences);
      // Filtramos para no añadir canciones que ya estén en la lista
      const uniqueNewTracks = newTracks.filter(
        newTrack => !playlist.some(existing => existing.id === newTrack.id)
      );
      setPlaylist(prev => [...prev, ...uniqueNewTracks]);
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  }
  
  const handleDecadeSelection = (selectedDecades) => {
    setPreferences((prev) => ({ 
      ...prev, 
      decades: selectedDecades 
    }));
  };

  const toggleFavorite = (track) => {
    const isFav = favorites.some(f => f.id === track.id);
    let newFavs;

    if (isFav) {
      newFavs = favorites.filter(f => f.id !== track.id);
    } else {
      newFavs = [...favorites, track];
    }

    setFavorites(newFavs);
    localStorage.setItem('favorite_tracks', JSON.stringify(newFavs));
  };

  // Función para eliminar una canción de la lista (se pasa al hijo)
  const handleRemoveTrack = (trackId) => {
    setPlaylist((a) => a.filter(track => track.id !== trackId));
  };

  // Cerrar sesion
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="h-screen bg-black text-white p-6 font-sans overflow-hidden flex flex-col">
      <div className="p-6 pb-0 flex-none">
        <Header view={view} setView={setView} favoritesCount={favorites.length} onLogout={handleLogout} />
      </div>

      {view === "home" ? (
      <div className="flex-1 min-h-0 p-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          
          {/* Widgets*/}
          <div className="lg:col-span-2 h-full overflow-y-auto pr-2 custom-scrollbar">
            <section>
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-black z-10 py-3">
                <h2 className="text-xl font-bold text-gray-200 sticky">Configura tus gustos</h2>
                {/* Botón borrar filtros */}
                <ResetFiltersButton onReset={handleResetFilter} />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Uso la prop key con resetKey. 
                Cuando resetKey cambia, React detecta que es un componente distinto, 
                destruye el viejo y crea uno nuevo limpio (borrando los botones verdes).
                */}
                <ArtistWidget key={`artist-${resetKey}`} onSelectionChange={handleArtistSelection} />
                <GenreWidget key={`genre-${resetKey}`} onSelectionChange={handleGenreSelection} />
                <TrackWidget key={`track-${resetKey}`} onSelectionChange={handleTrackSelection} />
                <DecadeWidget key={`decade-${resetKey}`} onSelectionChange={handleDecadeSelection} />
                <MoodWidget key={`mood-${resetKey}`} onMoodChange={handleMoodChange} />
              </div>
            </section>
          </div>

          {/* Playlist Generada */}
          <div className="h-full overflow-hidden">
            <PlaylistDisplay 
              playlist={playlist}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={preferences.artists.length === 0 && preferences.genres.length === 0 && preferences.tracks.length === 0 && preferences.decades.length === 0 && !preferences.audioFeatures}
              onRemoveTrack={handleRemoveTrack}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
              onAddMore={handleAddMore}
              onClear={handleResetPlaylist} 
              onTrackClick={handleTrackClick}
            />
          </div>
        </div>
      </div>

      ) : (

        <Favorites 
          className="flex-1 overflow-y-auto p-6"
          favorites={favorites} 
          onToggleFavorite={toggleFavorite} 
          onTrackClick={handleTrackClick}
        />
      
      )}

      {selectedTrack && (
        <TrackModal track={selectedTrack} onClose={handleCloseModal} />
      )}
    </div>
  );
}