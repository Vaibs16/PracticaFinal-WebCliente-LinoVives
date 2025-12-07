'use client';

import { useState } from 'react';

// Lista de algunos géneros 
const GENRES = [
  'pop', 'rock', 'hip-hop', 'latin', 'edm', 
  'indie', 'reggaeton', 'trap', 'r-n-b', 'k-pop', 
  'metal', 'jazz', 'classical', 'house', 
  'techno', 'punk', 'soul'
];

export default function GenreWidget({ onSelectionChange }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    let newSelection;
    
    // Si ya está seleccionado, lo quitamos
    if (selectedGenres.includes(genre)) {
      newSelection = selectedGenres.filter(a => a !== genre);
    } else {
      // Si no, lo añadimos (Límite de 3 para no saturar)
      if (selectedGenres.length >= 3) return; // Simplemente no deja añadir más
      newSelection = [...selectedGenres, genre];
    }
    
    setSelectedGenres(newSelection);
    // Avisamos al padre (Dashboard)
    onSelectionChange(newSelection);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Géneros
        </h3>
        <span className="text-xs font-normal text-gray-400">
          {selectedGenres.length}/3
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {GENRES.map(genre => {
          const isSelected = selectedGenres.includes(genre);
          const baseStyle = "px-4 py-2 rounded-full text-sm capitalize transition-colors";

          const colorStyle = isSelected
              ? "bg-green-500 text-black font-bold"        
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"; 

          const buttonClass = `${baseStyle} ${colorStyle}`;
          return (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={buttonClass}
            >
              {genre}
            </button>
          );
        })}
      </div>
      
      {selectedGenres.length === 3 && (
        <p className="text-xs text-yellow-500 mt-3 text-right animate-pulse">
          Máximo de géneros alcanzado
        </p>
      )}
    </div>
  );
}