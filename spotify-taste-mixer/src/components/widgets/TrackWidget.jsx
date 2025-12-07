'use client';

import { useState, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function TrackWidget({ onSelectionChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  useEffect(() => {
    const searchTracks = async () => {      
      const token = getAccessToken();
      
      try {
        // Buscar canciones en la API
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (data.tracks && data.tracks.items) {
          setResults(data.tracks.items);
        } else {
          setResults([]);
        }

      } catch (error) {
        console.error('Error buscando canciones:', error);
        setResults([]);
      }
    };

    // Debounce: Espera a que el usuario deje de escribir (500ms) antes de buscar.
    // Si escribe otra letra antes, 'clearTimeout' cancela la búsqueda anterior para no saturar la API.
    const timeoutId = setTimeout(searchTracks, 500); 
    return () => clearTimeout(timeoutId);
  }, [query]);

  const toggleTrack = (track) => {
    const isSelected = selectedTracks.find(t => t.id === track.id);
    let newSelection;
    
    if (isSelected) {
      newSelection = selectedTracks.filter(t => t.id !== track.id);
    } else {
      if (selectedTracks.length >= 20) {
        alert('Máximo 20 canciones');
        return;
      }
      newSelection = [...selectedTracks, track];
    }
    
    setSelectedTracks(newSelection);
    onSelectionChange(newSelection);
    setQuery('');
    setResults([]);
  };

  // Función segura para imagen
  const getImage = (track) => {
    if (track.album && track.album.images && track.album.images.length > 0) {
      return track.album.images[0].url;
    }
    return 'https://via.placeholder.com/40';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Buscar canciones
        </h3>
        <span className="text-xs font-normal text-gray-400">
          {selectedTracks.length}/20
        </span>
      </div>
      
      {/* Buscador */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar canción..."
          className="w-full bg-black text-white p-3 rounded-lg border border-gray-700 focus:border-[#1DB954] outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Lista de Resultados */}
      {results.length > 0 && (
        <div className="bg-gray-800 rounded-lg mb-4 overflow-hidden">
          {results.map(track => (
            <div 
              key={track.id}
              onClick={() => toggleTrack(track)}
              className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <img 
                src={getImage(track)}
                alt={track.name} 
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">{track.name}</span>
                <span className="text-gray-400 text-xs">
                  {track.artists && track.artists[0].name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Canciones Seleccionadas */}
      <div className="flex flex-wrap gap-2">
        {selectedTracks.map(track => (
          <span 
            key={track.id} 
            className="bg-green-500 text-black font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-2"
          >
            {track.name}
            <button 
              onClick={() => toggleTrack(track)}
              className="hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}