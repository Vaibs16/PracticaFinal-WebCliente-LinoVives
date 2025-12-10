'use client';

import { useState } from 'react';

export default function PopularityWidget({ onSelectionChange }) {
  const [selected, setSelected] = useState(null);

  const OPTIONS = [
    { 
      label: "Top Mundial", 
      range: [80, 100], 
      color: "border-purple-500 text-purple-400" 
    },
    { 
      label: "Hits Virales", 
      range: [55, 80], 
      color: "border-green-500 text-green-400" 
    },
    { 
      label: "Emergente", 
      range: [30, 55], 
      color: "border-yellow-500 text-yellow-400" 
    },
    { 
      label: "Underground", 
      range: [0, 30], 
      color: "border-blue-500 text-blue-400" 
    },
  ];

  const handleClick = (option) => {
    // Si pulsas el que ya está activo, se despulsa
    if (selected === option.label) {
      setSelected(null);
      onSelectionChange(null);
    } else {
      setSelected(option.label);
      onSelectionChange(option.range); // Se envia [min, max] al padre
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        Popularidad
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleClick(opt)}
            className={`
              p-3 rounded-lg text-sm font-bold transition-all border relative
              ${selected === opt.label 
                ? `${opt.color} shadow-md scale-105` 
                : 'border-transparent bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}
            `}
          >
            <p>{opt.label}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-center text-gray-500 h-4">
        {selected === "Top Mundial" && "Solo éxitos globales."}
        {selected === "Hits Virales" && "Canciones conocidas pero no quemadas."}
        {selected === "Emergente" && "Artistas subiendo."}
        {selected === "Underground" && "Joyas ocultas con pocas reproducciones."}
      </div>
    </div>
  );
}