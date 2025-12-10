'use client';

import { useState, useEffect } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function ArtistWidget({ onSelectionChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);

  useEffect(() => {
    // Es async para poder usar 'await' y esperar a que la API responda sin bloquear la ejecución
    const searchArtists = async () => {      
      const token = getAccessToken();
      
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?type=artist&q=${query}&limit=5`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.artists && data.artists.items) {
          setResults(data.artists.items);
        } else {
          setResults([]);
        }

      } catch (error) {
        console.error('Error buscando artistas:', error);
        setResults([]);
      }
    };
    
    // Debounce: Espera a que el usuario deje de escribir (500ms) antes de buscar.
    // Si escribe otra letra antes, 'clearTimeout' cancela la búsqueda anterior para no saturar la API.
    const timeoutId = setTimeout(searchArtists, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const toggleArtist = (artist) => {
    // Comprobar si ya está seleccionado
    const isSelected = selectedArtists.find(a => a.id === artist.id);
    let newSelection;
    
    if (isSelected) {
      // Si está, lo quitamos
      newSelection = selectedArtists.filter(a => a.id !== artist.id);
    } else {
      // Si no está, lo añadimos (máximo 5)
      if (selectedArtists.length >= 5) {
        alert('Máximo 5 artistas');
        return;
      }
      newSelection = [...selectedArtists, artist];
    }
    
    setSelectedArtists(newSelection);
    onSelectionChange(newSelection); 
    setQuery(''); // Limpiar buscador al seleccionar
    setResults([]); // Limpiar resultados
  };

  // Función para imágenes
  const getArtistImage = (artist) => {
    if(artist.images && artist.images.length > 0) {
      return artist.images[0].url;
    }
    return 'https://via.placeholder.com/50';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        Artistas
        <p className="text-xs font-normal text-gray-400 ml-auto">
          {selectedArtists.length}/5
        </p>
      </h3>
      
      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar artista..."
          className="w-full bg-black text-white p-3 rounded-lg border border-gray-700 focus:border-[#1DB954] outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

      </div>

      {/* Lista de Resultados*/}
      {results.length > 0 && (
        <div className="bg-gray-800 rounded-lg mb-4 overflow-hidden">
          {results.map(artist => (
            <div 
              key={artist.id}
              onClick={() => toggleArtist(artist)}
              className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <img 
                src={getArtistImage(artist)}
                alt={artist.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-white text-sm">{artist.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Artistas Seleccionados */}
      <div className="flex flex-wrap gap-2">
        {selectedArtists.map(artist => (
          <p 
            key={artist.id} 
            className="bg-[#1DB954] text-black font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-2"
          >
            {artist.name}
            <button 
              onClick={() => toggleArtist(artist)}
              className="hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}