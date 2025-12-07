"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import { generatePlaylist } from "@/lib/spotify";

// Importamos los componentes
import ArtistWidget from "@/components/widgets/ArtistWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay"; 
import GenreWidget from "@/components/widgets/GenreWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget"

export default function Dashboard() {
  const router = useRouter();
  
  // Estado que almacena las opciones elegidas por el usuario en los widgets para poder generar la playlist
  const [preferences, setPreferences] = useState({
    artists: [],
    genres: [], 
    tracks: [],
    decades: [],
    limit: 20
  });

  const [playlist, setPlaylist] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState([]);

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

  // Recibe la lista de artistas desde el widget hijo y actualiza el estado de preferencias manteniendo el resto de datos.
  const handleArtistSelection = (selectedArtists) => {
    setPreferences((prev) => ({ ...prev, artists: selectedArtists }));
  };

  const handleGenreSelection = (selectedGenres) => {
    setPreferences((prev) => ({ ...prev, genres: selectedGenres 
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
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Spotify <span className="text-[#1DB954]">Mixer</span>
        </h1>
        <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">
          Cerrar Sesión
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Widgets */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4 text-gray-200">Configura tus gustos</h2>
            <div className="grid grid-cols-1 gap-6">
              <ArtistWidget onSelectionChange={handleArtistSelection} />
              <GenreWidget onSelectionChange={handleGenreSelection} />
              <TrackWidget onSelectionChange={handleTrackSelection} />
              <DecadeWidget onSelectionChange={handleDecadeSelection} />
            </div>
          </section>
        </div>

        {/* Playlist Generada */}
        <div>
          <PlaylistDisplay 
            playlist={playlist}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            disabled={preferences.artists.length === 0 && preferences.genres.length === 0 && preferences.tracks.length === 0 && preferences.decades.length === 0}
            onRemoveTrack={handleRemoveTrack}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
            onAddMore={handleAddMore}
          />
        </div>

      </div>
    </div>
  );
}